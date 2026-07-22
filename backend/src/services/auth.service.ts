import { userRepository } from '../repositories/user.repository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtHelper';
import { hashPassword, comparePassword } from '../utils/passwordHasher';
import prisma from '../config/db';
import crypto from 'crypto';
import { AppError } from '../middlewares/error.middleware';

export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

export class AuthService {
    private sessionDelegate = prisma.session;

    async login(email: string, password: string, ipAddress?: string, userAgent?: string) {
        const user = await userRepository.findByEmail(email);
        if (!user || !user.isActive) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }

        const passMatch = comparePassword(password, user.passwordHash);
        if (!passMatch) {
            throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = generateRefreshToken({ id: user.id });

        // Save session in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

        await this.sessionDelegate.create({
            data: {
                userId: user.id,
                refreshToken,
                ipAddress,
                userAgent,
                expiresAt
            }
        });

        const userWithRole = await userRepository.findByIdWithRole(user.id);
        return { accessToken, refreshToken, user: userWithRole };
    }

    async refresh(oldRefreshToken: string, ipAddress?: string, userAgent?: string) {
        const payload = verifyRefreshToken(oldRefreshToken);
        if (!payload) {
            // Delete session from database to prevent reuse
            await this.sessionDelegate.deleteMany({ where: { refreshToken: oldRefreshToken } });
            throw new AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token.');
        }

        // Verify if session exists in DB
        const session = await this.sessionDelegate.findUnique({
            where: { refreshToken: oldRefreshToken }
        });
        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await this.sessionDelegate.delete({ where: { id: session.id } });
            }
            throw new AppError(401, 'SESSION_EXPIRED', 'Session expired or revoked.');
        }

        // Generate new tokens (Rotation)
        const userId = payload.id;
        const user = await userRepository.findByIdWithRole(userId);
        if (!user || !user.isActive) {
            throw new AppError(403, 'ACCOUNT_INACTIVE', 'Account deactivated.');
        }

        const newAccessToken = generateAccessToken({ id: user.id, email: user.email });
        const newRefreshToken = generateRefreshToken({ id: user.id });

        // Update database with rotated token
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.sessionDelegate.update({
            where: { id: session.id },
            data: {
                refreshToken: newRefreshToken,
                ipAddress,
                userAgent,
                expiresAt
            }
        });

        return { accessToken: newAccessToken, refreshToken: newRefreshToken, user };
    }

    async logout(refreshToken: string) {
        await this.sessionDelegate.deleteMany({
            where: { refreshToken }
        });
    }

    async logoutAllDevices(userId: number) {
        await this.sessionDelegate.deleteMany({
            where: { userId }
        });
    }

    // Forgot password token generation
    async generatePasswordResetToken(email: string): Promise<string> {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User with this email does not exist.');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour validity

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });

        return token;
    }

    async resetPassword(token: string, newPasswordHash: string) {
        const resetRecord = await prisma.passwordResetToken.findUnique({
            where: { token }
        });

        if (!resetRecord || resetRecord.expiresAt < new Date()) {
            if (resetRecord) {
                await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });
            }
            throw new AppError(400, 'INVALID_RESET_TOKEN', 'Reset token has expired or is invalid.');
        }

        // Update password hash
        await userRepository.update({
            where: { id: resetRecord.userId },
            data: { passwordHash: newPasswordHash }
        });

        // Invalidate all reset links and active sessions for this user.
        await prisma.$transaction([
            prisma.passwordResetToken.deleteMany({
                where: { userId: resetRecord.userId }
            }),
            prisma.session.deleteMany({
                where: { userId: resetRecord.userId }
            })
        ]);
    }
}
export const authService = new AuthService();
