"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRepository = exports.TestimonialRepository = void 0;
const base_repository_1 = require("./base.repository");
class TestimonialRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('testimonial');
    }
}
exports.TestimonialRepository = TestimonialRepository;
exports.testimonialRepository = new TestimonialRepository();
