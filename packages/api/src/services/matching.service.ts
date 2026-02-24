// ============================================================================
// JAMMAL — Shipment Matching Service (Section 4.3)
// Handles "Instant Quote" (auto-assign) vs "Request Quotes" (bidding)
// ============================================================================

import { PrismaClient, ShipmentStatus, PricingType } from '@prisma/client';
import { calculatePrice, getDistance, PricingInput } from './pricing.engine';

const prisma = new PrismaClient();

// ============================================================================
// TYPES
// ============================================================================

export interface CreateShipmentInput {
    customerId: string;
    brokerId?: string;
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    pickupContactName?: string;
    pickupContactPhone?: string;
    pickupDate?: Date;
    pickupTime?: string;
    pickupInstructions?: string;
    deliveryAddress: string;
    deliveryLatitude: number;
    deliveryLongitude: number;
    deliveryContactName?: string;
    deliveryContactPhone?: string;
    deliveryDate?: Date;
    deliveryTime?: string;
    deliveryInstructions?: string;
    cargoType?: string;
    cargoDescription?: string;
    cargoWeightKg?: number;
    cargoLengthCm?: number;
    cargoWidthCm?: number;
    cargoHeightCm?: number;
    cargoQuantity?: number;
    specialHandling?: string[];
    requiredVehicleType: string;
    minimumCapacityKg?: number;
    pricingType: 'instant_quote' | 'bidding';
    maxAcceptablePrice?: number;
    biddingDurationMinutes?: number; // 30, 60, or until manual selection
    insuranceDeclaredValue?: number;
}

export interface NearbyDriver {
    userId: string;
    fullNameEn: string;
    fullNameAr: string;
    averageRating: number | null;
    totalTrips: number;
    distanceKm: number;
    vehicleType: string;
    licensePlate: string;
    capacityKg: number;
}

// ============================================================================
// CORE MATCHING FUNCTIONS
// ============================================================================

/**
 * Create a new shipment and initiate matching based on pricing type.
 */
export async function createAndMatchShipment(input: CreateShipmentInput) {
    // 1. Calculate distance and price
    const distance = await getDistance(
        input.pickupLatitude, input.pickupLongitude,
        input.deliveryLatitude, input.deliveryLongitude
    );

    const pickupDate = input.pickupDate ? new Date(input.pickupDate) : new Date();
    const pricingInput: PricingInput = {
        distanceKm: distance.distanceKm,
        weightKg: input.cargoWeightKg || 100,
        vehicleType: input.requiredVehicleType as any,
        cargoType: mapCargoType(input.cargoType),
        pickupDate,
        pickupHour: pickupDate.getHours(),
        pickupDayOfWeek: pickupDate.getDay(),
        insuranceDeclaredValue: input.insuranceDeclaredValue,
    };

    const pricing = calculatePrice(pricingInput);

    // 2. Create the shipment record
    const shipment = await prisma.shipment.create({
        data: {
            customerId: input.customerId,
            brokerId: input.brokerId,
            pickupAddress: input.pickupAddress,
            pickupLatitude: input.pickupLatitude,
            pickupLongitude: input.pickupLongitude,
            pickupContactName: input.pickupContactName,
            pickupContactPhone: input.pickupContactPhone,
            pickupDate: input.pickupDate,
            pickupInstructions: input.pickupInstructions,
            deliveryAddress: input.deliveryAddress,
            deliveryLatitude: input.deliveryLatitude,
            deliveryLongitude: input.deliveryLongitude,
            deliveryContactName: input.deliveryContactName,
            deliveryContactPhone: input.deliveryContactPhone,
            deliveryDate: input.deliveryDate,
            deliveryInstructions: input.deliveryInstructions,
            cargoType: input.cargoType,
            cargoDescription: input.cargoDescription,
            cargoWeightKg: input.cargoWeightKg,
            cargoLengthCm: input.cargoLengthCm,
            cargoWidthCm: input.cargoWidthCm,
            cargoHeightCm: input.cargoHeightCm,
            cargoQuantity: input.cargoQuantity,
            specialHandling: input.specialHandling || [],
            requiredVehicleType: input.requiredVehicleType,
            minimumCapacityKg: input.minimumCapacityKg,
            pricingType: input.pricingType as PricingType,
            estimatedPrice: pricing.totalPrice,
            platformCommission: pricing.platformCommission,
            insuranceFee: pricing.insuranceFee > 0 ? pricing.insuranceFee : undefined,
            insuranceValue: input.insuranceDeclaredValue,
            maxAcceptablePrice: input.maxAcceptablePrice,
            distanceKm: distance.distanceKm,
            durationMinutes: distance.durationMinutes,
            status: 'searching' as ShipmentStatus,
            biddingExpiresAt: input.pricingType === 'bidding'
                ? new Date(Date.now() + (input.biddingDurationMinutes || 60) * 60 * 1000)
                : undefined,
        },
    });

    // 3. Initiate matching based on pricing type
    if (input.pricingType === 'instant_quote') {
        // Auto-assign: find nearest best driver
        const assignedDriver = await instantQuoteMatch(shipment.id, {
            latitude: input.pickupLatitude,
            longitude: input.pickupLongitude,
            requiredVehicleType: input.requiredVehicleType,
            minimumCapacityKg: input.minimumCapacityKg,
        });

        return {
            shipment,
            pricing,
            matchType: 'instant_quote' as const,
            assignedDriver,
            message: assignedDriver
                ? 'Driver assigned — awaiting confirmation'
                : 'Searching for available drivers...',
        };
    } else {
        // Bidding: broadcast to nearby drivers
        const notifiedDrivers = await broadcastToBiddingDrivers(shipment.id, {
            latitude: input.pickupLatitude,
            longitude: input.pickupLongitude,
            requiredVehicleType: input.requiredVehicleType,
        });

        return {
            shipment,
            pricing,
            matchType: 'bidding' as const,
            notifiedDriverCount: notifiedDrivers.length,
            biddingExpiresAt: shipment.biddingExpiresAt,
            message: `Shipment posted for bidding. ${notifiedDrivers.length} drivers notified.`,
        };
    }
}

