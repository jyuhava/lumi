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
        <h2 class="text-2xl font-bold text-gray-900">Kebutuhan Nutrisi Anak</h2>
      </div>
      <p class="text-gray-600 ml-14">Perhitungan nutrisi untuk anak sehat dan sakit berdasarkan Permenkes RI 2019</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ion-icon name="happy" class="text-3xl text-white"></ion-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Child Nutrition Calculator</h3>
              <p class="text-sm text-pink-100">Pilih metode perhitungan kebutuhan nutrisi anak</p>
            </div>
          </div>
          <router-link
            to="/calculator/history?type=child_nutrition"
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
            Pilih Metode Perhitungan
          </label>
          <select
            v-model="selectedMethod"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all bg-white font-medium"
          >
            <option value="">-- Pilih Metode Perhitungan --</option>
            <optgroup label="Anak Sehat">
              <option value="akg-kemenkes">AKG Kemenkes 2019 (Standar Nasional)</option>
              <option value="quick-factor">Perhitungan Cepat (kkal/kg BB)</option>
              <option value="holliday-segar">Holliday-Segar Formula</option>
            </optgroup>
            <optgroup label="Anak Sakit">
              <option value="stress-factor">Kebutuhan dengan Stress Factor</option>
              <option value="disease-specific">Penyakit Spesifik (Pneumonia, Diare, dll)</option>
            </optgroup>
            <optgroup label="Skrining">
              <option value="nrs-2002">NRS 2002 - Skrining Risiko Malnutrisi</option>
            </optgroup>
          </select>
        </div>

        <!-- Calculator Component -->
        <div v-if="selectedMethod" class="border-t-2 border-gray-200 pt-6">
          <component :is="calculatorComponents[selectedMethod]" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="happy-outline" class="text-5xl text-pink-600"></ion-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Pilih Metode Perhitungan</h3>
          <p class="text-gray-500">Silakan pilih metode perhitungan dari dropdown di atas untuk memulai</p>
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
          <h4 class="font-bold text-blue-900 mb-2">Dasar Perhitungan</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• <strong>AKG Kemenkes 2019:</strong> Standar nasional berdasarkan Permenkes No. 28/2019</li>
            <li>• <strong>Holliday-Segar:</strong> Formula presisi untuk perhitungan di ICU/setting klinis</li>
            <li>• <strong>Stress Factor:</strong> Penyesuaian kebutuhan untuk kondisi sakit (pneumonia, diare, luka bakar)</li>
            <li>• <strong>NRS 2002:</strong> Skrining risiko malnutrisi dalam 24 jam masuk rumah sakit</li>
          </ul>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import AKGKemenkesChild from '@/components/calculators/child/AKGKemenkesChild.vue'
import QuickFactorChild from '@/components/calculators/child/QuickFactorChild.vue'
import HollidaySegarCalculator from '@/components/calculators/child/HollidaySegarCalculator.vue'
import StressFactorCalculator from '@/components/calculators/child/StressFactorCalculator.vue'
import DiseaseSpecificCalculator from '@/components/calculators/child/DiseaseSpecificCalculator.vue'
import NRS2002Calculator from '@/components/calculators/child/NRS2002Calculator.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'akg-kemenkes': markRaw(AKGKemenkesChild),
  'quick-factor': markRaw(QuickFactorChild),
  'holliday-segar': markRaw(HollidaySegarCalculator),
  'stress-factor': markRaw(StressFactorCalculator),
  'disease-specific': markRaw(DiseaseSpecificCalculator),
  'nrs-2002': markRaw(NRS2002Calculator),
}
</script>
