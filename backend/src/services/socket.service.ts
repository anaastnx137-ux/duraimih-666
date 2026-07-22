import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';

export class SocketService {
    private io: SocketIOServer | null = null;

    /**
     * Initializes Socket.io using HTTP Server attachment
     * @param server HTTP Server instance
     */
    init(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
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
    broadcastNotification(notification: {
        titleAr: string;
        titleEn: string;
        messageAr: string;
        messageEn: string;
        type: string;
    }) {
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

export const socketService = new SocketService();
