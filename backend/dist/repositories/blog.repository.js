"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRepository = exports.BlogRepository = void 0;
const base_repository_1 = require("./base.repository");
class BlogRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('blogArticle');
    }
    async findBySlug(slug) {
        return this.findUnique({
            where: { slug },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });
    }
    async getArticlesWithAuthorAndCategory(params) {
        return this.findMany({
            ...params,
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        fullName: true
                    }
                }
            }
        });
    }
}
exports.BlogRepository = BlogRepository;
exports.blogRepository = new BlogRepository();
