// ============================================================================
// JAMMAL — Auth State Store (Zustand)
// ============================================================================

import { create } from 'zustand';
// In production, use expo-secure-store for token persistence
// import * as SecureStore from 'expo-secure-store';

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
    setAuth: (user: AuthUser, accessToken: string, refreshToken: string) => void;
    clearAuth: () => void;
    loadSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    accessToken: null,
    refreshToken: null,
    isLoading: true,

    setAuth: (user, accessToken, refreshToken) => {
        set({ isAuthenticated: true, user, accessToken, refreshToken, isLoading: false });
        // Persist tokens
        // SecureStore.setItemAsync('accessToken', accessToken);
        // SecureStore.setItemAsync('refreshToken', refreshToken);
        // SecureStore.setItemAsync('user', JSON.stringify(user));
    },

    clearAuth: () => {
        set({ isAuthenticated: false, user: null, accessToken: null, refreshToken: null, isLoading: false });
        // SecureStore.deleteItemAsync('accessToken');
        // SecureStore.deleteItemAsync('refreshToken');
        // SecureStore.deleteItemAsync('user');
    },

    loadSession: async () => {
        try {
            // const accessToken = await SecureStore.getItemAsync('accessToken');
            // const refreshToken = await SecureStore.getItemAsync('refreshToken');
            // const userJson = await SecureStore.getItemAsync('user');
            // if (accessToken && refreshToken && userJson) {
            //   set({ isAuthenticated: true, accessToken, refreshToken, user: JSON.parse(userJson), isLoading: false });
            // } else {
            set({ isLoading: false });
            // }
        } catch {
            set({ isLoading: false });
        }
    },
}));
