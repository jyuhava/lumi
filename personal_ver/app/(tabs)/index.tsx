import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useUserStore } from '@/utils/store';
import { useAuthStore } from '@/stores/authStore';
import { useActivityStore } from '@/stores/activityStore';
import { useWaterStore } from '@/stores/waterStore';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = 'https://fe16-114-4-82-138.ngrok-free.app/api/personal';
import { isToday, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const { profile, weightLogs } = useUserStore();
  const { logs: activityLogs } = useActivityStore();
  const { logs: waterLogs } = useWaterStore();
  const { isLoggedIn, token } = useAuthStore();
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(() => {
    // Check if the latest log is from today
    if (weightLogs.length === 0) return true;
    const latestDate = parseISO(weightLogs[0].date);
    return !isToday(latestDate);
  });

  // ── Global Sync ──────────────────────────────────────────────────────────
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');

  const syncAllToCloud = useCallback(async () => {
    if (!isLoggedIn || !token) return;
    if (weightLogs.length === 0 && activityLogs.length === 0) return;
    setSyncStatus('syncing');
    try {
      const requests = [];
      if (weightLogs.length > 0) {
        requests.push(fetch(`${BASE_URL}/weight-logs/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ logs: weightLogs.map((l) => ({ local_id: l.id, weight: l.weight, recorded_at: l.date })) }),
        }));
      }
      if (activityLogs.length > 0) {
        requests.push(fetch(`${BASE_URL}/activity-logs/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ logs: activityLogs.map((l) => ({
            local_id: l.id, entry_type: l.type, activity_type: l.activityType,
            name: l.name, steps: l.steps, duration: l.duration, distance: l.distance, calories: l.calories, recorded_at: l.date
          }))}),
        }));
      }
      if (waterLogs.length > 0) {
        requests.push(fetch(`${BASE_URL}/water-logs/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ logs: waterLogs.map((l) => ({
            local_id: l.id, amount_ml: l.amount, recorded_at: l.date
          }))}),
        }));
      }
      
      if (requests.length === 0) {
         setSyncStatus('synced');
         return;
      }
      const responses = await Promise.all(requests);
      setSyncStatus(responses.every(r => r.ok) ? 'synced' : 'failed');
    } catch {
      setSyncStatus('failed');
    }
  }, [isLoggedIn, token, weightLogs, activityLogs, waterLogs]);

  useEffect(() => {
    if (isLoggedIn) syncAllToCloud();
  }, [isLoggedIn, waterLogs]); // Sync when logs change or logged in

  const calculateTarget = useWaterStore(s => s.calculateTarget);
  useEffect(() => {
    calculateTarget();
  }, [profile?.weight, profile?.activityLevel]);

  // Fallback defaults in case profile isn't fully loaded
  const name = profile?.name?.split(' ')[0] || 'User';
  const weight = weightLogs.length > 0 ? weightLogs[0].weight : parseFloat(profile?.weight || '0');
  const heightStr = profile?.height || '0';
  const heightCm = parseFloat(heightStr);
  const isFemale = profile?.gender === 'Female';

  // IMT / BMI Calculation
  // IMT = berat(kg) / (tinggi(m)^2)
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? (weight / (heightM * heightM)) : 0;

  let bmiCategory = 'Underweight';
  let bmiColor = '#6cf1ec';
  if (bmi >= 18.5 && bmi <= 25) {
    bmiCategory = 'Normal';
    bmiColor = '#6cf1ec'; // Light Cyan/Teal
  } else if (bmi > 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = '#f59e0b'; // Ambient Orange
  } else if (bmi >= 30) {
    bmiCategory = 'Obese';
    bmiColor = '#ef4444'; // Red
  }

  // Ideal Body Weight Calculation
  const ibwBase = heightCm - 100;
  const ibwMultiplier = isFemale ? 0.85 : 0.9;
  const ibw = heightCm > 0 ? ibwBase * ibwMultiplier : 0;

  // Real Progress Logic
  const goalWeight = profile?.targetWeight ? parseFloat(profile.targetWeight) : ibw;
  // Oldest weight log is the start weight
  const startWeight = weightLogs.length > 0 ? weightLogs[weightLogs.length - 1].weight : weight;
  const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : weight;

  const totalDifference = Math.abs(startWeight - goalWeight);
  const currentDifference = Math.abs(currentWeight - goalWeight);
  let progressPercent = 0;

  if (totalDifference > 0) {
    if (currentDifference === 0) {
      progressPercent = 100;
    } else if (
      (startWeight > goalWeight && currentWeight < goalWeight) ||
      (startWeight < goalWeight && currentWeight > goalWeight)
    ) {
      // Reached or surpassed goal
      progressPercent = 100;
    } else if (
      (startWeight > goalWeight && currentWeight > startWeight) ||
      (startWeight < goalWeight && currentWeight < startWeight)
    ) {
      // Going in the completely wrong direction from the start weight
      progressPercent = 0;
    } else {
      progressPercent = Math.max(0, Math.round(((totalDifference - currentDifference) / totalDifference) * 100));
    }
  }

  const weightLeft = currentDifference;

  return (
    <SafeAreaView style={styles.safeArea}>

      {/* Warning Modal */}
      <Modal visible={showWarningModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <Card level="lowest" style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons name="alert-circle" size={48} color="#ef4444" />
            </View>
            <Text variant="headlineMd" color={Colors.light.onSurface} style={styles.modalTitle}>
              Belum Catat Berat!
            </Text>
            <Text variant="bodyLg" color={Colors.light.secondary} style={styles.modalDesc}>
              Hai {name}, Anda belum mencatat berat badan hari ini. Yuk disiplin capai target Anda!
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowWarningModal(false)} style={styles.modalSkipBtn}>
                <Text variant="labelLg" color={Colors.light.secondary}>Skip for now</Text>
              </TouchableOpacity>
              <Button
                label="Catat Sekarang"
                onPress={() => {
                  setShowWarningModal(false);
                  router.push('/(tabs)/weight');
                }}
                style={styles.modalActionBtn}
              />
            </View>
          </Card>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Dummy profile icon */}
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={24} color={Colors.light.surfaceLowest} />
            </View>
            <Text variant="titleLg" color={Colors.light.primaryDim} style={styles.brandTitle}>LumiFit</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {/* Global Sync status badge */}
            {isLoggedIn && syncStatus !== 'idle' && (
              <TouchableOpacity
                onPress={syncAllToCloud}
                style={[styles.syncBadge,
                  syncStatus === 'syncing' && { backgroundColor: Colors.light.primaryContainer },
                  syncStatus === 'synced'  && { backgroundColor: '#E8F5E9' },
                  syncStatus === 'failed'  && { backgroundColor: '#FFEBEE' },
                ]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={syncStatus === 'synced' ? 'cloud-done-outline' : syncStatus === 'failed' ? 'cloud-offline-outline' : 'sync-outline'}
                  size={13}
                  color={syncStatus === 'synced' ? '#2E7D32' : syncStatus === 'failed' ? '#B71C1C' : Colors.light.primary}
                />
                <Text
                  variant="labelSm"
                  color={syncStatus === 'synced' ? '#2E7D32' : syncStatus === 'failed' ? '#B71C1C' : Colors.light.primary}
                  style={{ marginLeft: 4 }}
                >
                  {syncStatus === 'syncing' ? 'Menyinkron...' : syncStatus === 'synced' ? 'Tersinkron' : 'Gagal — Coba Lagi'}
                </Text>
              </TouchableOpacity>
            )}
            <Ionicons name="notifications" size={24} color={Colors.light.primary} />
          </View>
        </View>

        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text variant="displaySm" color={Colors.light.onSurface}>Hi, {name}! 👋</Text>
          <Text variant="bodyLg" color={Colors.light.primaryDim} style={styles.greetingSub}>
            Ready to crush your goals today?
          </Text>
        </View>

        {/* Compact BMI Card */}
        <Card level="lowest" style={styles.bmiCard}>
          <View style={styles.bmiHeader}>
            <Text variant="labelSm" color={Colors.light.secondary}>CURRENT BMI</Text>
            <View style={[styles.pill, { backgroundColor: bmiColor }]}>
              <Text variant="labelSm" color={Colors.light.primary}>{bmiCategory}</Text>
            </View>
          </View>
          <Text variant="displaySm" color={Colors.light.primaryDim} style={styles.bmiValue}>
            {bmi.toFixed(1)}
          </Text>

          <View style={styles.segmentedBar}>
            <View style={[styles.segment, { backgroundColor: '#6cf1ec', flex: 2 }]} />
            <View style={[styles.segment, { backgroundColor: '#006764', flex: 5 }]} />
            <View style={[styles.segment, { backgroundColor: '#b78c9c', flex: 3 }]} />
          </View>
        </Card>

        {/* Compact Metrics Row */}
        <View style={styles.metricsRow}>
          <Card level="lowest" style={styles.metricCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="body" size={14} color={Colors.light.primary} />
              <Text variant="labelSm" color={Colors.light.secondary} style={{ marginLeft: 4 }}>IDEAL</Text>
            </View>
            <View style={styles.metricValueContainer}>
              <Text variant="headlineMd" color={Colors.light.onSurface}>{ibw.toFixed(1)}</Text>
              <Text variant="labelMd" color={Colors.light.secondary} style={styles.unit}> kg</Text>
            </View>
          </Card>

          <Card level="lowest" style={styles.metricCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="scale-outline" size={14} color={Colors.light.primary} />
              <Text variant="labelSm" color={Colors.light.secondary} style={{ marginLeft: 4 }}>LATEST</Text>
            </View>
            <View style={styles.metricValueContainer}>
              <Text variant="headlineMd" color={Colors.light.onSurface}>{weight.toFixed(1)}</Text>
              <Text variant="labelMd" color={Colors.light.secondary} style={styles.unit}> kg</Text>
            </View>
          </Card>
        </View>

        {/* Weight Progress Card */}
        <Card level="low" style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text variant="titleMd" color={Colors.light.onSurface}>Weight Progress</Text>
              <Text variant="labelSm" color={Colors.light.secondary}>{weightLeft.toFixed(1)}kg left to reach goal</Text>
            </View>
            <Text variant="headlineMd" color={Colors.light.primaryDim}>{progressPercent}%</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            {/* Knob positioning */}
            <View style={[styles.progressKnob, { left: `${progressPercent}%` }]} />
          </View>

          <View style={styles.progressLabels}>
            <Text variant="labelSm" color={Colors.light.secondary}>START: {startWeight}KG</Text>
            <Text variant="labelSm" color={Colors.light.secondary}>GOAL: {goalWeight.toFixed(0)}KG</Text>
          </View>
        </Card>

        {/* Explore Features Section */}
        <Text variant="titleLg" color={Colors.light.onSurface} style={{ marginBottom: 16 }}>Explore</Text>

        <View style={styles.appGrid}>
          <TouchableOpacity 
            style={styles.appItem} 
            onPress={() => router.push('/kalkulator')}
            activeOpacity={0.7}
          >
            <View style={[styles.appIcon, { backgroundColor: '#F3E8FF' }]}>
              <Ionicons name="calculator" size={28} color="#9333EA" />
            </View>
            <Text variant="labelSm" color={Colors.light.onSurface} style={styles.appTitle} numberOfLines={1}>
              Kal. Gizi
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appItem} 
            activeOpacity={0.7}
            onPress={() => router.push('/water' as any)}
          >
            <View style={[styles.appIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="water" size={28} color="#0EA5E9" />
            </View>
            <Text variant="labelSm" color={Colors.light.onSurface} style={styles.appTitle} numberOfLines={1}>
              Cairan
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.appItem} 
            activeOpacity={0.7}
            onPress={() => alert('Segera Hadir!')}
          >
            <View style={[styles.appIcon, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="restaurant" size={28} color="#0284C7" />
            </View>
            <Text variant="labelSm" color={Colors.light.onSurface} style={styles.appTitle} numberOfLines={1}>
              Meal Plan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow, // Use deeper surface background for contrast
  },
  container: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 16, // Top safe area padding
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFBEA6', // Example peach color
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  brandTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
  greetingSection: {
    marginBottom: 32,
  },
  greetingSub: {
    marginTop: 4,
  },
  bmiCard: {
    marginBottom: 12,
    borderWidth: 0,
    padding: 16,
  },
  bmiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  bmiValue: {
    marginVertical: 8,
  },
  segmentedBar: {
    flexDirection: 'row',
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    gap: 2,
  },
  segment: {
    height: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    padding: 12,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  unit: {
    marginLeft: 4,
  },
  progressCard: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: Colors.light.surfaceContainerHighest, // Tinted teal background
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBarContainer: {
    position: 'relative',
    height: 16,
    justifyContent: 'center',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: Colors.light.surfaceLowest,
    opacity: 0.5,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  progressKnob: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.surfaceLowest,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    marginLeft: -8, // Centers the knob
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    rowGap: 24,
    marginBottom: 24,
  },
  appItem: {
    width: 72,
    alignItems: 'center',
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  appTitle: {
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    padding: 32,
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffebeb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    textAlign: 'center',
    marginBottom: 32,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalSkipBtn: {
    padding: 16,
  },
  modalActionBtn: {
    flex: 1,
    marginLeft: 16,
  },
  syncBadge: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50,
  },
});
