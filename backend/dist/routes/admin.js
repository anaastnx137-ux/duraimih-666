"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const adminController_1 = require("../controllers/adminController");
const consultationController_1 = require("../controllers/consultationController");
const blogController_1 = require("../controllers/blogController");
const serviceController_1 = require("../controllers/serviceController");
const faqController_1 = require("../controllers/faqController");
const testimonialController_1 = require("../controllers/testimonialController");
const settingController_1 = require("../controllers/settingController");
const userController_1 = require("../controllers/userController");
const mediaController_1 = require("../controllers/mediaController");
const file_controller_1 = require("../controllers/file.controller");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const consultationValidator_1 = require("../validators/consultationValidator");
const adminValidator_1 = require("../validators/adminValidator");
const router = (0, express_1.Router)();
// Apply auth gate to all admin routes
router.use(auth_1.authenticateToken);
// 1. Analytics & Activity logs
router.get('/stats', adminController_1.getDashboardStats);
router.get('/logs', (0, auth_1.requirePermission)('view_audit_logs'), adminController_1.getActivityLogs);
router.get('/notifications', adminController_1.getNotifications);
router.post('/notifications/mark-read', adminController_1.markAllNotificationsRead);
router.post('/verify-password', adminController_1.verifyPassword);
// 2. Consultation managers & secure downloads
router.get('/consultations', (0, auth_1.requirePermission)('view_consultations'), consultationController_1.getConsultations);
router.get('/consultations/:id', (0, auth_1.requirePermission)('view_consultations'), consultationController_1.getConsultationById);
router.put('/consultations/:id', (0, auth_1.requirePermission)('edit_consultations'), (0, validator_middleware_1.validateRequest)(consultationValidator_1.consultationUpdateSchema), consultationController_1.updateConsultation);
router.get('/files/:id', (0, auth_1.requirePermission)('view_consultations'), file_controller_1.getSecureFile);
router.delete('/consultations/:id', (0, auth_1.requirePermission)('edit_consultations'), consultationController_1.deleteConsultation);
// 3. Blog article managers
router.get('/blog', (0, auth_1.requirePermission)('manage_blog'), blogController_1.adminGetArticles);
router.post('/blog', (0, auth_1.requirePermission)('manage_blog'), (0, validator_middleware_1.validateRequest)(adminValidator_1.blogArticleSchema), blogController_1.createArticle);
router.put('/blog/:id', (0, auth_1.requirePermission)('manage_blog'), (0, validator_middleware_1.validateRequest)(adminValidator_1.blogArticleSchema), blogController_1.updateArticle);
router.delete('/blog/:id', (0, auth_1.requirePermission)('manage_blog'), blogController_1.deleteArticle);
// 4. Services list CRUD
router.get('/services', serviceController_1.adminGetServices);
router.post('/services', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.serviceSchema), serviceController_1.createService);
router.put('/services/:id', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.serviceSchema), serviceController_1.updateService);
router.delete('/services/:id', (0, auth_1.requirePermission)('edit_settings'), serviceController_1.deleteService);
// 5. FAQ list CRUD
router.get('/faqs', faqController_1.adminGetFAQs);
router.post('/faqs', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.faqSchema), faqController_1.createFAQ);
router.put('/faqs/:id', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.faqSchema), faqController_1.updateFAQ);
router.delete('/faqs/:id', (0, auth_1.requirePermission)('edit_settings'), faqController_1.deleteFAQ);
// 6. Testimonial list CRUD
router.get('/testimonials', testimonialController_1.adminGetTestimonials);
router.post('/testimonials', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.testimonialSchema), testimonialController_1.createTestimonial);
router.put('/testimonials/:id', (0, auth_1.requirePermission)('edit_settings'), (0, validator_middleware_1.validateRequest)(adminValidator_1.testimonialSchema), testimonialController_1.updateTestimonial);
router.delete('/testimonials/:id', (0, auth_1.requirePermission)('edit_settings'), testimonialController_1.deleteTestimonial);
// 7. Site configurations
router.put('/settings', (0, auth_1.requirePermission)('edit_settings'), settingController_1.updateSettings);
// 8. Administrative User Roles & RBAC (Super Admin only)
router.get('/users', auth_1.requireSuperAdmin, userController_1.getUsers);
router.post('/users', auth_1.requireSuperAdmin, (0, validator_middleware_1.validateRequest)(adminValidator_1.createUserSchema), userController_1.createUser);
router.put('/users/:id', auth_1.requireSuperAdmin, (0, validator_middleware_1.validateRequest)(adminValidator_1.updateUserSchema), userController_1.updateUser);
router.get('/roles', auth_1.requireSuperAdmin, userController_1.getRoles);
router.delete('/users/:id', auth_1.requireSuperAdmin, userController_1.deleteUser);
// 9. Media Library operations
router.get('/media', (0, auth_1.requireAnyPermission)('manage_blog', 'edit_settings'), mediaController_1.getMediaFiles);
router.post('/media', (0, auth_1.requireAnyPermission)('manage_blog', 'edit_settings'), mediaController_1.uploadMediaFile);
router.delete('/media/:fileName', (0, auth_1.requireAnyPermission)('manage_blog', 'edit_settings'), mediaController_1.deleteMediaFile);
exports.default = router;
