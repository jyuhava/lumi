<template>
  <div class="space-y-6">
    <!-- Calculator Title -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
        <ion-icon name="calculator" class="text-xl text-white"></ion-icon>
      </div>
      <div>
        <h4 class="font-bold text-gray-900">Kalkulator BMI/IMT</h4>
        <p class="text-sm text-gray-600">Body Mass Index (Indeks Massa Tubuh)</p>
      </div>
    </div>

    <!-- Input Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Berat Badan (kg)
        </label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 65.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Tinggi Badan (cm)
        </label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 170"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!weight || !height"
      class="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ion-icon name="calculator-outline" class="align-middle mr-2"></ion-icon>
      Hitung BMI/IMT
    </button>

    <!-- Result -->
    <div v-if="result" class="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
      <h5 class="font-bold text-purple-900 mb-4 flex items-center">
        <ion-icon name="analytics" class="mr-2 text-xl"></ion-icon>
        Hasil Perhitungan
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">BMI/IMT</p>
          <p class="text-3xl font-bold text-purple-600">{{ result.bmi }}</p>
          <p class="text-xs text-gray-500 mt-1">kg/m²</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Status Gizi</p>
          <p 
            :class="['text-lg font-bold', result.statusColor]"
          >
            {{ result.status }}
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ result.category }}</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm font-semibold text-gray-700 mb-2">Interpretasi:</p>
        <p class="text-sm text-gray-600">{{ result.interpretation }}</p>
      </div>
    </div>

    <!-- Reference Table -->
    <div class="bg-gray-50 rounded-xl p-6">
      <h5 class="font-bold text-gray-900 mb-4">Kategori BMI/IMT (WHO & Kemenkes RI)</h5>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2 text-left font-semibold">BMI (kg/m²)</th>
              <th class="px-4 py-2 text-left font-semibold">Kategori</th>
              <th class="px-4 py-2 text-left font-semibold">Status Gizi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-gray-100">
              <td class="px-4 py-2">&lt; 18,5</td>
              <td class="px-4 py-2">Underweight</td>
              <td class="px-4 py-2 text-blue-600 font-semibold">Berat badan kurang</td>
            </tr>
            <tr class="hover:bg-gray-100">
              <td class="px-4 py-2">18,5 - 24,9</td>
              <td class="px-4 py-2">Normal</td>
              <td class="px-4 py-2 text-green-600 font-semibold">Berat badan normal</td>
            </tr>
            <tr class="hover:bg-gray-100">
              <td class="px-4 py-2">25 - 29,9</td>
              <td class="px-4 py-2">Overweight</td>
              <td class="px-4 py-2 text-orange-600 font-semibold">Kelebihan berat badan</td>
            </tr>
            <tr class="hover:bg-gray-100">
              <td class="px-4 py-2">≥ 30</td>
              <td class="px-4 py-2">Obesitas</td>
              <td class="px-4 py-2 text-red-600 font-semibold">Sangat kelebihan BB</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Formula Display -->
    <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4">
      <p class="text-sm font-semibold text-indigo-900 mb-2">Rumus:</p>
      <div class="bg-white rounded p-3 font-mono text-sm">
        BMI/IMT = Berat Badan (kg) / (Tinggi Badan (m))²
      </div>
      <p class="text-xs text-indigo-700 mt-2">
        <strong>Sumber:</strong> WHO 2000, Kemenkes RI 2018
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation, saving } = useCalculationHistory()

const calculate = async () => {
  if (!weight.value || !height.value) return

  const heightInMeters = height.value / 100
  const bmi = weight.value / (heightInMeters * heightInMeters)
  
  let status = ''
  let category = ''
  let statusColor = ''
  let interpretation = ''

  if (bmi < 18.5) {
    status = 'Berat badan kurang'
    category = 'Underweight'
    statusColor = 'text-blue-600'
    interpretation = 'Anda memiliki berat badan di bawah normal. Disarankan untuk meningkatkan asupan nutrisi dan berkonsultasi dengan ahli gizi.'
  } else if (bmi >= 18.5 && bmi < 25) {
    status = 'Berat badan normal'
    category = 'Normal'
    statusColor = 'text-green-600'
    interpretation = 'Berat badan Anda ideal. Pertahankan pola makan sehat dan aktivitas fisik yang teratur.'
  } else if (bmi >= 25 && bmi < 30) {
    status = 'Kelebihan berat badan'
    category = 'Overweight'
    statusColor = 'text-orange-600'
    interpretation = 'Anda memiliki kelebihan berat badan. Disarankan untuk mengurangi asupan kalori dan meningkatkan aktivitas fisik.'
  } else {
    status = 'Obesitas'
    category = 'Obesitas'
    statusColor = 'text-red-600'
    interpretation = 'Anda mengalami obesitas. Sangat disarankan untuk berkonsultasi dengan dokter atau ahli gizi untuk program penurunan berat badan yang aman.'
  }

  result.value = {
    bmi: bmi.toFixed(1),
    status,
    category,
    statusColor,
    interpretation
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'nutritional-status',
    method: 'bmi',
    inputs: {
      weight: weight.value,
      height: height.value
    },
    results: result.value
  })
}
</script>
