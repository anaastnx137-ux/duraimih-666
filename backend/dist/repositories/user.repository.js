"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRepository = exports.UserRepository = void 0;
const base_repository_1 = require("./base.repository");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super('user');
    }
    async findByEmail(email) {
        return this.findUnique({
            where: { email }
        });
    }
    async findByIdWithRole(id) {
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
exports.UserRepository = UserRepository;
exports.userRepository = new UserRepository();
