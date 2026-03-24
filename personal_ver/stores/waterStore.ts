import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserStore } from '@/utils/store';
import { isSameDay, parseISO } from 'date-fns';

export interface WaterLog {
  id: string; // unique local ID
  amount: number; // in ml
  date: string; // ISO datetime
}

interface WaterState {
  logs: WaterLog[];
  dailyTarget: number;
  hasHydrated: boolean;

  // Actions
  setHasHydrated: (state: boolean) => void;
  setLogs: (logs: WaterLog[]) => Promise<void>;
  addLog: (amount: number) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getTodayTotal: () => number;
  calculateTarget: () => void;
  resetAll: () => Promise<void>;
}

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      logs: [],
      dailyTarget: 2000,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setLogs: async (logs) => {
        set({ logs });
      },

      addLog: async (amount) => {
        const newLog: WaterLog = {
          id: Math.random().toString(36).substring(2, 9),
          amount,
          date: new Date().toISOString(),
        };
        set({ logs: [newLog, ...get().logs] });
      },

      deleteLog: async (id) => {
        set({ logs: get().logs.filter((l) => l.id !== id) });
      },

      getTodayTotal: () => {
        const today = new Date();
        return get().logs
          .filter((l) => isSameDay(parseISO(l.date), today))
          .reduce((sum, l) => sum + l.amount, 0);
      },

      calculateTarget: () => {
        const profile = useUserStore.getState().profile;
        if (!profile || !profile.weight) {
          set({ dailyTarget: 2000 });
          return;
        }
        
        const weight = parseFloat(profile.weight);
        let multiplier = 30; // base (Sedentary)
        
        const activity = profile.activityLevel;
        // Check for both label-based and numeric-based activity levels
        if (activity === 'Sedang' || activity === 'Aktif' || activity === '1.55' || activity === '1.725') multiplier = 35;
        if (activity === 'Sangat Aktif' || activity === '1.9') multiplier = 40;
        
        set({ dailyTarget: Math.round(weight * multiplier) });
      },

      resetAll: async () => {
        set({ logs: [], dailyTarget: 2000 });
      },
    }),
    {
      name: 'water-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
