<template>
  <div class="space-y-6">
    <div class="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-cyan-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-cyan-900 mb-1">Rumus Nelson (Bayi dan Anak)</p>
          <p class="text-cyan-800">Perhitungan kebutuhan energi untuk bayi dan anak berdasarkan berat badan.</p>
          <p class="text-xs text-cyan-600 mt-1">Sumber: Nelson Textbook of Pediatrics</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan Anak (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 25">
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="bg-white p-4 rounded-lg mb-4">
        <p class="text-sm text-gray-600 mb-1">Kebutuhan Energi Total</p>
        <p class="text-3xl font-bold text-emerald-700">{{ result.totalEnergy.toFixed(0) }} <span class="text-lg">kkal/hari</span></p>
      </div>

      <div class="bg-white p-4 rounded-lg">
        <p class="font-semibold text-gray-800 mb-3">Rincian Perhitungan:</p>
        <div class="space-y-2 text-sm">
          <div v-if="result.first10" class="flex justify-between">
            <span class="text-gray-700">10 kg pertama (100 kkal/kg):</span>
            <span class="font-bold text-emerald-700">{{ result.first10.toFixed(0) }} kkal</span>
          </div>
          <div v-if="result.second10" class="flex justify-between">
            <span class="text-gray-700">10 kg kedua (50 kkal/kg):</span>
            <span class="font-bold text-emerald-700">{{ result.second10.toFixed(0) }} kkal</span>
          </div>
          <div v-if="result.remaining" class="flex justify-between">
            <span class="text-gray-700">Sisa {{ result.remainingKg }} kg (20 kkal/kg):</span>
            <span class="font-bold text-emerald-700">{{ result.remaining.toFixed(0) }} kkal</span>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-600">
            <span class="font-semibold">Rumus Nelson:</span><br>
            - 10 kg pertama: × 100 kkal/kg<br>
            - 10 kg kedua: × 50 kkal/kg<br>
            - Selebihnya: × 20 kkal/kg
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number>()
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!weight.value) {
    alert('Mohon masukkan berat badan')
    return
  }

  let totalEnergy = 0
  let first10 = 0
  let second10 = 0
  let remaining = 0
  let remainingKg = 0

  if (weight.value <= 10) {
    first10 = weight.value * 100
    totalEnergy = first10
  } else if (weight.value <= 20) {
    first10 = 10 * 100
    second10 = (weight.value - 10) * 50
    totalEnergy = first10 + second10
  } else {
    first10 = 10 * 100
    second10 = 10 * 50
    remainingKg = weight.value - 20
    remaining = remainingKg * 20
    totalEnergy = first10 + second10 + remaining
  }

  result.value = { 
    totalEnergy, 
    first10: first10 || null, 
    second10: second10 || null, 
    remaining: remaining || null,
    remainingKg
  }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Nelson',
    inputs: {
      weight: weight.value
    },
    results: result.value
  })
}
</script>
