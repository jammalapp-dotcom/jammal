// @ts-nocheck
// Jammal - جمّال Mock Data - منقول حرفياً من المشروع الأصلي

export type UserRole = 'customer' | 'driver' | 'broker' | 'manager';

export interface AppUser {
    id: string; name: string; nameEn: string; phone: string; email: string; role: UserRole;
    type: 'personal' | 'business'; company: string; companyEn: string; rating: number;
    totalShipments: number; walletBalance: number; verified: boolean; avatar?: string;
    isOnline?: boolean; vehicleType?: string; vehiclePlate?: string; completedTrips?: number; fleetSize?: number;
}

export interface Shipment {
    id: string; customerId: string; pickupCity: string; pickupAddress: string; deliveryCity: string; deliveryAddress: string;
    cargoCategory: string; cargoCategoryAr: string; weight: number; description: string; descriptionAr: string;
    specialHandling: string[]; vehicleType: string; status: 'draft' | 'searching' | 'assigned' | 'pickup' | 'en_route' | 'delivered' | 'disputed';
    pricingMode: 'bidding' | 'instant'; estimatedPrice: number; finalPrice?: number; createdAt: string; pickupDate: string;
    driverName?: string; driverNameAr?: string; driverRating?: number; driverPhone?: string; driverId?: string; vehiclePlate?: string;
    bidsCount: number; distance: number; estimatedDuration: string; trackingProgress?: number;
    paymentStatus?: 'pending' | 'authorized' | 'released' | 'refunded'; paymentMethod?: string; brokerId?: string;
}

export interface Driver {
    id: string; name: string; nameAr: string; phone: string; rating: number; completedTrips: number;
    vehicleType: string; vehiclePlate: string; avatar?: string; isOnline: boolean;
    bidAmount?: number; estimatedArrival?: string; responseTime?: string;
}

export interface Bid { id: string; shipmentId: string; driver: Driver; amount: number; estimatedArrival: string; message: string; messageAr: string; createdAt: string; }
export interface WalletTransaction { id: string; type: 'payment' | 'refund' | 'withdrawal' | 'earning' | 'commission'; amount: number; description: string; descriptionAr: string; date: string; status: 'completed' | 'pending' | 'failed'; shipmentId?: string; }
export interface ChatMessage { id: string; shipmentId: string; senderId: string; senderName: string; text: string; timestamp: string; isMe: boolean; }
export interface Notification { id: string; title: string; body: string; type: 'shipment' | 'payment' | 'system' | 'bid'; read: boolean; timestamp: string; shipmentId?: string; }

export const TEST_USERS: Record<string, { phone: string; otp: string; user: AppUser }> = {
    customer: { phone: '0551234567', otp: '1234', user: { id: 'user-001', name: 'عبدالله المطيري', nameEn: 'Abdullah Al-Mutairi', phone: '+966 55 123 4567', email: 'customer@test.com', role: 'customer', type: 'business', company: 'مؤسسة المطيري للتجارة', companyEn: 'Al-Mutairi Trading Est.', rating: 4.8, totalShipments: 47, walletBalance: 12450, verified: true } },
    driver: { phone: '0559876543', otp: '1234', user: { id: 'user-002', name: 'فهد القحطاني', nameEn: 'Fahad Al-Qahtani', phone: '+966 55 987 6543', email: 'driver@test.com', role: 'driver', type: 'personal', company: '', companyEn: '', rating: 4.9, totalShipments: 234, walletBalance: 8750, verified: true, isOnline: true, vehicleType: 'lorry', vehiclePlate: 'ب ع ن ٢٣٤٥', completedTrips: 234 } },
    broker: { phone: '0555551234', otp: '1234', user: { id: 'user-003', name: 'سعود العمري', nameEn: 'Saud Al-Omari', phone: '+966 55 555 1234', email: 'broker@test.com', role: 'broker', type: 'business', company: 'شركة العمري للنقل', companyEn: 'Al-Omari Transport Co.', rating: 4.7, totalShipments: 312, walletBalance: 45200, verified: true, fleetSize: 15 } },
    manager: { phone: '0501111111', otp: '1234', user: { id: 'user-004', name: 'أحمد الإدارة', nameEn: 'Ahmed Admin', phone: '+966 50 111 1111', email: 'admin@jammal.sa', role: 'manager', type: 'business', company: 'جمّال', companyEn: 'Jammal', rating: 5.0, totalShipments: 0, walletBalance: 0, verified: true } },
};

