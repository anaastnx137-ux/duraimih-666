import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public errors: any[] = []
    ) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

/**
 * Enterprise Centralized Error Handler Middleware
 */
export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
