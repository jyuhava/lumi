<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
      <h4 class="font-bold text-cyan-900 flex items-center space-x-2">
        <ion-icon name="fitness" class="text-xl"></ion-icon>
        <span>Robinson Formula</span>
      </h4>
      <p class="text-sm text-cyan-700 mt-1">Modifikasi dari Devine Formula dengan penyesuaian koefisien</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
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
          placeholder="Contoh: 168"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-cyan-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border border-cyan-200">
          <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal</p>
          <p class="text-3xl font-bold text-cyan-700">{{ result.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-cyan-200">
          <p class="text-sm text-gray-600 mb-1">Rentang Ideal</p>
          <p class="text-xl font-bold text-cyan-700">{{ (result - 5).toFixed(1) }} - {{ (result + 5).toFixed(1) }} kg</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          {{ genderText === 'Laki-laki' ? 'Laki-laki: 52 + 1.9 × (tinggi - 60 inci)' : 'Perempuan: 49 + 1.7 × (tinggi - 60 inci)' }}
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
      <h5 class="font-bold text-cyan-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Robinson Formula</span>
      </h5>
      <ul class="text-sm text-cyan-800 space-y-1">
        <li>• Dikembangkan oleh J.D. Robinson et al. pada tahun 1983</li>
        <li>• Modifikasi dari Devine Formula dengan koefisien yang disesuaikan</li>
        <li>• Formula: Laki-laki = 52 + 1.9 × (tinggi_inci - 60)</li>
        <li>• Formula: Perempuan = 49 + 1.7 × (tinggi_inci - 60)</li>
        <li>• Sering digunakan dalam penelitian klinis</li>
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

  // Robinson Formula
  let ibw: number
  if (gender.value === 'male') {
    ibw = 52 + 1.9 * (heightInches - 60)
  } else {
    ibw = 49 + 1.7 * (heightInches - 60)
  }

  result.value = Math.max(ibw, 0)

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Robinson Formula',
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
