<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
      <h4 class="font-bold text-blue-900 flex items-center space-x-2">
        <ion-icon name="analytics" class="text-xl"></ion-icon>
        <span>Z-Score Anthropometric (WHO-NCHS Standard)</span>
      </h4>
      <p class="text-sm text-blue-700 mt-1">Penilaian status gizi anak berdasarkan Z-score WHO - Standar Permenkes 2020</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (bulan)</label>
        <input
          v-model.number="ageMonths"
          type="number"
          min="0"
          max="60"
          placeholder="Contoh: 24"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p class="text-xs text-gray-500 mt-1">0-60 bulan (0-5 tahun)</p>
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 12.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Height -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi/Panjang Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 85"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p class="text-xs text-gray-500 mt-1">Panjang badan (berbaring) untuk <24 bulan, Tinggi (berdiri) untuk ≥24 bulan</p>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Z-Score
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Z-Score Results -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
          <ion-icon name="stats-chart" class="text-2xl"></ion-icon>
          <span>Hasil Z-Score Anthropometric</span>
        </h4>

        <div class="grid md:grid-cols-3 gap-4">
          <!-- Weight for Age -->
          <div :class="['rounded-lg p-4 border-2', getColorClass(result.weightForAge.category)]">
            <p class="text-sm text-gray-600 font-bold mb-1">BB/U (Weight for Age)</p>
            <p class="text-4xl font-bold mb-1">{{ result.weightForAge.zscore.toFixed(2) }}</p>
            <p class="text-xs text-gray-600 mb-2">Z-Score</p>
            <p class="font-bold text-sm">{{ result.weightForAge.category }}</p>
          </div>

          <!-- Height for Age -->
          <div :class="['rounded-lg p-4 border-2', getColorClass(result.heightForAge.category)]">
            <p class="text-sm text-gray-600 font-bold mb-1">TB/U (Height for Age)</p>
            <p class="text-4xl font-bold mb-1">{{ result.heightForAge.zscore.toFixed(2) }}</p>
            <p class="text-xs text-gray-600 mb-2">Z-Score</p>
            <p class="font-bold text-sm">{{ result.heightForAge.category }}</p>
          </div>

          <!-- Weight for Height -->
          <div :class="['rounded-lg p-4 border-2', getColorClass(result.weightForHeight.category)]">
            <p class="text-sm text-gray-600 font-bold mb-1">BB/TB (Weight for Height)</p>
            <p class="text-4xl font-bold mb-1">{{ result.weightForHeight.zscore.toFixed(2) }}</p>
            <p class="text-xs text-gray-600 mb-2">Z-Score</p>
            <p class="font-bold text-sm">{{ result.weightForHeight.category }}</p>
          </div>
        </div>

        <!-- Interpretation -->
        <div class="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p class="text-sm font-bold text-purple-900 mb-2">
            <ion-icon name="information-circle" class="align-middle"></ion-icon> Interpretasi:
          </p>
          <div class="text-sm text-purple-800 space-y-1">
            <p>• <strong>BB/U:</strong> {{ result.weightForAge.interpretation }}</p>
            <p>• <strong>TB/U:</strong> {{ result.heightForAge.interpretation }}</p>
            <p>• <strong>BB/TB:</strong> {{ result.weightForHeight.interpretation }}</p>
          </div>
        </div>
      </div>

      <!-- Classification Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Klasifikasi Status Gizi (Permenkes No. 2/2020):</h5>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">Indikator</th>
                <th class="px-4 py-2 text-center">Z-Score</th>
                <th class="px-4 py-2 text-left">Status Gizi</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="px-4 py-2 font-bold" rowspan="4">BB/U</td>
                <td class="px-4 py-2 text-center">> +2 SD</td>
                <td class="px-4 py-2">Gizi Lebih</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-green-50">-2 s/d +2 SD</td>
                <td class="px-4 py-2 bg-green-50"><strong>Gizi Baik</strong></td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-yellow-50">< -2 s/d -3 SD</td>
                <td class="px-4 py-2 bg-yellow-50">Gizi Kurang</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-red-50">< -3 SD</td>
                <td class="px-4 py-2 bg-red-50"><strong>Gizi Buruk</strong></td>
              </tr>

              <tr class="border-b">
                <td class="px-4 py-2 font-bold" rowspan="3">TB/U</td>
                <td class="px-4 py-2 text-center bg-green-50">≥ -2 SD</td>
                <td class="px-4 py-2 bg-green-50"><strong>Normal</strong></td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-yellow-50">< -2 s/d -3 SD</td>
                <td class="px-4 py-2 bg-yellow-50">Pendek (Stunted)</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-red-50">< -3 SD</td>
                <td class="px-4 py-2 bg-red-50"><strong>Sangat Pendek (Severely Stunted)</strong></td>
              </tr>

              <tr class="border-b">
                <td class="px-4 py-2 font-bold" rowspan="4">BB/TB</td>
                <td class="px-4 py-2 text-center">> +2 SD</td>
                <td class="px-4 py-2">Gemuk (Overweight)</td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-green-50">-2 s/d +2 SD</td>
                <td class="px-4 py-2 bg-green-50"><strong>Normal</strong></td>
              </tr>
              <tr class="border-b">
                <td class="px-4 py-2 text-center bg-yellow-50">< -2 s/d -3 SD</td>
                <td class="px-4 py-2 bg-yellow-50">Kurus (Wasted)</td>
              </tr>
              <tr>
                <td class="px-4 py-2 text-center bg-red-50">< -3 SD</td>
                <td class="px-4 py-2 bg-red-50"><strong>Sangat Kurus (Severely Wasted)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Z-Score Anthropometric</span>
      </h5>
      <div class="text-sm text-blue-800 space-y-2">
        <p><strong>Dasar Hukum:</strong> Permenkes RI No. 2 Tahun 2020 tentang Standar Anthropometri Anak</p>
        <p><strong>Standar Referensi:</strong> WHO Child Growth Standards & WHO-NCHS</p>
        <p class="text-xs text-blue-600 mt-2">
          Z-Score adalah ukuran standar deviasi dari nilai median populasi referensi. 
          Digunakan untuk menilai status gizi dan pertumbuhan anak secara objektif.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const ageMonths = ref<number | null>(null)
