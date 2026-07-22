"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobService = exports.JobService = void 0;
const backup_service_1 = require("./backup.service");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class JobService {
    /**
     * Purges temporary upload files older than 24 hours
     */
    async cleanupTempFiles() {
        const tempDir = path_1.default.join(__dirname, '../../uploads');
        if (!fs_1.default.existsSync(tempDir))
            return;
        const files = fs_1.default.readdirSync(tempDir);
        const now = Date.now();
        const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
        let count = 0;
        files.forEach(file => {
            const filePath = path_1.default.join(tempDir, file);
            const stats = fs_1.default.statSync(filePath);
            if (now - stats.mtime.getTime() > expirationTime) {
                fs_1.default.unlinkSync(filePath);
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
            const fileName = await backup_service_1.backupService.runBackup();
            console.log(`[Job Service] Scheduled SQL database backup created: ${fileName}`);
        }
        catch (err) {
            console.error('[Job Service] Database backup failed:', err.message);
        }
    }
}
exports.JobService = JobService;
exports.jobService = new JobService();
