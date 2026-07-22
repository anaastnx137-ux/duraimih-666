import { BaseRepository } from './base.repository';
import { BlogArticle } from '@prisma/client';

export class BlogRepository extends BaseRepository<BlogArticle> {
    constructor() {
        super('blogArticle');
    }

    async findBySlug(slug: string): Promise<BlogArticle | null> {
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

    async getArticlesWithAuthorAndCategory(params: any): Promise<BlogArticle[]> {
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
export const blogRepository = new BlogRepository();
