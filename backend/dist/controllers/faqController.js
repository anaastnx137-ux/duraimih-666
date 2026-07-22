"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFAQ = exports.updateFAQ = exports.createFAQ = exports.adminGetFAQs = exports.getFAQs = void 0;
const faq_repository_1 = require("../repositories/faq.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * GET /api/faqs
 */
const getFAQs = async (req, res, next) => {
    try {
        const faqs = await faq_repository_1.faqRepository.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, faqs });
    }
    catch (e) {
        next(e);
    }
};
exports.getFAQs = getFAQs;
/**
 * GET /api/admin/faqs
 */
const adminGetFAQs = async (req, res, next) => {
    try {
        const faqs = await faq_repository_1.faqRepository.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, faqs });
    }
    catch (e) {
        next(e);
    }
};
exports.adminGetFAQs = adminGetFAQs;
/**
 * POST /api/admin/faqs
 */
const createFAQ = async (req, res, next) => {
    try {
        const data = req.body;
        const faq = await faq_repository_1.faqRepository.create({ data });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'CREATE_FAQ', req.ip || null, req.headers['user-agent'] || null, undefined, JSON.stringify(faq), `Created FAQ: ${data.questionAr.substring(0, 50)}...`);
        return res.status(201).json({ success: true, faq });
    }
    catch (e) {
        next(e);
    }
};
exports.createFAQ = createFAQ;
/**
 * PUT /api/admin/faqs/:id
 */
const updateFAQ = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const faq = await faq_repository_1.faqRepository.findUnique({ where: { id } });
        if (!faq) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'FAQ not found.'));
        }
        const updated = await faq_repository_1.faqRepository.update({
            where: { id },
            data
        });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_FAQ', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(faq), JSON.stringify(updated), `Updated FAQ ID: ${id}`);
        return res.json({ success: true, faq: updated });
    }
    catch (e) {
        next(e);
    }
};
exports.updateFAQ = updateFAQ;
/**
 * DELETE /api/admin/faqs/:id
 */
const deleteFAQ = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const faq = await faq_repository_1.faqRepository.findUnique({ where: { id } });
        if (!faq) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'FAQ not found.'));
        }
        await faq_repository_1.faqRepository.delete({ where: { id } });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_FAQ', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(faq), undefined, `Deleted FAQ: ${faq.questionAr.substring(0, 50)}...`);
        return res.json({ success: true, message: 'FAQ deleted successfully.' });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteFAQ = deleteFAQ;
