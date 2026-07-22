import { Request, Response, NextFunction } from 'express';
import { authService, cookieOptions } from '../services/auth.service';
import { AuthenticatedRequest } from '../middlewares/auth';
import { hashPassword } from '../utils/passwordHasher';
import { auditLogRepository } from '../repositories/auditLog.repository';
import prisma from '../config/db';
import { comparePassword } from '../utils/passwordHasher';

/**
 * Enterprise Auth Controller (Slim Layer)
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const { accessToken, refreshToken, user } = await authService.login(
            email,
            password,
            req.ip || undefined,
            (req.headers['user-agent'] as string) || undefined
        );

        res.cookie('refreshToken', refreshToken, cookieOptions);

        await auditLogRepository.logAdminAction(
            user.id,
            'LOGIN',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            undefined,
            'User logged in successfully'
        );

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
    } catch (e) {
        next(e);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const oldRefreshToken = req.cookies.refreshToken;
        if (!oldRefreshToken) {
            return res.status(401).json({ success: false, message: 'Refresh token cookie missing.' });
        }

        const { accessToken, refreshToken } = await authService.refresh(
            oldRefreshToken,
            req.ip || undefined,
            (req.headers['user-agent'] as string) || undefined
        );

        res.cookie('refreshToken', refreshToken, cookieOptions);

        return res.json({
            success: true,
            accessToken
        });
    } catch (e) {
        next(e);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await authService.logout(refreshToken);
        }
        res.clearCookie('refreshToken', cookieOptions);
        return res.json({
            success: true,
            message: 'Logged out successfully.'
        });
    } catch (e) {
        next(e);
    }
};

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        try {
            const token = await authService.generatePasswordResetToken(email);
            const clientOrigin = process.env.CORS_ORIGIN || 'http://localhost:8000';
            const resetUrl = `${clientOrigin}/admin/reset-password.html?token=${token}`;
            
            // Console logging for local development
            console.log('\n==================================================');
            console.log(`[PASSWORD RESET] Link for ${email}:`);
            console.log(resetUrl);
            console.log('==================================================\n');

            // Log to local file for recovery fallback
            const fs = await import('fs');
            const path = await import('path');
            const logPath = path.join(__dirname, '../../password-resets.log');
            fs.appendFileSync(logPath, `[${new Date().toISOString()}] Email: ${email} -> Link: ${resetUrl}\n`);
            
            const { emailService } = await import('../services/emailService');
            await emailService.sendPasswordResetEmail(email, resetUrl);
        } catch (err) {
            // Silent block to protect email disclosure queries
        }

        return res.json({
            success: true,
            message: 'If the email exists, a password reset link has been sent.'
        });
    } catch (e) {
        next(e);
    }
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token, newPassword } = req.body;
        const newHash = hashPassword(newPassword);
        await authService.resetPassword(token, newHash);

        return res.json({
            success: true,
            message: 'Password has been reset successfully.'
        });
    } catch (e) {
        next(e);
    }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'Authentication required.' });
        }

        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || !comparePassword(oldPassword, user.passwordHash)) {
            return res.status(400).json({ success: false, message: 'Current password provided is incorrect.' });
        }

        const newHash = hashPassword(newPassword);
        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash }
        });
        await authService.logoutAllDevices(userId);

        await auditLogRepository.logAdminAction(
            userId,
            'CHANGE_PASSWORD',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            undefined,
            'User updated their password'
        );

        return res.json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (e) {
        next(e);
    }
};
