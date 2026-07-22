import prisma from '../config/db';
import fs from 'fs';
import path from 'path';

export class MediaService {
    /**
     * Audit whether a media file is referenced in any database table
     * @param fileName File name to search for
     */
    async checkFileUsage(fileName: string): Promise<{ inUse: boolean; references: string[] }> {
        const references: string[] = [];

        // 1. Check in Blog Articles
        const blogCount = await prisma.blogArticle.count({
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
        const serviceCount = await prisma.service.count({
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
        const settingCount = await prisma.websiteSetting.count({
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
    async getMediaFilesList(): Promise<any[]> {
        const mediaDir = path.join(__dirname, '../../../storage/blog');
        if (!fs.existsSync(mediaDir)) {
            fs.mkdirSync(mediaDir, { recursive: true });
            return [];
        }

        const files = fs.readdirSync(mediaDir);
        const fileDetails = [];

        for (const file of files) {
            const fullPath = path.join(mediaDir, file);
            const stats = fs.statSync(fullPath);

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

export const mediaService = new MediaService();