export const mockDrivers: Driver[] = [
    { id: 'd-001', name: 'Fahad Al-Qahtani', nameAr: 'فهد القحطاني', phone: '+966 50 111 2222', rating: 4.9, completedTrips: 234, vehicleType: 'lorry', vehiclePlate: 'ب ع ن ٢٣٤٥', isOnline: true, bidAmount: 850, estimatedArrival: '٢ ساعة', responseTime: '٣ دقائق' },
    { id: 'd-002', name: 'Mohammed Al-Dosari', nameAr: 'محمد الدوسري', phone: '+966 50 222 3333', rating: 4.7, completedTrips: 189, vehicleType: 'flatbed', vehiclePlate: 'ه س و ٥٦٧٨', isOnline: true, bidAmount: 920, estimatedArrival: '٣ ساعات', responseTime: '٥ دقائق' },
    { id: 'd-003', name: 'Khalid Al-Shehri', nameAr: 'خالد الشهري', phone: '+966 50 333 4444', rating: 4.8, completedTrips: 312, vehicleType: 'lorry', vehiclePlate: 'ك م ل ٨٩٠١', isOnline: true, bidAmount: 780, estimatedArrival: '٢.٥ ساعة', responseTime: '١ دقيقة' },
    { id: 'd-004', name: 'Sultan Al-Otaibi', nameAr: 'سلطان العتيبي', phone: '+966 50 444 5555', rating: 4.6, completedTrips: 156, vehicleType: 'van', vehiclePlate: 'ع ر ب ٣٤٥٦', isOnline: true, bidAmount: 950, estimatedArrival: '٤ ساعات', responseTime: '١٠ دقائق' },
    { id: 'd-005', name: 'Saad Al-Harbi', nameAr: 'سعد الحربي', phone: '+966 50 555 6666', rating: 4.9, completedTrips: 401, vehicleType: 'lorry', vehiclePlate: 'ق ص د ٧٨٩٠', isOnline: true, bidAmount: 800, estimatedArrival: '١.٥ ساعة', responseTime: '٢ دقائق' },
    { id: 'd-006', name: 'Nasser Al-Ghamdi', nameAr: 'ناصر الغامدي', phone: '+966 50 666 7777', rating: 4.5, completedTrips: 98, vehicleType: 'pickup', vehiclePlate: 'ت ث ج ١٢٣٤', isOnline: false },
    { id: 'd-007', name: 'Turki Al-Zahrani', nameAr: 'تركي الزهراني', phone: '+966 50 777 8888', rating: 4.8, completedTrips: 267, vehicleType: 'refrigerated', vehiclePlate: 'ح خ د ٥٦٧٨', isOnline: true, bidAmount: 1100, estimatedArrival: '٣ ساعات', responseTime: '٤ دقائق' },
    { id: 'd-008', name: 'Abdulaziz Al-Rashidi', nameAr: 'عبدالعزيز الراشدي', phone: '+966 50 888 9999', rating: 4.7, completedTrips: 178, vehicleType: 'flatbed', vehiclePlate: 'ذ ر ز ٩٠١٢', isOnline: true, bidAmount: 870, estimatedArrival: '٢ ساعة', responseTime: '٧ دقائق' },
];

