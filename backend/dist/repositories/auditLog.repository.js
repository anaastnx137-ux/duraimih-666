"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = exports.AuditLogRepository = void 0;
const base_repository_1 = require("./base.repository");
class AuditLogRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('activityLog');
    }
    async logAdminAction(userId, action, ipAddress, userAgent, oldValue, newValue, details) {
        return this.create({
            data: {
                userId,
                action,
                ipAddress,
                userAgent,
                oldValue: oldValue || null,
                newValue: newValue || null,
                details: details || null
            }
        });
    }
}
exports.AuditLogRepository = AuditLogRepository;
exports.auditLogRepository = new AuditLogRepository();
