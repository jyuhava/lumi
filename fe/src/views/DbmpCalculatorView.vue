<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="restaurant" class="text-[#739b1a]"></ion-icon> Kalkulator DBMP
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Daftar Bahan Makanan Penukar Interaktif.
        </p>
      </div>
      <div>
         <router-link
            to="/calculator/history?type=dbmp"
            class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-[#739b1a] hover:border-[#739b1a] transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            <ion-icon name="time-outline" class="text-lg"></ion-icon>
            Riwayat
          </router-link>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
      <!-- Sidebar / Tabs -->
      <div class="md:col-span-1 space-y-2">
        <h3 class="text-lg font-bold text-[#16200B] mb-4 flex items-center gap-2 px-2">
          <ion-icon name="list-outline" class="text-[#4a6825] text-xl"></ion-icon> Menu Utama
        </h3>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Fitur</p>
        <button 
          @click="activeMethod = 'exchange'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            activeMethod === 'exchange' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="swap-horizontal-outline" class="text-lg"></ion-icon>
          Tukar Makanan
        </button>
        <button 
          @click="activeMethod = 'database'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            activeMethod === 'database' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="list-outline" class="text-lg"></ion-icon>
          Daftar Lengkap
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Eksplorasi</p>
        <button 
          @click="activeMethod = 'api'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            activeMethod === 'api' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="calculator-outline" class="text-lg"></ion-icon>
          Cek Nutrisi Bebas
        </button>
      </div>

      <!-- Main Content / Calculator Component -->
      <div class="md:col-span-3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-[#16200B] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <ion-icon name="restaurant" class="text-[#4a6825] text-xl"></ion-icon> Modul DBMP
        </h3>
        
        <div class="space-y-5">
          <!-- DBMP Core Components wrapped dynamically or passed state -->
          <div class="animate-fade-in-up">
            <DbmpCalculator :activeTab="activeMethod" @update:activeTab="(v: string) => activeMethod = v" />
          </div>
        </div>
      </div>
    </div>

    <!-- References Section -->
    <section class="mt-12 pt-8 border-t border-gray-200 mb-8 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h3 class="text-sm font-extrabold text-gray-800 mb-5 flex items-center gap-2">
         <ion-icon name="book-outline" class="text-[#4a6825] text-lg"></ion-icon> Daftar Pustaka & Informasi Klinis
      </h3>
      <div class="grid grid-cols-1 gap-6 text-xs text-gray-500 font-medium">
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Daftar Bahan Makanan Penukar:</strong> Berdasarkan Pedoman Gizi terkini Kemenkes RI untuk penukaran kelompok karbohidrat, protein, dan buah.</span>
          </li>
        </ul>
      </div>
    </section>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import DbmpCalculator from '@/components/DbmpCalculator.vue'

const activeMethod = ref('exchange')
</script>

<style scoped>
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
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
</style>
