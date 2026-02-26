// ============================================================================
// JAMMAL — Auth State Store (Zustand + SecureStore)
// ============================================================================

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { api } from '../config/api';

interface AuthUser {
    id: string;
    userType: 'customer' | 'driver' | 'broker' | 'admin';
    fullNameEn: string;
    fullNameAr: string;
    email: string;
    phone: string;
    phoneVerified: boolean;
    emailVerified: boolean;
    locale: string;
    profilePhotoUrl?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: AuthUser | null;
    accessToken: string | null;
    refreshToken: string | null;
    isLoading: boolean;
    pendingUserId: string | null;
    setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    loadSession: () => Promise<void>;
    setPendingUserId: (userId: string) => void;
    login: (identifier: string, password: string) => Promise<any>;
    register: (data: any) => Promise<any>;
    verifyOtp: (code: string, purpose: string) => Promise<any>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,
    pendingUserId: null,

    setAuth: async (user, accessToken, refreshToken) => {
        set({ isAuthenticated: true, user, accessToken, refreshToken, isLoading: false });
        try {
            await SecureStore.setItemAsync('accessToken', accessToken);
            await SecureStore.setItemAsync('refreshToken', refreshToken);
            await SecureStore.setItemAsync('user', JSON.stringify(user));
        } catch (e) {
            console.warn('Failed to persist auth:', e);
        }
    },

    clearAuth: async () => {
        set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null, isLoading: false, pendingUserId: null });
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('user');
        } catch (e) {
            console.warn('Failed to clear auth:', e);
        }
    },

    loadSession: async () => {
        try {
            const accessToken = await SecureStore.getItemAsync('accessToken');
            const refreshToken = await SecureStore.getItemAsync('refreshToken');
            const userJson = await SecureStore.getItemAsync('user');
            if (accessToken && refreshToken && userJson) {
                set({
                    isAuthenticated: true,
                    accessToken,
                    refreshToken,
                    user: JSON.parse(userJson),
                    isLoading: false,
                });
            } else {
                set({ isLoading: false });
            }
        } catch {
            set({ isLoading: false });
        }
    },

    setPendingUserId: (userId: string) => {
        set({ pendingUserId: userId });
    },

    login: async (identifier: string, password: string) => {
        const result: any = await api.login(identifier, password);
        if (result.data?.requiresOtp) {
            set({ pendingUserId: result.data.userId });
            return result;
        }
        if (result.data?.accessToken) {
            get().setAuth(result.data.user, result.data.accessToken, result.data.refreshToken);
        }
        return result;
    },

    register: async (data: any) => {
        const result: any = await api.register(data);
        if (result.data?.userId) {
            set({ pendingUserId: result.data.userId });
        }
        return result;
    },

    verifyOtp: async (code: string, purpose: string) => {
        const userId = get().pendingUserId;
        if (!userId) throw new Error('No pending user');
        const result: any = await api.verifyOtp(userId, code, purpose);
        if (result.data?.accessToken) {
            get().setAuth(result.data.user, result.data.accessToken, result.data.refreshToken);
        }
        return result;
    },

    logout: async () => {
        const refreshToken = get().refreshToken;
        try {
            if (refreshToken) await api.logout(refreshToken);
        } catch { }
        get().clearAuth();
    },
}));
