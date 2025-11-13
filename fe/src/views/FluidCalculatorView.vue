<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-2">
        <router-link 
          to="/calculator"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ion-icon name="arrow-back" class="text-2xl text-gray-600"></ion-icon>
        </router-link>
        <h2 class="text-2xl font-bold text-gray-900">Fluid Calculator</h2>
      </div>
      <p class="text-gray-600 ml-14">Perhitungan kebutuhan cairan maintenance dan resusitasi luka bakar</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ion-icon name="water" class="text-3xl text-white"></ion-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Fluid Calculator</h3>
              <p class="text-sm text-cyan-100">Pilih jenis perhitungan kebutuhan cairan</p>
            </div>
          </div>
          <router-link
            to="/calculator/history?type=fluid"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-semibold rounded-lg transition-all flex items-center space-x-2"
          >
            <ion-icon name="time-outline" class="text-lg"></ion-icon>
            <span>Riwayat</span>
          </router-link>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6">
        <!-- Method Selection -->
        <div class="mb-6">
          <label class="block text-sm font-bold text-gray-700 mb-3">
            <ion-icon name="list-outline" class="align-middle mr-1"></ion-icon>
            Pilih Jenis Perhitungan
          </label>
          <select
            v-model="selectedMethod"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white font-medium"
          >
            <option value="">-- Pilih Jenis Perhitungan --</option>
            <optgroup label="Maintenance Fluid (Cairan Rumatan)">
              <option value="holliday-segar">Holliday-Segar (Standar Emas)</option>
              <option value="quick-ml-kg">Perhitungan Cepat (mL/kg)</option>
              <option value="idai-age">Berdasarkan Usia (IDAI)</option>
              <option value="adult-maintenance">Maintenance Dewasa</option>
            </optgroup>
            <optgroup label="Koreksi Kondisi Sakit">
              <option value="fever-correction">Koreksi Demam</option>
              <option value="sick-correction">Koreksi Anak Sakit (Diare, Muntah, dll)</option>
            </optgroup>
            <optgroup label="Burn Resuscitation (Luka Bakar)">
              <option value="parkland">Parkland Formula (Gold Standard)</option>
              <option value="modified-brooke">Modified Brooke Formula</option>
              <option value="cincinnati">Cincinnati Formula (Anak)</option>
              <option value="galveston">Galveston Formula (Anak)</option>
            </optgroup>
          </select>
        </div>

        <!-- Calculator Component -->
        <div v-if="selectedMethod" class="border-t-2 border-gray-200 pt-6">
          <component :is="calculatorComponents[selectedMethod]" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="water-outline" class="text-5xl text-cyan-600"></ion-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Pilih Jenis Perhitungan</h3>
          <p class="text-gray-500">Silakan pilih jenis perhitungan dari dropdown di atas untuk memulai</p>
        </div>
      </div>
    </div>

    <!-- Information Panel -->
    <div class="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl p-6">
      <div class="flex items-start space-x-3">
        <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <ion-icon name="information" class="text-2xl text-white"></ion-icon>
        </div>
        <div>
          <h4 class="font-bold text-blue-900 mb-2">Dasar Perhitungan Cairan</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• <strong>Holliday-Segar:</strong> Standar emas maintenance fluid untuk anak sejak 1957</li>
            <li>• <strong>Parkland Formula:</strong> Gold standard resusitasi luka bakar (4 mL/kg/%TBSA)</li>
            <li>• <strong>Modified Brooke:</strong> Alternatif konservatif untuk mengurangi over-resuscitation (2 mL/kg/%TBSA)</li>
            <li>• <strong>Target Urine Output:</strong> 0.5-1 mL/kg/jam (anak), 0.5 mL/kg/jam (dewasa)</li>
          </ul>
        </div>
      </div>
    </div>
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
