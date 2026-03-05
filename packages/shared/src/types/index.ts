// جمّال - أنواع TypeScript المشتركة
// هذا الملف يحتوي على كل الأنواع المستخدمة في الويب والموبايل

// ==================== أنواع المستخدمين ====================

/** أدوار المستخدمين في النظام */
export type UserRole = 'customer' | 'driver' | 'broker' | 'manager';

/** نوع الحساب */
export type AccountType = 'personal' | 'business';

/** بيانات المستخدم الكاملة */
export interface AppUser {
    id: string;
    name: string;
    nameEn: string;
    phone: string;
    email: string;
    role: UserRole;
    type: AccountType;
    company: string;
    companyEn: string;
    rating: number;
    totalShipments: number;
    walletBalance: number;
    verified: boolean;
    avatar?: string;
    isOnline?: boolean;
    vehicleType?: string;
    vehiclePlate?: string;
    completedTrips?: number;
    fleetSize?: number;
}

// ==================== أنواع الشحنات ====================

/** حالات الشحنة */
export type ShipmentStatus = 'draft' | 'searching' | 'assigned' | 'pickup' | 'en_route' | 'delivered' | 'disputed' | 'cancelled';

/** طريقة التسعير */
export type PricingMode = 'bidding' | 'instant';

/** حالة الدفع */
export type PaymentStatus = 'pending' | 'authorized' | 'released' | 'refunded';

/** بيانات الشحنة */
export interface Shipment {
    id: string;
    customerId: string;
    pickupCity: string;
    pickupAddress: string;
    deliveryCity: string;
    deliveryAddress: string;
    cargoCategory: string;
    cargoCategoryAr: string;
    weight: number;
    description: string;
    descriptionAr: string;
    specialHandling: string[];
    vehicleType: string;
    status: ShipmentStatus;
    pricingMode: PricingMode;
    estimatedPrice: number;
    finalPrice?: number;
    createdAt: string;
    pickupDate: string;
    driverName?: string;
    driverNameAr?: string;
    driverRating?: number;
    driverPhone?: string;
    driverId?: string;
    vehiclePlate?: string;
    bidsCount: number;
    distance: number;
    estimatedDuration: string;
    trackingProgress?: number;
    paymentStatus?: PaymentStatus;
    paymentMethod?: string;
    brokerId?: string;
}

// ==================== أنواع السائقين ====================

/** بيانات السائق */
export interface Driver {
    id: string;
    name: string;
    nameAr: string;
    phone: string;
    rating: number;
    completedTrips: number;
    vehicleType: string;
    vehiclePlate: string;
    avatar?: string;
    isOnline: boolean;
    bidAmount?: number;
    estimatedArrival?: string;
    responseTime?: string;
}

// ==================== أنواع المزايدات ====================

/** حالة المزايدة */
export type BidStatus = 'pending' | 'accepted' | 'rejected';

/** بيانات المزايدة */
export interface Bid {
    id: string;
    shipmentId: string;
    driver: Driver;
    amount: number;
    estimatedArrival: string;
    message: string;
    messageAr: string;
    createdAt: string;
    status?: BidStatus;
}

// ==================== أنواع المحفظة ====================

/** نوع المعاملة المالية */
export type TransactionType = 'payment' | 'refund' | 'withdrawal' | 'earning' | 'commission';

/** حالة المعاملة */
export type TransactionStatus = 'completed' | 'pending' | 'failed';

/** معاملة مالية */
export interface WalletTransaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    descriptionAr: string;
    date: string;
    status: TransactionStatus;
    shipmentId?: string;
}

// ==================== أنواع الدردشة ====================

/** رسالة دردشة */
export interface ChatMessage {
    id: string;
    shipmentId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: string;
    isMe: boolean;
}

// ==================== أنواع الإشعارات ====================

/** نوع الإشعار */
export type NotificationType = 'shipment' | 'payment' | 'system' | 'bid';

/** إشعار */
export interface Notification {
    id: string;
    title: string;
    body: string;
    type: NotificationType;
    read: boolean;
    timestamp: string;
    shipmentId?: string;
}

// ==================== أنواع التتبع الحي ====================

/** بيانات موقع السائق (للتتبع الحي) */
export interface DriverLocation {
    driverId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
}

// ==================== أنواع قاعدة البيانات (Supabase) ====================

/** صف المستخدم في قاعدة البيانات */
export interface DbUser {
    id: string;
    role: UserRole;
    name: string;
    name_ar: string | null;
    phone: string;
    email: string | null;
    company: string | null;
    company_ar: string | null;
    wallet_balance: number;
    rating: number;
    verified: boolean;
    vehicle_type: string | null;
    vehicle_plate: string | null;
    is_online: boolean;
    current_location: unknown | null; // PostGIS geography
    completed_trips: number;
    fleet_size: number;
    created_at: string;
}

/** صف الشحنة في قاعدة البيانات */
export interface DbShipment {
    id: string;
    short_id: string;
    customer_id: string;
    driver_id: string | null;
    pickup_city: string;
    pickup_address: string;
    delivery_city: string;
    delivery_address: string;
    cargo_category: string;
    cargo_category_ar: string;
    weight: number;
    description: string | null;
    description_ar: string | null;
    vehicle_type: string;
    status: ShipmentStatus;
    pricing_mode: PricingMode;
    estimated_price: number;
    final_price: number | null;
    distance: number;
    estimated_duration: string | null;
    payment_status: string;
    tracking_progress: number;
    pickup_date: string | null;
    created_at: string;
}

/** صف المزايدة في قاعدة البيانات */
export interface DbBid {
    id: string;
    shipment_id: string;
    driver_id: string;
    amount: number;
    message: string | null;
    status: BidStatus;
    created_at: string;
}

/** صف الرسالة في قاعدة البيانات */
export interface DbMessage {
    id: string;
    shipment_id: string;
    sender_id: string;
    text: string;
    created_at: string;
}
