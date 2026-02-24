// JAMMAL — Shipment Routes (Section 15.2)
import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { createAndMatchShipment } from '../services/matching.service';
import { sendSuccess, sendError } from '../utils/response';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const shipmentRouter = Router();

// All shipment routes require authentication
shipmentRouter.use(authenticate);

/** POST /shipments — Create a new shipment */
shipmentRouter.post('/', authorize('customer', 'broker'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await createAndMatchShipment({
            ...req.body,
            customerId: req.user!.userId,
        });
        return sendSuccess(res, result, 'Shipment created', 201);
    } catch (error) {
        next(error);
    }
});

/** GET /shipments — List user's shipments */
shipmentRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, page = '1', limit = '20' } = req.query;
        const userId = req.user!.userId;
        const userType = req.user!.userType;

        const where: any = {};
        if (userType === 'customer') where.customerId = userId;
        else if (userType === 'driver') where.driverId = userId;
        else if (userType === 'broker') where.brokerId = userId;
        if (status) where.status = status;

        const [shipments, total] = await Promise.all([
            prisma.shipment.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (parseInt(page as string) - 1) * parseInt(limit as string),
                take: parseInt(limit as string),
                include: {
                    customer: { select: { fullNameEn: true, fullNameAr: true, profilePhotoUrl: true } },
                    driver: { select: { fullNameEn: true, fullNameAr: true, profilePhotoUrl: true } },
                    bids: { where: { status: 'pending' }, select: { id: true, bidAmount: true } },
                },
            }),
            prisma.shipment.count({ where }),
        ]);

        return res.json({
            success: true,
            data: shipments,
            pagination: {
                current_page: parseInt(page as string),
                per_page: parseInt(limit as string),
                total_items: total,
                total_pages: Math.ceil(total / parseInt(limit as string)),
                has_next: parseInt(page as string) * parseInt(limit as string) < total,
                has_prev: parseInt(page as string) > 1,
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        next(error);
    }
});

/** GET /shipments/:id — Get shipment details */
shipmentRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipment = await prisma.shipment.findUnique({
            where: { id: req.params.id },
            include: {
                customer: { select: { id: true, fullNameEn: true, fullNameAr: true, phone: true, profilePhotoUrl: true } },
                driver: { select: { id: true, fullNameEn: true, fullNameAr: true, phone: true, profilePhotoUrl: true } },
                bids: { include: { driver: { select: { fullNameEn: true, fullNameAr: true, profilePhotoUrl: true } } } },
                ratings: true,
            },
        });

        if (!shipment) {
            return sendError(res, 'NOT_FOUND', 'Shipment not found', undefined, 404);
        }

        return sendSuccess(res, shipment);
    } catch (error) {
        next(error);
    }
});

/** POST /shipments/:id/cancel — Cancel a shipment */
shipmentRouter.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipment = await prisma.shipment.findUnique({ where: { id: req.params.id } });
        if (!shipment) return sendError(res, 'NOT_FOUND', 'Shipment not found', undefined, 404);

        const cancellableStatuses = ['draft', 'searching', 'driver_assigned'];
        if (!cancellableStatuses.includes(shipment.status)) {
            return sendError(res, 'INVALID_STATUS', 'Shipment cannot be cancelled in its current status');
        }

        const updated = await prisma.shipment.update({
            where: { id: req.params.id },
            data: { status: 'cancelled', cancelledAt: new Date() },
        });

        return sendSuccess(res, updated, 'Shipment cancelled');
    } catch (error) {
        next(error);
    }
});
