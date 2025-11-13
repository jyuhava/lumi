<template>
  <div class="space-y-6">
    <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-orange-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-orange-900 mb-1">Rumus Filipinos</p>
          <p class="text-orange-800">Menghitung dengan mempertimbangkan metabolisme basal, aktivitas dan TEF (Thermic Effect of Food).</p>
          <p class="text-xs text-orange-600 mt-1">Sumber: Filipino Method</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
        <select v-model="gender" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input v-model.number="height" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Jam Tidur</label>
        <input v-model.number="sleepHours" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Default: 8">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tingkat Aktivitas Fisik</label>
        <select v-model.number="activityPercent" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option :value="20">Sangat Ringan (20%)</option>
          <option :value="30">Ringan (30%)</option>
          <option :value="40">Sedang (40%)</option>
          <option :value="50">Berat (50%)</option>
        </select>
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-2 mb-4">
        <div class="flex justify-between bg-white p-3 rounded-lg text-sm">
          <span class="text-gray-700">BMR (24 jam):</span>
          <span class="font-bold text-emerald-700">{{ result.bmr.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg text-sm">
          <span class="text-gray-700">Koreksi Tidur:</span>
          <span class="font-bold text-red-600">-{{ result.sleepCorrection.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg text-sm">
          <span class="text-gray-700">Aktivitas Fisik:</span>
          <span class="font-bold text-emerald-700">+{{ result.activity.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg text-sm">
          <span class="text-gray-700">TEF (SDA 6%):</span>
          <span class="font-bold text-emerald-700">+{{ result.tef.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-emerald-100 p-3 rounded-lg border-2 border-emerald-400">
          <span class="font-bold text-gray-800">Total Kebutuhan Energi:</span>
          <span class="font-bold text-emerald-700 text-lg">{{ result.total.toFixed(0) }} kkal/hari</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const weight = ref<number>()
const height = ref<number>()
const sleepHours = ref<number>(8)
const activityPercent = ref<number>()
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !weight.value || !height.value || !activityPercent.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  // BMR
  const multiplier = gender.value === 'male' ? 1.0 : 0.9
  const bmr = multiplier * weight.value * 24

  // BBI untuk koreksi tidur
  let bbi = height.value - 100
  if (height.value >= 160) {
    bbi = bbi - (bbi * 0.1)
  }

  // Koreksi tidur
  const sleepCorrection = 0.1 * bbi * sleepHours.value!

  // Kalori setelah tidur
  const afterSleep = bmr - sleepCorrection

  // Aktivitas fisik
  const activity = afterSleep * (activityPercent.value / 100)

  // Subtotal
  const subtotal = afterSleep + activity

  // TEF (SDA)
  const tef = subtotal * 0.06

  // Total
  const total = subtotal + tef

  result.value = { bmr, sleepCorrection, activity, tef, total }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Filipinos',
    inputs: {
      gender: gender.value,
      weight: weight.value,
      height: height.value,
      sleepHours: sleepHours.value,
      activityPercent: activityPercent.value
    },
    results: result.value
  })
}
</script>