export const mockShipments: Shipment[] = [
    { id: 'SH-2024-001', customerId: 'user-001', pickupCity: 'الرياض', pickupAddress: 'حي العليا، طريق الملك فهد', deliveryCity: 'جدة', deliveryAddress: 'حي الحمراء، شارع التحلية', cargoCategory: 'electronics', cargoCategoryAr: 'إلكترونيات', weight: 2500, description: 'Server racks and networking equipment', descriptionAr: 'خوادم ومعدات شبكات', specialHandling: ['fragile'], vehicleType: 'lorry', status: 'en_route', pricingMode: 'bidding', estimatedPrice: 1200, finalPrice: 850, createdAt: '2024-12-15', pickupDate: '2024-12-16', driverName: 'Fahad Al-Qahtani', driverNameAr: 'فهد القحطاني', driverRating: 4.9, driverPhone: '+966 50 111 2222', driverId: 'user-002', vehiclePlate: 'ب ع ن ٢٣٤٥', bidsCount: 5, distance: 950, estimatedDuration: '١٠ ساعات', trackingProgress: 0.65, paymentStatus: 'authorized', paymentMethod: 'mada' },
    { id: 'SH-2024-002', customerId: 'user-001', pickupCity: 'الدمام', pickupAddress: 'المنطقة الصناعية الثانية', deliveryCity: 'الرياض', deliveryAddress: 'حي السلي، المستودعات', cargoCategory: 'construction', cargoCategoryAr: 'مواد بناء', weight: 8000, description: 'Steel beams and construction materials', descriptionAr: 'حديد وأعمدة ومواد بناء', specialHandling: ['oversized'], vehicleType: 'flatbed', status: 'searching', pricingMode: 'bidding', estimatedPrice: 1800, createdAt: '2024-12-16', pickupDate: '2024-12-17', bidsCount: 3, distance: 420, estimatedDuration: '٥ ساعات', paymentStatus: 'pending' },
    { id: 'SH-2024-003', customerId: 'user-001', pickupCity: 'جدة', pickupAddress: 'ميناء جدة الإسلامي', deliveryCity: 'المدينة المنورة', deliveryAddress: 'المنطقة الصناعية', cargoCategory: 'food', cargoCategoryAr: 'مواد غذائية', weight: 5000, description: 'Frozen food shipment', descriptionAr: 'شحنة مواد غذائية مجمدة', specialHandling: ['refrigerated'], vehicleType: 'refrigerated', status: 'assigned', pricingMode: 'instant', estimatedPrice: 2200, finalPrice: 2200, createdAt: '2024-12-14', pickupDate: '2024-12-16', driverName: 'Turki Al-Zahrani', driverNameAr: 'تركي الزهراني', driverRating: 4.8, driverPhone: '+966 50 777 8888', driverId: 'd-007', vehiclePlate: 'ح خ د ٥٦٧٨', bidsCount: 7, distance: 420, estimatedDuration: '٤.٥ ساعات', paymentStatus: 'authorized', paymentMethod: 'apple_pay', brokerId: 'user-003' },
    { id: 'SH-2024-004', customerId: 'user-001', pickupCity: 'الرياض', pickupAddress: 'حي النخيل، شارع الأمير تركي', deliveryCity: 'الخبر', deliveryAddress: 'حي الراكة، شارع الأمير سلطان', cargoCategory: 'furniture', cargoCategoryAr: 'أثاث', weight: 1200, description: 'Office furniture set', descriptionAr: 'طقم أثاث مكتبي', specialHandling: ['fragile'], vehicleType: 'van', status: 'delivered', pricingMode: 'bidding', estimatedPrice: 600, finalPrice: 520, createdAt: '2024-12-10', pickupDate: '2024-12-11', driverName: 'Khalid Al-Shehri', driverNameAr: 'خالد الشهري', driverRating: 4.8, driverPhone: '+966 50 333 4444', driverId: 'd-003', vehiclePlate: 'ك م ل ٨٩٠١', bidsCount: 4, distance: 380, estimatedDuration: '٤ ساعات', paymentStatus: 'released', paymentMethod: 'mada' },
    { id: 'SH-2024-005', customerId: 'user-001', pickupCity: 'الطائف', pickupAddress: 'سوق الخضار المركزي', deliveryCity: 'مكة المكرمة', deliveryAddress: 'حي العزيزية', cargoCategory: 'food', cargoCategoryAr: 'مواد غذائية', weight: 3000, description: 'Fresh fruits and vegetables', descriptionAr: 'فواكه وخضروات طازجة', specialHandling: ['refrigerated'], vehicleType: 'refrigerated', status: 'delivered', pricingMode: 'instant', estimatedPrice: 450, finalPrice: 450, createdAt: '2024-12-08', pickupDate: '2024-12-09', driverName: 'Sultan Al-Otaibi', driverNameAr: 'سلطان العتيبي', driverRating: 4.6, driverPhone: '+966 50 444 5555', driverId: 'd-004', vehiclePlate: 'ع ر ب ٣٤٥٦', bidsCount: 2, distance: 88, estimatedDuration: '١.٥ ساعة', paymentStatus: 'released', paymentMethod: 'stc_pay' },
    { id: 'SH-2024-006', customerId: 'user-003', pickupCity: 'الجبيل', pickupAddress: 'المنطقة الصناعية', deliveryCity: 'الدمام', deliveryAddress: 'ميناء الملك عبدالعزيز', cargoCategory: 'industrial', cargoCategoryAr: 'صناعي', weight: 12000, description: 'Industrial machinery parts', descriptionAr: 'قطع آلات صناعية', specialHandling: ['oversized', 'hazardous'], vehicleType: 'flatbed', status: 'pickup', pricingMode: 'bidding', estimatedPrice: 3500, finalPrice: 3200, createdAt: '2024-12-15', pickupDate: '2024-12-16', driverName: 'Saad Al-Harbi', driverNameAr: 'سعد الحربي', driverRating: 4.9, driverPhone: '+966 50 555 6666', driverId: 'd-005', vehiclePlate: 'ق ص د ٧٨٩٠', bidsCount: 6, distance: 95, estimatedDuration: '١.٥ ساعة', paymentStatus: 'authorized', paymentMethod: 'mada', brokerId: 'user-003' },
    { id: 'SH-2024-010', customerId: 'user-001', pickupCity: 'تبوك', pickupAddress: 'المنطقة الزراعية', deliveryCity: 'الرياض', deliveryAddress: 'سوق العزيزية المركزي', cargoCategory: 'food', cargoCategoryAr: 'مواد غذائية', weight: 7000, description: 'Fresh dates', descriptionAr: 'تمور طازجة - جودة ممتازة', specialHandling: [], vehicleType: 'lorry', status: 'searching', pricingMode: 'bidding', estimatedPrice: 3200, createdAt: '2024-12-16', pickupDate: '2024-12-18', bidsCount: 1, distance: 1200, estimatedDuration: '١٢ ساعة', paymentStatus: 'pending' },
];

