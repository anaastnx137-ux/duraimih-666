"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteService = exports.updateService = exports.createService = exports.adminGetServices = exports.getServices = void 0;
const service_repository_1 = require("../repositories/service.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * GET /api/services
 */
const getServices = async (req, res, next) => {
    try {
        const services = await service_repository_1.serviceRepository.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, services });
    }
    catch (e) {
        next(e);
    }
};
exports.getServices = getServices;
/**
 * GET /api/admin/services
 */
const adminGetServices = async (req, res, next) => {
    try {
        const services = await service_repository_1.serviceRepository.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, services });
    }
    catch (e) {
        next(e);
    }
};
exports.adminGetServices = adminGetServices;
/**
 * POST /api/admin/services
 */
const createService = async (req, res, next) => {
    try {
        const data = req.body;
        // Verify slug is unique
        const existing = await service_repository_1.serviceRepository.findBySlug(data.slug);
        if (existing) {
            return next(new error_middleware_1.AppError(400, 'CONFLICT', 'Service slug already in use.'));
        }
        const service = await service_repository_1.serviceRepository.create({ data });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'CREATE_SERVICE', req.ip || null, req.headers['user-agent'] || null, undefined, JSON.stringify(service), `Created service: ${data.titleAr}`);
        return res.status(201).json({ success: true, service });
    }
    catch (e) {
        next(e);
    }
};
exports.createService = createService;
/**
 * PUT /api/admin/services/:id
 */
const updateService = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const service = await service_repository_1.serviceRepository.findUnique({ where: { id } });
        if (!service) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Service not found.'));
        }
        // Verify slug is unique if changed
        if (service.slug !== data.slug) {
            const existing = await service_repository_1.serviceRepository.findBySlug(data.slug);
            if (existing) {
                return next(new error_middleware_1.AppError(400, 'CONFLICT', 'Service slug already in use.'));
            }
        }
        const updated = await service_repository_1.serviceRepository.update({
            where: { id },
            data
        });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_SERVICE', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(service), JSON.stringify(updated), `Updated service ID: ${id}`);
        return res.json({ success: true, service: updated });
    }
    catch (e) {
        next(e);
    }
};
exports.updateService = updateService;
/**
 * DELETE /api/admin/services/:id
 */
const deleteService = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const service = await service_repository_1.serviceRepository.findUnique({ where: { id } });
        if (!service) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Service not found.'));
        }
        await service_repository_1.serviceRepository.delete({ where: { id } });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_SERVICE', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(service), undefined, `Deleted service: ${service.titleAr}`);
        return res.json({ success: true, message: 'Service deleted successfully.' });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteService = deleteService;
