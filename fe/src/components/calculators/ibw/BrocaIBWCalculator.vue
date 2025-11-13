<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
      <h4 class="font-bold text-green-900 flex items-center space-x-2">
        <ion-icon name="shield-checkmark" class="text-xl"></ion-icon>
        <span>Broca Formula (Standar Kemenkes RI)</span>
      </h4>
      <p class="text-sm text-green-700 mt-1">Direkomendasikan Kementerian Kesehatan RI, praktis untuk populasi Indonesia</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <!-- Height -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 165"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-green-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border border-green-200">
          <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal (IBW)</p>
          <p class="text-3xl font-bold text-green-700">{{ result.ibw.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-green-200">
          <p class="text-sm text-gray-600 mb-1">Rentang Normal</p>
          <p class="text-xl font-bold text-green-700">{{ result.range.min.toFixed(1) }} - {{ result.range.max.toFixed(1) }} kg</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          IBW = (Tinggi - 100) × {{ gender === 'male' ? '0.9 (laki-laki)' : '0.85 (perempuan)' }}<br>
          Rentang Normal = IBW ± 10%
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-green-50 border border-green-200 rounded-xl p-4">
      <h5 class="font-bold text-green-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Broca Formula (Kemenkes)</span>
      </h5>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• Direkomendasikan oleh Kementerian Kesehatan Republik Indonesia</li>
        <li>• Mudah dihitung dan praktis untuk populasi Indonesia</li>
        <li>• Formula: (Tinggi - 100) × 0.9 (Laki-laki) atau × 0.85 (Perempuan)</li>
        <li>• Rentang normal: IBW ± 10%</li>
        <li>• Cocok untuk skrining cepat status gizi dewasa</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const height = ref<number | null>(null)
const result = ref<{
  ibw: number
  range: { min: number; max: number }
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return gender.value && height.value && height.value > 0
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const calculate = async () => {
  if (!canCalculate.value || !height.value) return

  // Broca Formula for IBW
  const factor = gender.value === 'male' ? 0.9 : 0.85
  const ibw = (height.value - 100) * factor

  // Normal range: IBW ± 10%
  const range = {
    min: ibw * 0.9,
    max: ibw * 1.1
  }

  result.value = { ibw, range }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Broca Formula (Kemenkes)',
    inputs: {
      gender: genderText.value,
      height_cm: height.value,
      factor: factor
    },
    results: {
      ibw_kg: ibw.toFixed(1),
      normal_range: `${range.min.toFixed(1)} - ${range.max.toFixed(1)} kg`
    }
  })
}
</script>
