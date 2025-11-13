<template>
  <div class="space-y-6">
    <!-- Info -->
    <div class="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-indigo-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-indigo-900 mb-1">Rumus Mifflin-St Jeor</p>
          <p class="text-indigo-800">Rumus modern yang lebih akurat untuk praktik klinik kontemporer.</p>
          <p class="text-xs text-indigo-600 mt-1">Sumber: Mifflin et al. (1990)</p>
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
        <input v-model.number="age" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input v-model.number="height" type="number" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tingkat Aktivitas</label>
        <select v-model.number="activityLevel" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih Tingkat Aktivitas</option>
          <option :value="1.2">Tidak Aktif</option>
          <option :value="1.375">Olahraga Ringan</option>
          <option :value="1.55">Olahraga Sedang</option>
          <option :value="1.725">Olahraga Berat</option>
          <option :value="1.9">Sangat Berat</option>
        </select>
      </div>
    </div>

    <button 
      @click="calculate"
      class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700 transition-all shadow-md"
    >
      <ion-icon name="calculator" class="align-middle mr-2"></ion-icon>
      Hitung Kebutuhan Kalori
    </button>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Hasil Perhitungan</h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600">BMR</p>
          <p class="text-2xl font-bold text-emerald-700">{{ result.bmr.toFixed(0) }} kkal</p>
        </div>
        <div class="bg-white rounded-lg p-4">
          <p class="text-sm text-gray-600">TDEE</p>
          <p class="text-2xl font-bold text-emerald-700">{{ result.tdee.toFixed(0) }} kkal</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 text-sm">
        <p class="font-semibold mb-2">Rumus:</p>
        <div class="bg-gray-50 p-3 rounded font-mono text-xs">{{ result.formula }}</div>
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
    bmr = (10 * weight.value) + (6.25 * height.value) - (5 * age.value) + 5
    formula = `BMR = (10 × ${weight.value}) + (6,25 × ${height.value}) - (5 × ${age.value}) + 5`
  } else {
    bmr = (10 * weight.value) + (6.25 * height.value) - (5 * age.value) - 161
    formula = `BMR = (10 × ${weight.value}) + (6,25 × ${height.value}) - (5 × ${age.value}) - 161`
  }

  const tdee = bmr * activityLevel.value

  result.value = { bmr, tdee, formula }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Mifflin-St Jeor',
    inputs: {
      gender: gender.value,
      age: age.value,
      weight: weight.value,
      height: height.value,
      activityLevel: activityLevel.value
    },
    results: result.value
  })
}
</script>
