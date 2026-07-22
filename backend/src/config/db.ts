import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Ensure environment variables are loaded dynamically from working directory
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env'), override: true });

const prisma = new PrismaClient();

export default prisma;
