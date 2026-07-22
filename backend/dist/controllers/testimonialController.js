"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTestimonial = exports.updateTestimonial = exports.createTestimonial = exports.adminGetTestimonials = exports.getTestimonials = void 0;
const testimonial_repository_1 = require("../repositories/testimonial.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * GET /api/testimonials
 */
const getTestimonials = async (req, res, next) => {
    try {
        const testimonials = await testimonial_repository_1.testimonialRepository.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, testimonials });
    }
    catch (e) {
        next(e);
    }
};
exports.getTestimonials = getTestimonials;
/**
 * GET /api/admin/testimonials
 */
const adminGetTestimonials = async (req, res, next) => {
    try {
        const testimonials = await testimonial_repository_1.testimonialRepository.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, testimonials });
    }
    catch (e) {
        next(e);
    }
};
exports.adminGetTestimonials = adminGetTestimonials;
/**
 * POST /api/admin/testimonials
 */
const createTestimonial = async (req, res, next) => {
    try {
        const data = req.body;
        const testimonial = await testimonial_repository_1.testimonialRepository.create({ data });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'CREATE_TESTIMONIAL', req.ip || null, req.headers['user-agent'] || null, undefined, JSON.stringify(testimonial), `Created testimonial for: ${data.clientNameAr}`);
        return res.status(201).json({ success: true, testimonial });
    }
    catch (e) {
        next(e);
    }
};
exports.createTestimonial = createTestimonial;
/**
 * PUT /api/admin/testimonials/:id
 */
const updateTestimonial = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const testimonial = await testimonial_repository_1.testimonialRepository.findUnique({ where: { id } });
        if (!testimonial) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Testimonial not found.'));
        }
        const updated = await testimonial_repository_1.testimonialRepository.update({
            where: { id },
            data
        });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_TESTIMONIAL', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(testimonial), JSON.stringify(updated), `Updated testimonial ID: ${id}`);
        return res.json({ success: true, testimonial: updated });
    }
    catch (e) {
        next(e);
    }
};
exports.updateTestimonial = updateTestimonial;
/**
 * DELETE /api/admin/testimonials/:id
 */
const deleteTestimonial = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const testimonial = await testimonial_repository_1.testimonialRepository.findUnique({ where: { id } });
        if (!testimonial) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Testimonial not found.'));
        }
        await testimonial_repository_1.testimonialRepository.delete({ where: { id } });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_TESTIMONIAL', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(testimonial), undefined, `Deleted testimonial for: ${testimonial.clientNameAr}`);
        return res.json({ success: true, message: 'Testimonial deleted successfully.' });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteTestimonial = deleteTestimonial;
