// ============================================================================
// JAMMAL — Real-Time Tracking Gateway (Section 8)
// Socket.IO server for GPS updates, status changes, and chat
// ============================================================================

import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { JwtPayload } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

interface LocationUpdate {
    shipmentId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
}

interface StatusChangeEvent {
    shipmentId: string;
    oldStatus: string;
    newStatus: string;
    driverInfo?: {
        driverId: string;
        fullNameEn: string;
        fullNameAr: string;
    };
    timestamp: string;
}

interface ChatMessage {
    conversationId: string;
    shipmentId?: string;
    receiverId: string;
    message: string;
    type: 'text' | 'image' | 'location';
    mediaUrl?: string;
    latitude?: number;
    longitude?: number;
}

// ============================================================================
// GATEWAY INITIALIZATION
// ============================================================================

export function initTrackingGateway(io: SocketIOServer) {
    // ── Auth middleware: verify JWT on handshake ──
    io.use(async (socket: Socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication required'));
            }

            const secret = process.env.JWT_SECRET || 'fallback-secret';
            const decoded = jwt.verify(token, secret) as JwtPayload;
            (socket as any).user = decoded;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', (socket: Socket) => {
        const user = (socket as any).user as JwtPayload;
        console.log(`🔌 User connected: ${user.userId} (${user.userType})`);

        // ── Join user-specific room ──
        socket.join(`user:${user.userId}`);

        // ── Join role-based room ──
        socket.join(`role:${user.userType}`);

        // ──────────────────────────────────────────────────────────────────────
        // LOCATION TRACKING (Section 8.1)
        // Driver sends GPS coordinates every 10 seconds during active trip
        // ──────────────────────────────────────────────────────────────────────

        socket.on('location:update', async (data: LocationUpdate) => {
            try {
                if (user.userType !== 'driver') return;

                const { shipmentId, latitude, longitude, heading, speed } = data;

                // 1. Store in location_history table
                await prisma.locationHistory.create({
                    data: {
                        shipmentId,
                        driverId: user.userId,
                        latitude,
                        longitude,
                        heading,
                        speedKmh: speed,
                    },
                });

                // 2. Update driver's current position in profile
                await prisma.driverProfile.update({
                    where: { userId: user.userId },
                    data: {
                        currentLatitude: latitude,
                        currentLongitude: longitude,
                        lastLocationUpdate: new Date(),
                    },
                });

                // 3. Broadcast to all subscribers of this shipment (customer, broker, admin)
                io.to(`shipment:${shipmentId}`).emit('location:updated', {
                    shipmentId,
                    driverId: user.userId,
                    latitude,
                    longitude,
                    heading,
                    speed,
                    timestamp: new Date().toISOString(),
                });

            } catch (error) {
                console.error('Location update error:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        // ──────────────────────────────────────────────────────────────────────
        // SHIPMENT TRACKING SUBSCRIPTION
        // Customer/broker joins a shipment room to receive location updates
        // ──────────────────────────────────────────────────────────────────────

        socket.on('tracking:subscribe', async (data: { shipmentId: string }) => {
            try {
                // Verify user has access to this shipment
                const shipment = await prisma.shipment.findFirst({
                    where: {
                        id: data.shipmentId,
                        OR: [
                            { customerId: user.userId },
                            { driverId: user.userId },
                            { brokerId: user.userId },
                        ],
                    },
                });

                if (!shipment) {
                    socket.emit('error', { message: 'Unauthorized access to shipment' });
                    return;
                }

                socket.join(`shipment:${data.shipmentId}`);
                socket.emit('tracking:subscribed', {
                    shipmentId: data.shipmentId,
                    message: 'Now receiving live updates',
                });

                // Send the last known location immediately
                const lastLocation = await prisma.locationHistory.findFirst({
                    where: { shipmentId: data.shipmentId },
                    orderBy: { timestamp: 'desc' },
                });

                if (lastLocation) {
                    socket.emit('location:updated', {
                        shipmentId: data.shipmentId,
                        driverId: lastLocation.driverId,
                        latitude: lastLocation.latitude,
                        longitude: lastLocation.longitude,
                        heading: lastLocation.heading,
                        speed: lastLocation.speedKmh,
                        timestamp: lastLocation.timestamp.toISOString(),
                    });
                }
            } catch (error) {
                console.error('Tracking subscribe error:', error);
            }
        });

        socket.on('tracking:unsubscribe', (data: { shipmentId: string }) => {
            socket.leave(`shipment:${data.shipmentId}`);
        });

        // ──────────────────────────────────────────────────────────────────────
        // SHIPMENT STATUS CHANGES
        // Broadcast status updates to all parties (Section 9)
        // ──────────────────────────────────────────────────────────────────────

        socket.on('shipment:status_change', async (data: { shipmentId: string; newStatus: string }) => {
            try {
                const shipment = await prisma.shipment.findUnique({
                    where: { id: data.shipmentId },
                    include: {
                        driver: { select: { id: true, fullNameEn: true, fullNameAr: true } },
                    },
                });

                if (!shipment) return;

                const event: StatusChangeEvent = {
                    shipmentId: data.shipmentId,
                    oldStatus: shipment.status,
                    newStatus: data.newStatus,
                    driverInfo: shipment.driver ? {
                        driverId: shipment.driver.id,
                        fullNameEn: shipment.driver.fullNameEn,
                        fullNameAr: shipment.driver.fullNameAr,
                    } : undefined,
                    timestamp: new Date().toISOString(),
                };

                // Broadcast to shipment room
                io.to(`shipment:${data.shipmentId}`).emit('shipment:status_changed', event);

                // Also notify customer directly
                io.to(`user:${shipment.customerId}`).emit('shipment:status_changed', event);

                // Notify broker if exists
                if (shipment.brokerId) {
                    io.to(`user:${shipment.brokerId}`).emit('shipment:status_changed', event);
                }
            } catch (error) {
                console.error('Status change broadcast error:', error);
            }
        });

        // ──────────────────────────────────────────────────────────────────────
        // IN-APP CHAT (Section 11)
        // Real-time messaging between customer ↔ driver
        // ──────────────────────────────────────────────────────────────────────

        socket.on('chat:send', async (data: ChatMessage) => {
            try {
                // Store message in database
                const message = await prisma.message.create({
                    data: {
                        conversationId: data.conversationId,
                        senderId: user.userId,
                        receiverId: data.receiverId,
                        shipmentId: data.shipmentId,
                        messageType: data.type,
                        messageText: data.message,
                        mediaUrl: data.mediaUrl,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    },
                });

                // Send to receiver in real-time
                io.to(`user:${data.receiverId}`).emit('chat:message', {
                    id: message.id,
                    conversationId: data.conversationId,
                    senderId: user.userId,
                    messageType: data.type,
                    messageText: data.message,
                    mediaUrl: data.mediaUrl,
                    latitude: data.latitude,
                    longitude: data.longitude,
                    createdAt: message.createdAt.toISOString(),
                });

                // Confirm to sender
                socket.emit('chat:sent', {
                    id: message.id,
                    conversationId: data.conversationId,
                    status: 'delivered',
                });

            } catch (error) {
                console.error('Chat send error:', error);
                socket.emit('error', { message: 'Failed to send message' });
            }
        });

        // Mark messages as read
        socket.on('chat:read', async (data: { conversationId: string }) => {
            try {
                await prisma.message.updateMany({
                    where: {
                        conversationId: data.conversationId,
                        receiverId: user.userId,
                        isRead: false,
                    },
                    data: { isRead: true },
                });

                // Notify sender that messages were read
                const messages = await prisma.message.findMany({
                    where: { conversationId: data.conversationId },
                    select: { senderId: true },
                    distinct: ['senderId'],
                });

                messages.forEach((msg) => {
                    if (msg.senderId !== user.userId) {
                        io.to(`user:${msg.senderId}`).emit('chat:read_receipt', {
                            conversationId: data.conversationId,
                            readBy: user.userId,
                            readAt: new Date().toISOString(),
                        });
                    }
                });
            } catch (error) {
                console.error('Chat read error:', error);
            }
        });

        // Typing indicator
        socket.on('chat:typing', (data: { conversationId: string; receiverId: string }) => {
            io.to(`user:${data.receiverId}`).emit('chat:typing', {
                conversationId: data.conversationId,
                userId: user.userId,
            });
        });

        // ──────────────────────────────────────────────────────────────────────
        // BID UPDATES (Section 4.3)
        // Real-time bid notifications during bidding
        // ──────────────────────────────────────────────────────────────────────

        socket.on('bid:subscribe', (data: { shipmentId: string }) => {
            socket.join(`bids:${data.shipmentId}`);
        });

        // ──────────────────────────────────────────────────────────────────────
        // DISCONNECT
        // ──────────────────────────────────────────────────────────────────────

        socket.on('disconnect', async () => {
            console.log(`🔌 User disconnected: ${user.userId}`);

            // Mark driver as offline if they disconnect
            if (user.userType === 'driver') {
                await prisma.driverProfile.update({
                    where: { userId: user.userId },
                    data: { isOnline: false },
                }).catch(() => { }); // Silently fail if profile doesn't exist
            }
        });
    });

    console.log('📡 Tracking gateway initialized');
}
