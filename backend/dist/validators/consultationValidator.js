"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationUpdateSchema = exports.consultationSyncSchema = exports.consultationSubmitSchema = void 0;
const zod_1 = require("zod");
exports.consultationSubmitSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().trim().min(3, 'الاسم يجب أن يكون ٣ أحرف على الأقل / Name must be at least 3 characters.').max(120),
        phone: zod_1.z.string().trim().regex(/^(00966|\+966|966|0)?5[0-9]{8}$/, 'رقم الجوال غير صحيح / Phone number is invalid.'),
        email: zod_1.z.string().email('البريد الإلكتروني غير صحيح / Email is invalid.').optional().or(zod_1.z.literal('')),
        company: zod_1.z.string().max(255).optional().nullable(),
        service: zod_1.z.string().max(100).optional().nullable(),
        message: zod_1.z.string().trim().min(5, 'تفاصيل الرسالة يجب أن تكون ٥ أحرف على الأقل / Message must be at least 5 characters.').max(5000),
        language: zod_1.z.enum(['ar', 'en']).default('ar'),
        theme: zod_1.z.enum(['dark', 'light']).default('dark'),
        priority: zod_1.z.enum(['Normal', 'Urgent', 'Emergency']).default('Normal'),
        // Telemetry fields
        ipAddress: zod_1.z.string().max(45).optional().nullable(),
        browser: zod_1.z.string().max(100).optional().nullable(),
        device: zod_1.z.string().max(50).optional().nullable(),
        screenResolution: zod_1.z.string().max(20).optional().nullable(),
        timezone: zod_1.z.string().max(100).optional().nullable(),
        pageUrl: zod_1.z.string().optional().nullable(),
        referrer: zod_1.z.string().optional().nullable()
    })
});
exports.consultationSyncSchema = zod_1.z.object({
    body: zod_1.z.object({
        referenceId: zod_1.z.string().regex(/^LAW-[A-Za-z0-9-]{6,50}$/),
        fullName: zod_1.z.string().trim().min(3).max(120),
        phone: zod_1.z.string().trim().regex(/^(00966|\+966|966|0)?5[0-9]{8}$/),
        service: zod_1.z.string().max(100).optional().nullable(),
        message: zod_1.z.string().trim().min(5).max(5000),
        language: zod_1.z.enum(['ar', 'en']).default('ar'),
        priority: zod_1.z.enum(['Normal', 'Urgent', 'Emergency']).default('Normal')
    })
});
exports.consultationUpdateSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(['New', 'In Review', 'Scheduled', 'Closed']),
        priority: zod_1.z.enum(['Normal', 'Urgent', 'Emergency']).optional(),
        assignedUserId: zod_1.z.number().int().nullable().optional(),
        notes: zod_1.z.string().optional()
    })
});
