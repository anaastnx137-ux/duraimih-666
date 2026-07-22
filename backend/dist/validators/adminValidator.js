"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = exports.blogArticleSchema = exports.serviceSchema = exports.testimonialSchema = exports.faqSchema = void 0;
const zod_1 = require("zod");
exports.faqSchema = zod_1.z.object({
    body: zod_1.z.object({
        questionAr: zod_1.z.string().min(1, 'Arabic question is required.'),
        questionEn: zod_1.z.string().min(1, 'English question is required.'),
        answerAr: zod_1.z.string().min(1, 'Arabic answer is required.'),
        answerEn: zod_1.z.string().min(1, 'English answer is required.'),
        isActive: zod_1.z.boolean().default(true),
        orderIndex: zod_1.z.number().int().default(0)
    })
});
exports.testimonialSchema = zod_1.z.object({
    body: zod_1.z.object({
        clientNameAr: zod_1.z.string().min(1, 'Arabic client name is required.'),
        clientNameEn: zod_1.z.string().min(1, 'English client name is required.'),
        companyAr: zod_1.z.string().nullable().optional(),
        companyEn: zod_1.z.string().nullable().optional(),
        contentAr: zod_1.z.string().min(1, 'Arabic review content is required.'),
        contentEn: zod_1.z.string().min(1, 'English review content is required.'),
        rating: zod_1.z.number().int().min(1).max(5).default(5),
        isActive: zod_1.z.boolean().default(true)
    })
});
exports.serviceSchema = zod_1.z.object({
    body: zod_1.z.object({
        slug: zod_1.z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric and hyphens only.'),
        titleAr: zod_1.z.string().min(1, 'Arabic title is required.'),
        titleEn: zod_1.z.string().min(1, 'English title is required.'),
        descriptionAr: zod_1.z.string().min(1, 'Arabic description is required.'),
        descriptionEn: zod_1.z.string().min(1, 'English description is required.'),
        icon: zod_1.z.string().default('fa-scale-balanced'),
        isActive: zod_1.z.boolean().default(true),
        orderIndex: zod_1.z.number().int().default(0)
    })
});
exports.blogArticleSchema = zod_1.z.object({
    body: zod_1.z.object({
        categoryId: zod_1.z.number().int().nullable().optional(),
        slug: zod_1.z.string().min(1, 'Slug is required.').regex(/^[a-z0-9-]+$/, 'Slug must be alphanumeric with hyphens only.'),
        titleAr: zod_1.z.string().min(1, 'Arabic title is required.'),
        titleEn: zod_1.z.string().min(1, 'English title is required.'),
        excerptAr: zod_1.z.string().min(1, 'Arabic excerpt is required.'),
        excerptEn: zod_1.z.string().min(1, 'English excerpt is required.'),
        contentAr: zod_1.z.string().min(1, 'Arabic content is required.'),
        contentEn: zod_1.z.string().min(1, 'English content is required.'),
        icon: zod_1.z.string().default('fa-scroll'),
        imagePath: zod_1.z.string().nullable().optional(),
        keywords: zod_1.z.array(zod_1.z.string()).default([]),
        tags: zod_1.z.array(zod_1.z.string()).default([]),
        readTimeAr: zod_1.z.string().nullable().optional(),
        readTimeEn: zod_1.z.string().nullable().optional(),
        status: zod_1.z.enum(['Draft', 'Published']).default('Draft'),
        isFeatured: zod_1.z.boolean().default(false)
    })
});
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(3, 'Name must be at least 3 characters.'),
        email: zod_1.z.string().email('Invalid email address format.'),
        password: zod_1.z.string().min(12, 'Password must be at least 12 characters long.'),
        roleId: zod_1.z.number().int(),
        isActive: zod_1.z.boolean().default(true)
    })
});
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().min(3).optional(),
        email: zod_1.z.string().email('Invalid email address format.').optional(),
        password: zod_1.z.string().min(12, 'Password must be at least 12 characters long.').optional(),
        roleId: zod_1.z.number().int().optional(),
        isActive: zod_1.z.boolean().optional()
    })
});
