"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serviceRepository = exports.ServiceRepository = void 0;
const base_repository_1 = require("./base.repository");
class ServiceRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('service');
    }
    async findBySlug(slug) {
        return this.findUnique({
            where: { slug }
        });
    }
}
exports.ServiceRepository = ServiceRepository;
exports.serviceRepository = new ServiceRepository();