export const mockBids: Bid[] = [
    { id: 'bid-001', shipmentId: 'SH-2024-002', driver: mockDrivers[0], amount: 1650, estimatedArrival: '٥ ساعات', message: 'I can load immediately', messageAr: 'أقدر أحمّل فوراً، عندي خبرة بمواد البناء', createdAt: '2024-12-16T10:30:00' },
    { id: 'bid-002', shipmentId: 'SH-2024-002', driver: mockDrivers[2], amount: 1500, estimatedArrival: '٦ ساعات', message: 'Best price guaranteed', messageAr: 'أفضل سعر مضمون، السطحة جاهزة', createdAt: '2024-12-16T10:45:00' },
    { id: 'bid-003', shipmentId: 'SH-2024-002', driver: mockDrivers[4], amount: 1700, estimatedArrival: '٤ ساعات', message: 'Express delivery', messageAr: 'توصيل سريع، تعامل ممتاز', createdAt: '2024-12-16T11:00:00' },
    { id: 'bid-004', shipmentId: 'SH-2024-010', driver: mockDrivers[1], amount: 2900, estimatedArrival: '١٢ ساعة', message: 'Available for long haul', messageAr: 'متاح للمسافات الطويلة، شاحنة صيانة ممتازة', createdAt: '2024-12-16T14:00:00' },
];

