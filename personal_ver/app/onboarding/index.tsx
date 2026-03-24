import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { Text } from '../../components/ui/Text';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useUserStore } from '../../utils/store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

export default function OnboardingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const setProfile = useUserStore(state => state.setProfile);
  const completeOnboarding = useUserStore(state => state.completeOnboarding);

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState<'Male' | 'Female' | ''>('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bloodType, setBloodType] = useState<'A' | 'B' | 'AB' | 'O' | ''>('');
  const [activityLevel, setActivityLevel] = useState('Lightly Active');

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (event?.type === 'set' && selectedDate) {
      setBirthDate(selectedDate);
    } else if (event?.type === 'dismissed') {
      setShowDatePicker(false);
    }
    // Fallback if event type is missing but date exists
    if (!event?.type && selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name || !birthDate || !gender) {
        Alert.alert('Perhatian', 'Mohon lengkapi data di langkah ini');
        return;
      }
    } else if (step === 2) {
      if (!height || !weight || !bloodType) {
        Alert.alert('Perhatian', 'Mohon lengkapi tinggi, berat, dan golongan darah');
        return;
      }
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    setProfile({
      name,
      birthDate: birthDate ? format(birthDate, 'yyyy-MM-dd') : '',
      gender,
      height,
      weight,
      bloodType,
      activityLevel
    });
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 24) }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.stepBadge}>
            <Text variant="labelSm" color={Colors.light.primary}>LANGKAH {step} DARI {totalSteps}</Text>
          </View>
          <Text variant="headlineMd" color={Colors.light.onSurface} style={styles.title}>
            {step === 1 && "Selamat Datang di LumiFit 👋"}
            {step === 2 && "Detail Tubuhmu"}
            {step === 3 && "Aktivitas Harian"}
          </Text>
          <Text variant="bodyLg" color={Colors.light.secondary} style={styles.subtitle}>
            {step === 1 && "Aplikasi pencatat nutrisi dan aktivitas harian Anda."}
            {step === 2 && "Informasi ini penting untuk menghitung IMT & kebutuhan kalori."}
            {step === 3 && "Seberapa sering kamu bergerak setiap harinya?"}
          </Text>

          {/* Progress Dots */}
          <View style={styles.progressRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={[styles.progressDot, step >= i && styles.progressDotActive]} />
            ))}
          </View>
        </View>

        {/* Form Section */}
        <Card level="lowest" style={styles.formCard}>

          {step === 1 && (
            <View style={styles.stepContainer}>
              <Input
                label="NAMA LENGKAP"
                placeholder="Masukkan nama Anda"
                iconName="person"
                value={name}
                onChangeText={setName}
              />

              <TouchableOpacity onPress={() => setShowDatePicker(true)} activeOpacity={0.8}>
                <View pointerEvents="none">
                  <Input
                    label="TANGGAL LAHIR"
                    placeholder="Pilih Tanggal Lahir"
                    iconName="calendar"
                    value={birthDate ? format(birthDate, 'dd MMMM yyyy') : ''}
                    editable={false}
                  />
                </View>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={birthDate || new Date(2000, 0, 1)}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onDateChange}
                  maximumDate={new Date()}
                />
              )}

              <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>JENIS KELAMIN</Text>
              <View style={styles.genderRow}>
                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'Male' && styles.genderBtnActive]}
                  onPress={() => setGender('Male')}
                >
                  <Ionicons name="male" size={20} color={gender === 'Male' ? '#fff' : Colors.light.primary} />
                  <Text variant="labelMd" color={gender === 'Male' ? '#fff' : Colors.light.primary} style={styles.genderText}>Laki-laki</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.genderBtn, gender === 'Female' && styles.genderBtnActive]}
                  onPress={() => setGender('Female')}
                >
                  <Ionicons name="female" size={20} color={gender === 'Female' ? '#fff' : Colors.light.primary} />
                  <Text variant="labelMd" color={gender === 'Female' ? '#fff' : Colors.light.primary} style={styles.genderText}>Perempuan</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 24, alignItems: 'center' }}>
                <Text variant="bodySm" color={Colors.light.secondary}>Sudah punya akun cloud?</Text>
                <TouchableOpacity onPress={() => router.push('/auth/login')} style={{ marginTop: 4, padding: 8 }}>
                  <Text variant="labelMd" color={Colors.light.primary}>Login Sekarang</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.metricsRow}>
                <Card level="low" style={styles.metricCard}>
                  <Text variant="labelSm" color={Colors.light.secondary}>TINGGI</Text>
                  <View style={styles.metricContent}>
                    <TextInput
                      style={styles.metricInput}
                      keyboardType="numeric"
                      value={height}
                      onChangeText={setHeight}
                      placeholder="175"
                      placeholderTextColor={Colors.light.outlineVariant}
                    />
                    <Text variant="labelMd" color={Colors.light.onSurface} style={styles.metricUnit}>cm</Text>
                  </View>
                </Card>

                <Card level="low" style={styles.metricCard}>
                  <Text variant="labelSm" color={Colors.light.secondary}>BERAT</Text>
                  <View style={styles.metricContent}>
                    <TextInput
                      style={styles.metricInput}
                      keyboardType="numeric"
                      value={weight}
                      onChangeText={setWeight}
                      placeholder="70"
                      placeholderTextColor={Colors.light.outlineVariant}
                    />
                    <Text variant="labelMd" color={Colors.light.onSurface} style={styles.metricUnit}>kg</Text>
                  </View>
                </Card>
              </View>

              <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>GOLONGAN DARAH</Text>
              <View style={styles.bloodTypeRow}>
                {['A', 'B', 'AB', 'O'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.bloodTypeBtn, bloodType === type && styles.bloodTypeBtnActive]}
                    onPress={() => setBloodType(type as any)}
                  >
                    <Text
                      variant="labelMd"
                      color={bloodType === type ? '#fff' : Colors.light.primary}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {step === 3 && (
            <View style={styles.stepContainer}>
              <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>TINGKAT AKTIVITAS HARIAN</Text>

              {[
                { id: 'Sangat Jarang', desc: 'Hampir tidak pernah olahraga' },
                { id: 'Ringan', desc: '1-3 hari/minggu' },
                { id: 'Sedang', desc: '3-5 hari/minggu' },
                { id: 'Aktif', desc: '6-7 hari/minggu' },
                { id: 'Sangat Aktif', desc: 'Olahraga berat setiap hari' }
              ].map((activity) => (
                <TouchableOpacity
                  key={activity.id}
                  style={[styles.activityOption, activityLevel === activity.id && styles.activityOptionActive]}
                  onPress={() => setActivityLevel(activity.id)}
                >
                  <View>
                    <Text variant="titleLg" color={activityLevel === activity.id ? Colors.light.primary : Colors.light.onSurface}>{activity.id}</Text>
                    <Text variant="bodyMd" color={activityLevel === activity.id ? Colors.light.primaryDim : Colors.light.secondary}>{activity.desc}</Text>
                  </View>
                  <View style={[styles.radioDot, activityLevel === activity.id && styles.radioDotActive]} />
                </TouchableOpacity>
              ))}
            </View>
          )}

        </Card>

        {/* Navigation Buttons */}
        <View style={styles.navButtonsRow}>
          {step > 1 && (
            <Button
              label="Kembali"
              variant="secondary"
              onPress={handleBack}
              style={styles.backBtn}
            />
          )}
          <Button
            label={step === totalSteps ? "Mulai Sekarang" : "Lanjut"}
            onPress={handleNext}
            style={styles.nextBtn}
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.surface,
  },
  container: {
    padding: 24,
    paddingTop: Platform.OS === 'ios' ? 12 : 24,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 28,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.light.primaryContainer,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
  subtitle: {
    lineHeight: 24,
    marginBottom: 24,
  },
  progressRow: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    height: 6,
    flex: 1,
    backgroundColor: Colors.light.surfaceContainerHighest,
    borderRadius: 3,
  },
  progressDotActive: {
    backgroundColor: Colors.light.primary,
  },
  formCard: {
    marginBottom: 32,
    borderWidth: 0,
    backgroundColor: Colors.light.surfaceLowest,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 4,
    padding: 24,
    borderRadius: 24,
  },
  stepContainer: {
    gap: 16,
  },
  sectionLabel: {
    marginTop: 8,
    marginBottom: 4,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.surfaceContainerLow,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderBtnActive: {
    backgroundColor: Colors.light.primary,
  },
  genderText: {
    marginLeft: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
  },
  metricContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
  },
  metricInput: {
    fontFamily: 'PlusJakartaSans-Bold',
    fontSize: 36,
    color: Colors.light.onSurface,
  },
  metricUnit: {
    marginLeft: 4,
  },
  bloodTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  bloodTypeBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bloodTypeBtnActive: {
    backgroundColor: Colors.light.primary,
  },
  activityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.light.surfaceContainerLow,
  },
  activityOptionActive: {
    backgroundColor: Colors.light.accentContainer,
    borderWidth: 1,
    borderColor: Colors.light.accent,
  },
  radioDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.outlineVariant,
  },
  radioDotActive: {
    borderColor: Colors.light.accent,
    borderWidth: 6,
  },
  navButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  backBtn: {
    flex: 1,
  },
  nextBtn: {
    flex: 2,
  },
});
