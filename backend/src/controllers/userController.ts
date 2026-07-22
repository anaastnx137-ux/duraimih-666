import { Response, NextFunction } from 'express';
import prisma from '../config/db';
import { userRepository } from '../repositories/user.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';
import { hashPassword } from '../utils/passwordHasher';

/**
 * GET /api/admin/users (Admin Protected - Super Admin only)
 */
export const getUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const users = await userRepository.findMany({
            include: {
                role: { select: { name: true, description: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Strip passwords
        const safeUsers = users.map(u => {
            const { passwordHash, ...rest } = u;
            return rest;
        });

        return res.json({
            success: true,
            users: safeUsers
        });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/users (Admin Protected - Super Admin only)
 */
export const createUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        // Check if email already registered
        const existing = await userRepository.findByEmail(data.email);
        if (existing) {
            return next(new AppError(400, 'CONFLICT', 'Email address already registered.'));
        }

        // Limit Super Admin count to maximum 2
        const targetRole = await prisma.role.findUnique({ where: { id: data.roleId } });
        if (targetRole && targetRole.name === 'Super Admin') {
            const superAdminCount = await prisma.user.count({
                where: { role: { name: 'Super Admin' } }
            });
            if (superAdminCount >= 2) {
                return next(new AppError(400, 'BAD_REQUEST', 'يسمح بوجود حسابين لمدير عام (Super Admin) كحد أقصى في النظام.'));
            }
        }

        // Encrypt password
        const passwordHash = hashPassword(data.password);

        const newUser = await userRepository.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                passwordHash,
                roleId: data.roleId,
                isActive: data.isActive
            },
            include: { role: true }
        });

        // Log action
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'CREATE_USER',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            JSON.stringify({ id: newUser.id, email: newUser.email, role: (newUser as any).role?.name }),
            `Created admin user: ${data.email}`
        );

        const { passwordHash: _, ...safeUser } = newUser;
        return res.status(201).json({
            success: true,
            user: safeUser
        });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/users/:id (Admin Protected - Super Admin only)
 */
export const updateUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = { ...req.body };

        const user = await userRepository.findUnique({ where: { id } });
        if (!user) {
            return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        }

        // Prevent Super Admin from deactivating their own account
        if (user.id === req.user?.id && data.isActive === false) {
            return next(new AppError(400, 'BAD_REQUEST', 'You cannot deactivate your own account.'));
        }

        // Prevent modifying role or status of primary fixed Super Admin account
        const primaryAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@alduraymih-law.sa';
        const isPrimaryAdmin = user.id === 1 || user.email.toLowerCase() === primaryAdminEmail;

        if (isPrimaryAdmin) {
            if (data.roleId) {
                const targetRole = await prisma.role.findUnique({ where: { id: data.roleId } });
                if (targetRole && targetRole.name !== 'Super Admin') {
                    return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن تغيير دور حساب المدير العام الرئيسي الثابت.'));
                }
            }
            if (data.isActive === false) {
                return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن إلغاء تنشيط حساب المدير العام الرئيسي الثابت.'));
            }
        }

        // Check if role is being changed to Super Admin
        if (data.roleId) {
            const targetRole = await prisma.role.findUnique({ where: { id: data.roleId } });
            if (targetRole && targetRole.name === 'Super Admin') {
                const currentUserRole = await prisma.role.findUnique({ where: { id: user.roleId } });
                if (currentUserRole?.name !== 'Super Admin') {
                    const superAdminCount = await prisma.user.count({
                        where: { role: { name: 'Super Admin' } }
                    });
                    if (superAdminCount >= 2) {
                        return next(new AppError(400, 'BAD_REQUEST', 'يسمح بوجود حسابين لمدير عام (Super Admin) كحد أقصى في النظام.'));
                    }
                }
            }

            // Prevent changing the role of the only Super Admin to something else
            const currentUserRole = await prisma.role.findUnique({ where: { id: user.roleId } });
            if (currentUserRole?.name === 'Super Admin' && targetRole?.name !== 'Super Admin') {
                const superAdminCount = await prisma.user.count({
                    where: { role: { name: 'Super Admin' } }
                });
                if (superAdminCount <= 1) {
                    return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن تغيير دور هذا المستخدم لأنه حساب المدير العام (Super Admin) الوحيد المتبقي بالنظام.'));
                }
            }
        }

        // Prevent deactivating the only Super Admin
        if (data.isActive === false) {
            const currentUserRole = await prisma.role.findUnique({ where: { id: user.roleId } });
            if (currentUserRole?.name === 'Super Admin') {
                const superAdminCount = await prisma.user.count({
                    where: { role: { name: 'Super Admin' }, isActive: true }
                });
                if (superAdminCount <= 1) {
                    return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن إلغاء تنشيط حساب المدير العام (Super Admin) الوحيد النشط بالنظام.'));
                }
            }
        }

        // Email uniqueness check
        if (data.email && data.email !== user.email) {
            const existing = await userRepository.findByEmail(data.email);
            if (existing) {
                return next(new AppError(400, 'CONFLICT', 'Email address already in use.'));
            }
        }

        // Handle password hashing if provided
        if (data.password) {
            data.passwordHash = hashPassword(data.password);
            delete data.password;
        }

        const updated = await userRepository.update({
            where: { id },
            data,
            include: { role: true }
        });

        // Log action
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'UPDATE_USER',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify({ fullName: user.fullName, isActive: user.isActive, roleId: user.roleId }),
            JSON.stringify({ fullName: updated.fullName, isActive: updated.isActive, roleId: updated.roleId }),
            `Updated user ID: ${id}`
        );

        const { passwordHash: _, ...safeUser } = updated;
        return res.json({
            success: true,
            user: safeUser
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/roles (Admin Protected)
 */
export const getRoles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const roles = await prisma.role.findMany();
        return res.json({ success: true, roles });
    } catch (e) {
        next(e);
    }
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const user = await userRepository.findUnique({
            where: { id },
            include: { role: true }
        });
        if (!user) {
            return next(new AppError(404, 'NOT_FOUND', 'User not found.'));
        }

        // Prevent user from deleting themselves
        if (user.id === req.user?.id) {
            return next(new AppError(400, 'BAD_REQUEST', 'لا يمكنك حذف حسابك الخاص.'));
        }

        // Prevent deletion of the primary fixed Super Admin account (id 1 or primary admin email)
        const primaryAdminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() || 'admin@alduraymih-law.sa';
        if (user.id === 1 || user.email.toLowerCase() === primaryAdminEmail) {
            return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن حذف حساب المدير العام (Super Admin) الرئيسي الثابت بالنظام.'));
        }

        // Prevent deletion of the last Super Admin account
        if ((user as any).role?.name === 'Super Admin') {
            const superAdminCount = await prisma.user.count({
                where: { role: { name: 'Super Admin' } }
            });
            if (superAdminCount <= 1) {
                return next(new AppError(400, 'BAD_REQUEST', 'لا يمكن حذف حساب المدير العام (Super Admin) الوحيد المتبقي بالنظام.'));
            }
        }

        await userRepository.delete({ where: { id } });

        // Log action
        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_USER',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify({ id: user.id, email: user.email }),
            undefined,
            `Deleted user ID: ${id} (${user.email})`
        );

        return res.json({
            success: true,
            message: 'User deleted successfully.'
        });
    } catch (e) {
        next(e);
    }
};
