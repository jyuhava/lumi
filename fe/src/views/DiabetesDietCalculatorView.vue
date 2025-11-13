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
        <h2 class="text-2xl font-bold text-gray-900">Diabetes Diet Calculator</h2>
      </div>
      <p class="text-gray-600 ml-14">Perhitungan diet Diabetes Melitus Tipe 2 - Standar PERKENI 2024 & Kemenkes RI</p>
    </div>

    <!-- Calculator Card -->
    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-orange-600 px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <ion-icon name="pulse" class="text-3xl text-white"></ion-icon>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Diabetes Diet Calculator</h3>
              <p class="text-sm text-orange-100">Pilih metode perhitungan diet DM</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Box -->
      <div class="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-200">
        <div class="grid md:grid-cols-4 gap-4 text-center">
          <div>
            <ion-icon name="calculator" class="text-2xl text-red-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Kalori & Makronutrien</p>
          </div>
          <div>
            <ion-icon name="restaurant" class="text-2xl text-orange-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Sistem Penukar</p>
          </div>
          <div>
            <ion-icon name="time" class="text-2xl text-red-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Pola 3J</p>
          </div>
          <div>
            <ion-icon name="analytics" class="text-2xl text-orange-600 mb-1"></ion-icon>
            <p class="text-xs font-bold text-gray-700">Monitoring</p>
          </div>
        </div>
      </div>

      <!-- Method Selection -->
      <div class="p-6">
        <label class="block text-sm font-bold text-gray-700 mb-3">Pilih Metode Perhitungan:</label>
        <select
          v-model="selectedMethod"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 font-medium"
        >
          <option value="">-- Pilih Metode --</option>
          
          <optgroup label="Perhitungan Kebutuhan Energi">
            <option value="rule-of-thumb">Rule of Thumb (PERKENI 2024)</option>
            <option value="harris-benedict">Harris-Benedict (Presisi Tinggi)</option>
          </optgroup>

          <optgroup label="Distribusi Makronutrien">
            <option value="macronutrient-distribution">Distribusi Makronutrien PERKENI</option>
            <option value="food-exchange">Sistem Penukar Makanan (DBMP)</option>
          </optgroup>

          <optgroup label="Perencanaan Menu">
            <option value="meal-pattern-3j">Pola Makan 3J (Jumlah, Jadwal, Jenis)</option>
            <option value="glycemic-index">Indeks Glikemik Makanan</option>
          </optgroup>

          <optgroup label="Standar Diet">
            <option value="standard-dm-diet">Standar Diet DM I-VIII</option>
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
          <p class="text-sm text-gray-500 mt-1">Pilihan tersedia berdasarkan PERKENI 2024 & Kemenkes RI</p>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Energy Calculation Components
import RuleOfThumb from '@/components/calculators/diabetes-diet/RuleOfThumb.vue'
import HarrisBenedict from '@/components/calculators/diabetes-diet/HarrisBenedict.vue'

// Macronutrient Components
import MacronutrientDistribution from '@/components/calculators/diabetes-diet/MacronutrientDistribution.vue'
import FoodExchange from '@/components/calculators/diabetes-diet/FoodExchange.vue'

// Meal Planning Components
import MealPattern3J from '@/components/calculators/diabetes-diet/MealPattern3J.vue'
import GlycemicIndex from '@/components/calculators/diabetes-diet/GlycemicIndex.vue'

// Standard Diet Component
import StandardDMDiet from '@/components/calculators/diabetes-diet/StandardDMDiet.vue'

const selectedMethod = ref('')

const calculatorComponents: Record<string, any> = {
  'rule-of-thumb': markRaw(RuleOfThumb),
  'harris-benedict': markRaw(HarrisBenedict),
  'macronutrient-distribution': markRaw(MacronutrientDistribution),
  'food-exchange': markRaw(FoodExchange),
  'meal-pattern-3j': markRaw(MealPattern3J),
  'glycemic-index': markRaw(GlycemicIndex),
  'standard-dm-diet': markRaw(StandardDMDiet),
}

const currentComponent = computed(() => {
  return selectedMethod.value ? calculatorComponents[selectedMethod.value] : null
})
</script>
