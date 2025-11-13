<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200">
      <h4 class="font-bold text-violet-900 flex items-center space-x-2">
        <ion-icon name="stats-chart" class="text-xl"></ion-icon>
        <span>%IBW (Persentase Ideal Body Weight)</span>
      </h4>
      <p class="text-sm text-violet-700 mt-1">Evaluasi status gizi berdasarkan persentase terhadap berat badan ideal</p>
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
          placeholder="Contoh: 55"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
      </div>

      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
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
          placeholder="Contoh: 165"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung %IBW
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div :class="[
        'border-2 rounded-xl p-6',
        result.category.color
      ]">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-lg font-bold flex items-center space-x-2">
            <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
            <span>Hasil Perhitungan</span>
          </h4>
        </div>

        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white/80 rounded-lg p-4 border">
            <p class="text-sm text-gray-600 mb-1">Berat Badan Ideal</p>
            <p class="text-2xl font-bold">{{ result.ibw.toFixed(1) }} kg</p>
          </div>

          <div class="bg-white/80 rounded-lg p-4 border">
            <p class="text-sm text-gray-600 mb-1">%IBW</p>
            <p class="text-3xl font-bold">{{ result.percentIBW.toFixed(1) }}%</p>
          </div>

          <div class="bg-white/80 rounded-lg p-4 border">
            <p class="text-sm text-gray-600 mb-1">Status Gizi</p>
            <p class="text-xl font-bold">{{ result.category.name }}</p>
          </div>
        </div>

        <div class="mt-4 p-4 bg-white/60 rounded-lg border">
          <p class="text-sm font-semibold">{{ result.category.description }}</p>
        </div>
      </div>

      <!-- Formula -->
      <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p class="text-sm text-blue-900">
          <strong>Formula:</strong><br>
          %IBW = (Berat Aktual / IBW) × 100%<br>
          %IBW = ({{ actualWeight }} / {{ result.ibw.toFixed(1) }}) × 100% = {{ result.percentIBW.toFixed(1) }}%
        </p>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-violet-50 border border-violet-200 rounded-xl p-4">
      <h5 class="font-bold text-violet-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Interpretasi %IBW</span>
      </h5>
      <div class="text-sm text-violet-800 space-y-1">
        <p>• <strong>&lt; 70%:</strong> Malnutrisi Berat (Severe Malnutrition)</p>
        <p>• <strong>70-79%:</strong> Malnutrisi Sedang (Moderate Malnutrition)</p>
        <p>• <strong>80-89%:</strong> Malnutrisi Ringan (Mild Malnutrition)</p>
        <p>• <strong>90-110%:</strong> Normal / Ideal</p>
        <p>• <strong>110-120%:</strong> Overweight / Kelebihan BB Ringan</p>
        <p>• <strong>&gt; 120%:</strong> Obesitas</p>
      </div>
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
  percentIBW: number
  category: {
    name: string
    description: string
    color: string
  }
} | null>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return actualWeight.value && actualWeight.value > 0 &&
         gender.value && height.value && height.value > 0
})

const genderText = computed(() => {
  return gender.value === 'male' ? 'Laki-laki' : 'Perempuan'
})

const getCategory = (percentIBW: number) => {
  if (percentIBW < 70) {
    return {
      name: 'Malnutrisi Berat',
      description: 'Memerlukan intervensi nutrisi segera dan pemantauan ketat',
      color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-red-900'
    }
  } else if (percentIBW < 80) {
    return {
      name: 'Malnutrisi Sedang',
      description: 'Perlu peningkatan asupan nutrisi dan evaluasi berkala',
      color: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 text-orange-900'
    }
  } else if (percentIBW < 90) {
    return {
      name: 'Malnutrisi Ringan',
      description: 'Peningkatan asupan nutrisi seimbang direkomendasikan',
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 text-yellow-900'
    }
  } else if (percentIBW <= 110) {
    return {
      name: 'Normal / Ideal',
      description: 'Status gizi baik, pertahankan pola makan seimbang',
      color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-300 text-green-900'
    }
  } else if (percentIBW <= 120) {
    return {
      name: 'Overweight',
      description: 'Kelebihan berat badan ringan, perlu pengaturan diet dan aktivitas fisik',
      color: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300 text-amber-900'
    }
  } else {
    return {
      name: 'Obesitas',
      description: 'Diperlukan program penurunan berat badan dan konsultasi ahli gizi',
      color: 'bg-gradient-to-br from-red-50 to-red-100 border-red-300 text-red-900'
    }
  }
}

const calculate = async () => {
  if (!canCalculate.value || !actualWeight.value || !height.value) return

  // Calculate IBW using Broca (Kemenkes standard)
  const factor = gender.value === 'male' ? 0.9 : 0.85
  const ibw = (height.value - 100) * factor

  // Calculate %IBW
  const percentIBW = (actualWeight.value / ibw) * 100

  // Get category
  const category = getCategory(percentIBW)

  result.value = { ibw, percentIBW, category }

  // Save to history
  await saveCalculation({
    calculator_type: 'ibw',
    method: '%IBW (Percent Ideal Body Weight)',
    inputs: {
      gender: genderText.value,
      height_cm: height.value,
      actual_weight_kg: actualWeight.value
    },
    results: {
      ibw_kg: ibw.toFixed(1),
      percent_ibw: `${percentIBW.toFixed(1)}%`,
      status: category.name,
      interpretation: category.description
    }
  })
}
</script>
