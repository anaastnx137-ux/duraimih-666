import { Request, Response, NextFunction } from 'express';
import { testimonialRepository } from '../repositories/testimonial.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';

/**
 * GET /api/testimonials
 */
export const getTestimonials = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialRepository.findMany({
            where: { isActive: true },
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, testimonials });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/testimonials
 */
export const adminGetTestimonials = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const testimonials = await testimonialRepository.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return res.json({ success: true, testimonials });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/testimonials
 */
export const createTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const testimonial = await testimonialRepository.create({ data });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'CREATE_TESTIMONIAL',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            JSON.stringify(testimonial),
            `Created testimonial for: ${data.clientNameAr}`
        );

        return res.status(201).json({ success: true, testimonial });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/testimonials/:id
 */
export const updateTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const testimonial = await testimonialRepository.findUnique({ where: { id } });
        if (!testimonial) {
            return next(new AppError(404, 'NOT_FOUND', 'Testimonial not found.'));
        }

        const updated = await testimonialRepository.update({
            where: { id },
            data
        });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'UPDATE_TESTIMONIAL',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(testimonial),
            JSON.stringify(updated),
            `Updated testimonial ID: ${id}`
        );

        return res.json({ success: true, testimonial: updated });
    } catch (e) {
        next(e);
    }
};

/**
 * DELETE /api/admin/testimonials/:id
 */
export const deleteTestimonial = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const testimonial = await testimonialRepository.findUnique({ where: { id } });
        if (!testimonial) {
            return next(new AppError(404, 'NOT_FOUND', 'Testimonial not found.'));
        }

        await testimonialRepository.delete({ where: { id } });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_TESTIMONIAL',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(testimonial),
            undefined,
            `Deleted testimonial for: ${testimonial.clientNameAr}`
        );

        return res.json({ success: true, message: 'Testimonial deleted successfully.' });
    } catch (e) {
        next(e);
    }
};
