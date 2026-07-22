import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Force load environment files using absolute paths before PrismaClient initializes
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../../../.env'), override: true });

const getDatabaseUrl = (): string => {
    const envUrl = process.env.DATABASE_URL?.trim();
    if (envUrl && envUrl.startsWith('mysql://')) {
        return envUrl;
    }
    return 'mysql://u403705693_admin:Draymih%402026@127.0.0.1:3306/u403705693_draymih_db';
};

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: getDatabaseUrl()
        }
    }
});

export default prisma;
