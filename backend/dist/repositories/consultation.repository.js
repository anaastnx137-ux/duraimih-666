"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultationRepository = exports.ConsultationRepository = void 0;
const base_repository_1 = require("./base.repository");
class ConsultationRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('consultation');
    }
    async findByRef(ref) {
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
    async getConsultationWithFiles(id) {
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
exports.ConsultationRepository = ConsultationRepository;
exports.consultationRepository = new ConsultationRepository();
