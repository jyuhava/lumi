<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
      <h4 class="font-bold text-purple-900 flex items-center space-x-2">
        <ion-icon name="body" class="text-xl"></ion-icon>
        <span>Hamwi Formula</span>
      </h4>
      <p class="text-sm text-purple-700 mt-1">Mempertimbangkan ukuran frame tubuh untuk hasil lebih akurat</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
          placeholder="Contoh: 175"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <!-- Frame Size -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Ukuran Frame Tubuh</label>
        <select
          v-model="frameSize"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="">Pilih Ukuran Frame</option>
          <option value="small">Small (Kecil) - ±10%</option>
          <option value="medium">Medium (Sedang) - IBW standar</option>
          <option value="large">Large (Besar) - +10%</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-bold text-purple-900 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg p-4 border border-purple-200">
          <p class="text-sm text-gray-600 mb-1">IBW Standar</p>
          <p class="text-2xl font-bold text-purple-700">{{ result.baseIBW.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-purple-200">
          <p class="text-sm text-gray-600 mb-1">IBW {{ frameText }}</p>
          <p class="text-3xl font-bold text-purple-700">{{ result.adjustedIBW.toFixed(1) }} kg</p>
        </div>

        <div class="bg-white rounded-lg p-4 border border-purple-200">
          <p class="text-sm text-gray-600 mb-1">Penyesuaian</p>
          <p class="text-xl font-bold text-purple-700">{{ result.adjustment > 0 ? '+' : '' }}{{ result.adjustment.toFixed(1) }}%</p>
        </div>
      </div>

      <div class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          {{ genderText === 'Laki-laki' ? 'Laki-laki: 48 + 2.7 × (tinggi - 60 inci)' : 'Perempuan: 45.5 + 2.2 × (tinggi - 60 inci)' }}<br>
          Disesuaikan dengan frame size: {{ frameText }}
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h5 class="font-bold text-purple-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Hamwi Formula</span>
      </h5>
      <ul class="text-sm text-purple-800 space-y-1">
        <li>• Dikembangkan oleh Dr. George J. Hamwi pada tahun 1964</li>
        <li>• Mempertimbangkan ukuran frame tubuh (small/medium/large)</li>
        <li>• Formula: Laki-laki = 48 + 2.7 × (tinggi_inci - 60)</li>
        <li>• Formula: Perempuan = 45.5 + 2.2 × (tinggi_inci - 60)</li>
        <li>• Frame kecil: -10%, Frame besar: +10%</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const height = ref<number | null>(null)
const frameSize = ref('')
const result = ref<{
  baseIBW: number
  adjustedIBW: number
  adjustment: number
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return gender.value && height.value && height.value > 0 && frameSize.value
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const frameText = computed(() => {
  const frames: Record<string, string> = {
    small: 'Small (-10%)',
    medium: 'Medium',
    large: 'Large (+10%)'
  }
  return frames[frameSize.value] || ''
})

const calculate = async () => {
  if (!canCalculate.value || !height.value) return

  // Convert cm to inches
  const heightInches = height.value / 2.54

  // Hamwi Formula
  let baseIBW: number
  if (gender.value === 'male') {
    baseIBW = 48 + 2.7 * (heightInches - 60)
  } else {
    baseIBW = 45.5 + 2.2 * (heightInches - 60)
  }

  // Adjust for frame size
  let adjustment = 0
  let adjustedIBW = baseIBW

  if (frameSize.value === 'small') {
    adjustment = -10
    adjustedIBW = baseIBW * 0.9
  } else if (frameSize.value === 'large') {
    adjustment = 10
    adjustedIBW = baseIBW * 1.1
  }

  result.value = {
    baseIBW: Math.max(baseIBW, 0),
    adjustedIBW: Math.max(adjustedIBW, 0),
    adjustment
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: 'Hamwi Formula',
    inputs: {
      gender: genderText.value,
      height_cm: height.value,
      height_inches: heightInches.toFixed(1),
      frame_size: frameText.value
    },
    results: {
      base_ibw_kg: result.value.baseIBW.toFixed(1),
      adjusted_ibw_kg: result.value.adjustedIBW.toFixed(1),
      adjustment_percent: `${adjustment}%`
    }
  })
}
</script>
