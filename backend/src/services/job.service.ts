import { backupService } from './backup.service';
import path from 'path';
import fs from 'fs';

export class JobService {
    /**
     * Purges temporary upload files older than 24 hours
     */
    async cleanupTempFiles() {
        const tempDir = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(tempDir)) return;

        const files = fs.readdirSync(tempDir);
        const now = Date.now();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours

        let count = 0;
        files.forEach(file => {
            const filePath = path.join(tempDir, file);
            const stats = fs.statSync(filePath);
            if (now - stats.mtime.getTime() > expirationTime) {
                fs.unlinkSync(filePath);
                count++;
            }
        });

        console.log(`[Job Service] Cleaned up ${count} orphaned temporary uploads.`);
    }

    /**
     * Weekly database SQL schema backup generator
     */
    async runScheduledBackup() {
        try {
            const fileName = await backupService.runBackup();
            console.log(`[Job Service] Scheduled SQL database backup created: ${fileName}`);
        } catch (err: any) {
            console.error('[Job Service] Database backup failed:', err.message);
        }
    }
}

export const jobService = new JobService();
