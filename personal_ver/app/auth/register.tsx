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

const PRIMARY = Colors.light.primary;
const PRIMARY_BG = Colors.light.primaryContainer;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => { clearError(); }, [name, email, password, confirm]);

  // ── Keyboard-aware scroll ──────────────────────────────────────────────────
  const scrollRef = useRef<ScrollView>(null);
  // Refs for each field wrapper View
  const nameRef    = useRef<View>(null);
  const emailRef   = useRef<View>(null);
  const pwRef      = useRef<View>(null);
  const cpwRef     = useRef<View>(null);

  /**
   * When a field gets focus, measure its position relative to the ScrollView
   * and scroll so the field is comfortably visible above the keyboard.
   * We add 120px of extra offset so the keyboard doesn't cover the field.
   */
  const scrollToRef = (ref: React.RefObject<View>) => {
    if (!ref.current || !scrollRef.current) return;
    ref.current.measureLayout(
      // @ts-ignore – passing ScrollView's inner node as the `relativeToNativeNode`
      scrollRef.current,
      (_x, y) => {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
      },
      () => {} // onFail – silent
    );
  };

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirm) {
      Alert.alert('Lengkapi semua field');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Password tidak cocok');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Password minimal 8 karakter');
      return;
    }
    const success = await register({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      password_confirmation: confirm,
    });
    if (success) {
      Alert.alert('Berhasil! 🎉', 'Akun berhasil dibuat. Data Anda kini tersimpan di cloud!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        // On Android this ensures the view resizes when keyboard appears
        keyboardDismissMode="interactive"
      >
        {/* Back */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.light.onSurface} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconWrap, { backgroundColor: PRIMARY_BG }]}>
            <Ionicons name="person-add-outline" size={32} color={PRIMARY} />
          </View>
          <Text variant="headlineMd" color={Colors.light.onSurface} style={{ marginTop: 16 }}>
            Buat Akun LumiFit
          </Text>
          <Text variant="bodySm" color={Colors.light.secondary} style={{ marginTop: 4, textAlign: 'center' }}>
            Simpan data kesehatan Anda di cloud agar aman dan bisa diakses di mana saja.
          </Text>
        </View>

        {/* Error banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle-outline" size={16} color="#B71C1C" />
            <Text variant="bodySm" color="#B71C1C" style={{ marginLeft: 6, flex: 1 }}>{error}</Text>
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <FieldLabel label="Nama Lengkap" />
          <View ref={nameRef}>
            <Field
              icon="person-outline" placeholder="John Doe"
              value={name} onChangeText={setName}
              onFocus={() => scrollToRef(nameRef)}
              returnKeyType="next"
            />
          </View>

          <FieldLabel label="Email" />
          <View ref={emailRef}>
            <Field
              icon="mail-outline" placeholder="email@example.com"
              value={email} onChangeText={setEmail}
              keyboardType="email-address" autoCapitalize="none"
              onFocus={() => scrollToRef(emailRef)}
              returnKeyType="next"
            />
          </View>

          <FieldLabel label="Password" />
          <View ref={pwRef}>
            <Field
              icon="lock-closed-outline" placeholder="Min. 8 karakter"
              value={password} onChangeText={setPassword}
              secureTextEntry={!showPassword} autoCapitalize="none"
              onFocus={() => scrollToRef(pwRef)}
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconPress={() => setShowPassword(v => !v)}
              returnKeyType="next"
            />
          </View>

          <FieldLabel label="Konfirmasi Password" />
          <View ref={cpwRef}>
            <Field
              icon="lock-closed-outline" placeholder="Ulangi password"
              value={confirm} onChangeText={setConfirm}
              secureTextEntry={!showPassword} autoCapitalize="none"
              onFocus={() => scrollToRef(cpwRef)}
              returnKeyType="done"
              onSubmitEditing={handleRegister}
            />
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: isLoading ? '#aaa' : PRIMARY }]}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={isLoading}
        >
          <Text variant="labelMd" color="#fff">{isLoading ? 'Mendaftar...' : 'Daftar'}</Text>
        </TouchableOpacity>

        {/* Login link */}
        <View style={styles.footer}>
          <Text variant="bodySm" color={Colors.light.secondary}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/auth/login')} activeOpacity={0.7}>
            <Text variant="labelSm" color={PRIMARY}>Login</Text>
          </TouchableOpacity>
        </View>

        {/* Extra bottom padding so last field is never behind keyboard */}
        <View style={{ height: 320 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function FieldLabel({ label }: { label: string }) {
  return <Text variant="labelSm" color={Colors.light.secondary} style={styles.fieldLabel}>{label}</Text>;
}

function Field({
  icon, placeholder, value, onChangeText, keyboardType, autoCapitalize,
  secureTextEntry, rightIcon, onRightIconPress, onFocus, returnKeyType, onSubmitEditing,
}: any) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={18} color={Colors.light.secondary} style={{ marginRight: 10 }} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.secondary}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'words'}
        secureTextEntry={secureTextEntry ?? false}
        autoCorrect={false}
        onFocus={onFocus}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7}>
          <Ionicons name={rightIcon} size={18} color={Colors.light.secondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

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
