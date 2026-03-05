// جمّال - الثوابت المشتركة
// تُستخدم في الويب والموبايل على حد سواء

import type { ShipmentStatus } from '../types';

// ==================== إعدادات التطبيق ====================

/** الإعدادات العامة للتطبيق */
export const APP_CONFIG = {
    name: 'جمّال',
    nameEn: 'Jammal',
    tagline: 'سوق الشحن السعودي',
    taglineEn: 'Saudi Freight Marketplace',
    currency: 'ر.س',
    currencyEn: 'SAR',
    /** نسبة العمولة حسب نوع المستخدم */
    commission: {
        individual: 0.15, // ١٥٪ للأفراد
        broker: 0.10,     // ١٠٪ للوسطاء
    },
    baseRate: 2.5,  // ريال لكل كيلومتر
    baseFare: 50,   // ريال - أجرة أساسية
    /** مضاعفات الأسعار حسب الأوقات */
    surgeMultipliers: {
        ramadan: 1.3,
        peakHours: 1.2,
        weekend: 1.1,
        normal: 1.0,
    },
} as const;

// ==================== أنواع البضائع ====================

/** تصنيفات البضائع */
export const CARGO_CATEGORIES = [
    { id: 'furniture', labelAr: 'أثاث', labelEn: 'Furniture', icon: 'weekend' },
    { id: 'electronics', labelAr: 'إلكترونيات', labelEn: 'Electronics', icon: 'devices' },
    { id: 'food', labelAr: 'مواد غذائية', labelEn: 'Food', icon: 'restaurant' },
    { id: 'construction', labelAr: 'مواد بناء', labelEn: 'Construction', icon: 'construction' },
    { id: 'vehicles', labelAr: 'مركبات', labelEn: 'Vehicles', icon: 'directions-car' },
    { id: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial', icon: 'precision-manufacturing' },
    { id: 'medical', labelAr: 'طبي', labelEn: 'Medical', icon: 'local-hospital' },
    { id: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: 'inventory-2' },
] as const;

// ==================== المناولة الخاصة ====================

/** خيارات المناولة الخاصة */
export const SPECIAL_HANDLING = [
    { id: 'fragile', labelAr: 'هش', labelEn: 'Fragile', icon: 'warning' },
    { id: 'refrigerated', labelAr: 'مبرد', labelEn: 'Refrigerated', icon: 'ac-unit' },
    { id: 'hazardous', labelAr: 'خطر', labelEn: 'Hazardous', icon: 'report-problem' },
    { id: 'oversized', labelAr: 'كبير الحجم', labelEn: 'Oversized', icon: 'open-in-full' },
    { id: 'livestock', labelAr: 'حيوانات', labelEn: 'Livestock', icon: 'pets' },
] as const;

// ==================== أنواع المركبات ====================

/** أنواع الشاحنات والمركبات */
export const VEHICLE_TYPES = [
    { id: 'pickup', labelAr: 'بيك أب', labelEn: 'Pickup', capacity: '1 طن', icon: 'local-shipping' },
    { id: 'van', labelAr: 'فان', labelEn: 'Van', capacity: '3 طن', icon: 'airport-shuttle' },
    { id: 'lorry', labelAr: 'شاحنة', labelEn: 'Lorry', capacity: '10 طن', icon: 'local-shipping' },
    { id: 'flatbed', labelAr: 'سطحة', labelEn: 'Flatbed', capacity: '15 طن', icon: 'rv-hookup' },
    { id: 'refrigerated', labelAr: 'مبردة', labelEn: 'Refrigerated', capacity: '8 طن', icon: 'ac-unit' },
    { id: 'tanker', labelAr: 'صهريج', labelEn: 'Tanker', capacity: '20 طن', icon: 'water-drop' },
] as const;

// ==================== حالات الشحنة ====================

/** تفاصيل حالات الشحنة مع الألوان والتسميات */
export const SHIPMENT_STATUSES: Record<ShipmentStatus, { labelAr: string; labelEn: string; color: string }> = {
    draft: { labelAr: 'مسودة', labelEn: 'Draft', color: '#9CA3AF' },
    searching: { labelAr: 'البحث عن سائق', labelEn: 'Searching', color: '#F59E0B' },
    assigned: { labelAr: 'تم التعيين', labelEn: 'Assigned', color: '#3B82F6' },
    pickup: { labelAr: 'في الاستلام', labelEn: 'At Pickup', color: '#8B5CF6' },
    en_route: { labelAr: 'في الطريق', labelEn: 'En Route', color: '#1B2A4A' },
    delivered: { labelAr: 'تم التوصيل', labelEn: 'Delivered', color: '#10B981' },
    disputed: { labelAr: 'نزاع', labelEn: 'Disputed', color: '#EF4444' },
    cancelled: { labelAr: 'ملغاة', labelEn: 'Cancelled', color: '#6B7280' },
};

// ==================== المدن السعودية ====================

/** قائمة المدن السعودية */
export const SAUDI_CITIES = [
    'الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام',
    'الخبر', 'الظهران', 'تبوك', 'أبها', 'الطائف',
    'ينبع', 'الجبيل', 'حائل', 'نجران', 'جيزان',
    'بريدة', 'عنيزة', 'الباحة', 'سكاكا', 'عرعر',
] as const;

// ==================== قنوات Supabase Realtime ====================

/** أنماط أسماء القنوات الموحدة بين الويب والموبايل */
export const REALTIME_CHANNELS = {
    /** قناة رسائل الشحنة */
    shipmentChat: (shipmentId: string) => `shipment:${shipmentId}:messages`,
    /** قناة تتبع موقع السائق */
    driverLocation: (driverId: string) => `driver:${driverId}:location`,
    /** قناة تحديثات حالة الشحنة */
    shipmentUpdates: (shipmentId: string) => `shipment:${shipmentId}:status`,
    /** قناة الإشعارات للمستخدم */
    userNotifications: (userId: string) => `user:${userId}:notifications`,
} as const;
