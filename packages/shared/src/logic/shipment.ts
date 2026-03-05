// جمّال - منطق الشحنات المشترك
// يُستخدم في الويب والموبايل لإدارة حالات الشحنات

import type { ShipmentStatus, PaymentStatus } from '../types';

/** الحالات التي تعني أن الشحنة نشطة */
const ACTIVE_STATUSES: ShipmentStatus[] = ['searching', 'assigned', 'pickup', 'en_route'];

/** الحالات النهائية التي لا تتغير */
const TERMINAL_STATUSES: ShipmentStatus[] = ['delivered', 'cancelled', 'disputed'];

/**
 * هل الشحنة نشطة (قيد التنفيذ)؟
 */
export function isActiveShipment(status: ShipmentStatus): boolean {
    return ACTIVE_STATUSES.includes(status);
}

/**
 * هل الشحنة في حالة نهائية؟
 */
export function isTerminalStatus(status: ShipmentStatus): boolean {
    return TERMINAL_STATUSES.includes(status);
}

/**
 * الحصول على نسبة تقدم التتبع حسب الحالة
 */
export function getTrackingProgress(status: ShipmentStatus): number {
    const progressMap: Record<ShipmentStatus, number> = {
        draft: 0,
        searching: 0,
        assigned: 0.05,
        pickup: 0.1,
        en_route: 0.3,
        delivered: 1.0,
        disputed: 0,
        cancelled: 0,
    };
    return progressMap[status] ?? 0;
}

/**
 * حالة الدفع المناسبة عند الانتقال لحالة جديدة
 */
export function getPaymentStatusForTransition(newStatus: ShipmentStatus): PaymentStatus | null {
    switch (newStatus) {
        case 'assigned':
            return 'authorized';
        case 'delivered':
            return 'released';
        case 'cancelled':
            return 'refunded';
        default:
            return null;
    }
}

/**
 * التحقق من صحة انتقال حالة الشحنة
 * يمنع الانتقالات غير المنطقية
 */
export function isValidStatusTransition(from: ShipmentStatus, to: ShipmentStatus): boolean {
    const validTransitions: Record<ShipmentStatus, ShipmentStatus[]> = {
        draft: ['searching'],
        searching: ['assigned', 'cancelled'],
        assigned: ['pickup', 'cancelled'],
        pickup: ['en_route', 'cancelled'],
        en_route: ['delivered', 'disputed'],
        delivered: ['disputed'],
        disputed: ['delivered'], // يمكن حل النزاع
        cancelled: [], // لا انتقال من الملغاة
    };
    return validTransitions[from]?.includes(to) ?? false;
}

/**
 * توليد رقم شحنة فريد
 */
export function generateShipmentId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000 + 1000);
    return `SH-${year}-${random}`;
}
