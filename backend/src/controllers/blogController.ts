import { Request, Response, NextFunction } from 'express';
import { blogRepository } from '../repositories/blog.repository';
import { auditLogRepository } from '../repositories/auditLog.repository';
import { AuthenticatedRequest } from '../middlewares/auth';
import { AppError } from '../middlewares/error.middleware';
import prisma from '../config/db';

/**
 * GET /api/blog (Public)
 */
export const getArticles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category, search, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page as string);
        const limitNum = parseInt(limit as string);
        const skip = (pageNum - 1) * limitNum;

        const whereClause: any = { status: 'Published' };

        if (category) {
            whereClause.category = { slug: category as string };
        }

        if (search) {
            whereClause.OR = [
                { titleAr: { contains: search as string } },
                { titleEn: { contains: search as string } },
                { excerptAr: { contains: search as string } },
                { excerptEn: { contains: search as string } },
                { contentAr: { contains: search as string } },
                { contentEn: { contains: search as string } }
            ];
        }

        const [articles, total] = await Promise.all([
            blogRepository.findMany({
                where: whereClause,
                include: {
                    category: { select: { id: true, nameAr: true, nameEn: true, slug: true } }
                },
                orderBy: [
                    { isFeatured: 'desc' },
                    { publishedAt: 'desc' }
                ],
                skip,
                take: limitNum
            }),
            blogRepository.count({ where: whereClause })
        ]);

        return res.json({
            success: true,
            articles,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/blog/:slug (Public)
 */
export const getArticleBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { slug } = req.params;
        const article = await blogRepository.findFirst({
            where: { slug, status: 'Published' },
            include: {
                category: { select: { id: true, nameAr: true, nameEn: true, slug: true } },
                author: { select: { fullName: true } }
            }
        });

        if (!article) {
            return next(new AppError(404, 'NOT_FOUND', 'Article not found.'));
        }

        return res.json({
            success: true,
            article
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/admin/blog (Admin Protected)
 */
export const adminGetArticles = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const articles = await blogRepository.getArticlesWithAuthorAndCategory({
            orderBy: { createdAt: 'desc' }
        });

        return res.json({
            success: true,
            articles
        });
    } catch (e) {
        next(e);
    }
};

/**
 * POST /api/admin/blog (Admin Protected)
 */
export const createArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const data = req.body;

        const existing = await blogRepository.findUnique({ where: { slug: data.slug } });
        if (existing) {
            return next(new AppError(400, 'CONFLICT', 'Slug already in use.'));
        }

        const article = await blogRepository.create({
            data: {
                ...data,
                authorId: req.user?.id || null,
                publishedAt: data.status === 'Published' ? new Date() : null
            }
        });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'CREATE_BLOG',
            req.ip || null,
            req.headers['user-agent'] || null,
            undefined,
            JSON.stringify(article),
            `Created blog article: ${data.titleAr}`
        );

        return res.status(201).json({
            success: true,
            article
        });
    } catch (e) {
        next(e);
    }
};

/**
 * PUT /api/admin/blog/:id (Admin Protected)
 */
export const updateArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const article = await blogRepository.findUnique({ where: { id } });
        if (!article) {
            return next(new AppError(404, 'NOT_FOUND', 'Article not found.'));
        }

        if (article.slug !== data.slug) {
            const existing = await blogRepository.findUnique({ where: { slug: data.slug } });
            if (existing) {
                return next(new AppError(400, 'CONFLICT', 'Slug already in use.'));
            }
        }

        const publishedAt = article.status !== 'Published' && data.status === 'Published' 
            ? new Date() 
            : data.status === 'Draft' 
                ? null 
                : article.publishedAt;

        const updated = await blogRepository.update({
            where: { id },
            data: {
                ...data,
                publishedAt
            }
        });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'UPDATE_BLOG',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(article),
            JSON.stringify(updated),
            `Updated blog article ID: ${id}`
        );

        return res.json({
            success: true,
            article: updated
        });
    } catch (e) {
        next(e);
    }
};

/**
 * DELETE /api/admin/blog/:id (Admin Protected)
 */
export const deleteArticle = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const id = parseInt(req.params.id);

        const article = await blogRepository.findUnique({ where: { id } });
        if (!article) {
            return next(new AppError(404, 'NOT_FOUND', 'Article not found.'));
        }

        await blogRepository.delete({ where: { id } });

        await auditLogRepository.logAdminAction(
            req.user?.id || null,
            'DELETE_BLOG',
            req.ip || null,
            req.headers['user-agent'] || null,
            JSON.stringify(article),
            undefined,
            `Deleted blog article: ${article.titleAr}`
        );

        return res.json({
            success: true,
            message: 'Article deleted successfully.'
        });
    } catch (e) {
        next(e);
    }
};

/**
 * GET /api/categories (Public)
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await prisma.blogCategory.findMany({
            orderBy: { nameAr: 'asc' }
        });
        return res.json({ success: true, categories });
    } catch (e) {
        next(e);
    }
};
