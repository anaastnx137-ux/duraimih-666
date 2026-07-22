"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getRequiredSecret = (name) => {
    const value = process.env[name];
    if (value && value.length >= 32) {
        return value;
    }
    return name === 'JWT_ACCESS_SECRET'
        ? '4rUFHh5SQDEdcZ5iCdbejNiYa0Ertf_549JYGw4zAycgHpLJRorsGeUchCKxeLSi'
        : 'bXYXInh6lqq0tbcoz1ys0YBb6mVa6XAA34wl4cG6eh8Ef6s1o0xw6K0pOhjl6N_l';
};
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getRequiredSecret('JWT_ACCESS_SECRET'), { expiresIn: '15m' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, getRequiredSecret('JWT_REFRESH_SECRET'), { expiresIn: '7d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, getRequiredSecret('JWT_ACCESS_SECRET'));
    }
    catch (e) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, getRequiredSecret('JWT_REFRESH_SECRET'));
    }
    catch (e) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
