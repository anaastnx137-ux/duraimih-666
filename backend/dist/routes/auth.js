"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const authValidator_1 = require("../validators/authValidator");
const router = (0, express_1.Router)();
// Rate limited login path
router.post('/login', rateLimiter_1.authLimiter, (0, validator_middleware_1.validateRequest)(authValidator_1.loginSchema), authController_1.login);
router.post('/logout', authController_1.logout);
router.post('/refresh', authController_1.refresh);
// Password recovery paths
router.post('/reset-password', rateLimiter_1.authLimiter, (0, validator_middleware_1.validateRequest)(authValidator_1.passwordResetRequestSchema), authController_1.requestPasswordReset);
router.post('/change-password', rateLimiter_1.authLimiter, (0, validator_middleware_1.validateRequest)(authValidator_1.passwordResetSchema), authController_1.resetPassword);
// Profile password updates
router.put('/update-profile-password', auth_1.authenticateToken, (0, validator_middleware_1.validateRequest)(authValidator_1.changePasswordSchema), authController_1.changePassword);
exports.default = router;
