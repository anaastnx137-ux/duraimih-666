import { BaseRepository } from './base.repository';
import { Service } from '@prisma/client';

export class ServiceRepository extends BaseRepository<Service> {
    constructor() {
        super('service');
    }

    async findBySlug(slug: string): Promise<Service | null> {
        return this.findUnique({
            where: { slug }
        });
    }
}
export const serviceRepository = new ServiceRepository();
