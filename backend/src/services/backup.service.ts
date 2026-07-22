import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import util from 'util';

const execFilePromise = util.promisify(execFile);

export class BackupService {
    private backupsDir = path.join(__dirname, '../../../storage/backups');

    /**
     * Executes mysqldump to back up the MySQL/MariaDB database.
     */
    async runBackup(): Promise<string> {
        if (!fs.existsSync(this.backupsDir)) {
            fs.mkdirSync(this.backupsDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFileName = `backup_${timestamp}.sql`;
        const backupPath = path.join(this.backupsDir, backupFileName);

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
    async getBackupsList(): Promise<any[]> {
        if (!fs.existsSync(this.backupsDir)) {
            return [];
        }
        const files = fs.readdirSync(this.backupsDir);
        return files.map(file => {
            const fullPath = path.join(this.backupsDir, file);
            const stats = fs.statSync(fullPath);
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
    async deleteBackup(fileName: string) {
        const fullPath = path.join(this.backupsDir, fileName);
        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
}

export const backupService = new BackupService();
