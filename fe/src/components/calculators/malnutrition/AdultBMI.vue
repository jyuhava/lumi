<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-200">
      <h4 class="font-bold text-blue-900 flex items-center space-x-2">
        <ion-icon name="calculator" class="text-xl"></ion-icon>
        <span>IMT & Klasifikasi KEP (Kekurangan Energi Protein)</span>
      </h4>
      <p class="text-sm text-blue-700 mt-1">Penilaian status gizi dewasa - Standar Kemenkes RI</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 55"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 165"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung IMT & KEP
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil Perhitungan</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Indeks Massa Tubuh (IMT)</p>
          <p class="text-6xl font-bold text-blue-700 mb-1">{{ result.bmi.toFixed(1) }}</p>
          <p class="text-sm text-gray-500">kg/m²</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Status IMT:</p>
            <p class="text-2xl font-bold" :class="result.statusColor">{{ result.bmiCategory }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Klasifikasi KEP:</p>
            <p class="text-2xl font-bold" :class="result.statusColor">{{ result.kepCategory }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 mt-4">
          <p class="text-sm font-bold mb-2">Rekomendasi:</p>
          <p class="text-sm">{{ result.recommendation }}</p>
        </div>
      </div>

      <!-- Classification Tables -->
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h5 class="font-bold text-gray-900 mb-3">Klasifikasi IMT (Kemenkes):</h5>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b bg-red-50">
                <td class="px-3 py-2 font-bold">< 18,5</td>
                <td class="px-3 py-2">Kurang / Underweight</td>
              </tr>
              <tr class="border-b bg-green-50">
                <td class="px-3 py-2 font-bold">18,5-24,9</td>
                <td class="px-3 py-2"><strong>Normal</strong></td>
              </tr>
              <tr class="border-b bg-yellow-50">
                <td class="px-3 py-2 font-bold">25-27</td>
                <td class="px-3 py-2">Berlebih / Overweight</td>
              </tr>
              <tr class="bg-orange-50">
                <td class="px-3 py-2 font-bold">> 27</td>
                <td class="px-3 py-2">Obesitas / Obese</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
          <h5 class="font-bold text-gray-900 mb-3">Klasifikasi KEP (Kemenkes):</h5>
          <table class="w-full text-sm">
            <tbody>
              <tr class="border-b bg-yellow-50">
                <td class="px-3 py-2 font-bold">17,0-18,49</td>
                <td class="px-3 py-2">KEP Ringan (Tingkat I)</td>
              </tr>
              <tr class="border-b bg-orange-50">
                <td class="px-3 py-2 font-bold">16,0-16,9</td>
                <td class="px-3 py-2">KEP Sedang (Tingkat II)</td>
              </tr>
              <tr class="bg-red-50">
                <td class="px-3 py-2 font-bold">< 16,0</td>
                <td class="px-3 py-2"><strong>KEP Berat (Tingkat III)</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2">Tentang IMT & KEP</h5>
      <p class="text-sm text-blue-800">
        IMT adalah indikator sederhana untuk menilai status gizi dewasa. 
        Klasifikasi KEP (Kekurangan Energi Protein) digunakan khusus untuk mengidentifikasi tingkat malnutrisi pada dewasa.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && height.value && height.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value || !height.value) return

  const heightInMeters = height.value / 100
  const bmi = weight.value / (heightInMeters * heightInMeters)

  let bmiCategory = ''
  let kepCategory = ''
  let recommendation = ''
  let colorClass = ''
  let statusColor = ''

  // BMI Classification
  if (bmi < 18.5) {
    bmiCategory = 'Kurang / Underweight'
    
    // KEP Classification
    if (bmi >= 17.0) {
      kepCategory = 'KEP Ringan (Tingkat I)'
      colorClass = 'bg-yellow-50 border-yellow-300'
      statusColor = 'text-yellow-700'
      recommendation = 'Tingkatkan asupan kalori dan protein. Konsultasi dengan ahli gizi untuk program peningkatan berat badan.'
    } else if (bmi >= 16.0) {
      kepCategory = 'KEP Sedang (Tingkat II)'
      colorClass = 'bg-orange-50 border-orange-300'
      statusColor = 'text-orange-700'
      recommendation = 'Intervensi gizi diperlukan. Konsultasi dokter dan ahli gizi untuk terapi nutrisi medis.'
    } else {
      kepCategory = 'KEP Berat (Tingkat III)'
      colorClass = 'bg-red-50 border-red-300'
      statusColor = 'text-red-700'
      recommendation = 'SEGERA konsultasi ke RS untuk penanganan malnutrisi berat. Risiko tinggi komplikasi medis.'
    }
  } else if (bmi < 25) {
    bmiCategory = 'Normal'
    kepCategory = 'Tidak ada KEP'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
    recommendation = 'Pertahankan pola makan seimbang dan aktivitas fisik teratur.'
  } else if (bmi < 27) {
    bmiCategory = 'Berlebih / Overweight'
    kepCategory = 'Tidak ada KEP'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
    recommendation = 'Kurangi asupan kalori, tingkatkan aktivitas fisik. Risiko penyakit metabolik meningkat.'
  } else {
    bmiCategory = 'Obesitas / Obese'
    kepCategory = 'Tidak ada KEP'
    colorClass = 'bg-orange-50 border-orange-300'
    statusColor = 'text-orange-700'
    recommendation = 'Segera konsultasi untuk program penurunan berat badan. Risiko tinggi penyakit jantung, diabetes, hipertensi.'
  }

  result.value = { bmi, bmiCategory, kepCategory, recommendation, colorClass, statusColor }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'IMT & KEP Classification',
    inputs: {
      weight_kg: weight.value,
      height_cm: height.value
    },
    results: {
      bmi: bmi.toFixed(1),
      bmi_category: bmiCategory,
      kep_category: kepCategory
    }
  })
}
</script>
