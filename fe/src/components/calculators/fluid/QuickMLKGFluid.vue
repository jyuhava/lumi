<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
      <h4 class="font-bold text-cyan-900 flex items-center space-x-2">
        <ion-icon name="flash" class="text-xl"></ion-icon>
        <span>Quick Method - Faktor mL/kg</span>
      </h4>
      <p class="text-sm text-cyan-700 mt-1">Metode cepat berdasarkan usia dengan faktor pengali mL/kg/hari</p>
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
          placeholder="Contoh: 3"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>

      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 14"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Cairan
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div class="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-cyan-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Quick Method</span>
        </h4>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-cyan-300">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Cairan 24 Jam</p>
            <p class="text-5xl font-bold text-cyan-700 mb-1">{{ result.fluid24h.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-blue-300">
            <p class="text-sm text-gray-600 mb-2">Kecepatan per Jam</p>
            <p class="text-5xl font-bold text-blue-700 mb-1">{{ result.fluidPerHour.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/jam</p>
          </div>
        </div>

        <!-- Calculation details -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="information-circle" class="align-middle"></ion-icon> Detail Perhitungan:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <p>• Kelompok usia: <strong>{{ result.ageGroup }}</strong></p>
              <p>• Faktor pengali: <strong>{{ result.factor }} mL/kg/hari</strong></p>
              <p>• Formula: {{ weight }} kg × {{ result.factor }} mL/kg = <strong>{{ result.fluid24h.toFixed(0) }} mL/hari</strong></p>
              <p>• Kecepatan per jam: {{ result.fluid24h.toFixed(0) }} ÷ 24 = <strong>{{ result.fluidPerHour.toFixed(0) }} mL/jam</strong></p>
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
          <li>• Metode ini lebih sederhana untuk estimasi cepat</li>
          <li>• Untuk perhitungan lebih presisi, gunakan Holliday-Segar</li>
          <li>• Monitor urine output: <strong>0.5-1 mL/kg/jam</strong></li>
          <li>• Sesuaikan dengan kondisi klinis dan aktivitas anak</li>
        </ul>
      </div>
    </div>

    <!-- Information Table -->
    <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
      <h5 class="font-bold text-cyan-900 mb-3 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tabel Faktor Pengali Berdasarkan Usia</span>
      </h5>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-cyan-100">
            <tr>
              <th class="px-4 py-2 text-left text-cyan-900">Kelompok Usia</th>
              <th class="px-4 py-2 text-center text-cyan-900">Faktor (mL/kg/hari)</th>
              <th class="px-4 py-2 text-left text-cyan-900">Contoh (BB 10kg)</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr class="border-b border-cyan-100">
              <td class="px-4 py-2">Bayi 0-6 bulan</td>
              <td class="px-4 py-2 text-center font-bold">150</td>
              <td class="px-4 py-2">1.500 mL/hari</td>
            </tr>
            <tr class="border-b border-cyan-100">
              <td class="px-4 py-2">Bayi 7-12 bulan</td>
              <td class="px-4 py-2 text-center font-bold">120-135</td>
              <td class="px-4 py-2">1.200-1.350 mL/hari</td>
            </tr>
            <tr class="border-b border-cyan-100">
              <td class="px-4 py-2">Anak 1-3 tahun</td>
              <td class="px-4 py-2 text-center font-bold">110</td>
              <td class="px-4 py-2">1.100 mL/hari</td>
            </tr>
            <tr class="border-b border-cyan-100">
              <td class="px-4 py-2">Anak 4-8 tahun</td>
              <td class="px-4 py-2 text-center font-bold">100</td>
              <td class="px-4 py-2">1.000 mL/hari</td>
            </tr>
            <tr>
              <td class="px-4 py-2">Anak >8 tahun</td>
              <td class="px-4 py-2 text-center font-bold">80-90</td>
              <td class="px-4 py-2">800-900 mL/hari</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-cyan-600 mt-3">Referensi: Metode alternatif yang digunakan di berbagai institusi kesehatan</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return age.value !== null && age.value >= 0 && weight.value && weight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !age.value || !weight.value) return

  let factor = 100
  let ageGroup = ''

  if (age.value < 0.5) {
    factor = 150
    ageGroup = 'Bayi 0-6 bulan'
  } else if (age.value < 1) {
    factor = 127.5 // average of 120-135
    ageGroup = 'Bayi 7-12 bulan'
  } else if (age.value < 4) {
    factor = 110
    ageGroup = 'Anak 1-3 tahun'
  } else if (age.value < 9) {
    factor = 100
    ageGroup = 'Anak 4-8 tahun'
  } else {
    factor = 85 // average of 80-90
    ageGroup = 'Anak >8 tahun'
  }

  const fluid24h = weight.value * factor
  const fluidPerHour = fluid24h / 24

  result.value = {
    fluid24h,
    fluidPerHour,
    factor,
    ageGroup
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Quick mL/kg Method',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      age_group: ageGroup
    },
    results: {
      factor_ml_kg: factor,
      fluid_24h_ml: fluid24h.toFixed(0),
      fluid_per_hour_ml: fluidPerHour.toFixed(0)
    }
  })
}
</script>
