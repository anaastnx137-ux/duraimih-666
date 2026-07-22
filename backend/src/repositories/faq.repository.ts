import { BaseRepository } from './base.repository';
import { FAQ } from '@prisma/client';

export class FAQRepository extends BaseRepository<FAQ> {
    constructor() {
        super('fAQ'); // Note matching the exact Prisma case for FAQ
    }
}
export const faqRepository = new FAQRepository();
