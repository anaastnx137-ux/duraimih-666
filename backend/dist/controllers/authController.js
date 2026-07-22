"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.resetPassword = exports.requestPasswordReset = exports.logout = exports.refresh = exports.login = void 0;
const auth_service_1 = require("../services/auth.service");
const passwordHasher_1 = require("../utils/passwordHasher");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const db_1 = __importDefault(require("../config/db"));
const passwordHasher_2 = require("../utils/passwordHasher");
/**
 * Enterprise Auth Controller (Slim Layer)
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await auth_service_1.authService.login(email, password, req.ip || undefined, req.headers['user-agent'] || undefined);
        res.cookie('refreshToken', refreshToken, auth_service_1.cookieOptions);
        await auditLog_repository_1.auditLogRepository.logAdminAction(user.id, 'LOGIN', req.ip || null, req.headers['user-agent'] || null, undefined, undefined, 'User logged in successfully');
        return res.json({
            success: true,
            accessToken,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role.name
            }
        });
    }
    catch (e) {
        next(e);
    }
};
exports.login = login;
const refresh = async (req, res, next) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token cookie missing.' });
        }
        const { accessToken, refreshToken } = await auth_service_1.authService.refresh(oldRefreshToken, req.ip || undefined, req.headers['user-agent'] || undefined);
        res.cookie('refreshToken', refreshToken, auth_service_1.cookieOptions);
        return res.json({
            success: true,
            accessToken
        });
    }
    catch (e) {
        next(e);
    }
};
exports.refresh = refresh;
const logout = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await auth_service_1.authService.logout(refreshToken);
        }
        res.clearCookie('refreshToken', auth_service_1.cookieOptions);
        return res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.logout = logout;
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        try {
            const token = await auth_service_1.authService.generatePasswordResetToken(email);
            const clientOrigin = process.env.CORS_ORIGIN || 'http://localhost:8000';
            const resetUrl = `${clientOrigin}/admin/reset-password.html?token=${token}`;
            // Console logging for local development
            console.log('\n==================================================');
            console.log(`[PASSWORD RESET] Link for ${email}:`);
            console.log(resetUrl);
            console.log('==================================================\n');
            // Log to local file for recovery fallback
            const fs = await Promise.resolve().then(() => __importStar(require('fs')));
            const path = await Promise.resolve().then(() => __importStar(require('path')));
            const logPath = path.join(__dirname, '../../password-resets.log');
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] Email: ${email} -> Link: ${resetUrl}\n`);
            const { emailService } = await Promise.resolve().then(() => __importStar(require('../services/emailService')));
            await emailService.sendPasswordResetEmail(email, resetUrl);
        }
        catch (err) {
            // Silent block to protect email disclosure queries
        }
        return res.json({
            success: true,
            message: 'If the email exists, a password reset link has been sent.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.requestPasswordReset = requestPasswordReset;
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;
        const newHash = (0, passwordHasher_1.hashPassword)(newPassword);
        await auth_service_1.authService.resetPassword(token, newHash);
        return res.json({
            success: true,
            message: 'Password has been reset successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.resetPassword = resetPassword;
const changePassword = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;
        const user = await db_1.default.user.findUnique({ where: { id: userId } });
        if (!user || !(0, passwordHasher_2.comparePassword)(oldPassword, user.passwordHash)) {
            return res.status(400).json({ success: false, message: 'Current password provided is incorrect.' });
        }
        const newHash = (0, passwordHasher_1.hashPassword)(newPassword);
        await db_1.default.user.update({
            where: { id: userId },
            data: { passwordHash: newHash }
        });
        await auth_service_1.authService.logoutAllDevices(userId);
        await auditLog_repository_1.auditLogRepository.logAdminAction(userId, 'CHANGE_PASSWORD', req.ip || null, req.headers['user-agent'] || null, undefined, undefined, 'User updated their password');
        return res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.changePassword = changePassword;