// ============================================================================
// INSTANT QUOTE — AUTO-ASSIGN (Section 4.3)
// ============================================================================

interface MatchCriteria {
    latitude: number;
    longitude: number;
    requiredVehicleType: string;
    minimumCapacityKg?: number;
}

/**
 * Find the best available driver and auto-assign.
 * Sorted by: rating (desc) > proximity (asc)
 * Driver has 2 minutes to accept; if declined, cascade to next.
 */
async function instantQuoteMatch(
    shipmentId: string,
    criteria: MatchCriteria
): Promise<NearbyDriver | null> {
    const candidates = await findNearbyDrivers(criteria, 50); // Start with 50km radius

    if (candidates.length === 0) {
        // Expand radius to 100km
        const expanded = await findNearbyDrivers(criteria, 100);
        if (expanded.length === 0) return null;
        return await assignBestDriver(shipmentId, expanded);
    }

    return await assignBestDriver(shipmentId, candidates);
}

/**
 * Assign the highest-rated, nearest driver to the shipment.
 * Creates a pending assignment the driver must accept within 2 minutes.
 */
async function assignBestDriver(
    shipmentId: string,
    candidates: NearbyDriver[]
): Promise<NearbyDriver | null> {
    // Sort by rating DESC, then distance ASC
    candidates.sort((a, b) => {
        const ratingDiff = (b.averageRating || 0) - (a.averageRating || 0);
        if (Math.abs(ratingDiff) > 0.3) return ratingDiff;
        return a.distanceKm - b.distanceKm;
    });

    const bestDriver = candidates[0];
    if (!bestDriver) return null;

    // Update shipment with assigned driver
    await prisma.shipment.update({
        where: { id: shipmentId },
        data: {
            driverId: bestDriver.userId,
            status: 'driver_assigned',
            assignedAt: new Date(),
        },
    });

    // Create notification for driver (they have 2 minutes to accept)
    await prisma.notification.create({
        data: {
            userId: bestDriver.userId,
            notificationType: 'driver_assigned',
            title: 'New Shipment Request',
            titleAr: 'طلب شحنة جديد',
            message: `You have a new shipment request. Accept within 2 minutes.`,
            messageAr: `لديك طلب شحنة جديد. وافق خلال دقيقتين.`,
            data: {
                shipmentId,
                expiresAt: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
            },
        },
    });

    return bestDriver;
}

