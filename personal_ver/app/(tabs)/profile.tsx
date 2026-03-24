import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Colors } from '@/constants/Colors';
import { useUserStore, UserProfile } from '@/utils/store';
import { useAuthStore } from '@/stores/authStore';
import { useActivityStore } from '@/stores/activityStore';
import { format, parseISO, differenceInYears } from 'date-fns';

const PRIMARY = Colors.light.primary;         // #006764
const PRIMARY_BG = Colors.light.primaryContainer; // #6cf1ec

// ─── Option lists ─────────────────────────────────────────────────────────────
const GENDER_OPTIONS = ['Male', 'Female'] as const;
const BLOOD_TYPES = ['A', 'B', 'AB', 'O', ''] as const;
const ACTIVITY_LEVELS = [
  { label: 'Sedenter (Jarang olahraga)', value: '1.2' },
  { label: 'Ringan (1–3 hari/minggu)', value: '1.375' },
  { label: 'Sedang (3–5 hari/minggu)', value: '1.55' },
  { label: 'Aktif (6–7 hari/minggu)', value: '1.725' },
  { label: 'Sangat Aktif (Atlet)', value: '1.9' },
];

// ─── Types ────────────────────────────────────────────────────────────────────
type EditableFields = Partial<UserProfile>;
type PickerField = 'gender' | 'bloodType' | 'activityLevel' | null;

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { profile, updateProfile, resetStore } = useUserStore();
  const { resetAll: resetActivityLogs } = useActivityStore();
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();

  const handleResetLocalData = () => {
    Alert.alert(
      'Hapus Data Lokal?',
      'Peringatan: Anda belum login ke cloud. Jika Anda menghapus data sekarang, seluruh histori berat badan dan aktivitas akan hilang permanen dan aplikasi akan di-reset.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus Permanen',
          style: 'destructive',
          onPress: async () => {
            resetStore();
            await resetActivityLogs();
            // Redirect to onboarding
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EditableFields>({});
  const [activePicker, setActivePicker] = useState<PickerField>(null);

  // Resolved values (draft overrides profile when editing)
  const get = <K extends keyof UserProfile>(key: K): UserProfile[K] | '' =>
    isEditing ? ((draft[key] ?? profile?.[key]) as UserProfile[K]) ?? '' : (profile?.[key] ?? '');

  // Derived info
  const ageYears = profile?.birthDate
    ? differenceInYears(new Date(), parseISO(profile.birthDate))
    : null;
  const activityLabel = ACTIVITY_LEVELS.find((a) => a.value === profile?.activityLevel)?.label ?? '—';
  const heightCm = parseFloat(profile?.height ?? '0');
  const weightKg = parseFloat(profile?.weight ?? '0');
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? weightKg / (heightM * heightM) : 0;

  // ── Edit handlers ────────────────────────────────────────────────────────────
  const startEdit = () => {
    setDraft({ ...profile } as EditableFields);
    setIsEditing(true);
  };
  const cancelEdit = () => {
    setDraft({});
    setIsEditing(false);
    setActivePicker(null);
  };
  const saveEdit = () => {
    if (!draft.name?.trim()) {
      Alert.alert('Nama tidak boleh kosong');
      return;
    }
    
    // Save locally
    updateProfile(draft as UserProfile);
    
    // Sync to cloud if logged in
    if (isLoggedIn) {
      const { updateProfile: updateCloud } = useAuthStore.getState();
      updateCloud({
        name: draft.name,
        birth_date: draft.birthDate,
        gender: draft.gender as any,
        height_cm: draft.height ? Number(draft.height) : undefined,
        weight_kg: draft.weight ? Number(draft.weight) : undefined,
        blood_type: draft.bloodType as any,
        activity_level: draft.activityLevel,
        target_weight_kg: draft.targetWeight ? Number(draft.targetWeight) : undefined,
      });
    }

    setIsEditing(false);
    setDraft({});
    setActivePicker(null);
  };
  const setDraftField = <K extends keyof UserProfile>(key: K, val: UserProfile[K]) =>
    setDraft((d) => ({ ...d, [key]: val }));

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text variant="headlineMd" color={Colors.light.onSurface}>Profil Saya</Text>
          {isEditing ? (
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={cancelEdit} style={styles.cancelBtn} activeOpacity={0.7}>
                <Text variant="labelMd" color={Colors.light.secondary}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} style={[styles.saveBtn, { backgroundColor: PRIMARY }]} activeOpacity={0.8}>
                <Text variant="labelMd" color="#fff">Simpan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={startEdit} activeOpacity={0.7} style={styles.editBtn}>
              <Ionicons name="pencil-outline" size={18} color={PRIMARY} />
              <Text variant="labelMd" color={PRIMARY} style={{ marginLeft: 4 }}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Avatar + Name ─────────────────────────────────────────────────── */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Ionicons name={profile?.gender === 'Female' ? 'woman' : 'man'} size={40} color={PRIMARY} />
          </View>
          {isEditing ? (
            <TextInput
              style={styles.nameInput}
              value={draft.name ?? ''}
              onChangeText={(v) => setDraftField('name', v)}
              placeholder="Nama Lengkap"
              placeholderTextColor={Colors.light.secondary}
            />
          ) : (
            <Text variant="headlineSm" color={Colors.light.onSurface} style={{ marginTop: 12, textAlign: 'center' }}>
              {profile?.name ?? 'Nama belum diisi'}
            </Text>
          )}
          {ageYears !== null && (
            <Text variant="bodySm" color={Colors.light.secondary} style={{ marginTop: 4 }}>
              {ageYears} tahun
              {profile?.bloodType ? ` · Gol. Darah ${profile.bloodType}` : ''}
            </Text>
          )}
        </View>

        {/* ── Quick Stats Row ───────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <QuickStat label="Berat" value={weightKg > 0 ? `${weightKg.toFixed(1)} kg` : '—'} icon="scale-outline" />
          <QuickStat label="Tinggi" value={heightCm > 0 ? `${heightCm} cm` : '—'} icon="resize-outline" />
          <QuickStat label="BMI" value={bmi > 0 ? bmi.toFixed(1) : '—'} icon="analytics-outline" />
        </View>

        {/* ── Personal Info Card ────────────────────────────────────────────── */}
        <SectionLabel title="Informasi Pribadi" />
        <Card level="lowest" asymmetric={false} style={styles.card}>

          <ProfileRow
            label="Tanggal Lahir"
            icon="calendar-outline"
            isEditing={isEditing}
            displayValue={profile?.birthDate ? format(parseISO(profile.birthDate), 'dd MMM yyyy') : '—'}
          >
            <TextInput
              style={styles.inlineInput}
              value={draft.birthDate ?? ''}
              onChangeText={(v) => setDraftField('birthDate', v)}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={Colors.light.secondary}
            />
          </ProfileRow>

          <Divider />
          <ProfileRow label="Jenis Kelamin" icon="person-outline" isEditing={isEditing} displayValue={profile?.gender || '—'}>
            <TouchableOpacity onPress={() => setActivePicker('gender')} style={styles.pickerTrigger}>
              <Text variant="bodySm" color={Colors.light.onSurface}>{(draft.gender || profile?.gender) ?? 'Pilih'}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.light.secondary} />
            </TouchableOpacity>
          </ProfileRow>

          <Divider />
          <ProfileRow label="Gol. Darah" icon="water-outline" isEditing={isEditing} displayValue={profile?.bloodType || '—'}>
            <TouchableOpacity onPress={() => setActivePicker('bloodType')} style={styles.pickerTrigger}>
              <Text variant="bodySm" color={Colors.light.onSurface}>{(draft.bloodType || profile?.bloodType) || 'Pilih'}</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.light.secondary} />
            </TouchableOpacity>
          </ProfileRow>
        </Card>

        {/* ── Body Metrics Card ─────────────────────────────────────────────── */}
        <SectionLabel title="Data Tubuh" />
        <Card level="lowest" asymmetric={false} style={styles.card}>

          <ProfileRow label="Tinggi Badan" icon="resize-outline" isEditing={isEditing} displayValue={profile?.height ? `${profile.height} cm` : '—'}>
            <TextInput
              style={styles.inlineInput}
              value={draft.height ?? ''}
              onChangeText={(v) => setDraftField('height', v)}
              placeholder="cm"
              keyboardType="numeric"
              placeholderTextColor={Colors.light.secondary}
            />
          </ProfileRow>

          <Divider />
          <ProfileRow label="Berat Badan" icon="scale-outline" isEditing={isEditing} displayValue={profile?.weight ? `${profile.weight} kg` : '—'}>
            <TextInput
              style={styles.inlineInput}
              value={draft.weight ?? ''}
              onChangeText={(v) => setDraftField('weight', v)}
              placeholder="kg"
              keyboardType="numeric"
              placeholderTextColor={Colors.light.secondary}
            />
          </ProfileRow>

          <Divider />
          <ProfileRow label="Target Berat" icon="flag-outline" isEditing={isEditing} displayValue={profile?.targetWeight ? `${profile.targetWeight} kg` : '—'}>
            <TextInput
              style={styles.inlineInput}
              value={draft.targetWeight ?? ''}
              onChangeText={(v) => setDraftField('targetWeight', v)}
              placeholder="kg (opsional)"
              keyboardType="numeric"
              placeholderTextColor={Colors.light.secondary}
            />
          </ProfileRow>
        </Card>

        {/* ── Activity Card ─────────────────────────────────────────────────── */}
        <SectionLabel title="Level Aktivitas" />
        <Card level="lowest" asymmetric={false} style={styles.card}>
          <ProfileRow label="Aktivitas" icon="walk-outline" isEditing={isEditing} displayValue={activityLabel}>
            <TouchableOpacity onPress={() => setActivePicker('activityLevel')} style={[styles.pickerTrigger, { flex: 1 }]}>
              <Text variant="bodySm" color={Colors.light.onSurface} numberOfLines={1} style={{ flex: 1 }}>
                {ACTIVITY_LEVELS.find(a => a.value === (draft.activityLevel ?? profile?.activityLevel))?.label ?? 'Pilih'}
              </Text>
              <Ionicons name="chevron-down" size={14} color={Colors.light.secondary} />
            </TouchableOpacity>
          </ProfileRow>
        </Card>

        {/* ── Cloud Account Section ─────────────────────────────────────────── */}
        <SectionLabel title="Akun Cloud" />
        {isLoggedIn && user ? (
          <Card level="lowest" asymmetric={false} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View style={[styles.quickStatIcon, { backgroundColor: PRIMARY_BG, marginRight: 12 }]}>
                <Ionicons name="cloud-done-outline" size={20} color={PRIMARY} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="bodyLg" color={Colors.light.onSurface}>{user.name}</Text>
                <Text variant="bodySm" color={Colors.light.secondary}>{user.email}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.logoutBtn]}
              onPress={() =>
                Alert.alert('Logout', 'Keluar dari akun cloud?', [
                  { text: 'Batal', style: 'cancel' },
                  { text: 'Logout', style: 'destructive', onPress: () => logout() },
                ])
              }
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={16} color="#F44336" />
              <Text variant="labelSm" color="#F44336" style={{ marginLeft: 6 }}>Logout dari Cloud</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          <View>
            <Card level="lowest" asymmetric={false} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Ionicons name="cloud-offline-outline" size={20} color={Colors.light.secondary} style={{ marginRight: 8 }} />
                <Text variant="bodySm" color={Colors.light.secondary} style={{ flex: 1 }}>
                  Data tersimpan lokal. Daftar untuk backup ke cloud.
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={[styles.authBtn, { backgroundColor: PRIMARY, flex: 2 }]}
                  onPress={() => router.push('/auth/register')}
                  activeOpacity={0.85}
                >
                  <Ionicons name="person-add-outline" size={16} color="#fff" />
                  <Text variant="labelSm" color="#fff" style={{ marginLeft: 6 }}>Daftar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authBtn, { borderWidth: 1.5, borderColor: PRIMARY, flex: 1 }]}
                  onPress={() => router.push('/auth/login')}
                  activeOpacity={0.85}
                >
                  <Text variant="labelSm" color={PRIMARY}>Login</Text>
                </TouchableOpacity>
              </View>
            </Card>

            <TouchableOpacity
              style={[styles.logoutBtn, { marginTop: 4, borderColor: '#ef4444' }]}
              onPress={handleResetLocalData}
              activeOpacity={0.8}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text variant="labelSm" color="#ef4444" style={{ marginLeft: 6 }}>Hapus Data Lokal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom space for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Picker Modal ──────────────────────────────────────────────────────── */}
      <Modal visible={activePicker !== null} transparent animationType="slide">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setActivePicker(null)}>
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHandle} />
            <Text variant="titleMd" color={Colors.light.onSurface} style={{ marginBottom: 16 }}>
              {activePicker === 'gender' && 'Jenis Kelamin'}
              {activePicker === 'bloodType' && 'Golongan Darah'}
              {activePicker === 'activityLevel' && 'Level Aktivitas'}
            </Text>

            {/* Gender options */}
            {activePicker === 'gender' && GENDER_OPTIONS.map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.pickerOption, draft.gender === g && { backgroundColor: PRIMARY_BG }]}
                onPress={() => { setDraftField('gender', g); setActivePicker(null); }}
              >
                <Text variant="bodyLg" color={draft.gender === g ? PRIMARY : Colors.light.onSurface}>{g}</Text>
                {draft.gender === g && <Ionicons name="checkmark" size={18} color={PRIMARY} />}
              </TouchableOpacity>
            ))}

            {/* Blood type options */}
            {activePicker === 'bloodType' && BLOOD_TYPES.map((b) => (
              <TouchableOpacity
                key={b || 'none'}
                style={[styles.pickerOption, draft.bloodType === b && { backgroundColor: PRIMARY_BG }]}
                onPress={() => { setDraftField('bloodType', b as UserProfile['bloodType']); setActivePicker(null); }}
              >
                <Text variant="bodyLg" color={draft.bloodType === b ? PRIMARY : Colors.light.onSurface}>
                  {b || 'Tidak diketahui'}
                </Text>
                {draft.bloodType === b && <Ionicons name="checkmark" size={18} color={PRIMARY} />}
              </TouchableOpacity>
            ))}

            {/* Activity level options */}
            {activePicker === 'activityLevel' && ACTIVITY_LEVELS.map((a) => (
              <TouchableOpacity
                key={a.value}
                style={[styles.pickerOption, draft.activityLevel === a.value && { backgroundColor: PRIMARY_BG }]}
                onPress={() => { setDraftField('activityLevel', a.value); setActivePicker(null); }}
              >
                <Text variant="bodySm" color={draft.activityLevel === a.value ? PRIMARY : Colors.light.onSurface} style={{ flex: 1 }}>
                  {a.label}
                </Text>
                {draft.activityLevel === a.value && <Ionicons name="checkmark" size={18} color={PRIMARY} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ title }: { title: string }) {
  return (
    <Text variant="labelSm" color={Colors.light.secondary} style={styles.sectionLabel}>
      {title.toUpperCase()}
    </Text>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function QuickStat({ label, value, icon }: { label: string; value: string; icon: any }) {
  return (
    <View style={styles.quickStat}>
      <View style={[styles.quickStatIcon, { backgroundColor: PRIMARY_BG }]}>
        <Ionicons name={icon} size={18} color={PRIMARY} />
      </View>
      <Text variant="headlineSm" color={Colors.light.onSurface} style={{ marginTop: 6 }}>{value}</Text>
      <Text variant="labelSm" color={Colors.light.secondary}>{label}</Text>
    </View>
  );
}

function ProfileRow({
  label, icon, isEditing, displayValue, children,
}: {
  label: string;
  icon: any;
  isEditing: boolean;
  displayValue: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.profileRow}>
      <View style={styles.profileRowLeft}>
        <Ionicons name={icon} size={16} color={Colors.light.secondary} style={{ marginRight: 10 }} />
        <Text variant="bodySm" color={Colors.light.secondary}>{label}</Text>
      </View>
      {isEditing && children ? children : (
        <Text variant="bodySm" color={Colors.light.onSurface}>{displayValue}</Text>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.light.surfaceContainerLow },
  scroll: { paddingHorizontal: 20 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 20 },
  headerActions: { flexDirection: 'row', gap: 8 },
  editBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, backgroundColor: Colors.light.primaryContainer, borderRadius: 50 },
  cancelBtn: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 50, borderWidth: 1, borderColor: Colors.light.outlineVariant },
  saveBtn: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 50 },

  avatarSection: { alignItems: 'center', marginBottom: 20 },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: PRIMARY_BG, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: PRIMARY },
  nameInput: {
    marginTop: 10, textAlign: 'center', fontSize: 20, fontWeight: '700',
    color: Colors.light.onSurface, borderBottomWidth: 1.5, borderBottomColor: PRIMARY,
    paddingBottom: 4, minWidth: 180,
    fontFamily: Platform.OS === 'ios' ? 'PlusJakartaSans-Bold' : undefined,
  },

  statsRow: { flexDirection: 'row', marginBottom: 16, backgroundColor: Colors.light.surfaceLowest, borderRadius: 20, padding: 16, justifyContent: 'space-around' },
  quickStat: { alignItems: 'center', flex: 1 },
  quickStatIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  sectionLabel: { marginBottom: 8, marginTop: 4 },
  card: { marginBottom: 12 },

  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  profileRowLeft: { flexDirection: 'row', alignItems: 'center' },
  divider: { height: 1, backgroundColor: Colors.light.outlineVariant, opacity: 0.5 },
  inlineInput: {
    color: Colors.light.onSurface, borderBottomWidth: 1, borderBottomColor: PRIMARY,
    paddingVertical: 2, paddingHorizontal: 4, minWidth: 80, textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'PlusJakartaSans-Regular' : undefined,
    fontSize: 13,
  },
  pickerTrigger: { flexDirection: 'row', alignItems: 'center', gap: 4 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  pickerSheet: { backgroundColor: Colors.light.surfaceLowest, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  pickerHandle: { width: 36, height: 4, backgroundColor: Colors.light.outlineVariant, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  pickerOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4 },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 50, borderWidth: 1.5, borderColor: '#F44336' },
  authBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 50 },
});
