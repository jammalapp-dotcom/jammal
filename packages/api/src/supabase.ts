// جمّال - عميل Supabase الموحد
// يعمل على الويب والموبايل بدون تغيير

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ==================== إعدادات Supabase ====================

const SUPABASE_URL = 'https://kfzoouifwtubmsbtktyy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtmem9vdWlmd3R1Ym1zYnRrdHl5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MzcwNjQsImV4cCI6MjA4ODExMzA2NH0.96jA4kd9m0Gp8o65blDm444fC_UwubR6a0LpzJd2lyA';

// ==================== التخزين المتوافق مع المنصتين ====================

/**
 * واجهة التخزين - تعمل على الويب (localStorage) والموبايل (يتم تمريره)
 * في الموبايل نمرر AsyncStorage من الخارج
 */
interface StorageAdapter {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
}

/** تخزين الويب (localStorage) */
const webStorage: StorageAdapter = {
    getItem: (key: string) => {
        if (typeof window === 'undefined') return Promise.resolve(null);
        return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
        return Promise.resolve();
    },
    removeItem: (key: string) => {
        if (typeof window !== 'undefined') window.localStorage.removeItem(key);
        return Promise.resolve();
    },
};

// ==================== إنشاء العميل ====================

let _supabase: SupabaseClient | null = null;

/**
 * إنشاء عميل Supabase للويب (يستخدم localStorage تلقائياً)
 */
export function createWebSupabaseClient(): SupabaseClient {
    if (_supabase) return _supabase;
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            storage: webStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    });
    return _supabase;
}

/**
 * إنشاء عميل Supabase للموبايل (يحتاج AsyncStorage)
 */
export function createMobileSupabaseClient(asyncStorage: StorageAdapter): SupabaseClient {
    if (_supabase) return _supabase;
    _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
            storage: asyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    });
    return _supabase;
}

/**
 * الحصول على عميل Supabase الحالي
 * يجب استدعاء createWebSupabaseClient أو createMobileSupabaseClient أولاً
 */
export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        throw new Error('Supabase client not initialized. Call createWebSupabaseClient() or createMobileSupabaseClient() first.');
    }
    return _supabase;
}

// تصدير الثوابت للاستخدام في الاختبارات
export { SUPABASE_URL, SUPABASE_ANON_KEY };
