import { consultationRepository } from '../repositories/consultation.repository';
import { sendConsultationAlert, sendClientConfirmation } from './emailService';
import { generateReferenceNumber } from '../utils/refGenerator';
import prisma from '../config/db';
import { sanitizeInput } from '../utils/sanitizer';
import path from 'path';
import fs from 'fs';

export class ConsultationService {
    async createConsultation(data: any, uploadedFiles: Express.Multer.File[], clientIp: string) {
        const refId = generateReferenceNumber();
        const movedFilesList: { destPath: string; dbPath: string; fileName: string; size: number; mime: string }[] = [];

        try {
            // Target date directories YYYY/MM/LAW-XXXXXX
            const today = new Date();
            const yyyy = String(today.getFullYear());
            const mm = String(today.getMonth() + 1).padStart(2, '0');

            const relativeFolder = `storage/uploads/${yyyy}/${mm}/${refId}`;
            const absoluteFolder = path.join(__dirname, '../../../', relativeFolder);

            // Ensure destination exists
            if (uploadedFiles.length > 0 && !fs.existsSync(absoluteFolder)) {
                fs.mkdirSync(absoluteFolder, { recursive: true });
            }

            // Move files from temp uploads to permanent storage uploads
            for (const file of uploadedFiles) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
                const targetDest = path.join(absoluteFolder, sanitizedOriginalName);
                const dbRelativePath = `${relativeFolder}/${sanitizedOriginalName}`;

                let finalDest = targetDest;
                let finalDbPath = dbRelativePath;
                let counter = 1;
                const ext = path.extname(sanitizedOriginalName);
                const base = path.basename(sanitizedOriginalName, ext);

                while (fs.existsSync(finalDest)) {
                    const uniqueName = `${base}_${counter}${ext}`;
                    finalDest = path.join(absoluteFolder, uniqueName);
                    finalDbPath = `${relativeFolder}/${uniqueName}`;
                    counter++;
                }

                // Move from backend/uploads to storage/uploads
                fs.renameSync(file.path, finalDest);
                movedFilesList.push({
                    destPath: finalDest,
                    dbPath: finalDbPath,
                    fileName: path.basename(finalDest),
                    size: file.size,
                    mime: file.mimetype
                });
            }

            // Commit transaction
            const consultation = await prisma.$transaction(async (tx: any) => {
                const c = await tx.consultation.create({
                    data: {
                        referenceNumber: refId,
                        fullName: sanitizeInput(data.fullName),
                        phone: data.phone,
                        email: data.email || null,
                        company: data.company ? sanitizeInput(data.company) : null,
                        service: data.service ? sanitizeInput(data.service) : null,
                        message: sanitizeInput(data.message),
                        language: data.language,
                        theme: data.theme,
                        priority: data.priority,
                        ipAddress: data.ipAddress || clientIp,
                        browser: data.browser ? sanitizeInput(data.browser) : null,
                        device: data.device ? sanitizeInput(data.device) : null,
                        screenResolution: data.screenResolution ? sanitizeInput(data.screenResolution) : null,
                        timezone: data.timezone ? sanitizeInput(data.timezone) : null,
                        pageUrl: data.pageUrl ? sanitizeInput(data.pageUrl) : null,
                        referrer: data.referrer ? sanitizeInput(data.referrer) : null,
                        status: 'New'
                    }
                });

                // Attach files link records
                for (const f of movedFilesList) {
                    await tx.consultationFile.create({
                        data: {
                            consultationId: c.id,
                            fileName: f.fileName,
                            filePath: f.dbPath,
                            fileSize: f.size,
                            mimeType: f.mime
                        }
                    });
                }

                // Add status audit trace
                await tx.statusHistory.create({
                    data: {
                        consultationId: c.id,
                        status: 'New',
                        notes: 'Consultation request submitted online by user.',
                        updatedBy: 'Client Application'
                    }
                });

                // Trigger alerts
                await tx.notification.create({
                    data: {
                        titleAr: `طلب استشارة جديد: ${sanitizeInput(data.fullName)}`,
                        titleEn: `New Consultation Request: ${sanitizeInput(data.fullName)}`,
                        messageAr: `تم تقديم طلب استشارة جديد برقم المرجع: ${refId}`,
                        messageEn: `A new consultation has been submitted with reference ID: ${refId}`,
                        type: 'new_consultation'
                    }
                });

                return c;
            });

            // Asynchronously dispatch notifications (non-blocking)
            sendConsultationAlert(consultation, movedFilesList).catch(emailErr => {
                console.error("Nodemailer alert dispatch failed:", emailErr);
            });
            if (consultation.email) {
                sendClientConfirmation(consultation).catch(emailErr => {
                    console.error("Nodemailer client confirmation dispatch failed:", emailErr);
                });
            }

            return consultation;

        } catch (err) {
            // Transaction Rollback cleanup on filesystem on fail
            movedFilesList.forEach(f => {
                if (fs.existsSync(f.destPath)) {
                    fs.unlinkSync(f.destPath);
                }
            });
            throw err;
        }
    }
}
export const consultationService = new ConsultationService();
