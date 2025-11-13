<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
      <h4 class="font-bold text-blue-900 flex items-center space-x-2">
        <ion-icon name="flash" class="text-xl"></ion-icon>
        <span>Perhitungan Cepat (kkal/kg BB)</span>
      </h4>
      <p class="text-sm text-blue-700 mt-1">Metode praktis untuk perhitungan di lapangan</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          min="1"
          placeholder="Contoh: 5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 18"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Kalori
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl p-6">
      <h4 class="text-lg font-bold text-pink-900 mb-4 flex items-center space-x-2">
        <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
        <span>Hasil Perhitungan</span>
      </h4>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 border border-pink-200">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Kalori</p>
          <p class="text-4xl font-bold text-pink-700">{{ result.calories.toFixed(0) }}</p>
          <p class="text-xs text-gray-500">kkal/hari</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-pink-200">
          <p class="text-sm text-gray-600 mb-1">Faktor Pengali</p>
          <p class="text-3xl font-bold text-pink-700">{{ result.factor }}</p>
          <p class="text-xs text-gray-500">kkal/kg BB</p>
        </div>
      </div>

      <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          Kalori = {{ weight }} kg × {{ result.factor }} kkal/kg = {{ result.calories.toFixed(0) }} kkal/hari<br>
          <span class="text-xs">{{ result.ageCategory }}</span>
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Faktor Pengali Berdasarkan Usia</span>
      </h5>
      <div class="text-sm text-blue-800 space-y-1">
        <p>• <strong>1-3 tahun:</strong> 100 kkal/kg BB</p>
        <p>• <strong>4-5 tahun:</strong> 90 kkal/kg BB</p>
        <p>• <strong>6-8 tahun:</strong> 65 kkal/kg BB</p>
        <p>• <strong>9+ tahun:</strong> 40-50 kkal/kg BB (rata-rata 45)</p>
        <p class="mt-2 text-xs text-blue-600">Metode ini praktis untuk skrining cepat di lapangan</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return age.value && age.value > 0 && weight.value && weight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !age.value || !weight.value) return

  let factor = 0
  let ageCategory = ''

  // Determine factor based on age
  if (age.value >= 1 && age.value < 4) {
    factor = 100
    ageCategory = '1-3 tahun: 100 kkal/kg'
  } else if (age.value >= 4 && age.value < 6) {
    factor = 90
    ageCategory = '4-5 tahun: 90 kkal/kg'
  } else if (age.value >= 6 && age.value < 9) {
    factor = 65
    ageCategory = '6-8 tahun: 65 kkal/kg'
  } else {
    factor = 45
    ageCategory = '9+ tahun: 40-50 kkal/kg (rata-rata 45)'
  }

  const calories = weight.value * factor

  result.value = {
    calories,
    factor,
    ageCategory
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'child_nutrition',
    method: 'Quick Factor (kkal/kg BB)',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      factor_used: factor
    },
    results: {
      calories_kcal: calories.toFixed(0),
      age_category: ageCategory
    }
  })
}
</script>
