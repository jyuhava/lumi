<template>
  <div class="space-y-6">
    <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-purple-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-purple-900 mb-1">Kebutuhan Gizi Pasien Kanker</p>
          <p class="text-purple-800">Perhitungan kalori dan protein untuk pasien kanker dengan berbagai tingkat stress.</p>
          <p class="text-xs text-purple-600 mt-1">Sumber: ASPEN Guidelines</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Kondisi Pasien</label>
        <select v-model="condition" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="normal">Tanpa Stress (25-30 kkal/kg)</option>
          <option value="stress">Stress Berat/Malabsorpsi (30-35 kkal/kg)</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Kebutuhan Protein</label>
        <select v-model="proteinLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="normal">Tanpa Stress (1-1.2 g/kg BB)</option>
          <option value="hyper">Hiperkatabolisme (1.2-1.6 g/kg BB)</option>
          <option value="severe">Stress Berat (1.5-2.5 g/kg BB)</option>
          <option value="transplant">Transplantasi (1.5-2 g/kg BB)</option>
        </select>
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-3">
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Kalori</p>
          <p class="text-3xl font-bold text-emerald-700">{{ result.caloriesMin.toFixed(0) }} - {{ result.caloriesMax.toFixed(0) }} <span class="text-lg">kkal/hari</span></p>
        </div>

        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Protein</p>
          <p class="text-3xl font-bold text-purple-700">{{ result.proteinMin.toFixed(0) }} - {{ result.proteinMax.toFixed(0) }} <span class="text-lg">gram/hari</span></p>
        </div>

        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Lemak (±30% dari energi)</p>
          <p class="text-2xl font-bold text-orange-700">{{ result.fatMin.toFixed(0) }} - {{ result.fatMax.toFixed(0) }} <span class="text-base">gram/hari</span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number>()
const condition = ref('')
const proteinLevel = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!weight.value || !condition.value || !proteinLevel.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  // Kalori
  let calMin = 25, calMax = 30
  if (condition.value === 'stress') {
    calMin = 30
    calMax = 35
  }

  const caloriesMin = weight.value * calMin
  const caloriesMax = weight.value * calMax

  // Protein
  const proteinMap: Record<string, [number, number]> = {
    normal: [1.0, 1.2],
    hyper: [1.2, 1.6],
    severe: [1.5, 2.5],
    transplant: [1.5, 2.0]
  }

  const [pMin, pMax] = proteinMap[proteinLevel.value]
  const proteinMin = weight.value * pMin
  const proteinMax = weight.value * pMax

  // Lemak (30% dari kalori)
  const fatMin = (caloriesMin * 0.30) / 9
  const fatMax = (caloriesMax * 0.30) / 9

  result.value = { caloriesMin, caloriesMax, proteinMin, proteinMax, fatMin, fatMax }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Cancer',
    inputs: {
      weight: weight.value,
      condition: condition.value,
      proteinLevel: proteinLevel.value
    },
    results: result.value
  })
}
</script>
