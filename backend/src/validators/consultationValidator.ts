import { z } from 'zod';

export const consultationSubmitSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(3, 'الاسم يجب أن يكون ٣ أحرف على الأقل / Name must be at least 3 characters.').max(120),
        phone: z.string().trim().regex(/^(00966|\+966|966|0)?5[0-9]{8}$/, 'رقم الجوال غير صحيح / Phone number is invalid.'),
        email: z.string().email('البريد الإلكتروني غير صحيح / Email is invalid.').optional().or(z.literal('')),
        company: z.string().max(255).optional().nullable(),
        service: z.string().max(100).optional().nullable(),
        message: z.string().trim().min(5, 'تفاصيل الرسالة يجب أن تكون ٥ أحرف على الأقل / Message must be at least 5 characters.').max(5000),
        language: z.enum(['ar', 'en']).default('ar'),
        theme: z.enum(['dark', 'light']).default('dark'),
        priority: z.enum(['Normal', 'Urgent', 'Emergency']).default('Normal'),
        
        // Telemetry fields
        ipAddress: z.string().max(45).optional().nullable(),
        browser: z.string().max(100).optional().nullable(),
        device: z.string().max(50).optional().nullable(),
        screenResolution: z.string().max(20).optional().nullable(),
        timezone: z.string().max(100).optional().nullable(),
        pageUrl: z.string().optional().nullable(),
        referrer: z.string().optional().nullable()
    })
});

export const consultationSyncSchema = z.object({
    body: z.object({
        referenceId: z.string().regex(/^LAW-[A-Za-z0-9-]{6,50}$/),
        fullName: z.string().trim().min(3).max(120),
        phone: z.string().trim().regex(/^(00966|\+966|966|0)?5[0-9]{8}$/),
        service: z.string().max(100).optional().nullable(),
        message: z.string().trim().min(5).max(5000),
        language: z.enum(['ar', 'en']).default('ar'),
        priority: z.enum(['Normal', 'Urgent', 'Emergency']).default('Normal')
    })
});

export const consultationUpdateSchema = z.object({
    body: z.object({
        status: z.enum(['New', 'In Review', 'Scheduled', 'Closed']),
        priority: z.enum(['Normal', 'Urgent', 'Emergency']).optional(),
        assignedUserId: z.number().int().nullable().optional(),
        notes: z.string().optional()
    })
});
