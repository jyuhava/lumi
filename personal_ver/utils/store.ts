import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Platform } from 'react-native';

// Custom storage handler: localStorage for Web, AsyncStorage for Mobile
const storageProvider = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(name);
    }
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(name, value);
    } else {
      await AsyncStorage.setItem(name, value);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(name);
    } else {
      await AsyncStorage.removeItem(name);
    }
  },
};

export interface UserProfile {
  name: string;
  birthDate: string;
  gender: 'Male' | 'Female' | '';
  height: string; // cm
  weight: string; // kg
  bloodType: 'A' | 'B' | 'AB' | 'O' | '';
  activityLevel: string;
  targetWeight?: string; // kg
}

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
}

interface UserState {
  profile: UserProfile | null;
  hasCompletedOnboarding: boolean;
  hasHydrated: boolean;
  weightLogs: WeightLog[];
  setHasHydrated: (state: boolean) => void;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addWeightLog: (weight: number) => void;
  setWeightLogs: (logs: WeightLog[]) => void;
  completeOnboarding: () => void;
  resetStore: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      hasCompletedOnboarding: false,
      hasHydrated: false,
      weightLogs: [],
      setHasHydrated: (state) => set({ hasHydrated: state }),
      setProfile: (profile) => set({ profile }),
      updateProfile: (profileUpdates) => 
        set({ profile: { ...(get().profile as UserProfile), ...profileUpdates } }),
      addWeightLog: (weight) => 
        set((state) => {
          const newLog = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            weight,
          };
          const newProfile = state.profile ? { ...state.profile, weight: weight.toString() } : null;
          return {
            weightLogs: [newLog, ...state.weightLogs],
            profile: newProfile
          };
        }),
      completeOnboarding: () => set((state) => {
        let initialLogs = state.weightLogs;
        if (state.profile?.weight && initialLogs.length === 0) {
          initialLogs = [{
            id: Date.now().toString(),
            date: new Date().toISOString(),
            weight: parseFloat(state.profile.weight)
          }];
        }
        return { hasCompletedOnboarding: true, weightLogs: initialLogs };
      }),
      setWeightLogs: (logs) => set({ weightLogs: logs }),
      resetStore: () => set({ profile: null, hasCompletedOnboarding: false, weightLogs: [] }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => storageProvider),
      partialize: (state) => ({ 
        profile: state.profile, 
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        weightLogs: state.weightLogs
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
