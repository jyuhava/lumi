<template>
  <div class="space-y-6">
    <!-- Info -->
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-blue-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-blue-900 mb-1">Rumus Harris-Benedict</p>
          <p class="text-blue-800">Metode klasik untuk menghitung BMR berdasarkan jenis kelamin, usia, berat dan tinggi badan.</p>
          <p class="text-xs text-blue-600 mt-1">Sumber: Harris & Benedict (1919)</p>
        </div>
      </div>
    </div>

    <!-- Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
        <select v-model="gender" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="male">Pria</option>
          <option value="female">Wanita</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Usia (tahun)</label>
        <input v-model.number="age" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 25">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 70">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input v-model.number="height" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 170">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tingkat Aktivitas</label>
        <select v-model.number="activityLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih Tingkat Aktivitas</option>
          <option :value="1.2">Tidak Aktif (jarang/tidak olahraga)</option>
          <option :value="1.375">Olahraga Ringan (1-3 hari/minggu)</option>
          <option :value="1.55">Olahraga Sedang (3-5 hari/minggu)</option>
          <option :value="1.725">Olahraga Berat (6-7 hari/minggu)</option>
          <option :value="1.9">Sangat Berat (atlet)</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button 
      @click="calculate"
      class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2"></ion-icon>
      Hitung Kebutuhan Kalori
    </button>

    <!-- Result -->
    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4 flex items-center">
        <ion-icon name="checkmark-circle" class="text-2xl mr-2"></ion-icon>
        Hasil Perhitungan
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">BMR (Basal Metabolic Rate)</p>
          <p class="text-2xl font-bold text-emerald-700">{{ result.bmr.toFixed(0) }} kkal/hari</p>
        </div>
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Kalori Harian</p>
          <p class="text-2xl font-bold text-emerald-700">{{ result.tdee.toFixed(0) }} kkal/hari</p>
        </div>
      </div>

      <!-- Formula Used -->
      <div class="bg-white rounded-lg p-4 text-sm">
        <p class="font-semibold text-gray-800 mb-2">Rumus yang digunakan:</p>
        <div class="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs overflow-x-auto">
          {{ result.formula }}
        </div>
        <p class="mt-3 text-gray-700">
          <span class="font-semibold">TDEE:</span> {{ result.bmr.toFixed(0) }} × {{ activityLevel }} = {{ result.tdee.toFixed(0) }} kkal/hari
        </p>
      </div>

      <!-- Macronutrient Distribution -->
      <div class="mt-4 bg-white rounded-lg p-4">
        <p class="font-semibold text-gray-800 mb-3">Distribusi Makronutrien:</p>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-700">Protein (15%):</span>
            <span class="font-bold text-emerald-700">{{ result.protein.toFixed(0) }} gram/hari</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">Karbohidrat (60%):</span>
            <span class="font-bold text-emerald-700">{{ result.carbs.toFixed(0) }} gram/hari</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-700">Lemak (25%):</span>
            <span class="font-bold text-emerald-700">{{ result.fat.toFixed(0) }} gram/hari</span>
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
const age = ref<number>()
const weight = ref<number>()
const height = ref<number>()
const activityLevel = ref<number>()
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !age.value || !weight.value || !height.value || !activityLevel.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  let bmr = 0
  let formula = ''

  if (gender.value === 'male') {
    bmr = 66.5 + (13.7 * weight.value) + (5 * height.value) - (6.8 * age.value)
    formula = `BMR = 66,5 + (13,7 × ${weight.value}) + (5 × ${height.value}) - (6,8 × ${age.value})`
  } else {
    bmr = 655 + (9.6 * weight.value) + (1.8 * height.value) + (4.7 * age.value)
    formula = `BMR = 655 + (9,6 × ${weight.value}) + (1,8 × ${height.value}) - (4,7 × ${age.value})`
  }

  const tdee = bmr * activityLevel.value

  result.value = {
    bmr,
    tdee,
    formula,
    protein: (tdee * 0.15) / 4,
    carbs: (tdee * 0.60) / 4,
    fat: (tdee * 0.25) / 9
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Harris-Benedict',
    inputs: {
      gender: gender.value === 'male' ? 'Laki-laki' : 'Perempuan',
      age: age.value,
      weight_kg: weight.value,
      height_cm: height.value,
      activity_level: activityLevel.value
    },
    results: {
      bmr_kcal: bmr.toFixed(1),
      tdee_kcal: tdee.toFixed(1),
      protein_g: result.value.protein.toFixed(1),
      carbs_g: result.value.carbs.toFixed(1),
      fat_g: result.value.fat.toFixed(1)
    }
  })
}
</script>
