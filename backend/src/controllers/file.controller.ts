import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import prisma from '../config/db';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AppError } from '../middlewares/error.middleware';
import path from 'path';
import fs from 'fs';

/**
 * Enterprise secure file streaming download controller
 * GET /api/files/:id
 */
export const getSecureFile = async (
    req: AuthenticatedRequest,
    res: Response,
    next: any
) => {
    try {
        const fileId = parseInt(req.params.id);
        if (isNaN(fileId)) {
            return next(new AppError(400, 'VALIDATION_ERROR', 'رقم المستند غير صحيح. Invalid file ID.'));
        }

        const file = await prisma.consultationFile.findUnique({
            where: { id: fileId }
        });

        if (!file) {
            return next(new AppError(404, 'NOT_FOUND', 'المستند المطلوبة غير موجودة. File not found.'));
        }

        // Get absolute file path
        const absolutePath = path.join(__dirname, '../../../', file.filePath);
        if (!fs.existsSync(absolutePath)) {
            return next(new AppError(404, 'NOT_FOUND', 'الملف الفعلي غير موجود على الخادم. Raw file does not exist.'));
        }

        // Log audit event
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DOWNLOAD_FILE',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            undefined,
            `Downloaded file: ${file.fileName} from consultation id: ${file.consultationId}`
        );

        // Stream file response
        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
        
        const fileStream = fs.createReadStream(absolutePath);
        fileStream.pipe(res);

    } catch (e: any) {
        next(e);
    }
};
