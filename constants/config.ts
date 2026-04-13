// Jammal - جمّال Configuration

export const APP_CONFIG = {
  name: 'جمّال',
  nameEn: 'Jammal',
  tagline: 'سوق الشحن السعودي',
  taglineEn: 'Saudi Freight Marketplace',
  currency: 'ر.س',
  currencyEn: 'SAR',
  commission: {
    individual: 0.15,
    broker: 0.10,
  },
  baseRate: 2.5, // SAR per KM
  baseFare: 50, // SAR
  surgeMultipliers: {
    ramadan: 1.3,
    peakHours: 1.2,
    weekend: 1.1,
    normal: 1.0,
  },
};

export const CARGO_CATEGORIES = [
  { id: 'furniture', labelAr: 'أثاث', labelEn: 'Furniture', icon: 'weekend' },
  { id: 'electronics', labelAr: 'إلكترونيات', labelEn: 'Electronics', icon: 'devices' },
  { id: 'food', labelAr: 'مواد غذائية', labelEn: 'Food', icon: 'restaurant' },
  { id: 'construction', labelAr: 'مواد بناء', labelEn: 'Construction', icon: 'construction' },
  { id: 'vehicles', labelAr: 'مركبات', labelEn: 'Vehicles', icon: 'directions-car' },
  { id: 'industrial', labelAr: 'صناعي', labelEn: 'Industrial', icon: 'precision-manufacturing' },
  { id: 'medical', labelAr: 'طبي', labelEn: 'Medical', icon: 'local-hospital' },
  { id: 'other', labelAr: 'أخرى', labelEn: 'Other', icon: 'inventory-2' },
];

export const SPECIAL_HANDLING = [
  { id: 'fragile', labelAr: 'هش', labelEn: 'Fragile', icon: 'warning' },
  { id: 'refrigerated', labelAr: 'مبرد', labelEn: 'Refrigerated', icon: 'ac-unit' },
  { id: 'hazardous', labelAr: 'خطر', labelEn: 'Hazardous', icon: 'report-problem' },
  { id: 'oversized', labelAr: 'كبير الحجم', labelEn: 'Oversized', icon: 'open-in-full' },
  { id: 'livestock', labelAr: 'حيوانات', labelEn: 'Livestock', icon: 'pets' },
];

export const VEHICLE_TYPES = [
  { id: 'pickup', labelAr: 'بيك أب', labelEn: 'Pickup', capacity: '1 طن', icon: 'local-shipping' },
  { id: 'van', labelAr: 'فان', labelEn: 'Van', capacity: '3 طن', icon: 'airport-shuttle' },
  { id: 'lorry', labelAr: 'شاحنة', labelEn: 'Lorry', capacity: '10 طن', icon: 'local-shipping' },
  { id: 'flatbed', labelAr: 'سطحة', labelEn: 'Flatbed', capacity: '15 طن', icon: 'rv-hookup' },
  { id: 'refrigerated', labelAr: 'مبردة', labelEn: 'Refrigerated', capacity: '8 طن', icon: 'ac-unit' },
  { id: 'tanker', labelAr: 'صهريج', labelEn: 'Tanker', capacity: '20 طن', icon: 'water-drop' },
];

export const SHIPMENT_STATUSES = {
  draft: { labelAr: 'مسودة', labelEn: 'Draft', color: '#9CA3AF' },
  searching: { labelAr: 'البحث عن سائق', labelEn: 'Searching', color: '#F59E0B' },
  assigned: { labelAr: 'تم التعيين', labelEn: 'Assigned', color: '#3B82F6' },
  pickup: { labelAr: 'في الاستلام', labelEn: 'At Pickup', color: '#8B5CF6' },
  en_route: { labelAr: 'في الطريق', labelEn: 'En Route', color: '#1B2A4A' },
  delivered: { labelAr: 'تم التوصيل', labelEn: 'Delivered', color: '#10B981' },
  disputed: { labelAr: 'نزاع', labelEn: 'Disputed', color: '#EF4444' },
};
