import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useUserStore } from '@/utils/store';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersonalUser {
  id: number;
  name: string;
  email: string;
  gender?: string;
  birth_date?: string;
  height_cm?: number;
  weight_kg?: number;
  blood_type?: string;
  activity_level?: string;
  target_weight_kg?: number;
}

// Base URL of the Laravel backend
const BASE_URL = 'https://fe16-114-4-82-138.ngrok-free.app/api/personal';
const TOKEN_KEY = '@lumifit:personal_token';

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthState {
  token: string | null;
  user: PersonalUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadToken: () => Promise<void>;
  register: (payload: RegisterPayload) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<PersonalUser>) => Promise<boolean>;
  clearError: () => void;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,

  /** Load persisted token on app start and fetch user info */
  loadToken: async () => {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    if (!token) return;

    try {
      const res = await fetch(`${BASE_URL}/me`, {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        set({ token, user: data.user, isLoggedIn: true });
      } else {
        // Token expired or invalid — clear it
        await AsyncStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // Network error — keep token, will retry on next open
      set({ token, isLoggedIn: false });
    }
  },

  /** Register a new personal user */
  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const reqBody: Record<string, any> = { ...payload };
      const { profile } = useUserStore.getState();
      if (profile) {
        if (profile.gender) reqBody.gender = profile.gender;
        if (profile.birthDate) reqBody.birth_date = profile.birthDate;
        if (profile.height) reqBody.height_cm = Number(profile.height);
        if (profile.weight) reqBody.weight_kg = Number(profile.weight);
        if (profile.bloodType) reqBody.blood_type = profile.bloodType;
        if (profile.activityLevel) reqBody.activity_level = profile.activityLevel;
        if (profile.targetWeight) reqBody.target_weight_kg = Number(profile.targetWeight);
      }

      const res = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(reqBody),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        set({ token: data.token, user: data.user, isLoggedIn: true, isLoading: false });
        return true;
      } else {
        // Extract first validation error message
        const msg = data.errors
          ? Object.values(data.errors as Record<string, string[]>)[0][0]
          : (data.message ?? 'Registrasi gagal.');
        set({ error: msg, isLoading: false });
        return false;
      }
    } catch (e) {
      set({ error: 'Tidak dapat terhubung ke server.', isLoading: false });
      return false;
    }
  },

  /** Login an existing personal user */
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        set({ token: data.token, user: data.user, isLoggedIn: true, isLoading: false });
        return true;
      } else {
        set({ error: data.message ?? 'Login gagal.', isLoading: false });
        return false;
      }
    } catch {
      set({ error: 'Tidak dapat terhubung ke server.', isLoading: false });
      return false;
    }
  },

  /** Logout and revoke token on server */
  logout: async () => {
    const { token } = get();
    if (token) {
      try {
        await fetch(`${BASE_URL}/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
        });
      } catch { /* ignore network error on logout */ }
    }
    await AsyncStorage.removeItem(TOKEN_KEY);
    set({ token: null, user: null, isLoggedIn: false });
  },

  updateProfile: async (updates) => {
    const { token } = get();
    if (!token) return false;
    try {
      const res = await fetch(`${BASE_URL}/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user });
        return true;
      }
      return false;
    } catch {
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));
