"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMediaFile = exports.uploadMediaFile = exports.getMediaFiles = exports.multerMedia = void 0;
const media_service_1 = require("../services/media.service");
const image_service_1 = require("../services/image.service");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const tempUploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(tempUploadDir)) {
    fs_1.default.mkdirSync(tempUploadDir, { recursive: true });
}
// Multer temporary storage mapping
const tempStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempUploadDir);
    },
    filename: (req, file, cb) => {
        const unique = crypto_1.default.randomBytes(16).toString('hex');
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        cb(null, `temp_media_${unique}${ext}`);
    }
});
const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
exports.multerMedia = (0, multer_1.default)({
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
const getMediaFiles = async (req, res, next) => {
    try {
        const files = await media_service_1.mediaService.getMediaFilesList();
        return res.json({
            success: true,
            files
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getMediaFiles = getMediaFiles;
/**
 * POST /api/admin/media
 */
const uploadMediaFile = async (req, res, next) => {
    (0, exports.multerMedia)(req, res, async (err) => {
        if (err) {
            return next(new error_middleware_1.AppError(400, 'UPLOAD_ERROR', err.message));
        }
        if (!req.file) {
            return next(new error_middleware_1.AppError(400, 'VALIDATION_ERROR', 'No file was uploaded.'));
        }
        const tempFilePath = req.file.path;
        try {
            const uuid = crypto_1.default.randomBytes(8).toString('hex');
            const cleanOriginalName = path_1.default.basename(req.file.originalname, path_1.default.extname(req.file.originalname))
                .replace(/[^a-zA-Z0-9.-]/g, '_');
            const baseName = `${Date.now()}_${uuid}_${cleanOriginalName}`;
            const targetDir = path_1.default.join(__dirname, '../../../storage/blog');
            // Optimize image using sharp service (saves optimized webp + thumbnail webp)
            const { optimizedRelPath, thumbnailRelPath } = await image_service_1.imageService.optimizeImage(tempFilePath, targetDir, baseName);
            // Clean up temporary file
            if (fs_1.default.existsSync(tempFilePath)) {
                fs_1.default.unlinkSync(tempFilePath);
            }
            // Write logs
            const fileName = `${baseName}.webp`;
            await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPLOAD_MEDIA', req.ip || null, req.headers['user-agent'] || null, undefined, undefined, `Uploaded media asset: ${fileName}`);
            return res.status(201).json({
                success: true,
                file: {
                    name: fileName,
                    url: `/${optimizedRelPath}`,
                    thumbnailUrl: `/${thumbnailRelPath}`
                }
            });
        }
        catch (e) {
            // Clean up temporary uploads file on exception
            if (fs_1.default.existsSync(tempFilePath)) {
                fs_1.default.unlinkSync(tempFilePath);
            }
            next(e);
        }
    });
};
exports.uploadMediaFile = uploadMediaFile;
/**
 * DELETE /api/admin/media/:fileName
 */
const deleteMediaFile = async (req, res, next) => {
    try {
        const { fileName } = req.params;
        const targetDir = path_1.default.join(__dirname, '../../../storage/blog');
        const targetPath = path_1.default.join(targetDir, fileName);
        // Directory traversal security check
        const resolvedPath = path_1.default.resolve(targetPath);
        const resolvedDir = path_1.default.resolve(targetDir);
        if (path_1.default.dirname(resolvedPath) !== resolvedDir || path_1.default.basename(fileName) !== fileName) {
            return next(new error_middleware_1.AppError(400, 'SECURITY_ERROR', 'Directory traversal block triggered.'));
        }
        if (!fs_1.default.existsSync(resolvedPath)) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'File does not exist.'));
        }
        // Usage audit check prior to deletion
        const usage = await media_service_1.mediaService.checkFileUsage(fileName);
        if (usage.inUse) {
            return next(new error_middleware_1.AppError(400, 'CONFLICT', `لا يمكن حذف هذا الملف لأنه مستخدم في: ${usage.references.join(', ')}`));
        }
        // Delete primary file
        fs_1.default.unlinkSync(resolvedPath);
        // Delete thumbnail if it exists
        const ext = path_1.default.extname(fileName);
        const base = path_1.default.basename(fileName, ext);
        const thumbPath = path_1.default.join(targetDir, `${base}_thumb${ext}`);
        if (fs_1.default.existsSync(thumbPath)) {
            fs_1.default.unlinkSync(thumbPath);
        }
        // Log admin delete action
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_MEDIA', req.ip || null, req.headers['user-agent'] || null, undefined, undefined, `Deleted media asset: ${fileName}`);
        return res.json({
            success: true,
            message: 'Media file deleted successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteMediaFile = deleteMediaFile;
