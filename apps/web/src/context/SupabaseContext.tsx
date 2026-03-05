/* ============================================================================
 * جمّال — Supabase Context للويب
 * يوفر عميل Supabase موحد لكل صفحات الويب
 * ========================================================================== */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createWebSupabaseClient, getSupabase } from '@jammal/api';
import type { AppUser, UserRole } from '@jammal/shared';
import { normalizePhone, mapDbUserToAppUser, createDefaultUser } from '@jammal/shared';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
    supabase: SupabaseClient;
    user: AppUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    sendOtp: (phone: string) => Promise<boolean>;
    verifyOtp: (phone: string, code: string) => Promise<{ success: boolean; role?: UserRole }>;
    logout: () => Promise<void>;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

const DEV_MODE = false;
const DEV_OTP_CODE = '123456';
const STORAGE_KEY = 'jammal_web_user';

export function SupabaseProvider({ children }: { children: ReactNode }) {
    const [supabase] = useState(() => createWebSupabaseClient());
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // استعادة الجلسة عند التحميل
    useEffect(() => {
        if (DEV_MODE) {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                try { setUser(JSON.parse(stored)); } catch { }
            }
            setIsLoading(false);
            return;
        }

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfile(session.user.id, session.user.phone || '');
            } else {
                setIsLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchProfile(session.user.id, session.user.phone || '');
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // جلب بيانات المستخدم من قاعدة البيانات
    const fetchProfile = async (userId: string, phone: string) => {
        try {
            const { data } = await supabase.from('users').select('*').eq('id', userId).single();
            if (data) {
                setUser(mapDbUserToAppUser(data));
            } else {
                // مستخدم جديد - إنشاء ملف شخصي
                let newUser = createDefaultUser(phone);

                // التحقق من وجود بيانات تسجيل معلقة
                const pending = localStorage.getItem('jammal_pending_profile');
                if (pending) {
                    try {
                        const profileData = JSON.parse(pending);
                        newUser = {
                            ...newUser,
                            name: profileData.fullNameEn || newUser.name,
                            role: profileData.userType || 'customer'
                        };

                        const dbUser = {
                            id: userId,
                            role: profileData.userType || 'customer',
                            phone,
                            name: profileData.fullNameEn,
                            name_ar: profileData.fullNameAr || profileData.fullNameEn,
                            wallet_balance: 0,
                            rating: 5.0,
                            email: profileData.email,
                            // يمكن إضافة حقول إضافية هنا (details)
                        };
                        await supabase.from('users').insert(dbUser);
                        localStorage.removeItem('jammal_pending_profile');
                    } catch (e) {
                        console.error('Error parsing pending profile:', e);
                    }
                } else {
                    const dbUser = {
                        id: userId,
                        role: 'customer',
                        phone,
                        name: newUser.name,
                        name_ar: newUser.name,
                        wallet_balance: 0,
                        rating: 5.0,
                    };
                    await supabase.from('users').insert(dbUser);
                }
                setUser({ ...newUser, id: userId });
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // إرسال رمز OTP
    const sendOtp = async (phone: string): Promise<boolean> => {
        const cleanPhone = normalizePhone(phone);

        if (DEV_MODE) return true;

        const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone });
        if (error) {
            console.error('OTP Error:', error.message);
            return false;
        }
        return true;
    };

    // التحقق من رمز OTP
    const verifyOtp = async (phone: string, code: string): Promise<{ success: boolean; role?: UserRole }> => {
        const cleanPhone = normalizePhone(phone);

        if (DEV_MODE) {
            if (code !== DEV_OTP_CODE) return { success: false };

            let role: UserRole = 'customer';
            if (cleanPhone.includes('555555555')) role = 'driver';
            else if (cleanPhone.includes('999999999')) role = 'manager';

            const appUser = createDefaultUser(cleanPhone, role);
            const userWithId = { ...appUser, id: `dev-${cleanPhone}` };

            setUser(userWithId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithId));
            return { success: true, role };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            phone: cleanPhone,
            token: code,
            type: 'sms',
        });

        if (error || !data?.session) {
            console.error('Verify Error:', error?.message);
            return { success: false };
        }

        // جلب الدور
        const { data: profile } = await supabase
            .from('users')
            .select('role')
            .eq('id', data.session.user.id)
            .single();

        return { success: true, role: profile?.role as UserRole };
    };

    // تسجيل الخروج
    const logout = async () => {
        if (DEV_MODE) {
            localStorage.removeItem(STORAGE_KEY);
        } else {
            await supabase.auth.signOut();
        }
        setUser(null);
    };

    return (
        <SupabaseContext.Provider
            value={{
                supabase,
                user,
                isLoading,
                isAuthenticated: !!user,
                sendOtp,
                verifyOtp,
                logout,
            }}
        >
            {children}
        </SupabaseContext.Provider>
    );
}

export function useSupabase() {
    const context = useContext(SupabaseContext);
    if (!context) throw new Error('useSupabase must be used within SupabaseProvider');
    return context;
}
