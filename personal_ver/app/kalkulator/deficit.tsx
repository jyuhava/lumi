import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function DeficitCalculatorScreen() {
  const { profile } = useUserStore();
  const [currentWeight, setCurrentWeight] = useState(profile?.weight?.toString() || '');
  const [targetWeight, setTargetWeight] = useState(profile?.targetWeight?.toString() || '');
  const [targetWeeks, setTargetWeeks] = useState('');

  const [deficitNeeded, setDeficitNeeded] = useState<number | null>(null);
  const [totalLoss, setTotalLoss] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const weeks = parseFloat(targetWeeks);

    if (isNaN(w) || isNaN(tw) || isNaN(weeks) || w <= 0 || tw <= 0 || weeks <= 0) return;

    const diff = w - tw;
    if (diff <= 0) {
      alert('Target berat harus lebih kecil dari berat saat ini untuk hitungan defisit.');
      return;
    }

    // 1 kg fat = ~7700 kcal
    const totalCalsToLose = diff * 7700;
    const days = weeks * 7;
    const dailyDeficit = totalCalsToLose / days;

    setTotalLoss(diff);
    setDeficitNeeded(dailyDeficit);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Kalkulator Defisit Berat' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Hitung berapa kalori yang harus Anda kurangi setiap harinya (Defisit) untuk mencapai target penurunan berat badan dalam jangka waktu tertentu.
        </Text>

        <Card level="lowest" style={styles.inputCard}>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Berat Saat Ini (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={currentWeight}
                onChangeText={setCurrentWeight}
                placeholder="Misal: 75"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Target Berat (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={targetWeight}
                onChangeText={setTargetWeight}
                placeholder="Misal: 65"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
          </View>

          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Target Waktu (Minggu)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={targetWeeks}
            onChangeText={setTargetWeeks}
            placeholder="Misal: 12 (Saran aman: 0.5kg/mgg)"
            placeholderTextColor={Colors.light.primaryDim}
          />
          
          <Button label="Hitung Defisit" onPress={calculate} style={{ marginTop: 24 }} />
        </Card>

        {deficitNeeded !== null && totalLoss !== null && (
          <View style={styles.resultContainer}>
            <Card level="lowest" style={[styles.resultMainCard, { borderColor: deficitNeeded > 1000 ? '#EF4444' : '#10B981', borderWidth: 2 }]}>
              <Ionicons name={deficitNeeded > 1000 ? "warning" : "checkmark-circle"} size={48} color={deficitNeeded > 1000 ? "#EF4444" : "#10B981"} style={{ marginBottom: 12 }} />
              <Text variant="labelMd" color={Colors.light.secondary}>TARGET DEFISIT HARIAN</Text>
              <View style={styles.rowAlign}>
                <Text variant="displayLg" color={deficitNeeded > 1000 ? "#EF4444" : "#10B981"} style={{ marginVertical: 8 }}>
                  {deficitNeeded.toFixed(0)}
                </Text>
                <Text variant="titleMd" color={deficitNeeded > 1000 ? "#EF4444" : "#10B981"} style={{ marginLeft: 8 }}>kkal/hari</Text>
              </View>
              <View style={styles.glassesContainer}>
                <Text variant="bodyMd" color={Colors.light.onSurface}>
                  Untuk turun <Text variant="titleMd" color={Colors.light.primary}>{totalLoss.toFixed(1)}kg</Text> dalam {targetWeeks} minggu
                </Text>
              </View>
            </Card>

            <Card level="lowest" style={{ padding: 20, marginTop: 16 }}>
              <Text variant="bodyMd" color={Colors.light.onSurface} style={{lineHeight: 24}}>
                {deficitNeeded > 1000 
                  ? '⚠️ Peringatan: Defisit kalori di atas 1000 kkal per hari sangat tidak disarankan karena dapat membahayakan fungsi metabolisme dan mengikis otot Anda. Cobalah untuk memperpanjang target waktu Anda menjadi lebih realistis.'
                  : '✅ Target kecepatan ini logis dan tergolong aman! Anda dapat mengurangi porsi makan perlahan dan menambahkan intensitas jalan kaki harian Anda untuk mencapai selisih defisit ini.'
                }
              </Text>
            </Card>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  description: {
    marginBottom: 24,
    lineHeight: 22,
  },
  inputCard: {
    padding: 24,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHighest,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Regular',
    color: Colors.light.onSurface,
    backgroundColor: Colors.light.surfaceLowest,
  },
  resultContainer: {
    marginTop: 8,
  },
  resultMainCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surfaceLowest,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  glassesContainer: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.light.surfaceContainerHighest,
    borderRadius: 999,
  }
});
