"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logSystem = exports.logAuth = exports.logUpload = exports.logSecurity = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const logsDir = path_1.default.join(__dirname, '../../../storage/logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
/**
 * Enterprise Winston Logger instance
 */
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message}`)),
    transports: [
        new winston_1.default.transports.Console({
            format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.printf(info => `[${info.timestamp}] [${info.level}]: ${info.message}`))
        }),
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'system.log') }),
        new winston_1.default.transports.File({ filename: path_1.default.join(logsDir, 'errors.log'), level: 'error' })
    ]
});
const logSecurity = (msg) => exports.logger.warn(`[SECURITY] ${msg}`);
exports.logSecurity = logSecurity;
const logUpload = (msg) => exports.logger.info(`[UPLOAD] ${msg}`);
exports.logUpload = logUpload;
const logAuth = (msg) => exports.logger.info(`[AUTH] ${msg}`);
exports.logAuth = logAuth;
const logSystem = (msg) => exports.logger.info(`[SYSTEM] ${msg}`);
exports.logSystem = logSystem;
