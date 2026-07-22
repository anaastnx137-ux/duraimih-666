import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { consultationService } from '../services/consultation.service';
import { consultationRepository } from '../repositories/consultation.repository';
import { socketService } from '../services/socket.service';
import { AuthenticatedRequest } from '../middlewares/auth';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AppError } from '../middlewares/error.middleware';
import { sanitizeInput } from '../utils/sanitizer';
import fs from 'fs';
import path from 'path';

/**
 * Enterprise consultations endpoint handlers (under 300 lines)
 */
export const submitConsultation = async (req: Request, res: Response, next: NextFunction) => {
    const uploadedFiles = (req.files as Express.Multer.File[]) || [];
    try {
        const consultation = await consultationService.createConsultation(
            req.body,
            uploadedFiles,
            req.ip || ''
        );

        // Emit real-time dashboard notification
        socketService.broadcastNotification({
            titleAr: `طلب استشارة جديد: ${consultation.fullName}`,
            titleEn: `New Consultation: ${consultation.fullName}`,
            messageAr: `تم تقديم طلب استشارة برقم المرجع: ${consultation.referenceNumber}`,
            messageEn: `A new consultation has been submitted with reference: ${consultation.referenceNumber}`,
            type: 'new_consultation'
        });

        return res.status(201).json({
            success: true,
            referenceNumber: consultation.referenceNumber,
            message: 'Consultation request submitted successfully.'
        });

    } catch (e) {
        // Purge raw files from temp storage on exception
        uploadedFiles.forEach(file => {
            if (fs.existsSync(file.path)) {
                fs.unlinkSync(file.path);
            }
        });
        next(e);
    }
};

export const updateConsultation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return next(new AppError(401, 'UNAUTHORIZED', 'Authentication required.'));
        }

        const id = parseInt(req.params.id);
        const data = req.body;

        const existing = await consultationRepository.findUnique({ where: { id } });
        if (!existing) {
            return next(new AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }

        // Run transaction update
        const updated = await prisma.$transaction(async (tx: any) => {
            const c = await tx.consultation.update({
                where: { id },
                data: {
                    status: data.status,
                    priority: data.priority !== undefined ? data.priority : undefined,
                    assignedUserId: data.assignedUserId !== undefined ? data.assignedUserId : undefined,
                    notes: data.notes !== undefined ? data.notes : undefined
                }
            });

            // Status auditing logs
            if (existing.status !== data.status) {
                await tx.statusHistory.create({
                    data: {
                        consultationId: c.id,
                        status: data.status,
                        notes: data.notes || `Status changed from ${existing.status} to ${data.status}`,
                        updatedBy: req.user?.email || 'Admin Staff'
                    }
                });
            }

            // Write detailed audit logs
            await auditLogRepository.logAdminAction(
                req.user?.id || null,
                'UPDATE_CONSULTATION',
                req.ip || null,
                req.headers['user-agent'] || null,
                JSON.stringify({ status: existing.status, priority: existing.priority, notes: existing.notes }),
                JSON.stringify({ status: c.status, priority: c.priority, notes: c.notes }),
                `Updated consultation ID: ${id}`
            );

            return c;
        });

        return res.json({
            success: true,
            consultation: updated
        });

    } catch (e) {
        next(e);
    }
};

export const getConsultations = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { status, priority, search, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const whereClause: any = {};
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;

        if (search) {
            whereClause.OR = [
                { referenceNumber: { contains: search as string } },
                { fullName: { contains: search as string } },
                { phone: { contains: search as string } },
                { email: { contains: search as string } },
                { company: { contains: search as string } },
                { message: { contains: search as string } }
            ];
        }

        const [consultations, total] = await Promise.all([
            prisma.consultation.findMany({
                where: whereClause,
                include: {
                    files: true,
                    assignedUser: { select: { id: true, fullName: true, email: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum
            }),
            prisma.consultation.count({ where: whereClause })
        ]);

        return res.json({
            success: true,
            consultations,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });

    } catch (e) {
        next(e);
    }
};

export const getConsultationById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const consultation = await consultationRepository.getConsultationWithFiles(id);

        if (!consultation) {
            return next(new AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }

        return res.json({
            success: true,
            consultation
        });

    } catch (e) {
        next(e);
    }
};

export const syncOfflineConsultation = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { referenceId, fullName, phone, service, message, language, priority } = req.body;
        const safeFullName = sanitizeInput(fullName);
        const safeService = service ? sanitizeInput(service) : null;
        const safeMessage = sanitizeInput(message);

        const existing = await consultationRepository.findByRef(referenceId);
        if (existing) {
            return res.json({ success: true, referenceNumber: referenceId, message: 'Already synced.' });
        }

        const consultation = await prisma.consultation.create({
            data: {
                referenceNumber: referenceId,
                fullName: safeFullName,
                phone,
                service: safeService,
                message: safeMessage,
                language,
                priority,
                status: 'New'
            }
        });

        await prisma.statusHistory.create({
            data: {
                consultationId: consultation.id,
                status: 'New',
                notes: 'Consultation synced from client offline queue.',
                updatedBy: 'Client Offline Queue Sync'
            }
        });

        // Emit real-time notification alert
        socketService.broadcastNotification({
            titleAr: `طلب استشارة متزامن: ${safeFullName}`,
            titleEn: `Synced Offline Consultation: ${safeFullName}`,
            messageAr: `تمت مزامنة طلب استشارة جديد برقم المرجع: ${referenceId}`,
            messageEn: `A synced offline consultation has been added with reference: ${referenceId}`,
            type: 'new_consultation'
        });

        return res.status(201).json({
            success: true,
            referenceNumber: consultation.referenceNumber
        });

    } catch (e) {
        next(e);
    }
};

export const deleteConsultation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await prisma.consultation.findUnique({ where: { id } });
        if (!existing) {
            return next(new AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }

        // Delete associated files from disk if they exist
        const files = await prisma.consultationFile.findMany({ where: { consultationId: id } });
        for (const file of files) {
            const absolutePath = path.join(__dirname, '../../../', file.filePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
            }
        }

        await prisma.consultation.delete({ where: { id } });

        // Log action
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_CONSULTATION',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify({ id: existing.id, referenceNumber: existing.referenceNumber }),
            undefined,
            `Deleted consultation ID: ${id} (${existing.referenceNumber})`
        );

        return res.json({
            success: true,
            message: 'Consultation deleted successfully.'
        });
    } catch (e) {
        next(e);
    }
};
