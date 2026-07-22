import cron from 'node-cron';
import { jobService } from '../services/job.service';

/**
 * Initializes and schedules background operations
 */
export const initBackgroundJobs = () => {
    // 1. Cleanup temp folders: daily at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[Cron] Starting temporary files cleanup...');
        await jobService.cleanupTempFiles();
    });

    // 2. Scheduled backup: weekly on Sunday at midnight
    cron.schedule('0 0 * * 0', async () => {
        console.log('[Cron] Starting scheduled weekly database backup...');
        await jobService.runScheduledBackup();
    });

    console.log('[Cron] Background operations scheduled.');
};
