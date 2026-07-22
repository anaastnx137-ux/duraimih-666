import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Single source of truth environment resolution
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Safely log DATABASE_URL for runtime diagnosis without leaking credentials
if (process.env.DATABASE_URL) {
    console.log('[DB] Connecting using DATABASE_URL:', process.env.DATABASE_URL.replace(/:.+@/, ':****@'));
}

const prisma = new PrismaClient();

export default prisma;
