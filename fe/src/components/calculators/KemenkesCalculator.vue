<template>
  <div class="space-y-6">
    <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-green-600 mr-3 flex-shrink-0"></ion-icon>
        <div class="text-sm">
          <p class="font-bold text-green-900 mb-1">Angka Kecukupan Gizi Kemenkes RI</p>
          <p class="text-green-800">Berdasarkan Permenkes No. 28 Tahun 2019 tentang Angka Kecukupan Gizi.</p>
          <p class="text-xs text-green-600 mt-1">Sumber: Permenkes No. 28/2019</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Jenis Kelamin</label>
        <select v-model="gender" @change="calculate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="male">Pria</option>
          <option value="female">Wanita</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">Kelompok Usia</label>
        <select v-model="ageGroup" @change="calculate" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
          <option value="">Pilih</option>
          <option value="adult">Dewasa (19-49 tahun)</option>
          <option value="50-64">Lansia 50-64 tahun</option>
          <option value="65-80">Lansia 65-80 tahun</option>
          <option value="80+">Lansia >80 tahun</option>
        </select>
      </div>
    </div>

    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-300 rounded-xl p-6">
      <h4 class="font-bold text-lg text-emerald-900 mb-4">Angka Kecukupan Gizi</h4>
      
      <div class="bg-white p-4 rounded-lg">
        <div class="text-center mb-4">
          <p class="text-sm text-gray-600 mb-1">Kebutuhan Kalori Harian</p>
          <p class="text-4xl font-bold text-emerald-700">{{ result.calories }} <span class="text-lg">kkal/hari</span></p>
        </div>

        <div class="border-t pt-4 space-y-2 text-sm">
          <p class="text-gray-700"><span class="font-semibold">Kelompok:</span> {{ result.group }}</p>
          <p class="text-gray-700"><span class="font-semibold">Jenis Kelamin:</span> {{ result.genderText }}</p>
          <p class="text-gray-600 text-xs mt-3 italic">* Angka ini adalah rata-rata kebutuhan untuk populasi sehat dengan tingkat aktivitas sedang</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const ageGroup = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !ageGroup.value) {
    result.value = null
    return
  }

  const data: Record<string, Record<string, number>> = {
    adult: { male: 2500, female: 2100 },
    '50-64': { male: 2150, female: 1800 },
    '65-80': { male: 1800, female: 1550 },
    '80+': { male: 1600, female: 1400 },
  }

  const groupNames: Record<string, string> = {
    adult: 'Dewasa (19-49 tahun)',
    '50-64': 'Lansia 50-64 tahun',
    '65-80': 'Lansia 65-80 tahun',
    '80+': 'Lansia >80 tahun',
  }

  result.value = {
    calories: data[ageGroup.value]?.[gender.value as string] || 0,
    group: groupNames[ageGroup.value],
    genderText: gender.value === 'male' ? 'Pria' : 'Wanita'
  }

  await saveCalculation({
    calculator_type: 'nutrition',
    method: 'Kemenkes AKG',
    inputs: {
      gender: gender.value,
      ageGroup: ageGroup.value
    },
    results: result.value
  })
}
</script>
