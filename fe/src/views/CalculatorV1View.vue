<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-[#4a6825] flex items-center gap-2">
            <ion-icon name="calculator"></ion-icon>
            Kalkulator Klinis (v1)
          </h2>
          <p class="text-gray-500 text-sm mt-1">Kumpulan kalkulator skrining dan perhitungan gizi terpadu.</p>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Tabs -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Daftar Kalkulator</h3>
            </div>
            <div class="p-2 space-y-1 h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
              <button
                v-for="calc in calculators"
                :key="calc.id"
                @click="activeTab = calc.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3',
                  activeTab === calc.id 
                    ? 'bg-[#739b1a] text-white shadow-md shadow-[#739b1a]/20' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                ]"
              >
                <span class="flex items-center text-xl transition-colors" :class="activeTab === calc.id ? 'text-white' : 'text-gray-400'"><ion-icon :name="calc.icon"></ion-icon></span>
                {{ calc.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] overflow-hidden">
          <Transition mode="out-in" name="fade">
            <component :is="activeComponent" :key="activeTab" />
          </Transition>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

import AmputasiCalculator from '@/components/calculators-v1/AmputasiCalculator.vue'
import BBKCalculator from '@/components/calculators-v1/BBKCalculator.vue'
import BumilBusuiCalculator from '@/components/calculators-v1/BumilBusuiCalculator.vue'
import CarboCountingCalculator from '@/components/calculators-v1/CarboCountingCalculator.vue'
import EstimasiAntropometri from '@/components/calculators-v1/EstimasiAntropometri.vue'
import FungsiGinjal from '@/components/calculators-v1/FungsiGinjal.vue'
import GCSCalculator from '@/components/calculators-v1/GCSCalculator.vue'
import GiziAnakCalculator from '@/components/calculators-v1/GiziAnakCalculator.vue'
import GiziKlinisCalculator from '@/components/calculators-v1/GiziKlinisCalculator.vue'
import LabGiziCalculator from '@/components/calculators-v1/LabGiziCalculator.vue'
import PenurunanBBCalculator from '@/components/calculators-v1/PenurunanBBCalculator.vue'
import PreskripsiDietCalculator from '@/components/calculators-v1/PreskripsiDietCalculator.vue'
import StatusGizi from '@/components/calculators-v1/StatusGizi.vue'
import TinggiLututCalculator from '@/components/calculators-v1/TinggiLututCalculator.vue'
import ZScoreCalculator from '@/components/calculators-v1/ZScoreCalculator.vue'

const calculators = [
  { id: 'amputasicalculator', label: 'Koreksi Amputasi', icon: 'calculator-outline', component: AmputasiCalculator }, 
  { id: 'bbkcalculator', label: 'Berat Badan Koreksi', icon: 'calculator-outline', component: BBKCalculator }, 
  { id: 'bumilbusuicalculator', label: 'Gizi Ibu Hamil & Menyusui', icon: 'calculator-outline', component: BumilBusuiCalculator }, 
  { id: 'carbocountingcalculator', label: 'Carbo Counting', icon: 'calculator-outline', component: CarboCountingCalculator }, 
  { id: 'estimasiantropometri', label: 'Estimasi Antropometri', icon: 'calculator-outline', component: EstimasiAntropometri }, 
  { id: 'fungsiginjal', label: 'Fungsi Ginjal (eGFR)', icon: 'calculator-outline', component: FungsiGinjal }, 
  { id: 'gcscalculator', label: 'GCS', icon: 'calculator-outline', component: GCSCalculator }, 
  { id: 'gizianakcalculator', label: 'Gizi Anak', icon: 'calculator-outline', component: GiziAnakCalculator }, 
  { id: 'gizikliniscalculator', label: 'Kalkulator Gizi Klinis', icon: 'calculator-outline', component: GiziKlinisCalculator }, 
  { id: 'labgizicalculator', label: 'Lab & Gizi', icon: 'calculator-outline', component: LabGiziCalculator }, 
  { id: 'penurunanbbcalculator', label: 'Penurunan Berat Badan', icon: 'calculator-outline', component: PenurunanBBCalculator }, 
  { id: 'preskripsidietcalculator', label: 'Preskripsi Diet', icon: 'calculator-outline', component: PreskripsiDietCalculator }, 
  { id: 'statusgizi', label: 'Status Gizi', icon: 'calculator-outline', component: StatusGizi }, 
  { id: 'tinggilututcalculator', label: 'Tinggi Lutut', icon: 'calculator-outline', component: TinggiLututCalculator }, 
  { id: 'zscorecalculator', label: 'Z-Score (WHO)', icon: 'calculator-outline', component: ZScoreCalculator }, 
]

const activeTab = ref(calculators[0]?.id || '')

const activeComponent = computed(() => {
  const calc = calculators.find(c => c.id === activeTab.value)
  return calc ? calc.component : null
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 20px;
}
</style>
