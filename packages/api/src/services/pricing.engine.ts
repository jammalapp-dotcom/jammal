// ============================================================================
// JAMMAL — Dynamic Pricing Engine (Section 7.2)
// Calculates freight cost based on distance, weight, vehicle, cargo, time
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export interface PricingInput {
    /** Distance in kilometers (from Google Maps Distance Matrix API) */
    distanceKm: number;
    /** Total cargo weight in kilograms */
    weightKg: number;
    /** Required vehicle type */
    vehicleType: VehicleTypeKey;
    /** Type of cargo for surcharge calculation */
    cargoType?: CargoTypeKey;
    /** Pickup date (for time/seasonal adjustments) */
    pickupDate?: Date;
    /** Pickup hour (0-23) for peak pricing */
    pickupHour?: number;
    /** Day of week (0=Sunday, 5=Friday) */
    pickupDayOfWeek?: number;
    /** Optional insurance declared value in SAR */
    insuranceDeclaredValue?: number;
    /** Current demand/supply ratio for surge pricing (>1 = high demand) */
    demandSupplyRatio?: number;
}

export interface PricingBreakdown {
    /** Base fare before multipliers */
    baseFare: number;
    /** Distance-based charge */
    distanceCharge: number;
    /** Weight surcharge */
    weightSurcharge: number;
    /** Vehicle type multiplier applied */
    vehicleMultiplier: number;
    /** Vehicle surcharge amount */
    vehicleSurcharge: number;
    /** Cargo type surcharge (fragile, refrigerated, etc.) */
    cargoSurcharge: number;
    /** Peak hours / high demand surcharge */
    peakSurcharge: number;
    /** Seasonal surcharge (Ramadan, Eid) */
    seasonalSurcharge: number;
    /** Surge pricing amount */
    surgePricing: number;
    /** Insurance fee if applicable */
    insuranceFee: number;
    /** Subtotal before commission */
    subtotal: number;
    /** Platform commission (15% standard) */
    platformCommission: number;
    /** VAT (15% Saudi Arabia) */
    vat: number;
    /** Total price the customer pays */
    totalPrice: number;
    /** Estimated driver payout */
    driverPayout: number;
    /** Currency */
    currency: 'SAR';
}

// ============================================================================
// RATE TABLES (configurable via admin panel in production)
// ============================================================================

/** Base fare in SAR (minimum charge) */
const BASE_FARE_SAR = 50;

/** Rate per KM by distance band (Section 7.2) */
const DISTANCE_BANDS = [
    { maxKm: 50, ratePerKm: 3.5 },  // Short distance: base rate
    { maxKm: 150, ratePerKm: 3.15 },  // Medium: -10%
    { maxKm: 9999, ratePerKm: 2.975 }, // Long haul: -15%
];

/** Weight graduated scale surcharges in SAR */
const WEIGHT_SURCHARGES = [
    { maxKg: 500, surcharge: 0 },
    { maxKg: 1000, surcharge: 50 },
    { maxKg: 2000, surcharge: 120 },
    { maxKg: 5000, surcharge: 250 },
    { maxKg: 99999, surcharge: 500 },
];

/** Vehicle type multipliers (Section 7.2) */
type VehicleTypeKey = 'pickup' | 'small_lorry' | 'medium_lorry' | 'large_truck' |
    'refrigerated' | 'flatbed' | 'tanker' | 'car_carrier' | 'crane_truck';

const VEHICLE_MULTIPLIERS: Record<VehicleTypeKey, number> = {
    pickup: 1.0,
    small_lorry: 1.5,
    medium_lorry: 2.0,
    large_truck: 2.5,
    refrigerated: 2.8,
    flatbed: 2.2,
    tanker: 3.0,
    car_carrier: 3.2,
    crane_truck: 3.5,
};

/** Cargo type surcharge percentages (Section 7.2) */
type CargoTypeKey = 'general' | 'fragile' | 'refrigerated' | 'hazardous' |
    'heavy_machinery' | 'oversized' | 'valuable' | 'perishable' | 'liquid';

