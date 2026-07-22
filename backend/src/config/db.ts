import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Single source of truth environment resolution
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Safely log DATABASE_URL for runtime diagnosis without leaking credentials
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    const safeUrl = dbUrl.replace(/mysql:\/\/([^:]+):([^@]+)@/, 'mysql://$1:****@');
    console.log('[DB] Database configured:', safeUrl);
}

const prisma = new PrismaClient();

export default prisma;
