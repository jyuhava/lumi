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
        <h2 class="text-2xl font-bold text-gray-900">Berat Badan Ideal (IBW)</h2>
      </div>
      <p class="text-gray-600 ml-14">Perhitungan Ideal Body Weight untuk dewasa dan anak</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ion-icon name="scale" class="text-3xl text-white"></ion-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">IBW Calculator</h3>
              <p class="text-sm text-amber-100">Pilih metode perhitungan berat badan ideal</p>
            </div>
          </div>
          <router-link
            to="/calculator/history?type=ibw"
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
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all bg-white font-medium"
          >
            <option value="">-- Pilih Metode Perhitungan --</option>
            <optgroup label="Dewasa">
              <option value="devine">Devine Formula (Gold Standard)</option>
              <option value="broca">Broca Formula (Kemenkes RI)</option>
              <option value="hamwi">Hamwi Formula</option>
              <option value="robinson">Robinson Formula</option>
              <option value="miller">Miller Formula</option>
            </optgroup>
            <optgroup label="Anak & Remaja">
              <option value="child-age">Berdasarkan Usia (1-14 tahun)</option>
              <option value="child-height">Berdasarkan Tinggi Badan</option>
            </optgroup>
            <optgroup label="Lainnya">
              <option value="percent-ibw">%IBW (Persentase IBW)</option>
              <option value="adjusted-ibw">Adjusted IBW (untuk Obesitas)</option>
            </optgroup>
          </select>
        </div>

        <!-- Calculator Component -->
        <div v-if="selectedMethod" class="border-t-2 border-gray-200 pt-6">
          <component :is="calculatorComponents[selectedMethod]" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="scale-outline" class="text-5xl text-amber-600"></ion-icon>
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
          <h4 class="font-bold text-blue-900 mb-2">Informasi Penting</h4>
          <ul class="text-sm text-blue-800 space-y-1">
            <li>• <strong>Devine:</strong> Standar internasional, paling banyak digunakan dalam farmasi dan nutrisi klinik</li>
            <li>• <strong>Broca:</strong> Direkomendasikan oleh Kemenkes RI, praktis untuk populasi Indonesia</li>
            <li>• <strong>%IBW:</strong> Untuk evaluasi status gizi terhadap berat badan ideal</li>
            <li>• <strong>Adjusted IBW:</strong> Khusus untuk pasien obesitas (BMI ≥30) dalam perhitungan dosis obat</li>
          </ul>
        </div>
      </div>
    </div>
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
