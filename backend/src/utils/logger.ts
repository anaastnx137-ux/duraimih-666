import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(__dirname, '../../../storage/logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Enterprise Winston Logger instance
 */
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`)
            )
        }),
        new winston.transports.File({ filename: path.join(logsDir, 'system.log') }),
        new winston.transports.File({ filename: path.join(logsDir, 'errors.log'), level: 'error' })
    ]
});

export const logSecurity = (msg: string) => logger.warn(`[SECURITY] ${msg}`);
export const logUpload = (msg: string) => logger.info(`[UPLOAD] ${msg}`);
export const logAuth = (msg: string) => logger.info(`[AUTH] ${msg}`);
export const logSystem = (msg: string) => logger.info(`[SYSTEM] ${msg}`);