export const mockWalletTransactions: WalletTransaction[] = [
    { id: 'tx-001', type: 'payment', amount: -850, description: 'Shipment SH-2024-001', descriptionAr: 'شحنة SH-2024-001', date: '2024-12-16', status: 'pending', shipmentId: 'SH-2024-001' },
    { id: 'tx-002', type: 'payment', amount: -2200, description: 'Shipment SH-2024-003', descriptionAr: 'شحنة SH-2024-003', date: '2024-12-14', status: 'pending', shipmentId: 'SH-2024-003' },
    { id: 'tx-003', type: 'payment', amount: -520, description: 'Shipment SH-2024-004', descriptionAr: 'شحنة SH-2024-004', date: '2024-12-11', status: 'completed', shipmentId: 'SH-2024-004' },
    { id: 'tx-004', type: 'refund', amount: 150, description: 'Damage refund', descriptionAr: 'استرداد تلف - SH-2024-005', date: '2024-12-12', status: 'completed' },
    { id: 'tx-005', type: 'payment', amount: -3200, description: 'Shipment SH-2024-006', descriptionAr: 'شحنة SH-2024-006', date: '2024-12-15', status: 'pending', shipmentId: 'SH-2024-006' },
];

export const mockDriverTransactions: WalletTransaction[] = [
    { id: 'dtx-001', type: 'earning', amount: 722, description: 'Shipment SH-2024-001', descriptionAr: 'أرباح شحنة SH-2024-001', date: '2024-12-16', status: 'pending', shipmentId: 'SH-2024-001' },
    { id: 'dtx-002', type: 'earning', amount: 442, description: 'Shipment SH-2024-004', descriptionAr: 'أرباح شحنة SH-2024-004', date: '2024-12-11', status: 'completed', shipmentId: 'SH-2024-004' },
    { id: 'dtx-003', type: 'commission', amount: -128, description: 'Commission 15%', descriptionAr: 'عمولة المنصة ١٥٪', date: '2024-12-16', status: 'completed' },
    { id: 'dtx-004', type: 'withdrawal', amount: -2000, description: 'Bank withdrawal', descriptionAr: 'سحب بنكي - IBAN', date: '2024-12-10', status: 'completed' },
    { id: 'dtx-005', type: 'earning', amount: 2720, description: 'Shipment SH-2024-006', descriptionAr: 'أرباح شحنة SH-2024-006', date: '2024-12-15', status: 'pending', shipmentId: 'SH-2024-006' },
];

export const mockNotifications: Notification[] = [
    { id: 'n-001', title: 'شحنة في الطريق', body: 'السائق فهد القحطاني بدأ رحلة الشحنة SH-2024-001', type: 'shipment', read: false, timestamp: '2024-12-16T14:30:00', shipmentId: 'SH-2024-001' },
    { id: 'n-002', title: 'عرض سعر جديد', body: 'تلقيت عرض سعر جديد على شحنة SH-2024-002', type: 'bid', read: false, timestamp: '2024-12-16T11:00:00', shipmentId: 'SH-2024-002' },
    { id: 'n-003', title: 'تم الدفع', body: 'تم خصم 850 ر.س من محفظتك للشحنة SH-2024-001', type: 'payment', read: true, timestamp: '2024-12-16T09:00:00', shipmentId: 'SH-2024-001' },
    { id: 'n-004', title: 'تم التوصيل', body: 'تم توصيل الشحنة SH-2024-004 بنجاح', type: 'shipment', read: true, timestamp: '2024-12-11T16:30:00', shipmentId: 'SH-2024-004' },
    { id: 'n-005', title: 'تحديث النظام', body: 'تم تحديث تطبيق جمّال إلى الإصدار ١.٢', type: 'system', read: true, timestamp: '2024-12-10T08:00:00' },
];

export const saudiCities = ['الرياض', 'جدة', 'مكة المكرمة', 'المدينة المنورة', 'الدمام', 'الخبر', 'الظهران', 'تبوك', 'أبها', 'الطائف', 'ينبع', 'الجبيل', 'حائل', 'نجران', 'جيزان', 'بريدة', 'عنيزة', 'الباحة', 'سكاكا', 'عرعر'];
