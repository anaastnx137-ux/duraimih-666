import { Router } from 'express';
import { login, logout, refresh, requestPasswordReset, resetPassword, changePassword } from '../controllers/authController';
import { authenticateToken } from '../middlewares/auth';
import { authLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../middlewares/validator.middleware';
import { loginSchema, passwordResetRequestSchema, passwordResetSchema, changePasswordSchema } from '../validators/authValidator';

const router = Router();

// Rate limited login path
router.post('/login', authLimiter, validateRequest(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);

// Password recovery paths
router.post('/reset-password', authLimiter, validateRequest(passwordResetRequestSchema), requestPasswordReset);
router.post('/change-password', authLimiter, validateRequest(passwordResetSchema), resetPassword);

// Profile password updates
router.put('/update-profile-password', authenticateToken, validateRequest(changePasswordSchema), changePassword);

export default router;
