<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-200">
      <h4 class="font-bold text-indigo-900 flex items-center space-x-2">
        <ion-icon name="medical" class="text-xl"></ion-icon>
        <span>STRONGkids Screening Tool</span>
      </h4>
      <p class="text-sm text-indigo-700 mt-1">Pediatric nutritional risk screening untuk anak sakit di rumah sakit</p>
    </div>

    <!-- Questions -->
    <div class="space-y-4">
      <!-- Q1 -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <p class="font-bold text-gray-900 mb-3">1. Apakah anak terlihat mengalami malnutrisi subjektif?</p>
        <select v-model.number="q1" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option :value="0">Tidak</option>
          <option :value="1">Ya</option>
        </select>
      </div>

      <!-- Q2 -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <p class="font-bold text-gray-900 mb-3">2. Apakah ada penyakit berisiko tinggi?</p>
        <select v-model.number="q2" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option :value="0">Tidak</option>
          <option :value="2">Ya (kanker, luka bakar, operasi besar, diare kronis, dll)</option>
        </select>
      </div>

      <!-- Q3 -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <p class="font-bold text-gray-900 mb-3">3. Asupan makanan dalam 7 hari terakhir?</p>
        <select v-model.number="q3" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option :value="0">Normal</option>
          <option :value="1">Menurun</option>
        </select>
      </div>

      <!-- Q4 -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <p class="font-bold text-gray-900 mb-3">4. Apakah ada penurunan berat badan atau stagnan?</p>
        <select v-model.number="q4" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option :value="0">Tidak</option>
          <option :value="1">Ya</option>
        </select>
      </div>
    </div>

    <button
      @click="calculate"
      class="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Skor STRONGkids
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil STRONGkids</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Skor</p>
          <p class="text-6xl font-bold text-indigo-700 mb-1">{{ result.totalScore }}</p>
          <p class="text-sm text-gray-500">dari 5 poin maksimal</p>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Kategori Risiko:</p>
            <p class="text-3xl font-bold" :class="result.statusColor">{{ result.category }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Rekomendasi:</p>
            <p class="text-sm">{{ result.recommendation }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Interpretasi STRONGkids:</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Skor</th>
              <th class="px-4 py-2 text-left">Kategori</th>
              <th class="px-4 py-2 text-left">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-green-50">
              <td class="px-4 py-2 font-bold">0</td>
              <td class="px-4 py-2">Risiko Rendah</td>
              <td class="px-4 py-2 text-xs">Monitoring standar, screening ulang 1 minggu</td>
            </tr>
            <tr class="border-b bg-yellow-50">
              <td class="px-4 py-2 font-bold">1-3</td>
              <td class="px-4 py-2">Risiko Sedang</td>
              <td class="px-4 py-2 text-xs">Konsultasi ahli gizi, monitoring ketat, rescreening 3 hari</td>
            </tr>
            <tr class="bg-red-50">
              <td class="px-4 py-2 font-bold">4-5</td>
              <td class="px-4 py-2">Risiko Tinggi</td>
              <td class="px-4 py-2 text-xs">Intervensi gizi SEGERA, konsultasi tim multidisiplin, monitoring harian</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
      <h5 class="font-bold text-indigo-900 mb-2">Tentang STRONGkids</h5>
      <p class="text-sm text-indigo-800">
        STRONGkids (Screening Tool for Risk On Nutritional Status and Growth) adalah tool validasi untuk 
        skrining risiko malnutrisi pada anak yang dirawat di rumah sakit. Sensitif dan mudah digunakan.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const q1 = ref<number>(0)
const q2 = ref<number>(0)
const q3 = ref<number>(0)
const q4 = ref<number>(0)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  const totalScore = q1.value + q2.value + q3.value + q4.value

  let category = ''
  let recommendation = ''
  let colorClass = ''
  let statusColor = ''

  if (totalScore === 0) {
    category = 'Risiko Rendah'
    recommendation = 'Monitoring standar. Lakukan screening ulang dalam 1 minggu.'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
  } else if (totalScore <= 3) {
    category = 'Risiko Sedang'
    recommendation = 'Konsultasi dengan ahli gizi. Monitoring ketat dan rescreening dalam 3 hari.'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
  } else {
    category = 'Risiko Tinggi'
    recommendation = 'Intervensi gizi SEGERA diperlukan. Konsultasi tim multidisiplin dan monitoring harian.'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
  }

  result.value = { totalScore, category, recommendation, colorClass, statusColor }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'STRONGkids Screening',
    inputs: {
      subjective_malnutrition: q1.value,
      high_risk_disease: q2.value,
      reduced_intake: q3.value,
      weight_loss: q4.value
    },
    results: {
      total_score: totalScore.toString(),
      risk_category: category
    }
  })
}
</script>
