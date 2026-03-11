<template>
  <header class="bg-white/90 backdrop-blur-md h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm sticky top-0 z-10 transition-all duration-300">
    <!-- Left Section: Toggle & Title -->
    <div class="flex items-center gap-4 sm:gap-6">
      <button 
        @click="$emit('toggle-sidebar')"
        class="p-2 text-gray-500 hover:text-[#4a6825] hover:bg-[#f8faf6] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#bcdd5a] flex items-center justify-center"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
        </svg>
      </button>

      <!-- Global Search (Mock) -->
      <div class="hidden md:flex items-center relative group">
        <ion-icon name="search-outline" class="absolute left-3 text-gray-400 group-focus-within:text-[#739b1a] transition-colors"></ion-icon>
        <input 
          type="text" 
          placeholder="Pencarian cepat..." 
          class="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-[#739b1a] focus:ring-1 focus:ring-[#739b1a] bg-gray-50 focus:bg-white transition-all duration-300 placeholder-gray-400"
        />
        <div class="absolute right-3 hidden group-focus-within:hidden lg:flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-sans font-semibold text-gray-400 bg-white border border-gray-200 rounded">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-sans font-semibold text-gray-400 bg-white border border-gray-200 rounded">K</kbd>
        </div>
      </div>
    </div>
    
    <!-- Right Section: Actions & Profile -->
    <div class="flex items-center space-x-3 sm:space-x-4">
      <!-- Notifications -->
      <button class="relative p-2 text-gray-500 hover:text-[#4a6825] hover:bg-[#f8faf6] transition-colors focus:outline-none rounded-full">
        <ion-icon name="notifications-outline" class="text-xl"></ion-icon>
        <span class="absolute top-1 right-1 flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#bcdd5a] opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#739b1a] border-2 border-white"></span>
        </span>
      </button>

      <div class="h-6 w-px bg-gray-200"></div>

      <!-- User Profile Dropdown Profile Trigger -->
      <div class="flex items-center gap-3 pl-1">
        <div class="hidden sm:flex flex-col items-end">
          <span class="text-sm font-semibold text-gray-800 leading-tight">{{ user?.name || 'User' }}</span>
          <span class="text-xs font-medium text-gray-500">Administrator</span>
        </div>
        
        <div class="relative group">
          <button class="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
            <div class="w-9 h-9 bg-gradient-to-br from-[#739b1a] to-[#4a6825] rounded-full flex items-center justify-center shadow-inner text-white font-bold text-sm ring-2 ring-white">
              {{ user?.name?.charAt(0) || 'A' }}
            </div>
            <ion-icon name="chevron-down-outline" class="text-gray-400 text-sm hidden sm:block"></ion-icon>
          </button>
          
          <!-- Dropdown Wrapper with Safe Hover Bridge (pt-2) -->
          <div class="absolute right-0 top-full w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pt-3">
            <!-- Dropdown Content -->
            <div class="bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 py-1 origin-top-right transform scale-95 group-hover:scale-100 transition-all duration-200">
              <div class="px-4 py-3 border-b border-gray-50 sm:hidden">
                <p class="text-sm font-semibold text-gray-800">{{ user?.name || 'User' }}</p>
                <p class="text-xs text-gray-500">Administrator</p>
              </div>
              <router-link to="/settings" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-[#4a6825] hover:bg-[#f8faf6] transition-colors">
                <ion-icon name="settings-outline"></ion-icon> Konfigurasi
              </router-link>
              <div class="border-t border-gray-100 my-1"></div>
              <button @click="$emit('logout')" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left font-medium">
                <ion-icon name="log-out-outline"></ion-icon> Keluar Sesi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'

defineEmits(['toggle-sidebar', 'logout'])

const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