// ============================================================================
// REQUEST QUOTES — BIDDING SYSTEM (Section 4.3)
// ============================================================================

/**
 * Broadcast shipment to eligible drivers for bidding.
 * First notification within 50km, expanding if needed.
 */
async function broadcastToBiddingDrivers(
    shipmentId: string,
    criteria: Omit<MatchCriteria, 'minimumCapacityKg'>
): Promise<NearbyDriver[]> {
    // First wave: drivers within 50km
    let drivers = await findNearbyDrivers({ ...criteria, minimumCapacityKg: undefined }, 50);

    // If fewer than 3, expand to 100km
    if (drivers.length < 3) {
        drivers = await findNearbyDrivers({ ...criteria, minimumCapacityKg: undefined }, 100);
    }

    // Send notifications to all eligible drivers
    const notifications = drivers.map((driver) => ({
        userId: driver.userId,
        notificationType: 'shipment_update' as const,
        title: 'New Shipment Available',
        titleAr: 'شحنة جديدة متاحة',
        message: `A new shipment is available for bidding near your area.`,
        messageAr: `شحنة جديدة متاحة للمزايدة بالقرب من منطقتك.`,
        data: { shipmentId },
    }));

    if (notifications.length > 0) {
        await prisma.notification.createMany({ data: notifications });
    }

    // TODO: Emit Socket.IO event to notify drivers in real-time
    // io.to(`drivers:${criteria.requiredVehicleType}`).emit('shipment:new', { shipmentId });

    return drivers;
}

/**
 * Accept a bid — Customer selects a driver's bid.
 * Auto-cancels all other bids for this shipment.
 */
export async function acceptBid(shipmentId: string, bidId: string, customerId: string) {
    // Verify the bid belongs to this shipment and is pending
    const bid = await prisma.bid.findFirst({
        where: {
            id: bidId,
            shipmentId,
            status: 'pending',
        },
        include: {
            shipment: true,
        },
    });

    if (!bid) {
        throw new Error('Bid not found or already processed');
    }

    if (bid.shipment.customerId !== customerId) {
        throw new Error('Unauthorized: Not your shipment');
    }

    // Transaction: accept bid, reject others, assign driver
    await prisma.$transaction(async (tx) => {
        // Accept this bid
        await tx.bid.update({
            where: { id: bidId },
            data: { status: 'accepted' },
        });

        // Reject all other bids for this shipment
        await tx.bid.updateMany({
            where: {
                shipmentId,
                id: { not: bidId },
                status: 'pending',
            },
            data: { status: 'rejected' },
        });

        // Assign driver to shipment
        await tx.shipment.update({
            where: { id: shipmentId },
            data: {
                driverId: bid.driverId,
                status: 'driver_assigned',
                finalPrice: bid.bidAmount,
                platformCommission: Number(bid.bidAmount) * 0.15,
                assignedAt: new Date(),
            },
        });

        // Notify the winning driver
        await tx.notification.create({
            data: {
                userId: bid.driverId,
                notificationType: 'bid_accepted',
                title: 'Bid Accepted!',
                titleAr: 'تم قبول عرضك!',
                message: `Your bid of ${bid.bidAmount} SAR has been accepted.`,
                messageAr: `تم قبول عرضك بمبلغ ${bid.bidAmount} ريال.`,
                data: { shipmentId, bidId },
            },
        });
    });

    return { success: true, message: 'Bid accepted and driver assigned' };
}

/**
 * Place a bid on a shipment (driver action)
 */
