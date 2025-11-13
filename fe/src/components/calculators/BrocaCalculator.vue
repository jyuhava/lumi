<template>
  <div class="space-y-6">
    <div class="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-purple-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-purple-900 mb-1">Rumus Broca</p>
          <p class="text-purple-800">Cara praktis menghitung berat badan ideal dan kebutuhan kalori.</p>
          <p class="text-xs text-purple-600 mt-1">Sumber: Broca Formula</p>
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
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input v-model.number="height" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Usia (tahun)</label>
        <input v-model.number="age" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan Aktual (kg)</label>
        <input v-model.number="actualWeight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tingkat Aktivitas</label>
        <select v-model="activityLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="light">Ringan (+10%)</option>
          <option value="moderate">Sedang (+20%)</option>
          <option value="heavy">Berat (+30%)</option>
        </select>
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-3 text-sm">
        <div class="flex justify-between bg-white p-3 rounded-lg">
          <span class="text-gray-700">Berat Badan Ideal (BBI):</span>
          <span class="font-bold text-emerald-700">{{ result.bbi.toFixed(1) }} kg</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg">
          <span class="text-gray-700">Kalori Basal:</span>
          <span class="font-bold text-emerald-700">{{ result.basalCalories.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg">
          <span class="text-gray-700">Kebutuhan Kalori Total:</span>
          <span class="font-bold text-emerald-700 text-lg">{{ result.totalCalories.toFixed(0) }} kkal/hari</span>
        </div>
      </div>

      <div class="mt-4 bg-white p-4 rounded-lg text-sm">
        <p class="font-semibold mb-2">Perhitungan:</p>
        <div class="space-y-1 text-gray-700">
          <p>{{ result.calculation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const height = ref<number>()
const age = ref<number>()
const actualWeight = ref<number>()
const activityLevel = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !height.value || !age.value || !actualWeight.value || !activityLevel.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  // Hitung BBI
  let bbi = height.value - 100
  
  // Kurangi 10% jika tinggi >= 160 (pria) atau >= 150 (wanita)
  if ((gender.value === 'male' && height.value >= 160) || (gender.value === 'female' && height.value >= 150)) {
    bbi = bbi - (bbi * 0.1)
  }

  // Kalori basal
  const basalCalories = bbi * (gender.value === 'male' ? 30 : 25)
  
  // Koreksi usia
  let totalCalories = basalCalories
  let calculation = `BBI = ${height.value} - 100 = ${bbi.toFixed(1)} kg\n`
  calculation += `Kalori basal = ${bbi.toFixed(1)} × ${gender.value === 'male' ? 30 : 25} = ${basalCalories.toFixed(0)} kkal\n`
  
  if (age.value > 40) {
    totalCalories -= basalCalories * 0.05
    calculation += `Koreksi usia >40: -5% = ${(basalCalories * 0.05).toFixed(0)} kkal\n`
  }

  // Koreksi aktivitas
  const activityMultiplier = activityLevel.value === 'light' ? 0.1 : activityLevel.value === 'moderate' ? 0.2 : 0.3
  totalCalories += basalCalories * activityMultiplier
  calculation += `Koreksi aktivitas: +${activityMultiplier * 100}% = ${(basalCalories * activityMultiplier).toFixed(0)} kkal`

  // Koreksi berat badan
  const bbiPercent = (actualWeight.value / bbi) * 100
  if (bbiPercent > 120) {
    const reduction = basalCalories * 0.2
    totalCalories -= reduction
    calculation += `\nKoreksi BB gemuk (>120% BBI): -20% = -${reduction.toFixed(0)} kkal`
  } else if (bbiPercent >= 110 && bbiPercent <= 120) {
    const reduction = basalCalories * 0.1
    totalCalories -= reduction
    calculation += `\nKoreksi BB lebih (110-120% BBI): -10% = -${reduction.toFixed(0)} kkal`
  }

  result.value = { bbi, basalCalories, totalCalories, calculation }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Broca',
    inputs: {
      gender: gender.value,
      height: height.value,
      age: age.value,
      actualWeight: actualWeight.value,
      activityLevel: activityLevel.value
    },
    results: result.value
  })
}
</script>
