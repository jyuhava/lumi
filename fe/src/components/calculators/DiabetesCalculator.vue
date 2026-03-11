<template>
  <div class="space-y-6">
    <div class="bg-rose-50 border-l-4 border-rose-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-rose-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-rose-900 mb-1">Kebutuhan Gizi Pasien Diabetes Mellitus</p>
          <p class="text-rose-800">Perhitungan berdasarkan pedoman PERKENI dengan koreksi usia, aktivitas dan stress metabolik.</p>
          <p class="text-xs text-rose-600 mt-1">Sumber: PERKENI Guidelines</p>
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
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tingkat Aktivitas</label>
        <select v-model="activity" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="rest">Istirahat (+5%)</option>
          <option value="light">Aktivitas Ringan (+10%)</option>
          <option value="moderate">Aktivitas Sedang (+20%)</option>
          <option value="heavy">Aktivitas Berat (+30%)</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Stress Metabolik</label>
        <select v-model.number="stress" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option :value="0">Tidak ada</option>
          <option :value="10">Ringan (+10%)</option>
          <option :value="20">Sedang (+20%)</option>
          <option :value="30">Berat (+30%)</option>
        </select>
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Hitung
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="space-y-2 mb-4 text-sm">
        <div class="flex justify-between bg-white p-3 rounded-lg">
          <span class="text-gray-700">Berat Badan Ideal (BBI):</span>
          <span class="font-bold text-emerald-700">{{ result.bbi.toFixed(1) }} kg</span>
        </div>
        <div class="flex justify-between bg-white p-3 rounded-lg">
          <span class="text-gray-700">Kalori Basal:</span>
          <span class="font-bold text-emerald-700">{{ result.basalCalories.toFixed(0) }} kkal</span>
        </div>
        <div class="flex justify-between bg-emerald-100 p-3 rounded-lg border-2 border-emerald-400">
          <span class="font-bold text-gray-800">Total Kebutuhan Kalori:</span>
          <span class="font-bold text-emerald-700 text-lg">{{ result.totalCalories.toFixed(0) }} kkal/hari</span>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg mb-4">
        <p class="font-semibold text-gray-800 mb-3">Distribusi Zat Gizi:</p>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-700">Protein (15%):</span>
            <span class="font-bold text-emerald-700">{{ result.protein.toFixed(0) }} gram/hari</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">Lemak (22.5%):</span>
            <span class="font-bold text-emerald-700">{{ result.fat.toFixed(0) }} gram/hari</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">Karbohidrat (55%):</span>
            <span class="font-bold text-emerald-700">{{ result.carbs.toFixed(0) }} gram/hari</span>
          </div>
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
const activity = ref('')
const stress = ref<number>(0)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !height.value || !age.value || !activity.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  // Hitung BBI
  let bbi = height.value - 100
  if (height.value >= 160) {
    bbi = bbi - (bbi * 0.1)
  }

  // Kalori basal
  let basalCalories = bbi * (gender.value === 'male' ? 30 : 25)

  // Koreksi usia
  if (age.value >= 40 && age.value <= 59) {
    basalCalories -= basalCalories * 0.05
  } else if (age.value >= 60 && age.value <= 69) {
    basalCalories -= basalCalories * 0.10
  }

  // Koreksi aktivitas
  const activityMap: Record<string, number> = {
    rest: 0.05,
    light: 0.10,
    moderate: 0.20,
    heavy: 0.30
  }
  basalCalories += basalCalories * (activityMap[activity.value as string] || 0)

  // Koreksi stress metabolik
  let totalCalories = basalCalories
  if (stress.value > 0) {
    totalCalories += basalCalories * (stress.value / 100)
  }

  // Distribusi makronutrien
  const protein = (totalCalories * 0.15) / 4
  const fat = (totalCalories * 0.225) / 9
  const carbs = (totalCalories * 0.55) / 4

  result.value = { bbi, basalCalories, totalCalories, protein, fat, carbs }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Diabetes',
    inputs: {
      gender: gender.value,
      height: height.value,
      age: age.value,
      activity: activity.value,
      stress: stress.value
    },
    results: result.value
  })
}
</script>
