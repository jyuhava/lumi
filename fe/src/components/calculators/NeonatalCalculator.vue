<template>
  <div class="space-y-6">
    <div class="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-pink-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-pink-900 mb-1">Kebutuhan Kalori Neonatus (0-28 Hari)</p>
          <p class="text-pink-800">Perhitungan khusus untuk bayi baru lahir berdasarkan berat badan.</p>
          <p class="text-xs text-pink-600 mt-1">Sumber: Pediatric Nutrition Guidelines</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan Bayi (gram)</label>
        <input v-model.number="weight" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 3000">
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-3 mb-4">
        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Status Berat Badan</p>
          <p class="text-xl font-bold" :class="result.status === 'BBLR' ? 'text-red-700' : 'text-emerald-700'">
            {{ result.status }}
          </p>
          <p class="text-xs text-gray-500 mt-1">{{ result.statusDesc }}</p>
        </div>

        <div class="bg-white p-4 rounded-lg">
          <p class="text-sm text-gray-600 mb-1">Berat Badan (kg)</p>
          <p class="text-2xl font-bold text-gray-800">{{ result.weightKg.toFixed(2) }} kg</p>
        </div>

        <div class="bg-emerald-100 p-4 rounded-lg border-2 border-emerald-400">
          <p class="text-sm text-emerald-800 mb-1">Kebutuhan Kalori</p>
          <p class="text-3xl font-bold text-emerald-700">{{ result.caloriesMin.toFixed(0) }} - {{ result.caloriesMax.toFixed(0) }} <span class="text-lg">kkal/hari</span></p>
          <p class="text-xs text-emerald-700 mt-2">{{ result.perKg }} kkal/kg BB/hari</p>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg">
        <p class="font-semibold text-gray-800 mb-2">Catatan:</p>
        <ul class="text-sm text-gray-700 space-y-1 list-disc list-inside">
          <li>BBLR = Berat Badan Lahir Rendah (&lt;2.500 gram)</li>
          <li>BBLN = Berat Badan Lahir Normal (≥2.500 gram)</li>
          <li>Konsultasikan dengan dokter anak untuk penyesuaian individual</li>
        </ul>
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
    alert('Mohon masukkan berat badan bayi')
    return
  }

  const weightKg = weight.value / 1000
  let status = ''
  let statusDesc = ''
  let perKg = ''
  let caloriesMin = 0
  let caloriesMax = 0

  if (weight.value < 2500) {
    status = 'BBLR'
    statusDesc = 'Berat Badan Lahir Rendah'
    perKg = '150'
    caloriesMin = weightKg * 150
    caloriesMax = weightKg * 150
  } else {
    status = 'BBLN'
    statusDesc = 'Berat Badan Lahir Normal'
    perKg = '100-120'
    caloriesMin = weightKg * 100
    caloriesMax = weightKg * 120
  }

  result.value = { 
    weightKg, 
    status, 
    statusDesc, 
    perKg,
    caloriesMin, 
    caloriesMax 
  }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Neonatal',
    inputs: {
      weight: weight.value
    },
    results: result.value
  })
}
</script>
