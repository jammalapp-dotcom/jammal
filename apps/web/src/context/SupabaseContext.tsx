/* ============================================================================
 * جمّال — Supabase Context للويب
 * يوفر عميل Supabase موحد لكل صفحات الويب
 * المصادقة عبر البريد الإلكتروني (Email OTP) — مجاني مع Supabase
 * ========================================================================== */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createWebSupabaseClient, getSupabase } from '@jammal/api';
import type { AppUser, UserRole } from '@jammal/shared';
import { mapDbUserToAppUser, createDefaultUser } from '@jammal/shared';
import type { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextType {
    supabase: SupabaseClient;
    user: AppUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    sendOtp: (email: string) => Promise<boolean>;
    verifyOtp: (email: string, code: string) => Promise<{ success: boolean; role?: UserRole }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signInWithEmail: (email: string, password: string) => Promise<{ success: boolean; role?: UserRole; error?: string }>;
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
                fetchProfile(session.user.id, session.user.email || session.user.phone || '');
            } else {
                setIsLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchProfile(session.user.id, session.user.email || session.user.phone || '');
            } else {
                setUser(null);
                setIsLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // جلب بيانات المستخدم من قاعدة البيانات
    const fetchProfile = async (userId: string, contact: string) => {
        try {
            const { data } = await supabase.from('users').select('*').eq('id', userId).single();
            if (data) {
                setUser(mapDbUserToAppUser(data));
            } else {
                // مستخدم جديد - إنشاء ملف شخصي
                let newUser = createDefaultUser(contact);

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
                            phone: profileData.phone || '',
                            name: profileData.fullNameEn,
                            name_ar: profileData.fullNameAr || profileData.fullNameEn,
                            wallet_balance: 0,
                            rating: 5.0,
                            email: profileData.email || contact,
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
                        phone: '',
                        name: newUser.name,
                        name_ar: newUser.name,
                        wallet_balance: 0,
                        rating: 5.0,
                        email: contact,
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

    // إرسال رمز OTP عبر البريد الإلكتروني (مجاني)
    const sendOtp = async (email: string): Promise<boolean> => {
        if (DEV_MODE) return true;

        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            console.error('OTP Error:', error.message);
            return false;
        }
        return true;
    };

    // التحقق من رمز OTP عبر البريد الإلكتروني
    const verifyOtp = async (email: string, code: string): Promise<{ success: boolean; role?: UserRole }> => {
        if (DEV_MODE) {
            if (code !== DEV_OTP_CODE) return { success: false };
            const appUser = createDefaultUser(email);
            const userWithId = { ...appUser, id: `dev-${email}` };
            setUser(userWithId);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithId));
            return { success: true, role: 'customer' };
        }

        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token: code,
            type: 'email',
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

    // التسجيل بالبريد الإلكتروني وكلمة المرور
    const signUpWithEmail = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error('SignUp Error:', error.message);
            return { success: false, error: error.message };
        }
        return { success: true };
    };

    // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
    const signInWithEmail = async (email: string, password: string): Promise<{ success: boolean; role?: UserRole; error?: string }> => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error('SignIn Error:', error.message);
            return { success: false, error: error.message };
        }

        if (!data?.session) return { success: false, error: 'No session' };

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
                signUpWithEmail,
                signInWithEmail,
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
