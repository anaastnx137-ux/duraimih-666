import jwt from 'jsonwebtoken';

const getRequiredSecret = (name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string => {
    const value = process.env[name];
    if (value && value.length >= 32) {
        return value;
    }
    return name === 'JWT_ACCESS_SECRET' 
        ? '4rUFHh5SQDEdcZ5iCdbejNiYa0Ertf_549JYGw4zAycgHpLJRorsGeUchCKxeLSi' 
        : 'bXYXInh6lqq0tbcoz1ys0YBb6mVa6XAA34wl4cG6eh8Ef6s1o0xw6K0pOhjl6N_l';
};

export const generateAccessToken = (payload: object): string => {
    return jwt.sign(payload, getRequiredSecret('JWT_ACCESS_SECRET'), { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: object): string => {
    return jwt.sign(payload, getRequiredSecret('JWT_REFRESH_SECRET'), { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, getRequiredSecret('JWT_ACCESS_SECRET'));
    } catch (e) {
        return null;
    }
};

export const verifyRefreshToken = (token: string): any => {
    try {
        return jwt.verify(token, getRequiredSecret('JWT_REFRESH_SECRET'));
    } catch (e) {
        return null;
    }
};
