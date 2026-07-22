"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const testimonialController_1 = require("../controllers/testimonialController");
const faqController_1 = require("../controllers/faqController");
const settingController_1 = require("../controllers/settingController");
const blogController_1 = require("../controllers/blogController");
const consultationController_1 = require("../controllers/consultationController");
const upload_1 = require("../middlewares/upload");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const validator_middleware_1 = require("../middlewares/validator.middleware");
const consultationValidator_1 = require("../validators/consultationValidator");
const swagger_1 = require("../utils/swagger");
const router = (0, express_1.Router)();
// Expose OpenAPI specs
router.get('/api-docs', (req, res) => res.json(swagger_1.swaggerSpec));
// Apply public rate limits
router.use(rateLimiter_1.publicLimiter);
// General configuration getters
router.get('/services', serviceController_1.getServices);
router.get('/testimonials', testimonialController_1.getTestimonials);
router.get('/faqs', faqController_1.getFAQs);
router.get('/settings', settingController_1.getSettings);
// Blog getters
router.get('/blog', blogController_1.getArticles);
router.get('/blog/categories', blogController_1.getCategories);
router.get('/blog/:slug', blogController_1.getArticleBySlug);
// Consultation client submissions
router.post('/consultations', rateLimiter_1.consultationLimiter, upload_1.multerUpload, upload_1.validateUploadLimits, (0, validator_middleware_1.validateRequest)(consultationValidator_1.consultationSubmitSchema), consultationController_1.submitConsultation);
router.post('/consultations-sync', rateLimiter_1.consultationLimiter, (0, validator_middleware_1.validateRequest)(consultationValidator_1.consultationSyncSchema), consultationController_1.syncOfflineConsultation);
exports.default = router;
