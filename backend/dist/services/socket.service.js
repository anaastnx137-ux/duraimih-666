"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = exports.SocketService = void 0;
const socket_io_1 = require("socket.io");
class SocketService {
    io = null;
    /**
     * Initializes Socket.io using HTTP Server attachment
     * @param server HTTP Server instance
     */
    init(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.CORS_ORIGIN || '*',
                credentials: true
            }
        });
        this.io.on('connection', (socket) => {
            console.log(`[Socket] Admin user connected: ${socket.id}`);
            socket.on('disconnect', () => {
                console.log(`[Socket] Admin user disconnected: ${socket.id}`);
            });
        });
        console.log('[Socket] Socket.io server initialized.');
    }
    /**
     * Broadcasts a real-time event to all connected dashboard administrative users
     */
    broadcastNotification(notification) {
        if (!this.io) {
            console.warn('[Socket] Socket.io server not initialized. Broadcasting aborted.');
            return;
        }
        this.io.emit('notification', {
            ...notification,
            createdAt: new Date().toISOString()
        });
        console.log(`[Socket] Broadcasted real-time notification event: ${notification.titleAr}`);
    }
}
exports.SocketService = SocketService;
exports.socketService = new SocketService();
