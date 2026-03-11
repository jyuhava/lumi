<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="scale" class="text-[#739b1a]"></ion-icon> Berat Badan Ideal (IBW)
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Perhitungan Ideal Body Weight untuk dewasa dan anak berdasarkan standar medis.
        </p>
      </div>
      <div>
         <router-link
            to="/calculator/history?type=ibw"
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
          <ion-icon name="list-outline" class="text-[#4a6825] text-xl"></ion-icon> Metode
        </h3>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Dewasa</p>
        <button 
          @click="selectedMethod = 'devine'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'devine' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="medical-outline" class="text-lg"></ion-icon>
          Devine Formula
        </button>
        <button 
          @click="selectedMethod = 'broca'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'broca' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="body-outline" class="text-lg"></ion-icon>
          Broca Formula
        </button>
        <button 
          @click="selectedMethod = 'hamwi'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'hamwi' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="analytics-outline" class="text-lg"></ion-icon>
          Hamwi Formula
        </button>
        <button 
          @click="selectedMethod = 'robinson'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'robinson' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="fitness-outline" class="text-lg"></ion-icon>
          Robinson Formula
        </button>
        <button 
          @click="selectedMethod = 'miller'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'miller' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="git-network-outline" class="text-lg"></ion-icon>
          Miller Formula
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Anak & Remaja</p>
        <button 
          @click="selectedMethod = 'child-age'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'child-age' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="happy-outline" class="text-lg"></ion-icon>
          Anak Usia (1-14 thn)
        </button>
        <button 
          @click="selectedMethod = 'child-height'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'child-height' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="resize-outline" class="text-lg"></ion-icon>
          Anak Tinggi Badan
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Lainnya</p>
        <button 
          @click="selectedMethod = 'percent-ibw'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'percent-ibw' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="pie-chart-outline" class="text-lg"></ion-icon>
          %IBW
        </button>
        <button 
          @click="selectedMethod = 'adjusted-ibw'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'adjusted-ibw' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="options-outline" class="text-lg"></ion-icon>
          Adjusted IBW
        </button>
      </div>

      <!-- Main Content / Calculator Component -->
      <div class="md:col-span-3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-[#16200B] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <ion-icon name="calculator" class="text-[#4a6825] text-xl"></ion-icon> Parameter Klinis Pasien
        </h3>
        
        <div class="space-y-5">
          <!-- Calculator Component -->
          <div v-if="selectedMethod" class="animate-fade-in-up">
            <component :is="calculatorComponents[selectedMethod]" />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-100 animate-fade-in-up flex flex-col items-center">
             <div class="w-16 h-16 bg-white shadow-sm border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-[#739b1a]">
               <ion-icon name="medical-outline" class="text-3xl"></ion-icon>
             </div>
             <p class="text-sm font-bold text-gray-600">Pilih Metode Penilaian</p>
             <p class="text-xs text-gray-400 mt-1 max-w-xs">Silakan pilih metode penilaian dari menu di samping untuk memulai kalkulasi klinis.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- References Section -->
    <section class="mt-12 pt-8 border-t border-gray-200 mb-8 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h3 class="text-sm font-extrabold text-gray-800 mb-5 flex items-center gap-2">
         <ion-icon name="book-outline" class="text-[#4a6825] text-lg"></ion-icon> Daftar Pustaka & Informasi Klinis
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-medium">
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Devine:</strong> Standar internasional, paling banyak digunakan dalam farmasi dan nutrisi klinik.</span>
          </li>
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Broca:</strong> Direkomendasikan oleh Kemenkes RI, praktis untuk populasi Indonesia.</span>
          </li>
        </ul>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>%IBW:</strong> Untuk evaluasi status gizi terhadap berat badan ideal secara pesentase.</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Adjusted IBW:</strong> Khusus untuk pasien obesitas (BMI ≥30) dalam perhitungan dosis obat.</span>
          </li>
        </ul>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import DevineCalculator from '@/components/calculators/ibw/DevineCalculator.vue'
import BrocaIBWCalculator from '@/components/calculators/ibw/BrocaIBWCalculator.vue'
import HamwiCalculator from '@/components/calculators/ibw/HamwiCalculator.vue'
import RobinsonCalculator from '@/components/calculators/ibw/RobinsonCalculator.vue'
import MillerCalculator from '@/components/calculators/ibw/MillerCalculator.vue'
import ChildAgeCalculator from '@/components/calculators/ibw/ChildAgeCalculator.vue'
import ChildHeightCalculator from '@/components/calculators/ibw/ChildHeightCalculator.vue'
import PercentIBWCalculator from '@/components/calculators/ibw/PercentIBWCalculator.vue'
import AdjustedIBWCalculator from '@/components/calculators/ibw/AdjustedIBWCalculator.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'devine': markRaw(DevineCalculator),
  'broca': markRaw(BrocaIBWCalculator),
  'hamwi': markRaw(HamwiCalculator),
  'robinson': markRaw(RobinsonCalculator),
  'miller': markRaw(MillerCalculator),
  'child-age': markRaw(ChildAgeCalculator),
  'child-height': markRaw(ChildHeightCalculator),
  'percent-ibw': markRaw(PercentIBWCalculator),
  'adjusted-ibw': markRaw(AdjustedIBWCalculator),
}
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
