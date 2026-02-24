// ============================================================================
// JAMMAL — Shared TypeScript Types (Phase 3)
// Generated from the Prisma schema for frontend consumption
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export enum UserType {
    Customer = 'customer',
    Driver = 'driver',
    Broker = 'broker',
    Admin = 'admin',
    Support = 'support',
}

export enum Gender {
    Male = 'male',
    Female = 'female',
}

export enum UserStatus {
    Active = 'active',
    Suspended = 'suspended',
    Banned = 'banned',
}

export enum VerificationStatus {
    Pending = 'pending',
    Approved = 'approved',
    Rejected = 'rejected',
}

export enum VehicleType {
    Pickup = 'pickup',
    SmallLorry = 'small_lorry',
    MediumLorry = 'medium_lorry',
    LargeTruck = 'large_truck',
    Refrigerated = 'refrigerated',
    Flatbed = 'flatbed',
    Tanker = 'tanker',
    CarCarrier = 'car_carrier',
    CraneTruck = 'crane_truck',
}

export enum ShipmentStatus {
    Draft = 'draft',
    Searching = 'searching',
    DriverAssigned = 'driver_assigned',
    DriverEnRoutePickup = 'driver_en_route_pickup',
    ArrivedPickup = 'arrived_pickup',
    CargoLoaded = 'cargo_loaded',
    InTransit = 'in_transit',
    ArrivedDelivery = 'arrived_delivery',
    Delivered = 'delivered',
    Cancelled = 'cancelled',
    Disputed = 'disputed',
}

export enum PricingType {
    InstantQuote = 'instant_quote',
    Bidding = 'bidding',
}

export enum BidStatus {
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
    Withdrawn = 'withdrawn',
    Expired = 'expired',
}

export enum PaymentType {
    Shipment = 'shipment',
    Refund = 'refund',
    Payout = 'payout',
    Commission = 'commission',
}

export enum PaymentMethod {
    Card = 'card',
    Mada = 'mada',
    ApplePay = 'apple_pay',
    StcPay = 'stc_pay',
    BankTransfer = 'bank_transfer',
    Cash = 'cash',
    Wallet = 'wallet',
}

export enum PaymentStatus {
    Pending = 'pending',
    Authorized = 'authorized',
    Captured = 'captured',
    Failed = 'failed',
    Refunded = 'refunded',
}

export enum MessageType {
    Text = 'text',
    Image = 'image',
    Location = 'location',
    System = 'system',
}

export enum CargoHandling {
    Fragile = 'fragile',
    Refrigerated = 'refrigerated',
    Hazardous = 'hazardous',
    HeavyMachinery = 'heavy_machinery',
    Oversized = 'oversized',
    Valuable = 'valuable',
    Perishable = 'perishable',
    Liquid = 'liquid',
}

// ============================================================================
// CORE INTERFACES
// ============================================================================

