"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRepository = exports.FAQRepository = void 0;
const base_repository_1 = require("./base.repository");
class FAQRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('fAQ'); // Note matching the exact Prisma case for FAQ
    }
}
exports.FAQRepository = FAQRepository;
exports.faqRepository = new FAQRepository();
