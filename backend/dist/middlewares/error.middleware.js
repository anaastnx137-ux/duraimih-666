"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    code;
    errors;
    constructor(statusCode, code, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.errors = errors;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.AppError = AppError;
/**
 * Enterprise Centralized Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const code = err.code || 'INTERNAL_SERVER_ERROR';
    const message = err.message || 'حدث خطأ غير متوقع في الخادم.';
    const errors = err.errors || [];
    // Log the error context
    console.error(`[AppError] Code: ${code}, Status: ${statusCode}, Message: ${message}`, err.stack || err);
    return res.status(statusCode).json({
        success: false,
        code,
        message,
        errors
    });
};
exports.errorHandler = errorHandler;
