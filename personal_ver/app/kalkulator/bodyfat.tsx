import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function BodyFatCalculatorScreen() {
  const { profile } = useUserStore();
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [gender, setGender] = useState(profile?.gender === 'Female' ? 'Perempuan' : 'Laki-laki');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');

  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState('#10B981');

  const calculate = () => {
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    if (isNaN(h) || isNaN(n) || isNaN(w) || h <= 0 || n <= 0 || w <= 0) return;

    let bf = 0;
    const isMale = gender === 'Laki-laki';

    // US Navy Method (requires measurements in cm)
    if (isMale) {
      bf = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (isNaN(hp) || hp <= 0) {
        alert('Lingkar pinggul dibutuhkan untuk wanita.');
        return;
      }
      bf = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }

    if (isNaN(bf)) {
      alert('Ukuran pita meteran numerik tidak valid.');
      return;
    }

    // Limit bound
    bf = Math.max(1, Math.min(60, bf));

    let cat = 'Esensial';
    let col = '#3B82F6';

    if (isMale) {
      if (bf >= 2 && bf <= 5) { cat = 'Esensial / Lean'; col = '#3B82F6'; }
      else if (bf > 5 && bf <= 13) { cat = 'Atletis'; col = '#10B981'; }
      else if (bf > 13 && bf <= 17) { cat = 'Bugar'; col = '#10B981'; }
      else if (bf > 17 && bf <= 24) { cat = 'Rata-rata/Normal'; col = '#F59E0B'; }
      else { cat = 'Obesitas'; col = '#EF4444'; }
    } else {
      if (bf >= 10 && bf <= 13) { cat = 'Esensial / Lean'; col = '#3B82F6'; }
      else if (bf > 13 && bf <= 20) { cat = 'Atletis'; col = '#10B981'; }
      else if (bf > 20 && bf <= 24) { cat = 'Bugar'; col = '#10B981'; }
      else if (bf > 24 && bf <= 31) { cat = 'Rata-rata/Normal'; col = '#F59E0B'; }
      else { cat = 'Obesitas'; col = '#EF4444'; }
    }

    setBodyFat(bf);
    setCategory(cat);
    setColor(col);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Estimasi Persentase Lemak' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Gunakan pita ukur/meteran baju untuk mengetahui estimasi Body Fat Percentage Anda menggunakan formula militer dari US Navy.
        </Text>

        <Card level="lowest" style={styles.inputCard}>
          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity 
              style={[styles.genderBtn, gender === 'Laki-laki' && styles.genderBtnActive]}
              onPress={() => setGender('Laki-laki')}
              activeOpacity={0.8}
            >
              <Text variant="labelMd" color={gender === 'Laki-laki' ? Colors.light.onPrimary : Colors.light.primary}>Laki-laki</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.genderBtn, gender === 'Perempuan' && styles.genderBtnActive]}
              onPress={() => setGender('Perempuan')}
              activeOpacity={0.8}
            >
              <Text variant="labelMd" color={gender === 'Perempuan' ? Colors.light.onPrimary : Colors.light.primary}>Perempuan</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Tinggi (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Leher (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={neck}
                onChangeText={setNeck}
                placeholder="Misal: 35"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Pinggang (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={waist}
                onChangeText={setWaist}
                placeholder="Sekitar Pusar"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
            {gender === 'Perempuan' && (
              <View style={styles.inputGroup}>
                <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Pinggul (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={hip}
                  onChangeText={setHip}
                  placeholder="Terlebar"
                  placeholderTextColor={Colors.light.primaryDim}
                />
              </View>
            )}
          </View>
          
          <Button label="Hitung Lemak Tubuh" onPress={calculate} style={{ marginTop: 8 }} />
        </Card>

        {bodyFat !== null && (
          <View style={styles.resultContainer}>
            <Card level="lowest" style={[styles.resultMainCard, { borderColor: color, borderWidth: 2 }]}>
              <Ionicons name="scan-circle" size={48} color={color} style={{ marginBottom: 12 }} />
              <Text variant="labelMd" color={Colors.light.secondary}>ESTIMASI BODY FAT</Text>
              <View style={styles.rowAlign}>
                <Text variant="displayLg" color={color} style={{ marginVertical: 8 }}>
                  {bodyFat.toFixed(1)}
                </Text>
                <Text variant="titleLg" color={color} style={{ marginLeft: 4 }}>%</Text>
              </View>
              <View style={[styles.glassesContainer, { backgroundColor: color + '20' }]}>
                <Text variant="titleMd" color={color}>{category}</Text>
              </View>
            </Card>

            <Card level="lowest" style={{ padding: 20, marginTop: 16 }}>
              <Text variant="bodyMd" color={Colors.light.onSurface} style={{lineHeight: 24}}>
                *Pengukuran US Navy ini hanya merupakan estimasi berdasarkan dimensi. Untuk tingkat akurasi yang lebih valid, Anda dapat menggunakan kaliper alat cubit lipatan kulit atau *DEXA scan* di klinik olahraga / kebugaran terdekat.
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
  genderRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  genderBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  genderBtnActive: {
    backgroundColor: Colors.light.primary,
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
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
  }
});
