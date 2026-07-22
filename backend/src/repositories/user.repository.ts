import { BaseRepository } from './base.repository';
import { User } from '@prisma/client';

export class UserRepository extends BaseRepository<User> {
    constructor() {
        super('user');
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.findUnique({
            where: { email }
        });
    }

    async findByIdWithRole(id: number): Promise<any | null> {
        return this.findUnique({
            where: { id },
            include: {
                role: {
                    include: {
                        rolePermissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });
    }
}
export const userRepository = new UserRepository();