export interface IUser {
    id: string;
    userType: UserType;
    fullNameEn: string;
    fullNameAr: string;
    email: string;
    emailVerified: boolean;
    phone: string;
    phoneVerified: boolean;
    profilePhotoUrl?: string;
    nationalId?: string;
    dateOfBirth?: string; // ISO date
    gender?: Gender;
    status: UserStatus;
    locale: 'ar' | 'en';
    lastLoginAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICustomerProfile {
    userId: string;
    companyName?: string;
    companyCr?: string;
    isBusiness: boolean;
    preferredPaymentMethod?: string;
    totalShipments: number;
    totalSpent: number;
    averageRating?: number;
}

export interface IDriverProfile {
    userId: string;
    verificationStatus: VerificationStatus;
    driverLicenseNumber?: string;
    driverLicenseExpiry?: string;
    driverLicensePhotoUrl?: string;
    nationalIdPhotoFront?: string;
    nationalIdPhotoBack?: string;
    isOnline: boolean;
    currentLatitude?: number;
    currentLongitude?: number;
    lastLocationUpdate?: string;
    totalTrips: number;
    totalEarnings: number;
    availableBalance: number;
    averageRating?: number;
    acceptanceRate?: number;
    cancellationRate?: number;
    onTimeRate?: number;
    iban?: string;
    serviceAreas?: string[];
    maxDistance?: number;
}

export interface IBrokerProfile {
    userId: string;
    companyNameEn?: string;
    companyNameAr?: string;
    commercialRegistration?: string;
    crPhotoUrl?: string;
    taxNumber?: string;
    licenseNumber?: string;
    verificationStatus: VerificationStatus;
    totalShipments: number;
    totalRevenue: number;
    commissionRate: number;
    iban?: string;
}

export interface IVehicle {
    id: string;
    driverId: string;
    vehicleType: VehicleType;
    make?: string;
    model?: string;
    year?: number;
    licensePlate: string;
    color?: string;
    capacityKg: number;
    lengthMeters?: number;
    registrationNumber?: string;
    registrationExpiry?: string;
    registrationPhotoUrl?: string;
    insuranceNumber?: string;
    insuranceExpiry?: string;
    insurancePhotoUrl?: string;
    vehiclePhotos?: string[];
    isActive: boolean;
}

export interface IShipment {
    id: string;
    customerId: string;
    brokerId?: string;
    driverId?: string;

    // Pickup
    pickupAddress: string;
    pickupLatitude: number;
    pickupLongitude: number;
    pickupContactName?: string;
    pickupContactPhone?: string;
    pickupDate?: string;
    pickupTime?: string;
    pickupInstructions?: string;

    // Delivery
    deliveryAddress: string;
    deliveryLatitude: number;
    deliveryLongitude: number;
    deliveryContactName?: string;
    deliveryContactPhone?: string;
    deliveryDate?: string;
    deliveryTime?: string;
    deliveryInstructions?: string;

    // Cargo
    cargoType?: string;
    cargoDescription?: string;
    cargoWeightKg?: number;
    cargoLengthCm?: number;
    cargoWidthCm?: number;
    cargoHeightCm?: number;
    cargoQuantity?: number;
    cargoPhotos?: string[];
    specialHandling?: CargoHandling[];

    // Vehicle
    requiredVehicleType?: string;
    minimumCapacityKg?: number;

    // Pricing
    pricingType: PricingType;
    estimatedPrice?: number;
    finalPrice?: number;
    platformCommission?: number;
    insuranceFee?: number;
    insuranceValue?: number;
    maxAcceptablePrice?: number;

    // Status
    status: ShipmentStatus;
    assignedAt?: string;
    pickupCompletedAt?: string;
    deliveryCompletedAt?: string;
    cancelledAt?: string;
    biddingExpiresAt?: string;

    // Proof
    pickupProofPhotoUrl?: string;
    deliveryProofPhotoUrl?: string;
    customerSignature?: string;

    distanceKm?: number;
    durationMinutes?: number;

    createdAt: string;
    updatedAt: string;

    // Populated relations (optional — present when included)
    customer?: Pick<IUser, 'id' | 'fullNameEn' | 'fullNameAr' | 'phone' | 'profilePhotoUrl'>;
    driver?: Pick<IUser, 'id' | 'fullNameEn' | 'fullNameAr' | 'phone' | 'profilePhotoUrl'>;
    bids?: IBid[];
    ratings?: IRating[];
}

export interface IBid {
    id: string;
    shipmentId: string;
    driverId: string;
    bidAmount: number;
    message?: string;
    status: BidStatus;
    createdAt: string;
    expiresAt?: string;

