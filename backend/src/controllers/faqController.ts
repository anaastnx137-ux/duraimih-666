import { Request, Response, NextFunction } from 'express';
import { faqRepository } from '../repositories/faq.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';

/**
 * GET /api/faqs
 */
export const getFAQs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faqs = await faqRepository.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, faqs });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/faqs
 */
export const adminGetFAQs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const faqs = await faqRepository.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, faqs });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/faqs
 */
export const createFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body;
        const faq = await faqRepository.create({ data });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'CREATE_FAQ',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            JSON.stringify(faq),
            `Created FAQ: ${data.questionAr.substring(0, 50)}...`
        );

        return res.status(201).json({ success: true, faq });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/faqs/:id
 */
export const updateFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const faq = await faqRepository.findUnique({ where: { id } });
        if (!faq) {
            return next(new AppError(404, 'NOT_FOUND', 'FAQ not found.'));
        }

        const updated = await faqRepository.update({
            where: { id },
            data
        });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'UPDATE_FAQ',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(faq),
            JSON.stringify(updated),
            `Updated FAQ ID: ${id}`
        );

        return res.json({ success: true, faq: updated });
    } catch (e) {
        next(e);
    }
};

/**
 * DELETE /api/admin/faqs/:id
 */
export const deleteFAQ = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const faq = await faqRepository.findUnique({ where: { id } });
        if (!faq) {
            return next(new AppError(404, 'NOT_FOUND', 'FAQ not found.'));
        }

        await faqRepository.delete({ where: { id } });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_FAQ',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(faq),
            undefined,
            `Deleted FAQ: ${faq.questionAr.substring(0, 50)}...`
        );

        return res.json({ success: true, message: 'FAQ deleted successfully.' });
    } catch (e) {
        next(e);
    }
};
