"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteConsultation = exports.syncOfflineConsultation = exports.getConsultationById = exports.getConsultations = exports.updateConsultation = exports.submitConsultation = void 0;
const db_1 = __importDefault(require("../config/db"));
const consultation_service_1 = require("../services/consultation.service");
const consultation_repository_1 = require("../repositories/consultation.repository");
const socket_service_1 = require("../services/socket.service");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const sanitizer_1 = require("../utils/sanitizer");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * Enterprise consultations endpoint handlers (under 300 lines)
 */
const submitConsultation = async (req, res, next) => {
    const uploadedFiles = req.files || [];
    try {
        const consultation = await consultation_service_1.consultationService.createConsultation(req.body, uploadedFiles, req.ip || '');
        // Emit real-time dashboard notification
        socket_service_1.socketService.broadcastNotification({
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
    }
    catch (e) {
        // Purge raw files from temp storage on exception
        uploadedFiles.forEach(file => {
            if (fs_1.default.existsSync(file.path)) {
                fs_1.default.unlinkSync(file.path);
            }
        });
        next(e);
    }
};
exports.submitConsultation = submitConsultation;
const updateConsultation = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(new error_middleware_1.AppError(401, 'UNAUTHORIZED', 'Authentication required.'));
        }
        const id = parseInt(req.params.id);
        const data = req.body;
        const existing = await consultation_repository_1.consultationRepository.findUnique({ where: { id } });
        if (!existing) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }
        // Run transaction update
        const updated = await db_1.default.$transaction(async (tx) => {
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
            await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_CONSULTATION', req.ip || null, req.headers['user-agent'] || null, JSON.stringify({ status: existing.status, priority: existing.priority, notes: existing.notes }), JSON.stringify({ status: c.status, priority: c.priority, notes: c.notes }), `Updated consultation ID: ${id}`);
            return c;
        });
        return res.json({
            success: true,
            consultation: updated
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateConsultation = updateConsultation;
const getConsultations = async (req, res, next) => {
    try {
        const { status, priority, search, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const whereClause = {};
        if (status)
            whereClause.status = status;
        if (priority)
            whereClause.priority = priority;
        if (search) {
            whereClause.OR = [
                { referenceNumber: { contains: search } },
                { fullName: { contains: search } },
                { phone: { contains: search } },
                { email: { contains: search } },
                { company: { contains: search } },
                { message: { contains: search } }
            ];
        }
        const [consultations, total] = await Promise.all([
            db_1.default.consultation.findMany({
                where: whereClause,
                include: {
                    files: true,
                    assignedUser: { select: { id: true, fullName: true, email: true } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum
            }),
            db_1.default.consultation.count({ where: whereClause })
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
    }
    catch (e) {
        next(e);
    }
};
exports.getConsultations = getConsultations;
const getConsultationById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const consultation = await consultation_repository_1.consultationRepository.getConsultationWithFiles(id);
        if (!consultation) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }
        return res.json({
            success: true,
            consultation
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getConsultationById = getConsultationById;
const syncOfflineConsultation = async (req, res, next) => {
    try {
        const { referenceId, fullName, phone, service, message, language, priority } = req.body;
        const safeFullName = (0, sanitizer_1.sanitizeInput)(fullName);
        const safeService = service ? (0, sanitizer_1.sanitizeInput)(service) : null;
        const safeMessage = (0, sanitizer_1.sanitizeInput)(message);
        const existing = await consultation_repository_1.consultationRepository.findByRef(referenceId);
        if (existing) {
            return res.json({ success: true, referenceNumber: referenceId, message: 'Already synced.' });
        }
        const consultation = await db_1.default.consultation.create({
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
        await db_1.default.statusHistory.create({
            data: {
                consultationId: consultation.id,
                status: 'New',
                notes: 'Consultation synced from client offline queue.',
                updatedBy: 'Client Offline Queue Sync'
            }
        });
        // Emit real-time notification alert
        socket_service_1.socketService.broadcastNotification({
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
    }
    catch (e) {
        next(e);
    }
};
exports.syncOfflineConsultation = syncOfflineConsultation;
const deleteConsultation = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const existing = await db_1.default.consultation.findUnique({ where: { id } });
        if (!existing) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Consultation record not found.'));
        }
        // Delete associated files from disk if they exist
        const files = await db_1.default.consultationFile.findMany({ where: { consultationId: id } });
        for (const file of files) {
            const absolutePath = path_1.default.join(__dirname, '../../../', file.filePath);
            if (fs_1.default.existsSync(absolutePath)) {
                fs_1.default.unlinkSync(absolutePath);
            }
        }
        await db_1.default.consultation.delete({ where: { id } });
        // Log action
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_CONSULTATION', req.ip || null, req.headers['user-agent'] || null, JSON.stringify({ id: existing.id, referenceNumber: existing.referenceNumber }), undefined, `Deleted consultation ID: ${id} (${existing.referenceNumber})`);
        return res.json({
            success: true,
            message: 'Consultation deleted successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteConsultation = deleteConsultation;
