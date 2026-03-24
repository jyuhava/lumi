import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, SafeAreaView, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import api, { setToken } from '../api/axios';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Harap isi email dan password.');
      return;
    }

    setLoading(true);
    try {
      console.log('Mencoba login ke:', email);
      const response = await api.post('/mobile/login', {
        email,
        password,
        device_name: Platform.OS + ' Device'
      });
      console.log('Response sukses:', response.data);

      if (response.data.success) {
        await setToken(response.data.token);
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      console.log('Error Login:', error);
      console.log('Detail Error Response:', error.response?.data);
      const msg = error.response?.data?.message || 'Gagal tersambung ke server.';
      Alert.alert('Login Gagal', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f766e', '#14b8a6', '#042f2e']} // Hijau Tosca Gradient
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Top Deco */}
          <View style={styles.topDeco}>
            <Ionicons name="medical" size={40} color="rgba(255,255,255,0.2)" />
          </View>

          <View style={styles.cardContainer}>
            <View style={styles.header}>
              <View style={styles.logoWrapper}>
                <Ionicons name="leaf-outline" size={42} color="#0f766e" />
              </View>
              <Text style={styles.title}>Lumical</Text>
              <Text style={styles.subtitle}>by Syntaf</Text>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username atau Email"
                  placeholderTextColor="#9ca3af"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password..."
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Lupa Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, loading && styles.buttonDisabled]} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>MASUK</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Terlindungi enkripsi ujung-ke-ujung • {new Date().getFullYear()}
            </Text>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  topDeco: {
    position: 'absolute',
    top: 50,
    right: -20,
    transform: [{ rotate: '45deg' }, { scale: 3 }],
  },
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoWrapper: {
    width: 80,
    height: 80,
    backgroundColor: '#ccfbf1', // teal-100
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    transform: [{ rotate: '-10deg' }],
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#0f766e', // teal-700
    fontWeight: '600',
    marginTop: 4,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6', // gray-100
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb', // gray-200
  },
  inputIcon: {
    paddingLeft: 16,
    paddingRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 15,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#0f766e', // teal-700
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#0f766e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#99f6e4', // teal-200
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  }
});
