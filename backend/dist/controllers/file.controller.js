"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecureFile = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
/**
 * Enterprise secure file streaming download controller
 * GET /api/files/:id
 */
const getSecureFile = async (req, res, next) => {
    try {
        const fileId = parseInt(req.params.id);
        if (isNaN(fileId)) {
            return next(new error_middleware_1.AppError(400, 'VALIDATION_ERROR', 'رقم المستند غير صحيح. Invalid file ID.'));
        }
        const file = await db_1.default.consultationFile.findUnique({
            where: { id: fileId }
        });
        if (!file) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'المستند المطلوبة غير موجودة. File not found.'));
        }
        // Get absolute file path
        const absolutePath = path_1.default.join(__dirname, '../../../', file.filePath);
        if (!fs_1.default.existsSync(absolutePath)) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'الملف الفعلي غير موجود على الخادم. Raw file does not exist.'));
        }
        // Log audit event
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DOWNLOAD_FILE', req.ip || null, req.headers['user-agent'] || null, undefined, undefined, `Downloaded file: ${file.fileName} from consultation id: ${file.consultationId}`);
        // Stream file response
        res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
        const fileStream = fs_1.default.createReadStream(absolutePath);
        fileStream.pipe(res);
    }
    catch (e) {
        next(e);
    }
};
exports.getSecureFile = getSecureFile;
