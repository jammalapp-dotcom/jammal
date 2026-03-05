// جمّال - منطق التسعير المشترك
// يُستخدم في الويب والموبايل لحساب أسعار الشحنات

import { APP_CONFIG, VEHICLE_TYPES } from '../constants';

/** نوع الفترة الزمنية لحساب مضاعف السعر */
export type SurgeType = keyof typeof APP_CONFIG.surgeMultipliers;

/** معرّف نوع المركبة */
export type VehicleTypeId = typeof VEHICLE_TYPES[number]['id'];

/** مضاعفات السعر حسب نوع المركبة */
const VEHICLE_MULTIPLIERS: Record<VehicleTypeId, number> = {
    pickup: 1.0,
    van: 1.3,
    lorry: 1.8,
    flatbed: 2.0,
    refrigerated: 2.2,
    tanker: 2.5,
};

/**
 * حساب السعر التقديري للشحنة
 * المعادلة: (أجرة أساسية + سعر الكيلومتر × المسافة) × مضاعف المركبة × مضاعف الفترة
 */
export function calculateEstimatedPrice(
    distance: number,
    vehicleType: VehicleTypeId,
    surgeType: SurgeType = 'normal',
): number {
    const { baseFare, baseRate, surgeMultipliers } = APP_CONFIG;
    const vehicleMultiplier = VEHICLE_MULTIPLIERS[vehicleType] ?? 1.0;
    const surgeMultiplier = surgeMultipliers[surgeType] ?? 1.0;

    const price = (baseFare + baseRate * distance) * vehicleMultiplier * surgeMultiplier;
    // تقريب لأقرب ١٠ ريالات
    return Math.round(price / 10) * 10;
}

/**
 * حساب العمولة
 * @param amount - المبلغ الإجمالي
 * @param isBroker - هل المستخدم وسيط؟
 * @returns مبلغ العمولة
 */
export function calculateCommission(amount: number, isBroker: boolean = false): number {
    const rate = isBroker ? APP_CONFIG.commission.broker : APP_CONFIG.commission.individual;
    return Math.round(amount * rate);
}

/**
 * حساب أرباح السائق بعد خصم العمولة
 */
export function calculateDriverEarnings(amount: number, isBrokerShipment: boolean = false): number {
    const commission = calculateCommission(amount, isBrokerShipment);
    return amount - commission;
}

/**
 * تنسيق المبلغ بالريال السعودي
 */
export function formatCurrency(amount: number, locale: 'ar' | 'en' = 'ar'): string {
    const currency = locale === 'ar' ? APP_CONFIG.currency : APP_CONFIG.currencyEn;
    const formatted = Math.abs(amount).toLocaleString(locale === 'ar' ? 'ar-SA' : 'en-SA');
    const sign = amount < 0 ? '-' : '';
    return locale === 'ar' ? `${sign}${formatted} ${currency}` : `${sign}${currency} ${formatted}`;
}
