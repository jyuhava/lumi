import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import {
  useActivityStore,
  ACTIVITY_TYPES,
  ActivityType,
  ActivityLog,
  formatDuration,
  stepsToDistance,
  getDailyStats,
  estimateCalories,
} from '@/stores/activityStore';
import { useAuthStore } from '@/stores/authStore';

// ─── Constants ────────────────────────────────────────────────────────────────
// Use app's primary teal to match bottom tab bar & home screen
const ACCENT = Colors.light.primary;           // #006764
const ACCENT_BG = Colors.light.primaryContainer; // #6cf1ec (light teal bg)
const BASE_URL = 'https://fe16-114-4-82-138.ngrok-free.app/api/personal';

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ActivityScreen() {
  // ── Store ──────────────────────────────────────────────────────────────────
  const { logs, tracking, loadLogs, addLog, deleteLog, updateLiveTracking,
    pauseTracking, resumeTracking, resetTracking, setTrackingType,
    startTracking,   // ← needed to set isTracking=true
  } = useActivityStore();

  // ── Mode Toggle ────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<'track' | 'manual'>('track');

  // ── Cloud sync state ───────────────────────────────────────────────────────
  const { isLoggedIn, token } = useAuthStore();
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');

  const syncToCloud = useCallback(async (logsOverride?: typeof logs) => {
    const target = logsOverride ?? logs;
    if (!isLoggedIn || !token || target.length === 0) return;
    setSyncStatus('syncing');
    try {
      const payload = target.map((l) => ({
        local_id:      l.id,
        entry_type:    l.type,
        activity_type: l.activityType,
        name:          l.name,
        steps:         l.steps,
        duration:      l.duration,
        distance:      l.distance,
        calories:      l.calories,
        recorded_at:   l.date,
      }));
      const res = await fetch(`${BASE_URL}/activity-logs/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ logs: payload }),
      });
      setSyncStatus(res.ok ? 'synced' : 'failed');
    } catch {
      setSyncStatus('failed');
    }
  }, [isLoggedIn, token, logs]);

  // Auto-sync on screen mount
  useEffect(() => {
    loadLogs();
    Accelerometer.setUpdateInterval(20);
    if (isLoggedIn) syncToCloud();
    return () => stopSensors();
  }, [isLoggedIn]);

  // ── Accelerometer step detection refs ────────────────────────────────────────
  // No special permission needed — Accelerometer is always accessible.
  const accelSub = useRef<ReturnType<typeof Accelerometer.addListener> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepCountRef = useRef(0);        // accumulated steps this session
  const lastMagRef = useRef(0);          // previous filtered magnitude
  const filteredMagRef = useRef(0);      // EMA-smoothed magnitude
  const lastStepTimeRef = useRef(0);     // timestamp of last detected step
  const durationRef = useRef(0);         // elapsed seconds

  // Step detection constants (tuned for walking/running at ~1-2 Hz)
  const STEP_THRESHOLD = 1.15;   // g — peak above this = potential step
  const STEP_DEBOUNCE_MS = 280;  // min ms between two steps
  const EMA_ALPHA = 0.15;        // EMA smoothing factor (lower = smoother)

  // ── Manual form state ──────────────────────────────────────────────────────
  const [manualType, setManualType] = useState<ActivityType>('walking');
  const [manualDuration, setManualDuration] = useState('');
  const [manualCalories, setManualCalories] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // User weight placeholder — in production, read from profile store
  const USER_WEIGHT = 65; // kg default

  // ─── Init ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    loadLogs();
    // Set accelerometer update interval to ~20ms (50 Hz) for good resolution
    Accelerometer.setUpdateInterval(20);
    return () => stopSensors();
  }, []);

  // ─── Sensor cleanup helper ─────────────────────────────────────────────────
  const stopSensors = () => {
    accelSub.current?.remove();
    accelSub.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };

  // ─── START TRACKING ────────────────────────────────────────────────────────
  const handleStart = useCallback(() => {
    // Preserve steps/duration when resuming from pause
    durationRef.current = tracking.isPaused ? tracking.duration : 0;
    stepCountRef.current = tracking.isPaused ? tracking.steps : 0;
    lastMagRef.current = 0;
    filteredMagRef.current = 0;
    lastStepTimeRef.current = 0;

    if (tracking.isPaused) {
      resumeTracking();
    } else {
      resetTracking();
      startTracking(); // flip isTracking=true so UI shows Pause/Stop
    }

    // ── Accelerometer step detection (no permission needed!) ──────────────────
    // Algorithm: EMA low-pass filter + upward zero-crossing / threshold peak.
    //   1. Compute vector magnitude |a| = sqrt(x²+y²+z²).
    //   2. Smooth with exponential moving average to remove high-freq noise.
    //   3. Rising edge above STEP_THRESHOLD after debounce period → step++.
    accelSub.current = Accelerometer.addListener(({ x, y, z }) => {
      const mag = Math.sqrt(x * x + y * y + z * z);
      const prev = filteredMagRef.current;
      // Apply EMA filter
      filteredMagRef.current = EMA_ALPHA * mag + (1 - EMA_ALPHA) * prev;

      const now = Date.now();
      const timeSinceLast = now - lastStepTimeRef.current;

      // Detect rising edge: filtered mag crosses threshold upward & debounce OK
      if (
        filteredMagRef.current > STEP_THRESHOLD &&
        lastMagRef.current <= STEP_THRESHOLD &&
        timeSinceLast > STEP_DEBOUNCE_MS
      ) {
        stepCountRef.current += 1;
        lastStepTimeRef.current = now;
        updateLiveTracking(stepCountRef.current, durationRef.current, USER_WEIGHT);
      }
      lastMagRef.current = filteredMagRef.current;
    });

    // 1-second timer to update duration display
    timerRef.current = setInterval(() => {
      durationRef.current += 1;
      updateLiveTracking(stepCountRef.current, durationRef.current, USER_WEIGHT);
    }, 1000);
  }, [tracking]);

  // ─── PAUSE TRACKING ────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    stopSensors();
    pauseTracking();
  }, []);

  // ─── STOP & SAVE ──────────────────────────────────────────────────────────
  const handleStop = useCallback(async () => {
    stopSensors();

    if (tracking.duration < 5 && tracking.steps < 10) {
      Alert.alert('Terlalu Singkat', 'Aktivitas terlalu pendek untuk disimpan.');
      resetTracking();
      return;
    }

    const typeMeta = ACTIVITY_TYPES.find((a) => a.value === tracking.activityType)!;
    const log: ActivityLog = {
      id: Date.now().toString(),
      type: 'tracking',
      activityType: tracking.activityType,
      name: typeMeta.label,
      steps: tracking.steps,
      duration: tracking.duration,
      distance: stepsToDistance(tracking.steps),
      calories: tracking.calories,
      date: new Date().toISOString(),
    };

    await addLog(log);
    resetTracking();
    Alert.alert('Aktivitas Tersimpan! 🎉', `${log.name} selama ${formatDuration(log.duration)} berhasil dicatat.`);
    setTimeout(() => syncToCloud(), 300);
  }, [tracking]);

  // ─── SAVE MANUAL LOG ──────────────────────────────────────────────────────
  const handleSaveManual = async () => {
    const dur = parseInt(manualDuration, 10);
    if (!dur || dur <= 0) {
      Alert.alert('Durasi tidak valid', 'Masukkan durasi dalam menit.');
      return;
    }

    const durationSec = dur * 60;
    const typeMeta = ACTIVITY_TYPES.find((a) => a.value === manualType)!;

    // Use user-provided calories, or auto-estimate from MET
    const kal = manualCalories
      ? parseInt(manualCalories, 10)
      : estimateCalories(manualType, dur, USER_WEIGHT);

    const log: ActivityLog = {
      id: Date.now().toString(),
      type: 'manual',
      activityType: manualType,
      name: typeMeta.label,
      steps: 0,
      duration: durationSec,
      distance: 0,
      calories: kal,
      date: new Date().toISOString(),
    };

    await addLog(log);
    setManualDuration('');
    setManualCalories('');
    Alert.alert('Tersimpan!', `${log.name} (${dur} menit) berhasil dicatat.`);
    setTimeout(() => syncToCloud(), 300);
  };

  // ─── Daily Stats ───────────────────────────────────────────────────────────
  const daily = getDailyStats(logs);

  // ─── Selected manual type meta ─────────────────────────────────────────────
  const manualTypeMeta = ACTIVITY_TYPES.find((a) => a.value === manualType)!;

  // ─────────────────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineMd" color={Colors.light.onSurface}>Activity</Text>
            <Text variant="bodySm" color={Colors.light.secondary}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
            </Text>
          </View>
          {/* Sync badge (shown when logged in) */}
          {isLoggedIn ? (
            <TouchableOpacity
              onPress={() => syncToCloud()}
              style={[styles.syncBadge,
                syncStatus === 'syncing' && { backgroundColor: ACCENT_BG },
                syncStatus === 'synced'  && { backgroundColor: '#E8F5E9' },
                syncStatus === 'failed'  && { backgroundColor: '#FFEBEE' },
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={syncStatus === 'synced' ? 'cloud-done-outline' : syncStatus === 'failed' ? 'cloud-offline-outline' : 'cloud-upload-outline'}
                size={15}
                color={syncStatus === 'synced' ? '#2E7D32' : syncStatus === 'failed' ? '#B71C1C' : ACCENT}
              />
              <Text
                variant="labelSm"
                color={syncStatus === 'synced' ? '#2E7D32' : syncStatus === 'failed' ? '#B71C1C' : ACCENT}
                style={{ marginLeft: 4 }}
              >
                {syncStatus === 'syncing' ? 'Sinkron...' : syncStatus === 'synced' ? 'Tersinkron' : syncStatus === 'failed' ? 'Gagal' : 'Backup'}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={[styles.badge, { backgroundColor: ACCENT_BG }]}>
              <Ionicons name="barbell-outline" size={18} color={ACCENT} />
            </View>
          )}
        </View>

        {/* ── Daily Summary ───────────────────────────────────────────────── */}
        <Card level="lowest" asymmetric={false} style={styles.summaryCard}>
          <Text variant="labelSm" color={Colors.light.secondary} style={{ marginBottom: 12 }}>
            RINGKASAN HARI INI
          </Text>
          <View style={styles.statsRow}>
            <StatItem icon="footsteps-outline" value={daily.steps.toLocaleString()} label="Langkah" color={ACCENT} />
            <View style={styles.statDivider} />
            <StatItem icon="flame-outline"    value={daily.calories.toString()} label="Kalori" color="#FF6B6B" />
            <View style={styles.statDivider} />
            <StatItem icon="time-outline"     value={formatDuration(daily.duration)} label="Durasi" color="#4CAF50" />
          </View>
        </Card>

        {/* ── Mode Toggle ─────────────────────────────────────────────────── */}
        <View style={styles.modeToggle}>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'track' && { backgroundColor: ACCENT, shadowColor: ACCENT }]}
            onPress={() => setMode('track')}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-circle-outline" size={16} color={mode === 'track' ? '#fff' : Colors.light.secondary} style={{ marginRight: 6 }} />
            <Text variant="labelSm" color={mode === 'track' ? '#fff' : Colors.light.secondary}>Smart Track</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, mode === 'manual' && { backgroundColor: ACCENT, shadowColor: ACCENT }]}
            onPress={() => setMode('manual')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={16} color={mode === 'manual' ? '#fff' : Colors.light.secondary} style={{ marginRight: 6 }} />
            <Text variant="labelSm" color={mode === 'manual' ? '#fff' : Colors.light.secondary}>Manual Log</Text>
          </TouchableOpacity>
        </View>

        {/* ─────────────────────────────────────────────────────────────────
            TRACKING PANEL
        ───────────────────────────────────────────────────────────────── */}
        {mode === 'track' && (
          <Card level="lowest" asymmetric={false} style={styles.panel}>

            {/* Accelerometer always active — no permission needed */}
            {!tracking.isTracking && !tracking.isPaused && (
              <View style={styles.grantedBanner}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text variant="bodySm" color="#2E7D32" style={{ marginLeft: 6 }}>
                  Accelerometer aktif — tidak perlu izin khusus ✓
                </Text>
              </View>
            )}


            {/* Activity type picker */}
            <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>JENIS AKTIVITAS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {ACTIVITY_TYPES.slice(0, 5).map((a) => (
                <TouchableOpacity
                  key={a.value}
                  onPress={() => setTrackingType(a.value)}
                  style={[
                    styles.typeChip,
                    tracking.activityType === a.value && { backgroundColor: ACCENT_BG, borderColor: ACCENT },
                  ]}
                >
                  <Ionicons name={a.icon as any} size={14} color={tracking.activityType === a.value ? ACCENT : Colors.light.secondary} />
                  <Text variant="labelSm" color={tracking.activityType === a.value ? ACCENT : Colors.light.secondary} style={{ marginLeft: 4 }}>
                    {a.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Live Stats */}
            <View style={styles.liveStats}>
              <LiveStat icon="footsteps-outline" value={tracking.steps.toLocaleString()} label="Langkah" color={ACCENT} />
              <LiveStat icon="time-outline"     value={formatDuration(tracking.duration)} label="Durasi"  color="#4CAF50" />
              <LiveStat icon="flame-outline"    value={`${tracking.calories}`}            label="Kalori"  color="#FF6B6B" />
            </View>

            {/* Tracking distance estimate */}
            {tracking.steps > 0 && (
              <Text variant="bodySm" color={Colors.light.secondary} align="center" style={{ marginBottom: 16 }}>
                ≈ {(stepsToDistance(tracking.steps) / 1000).toFixed(2)} km
              </Text>
            )}

            {/* Big Start / Pause / Resume Button */}
            {!tracking.isTracking && !tracking.isPaused && (
              <TouchableOpacity style={[styles.bigBtn, { backgroundColor: ACCENT }]} onPress={handleStart} activeOpacity={0.85}>
                <Ionicons name="play" size={28} color="#fff" />
                <Text variant="labelMd" color="#fff" style={{ marginLeft: 10 }}>Mulai Tracking</Text>
              </TouchableOpacity>
            )}

            {tracking.isTracking && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF9800' }]} onPress={handlePause} activeOpacity={0.85}>
                  <Ionicons name="pause" size={22} color="#fff" />
                  <Text variant="labelSm" color="#fff" style={{ marginLeft: 6 }}>Pause</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F44336' }]} onPress={handleStop} activeOpacity={0.85}>
                  <Ionicons name="stop" size={22} color="#fff" />
                  <Text variant="labelSm" color="#fff" style={{ marginLeft: 6 }}>Stop & Simpan</Text>
                </TouchableOpacity>
              </View>
            )}

            {tracking.isPaused && (
              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: ACCENT }]} onPress={handleStart} activeOpacity={0.85}>
                  <Ionicons name="play" size={22} color="#fff" />
                  <Text variant="labelSm" color="#fff" style={{ marginLeft: 6 }}>Lanjutkan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F44336' }]} onPress={handleStop} activeOpacity={0.85}>
                  <Ionicons name="stop" size={22} color="#fff" />
                  <Text variant="labelSm" color="#fff" style={{ marginLeft: 6 }}>Stop & Simpan</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            MANUAL LOG PANEL
        ───────────────────────────────────────────────────────────────── */}
        {mode === 'manual' && (
          <Card level="lowest" asymmetric={false} style={styles.panel}>

            {/* Activity type dropdown */}
            <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>JENIS AKTIVITAS</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowTypeDropdown((v) => !v)}
              activeOpacity={0.8}
            >
              <Ionicons name={manualTypeMeta.icon as any} size={18} color={ACCENT} />
              <Text variant="bodyLg" color={Colors.light.onSurface} style={{ flex: 1, marginLeft: 10 }}>
                {manualTypeMeta.label}
              </Text>
              <Ionicons name={showTypeDropdown ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.light.secondary} />
            </TouchableOpacity>

            {showTypeDropdown && (
              <Card level="low" asymmetric={false} style={styles.dropdownMenu}>
                {ACTIVITY_TYPES.map((a) => (
                  <TouchableOpacity
                    key={a.value}
                    style={[styles.dropdownItem, a.value === manualType && { backgroundColor: ACCENT_BG }]}
                    onPress={() => { setManualType(a.value); setShowTypeDropdown(false); }}
                  >
                    <Ionicons name={a.icon as any} size={16} color={a.value === manualType ? ACCENT : Colors.light.secondary} />
                    <Text variant="bodySm" color={a.value === manualType ? ACCENT : Colors.light.onSurface} style={{ marginLeft: 10 }}>
                      {a.label}
                    </Text>
                    <Text variant="bodySm" color={Colors.light.secondary} style={{ marginLeft: 'auto' }}>MET {a.met}</Text>
                  </TouchableOpacity>
                ))}
              </Card>
            )}

            {/* Duration */}
            <Text variant="labelSm" color={Colors.light.secondary} style={[styles.sectionLabel, { marginTop: 16 }]}>DURASI (MENIT)</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={manualDuration}
              onChangeText={setManualDuration}
              placeholder="Contoh: 30"
              placeholderTextColor={Colors.light.secondary}
            />

            {/* Estimated calories preview */}
            {manualDuration !== '' && !manualCalories && (
              <Text variant="bodySm" color={Colors.light.secondary} style={{ marginBottom: 12 }}>
                Estimasi: ≈ {estimateCalories(manualType, parseInt(manualDuration) || 0, USER_WEIGHT)} kkal
              </Text>
            )}

            {/* Optional calories override */}
            <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>KALORI (OPSIONAL)</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={manualCalories}
              onChangeText={setManualCalories}
              placeholder="Kosongkan untuk auto-estimasi"
              placeholderTextColor={Colors.light.secondary}
            />

            {/* Save Button */}
            <TouchableOpacity style={[styles.bigBtn, { backgroundColor: ACCENT }]} onPress={handleSaveManual} activeOpacity={0.85}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#fff" />
              <Text variant="labelMd" color="#fff" style={{ marginLeft: 8 }}>Simpan Aktivitas</Text>
            </TouchableOpacity>
          </Card>
        )}

        {/* ─────────────────────────────────────────────────────────────────
            ACTIVITY HISTORY
        ───────────────────────────────────────────────────────────────── */}
        <View style={styles.historyHeader}>
          <Text variant="headlineSm" color={Colors.light.onSurface}>Riwayat Aktivitas</Text>
          <Text variant="bodySm" color={Colors.light.secondary}>{logs.length} entri</Text>
        </View>

        {logs.length === 0 ? (
          <Card level="low" asymmetric={false} style={styles.emptyState}>
            <Ionicons name="barbell-outline" size={36} color={Colors.light.secondary} />
            <Text variant="bodyLg" color={Colors.light.secondary} align="center" style={{ marginTop: 8 }}>
              Belum ada aktivitas yang dicatat.{'\n'}Mulai tracking atau catat manual!
            </Text>
          </Card>
        ) : (
          logs.map((log) => <ActivityCard key={log.id} log={log} onDelete={() => deleteLog(log.id)} />)
        )}

        {/* Bottom padding for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatItem({ icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <View style={styles.statItem}>
      <Ionicons name={icon} size={20} color={color} />
      <Text variant="headlineSm" color={Colors.light.onSurface} style={{ marginTop: 4 }}>{value}</Text>
      <Text variant="labelSm" color={Colors.light.secondary}>{label}</Text>
    </View>
  );
}

function LiveStat({ icon, value, label, color }: { icon: any; value: string; label: string; color: string }) {
  return (
    <View style={styles.liveStat}>
      <View style={[styles.liveStatIcon, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text variant="headlineMd" color={Colors.light.onSurface} align="center" style={{ marginTop: 6 }}>{value}</Text>
      <Text variant="labelSm" color={Colors.light.secondary} align="center">{label}</Text>
    </View>
  );
}

function ActivityCard({ log, onDelete }: { log: ActivityLog; onDelete: () => void }) {
  const typeMeta = ACTIVITY_TYPES.find((a) => a.value === log.activityType) ?? ACTIVITY_TYPES[7];
  const dateStr = new Date(log.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <Card level="lowest" asymmetric={false} style={styles.activityCard}>
      <View style={styles.activityCardRow}>
        {/* Icon */}
        <View style={[styles.activityIcon, { backgroundColor: ACCENT_BG }]}>
          <Ionicons name={typeMeta.icon as any} size={22} color={ACCENT} />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={styles.activityCardHeader}>
            <Text variant="bodyLg" color={Colors.light.onSurface}>{log.name}</Text>
            {/* Type badge */}
            <View style={[styles.typeBadge, { backgroundColor: log.type === 'tracking' ? ACCENT_BG : Colors.light.surfaceContainerMid }]}>
              <Text variant="labelSm" color={log.type === 'tracking' ? ACCENT : Colors.light.secondary}>
                {log.type === 'tracking' ? '⚡ Auto' : '✏️ Manual'}
              </Text>
            </View>
          </View>
          <Text variant="bodySm" color={Colors.light.secondary}>{dateStr}</Text>
          <View style={styles.activityMeta}>
            {log.steps > 0 && <MetaPill icon="footsteps-outline" value={`${log.steps.toLocaleString()} langkah`} />}
            <MetaPill icon="time-outline"  value={formatDuration(log.duration)} />
            <MetaPill icon="flame-outline" value={`${log.calories} kkal`} />
          </View>
        </View>

        {/* Delete */}
        <TouchableOpacity
          onPress={() =>
            Alert.alert('Hapus Aktivitas', 'Yakin ingin menghapus entri ini?', [
              { text: 'Batal', style: 'cancel' },
              { text: 'Hapus', style: 'destructive', onPress: onDelete },
            ])
          }
          style={styles.deleteBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={18} color="#F44336" />
        </TouchableOpacity>
      </View>
    </Card>
  );
}

function MetaPill({ icon, value }: { icon: any; value: string }) {
  return (
    <View style={styles.metaPill}>
      <Ionicons name={icon} size={11} color={Colors.light.secondary} />
      <Text variant="labelSm" color={Colors.light.secondary} style={{ marginLeft: 3 }}>{value}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surfaceContainerLow },
  scrollContent: { paddingHorizontal: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  badge: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  summaryCard: { marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, height: 48, backgroundColor: Colors.light.outlineVariant },

  modeToggle: { flexDirection: 'row', backgroundColor: Colors.light.surfaceContainerMid, borderRadius: 50, padding: 4, marginBottom: 16 },
  modeTab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 50, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 2 },

  panel: { marginBottom: 16 },
  sectionLabel: { marginBottom: 8 },

  warningBanner: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#FFF3E0', padding: 12, borderRadius: 12, marginBottom: 16 },

  typeChip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 50, borderWidth: 1, borderColor: Colors.light.outlineVariant, marginRight: 8, backgroundColor: Colors.light.surfaceContainerLow },

  liveStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  liveStat: { flex: 1, alignItems: 'center' },
  liveStatIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  bigBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 50, marginTop: 8 },
  actionRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 50 },

  dropdown: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surfaceContainerLow, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: Colors.light.outlineVariant, marginBottom: 8 },
  dropdownMenu: { marginBottom: 8, padding: 8 },
  dropdownItem: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12 },

  textInput: {
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.light.outlineVariant,
    color: Colors.light.onSurface,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'PlusJakartaSans-Regular' : undefined,
  },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12, marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 32 },

  activityCard: { marginBottom: 10 },
  activityCardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  activityIcon: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  activityCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2, flexWrap: 'wrap' },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  activityMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 6 },
  metaPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.light.surfaceContainerLow, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50 },
  deleteBtn: { padding: 8, alignSelf: 'center' },

  permissionBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderRadius: 50, paddingVertical: 12, paddingHorizontal: 20,
    marginBottom: 16,
  },
  grantedBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#E8F5E9', borderRadius: 12, padding: 10, marginBottom: 12,
  },
  settingsBtn: {
    paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: ACCENT_BG, borderRadius: 50, marginLeft: 8,
  },
  syncBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: ACCENT_BG,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 50,
  },
});
