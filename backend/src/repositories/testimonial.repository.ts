import { BaseRepository } from './base.repository';
import { Testimonial } from '@prisma/client';

export class TestimonialRepository extends BaseRepository<Testimonial> {
    constructor() {
        super('testimonial');
    }
}
export const testimonialRepository = new TestimonialRepository();
