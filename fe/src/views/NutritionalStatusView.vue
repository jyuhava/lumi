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
        <h2 class="text-2xl font-bold text-gray-900">Status Gizi</h2>
      </div>
      <p class="text-gray-600 ml-14">Penilaian status gizi berdasarkan BMI/IMT dan LILA</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ion-icon name="body" class="text-3xl text-white"></ion-icon>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Nutritional Status Calculator</h3>
            <p class="text-sm text-purple-100">Pilih metode penilaian status gizi</p>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="p-6">
        <!-- Action Buttons -->
        <div class="flex justify-between items-center mb-6">
          <div class="flex-1">
            <label class="block text-sm font-bold text-gray-700 mb-3">
              <ion-icon name="list-outline" class="align-middle mr-1"></ion-icon>
              Pilih Metode Penilaian
            </label>
          </div>
          <router-link
            to="/calculator/history?type=nutritional-status"
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <ion-icon name="time-outline" class="text-lg"></ion-icon>
            <span>Lihat Riwayat</span>
          </router-link>
        </div>

        <!-- Method Selection -->
        <div class="mb-6">
          <select
            v-model="selectedMethod"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all bg-white font-medium"
          >
            <option value="">-- Pilih Metode Penilaian --</option>
            <option value="bmi">BMI/IMT (Body Mass Index)</option>
            <option value="lila">LILA (Lingkar Lengan Atas)</option>
            <option value="weight-estimation">Estimasi Berat Badan dari LILA</option>
          </select>
        </div>

        <!-- Calculator Component -->
        <div v-if="selectedMethod" class="border-t-2 border-gray-200 pt-6">
          <component :is="calculatorComponents[selectedMethod]" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="body-outline" class="text-5xl text-purple-600"></ion-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Pilih Metode Penilaian</h3>
          <p class="text-gray-500">Silakan pilih metode penilaian status gizi dari dropdown di atas</p>
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
            <li>• <strong>BMI/IMT:</strong> Standar WHO dan Kemenkes RI untuk penilaian status gizi umum</li>
            <li>• <strong>LILA:</strong> Deteksi risiko KEK (Kekurangan Energi Kronis) terutama untuk WUS dan ibu hamil</li>
            <li>• <strong>Estimasi BB:</strong> Berguna ketika pengukuran berat badan langsung tidak memungkinkan</li>
          </ul>
        </div>
      </div>
    </div>
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
