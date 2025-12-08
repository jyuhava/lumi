<template>
  <AdminLayout>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Pengaturan</h2>
      <p class="text-gray-600">Kelola pengaturan sistem dan akun Anda</p>
    </div>

    <!-- Tabs -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-6 py-4 text-sm font-medium border-b-2 transition',
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            <ion-icon :name="tab.icon" class="text-lg mr-2 align-middle"></ion-icon>
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <!-- Institution Settings Tab -->
        <div v-if="activeTab === 'institution'">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Pengaturan Institusi</h3>
          <form @submit.prevent="saveInstitution" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nama Institusi <span class="text-red-500">*</span>
              </label>
              <input
                v-model="institutionForm.name"
                type="text"
                required
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="PT. Nama Perusahaan"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                v-model="institutionForm.address"
                rows="3"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Alamat lengkap institusi"
              ></textarea>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telepon
                </label>
                <input
                  v-model="institutionForm.phone"
                  type="text"
                  class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="021-1234567"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  v-model="institutionForm.email"
                  type="email"
                  class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="info@perusahaan.com"
                />
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                :disabled="savingInstitution"
                class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {{ savingInstitution ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Kelola Akun</h3>
          <form @submit.prevent="saveProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input
                v-model="profileForm.name"
                type="text"
                required
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                v-model="profileForm.username"
                type="text"
                required
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="profileForm.email"
                type="email"
                required
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="submit"
                :disabled="savingProfile"
                class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {{ savingProfile ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Password Tab -->
        <div v-if="activeTab === 'password'">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ubah Kata Sandi</h3>
          <form @submit.prevent="changePassword" class="space-y-4 max-w-md">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password Lama <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.current_password"
                type="password"
                required
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Password Baru <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.new_password"
                type="password"
                required
                minlength="8"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p class="mt-1 text-xs text-gray-500">Minimal 8 karakter</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru <span class="text-red-500">*</span>
              </label>
              <input
                v-model="passwordForm.new_password_confirmation"
                type="password"
                required
                minlength="8"
                class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="resetPasswordForm"
                class="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Reset
              </button>
              <button
                type="submit"
                :disabled="changingPassword"
                class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {{ changingPassword ? 'Mengubah...' : 'Ubah Password' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const activeTab = ref('institution')

const tabs = [
  { id: 'institution', label: 'Institusi', icon: 'business-outline' },
  { id: 'profile', label: 'Akun Saya', icon: 'person-outline' },
  { id: 'password', label: 'Ubah Password', icon: 'key-outline' },
]

// Institution form
const institutionForm = ref({
  name: '',
  address: '',
  phone: '',
  email: '',
  logo: ''
})
const savingInstitution = ref(false)

// Profile form
const profileForm = ref({
  name: '',
  username: '',
  email: ''
})
const savingProfile = ref(false)

// Password form
const passwordForm = ref({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
})
const changingPassword = ref(false)

const fetchInstitutionSettings = async () => {
  try {
    const response = await api.get('/settings/institution')
    if (response.data.success) {
      institutionForm.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching institution settings:', error)
  }
}

const saveInstitution = async () => {
  savingInstitution.value = true
  try {
    const response = await api.put('/settings/institution', institutionForm.value)
    if (response.data.success) {
      alert('Pengaturan institusi berhasil diperbarui!')
    }
  } catch (error: any) {
    console.error('Error saving institution settings:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan pengaturan')
  } finally {
    savingInstitution.value = false
  }
}

const loadUserProfile = () => {
  if (authStore.user) {
    profileForm.value = {
      name: authStore.user.name,
      username: authStore.user.username,
      email: authStore.user.email
    }
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    const response = await api.put('/user/profile', profileForm.value)
    if (response.data.success) {
      // Update auth store with new user data
      authStore.user = response.data.data
      alert('Profil berhasil diperbarui!')
    }
  } catch (error: any) {
    console.error('Error saving profile:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan profil')
  } finally {
    savingProfile.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.new_password_confirmation) {
    alert('Konfirmasi password tidak sesuai')
    return
  }

  changingPassword.value = true
  try {
    const response = await api.put('/user/password', passwordForm.value)
    if (response.data.success) {
      alert('Password berhasil diubah!')
      resetPasswordForm()
    }
  } catch (error: any) {
    console.error('Error changing password:', error)
    alert(error.response?.data?.message || 'Gagal mengubah password')
  } finally {
    changingPassword.value = false
  }
}

const resetPasswordForm = () => {
  passwordForm.value = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  }
}

onMounted(() => {
  fetchInstitutionSettings()
  loadUserProfile()
})
</script>