const CARGO_SURCHARGE_PERCENT: Record<CargoTypeKey, number> = {
    general: 0,
    fragile: 0.10,  // +10%
    refrigerated: 0.25,  // +25%
    hazardous: 0.50,  // +50%
    heavy_machinery: 0.30, // +30%
    oversized: 0.20,  // +20%
    valuable: 0.15,  // +15%
    perishable: 0.15,  // +15%
    liquid: 0.10,  // +10%
};

/** Peak hours multiplier (Thursday/Friday afternoons) */
const PEAK_MULTIPLIER = 0.20; // +20%

/** Seasonal multipliers */
const SEASONAL_MULTIPLIERS: Record<string, number> = {
    ramadan: 0.15,  // +15%
    eid: 0.30,  // +30%
    hajj: 0.25,  // +25%
    normal: 0,
};

/** Insurance rate */
const INSURANCE_RATE = 0.02; // 2% of declared value

/** Platform commission rate */
const PLATFORM_COMMISSION_RATE = 0.15; // 15%

/** Saudi VAT */
const VAT_RATE = 0.15; // 15%

// ============================================================================
// HELPERS
// ============================================================================

/** Calculate distance charge using banded rates */
function calcDistanceCharge(distanceKm: number): number {
    let charge = 0;
    let remaining = distanceKm;

    for (const band of DISTANCE_BANDS) {
        const prevMax = DISTANCE_BANDS.indexOf(band) === 0 ? 0 : DISTANCE_BANDS[DISTANCE_BANDS.indexOf(band) - 1].maxKm;
        const kmInBand = Math.min(remaining, band.maxKm - prevMax);
        if (kmInBand <= 0) break;
        charge += kmInBand * band.ratePerKm;
        remaining -= kmInBand;
        if (remaining <= 0) break;
    }

    return charge;
}

/** Find weight surcharge */
function calcWeightSurcharge(weightKg: number): number {
    for (const tier of WEIGHT_SURCHARGES) {
        if (weightKg <= tier.maxKg) {
            return tier.surcharge;
        }
    }
    return WEIGHT_SURCHARGES[WEIGHT_SURCHARGES.length - 1].surcharge;
}

/** Determine if pickup falls on peak hours (Thu/Fri 12:00-18:00) */
function isPeakTime(dayOfWeek?: number, hour?: number): boolean {
    if (dayOfWeek === undefined || hour === undefined) return false;
    // Thursday = 4, Friday = 5 in JS Date
    const isPeakDay = dayOfWeek === 4 || dayOfWeek === 5;
    const isPeakHour = hour >= 12 && hour <= 18;
    return isPeakDay && isPeakHour;
}

/** Determine current Saudi season */
function getSeason(date?: Date): string {
    if (!date) return 'normal';

    // Approximate Hijri calendar seasons for 2026
    // In production, use a proper Hijri calendar library
    const month = date.getMonth(); // 0-indexed
    const day = date.getDate();

    // Ramadan 2026 is approximately Feb 18 - Mar 19
    if ((month === 1 && day >= 18) || (month === 2 && day <= 19)) {
        return 'ramadan';
    }
    // Eid al-Fitr: approx Mar 20-22
    if (month === 2 && day >= 20 && day <= 25) {
        return 'eid';
    }
    // Eid al-Adha: approx May 27-30
    if (month === 4 && day >= 27 && day <= 30) {
        return 'eid';
    }
    // Hajj season: approx May 22-30
    if (month === 4 && day >= 22) {
        return 'hajj';
    }

    return 'normal';
}

// ============================================================================
// MAIN PRICING FUNCTION
// ============================================================================

/**
 * Calculate the dynamic price for a freight shipment.
 * Implements the full pricing algorithm from Section 7.2.
 *
 * @param input - Pricing parameters (distance, weight, vehicle, etc.)
 * @returns Complete pricing breakdown in SAR
 */
