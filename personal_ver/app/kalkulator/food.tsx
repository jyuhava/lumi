import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Card } from '@/components/ui/Card';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const FOOD_DB = [
  { id: '1', name: 'Nasi Putih', calPer100g: 130, p: 2.7, c: 28, f: 0.3, icon: 'bowl' },
  { id: '2', name: 'Dada Ayam', calPer100g: 165, p: 31, c: 0, f: 3.6, icon: 'nutrition' },
  { id: '3', name: 'Telur Ayam', calPer100g: 155, p: 13, c: 1.1, f: 11, icon: 'egg' },
  { id: '4', name: 'Tempe', calPer100g: 192, p: 19, c: 9, f: 11, icon: 'cube' },
  { id: '5', name: 'Tahu', calPer100g: 76, p: 8, c: 1.9, f: 4.8, icon: 'cube-outline' },
  { id: '6', name: 'Pisang', calPer100g: 89, p: 1.1, c: 23, f: 0.3, icon: 'leaf' },
  { id: '7', name: 'Alpukat', calPer100g: 160, p: 2, c: 8.5, f: 15, icon: 'leaf-outline' },
];

export default function FoodNutritionScreen() {
  const [selectedFood, setSelectedFood] = useState(FOOD_DB[0]);
  const [grams, setGrams] = useState('100');

  const g = parseFloat(grams) || 0;
  const ratio = g / 100;

  const totalCals = selectedFood.calPer100g * ratio;
  const totalP = selectedFood.p * ratio;
  const totalC = selectedFood.c * ratio;
  const totalF = selectedFood.f * ratio;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <Stack.Screen options={{ title: 'Ensiklopedia Makanan' }} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.description}>
          Cari tahu estimasi kandungan kalori dan makronutrien dari bahan makanan keseharian berdasarkan berat takarannya.
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.foodListRow} contentContainerStyle={{ gap: 12 }}>
          {FOOD_DB.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.foodTab, selectedFood.id === item.id && styles.foodTabActive]}
              onPress={() => setSelectedFood(item)}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon as any} size={20} color={selectedFood.id === item.id ? Colors.light.onPrimary : Colors.light.primary} />
              <Text variant="labelMd" color={selectedFood.id === item.id ? Colors.light.onPrimary : Colors.light.onSurface} style={{ marginLeft: 8 }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Card level="lowest" style={styles.inputCard}>
          <Text variant="labelSm" color={Colors.light.secondary} style={styles.label}>Porsi Gramase</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={grams}
              onChangeText={setGrams}
              placeholder="Contoh: 100"
            />
            <Text variant="titleMd" color={Colors.light.secondary} style={{ marginLeft: 12 }}>gram</Text>
          </View>
        </Card>

        {g > 0 && (
          <View style={styles.resultContainer}>
            <Card level="highest" style={styles.mainResultCard}>
              <View style={{ alignItems: 'center' }}>
                <Text variant="labelSm" color={Colors.light.secondary}>TOTAL KALORI</Text>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 4 }}>
                  <Text variant="displayLg" color={Colors.light.primaryDim}>{totalCals.toFixed(0)}</Text>
                  <Text variant="titleMd" color={Colors.light.primaryDim} style={{ marginLeft: 6 }}>kkal</Text>
                </View>
                <Text variant="bodySm" color={Colors.light.secondary}>untuk {g}g {selectedFood.name}</Text>
              </View>
            </Card>

            <Text variant="titleMd" color={Colors.light.onSurface} style={{ marginTop: 24, marginBottom: 16 }}>Kandungan Porsi</Text>

            <View style={styles.macroRow}>
              <Card level="lowest" style={[styles.macroCard, { borderBottomWidth: 4, borderBottomColor: '#EF4444' }]}>
                <Text variant="labelSm" color={Colors.light.secondary}>PROTEIN</Text>
                <Text variant="titleLg" color="#EF4444" style={styles.macroValue}>{totalP.toFixed(1)}g</Text>
              </Card>
              
              <Card level="lowest" style={[styles.macroCard, { borderBottomWidth: 4, borderBottomColor: '#F59E0B' }]}>
                <Text variant="labelSm" color={Colors.light.secondary}>KARBO</Text>
                <Text variant="titleLg" color="#F59E0B" style={styles.macroValue}>{totalC.toFixed(1)}g</Text>
              </Card>

              <Card level="lowest" style={[styles.macroCard, { borderBottomWidth: 4, borderBottomColor: '#10B981' }]}>
                <Text variant="labelSm" color={Colors.light.secondary}>LEMAK</Text>
                <Text variant="titleLg" color="#10B981" style={styles.macroValue}>{totalF.toFixed(1)}g</Text>
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
    lineHeight: 22,
  },
  foodListRow: {
    marginVertical: 24,
    paddingBottom: 8,
  },
  foodTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: Colors.light.surfaceLowest,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHighest,
  },
  foodTabActive: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  inputCard: {
    padding: 24,
  },
  label: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 64,
    borderWidth: 1,
    borderColor: Colors.light.surfaceContainerHighest,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 24,
    fontFamily: 'PlusJakartaSans-Bold',
    color: Colors.light.onSurface,
    backgroundColor: Colors.light.surfaceLowest,
  },
  resultContainer: {
    marginTop: 24,
  },
  mainResultCard: {
    padding: 32,
    borderRadius: 24,
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  macroValue: {
    marginTop: 8,
  }
});
