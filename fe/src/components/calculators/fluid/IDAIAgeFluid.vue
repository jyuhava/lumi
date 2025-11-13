<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
      <h4 class="font-bold text-emerald-900 flex items-center space-x-2">
        <ion-icon name="medical" class="text-xl"></ion-icon>
        <span>Standar IDAI Berdasarkan Usia</span>
      </h4>
      <p class="text-sm text-emerald-700 mt-1">Rekomendasi Ikatan Dokter Anak Indonesia (IDAI) & Permenkes RI</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          min="0"
          max="18"
          placeholder="Contoh: 5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <!-- Gender (for ages 9-18) -->
      <div v-if="age !== null && age >= 9">
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        >
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Cairan
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div class="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-emerald-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Standar IDAI</span>
        </h4>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-emerald-300">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Cairan 24 Jam</p>
            <p class="text-5xl font-bold text-emerald-700 mb-1">{{ result.fluid24h }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-teal-300">
            <p class="text-sm text-gray-600 mb-2">Kecepatan per Jam</p>
            <p class="text-5xl font-bold text-teal-700 mb-1">{{ result.fluidPerHour }}</p>
            <p class="text-sm text-gray-500">mL/jam</p>
          </div>
        </div>

        <!-- Calculation details -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="information-circle" class="align-middle"></ion-icon> Detail:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <p>• Kelompok usia: <strong>{{ result.ageGroup }}</strong></p>
              <p v-if="result.gender">• Jenis kelamin: <strong>{{ result.gender === 'male' ? 'Laki-laki' : 'Perempuan' }}</strong></p>
              <p>• Standar IDAI: <strong>{{ result.fluid24h }} mL/hari</strong></p>
              <p>• Setara dengan: <strong>{{ (result.fluid24h / 1000).toFixed(1) }} liter/hari</strong></p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-2 flex items-center space-x-2">
          <ion-icon name="bulb" class="text-xl"></ion-icon>
          <span>Catatan Klinis</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-1">
          <li>• Nilai ini adalah rata-rata untuk anak sehat dengan aktivitas normal</li>
          <li>• Tambahkan cairan jika anak demam, diare, atau aktivitas tinggi</li>
          <li>• Sumber: Air minum, makanan berkuah, buah-buahan</li>
          <li>• Hindari minuman manis berlebihan</li>
        </ul>
      </div>
    </div>

    <!-- Information Table -->
    <div class="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
      <h5 class="font-bold text-emerald-900 mb-3 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Standar Kebutuhan Air IDAI & Permenkes RI</span>
      </h5>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-emerald-100">
            <tr>
              <th class="px-4 py-2 text-left text-emerald-900">Kelompok Usia</th>
              <th class="px-4 py-2 text-center text-emerald-900">Jenis Kelamin</th>
              <th class="px-4 py-2 text-center text-emerald-900">Kebutuhan Cairan</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Bayi 0-6 bulan</td>
              <td class="px-4 py-2 text-center">-</td>
              <td class="px-4 py-2 text-center font-bold">700 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Bayi 7-12 bulan</td>
              <td class="px-4 py-2 text-center">-</td>
              <td class="px-4 py-2 text-center font-bold">800 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Anak 1-3 tahun</td>
              <td class="px-4 py-2 text-center">-</td>
              <td class="px-4 py-2 text-center font-bold">1.300 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Anak 4-8 tahun</td>
              <td class="px-4 py-2 text-center">-</td>
              <td class="px-4 py-2 text-center font-bold">1.700 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Anak 9-13 tahun</td>
              <td class="px-4 py-2 text-center">Laki-laki</td>
              <td class="px-4 py-2 text-center font-bold">2.400 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Anak 9-13 tahun</td>
              <td class="px-4 py-2 text-center">Perempuan</td>
              <td class="px-4 py-2 text-center font-bold">2.100 mL/hari</td>
            </tr>
            <tr class="border-b border-emerald-100">
              <td class="px-4 py-2">Remaja 14-18 tahun</td>
              <td class="px-4 py-2 text-center">Laki-laki</td>
              <td class="px-4 py-2 text-center font-bold">3.300 mL/hari</td>
            </tr>
            <tr>
              <td class="px-4 py-2">Remaja 14-18 tahun</td>
              <td class="px-4 py-2 text-center">Perempuan</td>
              <td class="px-4 py-2 text-center font-bold">2.300 mL/hari</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-emerald-600 mt-3">
        <strong>Referensi:</strong> Konsensus Ikatan Dokter Anak Indonesia (IDAI) dan Permenkes RI No. 28/2019 tentang Angka Kecukupan Gizi
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const gender = ref<'male' | 'female'>('male')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return age.value !== null && age.value >= 0 && age.value <= 18
})

const calculate = async () => {
  if (!canCalculate.value || age.value === null) return

  let fluid24h = 0
  let ageGroup = ''

  if (age.value < 0.5) {
    fluid24h = 700
    ageGroup = 'Bayi 0-6 bulan'
  } else if (age.value < 1) {
    fluid24h = 800
    ageGroup = 'Bayi 7-12 bulan'
  } else if (age.value < 4) {
    fluid24h = 1300
    ageGroup = 'Anak 1-3 tahun'
  } else if (age.value < 9) {
    fluid24h = 1700
    ageGroup = 'Anak 4-8 tahun'
  } else if (age.value < 14) {
    if (gender.value === 'male') {
      fluid24h = 2400
      ageGroup = 'Anak 9-13 tahun (Laki-laki)'
    } else {
      fluid24h = 2100
      ageGroup = 'Anak 9-13 tahun (Perempuan)'
    }
  } else {
    if (gender.value === 'male') {
      fluid24h = 3300
      ageGroup = 'Remaja 14-18 tahun (Laki-laki)'
    } else {
      fluid24h = 2300
      ageGroup = 'Remaja 14-18 tahun (Perempuan)'
    }
  }

  const fluidPerHour = Math.round(fluid24h / 24)

  result.value = {
    fluid24h,
    fluidPerHour,
    ageGroup,
    gender: age.value >= 9 ? gender.value : null
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'IDAI Age-Based Standard',
    inputs: {
      age_years: age.value,
      gender: age.value >= 9 ? (gender.value === 'male' ? 'Laki-laki' : 'Perempuan') : 'Tidak relevan',
      age_group: ageGroup
    },
    results: {
      fluid_24h_ml: fluid24h.toString(),
      fluid_per_hour_ml: fluidPerHour.toString()
    }
  })
}
</script>
