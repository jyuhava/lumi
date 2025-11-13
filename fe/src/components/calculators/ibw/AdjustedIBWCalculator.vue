<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 border border-red-200">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="medical" class="text-xl"></ion-icon>
        <span>Adjusted IBW (untuk Obesitas)</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">Perhitungan IBW yang disesuaikan untuk pasien obesitas (BMI ≥ 30) dalam pemberian dosis obat</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-3 gap-6">
      <!-- Actual Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan Aktual (kg)</label>
        <input
          v-model.number="actualWeight"
          type="number"
          step="0.1"
          placeholder="Contoh: 95"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="">Pilih</option>
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
          placeholder="Contoh: 170"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Adjusted IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- BMI Warning -->
      <div v-if="result.bmi < 30" class="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
        <div class="flex items-start space-x-3">
          <ion-icon name="warning" class="text-2xl text-yellow-600 flex-shrink-0 mt-1"></ion-icon>
          <div>
            <p class="font-bold text-yellow-900">Perhatian</p>
            <p class="text-sm text-yellow-800">BMI = {{ result.bmi.toFixed(1) }} kg/m² (tidak obesitas). Adjusted IBW biasanya digunakan untuk BMI ≥ 30.</p>
          </div>
        </div>
      </div>

      <!-- Main Result -->
      <div class="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold text-red-900 flex items-center space-x-2">
            <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
            <span>Hasil Perhitungan</span>
          </h4>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-4 border border-red-200">
            <p class="text-sm text-gray-600 mb-1">IBW (Devine)</p>
            <p class="text-2xl font-bold text-red-700">{{ result.ibw.toFixed(1) }} kg</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-red-200">
            <p class="text-sm text-gray-600 mb-1">BMI</p>
            <p class="text-2xl font-bold text-red-700">{{ result.bmi.toFixed(1) }} kg/m²</p>
          </div>

          <div class="bg-red-100 rounded-lg p-4 border-2 border-red-300 md:col-span-2">
            <p class="text-sm text-gray-600 mb-1">Adjusted IBW</p>
            <p class="text-4xl font-bold text-red-700">{{ result.adjustedIBW.toFixed(1) }} kg</p>
            <p class="text-sm text-red-600 mt-2">Gunakan nilai ini untuk perhitungan dosis obat</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-red-200">
            <p class="text-sm text-gray-600 mb-1">Excess Weight</p>
            <p class="text-xl font-bold text-red-700">{{ result.excessWeight.toFixed(1) }} kg</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-red-200">
            <p class="text-sm text-gray-600 mb-1">Adjustment</p>
            <p class="text-xl font-bold text-red-700">+{{ (result.adjustedIBW - result.ibw).toFixed(1) }} kg</p>
          </div>
        </div>

        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-900">
            <strong>Formula:</strong><br>
            Adjusted IBW = IBW + 0.4 × (Berat Aktual - IBW)<br>
            = {{ result.ibw.toFixed(1) }} + 0.4 × ({{ actualWeight }} - {{ result.ibw.toFixed(1) }})<br>
            = {{ result.adjustedIBW.toFixed(1) }} kg
          </p>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Adjusted IBW</span>
      </h5>
      <ul class="text-sm text-red-800 space-y-1">
        <li>• Digunakan khusus untuk pasien obesitas (BMI ≥ 30 kg/m²)</li>
        <li>• Formula: Adjusted IBW = IBW + 0.4 × (Actual Weight - IBW)</li>
        <li>• Penting untuk perhitungan dosis obat yang tepat pada pasien obesitas</li>
        <li>• Menghindari overdosis obat yang dihitung berdasarkan berat badan</li>
        <li>• Tidak semua obat menggunakan Adjusted IBW, konsultasikan dengan farmasis</li>
        <li>• IBW dihitung menggunakan Devine Formula sebagai standar</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const actualWeight = ref<number | null>(null)
const gender = ref('')
const height = ref<number | null>(null)
const result = ref<{
  ibw: number
  bmi: number
  adjustedIBW: number
  excessWeight: number
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return actualWeight.value && actualWeight.value > 0 &&
         gender.value && height.value && height.value > 0
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const calculate = async () => {
  if (!canCalculate.value || !actualWeight.value || !height.value) return

  // Convert cm to inches and meters
  const heightInches = height.value / 2.54
  const heightMeters = height.value / 100

  // Calculate IBW using Devine Formula
  let ibw: number
  if (gender.value === 'male') {
    ibw = 50 + 2.3 * (heightInches - 60)
  } else {
    ibw = 45.5 + 2.3 * (heightInches - 60)
  }

  // Calculate BMI
  const bmi = actualWeight.value / (heightMeters * heightMeters)

  // Calculate Adjusted IBW
  const excessWeight = actualWeight.value - ibw
  const adjustedIBW = ibw + (0.4 * excessWeight)

  result.value = {
    ibw: Math.max(ibw, 0),
    bmi,
    adjustedIBW: Math.max(adjustedIBW, 0),
    excessWeight: Math.max(excessWeight, 0)
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Adjusted IBW (Obesity)',
    inputs: {
      gender: genderText.value,
      height_cm: height.value,
      actual_weight_kg: actualWeight.value,
      bmi: bmi.toFixed(1)
    },
    results: {
      ibw_kg: ibw.toFixed(1),
      adjusted_ibw_kg: adjustedIBW.toFixed(1),
      excess_weight_kg: excessWeight.toFixed(1),
      bmi: `${bmi.toFixed(1)} kg/m²`
    }
  })
}
</script>
