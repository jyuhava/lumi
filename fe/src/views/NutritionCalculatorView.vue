<template>
  <AdminLayout>
    <!-- Breadcrumb -->
    <div class="mb-4">
      <nav class="flex items-center space-x-2 text-sm">
        <router-link to="/calculator" class="text-indigo-600 hover:text-indigo-800 font-medium">
          Kalkulator
        </router-link>
        <ion-icon name="chevron-forward" class="text-gray-400"></ion-icon>
        <span class="text-gray-600">Kebutuhan Gizi</span>
      </nav>
    </div>

    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Kalkulator Kebutuhan Gizi</h2>
      <p class="text-gray-600">Hitung kebutuhan kalori dan nutrisi berdasarkan berbagai metode perhitungan</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-emerald-600 to-green-600 px-6 py-4">
        <div class="flex items-center space-x-3">
          <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <ion-icon name="calculator" class="text-3xl text-white"></ion-icon>
          </div>
          <div>
            <h3 class="text-xl font-bold text-white">Perhitungan Kebutuhan Gizi</h3>
            <p class="text-sm text-emerald-100">Pilih metode perhitungan dan masukkan data pasien</p>
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
              Pilih Metode Perhitungan
            </label>
          </div>
          <router-link
            to="/calculator/history?type=nutrition"
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
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white font-medium"
          >
            <option value="">-- Pilih Metode Perhitungan --</option>
            <optgroup label="🟢 Orang Sehat">
              <option value="harris-benedict">Harris-Benedict (Klasik)</option>
              <option value="mifflin-st-jeor">Mifflin-St Jeor (Modern)</option>
              <option value="broca">Broca (Praktis)</option>
              <option value="filipinos">Filipinos</option>
              <option value="kemenkes">Kemenkes RI (Permenkes 28/2019)</option>
            </optgroup>
            <optgroup label="🔴 Orang Sakit">
              <option value="diabetes">Diabetes Mellitus (PERKENI)</option>
              <option value="cancer">Pasien Kanker</option>
              <option value="burn">Luka Bakar (Curreri)</option>
              <option value="sepsis">Penyakit Kritis/Sepsis (MUST)</option>
              <option value="nelson">Anak (Nelson)</option>
              <option value="neonatal">Neonatus (0-28 hari)</option>
            </optgroup>
          </select>
        </div>

        <!-- Calculator Component -->
        <div v-if="selectedMethod" class="border-t-2 border-gray-200 pt-6">
          <component :is="calculatorComponents[selectedMethod]" />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ion-icon name="calculator-outline" class="text-5xl text-emerald-600"></ion-icon>
          </div>
          <h3 class="text-lg font-bold text-gray-700 mb-2">Pilih Metode Perhitungan</h3>
          <p class="text-gray-500">Silakan pilih metode perhitungan dari dropdown di atas untuk memulai</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import HarrisBenedictCalculator from '@/components/calculators/HarrisBenedictCalculator.vue'
import MifflinStJeorCalculator from '@/components/calculators/MifflinStJeorCalculator.vue'
import BrocaCalculator from '@/components/calculators/BrocaCalculator.vue'
import FilipinosCalculator from '@/components/calculators/FilipinosCalculator.vue'
import KemenkesCalculator from '@/components/calculators/KemenkesCalculator.vue'
import DiabetesCalculator from '@/components/calculators/DiabetesCalculator.vue'
import CancerCalculator from '@/components/calculators/CancerCalculator.vue'
import BurnCalculator from '@/components/calculators/BurnCalculator.vue'
import SepsisCalculator from '@/components/calculators/SepsisCalculator.vue'
import NelsonCalculator from '@/components/calculators/NelsonCalculator.vue'
import NeonatalCalculator from '@/components/calculators/NeonatalCalculator.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'harris-benedict': markRaw(HarrisBenedictCalculator),
  'mifflin-st-jeor': markRaw(MifflinStJeorCalculator),
  'broca': markRaw(BrocaCalculator),
  'filipinos': markRaw(FilipinosCalculator),
  'kemenkes': markRaw(KemenkesCalculator),
  'diabetes': markRaw(DiabetesCalculator),
  'cancer': markRaw(CancerCalculator),
  'burn': markRaw(BurnCalculator),
  'sepsis': markRaw(SepsisCalculator),
  'nelson': markRaw(NelsonCalculator),
  'neonatal': markRaw(NeonatalCalculator),
}
</script>
