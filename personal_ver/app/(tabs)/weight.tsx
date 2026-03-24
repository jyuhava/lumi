import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { useUserStore } from '@/utils/store';
import { useAuthStore } from '@/stores/authStore';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';

const BASE_URL = 'https://fe16-114-4-82-138.ngrok-free.app/api/personal';

export default function WeightScreen() {
  const { profile, weightLogs, addWeightLog, updateProfile } = useUserStore();
  const { isLoggedIn, token } = useAuthStore();
  const [newWeight, setNewWeight] = useState('');
  const [editTarget, setEditTarget] = useState(false);
  const [targetInput, setTargetInput] = useState('');
  // 'idle' | 'syncing' | 'synced' | 'failed'
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'failed'>('idle');

  // ── Cloud sync ────────────────────────────────────────────────────────────────
  const syncToCloud = useCallback(async (logs = weightLogs) => {
    if (!isLoggedIn || !token || logs.length === 0) return;
    setSyncStatus('syncing');
    try {
      const payload = logs.map((l) => ({
        local_id:    l.id,
        weight:      l.weight,
        recorded_at: l.date,
      }));
      const res = await fetch(`${BASE_URL}/weight-logs/sync`, {
        method:  'POST',
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
  }, [isLoggedIn, token, weightLogs]);

  // Auto-sync on mount if logged in
  useEffect(() => {
    if (isLoggedIn) syncToCloud();
  }, [isLoggedIn]);

  const currentWeight = weightLogs.length > 0 ? weightLogs[0].weight : parseFloat(profile?.weight || '0');
  const heightCm = parseFloat(profile?.height || '0');
  const isFemale = profile?.gender === 'Female';
  
  const ibwBase = heightCm - 100;
  const ibwMultiplier = isFemale ? 0.85 : 0.9;
  const ibw = heightCm > 0 ? ibwBase * ibwMultiplier : 0;
  const currentTarget = profile?.targetWeight ? parseFloat(profile.targetWeight) : ibw;

  const handleAddLog = () => {
    const parsedWeight = parseFloat(newWeight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) {
      Alert.alert('Perhatian', 'Mohon masukkan berat badan yang valid');
      return;
    }
    addWeightLog(parsedWeight);
    setNewWeight('');
    // Sync the updated list (including this new entry) after state settles
    setTimeout(() => syncToCloud(), 300);
  };

  const handleSaveTarget = () => {
    const parsedTarget = parseFloat(targetInput);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      Alert.alert('Perhatian', 'Mohon masukkan target yang valid');
      return;
    }
    updateProfile({ targetWeight: parsedTarget.toString() });
    setEditTarget(false);
    setTargetInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text variant="titleLg" color={Colors.light.onSurface} style={styles.brandTitle}>Weight Tracking</Text>
          {/* Sync status badge */}
          {isLoggedIn && syncStatus !== 'idle' && (
            <TouchableOpacity
              onPress={() => syncToCloud()}
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
          {isLoggedIn && syncStatus === 'idle' && (
            <TouchableOpacity onPress={() => syncToCloud()} style={styles.syncBadge} activeOpacity={0.8}>
              <Ionicons name="cloud-upload-outline" size={13} color={Colors.light.primary} />
              <Text variant="labelSm" color={Colors.light.primary} style={{ marginLeft: 4 }}>Backup</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Current Weight Overview */}
        <Card level="lowest" style={styles.heroCard}>
          <Text variant="labelSm" color={Colors.light.secondary}>LATEST WEIGHT</Text>
          <View style={styles.heroValueRow}>
            <Text variant="displayLg" color={Colors.light.primaryDim}>{currentWeight.toFixed(1)}</Text>
            <Text variant="titleLg" color={Colors.light.secondary} style={styles.unit}> kg</Text>
          </View>
          <Text variant="bodyMd" color={Colors.light.secondary}>
            {Math.abs(currentWeight - currentTarget).toFixed(1)} kg from your target ({currentTarget.toFixed(1)} kg)
          </Text>
        </Card>

        {/* Target Weight Setting */}
        <View style={styles.targetRow}>
          <View style={{flex: 1}}>
             <Text variant="titleMd" color={Colors.light.onSurface}>Your Goal</Text>
             {!editTarget && (
               <Text variant="bodyMd" color={Colors.light.secondary}>
                 Target: <Text variant="labelLg" color={Colors.light.primaryDim}>{currentTarget.toFixed(1)} kg</Text>
               </Text>
             )}
          </View>
          {!editTarget ? (
             <TouchableOpacity onPress={() => { setEditTarget(true); setTargetInput(currentTarget.toString()); }} style={styles.editBtn}>
                <Ionicons name="pencil" size={16} color={Colors.light.primary} />
                <Text variant="labelSm" color={Colors.light.primary} style={{marginLeft: 4}}>Set Goal</Text>
             </TouchableOpacity>
          ) : (
             <View style={styles.targetInputRow}>
                <TextInput
                  style={styles.smallInput}
                  keyboardType="numeric"
                  value={targetInput}
                  onChangeText={setTargetInput}
                  autoFocus
                />
                <TouchableOpacity onPress={handleSaveTarget} style={styles.saveSmallBtn}>
                  <Text variant="labelSm" color={Colors.light.surfaceLowest}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditTarget(false)} style={styles.cancelSmallBtn}>
                  <Ionicons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
             </View>
          )}
        </View>

        {/* Add Log Section */}
        <Text variant="titleLg" color={Colors.light.onSurface} style={styles.sectionTitle}>Add New Log</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="e.g. 70.5"
              placeholderTextColor={Colors.light.outlineVariant || '#ccc'}
              keyboardType="numeric"
              value={newWeight}
              onChangeText={setNewWeight}
            />
            <Text variant="labelSm" color={Colors.light.secondary} style={styles.inputSuffix}>kg</Text>
          </View>
          <Button label="Save" onPress={handleAddLog} style={styles.saveBtn} />
        </View>

        {/* History List */}
        <Text variant="titleLg" color={Colors.light.onSurface} style={styles.sectionTitle}>History</Text>
        {weightLogs.length === 0 ? (
          <Text variant="bodyMd" color={Colors.light.secondary}>No records found yet.</Text>
        ) : (
          weightLogs.map((log, index) => {
            const isLatest = index === 0;
            const diff = index < weightLogs.length - 1 ? log.weight - weightLogs[index + 1].weight : 0;
            
            return (
              <Card key={log.id} level="lowest" style={styles.historyCard}>
                <View style={styles.historyLeft}>
                  <View style={[styles.dateIcon, isLatest && styles.dateIconActive]}>
                    <Ionicons name="calendar" size={20} color={isLatest ? Colors.light.surfaceLowest : Colors.light.primary} />
                  </View>
                  <View>
                    <Text variant="titleLg" color={Colors.light.onSurface}>{format(parseISO(log.date), 'dd MMM yyyy')}</Text>
                    <Text variant="labelSm" color={Colors.light.secondary}>{format(parseISO(log.date), 'hh:mm a')}</Text>
                  </View>
                </View>
                <View style={styles.historyRight}>
                  <Text variant="titleLg" color={isLatest ? Colors.light.primaryDim : Colors.light.onSurface}>
                    {log.weight.toFixed(1)} kg
                  </Text>
                  {diff !== 0 && (
                    <View style={styles.diffRow}>
                      <Ionicons name={diff > 0 ? 'arrow-up' : 'arrow-down'} size={12} color={diff > 0 ? '#ef4444' : '#10b981'} />
                      <Text variant="labelSm" color={diff > 0 ? '#ef4444' : '#10b981'}>
                        {Math.abs(diff).toFixed(1)} kg
                      </Text>
                    </View>
                  )}
                </View>
              </Card>
            );
          })
        )}
        
        <View style={{height: 120}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  container: {
    padding: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 24,
  },
  brandTitle: {
    fontFamily: 'PlusJakartaSans-Bold',
  },
  heroCard: {
    marginBottom: 32,
    borderWidth: 0,
    backgroundColor: Colors.light.surfaceLowest,
  },
  heroValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  unit: {
    marginLeft: 4,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceLowest,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontFamily: 'PlusJakartaSans-SemiBold',
    fontSize: 16,
    color: Colors.light.onSurface,
  },
  inputSuffix: {
    marginLeft: 8,
  },
  saveBtn: {
    width: 100,
    height: 56,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 12,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  dateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E6F8F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateIconActive: {
    backgroundColor: Colors.light.primary,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  diffRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: Colors.light.surfaceLowest,
    padding: 16,
    borderRadius: 16,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#E6F8F6',
  },
  targetInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  smallInput: {
    width: 60,
    height: 36,
    backgroundColor: Colors.light.surfaceContainerLow,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: 'PlusJakartaSans-SemiBold',
  },
  saveSmallBtn: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 12,
    height: 36,
    justifyContent: 'center',
    borderRadius: 8,
  },
  cancelSmallBtn: {
    padding: 8,
  },
  syncBadge: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.light.primaryContainer,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50,
  },
});
