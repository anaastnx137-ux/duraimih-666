import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AuthenticatedRequest } from '../middlewares/auth';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { comparePassword } from '../utils/passwordHasher';
import { AppError } from '../middlewares/error.middleware';

/**
 * GET /api/admin/dashboard (Admin Protected)
 */
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [
            todaysConsultations,
            monthlyConsultations,
            openCases,
            closedCases,
            articlesCount,
            servicesCount,
            faqsCount,
            testimonialsCount,
            usersCount,
            storageSum,
            recentLogs,
            latestConsultations
        ] = await Promise.all([
            prisma.consultation.count({ where: { createdAt: { gte: startOfToday } } }),
            prisma.consultation.count({ where: { createdAt: { gte: startOfMonth } } }),
            prisma.consultation.count({ where: { status: { in: ['New', 'In Review', 'Scheduled'] } } }),
            prisma.consultation.count({ where: { status: 'Closed' } }),
            prisma.blogArticle.count(),
            prisma.service.count(),
            prisma.fAQ.count(),
            prisma.testimonial.count(),
            prisma.user.count(),
            prisma.consultationFile.aggregate({ _sum: { fileSize: true } }),
            auditLogRepository.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { fullName: true, email: true } } }
            }),
            prisma.consultation.findMany({
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
            const count = await prisma.consultation.count({
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
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/logs (Admin Protected)
 */
export const getActivityLogs = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { page = '1', limit = '20', search } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const whereClause: any = {};

        if (search) {
            whereClause.OR = [
                { action: { contains: search as string } },
                { details: { contains: search as string } },
                { oldValue: { contains: search as string } },
                { newValue: { contains: search as string } },
                { user: { fullName: { contains: search as string } } },
                { user: { email: { contains: search as string } } }
            ];
        }

        const [logs, total] = await Promise.all([
            auditLogRepository.findMany({
                where: whereClause,
                include: {
                    user: { select: { id: true, fullName: true, email: true, role: { select: { name: true } } } }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum
            }),
            auditLogRepository.count({ where: whereClause })
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
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/notifications (Admin Protected)
 */
export const getNotifications = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await prisma.notification.findMany({
            take: 50,
            orderBy: { createdAt: 'desc' }
        });
        return res.json({
            success: true,
            notifications
        });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/notifications/mark-read (Admin Protected)
 */
export const markAllNotificationsRead = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        await prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        return res.json({
            success: true,
            message: 'All notifications marked as read.'
        });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/verify-password (Admin Protected)
 */
export const verifyPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { password } = req.body;
        if (!password) {
            return next(new AppError(400, 'VALIDATION_ERROR', 'Password is required.'));
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user?.id }
        });

        if (!user) {
            return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        }

        const isMatch = comparePassword(password, user.passwordHash);
        if (!isMatch) {
            return res.json({ success: false, message: 'كلمة المرور غير صحيحة.' });
        }

        return res.json({ success: true });
    } catch (e) {
        next(e);
    }
};
