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
        <h2 class="text-2xl font-bold text-gray-900">Hypertension Diet Calculator</h2>
      </div>
      <p class="text-gray-600 ml-14">DASH Diet - Standar Kemenkes 2022, WHO & Evidence-Based Guidelines</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ion-icon name="heart" class="text-3xl text-white"></ion-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Hypertension Diet (DASH)</h3>
              <p class="text-sm text-blue-100">Dietary Approaches to Stop Hypertension</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-200">
        <div class="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <ion-icon name="calculator" class="text-2xl text-blue-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Kalori & Makronutrien</p>
          </div>
          <div>
            <ion-icon name="restaurant" class="text-2xl text-indigo-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Panduan DASH</p>
          </div>
          <div>
            <ion-icon name="nutrition" class="text-2xl text-blue-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Mikronutrien</p>
          </div>
          <div>
            <ion-icon name="trending-down" class="text-2xl text-indigo-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Sodium Control</p>
          </div>
        </div>
      </div>

      <!-- Method Selection -->
      <div class="p-6">
        <label class="block text-sm font-bold text-gray-700 mb-3">Pilih Metode Perhitungan:</label>
        <select
          v-model="selectedMethod"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
        >
          <option value="">-- Pilih Metode --</option>
          
          <optgroup label="Klasifikasi & Assessment">
            <option value="bp-classification">Klasifikasi Tekanan Darah</option>
          </optgroup>

          <optgroup label="Perhitungan Kebutuhan Energi">
            <option value="energy-requirement">Kebutuhan Energi (Rule of Thumb)</option>
          </optgroup>

          <optgroup label="DASH Diet Plans">
            <option value="dash-standard">DASH Standard (2300mg Sodium)</option>
            <option value="dash-reduced">DASH Reduced Sodium (1500mg)</option>
          </optgroup>

          <optgroup label="Komponen DASH">
            <option value="dash-macronutrient">Distribusi Makronutrien DASH</option>
            <option value="dash-micronutrient">Mikronutrien Penting (K, Ca, Mg)</option>
            <option value="sodium-calculator">Kalkulator Sodium Intake</option>
          </optgroup>

          <optgroup label="Monitoring">
            <option value="dash-effectiveness">Efektivitas & Monitoring DASH</option>
          </optgroup>
        </select>

        <!-- Dynamic Component -->
        <div v-if="currentComponent" class="mt-6">
          <component :is="currentComponent" />
        </div>

        <!-- Empty State -->
        <div v-else class="mt-8 text-center py-12 bg-gray-50 rounded-xl">
          <ion-icon name="document-text" class="text-6xl text-gray-400 mb-3"></ion-icon>
          <p class="text-gray-600 font-medium">Pilih metode perhitungan untuk memulai</p>
          <p class="text-sm text-gray-500 mt-1">Pilihan tersedia berdasarkan Kemenkes 2022 & WHO Guidelines</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Classification Component
import BPClassification from '@/components/calculators/hypertension-diet/BPClassification.vue'

// Energy Component
import EnergyRequirement from '@/components/calculators/hypertension-diet/EnergyRequirement.vue'

// DASH Diet Plans
import DASHStandard from '@/components/calculators/hypertension-diet/DASHStandard.vue'
import DASHReduced from '@/components/calculators/hypertension-diet/DASHReduced.vue'

// DASH Components
import DASHMacronutrient from '@/components/calculators/hypertension-diet/DASHMacronutrient.vue'
import DASHMicronutrient from '@/components/calculators/hypertension-diet/DASHMicronutrient.vue'
import SodiumCalculator from '@/components/calculators/hypertension-diet/SodiumCalculator.vue'

// Monitoring Component
import DASHEffectiveness from '@/components/calculators/hypertension-diet/DASHEffectiveness.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'bp-classification': markRaw(BPClassification),
  'energy-requirement': markRaw(EnergyRequirement),
  'dash-standard': markRaw(DASHStandard),
  'dash-reduced': markRaw(DASHReduced),
  'dash-macronutrient': markRaw(DASHMacronutrient),
  'dash-micronutrient': markRaw(DASHMicronutrient),
  'sodium-calculator': markRaw(SodiumCalculator),
  'dash-effectiveness': markRaw(DASHEffectiveness),
}

const currentComponent = computed(() => {
  return selectedMethod.value ? calculatorComponents[selectedMethod.value] : null
})
</script>
