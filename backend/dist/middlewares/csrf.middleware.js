"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * Enterprise CSRF Protection Middleware using double-submit cookies.
 * On startup or GET requests, it signs a secure cookie '_csrf' and a client-readable cookie 'XSRF-TOKEN'.
 * On write methods (POST, PUT, DELETE), it validates that the 'X-CSRF-Token' header matches the secure cookie token.
 */
const csrfProtection = (req, res, next) => {
    // Retrieve existing CSRF cookie token
    let csrfCookie = req.cookies ? req.cookies['_csrf'] : null;
    // If missing, generate a new cryptographically secure token
    if (!csrfCookie) {
        csrfCookie = crypto_1.default.randomBytes(32).toString('hex');
        const isProduction = process.env.NODE_ENV === 'production';
        // Secure HttpOnly session cookie
        res.cookie('_csrf', csrfCookie, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        // Non-HttpOnly cookie so JavaScript can read and pass it back in the request headers
        res.cookie('XSRF-TOKEN', csrfCookie, {
            secure: isProduction,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });
    }
    // Enforce validation on state-altering HTTP write actions
    const writeMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
    if (writeMethods.includes(req.method)) {
        // Exempt public authentication and consultation submission paths from CSRF checks
        const exemptPaths = [
            '/api/auth/login',
            '/api/auth/refresh',
            '/api/auth/logout',
            '/api/consultations',
            '/api/consultations-sync'
        ];
        if (exemptPaths.includes(req.path)) {
            return next();
        }
        const clientToken = req.headers['x-csrf-token'];
        if (!clientToken || clientToken !== csrfCookie) {
            return res.status(403).json({
                success: false,
                code: 'CSRF_ERROR',
                message: 'CSRF security token validation failed.'
            });
        }
    }
    next();
};
exports.csrfProtection = csrfProtection;
