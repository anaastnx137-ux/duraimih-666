"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables before importing other modules
dotenv_1.default.config({ override: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const security_1 = require("./middlewares/security");
const error_middleware_1 = require("./middlewares/error.middleware");
const api_1 = __importDefault(require("./routes/api"));
const auth_1 = __importDefault(require("./routes/auth"));
const admin_1 = __importDefault(require("./routes/admin"));
const socket_service_1 = require("./services/socket.service");
const cron_1 = require("./jobs/cron");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === 'true';
// 1. Inline Cookie Parser Middleware (No external dependency)
app.use((req, res, next) => {
    const list = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie) => {
            const parts = cookie.split('=');
            const name = parts.shift()?.trim();
            if (name) {
                list[name] = decodeURIComponent(parts.join('='));
            }
        });
    }
    req.cookies = list;
    next();
});
// 2. Configure Body Parsers
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// 3. Configure CORS, Security Headers, and Compression
(0, security_1.configureSecurity)(app);
// 4. Mount API Routing Paths
app.get('/api/health', (req, res) => {
    return res.json({ success: true, service: 'backend' });
});
app.use('/api', api_1.default);
app.use('/api/auth', auth_1.default);
app.use('/api/admin', admin_1.default);
// 5. Public blog media remains available to the separate frontend.
app.use('/storage/blog', express_1.default.static(path_1.default.join(__dirname, '../../storage/blog')));
// Optional compatibility mode. Development uses the standalone Vite frontend.
if (SERVE_FRONTEND) {
    app.use('/admin', express_1.default.static(path_1.default.join(__dirname, '../../public/admin')));
    app.use('/', express_1.default.static(path_1.default.join(__dirname, '../../public')));
    app.get('/admin/*', (req, res) => {
        if (req.path.includes('.') || req.path.startsWith('/api')) {
            return res.status(404).send('Not Found');
        }
        return res.sendFile(path_1.default.join(__dirname, '../../public/admin/index.html'));
    });
    app.get('*', (req, res) => {
        if (req.path.includes('.') || req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
            return res.status(404).send('Not Found');
        }
        return res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
    });
}
else {
    app.get('/', (req, res) => {
        return res.json({
            success: true,
            service: 'Draymih Law Office API',
            frontend: 'http://localhost:5173'
        });
    });
    app.use((req, res) => {
        return res.status(404).json({
            success: false,
            code: 'NOT_FOUND',
            message: 'API route not found.'
        });
    });
}
// 6. Global Error Handling Middleware
app.use(error_middleware_1.errorHandler);
// 7. Start HTTP Server and Attach Services
const server = http_1.default.createServer(app);
socket_service_1.socketService.init(server);
(0, cron_1.initBackgroundJobs)();
server.listen(PORT, () => {
    console.log(`[ Saud Law Office API ] Running on http://localhost:${PORT}`);
});
