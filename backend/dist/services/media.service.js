"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaService = exports.MediaService = void 0;
const db_1 = __importDefault(require("../config/db"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class MediaService {
    /**
     * Audit whether a media file is referenced in any database table
     * @param fileName File name to search for
     */
    async checkFileUsage(fileName) {
        const references = [];
        // 1. Check in Blog Articles
        const blogCount = await db_1.default.blogArticle.count({
            where: {
                OR: [
                    { imagePath: { contains: fileName } },
                    { contentAr: { contains: fileName } },
                    { contentEn: { contains: fileName } }
                ]
            }
        });
        if (blogCount > 0) {
            references.push(`مقالات المدونة (${blogCount} مقال)`);
        }
        // 2. Check in Services
        const serviceCount = await db_1.default.service.count({
            where: {
                OR: [
                    { descriptionAr: { contains: fileName } },
                    { descriptionEn: { contains: fileName } }
                ]
            }
        });
        if (serviceCount > 0) {
            references.push(`الخدمات (${serviceCount} خدمة)`);
        }
        // 3. Check in Website Settings (logos, etc)
        const settingCount = await db_1.default.websiteSetting.count({
            where: {
                value: { contains: fileName }
            }
        });
        if (settingCount > 0) {
            references.push(`إعدادات الموقع (${settingCount} بند)`);
        }
        return {
            inUse: references.length > 0,
            references
        };
    }
    /**
     * Lists all uploaded media files in storage/blog directory
     */
    async getMediaFilesList() {
        const mediaDir = path_1.default.join(__dirname, '../../../storage/blog');
        if (!fs_1.default.existsSync(mediaDir)) {
            fs_1.default.mkdirSync(mediaDir, { recursive: true });
            return [];
        }
        const files = fs_1.default.readdirSync(mediaDir);
        const fileDetails = [];
        for (const file of files) {
            const fullPath = path_1.default.join(mediaDir, file);
            const stats = fs_1.default.statSync(fullPath);
            // Ignore thumbnails or folder structures in listing output
            if (stats.isFile() && !file.includes('_thumb.')) {
                const usage = await this.checkFileUsage(file);
                fileDetails.push({
                    name: file,
                    sizeBytes: stats.size,
                    url: `/storage/blog/${file}`,
                    createdAt: stats.birthtime,
                    inUse: usage.inUse,
                    references: usage.references
                });
            }
        }
        return fileDetails;
    }
}
exports.MediaService = MediaService;
exports.mediaService = new MediaService();
