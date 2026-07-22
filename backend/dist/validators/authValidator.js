"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordSchema = exports.passwordResetSchema = exports.passwordResetRequestSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format.'),
        password: zod_1.z.string().min(1, 'Password is required.')
    })
});
exports.passwordResetRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email address format.')
    })
});
exports.passwordResetSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, 'Reset token is required.'),
        newPassword: zod_1.z.string().min(12, 'Password must be at least 12 characters long.')
    })
});
exports.changePasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        oldPassword: zod_1.z.string().min(1, 'Current password is required.'),
        newPassword: zod_1.z.string().min(12, 'New password must be at least 12 characters long.')
    })
});
