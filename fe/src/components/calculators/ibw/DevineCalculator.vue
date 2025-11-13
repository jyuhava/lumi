<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
      <h4 class="font-bold text-amber-900 flex items-center space-x-2">
        <ion-icon name="trophy" class="text-xl"></ion-icon>
        <span>Devine Formula (Gold Standard)</span>
      </h4>
      <p class="text-sm text-amber-700 mt-1">Standar internasional untuk perhitungan IBW, banyak digunakan dalam farmasi klinik</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
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
          placeholder="Contoh: 170"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
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
          <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal</p>
          <p class="text-3xl font-bold text-green-700">{{ result.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-green-200">
          <p class="text-sm text-gray-600 mb-1">Rentang Ideal</p>
          <p class="text-xl font-bold text-green-700">{{ (result - 5).toFixed(1) }} - {{ (result + 5).toFixed(1) }} kg</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          {{ genderText === 'Laki-laki' ? 'Laki-laki: 50 + 2.3 × (tinggi - 60 inci)' : 'Perempuan: 45.5 + 2.3 × (tinggi - 60 inci)' }}
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Devine Formula</span>
      </h5>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• Dikembangkan oleh Dr. Ben J. Devine pada tahun 1974</li>
        <li>• Standar internasional untuk perhitungan dosis obat dan nutrisi</li>
        <li>• Akurat untuk dewasa dengan tinggi 152 cm - 213 cm</li>
        <li>• Formula: Laki-laki = 50 + 2.3 × (tinggi_inci - 60)</li>
        <li>• Formula: Perempuan = 45.5 + 2.3 × (tinggi_inci - 60)</li>
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

  // Devine Formula
  let ibw: number
  if (gender.value === 'male') {
    ibw = 50 + 2.3 * (heightInches - 60)
  } else {
    ibw = 45.5 + 2.3 * (heightInches - 60)
  }

  // Ensure positive result
  result.value = Math.max(ibw, 0)

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Devine Formula',
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
