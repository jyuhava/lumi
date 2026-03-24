import { Stack } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function KalkulatorLayout() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: Colors.light.surfaceContainerLow },
      headerTintColor: Colors.light.onSurface,
      headerTitleStyle: { fontFamily: 'PlusJakartaSans-Bold' },
      headerBackTitle: '',
      headerShadowVisible: false,
    }}>
      <Stack.Screen name="index" options={{ title: 'Kalkulator Gizi' }} />
      <Stack.Screen name="[id]" options={{ title: 'Kalkulator', presentation: 'card' }} />
    </Stack>
  );
}
