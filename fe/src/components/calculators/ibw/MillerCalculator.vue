<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
      <h4 class="font-bold text-teal-900 flex items-center space-x-2">
        <ion-icon name="analytics" class="text-xl"></ion-icon>
        <span>Miller Formula</span>
      </h4>
      <p class="text-sm text-teal-700 mt-1">Formula alternatif untuk perhitungan berat badan ideal</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
          placeholder="Contoh: 172"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-teal-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border border-teal-200">
          <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal</p>
          <p class="text-3xl font-bold text-teal-700">{{ result.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-teal-200">
          <p class="text-sm text-gray-600 mb-1">Rentang Ideal</p>
          <p class="text-xl font-bold text-teal-700">{{ (result - 5).toFixed(1) }} - {{ (result + 5).toFixed(1) }} kg</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          {{ genderText === 'Laki-laki' ? 'Laki-laki: 56.2 + 1.41 × (tinggi - 60 inci)' : 'Perempuan: 53.1 + 1.36 × (tinggi - 60 inci)' }}
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-teal-50 border border-teal-200 rounded-xl p-4">
      <h5 class="font-bold text-teal-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Miller Formula</span>
      </h5>
      <ul class="text-sm text-teal-800 space-y-1">
        <li>• Dikembangkan oleh Dr. D.R. Miller et al. pada tahun 1983</li>
        <li>• Formula alternatif yang memberikan hasil sedikit berbeda dari Devine</li>
        <li>• Formula: Laki-laki = 56.2 + 1.41 × (tinggi_inci - 60)</li>
        <li>• Formula: Perempuan = 53.1 + 1.36 × (tinggi_inci - 60)</li>
        <li>• Digunakan dalam beberapa setting klinis tertentu</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const height = ref<number | null>(null)
const result = ref<number | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return gender.value && height.value && height.value > 0
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const calculate = async () => {
  if (!canCalculate.value || !height.value) return

  // Convert cm to inches
  const heightInches = height.value / 2.54

  // Miller Formula
  let ibw: number
  if (gender.value === 'male') {
    ibw = 56.2 + 1.41 * (heightInches - 60)
  } else {
    ibw = 53.1 + 1.36 * (heightInches - 60)
  }

  result.value = Math.max(ibw, 0)

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Miller Formula',
    inputs: {
      gender: genderText.value,
      height_cm: height.value,
      height_inches: heightInches.toFixed(1)
    },
    results: {
      ibw_kg: result.value.toFixed(1),
      ibw_range: `${(result.value - 5).toFixed(1)} - ${(result.value + 5).toFixed(1)} kg`
    }
  })
}
</script>
