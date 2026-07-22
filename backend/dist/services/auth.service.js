"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = exports.AuthService = exports.cookieOptions = void 0;
const user_repository_1 = require("../repositories/user.repository");
const jwtHelper_1 = require("../utils/jwtHelper");
const passwordHasher_1 = require("../utils/passwordHasher");
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
const error_middleware_1 = require("../middlewares/error.middleware");
exports.cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};
class AuthService {
    sessionDelegate = db_1.default.session;
    async login(email, password, ipAddress, userAgent) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user || !user.isActive) {
            throw new error_middleware_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }
        const passMatch = (0, passwordHasher_1.comparePassword)(password, user.passwordHash);
        if (!passMatch) {
            throw new error_middleware_1.AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
        }
        // Generate tokens
        const accessToken = (0, jwtHelper_1.generateAccessToken)({ id: user.id, email: user.email });
        const refreshToken = (0, jwtHelper_1.generateRefreshToken)({ id: user.id });
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
        const userWithRole = await user_repository_1.userRepository.findByIdWithRole(user.id);
        return { accessToken, refreshToken, user: userWithRole };
    }
    async refresh(oldRefreshToken, ipAddress, userAgent) {
        const payload = (0, jwtHelper_1.verifyRefreshToken)(oldRefreshToken);
        if (!payload) {
            // Delete session from database to prevent reuse
            await this.sessionDelegate.deleteMany({ where: { refreshToken: oldRefreshToken } });
            throw new error_middleware_1.AppError(401, 'INVALID_REFRESH_TOKEN', 'Invalid refresh token.');
        }
        // Verify if session exists in DB
        const session = await this.sessionDelegate.findUnique({
            where: { refreshToken: oldRefreshToken }
        });
        if (!session || session.expiresAt < new Date()) {
            if (session) {
                await this.sessionDelegate.delete({ where: { id: session.id } });
            }
            throw new error_middleware_1.AppError(401, 'SESSION_EXPIRED', 'Session expired or revoked.');
        }
        // Generate new tokens (Rotation)
        const userId = payload.id;
        const user = await user_repository_1.userRepository.findByIdWithRole(userId);
        if (!user || !user.isActive) {
            throw new error_middleware_1.AppError(403, 'ACCOUNT_INACTIVE', 'Account deactivated.');
        }
        const newAccessToken = (0, jwtHelper_1.generateAccessToken)({ id: user.id, email: user.email });
        const newRefreshToken = (0, jwtHelper_1.generateRefreshToken)({ id: user.id });
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
    async logout(refreshToken) {
        await this.sessionDelegate.deleteMany({
            where: { refreshToken }
        });
    }
    async logoutAllDevices(userId) {
        await this.sessionDelegate.deleteMany({
            where: { userId }
        });
    }
    // Forgot password token generation
    async generatePasswordResetToken(email) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new Error('User with this email does not exist.');
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour validity
        await db_1.default.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expiresAt
            }
        });
        return token;
    }
    async resetPassword(token, newPasswordHash) {
        const resetRecord = await db_1.default.passwordResetToken.findUnique({
            where: { token }
        });
        if (!resetRecord || resetRecord.expiresAt < new Date()) {
            if (resetRecord) {
                await db_1.default.passwordResetToken.delete({ where: { id: resetRecord.id } });
            }
            throw new error_middleware_1.AppError(400, 'INVALID_RESET_TOKEN', 'Reset token has expired or is invalid.');
        }
        // Update password hash
        await user_repository_1.userRepository.update({
            where: { id: resetRecord.userId },
            data: { passwordHash: newPasswordHash }
        });
        // Invalidate all reset links and active sessions for this user.
        await db_1.default.$transaction([
            db_1.default.passwordResetToken.deleteMany({
                where: { userId: resetRecord.userId }
            }),
            db_1.default.session.deleteMany({
                where: { userId: resetRecord.userId }
            })
        ]);
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
