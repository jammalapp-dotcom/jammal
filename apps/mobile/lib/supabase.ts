// جمّال — عميل Supabase للموبايل
// يستخدم @jammal/api الموحد مع AsyncStorage
// SSR-safe: يتعامل مع بيئة الخادم بدون window

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMobileSupabaseClient } from '@jammal/api';

// تحقق من بيئة العميل (ليس SSR)
const isClientSide = typeof globalThis !== 'undefined' && typeof globalThis.setTimeout === 'function';

// محوّل التخزين الآمن - يحمي من SSR
const safeStorage = {
    getItem: async (key: string): Promise<string | null> => {
        if (!isClientSide) return null;
        try { return await AsyncStorage.getItem(key); } catch { return null; }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (!isClientSide) return;
        try { await AsyncStorage.setItem(key, value); } catch { }
    },
    removeItem: async (key: string): Promise<void> => {
        if (!isClientSide) return;
        try { await AsyncStorage.removeItem(key); } catch { }
    },
};

// إنشاء العميل الموحد
export const supabase = createMobileSupabaseClient(safeStorage);
