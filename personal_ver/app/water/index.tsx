import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useWaterStore } from '@/stores/waterStore';
import { format, parseISO } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import * as NotificationUtils from '@/utils/notifications';

// Notification handler is now called in setupNotifications utility

export default function WaterTrackerScreen() {
  const router = useRouter();
  const { logs, dailyTarget, calculateTarget, getTodayTotal, addLog, deleteLog } = useWaterStore();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    calculateTarget();
    const init = async () => {
       await NotificationUtils.setupNotifications();
       const granted = await NotificationUtils.requestPermissions();
       setHasPermission(granted);
    }
    init();
  }, []);

  // Permission request moved to init in useEffect for cleaner code

  const scheduleReminders = async () => {
    if (!hasPermission) return;
    
    // Cancel all previously scheduled notifications
    await NotificationUtils.cancelAllNotifications();

    const currentTotal = getTodayTotal();
    
    // Only schedule if hasn't met target
    if (currentTotal < dailyTarget) {
      // 1. Remind in 3 hours if no update
      await NotificationUtils.scheduleWaterReminder(3 * 60 * 60);

      // 2. Night warning at 10 PM
      const now = new Date();
      const nightTime = new Date();
      nightTime.setHours(22, 0, 0, 0);
      
      if (now < nightTime) {
        await NotificationUtils.scheduleNightlyReminder();
      }
    }
  };

  const handleAddWater = async (amount: number) => {
    await addLog(amount);
    scheduleReminders();
  };

  const handleDeleteLog = (id: string) => {
    Alert.alert('Hapus Catatan', 'Apakah Anda yakin ingin menghapus catatan minum ini?', [
      { text: 'Batal', style: 'cancel' },
      { text: 'Hapus', style: 'destructive', onPress: async () => {
        await deleteLog(id);
        scheduleReminders(); // Re-evaluate reminders
      }},
    ]);
  };

  const todayTotal = getTodayTotal();
  const progressPercent = Math.min(100, Math.round((todayTotal / dailyTarget) * 100)) || 0;
  
  const todayLogs = logs.filter(l => l.date.includes(new Date().toISOString().split('T')[0]));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.onSurface} />
        </TouchableOpacity>
        <Text variant="titleMd" color={Colors.light.onSurface}>Kebutuhan Cairan</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Progress Display */}
        <View style={styles.progressSection}>
          <View style={styles.circleContainer}>
            <View style={[styles.circleFill, { height: `${progressPercent}%` }]} />
            <Ionicons name="water" size={48} color={progressPercent > 50 ? '#fff' : '#0EA5E9'} style={styles.circleIcon} />
            <Text variant="headlineMd" color={progressPercent > 50 ? '#fff' : Colors.light.onSurface} style={styles.circleText}>
              {progressPercent}%
            </Text>
          </View>
          
          <Text variant="titleLg" color={Colors.light.onSurface} style={{ marginTop: 24 }}>
            {todayTotal} <Text variant="titleMd" color={Colors.light.secondary}>/ {dailyTarget} ml</Text>
          </Text>
          <Text variant="labelSm" color={Colors.light.secondary}>Tercapai Hari Ini</Text>
        </View>

        {/* Quick Add Buttons */}
        <Text variant="titleMd" color={Colors.light.onSurface} style={{ marginBottom: 16 }}>Tambah Catatan</Text>
        <View style={styles.quickAddRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddWater(250)}>
            <Ionicons name="cafe" size={24} color="#0EA5E9" />
            <Text variant="labelMd" color={Colors.light.onSurface} style={{ marginTop: 8 }}>250 ml</Text>
            <Text variant="labelSm" color={Colors.light.secondary}>1 Gelas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddWater(600)}>
            <Ionicons name="beaker" size={24} color="#0EA5E9" />
            <Text variant="labelMd" color={Colors.light.onSurface} style={{ marginTop: 8 }}>600 ml</Text>
            <Text variant="labelSm" color={Colors.light.secondary}>Botol Sedang</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.addBtn} onPress={() => handleAddWater(1000)}>
            <Ionicons name="water" size={24} color="#0EA5E9" />
            <Text variant="labelMd" color={Colors.light.onSurface} style={{ marginTop: 8 }}>1 L</Text>
            <Text variant="labelSm" color={Colors.light.secondary}>Botol Besar</Text>
          </TouchableOpacity>
        </View>

        {/* Today's History */}
        <Text variant="titleMd" color={Colors.light.onSurface} style={{ marginBottom: 16, marginTop: 32 }}>Riwayat Hari Ini</Text>
        
        {todayLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="water-outline" size={48} color={Colors.light.secondary} />
            <Text variant="bodyMd" color={Colors.light.secondary} style={{ marginTop: 12 }}>Belum ada catatan minum hari ini.</Text>
          </View>
        ) : (
          todayLogs.map((log) => (
            <Card key={log.id} level="lowest" style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIconBox}>
                  <Ionicons name="water" size={20} color="#0EA5E9" />
                </View>
                <View>
                  <Text variant="labelMd" color={Colors.light.onSurface}>{log.amount} ml</Text>
                  <Text variant="labelSm" color={Colors.light.secondary}>
                    {format(parseISO(log.date), 'HH:mm', { locale: idLocale })}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDeleteLog(log.id)} style={{ padding: 8 }}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </Card>
          ))
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.light.surfaceLowest,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  container: {
    padding: 24,
    paddingBottom: 48,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 16,
  },
  circleContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 8,
    borderColor: '#BAE6FD',
  },
  circleFill: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#38BDF8',
  },
  circleIcon: {
    position: 'absolute',
    top: 40,
    zIndex: 10,
  },
  circleText: {
    position: 'absolute',
    bottom: 40,
    zIndex: 10,
  },
  quickAddRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.light.surfaceLowest,
    marginHorizontal: 4,
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.light.primaryDim,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  },
  historyIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: Colors.light.surfaceLowest,
    borderRadius: 24,
  }
});
