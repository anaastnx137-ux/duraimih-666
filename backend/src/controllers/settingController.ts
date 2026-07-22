import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { settingRepository } from '../repositories/setting.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';

/**
 * GET /api/settings
 */
export const getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const settingsMap = await settingRepository.getSettingsKeyValueMap();
        return res.json({
            success: true,
            settings: settingsMap
        });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/settings
 */
export const updateSettings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            return next(new AppError(400, 'VALIDATION_ERROR', 'Settings record payload is missing.'));
        }

        const oldSettings = await settingRepository.getSettingsKeyValueMap();

        await prisma.$transaction(async (tx: any) => {
            for (const [key, value] of Object.entries(settings)) {
                await tx.websiteSetting.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value) }
                });
            }

            // Log administrative action
            await auditLogRepository.logAdminAction(
                req.user?.id || null,
                'UPDATE_SETTINGS',
                req.ip || null,
                req.headers['user-agent'] || null,
                JSON.stringify(oldSettings),
                JSON.stringify(settings),
                `Updated website settings keys: ${Object.keys(settings).join(', ')}`
            );
        });

        return res.json({
            success: true,
            message: 'Settings updated successfully.'
        });
    } catch (e) {
        next(e);
    }
};
