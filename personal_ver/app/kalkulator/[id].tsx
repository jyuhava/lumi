import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';

export default function KalkulatorPlaceholder() {
  const { id } = useLocalSearchParams();
  
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="construct" size={64} color={Colors.light.secondary} style={{ marginBottom: 24 }} />
      <Text variant="headlineMd" color={Colors.light.onSurface}>Sedang Dibangun</Text>
      <Text variant="bodyLg" color={Colors.light.secondary} style={styles.subtitle}>
        Kalkulator {id} ini sedang dalam tahap pengembangan oleh engineer kami.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  }
});
