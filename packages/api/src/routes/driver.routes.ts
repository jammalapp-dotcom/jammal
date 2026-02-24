// JAMMAL — Driver Routes (Section 15.2)
import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const driverRouter = Router();

driverRouter.use(authenticate);

/** POST /drivers/availability — Toggle online/offline */
driverRouter.post('/availability', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { isOnline, latitude, longitude } = req.body;
        await prisma.driverProfile.update({
            where: { userId: req.user!.userId },
            data: {
                isOnline,
                ...(latitude && longitude ? { currentLatitude: latitude, currentLongitude: longitude, lastLocationUpdate: new Date() } : {}),
            },
        });
        return sendSuccess(res, { isOnline }, `You are now ${isOnline ? 'online' : 'offline'}`);
    } catch (error) { next(error); }
});

/** GET /drivers/earnings — Get earnings summary */
driverRouter.get('/earnings', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const profile = await prisma.driverProfile.findUnique({ where: { userId: req.user!.userId } });
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const monthStart = new Date(); monthStart.setDate(1);

        const [todayEarnings, weekEarnings, monthEarnings] = await Promise.all([
            prisma.payment.aggregate({ where: { userId: req.user!.userId, paymentType: 'payout', createdAt: { gte: todayStart } }, _sum: { amount: true } }),
            prisma.payment.aggregate({ where: { userId: req.user!.userId, paymentType: 'payout', createdAt: { gte: weekStart } }, _sum: { amount: true } }),
            prisma.payment.aggregate({ where: { userId: req.user!.userId, paymentType: 'payout', createdAt: { gte: monthStart } }, _sum: { amount: true } }),
        ]);

        return sendSuccess(res, {
            totalEarnings: profile?.totalEarnings || 0,
            availableBalance: profile?.availableBalance || 0,
            today: todayEarnings._sum.amount || 0,
            thisWeek: weekEarnings._sum.amount || 0,
            thisMonth: monthEarnings._sum.amount || 0,
        });
    } catch (error) { next(error); }
});

/** GET /drivers/trips — Get driver's trips */
driverRouter.get('/trips', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status } = req.query;
        const where: any = { driverId: req.user!.userId };
        if (status) where.status = status;

        const trips = await prisma.shipment.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                customer: { select: { fullNameEn: true, fullNameAr: true, phone: true } },
            },
        });
        return sendSuccess(res, trips);
    } catch (error) { next(error); }
});

/** POST /drivers/trips/:id/accept — Accept assigned shipment */
driverRouter.post('/trips/:id/accept', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const shipment = await prisma.shipment.findFirst({
            where: { id: req.params.id, driverId: req.user!.userId, status: 'driver_assigned' },
        });
        if (!shipment) return sendError(res, 'NOT_FOUND', 'Shipment not found or already accepted', undefined, 404);

        const updated = await prisma.shipment.update({
            where: { id: req.params.id },
            data: { status: 'driver_en_route_pickup' },
        });
        return sendSuccess(res, updated, 'Trip accepted — navigate to pickup');
    } catch (error) { next(error); }
});

/** POST /drivers/trips/:id/start — Cargo loaded, start transit */
driverRouter.post('/trips/:id/start', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await prisma.shipment.update({
            where: { id: req.params.id },
            data: { status: 'in_transit', pickupCompletedAt: new Date(), pickupProofPhotoUrl: req.body.proofPhotoUrl },
        });
        return sendSuccess(res, updated, 'Trip started — in transit');
    } catch (error) { next(error); }
});

/** POST /drivers/trips/:id/complete — Mark delivery complete */
driverRouter.post('/trips/:id/complete', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updated = await prisma.shipment.update({
            where: { id: req.params.id },
            data: {
                status: 'delivered',
                deliveryCompletedAt: new Date(),
                deliveryProofPhotoUrl: req.body.proofPhotoUrl,
                customerSignature: req.body.signature,
                finalPrice: req.body.finalPrice,
            },
        });
        return sendSuccess(res, updated, 'Delivery completed');
    } catch (error) { next(error); }
});
