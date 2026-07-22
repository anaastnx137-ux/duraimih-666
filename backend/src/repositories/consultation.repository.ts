import { BaseRepository } from './base.repository';
import { Consultation } from '@prisma/client';

export class ConsultationRepository extends BaseRepository<Consultation> {
    constructor() {
        super('consultation');
    }

    async findByRef(ref: string): Promise<Consultation | null> {
        return this.findUnique({
            where: { referenceNumber: ref },
            include: {
                files: true,
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }

    async getConsultationWithFiles(id: number): Promise<any | null> {
        return this.findUnique({
            where: { id },
            include: {
                files: true,
                statusHistory: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });
    }
}
export const consultationRepository = new ConsultationRepository();
