import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// ─── Types ────────────────────────────────────────────────────────────────────

/** All known activity types with their MET (metabolic equivalent) values */
export const ACTIVITY_TYPES = [
  { label: 'Jalan Kaki',  value: 'walking',   icon: 'walk-outline',       met: 3.5 },
  { label: 'Lari',        value: 'running',   icon: 'fitness-outline',    met: 8.0 },
  { label: 'Bersepeda',   value: 'cycling',   icon: 'bicycle-outline',    met: 6.0 },
  { label: 'Renang',      value: 'swimming',  icon: 'water-outline',      met: 7.0 },
  { label: 'Gym / Angkat Beban', value: 'gym', icon: 'barbell-outline',  met: 5.0 },
  { label: 'Yoga',        value: 'yoga',      icon: 'body-outline',       met: 2.5 },
  { label: 'HIIT',        value: 'hiit',      icon: 'flash-outline',      met: 9.0 },
  { label: 'Aktivitas Lainnya', value: 'other', icon: 'ellipsis-horizontal-outline', met: 4.0 },
] as const;

export type ActivityType = typeof ACTIVITY_TYPES[number]['value'];

/** Single activity log entry — both manual and tracker */
export interface ActivityLog {
  id: string;
  /** "manual" = entered by user, "tracking" = recorded by pedometer */
  type: 'manual' | 'tracking';
  /** Activity category (e.g. walking, running) */
  activityType: ActivityType;
  /** Human-readable name */
  name: string;
  /** Step count (0 for manual entries without pedometer) */
  steps: number;
  /** Duration in seconds */
  duration: number;
  /** Estimated distance in metres */
  distance: number;
  /** Estimated kilocalories burned */
  calories: number;
  /** ISO timestamp of when the activity was recorded */
  date: string;
}

/** Live tracking session state */
interface TrackingState {
  isTracking: boolean;
  isPaused: boolean;
  /** Steps recorded in the current session */
  steps: number;
  /** Elapsed seconds in current session */
  duration: number;
  /** Calories estimated so far */
  calories: number;
  /** Current activity type for tracking mode */
  activityType: ActivityType;
}

// ─── Storage Key ─────────────────────────────────────────────────────────────
const STORAGE_KEY = '@lumifit:activity_logs';

// ─── Store Interface ──────────────────────────────────────────────────────────
interface ActivityStore {
  // State
  logs: ActivityLog[];
  tracking: TrackingState;

  // Log Actions
  loadLogs: () => Promise<void>;
  setLogs: (logs: ActivityLog[]) => Promise<void>;
  addLog: (log: ActivityLog) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  updateLog: (id: string, updates: Partial<ActivityLog>) => Promise<void>;

  // Tracking Actions
  setTrackingType: (type: ActivityType) => void;
  startTracking: () => void;  // NEW: sets isTracking=true
  updateLiveTracking: (steps: number, duration: number, weight: number) => void;
  pauseTracking: () => void;
  resumeTracking: () => void;
  resetTracking: () => void;
  resetAll: () => Promise<void>;
}

// ─── Default Tracking State ───────────────────────────────────────────────────
const DEFAULT_TRACKING: TrackingState = {
  isTracking: false,
  isPaused: false,
  steps: 0,
  duration: 0,
  calories: 0,
  activityType: 'walking',
};

// ─── Store ────────────────────────────────────────────────────────────────────
export const useActivityStore = create<ActivityStore>((set, get) => ({
  logs: [],
  tracking: { ...DEFAULT_TRACKING },

  // ── Persistence ────────────────────────────────────────────────────────────

  /** Load persisted logs from AsyncStorage on app start */
  loadLogs: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) set({ logs: JSON.parse(raw) });
    } catch (e) {
      console.warn('[ActivityStore] Failed to load logs:', e);
    }
  },

  setLogs: async (logs) => {
    set({ logs });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  },

  /** Save current logs slice to AsyncStorage */
  addLog: async (log) => {
    const updated = [log, ...get().logs];
    set({ logs: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  deleteLog: async (id) => {
    const updated = get().logs.filter((l) => l.id !== id);
    set({ logs: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  updateLog: async (id, updates) => {
    const updated = get().logs.map((l) => (l.id === id ? { ...l, ...updates } : l));
    set({ logs: updated });
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  // ── Tracking ───────────────────────────────────────────────────────────────

  setTrackingType: (type) =>
    set((s) => ({ tracking: { ...s.tracking, activityType: type } })),

  /** Mark session as actively tracking (isTracking = true) */
  startTracking: () =>
    set((s) => ({ tracking: { ...s.tracking, isTracking: true, isPaused: false } })),

  /**
   * Called every second by the timer callback.
   * Updates steps (from Pedometer), duration, and recalculates calories.
   * Calorie formula: steps × 0.04  (≈ 1 step ≈ 0.04 kcal, reasonable for walking pace)
   * For timed activities we also apply: kcal = MET × weight(kg) × duration(h)
   */
  updateLiveTracking: (steps, duration, weight) => {
    const met = ACTIVITY_TYPES.find((a) => a.value === get().tracking.activityType)?.met ?? 4.0;
    const hours = duration / 3600;
    // Blend: use steps-based when steps >0, fallback to time-based
    const caloriesStepBased = steps * 0.04;
    const caloriesTimeBased = met * (weight > 0 ? weight : 65) * hours;
    const calories = steps > 10 ? caloriesStepBased : caloriesTimeBased;

    set((s) => ({
      tracking: { ...s.tracking, steps, duration, calories: Math.round(calories) },
    }));
  },

  pauseTracking: () =>
    set((s) => ({ tracking: { ...s.tracking, isPaused: true, isTracking: false } })),

  resumeTracking: () =>
    set((s) => ({ tracking: { ...s.tracking, isPaused: false, isTracking: true } })),

  resetTracking: () =>
    set({ tracking: { ...DEFAULT_TRACKING } }),

  resetAll: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ logs: [], tracking: { ...DEFAULT_TRACKING } });
  },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format seconds → "mm:ss" or "hh:mm:ss" */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/** Estimate distance in metres from step count */
export function stepsToDistance(steps: number): number {
  return Math.round(steps * 0.75); // avg step length ≈ 0.75 m
}

/** Get today's aggregated stats from a logs array */
export function getDailyStats(logs: ActivityLog[]) {
  const today = new Date().toDateString();
  const todayLogs = logs.filter((l) => new Date(l.date).toDateString() === today);
  return {
    steps:    todayLogs.reduce((s, l) => s + l.steps, 0),
    calories: todayLogs.reduce((s, l) => s + l.calories, 0),
    duration: todayLogs.reduce((s, l) => s + l.duration, 0),
  };
}

/** Estimate calories for a manual entry: MET × weight × hours */
export function estimateCalories(activityType: ActivityType, durationMin: number, weightKg: number): number {
  const met = ACTIVITY_TYPES.find((a) => a.value === activityType)?.met ?? 4.0;
  return Math.round(met * (weightKg > 0 ? weightKg : 65) * (durationMin / 60));
}
