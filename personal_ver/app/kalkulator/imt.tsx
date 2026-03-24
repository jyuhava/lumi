import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';

export default function IMTCalculatorScreen() {
  const { profile, updateProfile } = useUserStore();
  const router = useRouter();

  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [height, setHeight] = useState(profile?.height?.toString() || '');
  const [gender, setGender] = useState(profile?.gender === 'Female' ? 'Perempuan' : 'Laki-laki');

  const [bmi, setBmi] = useState<number | null>(null);
  const [ibw, setIbw] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [color, setColor] = useState(Colors.light.primary);
  const [difference, setDifference] = useState<number>(0);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    
    if (isNaN(w) || isNaN(h) || h <= 0 || w <= 0) return;

    // Calculate BMI
    const hMeters = h / 100;
    const currentBmi = w / (hMeters * hMeters);
    
    // Calculate IBW (Broca)
    const isMale = gender === 'Laki-laki';
    const currentIbw = (h - 100) - ((h - 100) * (isMale ? 0.1 : 0.15));

    let cat = 'Kurus';
    let col = '#6cf1ec';
    if (currentBmi >= 18.5 && currentBmi <= 25) {
      cat = 'Normal';
      col = '#006764'; // primary
    } else if (currentBmi > 25 && currentBmi <= 29.9) {
      cat = 'Overweight';
      col = '#F59E0B'; // yellow/orange
    } else if (currentBmi >= 30) {
      cat = 'Obesitas';
      col = '#EF4444'; // red
    }

    setBmi(currentBmi);
    setIbw(currentIbw);
    setCategory(cat);
    setColor(col);
    setDifference(w - currentIbw);
  };

  // Auto calculate on load if we have profile data
  useEffect(() => {
    if (weight && height) calculate();
  }, []);

  const handleSetTarget = () => {
    if (ibw) {
      updateProfile({ targetWeight: ibw.toFixed(1) });
      alert('Target berat badan berhasil diperbarui ke ' + ibw.toFixed(1) + ' kg!');
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Kalkulator IMT & IBW' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Hitung Indeks Massa Tubuh (IMT) untuk mengetahui status gizi Anda, dan Berat Badan Ideal (IBW) sebagai acuan target sehat.
        </Text>

        {/* Input Form */}
        <Card level="lowest" style={styles.inputCard}>
          <Text variant="titleMd" color={Colors.light.onSurface} style={styles.sectionTitle}>Data Tubuh Saat Ini</Text>
          
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

          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Jenis Kelamin</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity 
              style={[styles.genderBtn, gender === 'Laki-laki' && styles.genderBtnActive]}
              onPress={() => setGender('Laki-laki')}
              activeOpacity={0.8}
            >
              <Ionicons name="male" size={20} color={gender === 'Laki-laki' ? Colors.light.onPrimary : Colors.light.primary} />
              <Text variant="labelMd" color={gender === 'Laki-laki' ? Colors.light.onPrimary : Colors.light.primary} style={{marginLeft: 8}}>Laki-laki</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.genderBtn, gender === 'Perempuan' && styles.genderBtnActive]}
              onPress={() => setGender('Perempuan')}
              activeOpacity={0.8}
            >
              <Ionicons name="female" size={20} color={gender === 'Perempuan' ? Colors.light.onPrimary : Colors.light.primary} />
              <Text variant="labelMd" color={gender === 'Perempuan' ? Colors.light.onPrimary : Colors.light.primary} style={{marginLeft: 8}}>Perempuan</Text>
            </TouchableOpacity>
          </View>

          <Button label="Hitung" onPress={calculate} style={{ marginTop: 24 }} />
        </Card>

        {/* Results */}
        {bmi !== null && ibw !== null && (
          <View style={styles.resultContainer}>
            <Text variant="titleLg" color={Colors.light.onSurface} style={styles.resultTitle}>Hasil Analisis</Text>
            
            <View style={styles.resultCardsRow}>
              {/* BMI Result */}
              <Card level="lowest" style={[styles.resultCard, { borderColor: color, borderWidth: 1 }]}>
                <Text variant="labelSm" color={Colors.light.secondary}>IMT (BMI)</Text>
                <Text variant="displaySm" color={color} style={styles.resultBigNumber}>{bmi.toFixed(1)}</Text>
                <View style={[styles.pill, { backgroundColor: color + '20' }]}>
                  <Text variant="labelSm" color={color}>{category}</Text>
                </View>
              </Card>
              
              {/* IBW Result */}
              <Card level="lowest" style={styles.resultCard}>
                <Text variant="labelSm" color={Colors.light.secondary}>BERAT IDEAL</Text>
                <View style={styles.ibwValueContainer}>
                  <Text variant="displaySm" color={Colors.light.onSurface}>{ibw.toFixed(1)}</Text>
                  <Text variant="titleMd" color={Colors.light.secondary} style={{marginLeft: 4}}>kg</Text>
                </View>
                <Text variant="bodySm" color={Colors.light.secondary} style={styles.ibwSub}>Formula Broca</Text>
              </Card>
            </View>

            {/* Interpretation */}
            <Card level="highest" style={styles.interpretationCard}>
              <View style={styles.interpretationHeader}>
                <Ionicons name="information-circle" size={24} color={Colors.light.primary} />
                <Text variant="titleMd" color={Colors.light.onSurface} style={{marginLeft: 8}}>Kesimpulan Fisik</Text>
              </View>
              <Text variant="bodyMd" color={Colors.light.onSurface} style={styles.interpretationText}>
                {difference > 2 
                  ? `Fisik Anda cenderung melebihi ideal. Anda memiliki surplus berat sekitar ${Math.abs(difference).toFixed(1)} kg. Mulailah program defisit kalori perlahan untuk mencapai rasio yang optimal.`
                  : difference < -2
                  ? `Fisik Anda tergolong kurus. Disarankan untuk menambah berat badan secara sehat (surplus gizi) sebanyak ${Math.abs(difference).toFixed(1)} kg guna mencapai daya tahan tubuh optimal.`
                  : `Hebat! Komposisi tubuh Anda sudah sangat proporsional dan berada di zona aman. Pertahankan kualitas asupan dan olahraga rutin Anda.`
                }
              </Text>

              <Button 
                label={`Jadikan ${ibw.toFixed(0)} kg sebagai Target Akhir`} 
                onPress={handleSetTarget} 
                variant="secondary"
                style={{ marginTop: 20 }} 
              />
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
    flexDirection: 'row',
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
  resultContainer: {
    marginTop: 8,
  },
  resultTitle: {
    marginBottom: 16,
  },
  resultCardsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBigNumber: {
    marginVertical: 12,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ibwValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 12,
  },
  ibwSub: {
    marginTop: 4,
  },
  interpretationCard: {
    padding: 24,
    backgroundColor: Colors.light.surfaceLowest, // Different tone
  },
  interpretationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  interpretationText: {
    lineHeight: 24,
  }
});
