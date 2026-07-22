import { Request, Response, NextFunction } from 'express';
import { serviceRepository } from '../repositories/service.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';

/**
 * GET /api/services
 */
export const getServices = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const services = await serviceRepository.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, services });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/services
 */
export const adminGetServices = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const services = await serviceRepository.findMany({
            orderBy: { orderIndex: 'asc' }
        });
        return res.json({ success: true, services });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/services
 */
export const createService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        // Verify slug is unique
        const existing = await serviceRepository.findBySlug(data.slug);
        if (existing) {
            return next(new AppError(400, 'CONFLICT', 'Service slug already in use.'));
        }

        const service = await serviceRepository.create({ data });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'CREATE_SERVICE',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            JSON.stringify(service),
            `Created service: ${data.titleAr}`
        );

        return res.status(201).json({ success: true, service });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/services/:id
 */
export const updateService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const service = await serviceRepository.findUnique({ where: { id } });
        if (!service) {
            return next(new AppError(404, 'NOT_FOUND', 'Service not found.'));
        }

        // Verify slug is unique if changed
        if (service.slug !== data.slug) {
            const existing = await serviceRepository.findBySlug(data.slug);
            if (existing) {
                return next(new AppError(400, 'CONFLICT', 'Service slug already in use.'));
            }
        }

        const updated = await serviceRepository.update({
            where: { id },
            data
        });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'UPDATE_SERVICE',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(service),
            JSON.stringify(updated),
            `Updated service ID: ${id}`
        );

        return res.json({ success: true, service: updated });
    } catch (e) {
        next(e);
    }
};

/**
 * DELETE /api/admin/services/:id
 */
export const deleteService = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const service = await serviceRepository.findUnique({ where: { id } });
        if (!service) {
            return next(new AppError(404, 'NOT_FOUND', 'Service not found.'));
        }

        await serviceRepository.delete({ where: { id } });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_SERVICE',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(service),
            undefined,
            `Deleted service: ${service.titleAr}`
        );

        return res.json({ success: true, message: 'Service deleted successfully.' });
    } catch (e) {
        next(e);
    }
};
