<template>
  <div class="flex h-screen bg-[#F5E6D3]">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-gradient-to-br from-[#5F9EA0] via-[#6FA8AA] to-[#7FB3B5] text-white transition-all duration-300 flex flex-col shadow-2xl',
        sidebarOpen ? 'w-72' : 'w-20'
      ]"
    >
      <!-- Logo -->
      <div class="p-5 flex items-center justify-between border-b border-white/20 bg-black/10">
        <div class="flex items-center space-x-3">
          <div class="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg ring-2 ring-white/30">
            <ion-icon name="cube" class="text-white text-2xl"></ion-icon>
          </div>
          <div v-if="sidebarOpen">
            <h1 class="font-bold text-lg tracking-wide text-white">Stok Opname</h1>
            <p class="text-xs text-white/80 font-medium">Rumah Sakit</p>
          </div>
        </div>
        <button 
          @click="sidebarOpen = !sidebarOpen"
          class="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-110"
        >
          <ion-icon 
            :name="sidebarOpen ? 'chevron-back-outline' : 'chevron-forward-outline'" 
            class="text-xl"
          ></ion-icon>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto scrollbar-hide">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center space-x-3 px-4 py-3.5 rounded-xl hover:bg-white/15 transition-all duration-200 group relative"
          :class="{ 'bg-white/25 shadow-lg ring-2 ring-white/30': $route.path === item.path }"
        >
          <ion-icon :name="item.icon" class="text-2xl flex-shrink-0"></ion-icon>
          <span v-if="sidebarOpen" class="font-semibold text-[15px] tracking-wide">{{ item.label }}</span>
          <div 
            v-if="!sidebarOpen" 
            class="absolute left-20 bg-[#5F9EA0] text-white px-4 py-2.5 rounded-xl text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-50"
          >
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- User Section -->
      <div class="p-5 border-t border-white/20 bg-black/10">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg ring-2 ring-white/30 flex-shrink-0">
            <ion-icon name="person" class="text-2xl"></ion-icon>
          </div>
          <div v-if="sidebarOpen" class="flex-1 min-w-0">
            <p class="font-bold text-base text-white truncate tracking-wide">{{ authStore.user?.name }}</p>
            <div class="flex items-center space-x-2 mt-0.5">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/25 text-white ring-1 ring-white/30">
                Admin
              </span>
              <span class="text-xs text-white/80 font-medium truncate">@{{ authStore.user?.username }}</span>
            </div>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header/Navbar -->
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
            <p class="text-sm text-gray-600">{{ pageSubtitle }}</p>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <button class="p-2 hover:bg-gray-100 rounded-lg transition relative">
              <ion-icon name="notifications-outline" class="text-2xl text-gray-600"></ion-icon>
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <!-- Logout -->
            <button 
              @click="handleLogout"
              class="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
            >
              <ion-icon name="log-out-outline" class="text-xl"></ion-icon>
              <span class="font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const sidebarOpen = ref(true)

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'grid-outline' },
  { path: '/categories', label: 'Kategori', icon: 'pricetags-outline' },
  { path: '/products', label: 'Produk', icon: 'cube-outline' },
  { path: '/suppliers', label: 'Supplier', icon: 'people-outline' },
  { path: '/employees', label: 'Karyawan', icon: 'person-outline' },
  { path: '/shifts', label: 'Shift', icon: 'time-outline' },
  { path: '/scheduler', label: 'Jadwal', icon: 'calendar-outline' },
  { path: '/stock-opname', label: 'Stok Opname', icon: 'clipboard-outline' },
  { path: '/reports', label: 'Laporan', icon: 'bar-chart-outline' },
  { path: '/settings', label: 'Pengaturan', icon: 'settings-outline' },
]

const pageTitle = computed(() => {
  const item = menuItems.find(m => m.path === route.path)
  return item?.label || 'Dashboard'
})

const pageSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    '/dashboard': 'Ringkasan sistem stok opname',
    '/categories': 'Kelola kategori produk',
    '/products': 'Kelola data produk',
    '/suppliers': 'Kelola data supplier',
    '/employees': 'Kelola data karyawan',
    '/shifts': 'Kelola shift kerja',
    '/scheduler': 'Kelola jadwal karyawan bulanan',
    '/stock-opname': 'Pencatatan stok opname',
    '/reports': 'Laporan dan analisis',
    '/settings': 'Pengaturan sistem',
  }
  return subtitles[route.path] || ''
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
