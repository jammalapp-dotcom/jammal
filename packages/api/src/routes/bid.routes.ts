// JAMMAL — Bid Routes (Section 15.2)
import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { sendSuccess, sendError } from '../utils/response';
import { placeBid, acceptBid } from '../services/matching.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const bidRouter = Router();

bidRouter.use(authenticate);

/** GET /shipments/:shipmentId/bids — List bids for a shipment */
bidRouter.get('/shipments/:shipmentId/bids', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bids = await prisma.bid.findMany({
            where: { shipmentId: req.params.shipmentId },
            include: {
                driver: {
                    select: {
                        fullNameEn: true, fullNameAr: true, profilePhotoUrl: true,
                        driverProfile: { select: { averageRating: true, totalTrips: true } },
                        vehicles: { where: { isActive: true }, take: 1, select: { vehicleType: true, licensePlate: true, vehiclePhotos: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return sendSuccess(res, bids);
    } catch (error) { next(error); }
});

/** POST /shipments/:shipmentId/bids — Place a bid (driver) */
bidRouter.post('/shipments/:shipmentId/bids', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bid = await placeBid(req.params.shipmentId, req.user!.userId, req.body.bidAmount, req.body.message);
        return sendSuccess(res, bid, 'Bid placed successfully', 201);
    } catch (error) { next(error); }
});

/** POST /bids/:id/accept — Customer accepts a bid */
bidRouter.post('/:id/accept', authorize('customer', 'broker'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bid = await prisma.bid.findUnique({ where: { id: req.params.id } });
        if (!bid) return sendError(res, 'NOT_FOUND', 'Bid not found', undefined, 404);
        const result = await acceptBid(bid.shipmentId, req.params.id, req.user!.userId);
        return sendSuccess(res, result);
    } catch (error) { next(error); }
});

/** DELETE /bids/:id — Withdraw a bid (driver) */
bidRouter.delete('/:id', authorize('driver'), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await prisma.bid.update({
            where: { id: req.params.id },
            data: { status: 'withdrawn' },
        });
        return sendSuccess(res, null, 'Bid withdrawn');
    } catch (error) { next(error); }
});
