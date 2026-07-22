"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureSecurity = void 0;
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const compression_1 = __importDefault(require("compression"));
const csrf_middleware_1 = require("./csrf.middleware");
/**
 * Configure Express security layers, Helmet, CORS, double-submit cookie CSRF, and gzip compression.
 */
const configureSecurity = (app) => {
    // 1. Double-Submit Cookie CSRF protection
    app.use(csrf_middleware_1.csrfProtection);
    // 2. HTTP Headers Security via Helmet (Enhanced CSP directives)
    app.use((0, helmet_1.default)({
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
    app.use((0, cors_1.default)({
        origin: allowedOrigin,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-CSRF-Token']
    }));
    // 4. Compress payloads (Gzip)
    app.use((0, compression_1.default)());
};
exports.configureSecurity = configureSecurity;
