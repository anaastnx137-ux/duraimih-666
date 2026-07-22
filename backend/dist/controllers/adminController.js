"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.markAllNotificationsRead = exports.getNotifications = exports.getActivityLogs = exports.getDashboardStats = void 0;
const db_1 = __importDefault(require("../config/db"));
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const passwordHasher_1 = require("../utils/passwordHasher");
const error_middleware_1 = require("../middlewares/error.middleware");
/**
 * GET /api/admin/dashboard (Admin Protected)
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const [todaysConsultations, monthlyConsultations, openCases, closedCases, articlesCount, servicesCount, faqsCount, testimonialsCount, usersCount, storageSum, recentLogs, latestConsultations] = await Promise.all([
            db_1.default.consultation.count({ where: { createdAt: { gte: startOfToday } } }),
            db_1.default.consultation.count({ where: { createdAt: { gte: startOfMonth } } }),
            db_1.default.consultation.count({ where: { status: { in: ['New', 'In Review', 'Scheduled'] } } }),
            db_1.default.consultation.count({ where: { status: 'Closed' } }),
            db_1.default.blogArticle.count(),
            db_1.default.service.count(),
            db_1.default.fAQ.count(),
            db_1.default.testimonial.count(),
            db_1.default.user.count(),
            db_1.default.consultationFile.aggregate({ _sum: { fileSize: true } }),
            auditLog_repository_1.auditLogRepository.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { fullName: true, email: true } } }
            }),
            db_1.default.consultation.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { files: true }
            })
        ]);
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const label = date.toLocaleString('default', { month: 'short', year: '2-digit' });
            const count = await db_1.default.consultation.count({
                where: {
                    createdAt: {
                        gte: date,
                        lt: nextDate
                    }
                }
            });
            chartData.push({ month: label, consultations: count });
        }
        const totalBytes = storageSum._sum.fileSize || 0;
        const totalMB = (totalBytes / 1024 / 1024).toFixed(2);
        return res.json({
            success: true,
            stats: {
                todaysConsultations,
                monthlyConsultations,
                openCases,
                closedCases,
                articlesCount,
                servicesCount,
                faqsCount,
                testimonialsCount,
                usersCount,
                storageMB: totalMB,
                recentLogs,
                latestConsultations,
                chartData
            }
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getDashboardStats = getDashboardStats;
/**
 * GET /api/admin/logs (Admin Protected)
 */
const getActivityLogs = async (req, res, next) => {
    try {
        const { page = '1', limit = '20', search } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const whereClause = {};
        if (search) {
            whereClause.OR = [
                { action: { contains: search } },
                { details: { contains: search } },
                { oldValue: { contains: search } },
                { newValue: { contains: search } },
                { user: { fullName: { contains: search } } },
                { user: { email: { contains: search } } }
            ];
        }
        const [logs, total] = await Promise.all([
            auditLog_repository_1.auditLogRepository.findMany({
                where: whereClause,
                include: {
                    user: { select: { id: true, fullName: true, email: true, role: { select: { name: true } } } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum
            }),
            auditLog_repository_1.auditLogRepository.count({ where: whereClause })
        ]);
        return res.json({
            success: true,
            logs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getActivityLogs = getActivityLogs;
/**
 * GET /api/admin/notifications (Admin Protected)
 */
const getNotifications = async (req, res, next) => {
    try {
        const notifications = await db_1.default.notification.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' }
        });
        return res.json({
            success: true,
            notifications
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getNotifications = getNotifications;
/**
 * POST /api/admin/notifications/mark-read (Admin Protected)
 */
const markAllNotificationsRead = async (req, res, next) => {
    try {
        await db_1.default.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        return res.json({
            success: true,
            message: 'All notifications marked as read.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.markAllNotificationsRead = markAllNotificationsRead;
/**
 * POST /api/admin/verify-password (Admin Protected)
 */
const verifyPassword = async (req, res, next) => {
    try {
        const { password } = req.body;
        if (!password) {
            return next(new error_middleware_1.AppError(400, 'VALIDATION_ERROR', 'Password is required.'));
        }
        const user = await db_1.default.user.findUnique({
            where: { id: req.user?.id }
        });
        if (!user) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'User not found.'));
        }
        const isMatch = (0, passwordHasher_1.comparePassword)(password, user.passwordHash);
        if (!isMatch) {
            return res.json({ success: false, message: 'كلمة المرور غير صحيحة.' });
        }
        return res.json({ success: true });
    }
    catch (e) {
        next(e);
    }
};
exports.verifyPassword = verifyPassword;
