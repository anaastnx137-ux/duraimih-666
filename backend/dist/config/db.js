"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Single source of truth environment resolution
const envPath = path_1.default.resolve(__dirname, '../../../.env');
dotenv_1.default.config({ path: envPath });
// Safely log DATABASE_URL for runtime diagnosis without leaking credentials
const dbUrl = process.env.DATABASE_URL;
if (dbUrl) {
    const safeUrl = dbUrl.replace(/mysql:\/\/([^:]+):([^@]+)@/, 'mysql://$1:****@');
    console.log('[DB] Database configured:', safeUrl);
}
const prisma = new client_1.PrismaClient();
exports.default = prisma;
