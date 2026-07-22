"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const db_1 = __importDefault(require("../config/db"));
class BaseRepository {
    prisma = db_1.default;
    delegate;
    constructor(modelName) {
        this.delegate = this.prisma[modelName];
        if (!this.delegate) {
            throw new Error(`Prisma model delegate "${modelName}" does not exist.`);
        }
    }
    async findMany(params) {
        return this.delegate.findMany(params);
    }
    async findUnique(params) {
        return this.delegate.findUnique(params);
    }
    async findFirst(params) {
        return this.delegate.findFirst(params);
    }
    async create(params) {
        return this.delegate.create(params);
    }
    async update(params) {
        return this.delegate.update(params);
    }
    async delete(params) {
        return this.delegate.delete(params);
    }
    async count(params) {
        return this.delegate.count(params);
    }
}
exports.BaseRepository = BaseRepository;
