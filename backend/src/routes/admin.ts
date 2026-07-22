import { Router } from 'express';
import { authenticateToken, requireAnyPermission, requirePermission, requireSuperAdmin } from '../middlewares/auth';
import { getDashboardStats, getActivityLogs, getNotifications, markAllNotificationsRead, verifyPassword } from '../controllers/adminController';
import { getConsultations, getConsultationById, updateConsultation, deleteConsultation } from '../controllers/consultationController';
import { adminGetArticles, createArticle, updateArticle, deleteArticle } from '../controllers/blogController';
import { adminGetServices, createService, updateService, deleteService } from '../controllers/serviceController';
import { adminGetFAQs, createFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController';
import { adminGetTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../controllers/testimonialController';
import { updateSettings } from '../controllers/settingController';
import { getUsers, createUser, updateUser, getRoles, deleteUser } from '../controllers/userController';
import { getMediaFiles, uploadMediaFile, deleteMediaFile } from '../controllers/mediaController';
import { getSecureFile } from '../controllers/file.controller';
import { validateRequest } from '../middlewares/validator.middleware';
import { consultationUpdateSchema } from '../validators/consultationValidator';
import {
    faqSchema,
    testimonialSchema,
    serviceSchema,
    blogArticleSchema,
    createUserSchema,
    updateUserSchema
} from '../validators/adminValidator';

const router = Router();

// Apply auth gate to all admin routes
router.use(authenticateToken);

// 1. Analytics & Activity logs
router.get('/stats', getDashboardStats);
router.get('/logs', requirePermission('view_audit_logs'), getActivityLogs);
router.get('/notifications', getNotifications);
router.post('/notifications/mark-read', markAllNotificationsRead);
router.post('/verify-password', verifyPassword);

// 2. Consultation managers & secure downloads
router.get('/consultations', requirePermission('view_consultations'), getConsultations);
router.get('/consultations/:id', requirePermission('view_consultations'), getConsultationById);
router.put('/consultations/:id', requirePermission('edit_consultations'), validateRequest(consultationUpdateSchema), updateConsultation);
router.get('/files/:id', requirePermission('view_consultations'), getSecureFile);
router.delete('/consultations/:id', requirePermission('edit_consultations'), deleteConsultation);

// 3. Blog article managers
router.get('/blog', requirePermission('manage_blog'), adminGetArticles);
router.post('/blog', requirePermission('manage_blog'), validateRequest(blogArticleSchema), createArticle);
router.put('/blog/:id', requirePermission('manage_blog'), validateRequest(blogArticleSchema), updateArticle);
router.delete('/blog/:id', requirePermission('manage_blog'), deleteArticle);

// 4. Services list CRUD
router.get('/services', adminGetServices);
router.post('/services', requirePermission('edit_settings'), validateRequest(serviceSchema), createService);
router.put('/services/:id', requirePermission('edit_settings'), validateRequest(serviceSchema), updateService);
router.delete('/services/:id', requirePermission('edit_settings'), deleteService);

// 5. FAQ list CRUD
router.get('/faqs', adminGetFAQs);
router.post('/faqs', requirePermission('edit_settings'), validateRequest(faqSchema), createFAQ);
router.put('/faqs/:id', requirePermission('edit_settings'), validateRequest(faqSchema), updateFAQ);
router.delete('/faqs/:id', requirePermission('edit_settings'), deleteFAQ);

// 6. Testimonial list CRUD
router.get('/testimonials', adminGetTestimonials);
router.post('/testimonials', requirePermission('edit_settings'), validateRequest(testimonialSchema), createTestimonial);
router.put('/testimonials/:id', requirePermission('edit_settings'), validateRequest(testimonialSchema), updateTestimonial);
router.delete('/testimonials/:id', requirePermission('edit_settings'), deleteTestimonial);

// 7. Site configurations
router.put('/settings', requirePermission('edit_settings'), updateSettings);

// 8. Administrative User Roles & RBAC (Super Admin only)
router.get('/users', requireSuperAdmin, getUsers);
router.post('/users', requireSuperAdmin, validateRequest(createUserSchema), createUser);
router.put('/users/:id', requireSuperAdmin, validateRequest(updateUserSchema), updateUser);
router.get('/roles', requireSuperAdmin, getRoles);
router.delete('/users/:id', requireSuperAdmin, deleteUser);

// 9. Media Library operations
router.get('/media', requireAnyPermission('manage_blog', 'edit_settings'), getMediaFiles);
router.post('/media', requireAnyPermission('manage_blog', 'edit_settings'), uploadMediaFile);
router.delete('/media/:fileName', requireAnyPermission('manage_blog', 'edit_settings'), deleteMediaFile);

export default router;
