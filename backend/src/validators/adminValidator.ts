import { z } from 'zod';

export const faqSchema = z.object({
    body: z.object({
        questionAr: z.string().min(1, 'Arabic question is required.'),
        questionEn: z.string().min(1, 'English question is required.'),
        answerAr: z.string().min(1, 'Arabic answer is required.'),
        answerEn: z.string().min(1, 'English answer is required.'),
        isActive: z.boolean().default(true),
        orderIndex: z.number().int().default(0)
    })
});

export const testimonialSchema = z.object({
    body: z.object({
        clientNameAr: z.string().min(1, 'Arabic client name is required.'),
        clientNameEn: z.string().min(1, 'English client name is required.'),
        companyAr: z.string().nullable().optional(),
        companyEn: z.string().nullable().optional(),
        contentAr: z.string().min(1, 'Arabic review content is required.'),
        contentEn: z.string().min(1, 'English review content is required.'),
        rating: z.number().int().min(1).max(5).default(5),
        isActive: z.boolean().default(true)
    })
});

export const serviceSchema = z.object({
    body: z.object({
        slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric and hyphens only.'),
        titleAr: z.string().min(1, 'Arabic title is required.'),
        titleEn: z.string().min(1, 'English title is required.'),
        descriptionAr: z.string().min(1, 'Arabic description is required.'),
        descriptionEn: z.string().min(1, 'English description is required.'),
        icon: z.string().default('fa-scale-balanced'),
        isActive: z.boolean().default(true),
        orderIndex: z.number().int().default(0)
    })
});

export const blogArticleSchema = z.object({
    body: z.object({
        categoryId: z.number().int().nullable().optional(),
        slug: z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens only.'),
        titleAr: z.string().min(1, 'Arabic title is required.'),
        titleEn: z.string().min(1, 'English title is required.'),
        excerptAr: z.string().min(1, 'Arabic excerpt is required.'),
        excerptEn: z.string().min(1, 'English excerpt is required.'),
        contentAr: z.string().min(1, 'Arabic content is required.'),
        contentEn: z.string().min(1, 'English content is required.'),
        icon: z.string().default('fa-scroll'),
        imagePath: z.string().nullable().optional(),
        keywords: z.array(z.string()).default([]),
        tags: z.array(z.string()).default([]),
        readTimeAr: z.string().nullable().optional(),
        readTimeEn: z.string().nullable().optional(),
        status: z.enum(['Draft', 'Published']).default('Draft'),
        isFeatured: z.boolean().default(false)
    })
});

export const createUserSchema = z.object({
    body: z.object({
        fullName: z.string().min(3, 'Name must be at least 3 characters.'),
        email: z.string().email('Invalid email address format.'),
        password: z.string().min(12, 'Password must be at least 12 characters long.'),
        roleId: z.number().int(),
        isActive: z.boolean().default(true)
    })
});

export const updateUserSchema = z.object({
    body: z.object({
        fullName: z.string().min(3).optional(),
        email: z.string().email('Invalid email address format.').optional(),
        password: z.string().min(12, 'Password must be at least 12 characters long.').optional(),
        roleId: z.number().int().optional(),
        isActive: z.boolean().optional()
    })
});