"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.consultationLimiter = exports.publicLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Standard rate limiter for all public endpoints
exports.publicLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: {
        status: 'error',
        message: 'Too many requests from this IP, please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Strict rate limiter for consultation submission
exports.consultationLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per window
    message: {
        status: 'error',
        message: 'الرجاء الانتظار دقيقة قبل إرسال طلب آخر. / Please wait a minute before submitting another request.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Strict rate limiter for authentication attempts
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: {
        status: 'error',
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
