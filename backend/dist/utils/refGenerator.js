"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferenceNumber = void 0;
const generateReferenceNumber = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    // Generate 6 random alphanumeric characters excluding confusing ones
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let random = '';
    for (let i = 0; i < 6; i++) {
        random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `LAW-${yyyy}${mm}${dd}-${random}`;
};
exports.generateReferenceNumber = generateReferenceNumber;
