"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSettings = exports.getSettings = void 0;
const db_1 = __importDefault(require("../config/db"));
const setting_repository_1 = require("../repositories/setting.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * GET /api/settings
 */
const getSettings = async (req, res, next) => {
    try {
        const settingsMap = await setting_repository_1.settingRepository.getSettingsKeyValueMap();
        return res.json({
            success: true,
            settings: settingsMap
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getSettings = getSettings;
/**
 * PUT /api/admin/settings
 */
const updateSettings = async (req, res, next) => {
    try {
        const { settings } = req.body;
        if (!settings || typeof settings !== 'object') {
            return next(new error_middleware_1.AppError(400, 'VALIDATION_ERROR', 'Settings record payload is missing.'));
        }
        const oldSettings = await setting_repository_1.settingRepository.getSettingsKeyValueMap();
        await db_1.default.$transaction(async (tx) => {
            for (const [key, value] of Object.entries(settings)) {
                await tx.websiteSetting.upsert({
                    where: { key },
                    update: { value: String(value) },
                    create: { key, value: String(value) }
                });
            }
            // Log administrative action
            await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_SETTINGS', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(oldSettings), JSON.stringify(settings), `Updated website settings keys: ${Object.keys(settings).join(', ')}`);
        });
        return res.json({
            success: true,
            message: 'Settings updated successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateSettings = updateSettings;
