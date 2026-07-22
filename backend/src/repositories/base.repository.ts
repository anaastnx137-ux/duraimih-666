import { PrismaClient } from '@prisma/client';
import prisma from '../config/db';

export class BaseRepository<T> {
    protected prisma: PrismaClient = prisma;
    protected delegate: any;

    constructor(modelName: string) {
        this.delegate = (this.prisma as any)[modelName];
        if (!this.delegate) {
            throw new Error(`Prisma model delegate "${modelName}" does not exist.`);
        }
    }

    async findMany(params?: any): Promise<T[]> {
        return this.delegate.findMany(params);
    }

    async findUnique(params: any): Promise<T | null> {
        return this.delegate.findUnique(params);
    }

    async findFirst(params: any): Promise<T | null> {
        return this.delegate.findFirst(params);
    }

    async create(params: any): Promise<T> {
        return this.delegate.create(params);
    }

    async update(params: any): Promise<T> {
        return this.delegate.update(params);
    }

    async delete(params: any): Promise<T> {
        return this.delegate.delete(params);
    }

    async count(params?: any): Promise<number> {
        return this.delegate.count(params);
    }
}
