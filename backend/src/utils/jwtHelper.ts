import jwt from 'jsonwebtoken';

const getRequiredSecret = (name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string => {
    const value = process.env[name];
    if (!value || value.length < 32) {
        throw new Error(`${name} must be configured with at least 32 characters.`);
    }
    return value;
};

const accessSecret = getRequiredSecret('JWT_ACCESS_SECRET');
const refreshSecret = getRequiredSecret('JWT_REFRESH_SECRET');

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, accessSecret, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, refreshSecret, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, accessSecret);
    } catch (e) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, refreshSecret);
    } catch (e) {
        return null;
    }
};
