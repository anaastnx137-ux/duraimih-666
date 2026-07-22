"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBackgroundJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const job_service_1 = require("../services/job.service");
/**
 * Initializes and schedules background operations
 */
const initBackgroundJobs = () => {
    // 1. Cleanup temp folders: daily at midnight
    node_cron_1.default.schedule('0 0 * * *', async () => {
        console.log('[Cron] Starting temporary files cleanup...');
        await job_service_1.jobService.cleanupTempFiles();
    });
    // 2. Scheduled backup: weekly on Sunday at midnight
    node_cron_1.default.schedule('0 0 * * 0', async () => {
        console.log('[Cron] Starting scheduled weekly database backup...');
        await job_service_1.jobService.runScheduledBackup();
    });
    console.log('[Cron] Background operations scheduled.');
};
exports.initBackgroundJobs = initBackgroundJobs;