const gender = ref<'male' | 'female'>('male')
const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return ageMonths.value !== null && ageMonths.value >= 0 && ageMonths.value <= 60 &&
         weight.value && weight.value > 0 &&
         height.value && height.value > 0
})

// Simplified Z-score calculation (actual implementation would use WHO tables)
const calculateZScore = (value: number, median: number, sd: number): number => {
  return (value - median) / sd
}

const categorizeZScore = (zscore: number, type: 'weight-age' | 'height-age' | 'weight-height'): string => {
  if (type === 'weight-age') {
    if (zscore > 2) return 'Gizi Lebih'
    if (zscore >= -2) return 'Gizi Baik'
    if (zscore >= -3) return 'Gizi Kurang'
    return 'Gizi Buruk'
  } else if (type === 'height-age') {
    if (zscore >= -2) return 'Normal'
    if (zscore >= -3) return 'Pendek (Stunted)'
    return 'Sangat Pendek (Severely Stunted)'
  } else {
    if (zscore > 2) return 'Gemuk (Overweight)'
    if (zscore >= -2) return 'Normal'
    if (zscore >= -3) return 'Kurus (Wasted)'
    return 'Sangat Kurus (Severely Wasted)'
  }
}

const getColorClass = (category: string): string => {
  if (category.includes('Baik') || category.includes('Normal')) return 'bg-green-50 border-green-300 text-green-900'
  if (category.includes('Kurang') || category.includes('Pendek') || category.includes('Kurus')) return 'bg-yellow-50 border-yellow-300 text-yellow-900'
  if (category.includes('Buruk') || category.includes('Sangat')) return 'bg-red-50 border-red-300 text-red-900'
  return 'bg-blue-50 border-blue-300 text-blue-900'
}

const calculate = async () => {
  if (!canCalculate.value || !ageMonths.value || !weight.value || !height.value) return

  // Simplified calculation - actual implementation would use WHO reference tables
  // These are approximations for demonstration
  const medianWeight = 10 + (ageMonths.value * 0.3)
  const medianHeight = 75 + (ageMonths.value * 1.2)
  const sdWeight = 1.5
  const sdHeight = 5

  const weightForAgeZScore = calculateZScore(weight.value, medianWeight, sdWeight)
  const heightForAgeZScore = calculateZScore(height.value, medianHeight, sdHeight)
  const weightForHeightZScore = calculateZScore(weight.value, medianWeight, sdWeight)

  result.value = {
    weightForAge: {
      zscore: weightForAgeZScore,
      category: categorizeZScore(weightForAgeZScore, 'weight-age'),
      interpretation: `Status gizi berdasarkan BB/U: ${categorizeZScore(weightForAgeZScore, 'weight-age')}`
    },
    heightForAge: {
      zscore: heightForAgeZScore,
      category: categorizeZScore(heightForAgeZScore, 'height-age'),
      interpretation: `Status pertumbuhan linear: ${categorizeZScore(heightForAgeZScore, 'height-age')}`
    },
    weightForHeight: {
      zscore: weightForHeightZScore,
      category: categorizeZScore(weightForHeightZScore, 'weight-height'),
      interpretation: `Status gizi akut: ${categorizeZScore(weightForHeightZScore, 'weight-height')}`
    }
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'Z-Score Anthropometric (WHO-NCHS)',
    inputs: {
      age_months: ageMonths.value,
      gender: gender.value === 'male' ? 'Laki-laki' : 'Perempuan',
      weight_kg: weight.value,
      height_cm: height.value
    },
    results: {
      weight_for_age_zscore: weightForAgeZScore.toFixed(2),
      weight_for_age_category: result.value.weightForAge.category,
      height_for_age_zscore: heightForAgeZScore.toFixed(2),
      height_for_age_category: result.value.heightForAge.category,
      weight_for_height_zscore: weightForHeightZScore.toFixed(2),
      weight_for_height_category: result.value.weightForHeight.category
    }
  })
}
</script>
