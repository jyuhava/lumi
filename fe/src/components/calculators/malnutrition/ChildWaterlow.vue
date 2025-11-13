<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
      <h4 class="font-bold text-purple-900 flex items-center space-x-2">
        <ion-icon name="fitness" class="text-xl"></ion-icon>
        <span>Waterlow Method - Weight for Height (%)</span>
      </h4>
      <p class="text-sm text-purple-700 mt-1">Penilaian status gizi akut berdasarkan persentase BB terhadap TB ideal</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 100"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan Aktual (kg)</label>
        <input
          v-model.number="actualWeight"
          type="number"
          step="0.1"
          placeholder="Contoh: 14"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan Ideal untuk Tinggi ini (kg)</label>
        <input
          v-model.number="idealWeight"
          type="number"
          step="0.1"
          placeholder="Contoh: 16 (bisa diestimasi dari chart WHO)"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        />
        <p class="text-xs text-gray-500 mt-1">Gunakan median BB untuk TB dari chart WHO</p>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Waterlow
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil Waterlow Method</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Weight for Height</p>
          <p class="text-6xl font-bold text-purple-700 mb-1">{{ result.percentage.toFixed(1) }}%</p>
          <p class="text-sm text-gray-500">BB Aktual / BB Ideal × 100%</p>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Status Gizi:</p>
            <p class="text-3xl font-bold" :class="result.statusColor">{{ result.status }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Perhitungan:</p>
            <p class="text-sm">{{ actualWeight }} kg / {{ idealWeight }} kg × 100% = {{ result.percentage.toFixed(1) }}%</p>
          </div>
        </div>
      </div>

      <!-- Classification Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Klasifikasi Waterlow:</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">% BB/TB</th>
              <th class="px-4 py-2 text-left">Status Gizi</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-green-50">
              <td class="px-4 py-2 font-bold">> 90%</td>
              <td class="px-4 py-2"><strong>Normal</strong></td>
            </tr>
            <tr class="border-b bg-yellow-50">
              <td class="px-4 py-2 font-bold">80-90%</td>
              <td class="px-4 py-2">Malnutrisi Ringan</td>
            </tr>
            <tr class="border-b bg-orange-50">
              <td class="px-4 py-2 font-bold">70-80%</td>
              <td class="px-4 py-2">Malnutrisi Sedang</td>
            </tr>
            <tr class="bg-red-50">
              <td class="px-4 py-2 font-bold">< 70%</td>
              <td class="px-4 py-2"><strong>Malnutrisi Berat</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h5 class="font-bold text-purple-900 mb-2">Tentang Waterlow Method</h5>
      <p class="text-sm text-purple-800">
        Metode Waterlow menggunakan persentase berat badan aktual terhadap berat badan ideal untuk tinggi badan tertentu. 
        Metode ini sensitif untuk mendeteksi malnutrisi akut (wasting).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const height = ref<number | null>(null)
const actualWeight = ref<number | null>(null)
const idealWeight = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return height.value && actualWeight.value && idealWeight.value && 
         height.value > 0 && actualWeight.value > 0 && idealWeight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !actualWeight.value || !idealWeight.value) return

  const percentage = (actualWeight.value / idealWeight.value) * 100

  let status = ''
  let colorClass = ''
  let statusColor = ''

  if (percentage > 90) {
    status = 'Normal'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
  } else if (percentage >= 80) {
    status = 'Malnutrisi Ringan'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
  } else if (percentage >= 70) {
    status = 'Malnutrisi Sedang'
    colorClass = 'bg-orange-50 border-orange-300'
    statusColor = 'text-orange-700'
  } else {
    status = 'Malnutrisi Berat'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
  }

  result.value = { percentage, status, colorClass, statusColor }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'Waterlow Method',
    inputs: {
      height_cm: height.value,
      actual_weight_kg: actualWeight.value,
      ideal_weight_kg: idealWeight.value
    },
    results: {
      percentage: percentage.toFixed(1),
      status_gizi: status
    }
  })
}
</script>
