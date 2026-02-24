// ============================================================================
// JAMMAL FREIGHT PLATFORM — Express Server Entry Point
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes';
import { shipmentRouter } from './routes/shipment.routes';
import { driverRouter } from './routes/driver.routes';
import { bidRouter } from './routes/bid.routes';
import { errorHandler } from './middleware/error.middleware';
import { initTrackingGateway } from './gateways/tracking.gateway';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new SocketIOServer(server, {
    cors: {
        origin: process.env.WEB_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/v1/auth', authRouter);
app.use('/v1/shipments', shipmentRouter);
app.use('/v1/drivers', driverRouter);
app.use('/v1/bids', bidRouter);

// Error handler
app.use(errorHandler);

// Initialize Socket.IO tracking gateway
initTrackingGateway(io);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`🐪 Jammal API server running on port ${PORT}`);
    console.log(`📡 WebSocket server ready`);
});

export { app, io };
