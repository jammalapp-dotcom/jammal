import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { AppUser, UserRole, TEST_USERS } from '../services/mockData';

interface AuthState {
  user: AppUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  otpSent: boolean;
  otpTimer: number;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<{ success: boolean; role?: UserRole }>;
  logout: () => void;
  updateUser: (updates: Partial<AppUser>) => Promise<void>;
}

export const AuthContext = createContext<AuthState | undefined>(undefined);

/**
 * DEV_MODE = true  → No SMS, no Twilio, no Supabase Auth needed.
 *   Users authenticate locally. Any phone number works with code 123456.
 *   Role is determined by matching against TEST_USERS phone numbers.
 *
 * DEV_MODE = false → Production mode with real Supabase Phone OTP.
 */
const DEV_MODE = true;
const DEV_OTP_CODE = '123456';
const STORAGE_KEY = 'jammal_user';

function normalizePhone(phone: string): string {
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

function resolveRole(phone: string): { role: UserRole; user: AppUser } {
  const testEntry = Object.values(TEST_USERS).find((t) => {
    return normalizePhone(t.phone) === phone;
  });

  if (testEntry) {
    return { role: testEntry.user.role, user: testEntry.user };
  }

  // Unknown number → default to customer
  return {
    role: 'customer',
    user: {
      id: `dev-${phone.replace(/[^0-9]/g, '')}`,
      name: 'مستخدم جديد',
      nameEn: 'New User',
      phone,
      email: '',
      role: 'customer',
      type: 'personal',
      company: '',
      companyEn: '',
      rating: 5.0,
      totalShipments: 0,
      walletBalance: 0,
      verified: false,
    },
  };
}

// ─── Production helpers ─────────────────────────────────────────────
const mapDbUserToAppUser = (dbUser: any): AppUser => ({
  id: dbUser.id,
  role: dbUser.role as UserRole,
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
  vehicleType: dbUser.vehicle_type,
  fleetSize: dbUser.fleet_size || 0,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // ── Restore session ──────────────────────────────────────────────
  useEffect(() => {
    if (DEV_MODE) {
      AsyncStorage.getItem(STORAGE_KEY)
        .then((data) => {
          if (data) {
            try { setUser(JSON.parse(data)); } catch { }
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          fetchProfile(session.user.id, session.user.phone || '').finally(() => setIsLoading(false));
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
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((p) => p - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [otpTimer]);

  // ── Production: fetch/create profile ─────────────────────────────
  const fetchProfile = async (userId: string, phone: string): Promise<UserRole> => {
    const { data } = await supabase.from('users').select('*').eq('id', userId).single();
    if (data) {
      setUser(mapDbUserToAppUser(data));
      return data.role as UserRole;
    }
    const { role, user: appUser } = resolveRole(phone);
    const newUser = { id: userId, role, phone, name: appUser.name, name_ar: appUser.name, wallet_balance: 0, rating: 5.0 };
    await supabase.from('users').insert(newUser);
    setUser(mapDbUserToAppUser(newUser));
    return role;
  };

  // ── Send OTP ─────────────────────────────────────────────────────
  const sendOtp = async (phone: string): Promise<boolean> => {
    const cleanPhone = normalizePhone(phone);
    setPhoneNumber(cleanPhone);

    if (DEV_MODE) {
      // No network call at all — just pretend it was sent
      setOtpSent(true);
      setOtpTimer(60);
      return true;
    }

    // Production: real Supabase Phone OTP
    const { error } = await supabase.auth.signInWithOtp({ phone: cleanPhone });
    if (error) {
      console.error('OTP Error:', error.message);
      return false;
    }
    setOtpSent(true);
    setOtpTimer(60);
    return true;
  };

  // ── Verify OTP ───────────────────────────────────────────────────
  const verifyOtp = async (code: string): Promise<{ success: boolean; role?: UserRole }> => {
    if (DEV_MODE) {
      if (code !== DEV_OTP_CODE) {
        return { success: false };
      }

      // Resolve the user from the phone number (matching TEST_USERS)
      const { role, user: appUser } = resolveRole(phoneNumber);
      setUser(appUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appUser));
      setOtpSent(false);
      return { success: true, role };
    }

    // Production: real verification
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: code,
      type: 'sms',
    });

    if (error || !data?.session) {
      console.error('Verify Error:', error?.message);
      return { success: false };
    }

    const role = await fetchProfile(data.session.user.id, phoneNumber);
    setOtpSent(false);
    return { success: true, role };
  };

  // ── Logout ───────────────────────────────────────────────────────
  const logout = async () => {
    if (DEV_MODE) {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await supabase.auth.signOut();
    }
    setUser(null);
    setOtpSent(false);
    setPhoneNumber('');
  };

  // ── Update user ──────────────────────────────────────────────────
  const updateUser = async (updates: Partial<AppUser>) => {
    if (user) {
      const updated = { ...user, ...updates };
      setUser(updated);
      if (DEV_MODE) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } else {
        const dbUpdates: any = {};
        if (updates.name) { dbUpdates.name_ar = updates.name; dbUpdates.name = updates.name; }
        if (updates.walletBalance !== undefined) dbUpdates.wallet_balance = updates.walletBalance;
        if (updates.vehicleType) dbUpdates.vehicle_type = updates.vehicleType;
        await supabase.from('users').update(dbUpdates).eq('id', user.id);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        phoneNumber,
        setPhoneNumber,
        otpSent,
        otpTimer,
        sendOtp,
        verifyOtp,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
