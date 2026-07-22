import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export class ImageService {
    /**
     * Converts an image to WebP, resizes to a max resolution, and generates a thumbnail
     * @param tempFilePath Temporary path of the uploaded file
     * @param targetDir Target directory where files will be stored
     * @param baseName Base filename without extension (e.g. "image_uuid")
     * @returns Object with paths of optimized and thumbnail images relative to storage
     */
    async optimizeImage(
        tempFilePath: string,
        targetDir: string,
        baseName: string
    ): Promise<{ optimizedRelPath: string; thumbnailRelPath: string }> {
        // Ensure destination folder exists
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const optimizedFileName = `${baseName}.webp`;
        const thumbnailFileName = `${baseName}_thumb.webp`;

        const optimizedFullPath = path.join(targetDir, optimizedFileName);
        const thumbnailFullPath = path.join(targetDir, thumbnailFileName);

        // 1. Process main image: resize if wider than 1920px, convert to WebP
        await sharp(tempFilePath)
            .resize({
                width: 1920,
                withoutEnlargement: true,
                fit: 'inside'
            })
            .webp({ quality: 80 })
            .toFile(optimizedFullPath);

        // 2. Process thumbnail: square crop 300x300, convert to WebP
        await sharp(tempFilePath)
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
            optimizedRelPath: path.join(relativeDir, optimizedFileName).replace(/\\/g, '/'),
            thumbnailRelPath: path.join(relativeDir, thumbnailFileName).replace(/\\/g, '/')
        };
    }
}

export const imageService = new ImageService();