export async function placeBid(
    shipmentId: string,
    driverId: string,
    bidAmount: number,
    message?: string
) {
    // Verify shipment exists and is in bidding mode
    const shipment = await prisma.shipment.findFirst({
        where: {
            id: shipmentId,
            pricingType: 'bidding',
            status: 'searching',
        },
    });

    if (!shipment) {
        throw new Error('Shipment not found or not accepting bids');
    }

    // Check if bidding has expired
    if (shipment.biddingExpiresAt && shipment.biddingExpiresAt < new Date()) {
        throw new Error('Bidding period has expired');
    }

    // Check max acceptable price
    if (shipment.maxAcceptablePrice && bidAmount > Number(shipment.maxAcceptablePrice)) {
        throw new Error(`Bid exceeds maximum acceptable price of ${shipment.maxAcceptablePrice} SAR`);
    }

    // Check if driver already placed a bid
    const existingBid = await prisma.bid.findUnique({
        where: {
            shipmentId_driverId: {
                shipmentId,
                driverId,
            },
        },
    });

    if (existingBid) {
        // Update existing bid
        const updated = await prisma.bid.update({
            where: { id: existingBid.id },
            data: {
                bidAmount,
                message,
                status: 'pending',
            },
        });
        return updated;
    }

    // Create new bid
    const bid = await prisma.bid.create({
        data: {
            shipmentId,
            driverId,
            bidAmount,
            message,
            status: 'pending',
            expiresAt: shipment.biddingExpiresAt,
        },
    });

    // Notify customer of new bid
    await prisma.notification.create({
        data: {
            userId: shipment.customerId,
            notificationType: 'bid_received',
            title: 'New Bid Received',
            titleAr: 'عرض سعر جديد',
            message: `A driver has placed a bid of ${bidAmount} SAR on your shipment.`,
            messageAr: `قدم سائق عرض سعر بمبلغ ${bidAmount} ريال على شحنتك.`,
            data: { shipmentId, bidId: bid.id, bidAmount },
        },
    });

    return bid;
}

// ============================================================================
// NEARBY DRIVER SEARCH
// ============================================================================

/**
 * Find online drivers within a radius using Haversine distance.
 * In production, use PostGIS or a spatial index for better performance.
 */
async function findNearbyDrivers(
    criteria: MatchCriteria,
    radiusKm: number
): Promise<NearbyDriver[]> {
    // Get all online drivers with matching vehicle type
    const onlineDrivers = await prisma.driverProfile.findMany({
        where: {
            isOnline: true,
            verificationStatus: 'approved',
            currentLatitude: { not: null },
            currentLongitude: { not: null },
        },
        include: {
            user: {
                include: {
                    vehicles: {
                        where: {
                            isActive: true,
                            ...(criteria.requiredVehicleType ? { vehicleType: criteria.requiredVehicleType as any } : {}),
                        },
                    },
                },
            },
        },
    });

    // Filter by distance and capacity
    const nearbyDrivers: NearbyDriver[] = [];

    for (const dp of onlineDrivers) {
        if (!dp.currentLatitude || !dp.currentLongitude) continue;
        if (dp.user.vehicles.length === 0) continue;
        if (dp.user.status !== 'active') continue;

        // Check if driver has active assignment
        const activeShipment = await prisma.shipment.findFirst({
            where: {
                driverId: dp.userId,
                status: {
                    in: ['driver_assigned', 'driver_en_route_pickup', 'arrived_pickup', 'cargo_loaded', 'in_transit'],
                },
            },
        });
        if (activeShipment) continue; // Driver is busy

        const distance = haversine(
            criteria.latitude, criteria.longitude,
            Number(dp.currentLatitude), Number(dp.currentLongitude)
        );

        if (distance <= radiusKm) {
            const vehicle = dp.user.vehicles[0];

            // Check capacity
            if (criteria.minimumCapacityKg && Number(vehicle.capacityKg) < criteria.minimumCapacityKg) {
                continue;
            }

            nearbyDrivers.push({
                userId: dp.userId,
                fullNameEn: dp.user.fullNameEn,
                fullNameAr: dp.user.fullNameAr,
                averageRating: dp.averageRating ? Number(dp.averageRating) : null,
                totalTrips: dp.totalTrips,
                distanceKm: Math.round(distance * 10) / 10,
                vehicleType: vehicle.vehicleType,
                licensePlate: vehicle.licensePlate,
                capacityKg: Number(vehicle.capacityKg),
            });
        }
    }

    return nearbyDrivers;
}

/** Haversine formula for distance between two lat/lng points */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/** Map user cargo type string to pricing engine key */
function mapCargoType(cargoType?: string): any {
    if (!cargoType) return 'general';
    const mapping: Record<string, string> = {
        furniture: 'fragile',
        electronics: 'fragile',
        food: 'perishable',
        'construction materials': 'general',
        'general goods': 'general',
        fragile: 'fragile',
        refrigerated: 'refrigerated',
        hazardous: 'hazardous',
        'heavy machinery': 'heavy_machinery',
    };
    return mapping[cargoType.toLowerCase()] || 'general';
}
