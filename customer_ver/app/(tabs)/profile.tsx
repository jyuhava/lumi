import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import api, { removeToken } from '../../api/axios';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themeColors = {
    background: isDark ? '#042f2e' : '#f0fdfa',
    text: isDark ? '#ffffff' : '#111827',
    cardLight: isDark ? '#115e59' : '#ffffff',
    mainCard: isDark ? '#0d9488' : '#14b8a6',
    danger: isDark ? '#ef4444' : '#dc2626',
    inputBg: isDark ? '#0f766e' : '#f8fafc',
    inputBorder: isDark ? '#14b8a6' : '#e2e8f0',
  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '', email: '', whatsapp: '', gender: 'other', age: '', weight: '', height: '', password: ''
  });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get('/mobile/me');
      if (res.data.success && res.data.user) {
        const u = res.data.user;
        setProfile({
          ...profile, 
          name: u.name || '', 
          email: u.email || '', 
          whatsapp: u.whatsapp || '', 
          gender: u.gender || 'other',
          age: u.age ? String(u.age) : '', 
          weight: u.weight ? String(u.weight) : '', 
          height: u.height ? String(u.height) : ''
        });
      }
    } catch (e: any) { 
      // Silently handle if profile fails to load initial
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const data = { ...profile };
      if (!data.password) delete (data as any).password;
      const res = await api.put('/mobile/profile', data);
      if (res.data.success) { 
        if (Platform.OS === 'web') {
          window.alert('Profil berhasil diperbarui');
        } else {
          Alert.alert('Sukses', 'Profil berhasil diperbarui'); 
        }
        setProfile({ ...profile, password: '' }); 
      }
    } catch (e: any) { 
      const msg = e.response?.data?.message || 'Gagal menyimpan profil';
      if (Platform.OS === 'web') window.alert(msg);
      else Alert.alert('Error', msg);
    } finally { setSaving(false); }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar?');
      if (confirmLogout) {
        try { await api.post('/mobile/logout'); } catch {} 
        await removeToken(); 
        router.replace('/login'); 
      }
    } else {
      Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin keluar?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: async () => { 
          try { await api.post('/mobile/logout'); } catch {} 
          await removeToken(); 
          router.replace('/login'); 
        } }
      ]);
    }
  };

  if (loading) return <View style={[styles.center, { backgroundColor: themeColors.background }]}><ActivityIndicator size="large" color={themeColors.mainCard} /></View>;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { backgroundColor: themeColors.mainCard }]}>
          <Text style={styles.headerTitle}>Profil Saya</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: themeColors.cardLight }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Informasi Dasar</Text>
          <Text style={[styles.label, { color: themeColors.text }]}>Nama Lengkap</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.name} onChangeText={(v) => setProfile({...profile, name: v})} />
          <Text style={[styles.label, { color: themeColors.text }]}>Email</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.email} keyboardType="email-address" onChangeText={(v) => setProfile({...profile, email: v})} />
          <Text style={[styles.label, { color: themeColors.text }]}>WhatsApp</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.whatsapp} keyboardType="phone-pad" onChangeText={(v) => setProfile({...profile, whatsapp: v})} />
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardLight }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Informasi Fisik</Text>
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={[styles.label, { color: themeColors.text }]}>Usia</Text>
              <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.age} keyboardType="numeric" onChangeText={(v) => setProfile({...profile, age: v})} />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={[styles.label, { color: themeColors.text }]}>Gender</Text>
              <View style={[styles.pickerContainer, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder }]}>
                <Picker selectedValue={profile.gender} style={{color: themeColors.text}} dropdownIconColor={themeColors.text} onValueChange={(itemValue) => setProfile({...profile, gender: itemValue})}>
                  <Picker.Item label="Laki-laki" value="male" />
                  <Picker.Item label="Perempuan" value="female" />
                  <Picker.Item label="Lainnya" value="other" />
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={[styles.label, { color: themeColors.text }]}>Berat Badan (kg)</Text>
              <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.weight} keyboardType="numeric" onChangeText={(v) => setProfile({...profile, weight: v})} />
            </View>
            <View style={{flex: 1, marginLeft: 8}}>
              <Text style={[styles.label, { color: themeColors.text }]}>Tinggi Badan (cm)</Text>
              <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.height} keyboardType="numeric" onChangeText={(v) => setProfile({...profile, height: v})} />
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: themeColors.cardLight }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Keamanan</Text>
          <Text style={[styles.label, { color: themeColors.text }]}>Password Baru (Opsional)</Text>
          <TextInput style={[styles.input, { backgroundColor: themeColors.inputBg, borderColor: themeColors.inputBorder, color: themeColors.text }]} value={profile.password} secureTextEntry placeholder="Kosongkan jika tidak diubah" placeholderTextColor={isDark ? '#94a3b8' : '#64748b'} onChangeText={(v) => setProfile({...profile, password: v})} />
        </View>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: themeColors.mainCard }]} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Simpan Profil</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: themeColors.danger }]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={themeColors.danger} style={{marginRight: 8}} />
          <Text style={[styles.logoutText, { color: themeColors.danger }]}>Logout</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 } },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  scrollContent: { padding: 20 },
  card: { borderRadius: 16, padding: 20, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 } },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
  label: { fontSize: 14, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, marginBottom: 16 },
  row: { flexDirection: 'row' },
  pickerContainer: { borderWidth: 1, borderRadius: 12, marginBottom: 16, height: 52, justifyContent: 'center', overflow: 'hidden' },
  saveButton: { borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginBottom: 16 },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  logoutButton: { flexDirection: 'row', borderWidth: 1, borderRadius: 16, paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  logoutText: { fontSize: 16, fontWeight: 'bold' }
});