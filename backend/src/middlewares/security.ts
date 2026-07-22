import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { Express } from 'express';
import { csrfProtection } from './csrf.middleware';

/**
 * Configure Express security layers, Helmet, CORS, double-submit cookie CSRF, and gzip compression.
 */
export const configureSecurity = (app: Express) => {
    // 1. Double-Submit Cookie CSRF protection
    app.use(csrfProtection);

    // 2. HTTP Headers Security via Helmet (Enhanced CSP directives)
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'", 
                    "'unsafe-inline'", 
                    "'unsafe-eval'", 
                    "https://cdnjs.cloudflare.com", 
                    "https://cdn.jsdelivr.net",
                    "https://*.tinymce.com",
                    "https://cdn.tiny.cloud"
                ],
                scriptSrcAttr: ["'unsafe-inline'"],
                styleSrc: [
                    "'self'", 
                    "'unsafe-inline'", 
                    "https://cdnjs.cloudflare.com", 
                    "https://fonts.googleapis.com",
                    "https://*.tinymce.com",
                    "https://cdn.tiny.cloud",
                    "https://cdn.jsdelivr.net"
                ],
                fontSrc: [
                    "'self'", 
                    "https://cdnjs.cloudflare.com", 
                    "https://fonts.gstatic.com",
                    "data:",
                    "https://cdn.jsdelivr.net"
                ],
                imgSrc: [
                    "'self'", 
                    "data:", 
                    "blob:",
                    "https://*.tinymce.com",
                    "https://cdn.tiny.cloud",
                    "https://cdn.jsdelivr.net"
                ],
                connectSrc: [
                    "'self'", 
                    "http://localhost:5000", 
                    "http://localhost:8000",
                    "ws://localhost:5000",
                    "wss://localhost:5000",
                    "https://*.tinymce.com",
                    "https://cdn.tiny.cloud"
                ]
            }
        }
    }));

    // 3. CORS configuration matching UI origin
    const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:8000';
    app.use(cors({
        origin: allowedOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-CSRF-Token']
    }));

    // 4. Compress payloads (Gzip)
    app.use(compression());
};
