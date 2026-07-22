const path = require('path');
const Module = require('module');

// Load environment variables from backend/.env
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// The Prisma seed lives beside the shared schema, while its runtime
// dependencies are installed in backend/node_modules.
process.env.NODE_PATH = path.join(__dirname, '..', 'node_modules');
Module.Module._initPaths();

require('ts-node/register/transpile-only');
require('../../prisma/seed.ts');
