"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationService = exports.ConsultationService = void 0;
const emailService_1 = require("./emailService");
const refGenerator_1 = require("../utils/refGenerator");
const db_1 = __importDefault(require("../config/db"));
const sanitizer_1 = require("../utils/sanitizer");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ConsultationService {
    async createConsultation(data, uploadedFiles, clientIp) {
        const refId = (0, refGenerator_1.generateReferenceNumber)();
        const movedFilesList = [];
        try {
            // Target date directories YYYY/MM/LAW-XXXXXX
            const today = new Date();
            const yyyy = String(today.getFullYear());
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const relativeFolder = `storage/uploads/${yyyy}/${mm}/${refId}`;
            const absoluteFolder = path_1.default.join(__dirname, '../../../', relativeFolder);
            // Ensure destination exists
            if (uploadedFiles.length > 0 && !fs_1.default.existsSync(absoluteFolder)) {
                fs_1.default.mkdirSync(absoluteFolder, { recursive: true });
            }
            // Move files from temp uploads to permanent storage uploads
            for (const file of uploadedFiles) {
                const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
                const targetDest = path_1.default.join(absoluteFolder, sanitizedOriginalName);
                const dbRelativePath = `${relativeFolder}/${sanitizedOriginalName}`;
                let finalDest = targetDest;
                let finalDbPath = dbRelativePath;
                let counter = 1;
                const ext = path_1.default.extname(sanitizedOriginalName);
                const base = path_1.default.basename(sanitizedOriginalName, ext);
                while (fs_1.default.existsSync(finalDest)) {
                    const uniqueName = `${base}_${counter}${ext}`;
                    finalDest = path_1.default.join(absoluteFolder, uniqueName);
                    finalDbPath = `${relativeFolder}/${uniqueName}`;
                    counter++;
                }
                // Move from backend/uploads to storage/uploads
                fs_1.default.renameSync(file.path, finalDest);
                movedFilesList.push({
                    destPath: finalDest,
                    dbPath: finalDbPath,
                    fileName: path_1.default.basename(finalDest),
                    size: file.size,
                    mime: file.mimetype
                });
            }
            // Commit transaction
            const consultation = await db_1.default.$transaction(async (tx) => {
                const c = await tx.consultation.create({
                    data: {
                        referenceNumber: refId,
                        fullName: (0, sanitizer_1.sanitizeInput)(data.fullName),
                        phone: data.phone,
                        email: data.email || null,
                        company: data.company ? (0, sanitizer_1.sanitizeInput)(data.company) : null,
                        service: data.service ? (0, sanitizer_1.sanitizeInput)(data.service) : null,
                        message: (0, sanitizer_1.sanitizeInput)(data.message),
                        language: data.language,
                        theme: data.theme,
                        priority: data.priority,
                        ipAddress: data.ipAddress || clientIp,
                        browser: data.browser ? (0, sanitizer_1.sanitizeInput)(data.browser) : null,
                        device: data.device ? (0, sanitizer_1.sanitizeInput)(data.device) : null,
                        screenResolution: data.screenResolution ? (0, sanitizer_1.sanitizeInput)(data.screenResolution) : null,
                        timezone: data.timezone ? (0, sanitizer_1.sanitizeInput)(data.timezone) : null,
                        pageUrl: data.pageUrl ? (0, sanitizer_1.sanitizeInput)(data.pageUrl) : null,
                        referrer: data.referrer ? (0, sanitizer_1.sanitizeInput)(data.referrer) : null,
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
                        titleAr: `طلب استشارة جديد: ${(0, sanitizer_1.sanitizeInput)(data.fullName)}`,
                        titleEn: `New Consultation Request: ${(0, sanitizer_1.sanitizeInput)(data.fullName)}`,
                        messageAr: `تم تقديم طلب استشارة جديد برقم المرجع: ${refId}`,
                        messageEn: `A new consultation has been submitted with reference ID: ${refId}`,
                        type: 'new_consultation'
                    }
                });
                return c;
            });
            // Asynchronously dispatch notifications (non-blocking)
            (0, emailService_1.sendConsultationAlert)(consultation, movedFilesList).catch(emailErr => {
                console.error("Nodemailer alert dispatch failed:", emailErr);
            });
            if (consultation.email) {
                (0, emailService_1.sendClientConfirmation)(consultation).catch(emailErr => {
                    console.error("Nodemailer client confirmation dispatch failed:", emailErr);
                });
            }
            return consultation;
        }
        catch (err) {
            // Transaction Rollback cleanup on filesystem on fail
            movedFilesList.forEach(f => {
                if (fs_1.default.existsSync(f.destPath)) {
                    fs_1.default.unlinkSync(f.destPath);
                }
            });
            throw err;
        }
    }
}
exports.ConsultationService = ConsultationService;
exports.consultationService = new ConsultationService();
