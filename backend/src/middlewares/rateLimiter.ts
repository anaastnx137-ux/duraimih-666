import rateLimit from 'express-rate-limit';

// Standard rate limiter for all public endpoints
export const publicLimiter = rateLimit({
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
export const consultationLimiter = rateLimit({
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
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: {
        status: 'error',
        message: 'Too many login attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
