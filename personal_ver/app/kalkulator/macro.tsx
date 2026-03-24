import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const DISTRIBUTIONS = [
  { id: 'balanced', title: 'Seimbang (Balanced)', p: 30, c: 40, f: 30, desc: 'Cocok untuk maintenance & gaya hidup sehat umum.' },
  { id: 'lowcarb', title: 'Rendah Karbo (Low Carb)', p: 40, c: 20, f: 40, desc: 'Membantu fat loss & diet ketogenik/rendah gula.' },
  { id: 'highcarb', title: 'Tinggi Karbo (High Carb)', p: 25, c: 55, f: 20, desc: 'Fokus untuk energi latihan berat & bulking otot.' },
  { id: 'highprotein', title: 'Tinggi Protein (Bodybuilder)', p: 40, c: 35, f: 25, desc: 'Menjaga otot saat cut / menambah massa tanpa lemak.' },
];

export default function MacroCalculatorScreen() {
  const [calories, setCalories] = useState('2000');
  const [distMode, setDistMode] = useState('balanced');

  const [protein, setProtein] = useState<number | null>(null);
  const [carbs, setCarbs] = useState<number | null>(null);
  const [fat, setFat] = useState<number | null>(null);

  const calculate = () => {
    const cals = parseFloat(calories);
    if (isNaN(cals) || cals <= 0) return;

    const dist = DISTRIBUTIONS.find(d => d.id === distMode) || DISTRIBUTIONS[0];
    
    // 1g Protein = 4 kcal, 1g Carb = 4 kcal, 1g Fat = 9 kcal
    const proteinCals = cals * (dist.p / 100);
    const carbsCals = cals * (dist.c / 100);
    const fatCals = cals * (dist.f / 100);

    setProtein(proteinCals / 4);
    setCarbs(carbsCals / 4);
    setFat(fatCals / 9);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Makronutrien (Macro Split)' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Bagi target porsi kalori harian Anda menjadi Makronutrien utama (Protein, Karbohidrat, Lemak) sesuai dengan tujuan kebugaran utama Anda.
        </Text>

        <Card level="lowest" style={styles.inputCard}>
          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Target Kalori Harian (kkal)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={calories}
            onChangeText={setCalories}
            placeholder="Misal: 2000"
            placeholderTextColor={Colors.light.primaryDim}
          />

          <Text variant="labelSm" color={Colors.light.secondary} style={[styles.label, { marginTop: 16 }]}>Distribusi Makro</Text>
          <View style={styles.distList}>
            {DISTRIBUTIONS.map((d) => (
              <TouchableOpacity
                key={d.id}
                style={[styles.distItem, distMode === d.id && styles.distItemActive]}
                onPress={() => setDistMode(d.id)}
                activeOpacity={0.7}
              >
                <View style={{ flex: 1 }}>
                  <Text variant="titleMd" color={Colors.light.onSurface}>{d.title}</Text>
                  <Text variant="labelSm" color={Colors.light.primaryDim} style={{ marginVertical: 4 }}>
                    Protein {d.p}% • Karbo {d.c}% • Lemak {d.f}%
                  </Text>
                  <Text variant="bodySm" color={Colors.light.secondary}>{d.desc}</Text>
                </View>
                {distMode === d.id && (
                  <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} style={{marginLeft: 12}} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button label="Bagi Piring Saya" onPress={calculate} style={{ marginTop: 24 }} />
        </Card>

        {protein !== null && carbs !== null && fat !== null && (
          <View style={styles.resultContainer}>
            <Text variant="titleLg" color={Colors.light.onSurface} style={styles.resultTitle}>Porsi Piring Harian</Text>
            
            <View style={styles.resultCardsRow}>
              <Card level="lowest" style={[styles.resultCard, { borderColor: '#EF4444', borderWidth: 1 }]}>
                <Ionicons name="fish" size={24} color="#EF4444" />
                <Text variant="labelSm" color={Colors.light.secondary} style={{marginTop: 8}}>PROTEIN</Text>
                <Text variant="titleLg" color="#EF4444" style={styles.resultBigNumber}>{protein.toFixed(0)}<Text variant="labelSm" color="#EF4444">g</Text></Text>
              </Card>
              
              <Card level="lowest" style={[styles.resultCard, { borderColor: '#F59E0B', borderWidth: 1 }]}>
                <Ionicons name="nutrition" size={24} color="#F59E0B" />
                <Text variant="labelSm" color={Colors.light.secondary} style={{marginTop: 8}}>KARBO</Text>
                <Text variant="titleLg" color="#F59E0B" style={styles.resultBigNumber}>{carbs.toFixed(0)}<Text variant="labelSm" color="#F59E0B">g</Text></Text>
              </Card>

              <Card level="lowest" style={[styles.resultCard, { borderColor: '#10B981', borderWidth: 1 }]}>
                <Ionicons name="water" size={24} color="#10B981" />
                <Text variant="labelSm" color={Colors.light.secondary} style={{marginTop: 8}}>LEMAK</Text>
                <Text variant="titleLg" color="#10B981" style={styles.resultBigNumber}>{fat.toFixed(0)}<Text variant="labelSm" color="#10B981">g</Text></Text>
              </Card>
            </View>

            <Card level="lowest" style={{ padding: 20, marginTop: 16 }}>
              <Text variant="bodyMd" color={Colors.light.onSurface} style={{lineHeight: 24}}>
                Tip Emas: 1g Protein bernilai 4 kalori, 1g Karbohidrat = 4 kalori, sedangkan 1g Lemak = 9 kalori. Fokuslah memenuhi target nutrisi ini setiap harinya tanpa melewati bata kalori Anda!
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
  distList: {
    marginTop: 8,
    gap: 12,
  },
  distItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHighest,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceLowest,
  },
  distItemActive: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.surfaceContainerLowest, // tint color 
  },
  resultContainer: {
    marginTop: 8,
  },
  resultTitle: {
    marginBottom: 16,
  },
  resultCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resultCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultBigNumber: {
    marginVertical: 8,
  },
});
