"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireSuperAdmin = exports.requireAnyPermission = exports.requirePermission = exports.authenticateToken = void 0;
const jwtHelper_1 = require("../utils/jwtHelper");
const db_1 = __importDefault(require("../config/db"));
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access token required.' });
    }
    const decoded = (0, jwtHelper_1.verifyAccessToken)(token);
    if (!decoded) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired access token.' });
    }
    try {
        // Fetch user from DB to confirm they are active and get current permissions
        const user = await db_1.default.user.findUnique({
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
        const rolePerms = user.role.rolePermissions.map((rp) => rp.permission.name);
        const userPerms = user.userPermissions.map((up) => up.permission.name);
        const allPermissions = Array.from(new Set([...rolePerms, ...userPerms]));
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role.name,
            permissions: allPermissions
        };
        next();
    }
    catch (e) {
        return res.status(500).json({ status: 'error', message: 'Internal authentication error.' });
    }
};
exports.authenticateToken = authenticateToken;
// Check if user has required permissions for route
const requirePermission = (permissionName) => {
    return (req, res, next) => {
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
exports.requirePermission = requirePermission;
const requireAnyPermission = (...permissionNames) => {
    return (req, res, next) => {
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
exports.requireAnyPermission = requireAnyPermission;
const requireSuperAdmin = (req, res, next) => {
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
exports.requireSuperAdmin = requireSuperAdmin;
