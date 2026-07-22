"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = exports.deleteArticle = exports.updateArticle = exports.createArticle = exports.adminGetArticles = exports.getArticleBySlug = exports.getArticles = void 0;
const blog_repository_1 = require("../repositories/blog.repository");
const auditLog_repository_1 = require("../repositories/auditLog.repository");
const error_middleware_1 = require("../middlewares/error.middleware");
const db_1 = __importDefault(require("../config/db"));
/**
 * GET /api/blog (Public)
 */
const getArticles = async (req, res, next) => {
    try {
        const { category, search, page = '1', limit = '10' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const whereClause = { status: 'Published' };
        if (category) {
            whereClause.category = { slug: category };
        }
        if (search) {
            whereClause.OR = [
                { titleAr: { contains: search } },
                { titleEn: { contains: search } },
                { excerptAr: { contains: search } },
                { excerptEn: { contains: search } },
                { contentAr: { contains: search } },
                { contentEn: { contains: search } }
            ];
        }
        const [articles, total] = await Promise.all([
            blog_repository_1.blogRepository.findMany({
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
            blog_repository_1.blogRepository.count({ where: whereClause })
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
    }
    catch (e) {
        next(e);
    }
};
exports.getArticles = getArticles;
/**
 * GET /api/blog/:slug (Public)
 */
const getArticleBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;
        const article = await blog_repository_1.blogRepository.findFirst({
            where: { slug, status: 'Published' },
            include: {
                category: { select: { id: true, nameAr: true, nameEn: true, slug: true } },
                author: { select: { fullName: true } }
            }
        });
        if (!article) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Article not found.'));
        }
        return res.json({
            success: true,
            article
        });
    }
    catch (e) {
        next(e);
    }
};
exports.getArticleBySlug = getArticleBySlug;
/**
 * GET /api/admin/blog (Admin Protected)
 */
const adminGetArticles = async (req, res, next) => {
    try {
        const articles = await blog_repository_1.blogRepository.getArticlesWithAuthorAndCategory({
            orderBy: { createdAt: 'desc' }
        });
        return res.json({
            success: true,
            articles
        });
    }
    catch (e) {
        next(e);
    }
};
exports.adminGetArticles = adminGetArticles;
/**
 * POST /api/admin/blog (Admin Protected)
 */
const createArticle = async (req, res, next) => {
    try {
        const data = req.body;
        const existing = await blog_repository_1.blogRepository.findUnique({ where: { slug: data.slug } });
        if (existing) {
            return next(new error_middleware_1.AppError(400, 'CONFLICT', 'Slug already in use.'));
        }
        const article = await blog_repository_1.blogRepository.create({
            data: {
                ...data,
                authorId: req.user?.id || null,
                publishedAt: data.status === 'Published' ? new Date() : null
            }
        });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'CREATE_BLOG', req.ip || null, req.headers['user-agent'] || null, undefined, JSON.stringify(article), `Created blog article: ${data.titleAr}`);
        return res.status(201).json({
            success: true,
            article
        });
    }
    catch (e) {
        next(e);
    }
};
exports.createArticle = createArticle;
/**
 * PUT /api/admin/blog/:id (Admin Protected)
 */
const updateArticle = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;
        const article = await blog_repository_1.blogRepository.findUnique({ where: { id } });
        if (!article) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Article not found.'));
        }
        if (article.slug !== data.slug) {
            const existing = await blog_repository_1.blogRepository.findUnique({ where: { slug: data.slug } });
            if (existing) {
                return next(new error_middleware_1.AppError(400, 'CONFLICT', 'Slug already in use.'));
            }
        }
        const publishedAt = article.status !== 'Published' && data.status === 'Published'
            ? new Date()
            : data.status === 'Draft'
                ? null
                : article.publishedAt;
        const updated = await blog_repository_1.blogRepository.update({
            where: { id },
            data: {
                ...data,
                publishedAt
            }
        });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'UPDATE_BLOG', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(article), JSON.stringify(updated), `Updated blog article ID: ${id}`);
        return res.json({
            success: true,
            article: updated
        });
    }
    catch (e) {
        next(e);
    }
};
exports.updateArticle = updateArticle;
/**
 * DELETE /api/admin/blog/:id (Admin Protected)
 */
const deleteArticle = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const article = await blog_repository_1.blogRepository.findUnique({ where: { id } });
        if (!article) {
            return next(new error_middleware_1.AppError(404, 'NOT_FOUND', 'Article not found.'));
        }
        await blog_repository_1.blogRepository.delete({ where: { id } });
        await auditLog_repository_1.auditLogRepository.logAdminAction(req.user?.id || null, 'DELETE_BLOG', req.ip || null, req.headers['user-agent'] || null, JSON.stringify(article), undefined, `Deleted blog article: ${article.titleAr}`);
        return res.json({
            success: true,
            message: 'Article deleted successfully.'
        });
    }
    catch (e) {
        next(e);
    }
};
exports.deleteArticle = deleteArticle;
/**
 * GET /api/categories (Public)
 */
const getCategories = async (req, res, next) => {
    try {
        const categories = await db_1.default.blogCategory.findMany({
            orderBy: { nameAr: 'asc' }
        });
        return res.json({ success: true, categories });
    }
    catch (e) {
        next(e);
    }
};
exports.getCategories = getCategories;
