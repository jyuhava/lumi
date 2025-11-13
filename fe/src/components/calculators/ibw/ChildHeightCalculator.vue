<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
      <h4 class="font-bold text-indigo-900 flex items-center space-x-2">
        <ion-icon name="resize" class="text-xl"></ion-icon>
        <span>IBW Anak Berdasarkan Tinggi Badan</span>
      </h4>
      <p class="text-sm text-indigo-700 mt-1">Perhitungan menggunakan modifikasi Broca untuk anak</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Height -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 130"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-indigo-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border border-indigo-200">
          <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal</p>
          <p class="text-3xl font-bold text-indigo-700">{{ result.ibw.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-indigo-200">
          <p class="text-sm text-gray-600 mb-1">Rentang Normal</p>
          <p class="text-xl font-bold text-indigo-700">{{ result.range.min.toFixed(1) }} - {{ result.range.max.toFixed(1) }} kg</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          {{ result.formula }}
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
      <h5 class="font-bold text-indigo-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>IBW Anak Berdasarkan Tinggi</span>
      </h5>
      <ul class="text-sm text-indigo-800 space-y-1">
        <li>• Menggunakan modifikasi formula Broca untuk anak</li>
        <li>• Tinggi < 130 cm: IBW = (tinggi - 100) × 0.8</li>
        <li>• Tinggi ≥ 130 cm: IBW = (tinggi - 100) × 0.85 (perempuan) atau × 0.9 (laki-laki)</li>
        <li>• Rentang normal: IBW ± 10%</li>
        <li>• Untuk evaluasi lebih akurat, gunakan kurva pertumbuhan Kemenkes/WHO</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const height = ref<number | null>(null)
const gender = ref('')
const result = ref<{
  ibw: number
  range: { min: number; max: number }
  formula: string
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return height.value && height.value > 0 && gender.value
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const calculate = async () => {
  if (!canCalculate.value || !height.value) return

  let ibw: number
  let formula: string

  // Modified Broca for children
  if (height.value < 130) {
    ibw = (height.value - 100) * 0.8
    formula = `(${height.value} - 100) × 0.8 = ${ibw.toFixed(1)} kg`
  } else {
    const factor = gender.value === 'male' ? 0.9 : 0.85
    ibw = (height.value - 100) * factor
    formula = `(${height.value} - 100) × ${factor} = ${ibw.toFixed(1)} kg`
  }

  // Normal range: IBW ± 10%
  const range = {
    min: ibw * 0.9,
    max: ibw * 1.1
  }

  result.value = { ibw, range, formula }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Child Height-Based',
    inputs: {
      gender: genderText.value,
      height_cm: height.value
    },
    results: {
      ibw_kg: ibw.toFixed(1),
      normal_range: `${range.min.toFixed(1)} - ${range.max.toFixed(1)} kg`,
      formula: formula
    }
  })
}
</script>
