import React, { useState, useEffect, useRef } from 'react';
import {
  View, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Platform, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/utils/store';
import { useActivityStore } from '@/stores/activityStore';
import { useWaterStore } from '@/stores/waterStore';

const PRIMARY = Colors.light.primary;
const PRIMARY_BG = Colors.light.primaryContainer;
const BASE_URL = 'https://fe16-114-4-82-138.ngrok-free.app/api/personal';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { clearError(); }, [email, password]);

  // ── Keyboard-aware scroll ──────────────────────────────────────────────────
  const scrollRef = useRef<ScrollView>(null);
  const emailRef  = useRef<View>(null);
  const pwRef     = useRef<View>(null);

  const scrollToRef = (ref: React.RefObject<View>) => {
    if (!ref.current || !scrollRef.current) return;
    ref.current.measureLayout(
      // @ts-ignore
      scrollRef.current,
      (_x, y) => scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true }),
      () => {}
    );
  };

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Masukkan email dan password');
      return;
    }
    const success = await login(email.trim().toLowerCase(), password);
    if (success) {
      const { user, token } = useAuthStore.getState();
      const userStore = useUserStore.getState();
      const activityStore = useActivityStore.getState();
      const waterStore = useWaterStore.getState();
      
      // Fetch cloud logs to populate local stores
      if (token) {
        try {
          const [wRes, aRes, waterRes] = await Promise.all([
            fetch(`${BASE_URL}/weight-logs`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }),
            fetch(`${BASE_URL}/activity-logs`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } }),
            fetch(`${BASE_URL}/water-logs`, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } })
          ]);
          
          if (wRes.ok) {
            const wData = await wRes.json();
            if (wData.success && wData.logs) {
               userStore.setWeightLogs(wData.logs.map((l: any) => ({ id: l.local_id, date: l.recorded_at, weight: Number(l.weight) })));
            }
          }
          if (aRes.ok) {
            const aData = await aRes.json();
            if (aData.success && aData.logs) {
               activityStore.setLogs(aData.logs.map((l: any) => ({
                 id: l.local_id, type: l.entry_type, activityType: l.activity_type, name: l.name,
                 steps: Number(l.steps), duration: Number(l.duration), distance: Number(l.distance),
                 calories: Number(l.calories), date: l.recorded_at
               })));
            }
          }
          if (waterRes.ok) {
            const data = await waterRes.json();
            if (data.success && data.logs) {
               waterStore.setLogs(data.logs.map((l: any) => ({
                 id: l.local_id, amount: Number(l.amount_ml), date: l.recorded_at
               })));
            }
          }
        } catch (e) {
          console.warn('Failed to fetch initial cloud logs', e);
        }
      }

      if (user && !userStore.hasCompletedOnboarding) {
        // Came from onboarding — hydrate profile with cloud data
        userStore.setProfile({
          name: user.name,
          birthDate: user.birth_date ?? '',
          gender: (user.gender as any) ?? '',
          height: user.height_cm?.toString() ?? '',
          weight: user.weight_kg?.toString() ?? '',
          bloodType: (user.blood_type as any) ?? '',
          activityLevel: user.activity_level ?? '1.2',
          targetWeight: user.target_weight_kg?.toString() ?? '',
        });
        userStore.completeOnboarding();
        router.replace('/(tabs)');
      } else {
        // Came from Profile tab
        router.back();
      }
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        keyboardDismissMode="interactive"
      >
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.onSurface} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: PRIMARY_BG }]}>
            <Ionicons name="log-in-outline" size={32} color={PRIMARY} />
          </View>
          <Text variant="headlineMd" color={Colors.light.onSurface} style={{ marginTop: 16 }}>
            Login ke LumiFit
          </Text>
          <Text variant="bodySm" color={Colors.light.secondary} style={{ marginTop: 4, textAlign: 'center' }}>
            Masuk untuk mengakses data kesehatan Anda di cloud.
          </Text>
        </View>

        {/* Error */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#B71C1C" />
            <Text variant="bodySm" color="#B71C1C" style={{ marginLeft: 6, flex: 1 }}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <Text variant="labelSm" color={Colors.light.secondary} style={styles.fieldLabel}>Email</Text>
          <View ref={emailRef}>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color={Colors.light.secondary} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="email@example.com"
                placeholderTextColor={Colors.light.secondary}
                value={email} onChangeText={setEmail}
                keyboardType="email-address" autoCapitalize="none" autoCorrect={false}
                onFocus={() => scrollToRef(emailRef)}
                returnKeyType="next"
              />
            </View>
          </View>

          <Text variant="labelSm" color={Colors.light.secondary} style={styles.fieldLabel}>Password</Text>
          <View ref={pwRef}>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color={Colors.light.secondary} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={Colors.light.secondary}
                value={password} onChangeText={setPassword}
                secureTextEntry={!showPassword} autoCorrect={false} autoCapitalize="none"
                onFocus={() => scrollToRef(pwRef)}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)} activeOpacity={0.7}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={Colors.light.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: isLoading ? '#aaa' : PRIMARY }]}
          onPress={handleLogin}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text variant="labelMd" color="#fff">{isLoading ? 'Masuk...' : 'Login'}</Text>
        </TouchableOpacity>

        {/* Register link */}
        <View style={styles.footer}>
          <Text variant="bodySm" color={Colors.light.secondary}>Belum punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/register')} activeOpacity={0.7}>
            <Text variant="labelSm" color={PRIMARY}>Daftar</Text>
          </TouchableOpacity>
        </View>

        {/* Extra bottom padding so password field is not hidden behind keyboard */}
        <View style={{ height: 280 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surfaceContainerLow },
  scroll: { paddingHorizontal: 24, paddingBottom: 24 },
  backBtn: { paddingVertical: 16 },
  header: { alignItems: 'center', marginBottom: 28 },
  iconWrap: { width: 72, height: 72, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', borderRadius: 12, padding: 12, marginBottom: 16 },
  form: { marginBottom: 24 },
  fieldLabel: { marginBottom: 6, marginTop: 14 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.light.surfaceLowest,
    borderRadius: 14, borderWidth: 1, borderColor: Colors.light.outlineVariant,
    paddingHorizontal: 14, paddingVertical: Platform.OS === 'ios' ? 16 : 14,
  },
  input: { flex: 1, color: Colors.light.onSurface, fontSize: 14 },
  btn: { paddingVertical: 17, borderRadius: 50, alignItems: 'center', marginBottom: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
});
