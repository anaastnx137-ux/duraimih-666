import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

const tempUploadsDir = path.join(__dirname, '../../uploads/temp');

// Ensure temp directory exists
if (!fs.existsSync(tempUploadsDir)) {
    fs.mkdirSync(tempUploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
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

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mime)) {
        return cb(new Error(`Security validation failed: File extension/type is not allowed for: ${file.originalname}`));
    }
    cb(null, true);
};

// Multer instances (limit individual file to 10MB)
export const multerUpload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    }
}).array('files', 5); // Allow up to 5 files with field name 'files'

// Secondary validation middleware to check totals
export const validateUploadLimits = (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !(req.files instanceof Array)) {
        return next();
    }

    const files = req.files as Express.Multer.File[];

    // 1. Validate file count limit
    if (files.length > 5) {
        // Cleanup temp files
        files.forEach(f => {
            if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
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
            if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
        });
        return res.status(400).json({
            status: 'error',
            message: 'Total size of files exceeds the maximum limit (30 MB).'
        });
    }

    next();
};
