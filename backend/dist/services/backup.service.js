"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backupService = exports.BackupService = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const util_1 = __importDefault(require("util"));
const execFilePromise = util_1.default.promisify(child_process_1.execFile);
class BackupService {
    backupsDir = path_1.default.join(__dirname, '../../../storage/backups');
    /**
     * Executes mysqldump to back up the MySQL/MariaDB database.
     */
    async runBackup() {
        if (!fs_1.default.existsSync(this.backupsDir)) {
            fs_1.default.mkdirSync(this.backupsDir, { recursive: true });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_${timestamp}.sql`;
        const backupPath = path_1.default.join(this.backupsDir, backupFileName);
        const dbUrl = process.env.DATABASE_URL;
        if (!dbUrl) {
            throw new Error('DATABASE_URL environment variable is not defined.');
        }
        const parsedUrl = new URL(dbUrl);
        if (parsedUrl.protocol !== 'mysql:') {
            throw new Error('DATABASE_URL must use the mysql:// protocol.');
        }
        const database = parsedUrl.pathname.replace(/^\//, '');
        if (!database) {
            throw new Error('DATABASE_URL must include a database name.');
        }
        const args = [
            '--single-transaction',
            '--routines',
            '--triggers',
            '--default-character-set=utf8mb4',
            '--host', parsedUrl.hostname,
            '--port', parsedUrl.port || '3306',
            '--user', decodeURIComponent(parsedUrl.username),
            '--result-file', backupPath,
            database
        ];
        const mysqldumpPath = process.env.MYSQLDUMP_PATH || 'mysqldump';
        await execFilePromise(mysqldumpPath, args, {
            env: {
                ...process.env,
                MYSQL_PWD: decodeURIComponent(parsedUrl.password)
            }
        });
        return backupFileName;
    }
    /**
     * Returns a list of generated backup SQL files
     */
    async getBackupsList() {
        if (!fs_1.default.existsSync(this.backupsDir)) {
            return [];
        }
        const files = fs_1.default.readdirSync(this.backupsDir);
        return files.map(file => {
            const fullPath = path_1.default.join(this.backupsDir, file);
            const stats = fs_1.default.statSync(fullPath);
            return {
                fileName: file,
                sizeBytes: stats.size,
                createdAt: stats.birthtime
            };
        });
    }
    /**
     * Deletes a backup SQL file
     */
    async deleteBackup(fileName) {
        const fullPath = path_1.default.join(this.backupsDir, fileName);
        if (fs_1.default.existsSync(fullPath)) {
            fs_1.default.unlinkSync(fullPath);
        }
    }
}
exports.BackupService = BackupService;
exports.backupService = new BackupService();
