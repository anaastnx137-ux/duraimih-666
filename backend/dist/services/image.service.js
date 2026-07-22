"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageService = exports.ImageService = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ImageService {
    /**
     * Converts an image to WebP, resizes to a max resolution, and generates a thumbnail
     * @param tempFilePath Temporary path of the uploaded file
     * @param targetDir Target directory where files will be stored
     * @param baseName Base filename without extension (e.g. "image_uuid")
     * @returns Object with paths of optimized and thumbnail images relative to storage
     */
    async optimizeImage(tempFilePath, targetDir, baseName) {
        // Ensure destination folder exists
        if (!fs_1.default.existsSync(targetDir)) {
            fs_1.default.mkdirSync(targetDir, { recursive: true });
        }
        const optimizedFileName = `${baseName}.webp`;
        const thumbnailFileName = `${baseName}_thumb.webp`;
        const optimizedFullPath = path_1.default.join(targetDir, optimizedFileName);
        const thumbnailFullPath = path_1.default.join(targetDir, thumbnailFileName);
        // 1. Process main image: resize if wider than 1920px, convert to WebP
        await (0, sharp_1.default)(tempFilePath)
            .resize({
            width: 1920,
            withoutEnlargement: true,
            fit: 'inside'
        })
            .webp({ quality: 80 })
            .toFile(optimizedFullPath);
        // 2. Process thumbnail: square crop 300x300, convert to WebP
        await (0, sharp_1.default)(tempFilePath)
            .resize(300, 300, {
            fit: 'cover',
            position: 'center'
        })
            .webp({ quality: 70 })
            .toFile(thumbnailFullPath);
        // Get path offsets relative to root workspace or storage folder
        const storageIndex = targetDir.indexOf('storage');
        const relativeDir = storageIndex !== -1 ? targetDir.substring(storageIndex) : targetDir;
        return {
            optimizedRelPath: path_1.default.join(relativeDir, optimizedFileName).replace(/\\/g, '/'),
            thumbnailRelPath: path_1.default.join(relativeDir, thumbnailFileName).replace(/\\/g, '/')
        };
    }
}
exports.ImageService = ImageService;
exports.imageService = new ImageService();
