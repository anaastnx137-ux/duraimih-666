import { Router } from 'express';
import { getServices } from '../controllers/serviceController';
import { getTestimonials } from '../controllers/testimonialController';
import { getFAQs } from '../controllers/faqController';
import { getSettings } from '../controllers/settingController';
import { getArticles, getArticleBySlug, getCategories } from '../controllers/blogController';
import { submitConsultation, syncOfflineConsultation } from '../controllers/consultationController';
import { multerUpload, validateUploadLimits } from '../middlewares/upload';
import { consultationLimiter, publicLimiter } from '../middlewares/rateLimiter';
import { validateRequest } from '../middlewares/validator.middleware';
import { consultationSubmitSchema, consultationSyncSchema } from '../validators/consultationValidator';
import { swaggerSpec } from '../utils/swagger';

const router = Router();

// Expose OpenAPI specs
router.get('/api-docs', (req, res) => res.json(swaggerSpec));

// Apply public rate limits
router.use(publicLimiter);

// General configuration getters
router.get('/services', getServices);
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);
router.get('/settings', getSettings);

// Blog getters
router.get('/blog', getArticles);
router.get('/blog/categories', getCategories);
router.get('/blog/:slug', getArticleBySlug);

// Consultation client submissions
router.post(
    '/consultations',
    consultationLimiter,
    multerUpload,
    validateUploadLimits,
    validateRequest(consultationSubmitSchema),
    submitConsultation
);
router.post(
    '/consultations-sync',
    consultationLimiter,
    validateRequest(consultationSyncSchema),
    syncOfflineConsultation
);

export default router;
