<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
      <h4 class="font-bold text-orange-900 flex items-center space-x-2">
        <ion-icon name="analytics" class="text-xl"></ion-icon>
        <span>Harris-Benedict - Perhitungan Presisi Tinggi</span>
      </h4>
      <p class="text-sm text-orange-700 mt-1">REE × Faktor Aktivitas untuk hasil akurat</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select v-model="gender" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option value="M">Laki-laki</option>
          <option value="F">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          placeholder="Contoh: 45"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 65"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 165"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Tingkat Aktivitas Fisik</label>
        <select v-model.number="activityFactor" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option :value="1.2">Sangat Ringan - Tiduran/duduk (1.2)</option>
          <option :value="1.3">Ringan - Aktivitas ringan, bekerja duduk (1.3)</option>
          <option :value="1.4">Sedang - Berjalan, aktivitas rumah tangga (1.4)</option>
          <option :value="1.5">Berat - Kerja fisik, olahraga teratur (1.5)</option>
          <option :value="1.6">Sangat Berat - Atlet, pekerjaan berat (1.6-1.9)</option>
        </select>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung dengan Harris-Benedict
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div class="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6">
        <h4 class="text-lg font-bold mb-4 text-orange-900">Hasil Perhitungan Harris-Benedict</h4>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-orange-200">
            <p class="text-sm text-gray-600 mb-2">REE (Resting Energy Expenditure)</p>
            <p class="text-5xl font-bold text-orange-700 mb-1">{{ result.ree.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">kkal/hari</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-red-200">
            <p class="text-sm text-gray-600 mb-2">Total Kebutuhan Energi</p>
            <p class="text-5xl font-bold text-red-700 mb-1">{{ result.totalCalories.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">kkal/hari</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-orange-200 mb-4">
          <p class="text-sm font-bold mb-2">Rumus yang Digunakan:</p>
          <p class="text-sm font-mono bg-gray-50 p-3 rounded">{{ result.formula }}</p>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-red-200">
          <p class="text-sm font-bold mb-2">Perhitungan:</p>
          <p class="text-sm">REE = {{ result.ree.toFixed(1) }} kkal/hari</p>
          <p class="text-sm">Faktor Aktivitas = {{ activityFactor }}</p>
          <p class="text-sm font-bold mt-2">Total = {{ result.ree.toFixed(1) }} × {{ activityFactor }} = {{ result.totalCalories.toFixed(0) }} kkal/hari</p>
        </div>
      </div>

      <!-- Formula Reference -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Rumus Harris-Benedict:</h5>
        <div class="space-y-3 text-sm">
          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-bold text-blue-900 mb-1">👨 Laki-laki:</p>
            <p class="font-mono text-xs">REE = 66,5 + (13,7 × BB) + (5 × TB) - (6,8 × Usia)</p>
          </div>
          <div class="bg-pink-50 p-3 rounded-lg">
            <p class="font-bold text-pink-900 mb-1">👩 Perempuan:</p>
            <p class="font-mono text-xs">REE = 655 + (9,6 × BB) + (1,8 × TB) - (4,7 × Usia)</p>
          </div>
        </div>
      </div>

      <!-- Activity Factor Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Faktor Aktivitas:</h5>
        <table class="w-full text-sm">
          <tbody>
            <tr class="border-b">
              <td class="px-3 py-2 font-bold">1.2</td>
              <td class="px-3 py-2">Sangat Ringan (tiduran, duduk)</td>
            </tr>
            <tr class="border-b">
              <td class="px-3 py-2 font-bold">1.3</td>
              <td class="px-3 py-2">Ringan (bekerja duduk, aktivitas ringan)</td>
            </tr>
            <tr class="border-b">
              <td class="px-3 py-2 font-bold">1.4</td>
              <td class="px-3 py-2">Sedang (berjalan, aktivitas rumah tangga)</td>
            </tr>
            <tr class="border-b">
              <td class="px-3 py-2 font-bold">1.5</td>
              <td class="px-3 py-2">Berat (kerja fisik, olahraga teratur)</td>
            </tr>
            <tr>
              <td class="px-3 py-2 font-bold">1.6-1.9</td>
              <td class="px-3 py-2">Sangat Berat (atlet, pekerjaan sangat berat)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
      <h5 class="font-bold text-orange-900 mb-2">Kelebihan Harris-Benedict:</h5>
      <ul class="text-sm text-orange-800 space-y-1">
        <li>• Perhitungan lebih presisi dengan mempertimbangkan usia, jenis kelamin, dan aktivitas</li>
        <li>• Cocok untuk perencanaan diet jangka panjang</li>
        <li>• Standar internasional yang diakui</li>
        <li>• Referensi: PERKENI 2024, Manual Endokrin UMJ</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref<string>('M')
const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const activityFactor = ref<number>(1.3)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return age.value && age.value > 0 && 
         weight.value && weight.value > 0 && 
         height.value && height.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !age.value || !weight.value || !height.value) return

  let ree = 0
  let formula = ''

  if (gender.value === 'M') {
    ree = 66.5 + (13.7 * weight.value) + (5 * height.value) - (6.8 * age.value)
    formula = `66,5 + (13,7 × ${weight.value}) + (5 × ${height.value}) - (6,8 × ${age.value})`
  } else {
    ree = 655 + (9.6 * weight.value) + (1.8 * height.value) - (4.7 * age.value)
    formula = `655 + (9,6 × ${weight.value}) + (1,8 × ${height.value}) - (4,7 × ${age.value})`
  }

  const totalCalories = ree * activityFactor.value

  result.value = {
    ree,
    totalCalories,
    formula
  }

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Harris-Benedict',
    inputs: {
      gender: gender.value,
      age_years: age.value,
      weight_kg: weight.value,
      height_cm: height.value,
      activity_factor: activityFactor.value
    },
    results: {
      ree: ree.toFixed(0),
      total_calories: totalCalories.toFixed(0)
    }
  })
}
</script>
