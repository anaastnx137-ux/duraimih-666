import dotenv from 'dotenv';
// Load environment variables before importing other modules
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import http from 'http';
import { configureSecurity } from './middlewares/security';
import { errorHandler } from './middlewares/error.middleware';
import apiRoutes from './routes/api';
import authRoutes from './routes/auth';
import adminRoutes from './routes/admin';
import { socketService } from './services/socket.service';
import { initBackgroundJobs } from './jobs/cron';

const app = express();
const PORT = process.env.PORT || 5000;
const SERVE_FRONTEND = process.env.SERVE_FRONTEND === 'true';

// 1. Inline Cookie Parser Middleware (No external dependency)
app.use((req: any, res: Response, next: NextFunction) => {
    const list: Record<string, string> = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(';').forEach((cookie: string) => {
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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Configure CORS, Security Headers, and Compression
configureSecurity(app);

// 4. Mount API Routing Paths
app.get('/api/health', (req: Request, res: Response) => {
    return res.json({ success: true, service: 'backend' });
});
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// 5. Public blog media remains available to the separate frontend.
app.use('/storage/blog', express.static(path.join(__dirname, '../../storage/blog')));

// Optional compatibility mode. Development uses the standalone Vite frontend.
if (SERVE_FRONTEND) {
    app.use('/admin', express.static(path.join(__dirname, '../../public/admin')));
    app.use('/', express.static(path.join(__dirname, '../../public')));

    app.get('/admin/*', (req: Request, res: Response) => {
        if (req.path.includes('.') || req.path.startsWith('/api')) {
            return res.status(404).send('Not Found');
        }
        return res.sendFile(path.join(__dirname, '../../public/admin/index.html'));
    });

    app.get('*', (req: Request, res: Response) => {
        if (req.path.includes('.') || req.path.startsWith('/api') || req.path.startsWith('/socket.io')) {
            return res.status(404).send('Not Found');
        }
        return res.sendFile(path.join(__dirname, '../../public/index.html'));
    });
} else {
    app.get('/', (req: Request, res: Response) => {
        return res.json({
            success: true,
            service: 'Draymih Law Office API',
            frontend: 'http://localhost:5173'
        });
    });

    app.use((req: Request, res: Response) => {
        return res.status(404).json({
            success: false,
            code: 'NOT_FOUND',
            message: 'API route not found.'
        });
    });
}

// 6. Global Error Handling Middleware
app.use(errorHandler);

// 7. Start HTTP Server and Attach Services
const server = http.createServer(app);

socketService.init(server);
initBackgroundJobs();

server.listen(PORT, () => {
    console.log(`[ Saud Law Office API ] Running on http://localhost:${PORT}`);
});
