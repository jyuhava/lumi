import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2; // 48 padding, 16 gap

const features = [
  { id: 'imt', title: 'IMT & IBW', desc: 'Indeks Massa Tubuh & Berat Ideal', icon: 'body', color: '#10B981', bg: '#D1FAE5' },
  { id: 'tdee', title: 'Kalori (TDEE)', desc: 'Total Daily Energy Expenditure', icon: 'flame', color: '#F59E0B', bg: '#FEF3C7' },
  { id: 'macro', title: 'Macro Split', desc: 'Distribusi Protein, Karbo, Lemak', icon: 'pie-chart', color: '#8B5CF6', bg: '#EDE9FE' },
  { id: 'food', title: 'Gizi Makanan', desc: 'Cek kalori & makro per bahan', icon: 'restaurant', color: '#EF4444', bg: '#FEE2E2' },
  { id: 'water', title: 'Kebutuhan Air', desc: 'Target hidrasi harian', icon: 'water', color: '#3B82F6', bg: '#DBEAFE' },
  { id: 'deficit', title: 'Target Berat', desc: 'Estimasi waktu capai target', icon: 'scale', color: '#14B8A6', bg: '#CCFBF1' },
  { id: 'bodyfat', title: 'Body Fat', desc: 'Estimasi persentase lemak', icon: 'scan-circle', color: '#F97316', bg: '#FFEDD5' },
];

export default function KalkulatorIndex() {
  const router = useRouter();

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text variant="bodyMd" color={Colors.light.secondary} style={styles.subtitle}>
          Pilih berbagai alat analisis cerdas untuk memantau asupan dan perkembangan fisik Anda setiap hari.
        </Text>

        <View style={styles.grid}>
          {features.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => {
                if (item.id === 'water') {
                  router.push('/water' as any);
                } else {
                  router.push(`/kalkulator/${item.id}`);
                }
              }}
            >
              <View style={[styles.iconBox, { backgroundColor: item.bg }]}>
                <Ionicons name={item.icon as any} size={28} color={item.color} />
              </View>
              <Text variant="titleMd" color={Colors.light.onSurface} style={styles.cardTitle}>{item.title}</Text>
              <Text variant="labelSm" color={Colors.light.secondary}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  container: {
    padding: 24,
    paddingBottom: 80,
  },
  subtitle: {
    marginBottom: 24,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  card: {
    width: cardWidth,
    backgroundColor: Colors.light.surfaceLowest,
    padding: 16,
    borderRadius: 24,
    shadowColor: Colors.light.primaryDim,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 6,
  }
});
