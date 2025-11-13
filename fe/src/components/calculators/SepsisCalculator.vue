<template>
  <div class="space-y-6">
    <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-red-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-red-900 mb-1">MUST - Malnutrition Universal Screening Tool</p>
          <p class="text-red-800">Penilaian status nutrisi untuk pasien penyakit kritis dan sepsis.</p>
          <p class="text-xs text-red-600 mt-1">Sumber: Kemenkes RI Guidelines</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input v-model.number="weight" type="number" step="0.1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Tinggi Badan (m)</label>
        <input v-model.number="height" type="number" step="0.01" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: 1.70">
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Kehilangan Berat Badan</label>
        <select v-model="weightLoss" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="none">Tidak ada kehilangan BB signifikan</option>
          <option value="mild">Kehilangan 5-10% dalam 3-6 bulan</option>
          <option value="moderate">Kehilangan >10% dalam 3-6 bulan</option>
        </select>
      </div>

      <div class="md:col-span-2">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Asupan Makan</label>
        <select v-model="intake" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="normal">Normal (>60% kebutuhan)</option>
          <option value="mild">Ringan (25-60% kebutuhan)</option>
          <option value="severe">Berat (0-25% kebutuhan atau tidak makan >5 hari)</option>
        </select>
      </div>
    </div>

    <button @click="calculate" class="w-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold py-3 rounded-lg hover:from-emerald-700 hover:to-green-700">
      Analisis
    </button>

    <div v-if="result" class="space-y-4">
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
        <h4 class="font-bold text-lg text-blue-900 mb-4">Hasil Analisis MUST</h4>
        
        <div class="bg-white p-4 rounded-lg mb-4">
          <p class="text-sm text-gray-600 mb-1">IMT (Indeks Massa Tubuh)</p>
          <p class="text-3xl font-bold text-blue-700">{{ result.bmi.toFixed(1) }} <span class="text-lg">kg/m²</span></p>
          <p class="text-sm text-gray-600 mt-1">{{ result.bmiStatus }}</p>
        </div>

        <div :class="[
          'p-4 rounded-lg border-2',
          result.risk === 'Rendah' ? 'bg-green-50 border-green-400' : 
          result.risk === 'Sedang' ? 'bg-yellow-50 border-yellow-400' : 
          'bg-red-50 border-red-400'
        ]">
          <p class="text-sm mb-1" :class="[
            result.risk === 'Rendah' ? 'text-green-700' : 
            result.risk === 'Sedang' ? 'text-yellow-700' : 
            'text-red-700'
          ]">Risiko Malnutrisi</p>
          <p class="text-2xl font-bold" :class="[
            result.risk === 'Rendah' ? 'text-green-800' : 
            result.risk === 'Sedang' ? 'text-yellow-800' : 
            'text-red-800'
          ]">{{ result.risk }}</p>
        </div>
      </div>

      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Rekomendasi:</h5>
        <ul class="space-y-2 text-sm text-gray-700">
          <li v-for="(rec, idx) in result.recommendations" :key="idx" class="flex items-start">
            <ion-icon name="checkmark-circle" class="text-emerald-600 mr-2 flex-shrink-0 text-lg"></ion-icon>
            <span>{{ rec }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const weight = ref<number>()
const height = ref<number>()
const weightLoss = ref('')
const intake = ref('')
const result = ref<any>(null)

const calculate = () => {
  if (!weight.value || !height.value || !weightLoss.value || !intake.value) {
    alert('Mohon lengkapi semua data')
    return
  }

  const bmi = weight.value / (height.value * height.value)
  
  let bmiStatus = ''
  let risk = 'Rendah'
  let recommendations: string[] = []

  if (bmi < 18.5) {
    bmiStatus = 'Underweight'
    risk = 'Tinggi'
  } else if (bmi >= 18.5 && bmi <= 20.5) {
    bmiStatus = 'Normal Rendah'
    if (intake.value === 'severe' || weightLoss.value === 'moderate') {
      risk = 'Sedang'
    }
  } else if (bmi > 20.5 && bmi < 25) {
    bmiStatus = 'Normal'
  } else if (bmi >= 25 && bmi < 30) {
    bmiStatus = 'Overweight'
  } else {
    bmiStatus = 'Obesitas'
  }

  if (weightLoss.value === 'moderate') {
    risk = 'Tinggi'
  } else if (weightLoss.value === 'mild' && risk !== 'Tinggi') {
    risk = 'Sedang'
  }

  if (intake.value === 'severe') {
    risk = 'Tinggi'
  } else if (intake.value === 'mild' && risk === 'Rendah') {
    risk = 'Sedang'
  }

  if (risk === 'Tinggi') {
    recommendations = [
      'Rujuk ke ahli gizi/dietisien untuk evaluasi lengkap',
      'Mulai nutrisi enteral/parenteral jika diperlukan',
      'Monitor asupan nutrisi harian',
      'Evaluasi ulang setiap 3-7 hari',
      'Pertimbangkan suplemen nutrisi tinggi kalori tinggi protein'
    ]
  } else if (risk === 'Sedang') {
    recommendations = [
      'Konsultasi dengan ahli gizi',
      'Tingkatkan asupan makanan bergizi',
      'Monitor berat badan mingguan',
      'Evaluasi ulang dalam 1-2 minggu'
    ]
  } else {
    recommendations = [
      'Lanjutkan pola makan sehat seimbang',
      'Monitor berat badan bulanan',
      'Evaluasi ulang jika ada perubahan kondisi'
    ]
  }

  result.value = { bmi, bmiStatus, risk, recommendations }
}
</script>
