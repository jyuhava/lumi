<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="body" class="text-[#739b1a]"></ion-icon> Status Gizi
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Penilaian status gizi berdasarkan BMI/IMT dan LILA standar rekam medis pasien.
        </p>
      </div>
      <div>
         <router-link
            to="/calculator/history?type=nutritional-status"
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
        <button 
          @click="selectedMethod = 'bmi'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'bmi' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="body-outline" class="text-lg"></ion-icon>
          BMI/IMT
        </button>
        <button 
          @click="selectedMethod = 'lila'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'lila' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="analytics-outline" class="text-lg"></ion-icon>
          LILA
        </button>
        <button 
          @click="selectedMethod = 'weight-estimation'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'weight-estimation' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="scale-outline" class="text-lg"></ion-icon>
          Estimasi BB
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

    <!-- References Section (Replacing Information Panel) -->
    <section class="mt-12 pt-8 border-t border-gray-200 mb-8 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h3 class="text-sm font-extrabold text-gray-800 mb-5 flex items-center gap-2">
         <ion-icon name="book-outline" class="text-[#4a6825] text-lg"></ion-icon> Daftar Pustaka & Informasi Klinis
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-medium">
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>BMI/IMT:</strong> Standar WHO dan Kementerian Kesehatan RI untuk penilaian status gizi umum pada dewasa.</span>
          </li>
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>LILA:</strong> Penapisan risiko KEK (Kekurangan Energi Kronis) dengan ambang batas klinis 23,5 cm.</span>
          </li>
        </ul>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Estimasi BB:</strong> Formula validasi pengganti ketika pengukuran berat badan presisi tidak memungkinkan.</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Rekam Medis: Data yang dimasukkan dapat disimpan ke dalam riwayat penilaian pasien untuk pemantauan berkala.</span>
          </li>
        </ul>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import BMICalculator from '@/components/calculators/BMICalculator.vue'
import LILACalculator from '@/components/calculators/LILACalculator.vue'
import WeightEstimationCalculator from '@/components/calculators/WeightEstimationCalculator.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'bmi': markRaw(BMICalculator),
  'lila': markRaw(LILACalculator),
  'weight-estimation': markRaw(WeightEstimationCalculator),
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
