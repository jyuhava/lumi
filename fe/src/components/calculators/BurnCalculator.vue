<template>
  <div class="space-y-6">
    <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-orange-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-orange-900 mb-1">Rumus Curreri untuk Luka Bakar</p>
          <p class="text-orange-800">Perhitungan khusus untuk pasien luka bakar berdasarkan luas area terbakar.</p>
          <p class="text-xs text-orange-600 mt-1">Sumber: Curreri Formula</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Luas Luka Bakar (%)</label>
        <input v-model.number="burnPercent" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 20">
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-3 mb-4">
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Energi Total</p>
          <p class="text-3xl font-bold text-emerald-700">{{ result.energy.toFixed(0) }} <span class="text-lg">kkal/hari</span></p>
        </div>

        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Protein</p>
          <p class="text-3xl font-bold text-purple-700">{{ result.proteinMin.toFixed(0) }} - {{ result.proteinMax.toFixed(0) }} <span class="text-lg">gram/hari</span></p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg">
        <p class="font-semibold text-gray-800 mb-3">Rumus Curreri:</p>
        <div class="bg-gray-50 p-3 rounded font-mono text-sm mb-3">
          Energi = (25 × {{ weight || 0 }}) + (40 × {{ burnPercent || 0 }}%)
        </div>
        <p class="text-gray-700 text-sm">= {{ (25 * (weight || 0)).toFixed(0) }} + {{ (40 * (burnPercent || 0)).toFixed(0) }} = {{ result.energy.toFixed(0) }} kkal/hari</p>
      </div>

      <div class="mt-4 bg-white p-4 rounded-lg">
        <p class="font-semibold text-gray-800 mb-2">Distribusi Nutrisi:</p>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-700">Karbohidrat (55%):</span>
            <span class="font-bold text-emerald-700">{{ result.carbs.toFixed(0) }} gram/hari</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">Protein (22.5%):</span>
            <span class="font-bold text-emerald-700">{{ ((result.energy * 0.225) / 4).toFixed(0) }} gram/hari</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number>()
const burnPercent = ref<number>()
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!weight.value || !burnPercent.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  // Rumus Curreri
  const energy = (25 * weight.value) + (40 * burnPercent.value)

  // Protein 1.5-2.5 g/kg BB
  const proteinMin = weight.value * 1.5
  const proteinMax = weight.value * 2.5

  // Karbohidrat 50-60%
  const carbs = (energy * 0.55) / 4

  result.value = { energy, proteinMin, proteinMax, carbs }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Burn/Luka Bakar',
    inputs: {
      weight: weight.value,
      burnPercent: burnPercent.value
    },
    results: result.value
  })
}
</script>
