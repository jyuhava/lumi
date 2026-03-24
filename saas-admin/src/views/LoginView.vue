<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const loading = ref(false);

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;

  try {
    const res = await api.post('/saas/login', {
      email: email.value,
      password: password.value
    });

    localStorage.setItem('saas_token', res.data.token);
    localStorage.setItem('saas_user', JSON.stringify(res.data.user));
    
    router.push({ name: 'dashboard' });
  } catch (error) {
    if (error.response?.data?.errors) {
        errorMsg.value = Object.values(error.response.data.errors)[0][0];
    } else {
        errorMsg.value = error.response?.data?.message || 'Gagal login. Periksa kembali email dan password Anda.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-[#111827]">
    <div class="max-w-md w-full p-8 bg-white rounded-2xl shadow-xl">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black tracking-widest text-gray-900 uppercase">LUMINE <span class="text-emerald-500">SaaS</span></h1>
        <p class="text-gray-500 mt-2 font-medium">B2B Core System Administration</p>
      </div>

      <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Email Master</label>
          <input 
            v-model="email" 
            type="email" 
            required 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="admin@lumine.com"
          >
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1">Passkey Rahasia</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-md transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Mengotentikasi...' : 'Masuk ke Sistem Pusat' }}
        </button>
      </form>
      
      <div class="mt-8 pt-6 border-t border-gray-100 text-center">
        <p class="text-xs text-gray-400 font-semibold tracking-wide uppercase">Dilarang Keras Akses Tanpa Izin</p>
      </div>
    </div>
  </div>
</template>