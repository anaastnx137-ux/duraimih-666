import { BaseRepository } from './base.repository';
import { ActivityLog } from '@prisma/client';

export class AuditLogRepository extends BaseRepository<ActivityLog> {
    constructor() {
        super('activityLog');
    }

    async logAdminAction(userId: number | null, action: string, ipAddress: string | null, userAgent: string | null, oldValue?: string, newValue?: string, details?: string): Promise<ActivityLog> {
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
export const auditLogRepository = new AuditLogRepository();
