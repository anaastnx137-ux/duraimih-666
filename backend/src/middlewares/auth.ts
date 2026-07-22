import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwtHelper';
import prisma from '../config/db';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        email: string;
        role: string;
        permissions: string[];
    };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access token required.' });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired access token.' });
    }

    try {
        // Fetch user from DB to confirm they are active and get current permissions
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: { permission: true }
                        }
                    }
                },
                userPermissions: {
                    include: { permission: true }
                }
            }
        });

        if (!user || !user.isActive) {
            return res.status(403).json({ status: 'error', message: 'User is inactive or deleted.' });
        }

        // Combine role permissions and user-specific permissions
        const rolePerms = user.role.rolePermissions.map((rp: any) => rp.permission.name);
        const userPerms = user.userPermissions.map((up: any) => up.permission.name);
        const allPermissions = Array.from(new Set([...rolePerms, ...userPerms]));

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role.name,
            permissions: allPermissions
        };

        next();
    } catch (e) {
        return res.status(500).json({ status: 'error', message: 'Internal authentication error.' });
    }
};

// Check if user has required permissions for route
export const requirePermission = (permissionName: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'Authentication required.' });
        }

        // Super Admin bypasses all checks
        if (req.user.role === 'Super Admin') {
            return next();
        }

        if (!req.user.permissions.includes(permissionName)) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: You do not have permission to perform this action.'
            });
        }

        next();
    };
};

export const requireAnyPermission = (...permissionNames: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ status: 'error', message: 'Authentication required.' });
        }

        if (req.user.role === 'Super Admin') {
            return next();
        }

        if (!permissionNames.some(permission => req.user?.permissions.includes(permission))) {
            return res.status(403).json({
                status: 'error',
                message: 'Forbidden: You do not have permission to perform this action.'
            });
        }

        next();
    };
};

export const requireSuperAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({ status: 'error', message: 'Authentication required.' });
    }

    if (req.user.role !== 'Super Admin') {
        return res.status(403).json({
            status: 'error',
            message: 'Forbidden: Only Super Admin can perform this action.'
        });
    }

    next();
};