export function calculatePrice(input: PricingInput): PricingBreakdown {
    const {
        distanceKm,
        weightKg,
        vehicleType,
        cargoType = 'general',
        pickupDate,
        pickupHour,
        pickupDayOfWeek,
        insuranceDeclaredValue,
        demandSupplyRatio = 1.0,
    } = input;

    // 1. Base fare
    const baseFare = BASE_FARE_SAR;

    // 2. Distance charge (banded rates)
    const distanceCharge = calcDistanceCharge(distanceKm);

    // 3. Weight surcharge
    const weightSurcharge = calcWeightSurcharge(weightKg);

    // 4. Vehicle type multiplier
    const vehicleMultiplier = VEHICLE_MULTIPLIERS[vehicleType] || 1.0;
    const baseWithDistance = baseFare + distanceCharge + weightSurcharge;
    const vehicleSurcharge = baseWithDistance * (vehicleMultiplier - 1);

    // 5. Cargo type surcharge
    const cargoPercent = CARGO_SURCHARGE_PERCENT[cargoType] || 0;
    const cargoSurcharge = baseWithDistance * cargoPercent;

    // 6. Peak hours surcharge
    const peak = isPeakTime(pickupDayOfWeek, pickupHour);
    const peakSurcharge = peak ? baseWithDistance * PEAK_MULTIPLIER : 0;

    // 7. Seasonal surcharge
    const season = getSeason(pickupDate);
    const seasonalPercent = SEASONAL_MULTIPLIERS[season] || 0;
    const seasonalSurcharge = baseWithDistance * seasonalPercent;

    // 8. Surge pricing (demand-based)
    let surgePricing = 0;
    if (demandSupplyRatio > 1.5) {
        // Scale surge: ratio 1.5 = +10%, ratio 2.0 = +30%, ratio 3.0 = +50%
        const surgePercent = Math.min(0.50, (demandSupplyRatio - 1) * 0.2);
        surgePricing = baseWithDistance * surgePercent;
    }

    // 9. Insurance fee
    const insuranceFee = insuranceDeclaredValue ? insuranceDeclaredValue * INSURANCE_RATE : 0;

    // 10. Subtotal
    const subtotal = baseFare + distanceCharge + weightSurcharge + vehicleSurcharge +
        cargoSurcharge + peakSurcharge + seasonalSurcharge + surgePricing + insuranceFee;

    // 11. Platform commission (on subtotal before VAT)
    const platformCommission = subtotal * PLATFORM_COMMISSION_RATE;

    // 12. VAT on the total service
    const vat = subtotal * VAT_RATE;

    // 13. Total customer pays
    const totalPrice = Math.round((subtotal + vat) * 100) / 100;

    // 14. Driver payout (total - commission - VAT on commission)
    const driverPayout = Math.round((subtotal - platformCommission) * 100) / 100;

    return {
        baseFare: round(baseFare),
        distanceCharge: round(distanceCharge),
        weightSurcharge: round(weightSurcharge),
        vehicleMultiplier,
        vehicleSurcharge: round(vehicleSurcharge),
        cargoSurcharge: round(cargoSurcharge),
        peakSurcharge: round(peakSurcharge),
        seasonalSurcharge: round(seasonalSurcharge),
        surgePricing: round(surgePricing),
        insuranceFee: round(insuranceFee),
        subtotal: round(subtotal),
        platformCommission: round(platformCommission),
        vat: round(vat),
        totalPrice,
        driverPayout,
        currency: 'SAR',
    };
}

function round(n: number): number {
    return Math.round(n * 100) / 100;
}

// ============================================================================
// UTILITY: Estimate distance via Google Maps (placeholder)
// ============================================================================

export interface DistanceResult {
    distanceKm: number;
    durationMinutes: number;
}

/**
 * Get driving distance and duration between two points.
 * In production, calls Google Maps Distance Matrix API.
 */
export async function getDistance(
    originLat: number, originLng: number,
    destLat: number, destLng: number
): Promise<DistanceResult> {
    // TODO: Replace with actual Google Maps API call
    // const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
    // const response = await fetch(url);
    // const data = await response.json();

    // Haversine formula for placeholder distance
    const R = 6371; // Earth radius in km
    const dLat = toRad(destLat - originLat);
    const dLon = toRad(destLng - originLng);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(originLat)) * Math.cos(toRad(destLat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distanceKm = R * c;

    // Rough estimate: 60 km/h average trucking speed
    const durationMinutes = (distanceKm / 60) * 60;

    return {
        distanceKm: Math.round(distanceKm * 10) / 10,
        durationMinutes: Math.round(durationMinutes),
    };
}

function toRad(deg: number): number {
    return (deg * Math.PI) / 180;
}
