import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const ACTIVITY_LEVELS = [
  { id: '1.2', title: 'Sedentary', desc: 'Jarang olahraga, kerja meja' },
  { id: '1.375', title: 'Ringan', desc: 'Olahraga ringan 1-3 hari/minggu' },
  { id: '1.55', title: 'Sedang', desc: 'Olahraga sedang 3-5 hari/minggu' },
  { id: '1.725', title: 'Aktif', desc: 'Olahraga berat 6-7 hari/minggu' },
  { id: '1.9', title: 'Sangat Aktif', desc: 'Pekerja fisik / Latihan 2x sehari' },
];

export default function TDEECalculatorScreen() {
  const { profile } = useUserStore();
  
  // Calculate age from birthDate if available
  const getAgeFromBirthDate = (birthDateString?: string) => {
    if (!birthDateString) return '';
    try {
      const today = new Date();
      const birthDate = new Date(birthDateString);
      let calcAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calcAge--;
      }
      return calcAge > 0 && calcAge < 150 ? calcAge.toString() : '';
    } catch (e) {
      return '';
    }
  };

  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [age, setAge] = useState(getAgeFromBirthDate(profile?.birthDate));
  const [gender, setGender] = useState(profile?.gender === 'Female' ? 'Perempuan' : 'Laki-laki');
  const [activityMultiplier, setActivityMultiplier] = useState('1.2');

  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age);
    const multiplier = parseFloat(activityMultiplier);
    
    if (isNaN(w) || isNaN(h) || isNaN(a) || h <= 0 || w <= 0 || a <= 0) return;

    // Mifflin-St Jeor Equation
    const isMale = gender === 'Laki-laki';
    let baseBmr = (10 * w) + (6.25 * h) - (5 * a);
    baseBmr = isMale ? baseBmr + 5 : baseBmr - 161;

    const currentTdee = baseBmr * multiplier;

    setBmr(baseBmr);
    setTdee(currentTdee);
  };

  useEffect(() => {
    if (weight && height && age) calculate();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Kalkulator Kalori (TDEE)' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Hitung Total Daily Energy Expenditure (TDEE) untuk mengetahui rata-rata kalori yang Anda bakar setiap harinya.
        </Text>

        {/* Input Form */}
        <Card level="lowest" style={styles.inputCard}>
          <Text variant="titleMd" color={Colors.light.onSurface} style={styles.sectionTitle}>Parameter Tubuh</Text>
          
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Berat (kg)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
                placeholder="Misal: 65"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Tinggi (cm)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
                placeholder="Misal: 170"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Usia (tahun)</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={age}
                onChangeText={setAge}
                placeholder="Misal: 25"
                placeholderTextColor={Colors.light.primaryDim}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Gender</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity 
                  style={[styles.genderBtn, gender === 'Laki-laki' && styles.genderBtnActive]}
                  onPress={() => setGender('Laki-laki')}
                  activeOpacity={0.8}
                >
                  <Text variant="labelMd" color={gender === 'Laki-laki' ? Colors.light.onPrimary : Colors.light.primary}>L</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.genderBtn, gender === 'Perempuan' && styles.genderBtnActive]}
                  onPress={() => setGender('Perempuan')}
                  activeOpacity={0.8}
                >
                  <Text variant="labelMd" color={gender === 'Perempuan' ? Colors.light.onPrimary : Colors.light.primary}>P</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Activity Level Selector */}
          <Text variant="labelSm" color={Colors.light.secondary} style={[styles.label, { marginTop: 8 }]}>Tingkat Aktivitas</Text>
          <View style={styles.activityList}>
            {ACTIVITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[styles.activityItem, activityMultiplier === level.id && styles.activityItemActive]}
                onPress={() => setActivityMultiplier(level.id)}
                activeOpacity={0.7}
              >
                <View style={styles.activityRadio}>
                  {activityMultiplier === level.id && <View style={styles.activityRadioInner} />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="labelMd" color={Colors.light.onSurface}>{level.title}</Text>
                  <Text variant="labelSm" color={Colors.light.secondary}>{level.desc}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <Button label="Hitung Kalori Harian" onPress={calculate} style={{ marginTop: 24 }} />
        </Card>

        {/* Results */}
        {tdee !== null && bmr !== null && (
          <View style={styles.resultContainer}>
            <Text variant="titleLg" color={Colors.light.onSurface} style={styles.resultTitle}>Rekomendasi Kalori</Text>
            
            <Card level="lowest" style={styles.mainResultCard}>
              <Text variant="labelSm" color={Colors.light.secondary}>MAINTENANCE (TDEE)</Text>
              <View style={styles.ibwValueContainer}>
                <Text variant="displayMd" color={Colors.light.onSurface}>{tdee.toFixed(0)}</Text>
                <Text variant="titleMd" color={Colors.light.secondary} style={{marginLeft: 4}}>kkal / hari</Text>
              </View>
              <Text variant="bodySm" color={Colors.light.secondary} style={styles.ibwSub}>
                BMR Anda adalah {bmr.toFixed(0)} kkal (Kalori yang murni dibakar tubuh secara alami ketika beristirahat penuh).
              </Text>
            </Card>
            
            <View style={styles.resultCardsRow}>
              {/* Defisit Result */}
              <Card level="lowest" style={[styles.resultCard, { borderColor: '#10B981', borderWidth: 1 }]}>
                <Ionicons name="trending-down" size={24} color="#10B981" />
                <Text variant="labelSm" color={Colors.light.secondary} style={{marginTop: 8}}>DEFISIT (CUT)</Text>
                <Text variant="titleLg" color="#10B981" style={styles.resultBigNumber}>{(tdee - 500).toFixed(0)}</Text>
                <Text variant="labelSm" color={Colors.light.secondary}>Turun perlahan</Text>
              </Card>
              
              {/* Surplus Result */}
              <Card level="lowest" style={[styles.resultCard, { borderColor: '#F59E0B', borderWidth: 1 }]}>
                <Ionicons name="trending-up" size={24} color="#F59E0B" />
                <Text variant="labelSm" color={Colors.light.secondary} style={{marginTop: 8}}>SURPLUS (BULK)</Text>
                <Text variant="titleLg" color="#F59E0B" style={styles.resultBigNumber}>{(tdee + 500).toFixed(0)}</Text>
                <Text variant="labelSm" color={Colors.light.secondary}>Naik massa otot</Text>
              </Card>
            </View>
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
  sectionTitle: {
    marginBottom: 20,
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
    marginBottom: 10,
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
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  genderBtnActive: {
    backgroundColor: Colors.light.primary,
  },
  activityList: {
    marginTop: 8,
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHighest,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceLowest,
  },
  activityItemActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surfaceLowest, // just override border color
  },
  activityRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primary,
  },
  resultContainer: {
    marginTop: 8,
  },
  resultTitle: {
    marginBottom: 16,
  },
  mainResultCard: {
    padding: 24,
    marginBottom: 16,
  },
  ibwValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  ibwSub: {
    marginTop: 4,
    lineHeight: 20,
  },
  resultCardsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  resultCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBigNumber: {
    marginVertical: 4,
  },
});
