"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadLimits = exports.multerUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const tempUploadsDir = path_1.default.join(__dirname, '../../uploads/temp');
// Ensure temp directory exists
if (!fs_1.default.existsSync(tempUploadsDir)) {
    fs_1.default.mkdirSync(tempUploadsDir, { recursive: true });
}
// Multer Storage Configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempUploadsDir);
    },
    filename: (req, file, cb) => {
        // Sanitize name: remove spaces/special chars, keep safe characters
        const cleanName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + cleanName);
    }
});
// File type validation (Extensions and MIME types)
const allowedExtensions = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'application/octet-stream'
];
const fileFilter = (req, file, cb) => {
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
        return cb(new Error(`Security validation failed: File extension/type is not allowed for: ${file.originalname}`));
    }
    cb(null, true);
};
// Multer instances (limit individual file to 10MB)
exports.multerUpload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}).array('files', 5); // Allow up to 5 files with field name 'files'
// Secondary validation middleware to check totals
const validateUploadLimits = (req, res, next) => {
    if (!req.files || !(req.files instanceof Array)) {
        return next();
    }
    const files = req.files;
    // 1. Validate file count limit
    if (files.length > 5) {
        // Cleanup temp files
        files.forEach(f => {
            if (fs_1.default.existsSync(f.path))
                fs_1.default.unlinkSync(f.path);
        });
        return res.status(400).json({
            status: 'error',
            message: 'You cannot upload more than 5 files.'
        });
    }
    // 2. Validate total combined file size (30MB)
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 30 * 1024 * 1024) {
        // Cleanup temp files
        files.forEach(f => {
            if (fs_1.default.existsSync(f.path))
                fs_1.default.unlinkSync(f.path);
        });
        return res.status(400).json({
            status: 'error',
            message: 'Total size of files exceeds the maximum limit (30 MB).'
        });
    }
    next();
};
exports.validateUploadLimits = validateUploadLimits;
