<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
      <h4 class="font-bold text-pink-900 flex items-center space-x-2">
        <ion-icon name="happy" class="text-xl"></ion-icon>
        <span>IBW Anak Berdasarkan Usia</span>
      </h4>
      <p class="text-sm text-pink-700 mt-1">Perhitungan berat badan ideal untuk anak usia 1-14 tahun</p>
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
          max="14"
          placeholder="Contoh: 8"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
        <p class="text-xs text-gray-500 mt-1">Usia antara 1-14 tahun</p>
      </div>

      <!-- Gender (for APLS) -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin (opsional)</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Tidak spesifik</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-pink-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="space-y-4">
        <!-- Age-based formulas -->
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Formula {{ result.ageGroup }}</p>
            <p class="text-3xl font-bold text-pink-700">{{ result.ibw.toFixed(1) }} kg</p>
          </div>

          <div v-if="result.aplsIBW" class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">APLS Formula</p>
            <p class="text-2xl font-bold text-pink-700">{{ result.aplsIBW.toFixed(1) }} kg</p>
          </div>
        </div>

        <!-- Formula used -->
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-900">
            <strong>Formula yang Digunakan:</strong><br>
            {{ result.formula }}<br>
            <span v-if="result.aplsFormula">APLS: {{ result.aplsFormula }}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-pink-50 border border-pink-200 rounded-xl p-4">
      <h5 class="font-bold text-pink-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Formula IBW Anak</span>
      </h5>
      <ul class="text-sm text-pink-800 space-y-1">
        <li>• <strong>Usia 1-5 tahun:</strong> IBW = 2 × (usia + 5) kg</li>
        <li>• <strong>Usia 5-14 tahun:</strong> IBW = 4 × usia kg</li>
        <li>• <strong>APLS (1-10 tahun):</strong> IBW = 2 × (usia + 4) kg</li>
        <li>• Formula ini merupakan estimasi kasar, untuk penilaian akurat gunakan kurva pertumbuhan WHO/Kemenkes</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const gender = ref('')
const result = ref<{
  ibw: number
  aplsIBW?: number
  ageGroup: string
  formula: string
  aplsFormula?: string
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return age.value && age.value >= 1 && age.value <= 14
})

const calculate = async () => {
  if (!canCalculate.value || !age.value) return

  let ibw: number
  let ageGroup: string
  let formula: string
  let aplsIBW: number | undefined
  let aplsFormula: string | undefined

  // Age-based formula
  if (age.value >= 1 && age.value < 5) {
    ageGroup = '1-5 tahun'
    ibw = 2 * (age.value + 5)
    formula = `2 × (${age.value} + 5) = ${ibw.toFixed(1)} kg`
  } else {
    ageGroup = '5-14 tahun'
    ibw = 4 * age.value
    formula = `4 × ${age.value} = ${ibw.toFixed(1)} kg`
  }

  // APLS formula (1-10 years)
  if (age.value >= 1 && age.value <= 10) {
    aplsIBW = 2 * (age.value + 4)
    aplsFormula = `2 × (${age.value} + 4) = ${aplsIBW.toFixed(1)} kg`
  }

  result.value = {
    ibw,
    aplsIBW,
    ageGroup,
    formula,
    aplsFormula
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Child Age-Based',
    inputs: {
      age_years: age.value,
      gender: gender.value || 'Tidak spesifik',
      age_group: ageGroup
    },
    results: {
      ibw_kg: ibw.toFixed(1),
      apls_ibw_kg: aplsIBW?.toFixed(1) || 'N/A',
      formula: formula
    }
  })
}
</script>
