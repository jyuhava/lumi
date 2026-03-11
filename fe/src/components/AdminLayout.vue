<template>
  <div class="flex h-screen bg-[#f4f6f8] font-sans text-gray-800 overflow-hidden">
    <!-- Component: Premium Sidebar -->
    <Sidebar :isOpen="sidebarOpen" @close-sidebar="sidebarOpen = false" />

    <!-- Main Viewport -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden relative">
      <!-- Component: Premium Navbar -->
      <Navbar 
        @toggle-sidebar="sidebarOpen = !sidebarOpen" 
        @logout="handleLogout"
      />

      <!-- Page Content Area -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative scrollbar-hide">
        <!-- Page Title & Subtitle Banner (Optional standard inclusion) -->
        <div class="mb-6 animate-fade-in-up" v-if="pageTitle">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">{{ pageTitle }}</h2>
          <p class="text-sm text-gray-500 mt-1" v-if="pageSubtitle">{{ pageSubtitle }}</p>
        </div>

        <div class="relative z-10 mx-auto w-full animate-fade-in-up" style="animation-delay: 0.1s;">
           <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Sidebar from './Sidebar.vue'
import Navbar from './Navbar.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Automatically close sidebar on mobile, open on desktop
const sidebarOpen = ref(window.innerWidth >= 768)

// Close sidebar on mobile when navigating
import { watch } from 'vue'
watch(() => route.path, () => {
  if (window.innerWidth < 768) {
    sidebarOpen.value = false
  }
})

// Helper properties for page context
const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/categories': 'Kategori Produk',
    '/products': 'Indeks Produk',
    '/suppliers': 'Mitra Pengadaan',
    '/employees': 'Tenaga Gizi',
    '/shifts': 'Manajemen Shift',
    '/scheduler': 'Penjadwalan Otomatis',
    '/leave-requests': 'Pengajuan Cuti',
    '/stock-opname': 'Evaluasi Stok (Opname)',
    '/calculator/history': 'Riwayat Skrining',
    '/reports': 'Laporan Komprehensif',
    '/settings': 'Konfigurasi Sistem',
  }
  return titles[route.path] || ''
})

const pageSubtitle = computed(() => {
  const subtitles: Record<string, string> = {
    '/categories': 'Klasifikasi bahan makanan dan alat medis.',
    '/products': 'Master data persediaan dan manajemen SKU.',
    '/suppliers': 'Direktori pemasok dan rekanan pengadaan bahan.',
    '/employees': 'Data personalia, profil, dan kualifikasi.',
    '/shifts': 'Pengaturan master jam kerja operasional.',
    '/scheduler': 'Pembuatan jadwal rotasi dinas secara otomatis.',
    '/leave-requests': 'Persetujuan dan pencatatan ketidakhadiran.',
    '/stock-opname': 'Pencatatan persediaan fisik aktual vs sistem.',
    '/calculator/nutrition': 'Estimasi kebutuhan makro/mikro pasien.',
    '/reports': 'Ekstraksi dokumen, PDF, dan statistik bulanan.',
    '/settings': 'Parameter fundamental dan preferensi aplikasi.',
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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
</style>
