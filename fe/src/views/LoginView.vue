<template>
  <div class="min-h-screen flex w-full bg-white font-sans text-gray-800">
    <!-- Left Pane: Visual Branding (Hidden on mobile, visible on lg screens) -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#2d4016]">
      <!-- Deep layered background gradients -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#4a6825] via-[#739b1a] to-[#afc531] mix-blend-multiply opacity-90"></div>
      
      <!-- Abstract geometric shapes -->
      <div class="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] rounded-full border-[1px] border-[#bcdd5a]/20 blur-[2px] transform -rotate-12"></div>
      <div class="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-gradient-to-b from-[#eade96]/10 to-transparent blur-[40px]"></div>
      <div class="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] rounded-full bg-gradient-to-tl from-[#bcdd5a]/20 via-transparent to-transparent blur-[60px]"></div>
      
      <!-- Content overlay -->
      <div class="relative z-10 flex flex-col justify-between h-full p-16 w-full text-white">
        <!-- Brand Logo / Identity -->
        <div class="flex items-center gap-4 animate-fade-in-down">
          <div class="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <ion-icon name="medical" class="text-3xl text-[#eade96]"></ion-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-2xl font-bold tracking-widest uppercase text-white/95" style="letter-spacing: 0.2em;">LUMINE</span>
            <span class="text-xs font-semibold tracking-wider text-[#eade96]/80" style="letter-spacing: 0.1em;">BY SYNTAF</span>
          </div>
        </div>

        <!-- Hero Text -->
        <div class="max-w-md animate-fade-in-up" style="animation-delay: 0.2s;">
          <h1 class="text-5xl font-extrabold leading-tight mb-6 text-white text-shadow-sm font-serif decoration-[#bcdd5a] underline-offset-8 decoration-4" style="font-family: 'Playfair Display', serif;">
            Sistem Manajemen Instalasi Gizi
          </h1>
          <p class="text-[#f8faf6]/80 text-lg leading-relaxed font-light">
            Pengelolaan stok, pengadaan, dan evaluasi performa ruang gizi secara terpadu, menjamin efisiensi dalam pelayanan pasien terstandar tinggi.
          </p>
        </div>

        <!-- Sub footer info -->
        <div class="flex items-center gap-6 animate-fade-in-up text-sm font-medium text-white/60" style="animation-delay: 0.4s;">
          <div class="flex gap-2 items-center">
            <ion-icon name="shield-checkmark-outline" class="text-lg text-[#bcdd5a]"></ion-icon>
            <span>Keamanan Terekripsi</span>
          </div>
          <div class="flex gap-2 items-center">
            <ion-icon name="server-outline" class="text-lg text-[#bcdd5a]"></ion-icon>
            <span>Stabilitas Terjamin</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Pane: Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white relative">
      <!-- Minimalist mobile header (only shows on small screens) -->
      <div class="absolute top-8 left-8 flex items-center gap-3 lg:hidden">
          <div class="flex items-center justify-center w-10 h-10 bg-[#739b1a] rounded-lg shadow-md flex-shrink-0">
            <ion-icon name="medical" class="text-xl text-white"></ion-icon>
          </div>
          <div class="flex flex-col">
            <span class="text-lg font-bold text-[#4a6825] tracking-wide leading-none">LUMINE</span>
            <span class="text-[10px] font-semibold text-gray-400 tracking-wider">BY SYNTAF</span>
          </div>
        </div>

        <div class="w-full max-w-md mt-16 sm:mt-0">
          <div class="mb-10 sm:mb-12">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">Selamat Datang Eksekutor</h2>
            <p class="text-sm sm:text-base text-gray-500 font-medium">Silakan masuk menggunakan kredensial Anda.</p>
          </div>

        <form @submit.prevent="handleLogin" class="space-y-8">
          <!-- Username Input -->
          <div class="relative group/field">
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="peer w-full h-12 bg-transparent text-gray-900 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#739b1a] transition-colors placeholder-transparent outline-none"
              placeholder="Username"
            />
            <label 
              for="username" 
              class="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#739b1a] font-semibold cursor-text"
            >
              Username / ID Karyawan
            </label>
            <ion-icon name="person-outline" class="absolute right-0 top-3.5 text-gray-400 peer-focus:text-[#739b1a] transition-colors"></ion-icon>
          </div>

          <!-- Password Input -->
          <div class="relative group/field pb-2">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="peer w-full h-12 bg-transparent text-gray-900 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-[#739b1a] transition-colors placeholder-transparent outline-none pr-8"
              placeholder="Password"
            />
            <label 
              for="password" 
              class="absolute left-0 -top-3.5 text-sm text-gray-500 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-[#739b1a] font-semibold cursor-text"
            >
              Password
            </label>
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-0 top-3.5 text-gray-400 hover:text-[#739b1a] transition-colors focus:outline-none"
            >
              <ion-icon :name="showPassword ? 'eye-off-outline' : 'eye-outline'" class="text-xl"></ion-icon>
            </button>
          </div>

          <!-- Error Alert -->
          <div v-if="errorMessage" class="flex items-center gap-3 p-4 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-100 animate-pulse">
            <ion-icon name="warning-outline" class="text-lg flex-shrink-0"></ion-icon>
            <p>{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#4a6825] hover:bg-[#739b1a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#739b1a] transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
          >
            <span v-if="!loading" class="flex items-center gap-2 text-base">
              Akses Sistem
              <ion-icon name="arrow-forward-outline"></ion-icon>
            </span>
            <span v-else class="flex items-center text-base">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memverifikasi...
            </span>
          </button>
        </form>

        <div class="mt-16 text-xs text-gray-400 font-medium text-center">
          <p>© 2026 Instalasi Gizi Rumah Sakit v2.4</p>
          <p class="mt-1">Diberdayakan oleh Sistem Terpadu</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await authStore.login(username.value, password.value)

  if (result?.success) {
    router.push('/dashboard')
  } else {
    errorMessage.value = result?.message || 'Kredensial tidak diakui sistem. Silakan periksa kembali.'
  }

  loading.value = false
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.8s ease-out forwards;
  opacity: 0;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fade-in 1s ease-out forwards;
}
</style>
