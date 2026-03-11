<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="water" class="text-[#739b1a]"></ion-icon> Fluid Calculator
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Perhitungan kebutuhan cairan maintenance dan resusitasi luka bakar.
        </p>
      </div>
      <div>
         <router-link
            to="/calculator/history?type=fluid"
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

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Cairan Rumatan</p>
        <button 
          @click="selectedMethod = 'holliday-segar'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'holliday-segar' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="medical-outline" class="text-lg"></ion-icon>
          Holliday-Segar
        </button>
        <button 
          @click="selectedMethod = 'quick-ml-kg'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'quick-ml-kg' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="flash-outline" class="text-lg"></ion-icon>
          Perhitungan Cepat
        </button>
        <button 
          @click="selectedMethod = 'idai-age'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'idai-age' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="calendar-outline" class="text-lg"></ion-icon>
          Berdasarkan Usia
        </button>
        <button 
          @click="selectedMethod = 'adult-maintenance'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'adult-maintenance' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="body-outline" class="text-lg"></ion-icon>
          Maintenance Dewasa
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Koreksi Sakit</p>
        <button 
          @click="selectedMethod = 'fever-correction'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'fever-correction' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="thermometer-outline" class="text-lg"></ion-icon>
          Koreksi Demam
        </button>
        <button 
          @click="selectedMethod = 'sick-correction'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'sick-correction' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="pulse-outline" class="text-lg"></ion-icon>
          Koreksi Anak Sakit
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Luka Bakar</p>
        <button 
          @click="selectedMethod = 'parkland'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'parkland' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="flame-outline" class="text-lg"></ion-icon>
          Parkland Formula
        </button>
        <button 
          @click="selectedMethod = 'modified-brooke'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'modified-brooke' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="water-outline" class="text-lg"></ion-icon>
          Modified Brooke
        </button>
        <button 
          @click="selectedMethod = 'cincinnati'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'cincinnati' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="medkit-outline" class="text-lg"></ion-icon>
          Cincinnati (Anak)
        </button>
        <button 
          @click="selectedMethod = 'galveston'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'galveston' 
              ? 'bg-[#739b1a]/10 text-[#739b1a] border-[#739b1a]' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="analytics-outline" class="text-lg"></ion-icon>
          Galveston (Anak)
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
            <span><strong>Holliday-Segar:</strong> Standar emas maintenance fluid untuk anak sejak 1957.</span>
          </li>
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span><strong>Target Urine Output:</strong> 0.5-1 mL/kg/jam (anak), 0.5 mL/kg/jam (dewasa).</span>
          </li>
        </ul>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
             <span><strong>Parkland Formula:</strong> Gold standard resusitasi luka bakar (4 mL/kg/%TBSA).</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
             <span><strong>Modified Brooke:</strong> Alternatif konservatif untuk mengurangi over-resuscitation (2 mL/kg/%TBSA).</span>
          </li>
        </ul>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import HollidaySegarFluid from '@/components/calculators/fluid/HollidaySegarFluid.vue'
import QuickMLKGFluid from '@/components/calculators/fluid/QuickMLKGFluid.vue'
import IDAIAgeFluid from '@/components/calculators/fluid/IDAIAgeFluid.vue'
import AdultMaintenanceFluid from '@/components/calculators/fluid/AdultMaintenanceFluid.vue'
import FeverCorrectionFluid from '@/components/calculators/fluid/FeverCorrectionFluid.vue'
import SickCorrectionFluid from '@/components/calculators/fluid/SickCorrectionFluid.vue'
import ParklandFormula from '@/components/calculators/fluid/ParklandFormula.vue'
import ModifiedBrookeFormula from '@/components/calculators/fluid/ModifiedBrookeFormula.vue'
import CincinnatiFormula from '@/components/calculators/fluid/CincinnatiFormula.vue'
import GalvestonFormula from '@/components/calculators/fluid/GalvestonFormula.vue'

const selectedMethod = ref('')

const tabMethods = [
  { id: 'holliday-segar', label: 'Holliday-Segar (Standar Emas)', group: 'rumatan' },
  { id: 'quick-ml-kg', label: 'Perhitungan Cepat (mL/kg)', group: 'rumatan' },
  { id: 'idai-age', label: 'Berdasarkan Usia (IDAI)', group: 'rumatan' },
  { id: 'adult-maintenance', label: 'Maintenance Dewasa', group: 'rumatan' },
  
  { id: 'fever-correction', label: 'Koreksi Demam', group: 'sakit' },
  { id: 'sick-correction', label: 'Koreksi Anak Sakit', group: 'sakit' },
  
  { id: 'parkland', label: 'Parkland Formula', group: 'bakar' },
  { id: 'modified-brooke', label: 'Modified Brooke', group: 'bakar' },
  { id: 'cincinnati', label: 'Cincinnati (Anak)', group: 'bakar' },
  { id: 'galveston', label: 'Galveston (Anak)', group: 'bakar' },
]

const calculatorComponents: Record<string, any> = {
  'holliday-segar': markRaw(HollidaySegarFluid),
  'quick-ml-kg': markRaw(QuickMLKGFluid),
  'idai-age': markRaw(IDAIAgeFluid),
  'adult-maintenance': markRaw(AdultMaintenanceFluid),
  'fever-correction': markRaw(FeverCorrectionFluid),
  'sick-correction': markRaw(SickCorrectionFluid),
  'parkland': markRaw(ParklandFormula),
  'modified-brooke': markRaw(ModifiedBrookeFormula),
  'cincinnati': markRaw(CincinnatiFormula),
  'galveston': markRaw(GalvestonFormula),
}
</script>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
