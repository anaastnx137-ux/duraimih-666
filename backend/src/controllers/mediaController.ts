import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';
import { mediaService } from '../services/media.service';
import { imageService } from '../services/image.service';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AppError } from '../middlewares/error.middleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const tempUploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}

// Multer temporary storage mapping
const tempStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempUploadDir);
    },
    filename: (req, file, cb) => {
        const unique = crypto.randomBytes(16).toString('hex');
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `temp_media_${unique}${ext}`);
    }
});

const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

export const multerMedia = multer({
    storage: tempStorage,
    fileFilter: (req, file, cb) => {
        if (!allowedMimes.includes(file.mimetype)) {
            return cb(new Error('Invalid image file type. Only JPG, PNG, WebP, GIF, and SVG are whitelisted.'));
        }
        cb(null, true);
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
}).single('file');

/**
 * GET /api/admin/media
 */
export const getMediaFiles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const files = await mediaService.getMediaFilesList();
        return res.json({
            success: true,
            files
        });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/media
 */
export const uploadMediaFile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    multerMedia(req, res, async (err) => {
        if (err) {
            return next(new AppError(400, 'UPLOAD_ERROR', err.message));
        }

        if (!req.file) {
            return next(new AppError(400, 'VALIDATION_ERROR', 'No file was uploaded.'));
        }

        const tempFilePath = req.file.path;
        try {
            const uuid = crypto.randomBytes(8).toString('hex');
            const cleanOriginalName = path.basename(req.file.originalname, path.extname(req.file.originalname))
                .replace(/[^a-zA-Z0-9.-]/g, '_');
            const baseName = `${Date.now()}_${uuid}_${cleanOriginalName}`;

            const targetDir = path.join(__dirname, '../../../storage/blog');
            
            // Optimize image using sharp service (saves optimized webp + thumbnail webp)
            const { optimizedRelPath, thumbnailRelPath } = await imageService.optimizeImage(
                tempFilePath,
                targetDir,
                baseName
            );

            // Clean up temporary file
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }

            // Write logs
            const fileName = `${baseName}.webp`;
            await auditLogRepository.logAdminAction(
                req.user?.id || null,
                'UPLOAD_MEDIA',
                req.ip || null,
                req.headers['user-agent'] || null,
                undefined,
                undefined,
                `Uploaded media asset: ${fileName}`
            );

            return res.status(201).json({
                success: true,
                file: {
                    name: fileName,
                    url: `/${optimizedRelPath}`,
                    thumbnailUrl: `/${thumbnailRelPath}`
                }
            });

        } catch (e) {
            // Clean up temporary uploads file on exception
            if (fs.existsSync(tempFilePath)) {
                fs.unlinkSync(tempFilePath);
            }
            next(e);
        }
    });
};

/**
 * DELETE /api/admin/media/:fileName
 */
export const deleteMediaFile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { fileName } = req.params;
        const targetDir = path.join(__dirname, '../../../storage/blog');
        const targetPath = path.join(targetDir, fileName);

        // Directory traversal security check
        const resolvedPath = path.resolve(targetPath);
        const resolvedDir = path.resolve(targetDir);
        if (path.dirname(resolvedPath) !== resolvedDir || path.basename(fileName) !== fileName) {
            return next(new AppError(400, 'SECURITY_ERROR', 'Directory traversal block triggered.'));
        }

        if (!fs.existsSync(resolvedPath)) {
            return next(new AppError(404, 'NOT_FOUND', 'File does not exist.'));
        }

        // Usage audit check prior to deletion
        const usage = await mediaService.checkFileUsage(fileName);
        if (usage.inUse) {
            return next(
                new AppError(
                    400,
                    'CONFLICT',
                    `لا يمكن حذف هذا الملف لأنه مستخدم في: ${usage.references.join(', ')}`
                )
            );
        }

        // Delete primary file
        fs.unlinkSync(resolvedPath);

        // Delete thumbnail if it exists
        const ext = path.extname(fileName);
        const base = path.basename(fileName, ext);
        const thumbPath = path.join(targetDir, `${base}_thumb${ext}`);
        if (fs.existsSync(thumbPath)) {
            fs.unlinkSync(thumbPath);
        }

        // Log admin delete action
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_MEDIA',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            undefined,
            `Deleted media asset: ${fileName}`
        );

        return res.json({
            success: true,
            message: 'Media file deleted successfully.'
        });

    } catch (e) {
        next(e);
    }
};