    // Populated
    driver?: Pick<IUser, 'fullNameEn' | 'fullNameAr' | 'profilePhotoUrl'> & {
        driverProfile?: Pick<IDriverProfile, 'averageRating' | 'totalTrips'>;
        vehicles?: Pick<IVehicle, 'vehicleType' | 'licensePlate' | 'vehiclePhotos'>[];
    };
}

export interface IPayment {
    id: string;
    shipmentId?: string;
    userId: string;
    paymentType: PaymentType;
    amount: number;
    currency: string;
    paymentMethod: PaymentMethod;
    paymentGateway?: string;
    transactionId?: string;
    status: PaymentStatus;
    createdAt: string;
    completedAt?: string;
}

export interface IRating {
    id: string;
    shipmentId: string;
    ratedBy: string;
    ratedUser: string;
    overallRating: number;
    punctualityRating?: number;
    professionalismRating?: number;
    vehicleCleanlinessRating?: number;
    cargoHandlingRating?: number;
    reviewText?: string;
    reviewPhotos?: string[];
    tags?: string[];
    isPublished: boolean;
    createdAt: string;
}

export interface IMessage {
    id: string;
    conversationId: string;
    senderId: string;
    receiverId: string;
    shipmentId?: string;
    messageType: MessageType;
    messageText?: string;
    mediaUrl?: string;
    latitude?: number;
    longitude?: number;
    isRead: boolean;
    createdAt: string;
}

export interface INotification {
    id: string;
    userId: string;
    notificationType: string;
    title: string;
    titleAr?: string;
    message: string;
    messageAr?: string;
    data?: Record<string, any>;
    isRead: boolean;
    sentPush: boolean;
    sentSms: boolean;
    sentEmail: boolean;
    createdAt: string;
}

export interface ILocationUpdate {
    shipmentId: string;
    driverId: string;
    latitude: number;
    longitude: number;
    heading?: number;
    speed?: number;
    timestamp: string;
}

export interface ISavedAddress {
    id: string;
    userId: string;
    label: string;
    address: string;
    latitude: number;
    longitude: number;
    contactName?: string;
    contactPhone?: string;
    isDefault: boolean;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    timestamp: string;
}

export interface ApiError {
    success: false;
    error: {
        code: string;
        message: string;
        details?: { field: string; message: string }[];
    };
    timestamp: string;
}

export interface PaginatedResponse<T> {
    success: true;
    data: T[];
    pagination: {
        current_page: number;
        per_page: number;
        total_items: number;
        total_pages: number;
        has_next: boolean;
        has_prev: boolean;
    };
    timestamp: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}

export interface PricingBreakdown {
    baseFare: number;
    distanceCharge: number;
    weightSurcharge: number;
    vehicleMultiplier: number;
    vehicleSurcharge: number;
    cargoSurcharge: number;
    peakSurcharge: number;
    seasonalSurcharge: number;
    surgePricing: number;
    insuranceFee: number;
    subtotal: number;
    platformCommission: number;
    vat: number;
    totalPrice: number;
    driverPayout: number;
    currency: 'SAR';
}

// ============================================================================
// SOCKET EVENT TYPES
// ============================================================================

export interface SocketEvents {
    // Client → Server
    'location:update': (data: { shipmentId: string; latitude: number; longitude: number; heading?: number; speed?: number }) => void;
    'tracking:subscribe': (data: { shipmentId: string }) => void;
    'tracking:unsubscribe': (data: { shipmentId: string }) => void;
    'chat:send': (data: { conversationId: string; receiverId: string; message: string; type: MessageType }) => void;
    'chat:read': (data: { conversationId: string }) => void;
    'chat:typing': (data: { conversationId: string; receiverId: string }) => void;

    // Server → Client
    'location:updated': (data: ILocationUpdate) => void;
    'shipment:status_changed': (data: { shipmentId: string; oldStatus: string; newStatus: string; timestamp: string }) => void;
    'chat:message': (data: IMessage) => void;
    'chat:sent': (data: { id: string; conversationId: string; status: string }) => void;
    'chat:read_receipt': (data: { conversationId: string; readBy: string; readAt: string }) => void;
    'bid:new': (data: { shipmentId: string; bid: IBid }) => void;
}
