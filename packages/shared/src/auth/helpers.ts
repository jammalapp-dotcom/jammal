// جمّال - دوال المصادقة المشتركة
// تُستخدم في الويب والموبايل

import type { AppUser, UserRole, DbUser } from '../types';

/**
 * توحيد صيغة رقم الجوال السعودي
 * يحوّل أي صيغة إلى +966XXXXXXXXX
 */
export function normalizePhone(phone: string): string {
    let clean = phone.replace(/[\s\-()]/g, '');
    if (clean.startsWith('05')) {
        clean = '+966' + clean.slice(1);
    } else if (clean.startsWith('5') && clean.length === 9) {
        clean = '+966' + clean;
    } else if (!clean.startsWith('+')) {
        clean = '+' + clean;
    }
    return clean;
}

/**
 * تحويل بيانات المستخدم من صيغة قاعدة البيانات إلى صيغة التطبيق
 */
export function mapDbUserToAppUser(dbUser: DbUser): AppUser {
    return {
        id: dbUser.id,
        role: dbUser.role,
        type: dbUser.company ? 'business' : 'personal',
        name: dbUser.name_ar || dbUser.name || 'مستخدم',
        nameEn: dbUser.name || 'User',
        phone: dbUser.phone,
        email: dbUser.email || '',
        company: dbUser.company_ar || dbUser.company || '',
        companyEn: dbUser.company || '',
        rating: dbUser.rating || 5.0,
        walletBalance: dbUser.wallet_balance || 0,
        verified: dbUser.verified || false,
        totalShipments: dbUser.completed_trips || 0,
        vehicleType: dbUser.vehicle_type || undefined,
        vehiclePlate: dbUser.vehicle_plate || undefined,
        fleetSize: dbUser.fleet_size || 0,
        isOnline: dbUser.is_online || false,
    };
}

/**
 * إنشاء مستخدم افتراضي جديد
 */
export function createDefaultUser(phone: string, role: UserRole = 'customer'): AppUser {
    return {
        id: `new-${phone.replace(/[^0-9]/g, '')}`,
        name: 'مستخدم جديد',
        nameEn: 'New User',
        phone,
        email: '',
        role,
        type: 'personal',
        company: '',
        companyEn: '',
        rating: 5.0,
        totalShipments: 0,
        walletBalance: 0,
        verified: false,
    };
}
