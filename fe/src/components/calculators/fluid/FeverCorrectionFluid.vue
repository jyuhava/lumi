<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="thermometer" class="text-xl"></ion-icon>
        <span>Koreksi Cairan untuk Demam</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">Tambahan 12-15% per 1°C kenaikan suhu dari 37,5°C</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 15"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- Body Temperature -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Suhu Tubuh (°C)</label>
        <input
          v-model.number="temperature"
          type="number"
          step="0.1"
          placeholder="Contoh: 39.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <!-- Correction Factor -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Faktor Koreksi (%/°C)</label>
        <select
          v-model.number="correctionFactor"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option :value="12">12% (konservatif)</option>
          <option :value="13">13%</option>
          <option :value="14">14%</option>
          <option :value="15">15% (agresif)</option>
        </select>
      </div>

      <!-- Age (for baseline calculation) -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun) - untuk kebutuhan basal</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          placeholder="Contoh: 5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Cairan dengan Koreksi Demam
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Temperature Status -->
      <div :class="[
        'border-2 rounded-xl p-4',
        result.tempRise > 0 ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300'
      ]">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-bold" :class="result.tempRise > 0 ? 'text-red-900' : 'text-green-900'">
              Status Suhu
            </p>
            <p class="text-3xl font-bold mt-1" :class="result.tempRise > 0 ? 'text-red-700' : 'text-green-700'">
              {{ temperature }}°C
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-600">Kenaikan dari 37,5°C</p>
            <p class="text-3xl font-bold" :class="result.tempRise > 0 ? 'text-red-700' : 'text-green-700'">
              +{{ result.tempRise.toFixed(1) }}°C
            </p>
          </div>
        </div>
      </div>

      <!-- Main Result -->
      <div class="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-red-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan dengan Koreksi Demam</span>
        </h4>

        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-blue-300">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Basal</p>
            <p class="text-3xl font-bold text-blue-700 mb-1">{{ result.basalFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-orange-300">
            <p class="text-sm text-gray-600 mb-2">Tambahan Demam</p>
            <p class="text-3xl font-bold text-orange-700 mb-1">+{{ result.feverAddition.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-red-300">
            <p class="text-sm text-gray-600 mb-2">Total Cairan</p>
            <p class="text-3xl font-bold text-red-700 mb-1">{{ result.totalFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>
        </div>

        <!-- Calculation steps -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan Langkah-demi-Langkah:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <div v-for="(step, index) in result.steps" :key="index" class="flex items-start">
                <span class="font-mono mr-2">{{ index + 1 }}.</span>
                <span>{{ step }}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-indigo-200">
            <p class="text-sm text-gray-600">Kecepatan Infus</p>
            <p class="text-4xl font-bold text-indigo-700">{{ result.fluidPerHour.toFixed(0) }} <span class="text-lg">mL/jam</span></p>
          </div>
        </div>
      </div>

      <!-- Clinical Notes -->
      <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-2 flex items-center space-x-2">
          <ion-icon name="warning" class="text-xl"></ion-icon>
          <span>Catatan Klinis Penting</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-1">
          <li>• Tambahkan cairan <strong>{{ correctionFactor }}% untuk setiap 1°C</strong> kenaikan suhu dari 37,5°C</li>
          <li>• Monitor tanda dehidrasi: turgor kulit, mata cekung, urine output</li>
          <li>• Target urine output: <strong>0.5-1 mL/kg/jam</strong> untuk anak</li>
          <li>• Berikan antipiretik (paracetamol/ibuprofen) sesuai dosis</li>
          <li>• Re-evaluasi setiap 4-6 jam atau jika suhu berubah</li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Koreksi Cairan pada Demam</span>
      </h5>
      <div class="text-sm text-red-800 space-y-2">
        <p><strong>Dasar Fisiologis:</strong></p>
        <p class="text-xs">Setiap kenaikan 1°C suhu tubuh meningkatkan metabolisme basal sekitar 12-15%, yang meningkatkan kehilangan cairan melalui insensible water loss (pernapasan dan kulit).</p>

        <p><strong>Formula Koreksi:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-red-200 font-mono text-xs">
          <p>Tambahan Cairan = Kebutuhan Basal × (Faktor %) × (Kenaikan Suhu)</p>
          <p class="mt-2">Contoh: 1.250 mL × 12% × 1,5°C = 225 mL tambahan</p>
        </div>

        <p><strong>Panduan Kenaikan Suhu:</strong></p>
        <ul class="text-xs space-y-1">
          <li>• Normal: 36,5 - 37,5°C</li>
          <li>• Subfebris: 37,5 - 38°C → Tambah 6-7,5%</li>
          <li>• Demam: 38 - 39°C → Tambah 12-22,5%</li>
          <li>• Demam tinggi: >39°C → Tambah >22,5%</li>
        </ul>

        <p class="text-xs text-red-600 mt-2"><strong>Referensi:</strong> WHO, IDAI, Konsensus Terapi Cairan pada Anak</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const temperature = ref<number | null>(null)
const correctionFactor = ref<number>(12)
const age = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && 
         temperature.value && temperature.value > 0 &&
         age.value !== null && age.value >= 0
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value || !temperature.value || age.value === null) return

  // Calculate basal fluid using Holliday-Segar for children or 30 mL/kg for adults
  let basalFluid = 0
  if (age.value >= 18) {
    basalFluid = weight.value * 30
  } else {
    if (weight.value <= 10) {
      basalFluid = weight.value * 100
    } else if (weight.value <= 20) {
      basalFluid = 1000 + ((weight.value - 10) * 50)
    } else {
      basalFluid = 1500 + ((weight.value - 20) * 20)
    }
  }

  const normalTemp = 37.5
  const tempRise = Math.max(0, temperature.value - normalTemp)
  
  const feverAddition = tempRise > 0 ? (basalFluid * (correctionFactor / 100) * tempRise) : 0
  const totalFluid = basalFluid + feverAddition
  const fluidPerHour = totalFluid / 24

  const steps = [
    `Kebutuhan basal: ${basalFluid.toFixed(0)} mL/hari (${age.value >= 18 ? '30 mL/kg' : 'Holliday-Segar'})`,
    `Suhu tubuh: ${temperature.value}°C`,
    `Kenaikan suhu dari 37,5°C: ${tempRise.toFixed(1)}°C`,
    `Faktor koreksi: ${correctionFactor}% per 1°C`,
    `Tambahan cairan = ${basalFluid.toFixed(0)} × ${correctionFactor}% × ${tempRise.toFixed(1)} = ${feverAddition.toFixed(0)} mL`,
    `Total cairan 24 jam = ${basalFluid.toFixed(0)} + ${feverAddition.toFixed(0)} = ${totalFluid.toFixed(0)} mL/hari`,
    `Kecepatan per jam = ${totalFluid.toFixed(0)} ÷ 24 = ${fluidPerHour.toFixed(0)} mL/jam`
  ]

  result.value = {
    basalFluid,
    tempRise,
    feverAddition,
    totalFluid,
    fluidPerHour,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Fever Correction Fluid',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      temperature_celsius: temperature.value,
      correction_factor_percent: correctionFactor
    },
    results: {
      basal_fluid_ml: basalFluid.toFixed(0),
      temperature_rise_celsius: tempRise.toFixed(1),
      fever_addition_ml: feverAddition.toFixed(0),
      total_fluid_ml: totalFluid.toFixed(0),
      fluid_per_hour_ml: fluidPerHour.toFixed(0)
    }
  })
}
</script>
