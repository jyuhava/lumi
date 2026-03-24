import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useUserStore } from '@/utils/store';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

export default function WaterCalculatorScreen() {
  const { profile } = useUserStore();
  const [weight, setWeight] = useState(profile?.weight?.toString() || '');
  const [activity, setActivity] = useState('sedang');

  const [waterMl, setWaterMl] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    if (isNaN(w) || w <= 0) return;

    // Rule of thumb: Weight(kg) * 35ml
    let ml = w * 35;
    
    // Add extra for activity
    if (activity === 'aktif') ml += 500;
    if (activity === 'sangat_aktif') ml += 1000;

    setWaterMl(ml);
  };

  useEffect(() => {
    if (weight) calculate();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Kalkulator Kebutuhan Air' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Ketahui berapa banyak asupan cairan yang wajib Anda habiskan hari ini berdasarkan berat badan dan intensitas keringat.
        </Text>

        <Card level="lowest" style={styles.inputCard}>
          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Berat Badan (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
            placeholder="Misal: 65"
            placeholderTextColor={Colors.light.primaryDim}
          />

          <Text variant="labelSm" color={Colors.light.secondary} style={[styles.label, { marginTop: 16 }]}>Cuaca & Keringat Hari Ini</Text>
          <View style={styles.activityRow}>
            <TouchableOpacity 
              style={[styles.activityBtn, activity === 'ringan' && styles.activityBtnActive]}
              onPress={() => setActivity('ringan')}
              activeOpacity={0.8}
            >
              <Text variant="labelMd" color={activity === 'ringan' ? Colors.light.onPrimary : Colors.light.primary}>Santai</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.activityBtn, activity === 'sedang' && styles.activityBtnActive]}
              onPress={() => setActivity('sedang')}
              activeOpacity={0.8}
            >
              <Text variant="labelMd" color={activity === 'sedang' ? Colors.light.onPrimary : Colors.light.primary}>Aktif</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.activityBtn, activity === 'sangat_aktif' && styles.activityBtnActive]}
              onPress={() => setActivity('sangat_aktif')}
              activeOpacity={0.8}
            >
              <Text variant="labelMd" color={activity === 'sangat_aktif' ? Colors.light.onPrimary : Colors.light.primary}>Olahraga Berat</Text>
            </TouchableOpacity>
          </View>

          <Button label="Hitung Volume" onPress={calculate} style={{ marginTop: 24 }} />
        </Card>

        {waterMl !== null && (
          <View style={styles.resultContainer}>
            <Card level="lowest" style={[styles.resultMainCard, { borderColor: '#3B82F6', borderWidth: 2 }]}>
              <Ionicons name="water" size={48} color="#3B82F6" style={{ marginBottom: 12 }} />
              <Text variant="labelMd" color={Colors.light.secondary}>TARGET HIDRASI HARIAN</Text>
              <View style={styles.rowAlign}>
                <Text variant="displayLg" color="#3B82F6" style={{ marginVertical: 8 }}>
                  {(waterMl / 1000).toFixed(1)}
                </Text>
                <Text variant="titleMd" color="#3B82F6" style={{ marginLeft: 8 }}>Liter</Text>
              </View>
              <View style={styles.glassesContainer}>
                <Text variant="bodyMd" color={Colors.light.onSurface}>Setara dengan <Text variant="titleMd" color="#3B82F6">{Math.ceil(waterMl / 250)}</Text> gelas (250ml)</Text>
              </View>
            </Card>

            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 16, backgroundColor: '#EFF6FF', padding: 16, borderRadius: 16}}>
                <Ionicons name="information-circle" size={24} color="#3B82F6"/>
                <Text variant="bodySm" color={Colors.light.secondary} style={{marginLeft: 12, flex: 1}}>
                  Ingat: Minum air secukupnya jangan tunggu sampai Anda haus. Dehidrasi dapat menurunkan metabolisme tubuh!
                </Text>
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
  activityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  activityBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  activityBtnActive: {
    backgroundColor: Colors.light.primary,
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
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 999,
  }
});
