<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-pink-50 via-rose-50 to-red-50 rounded-xl p-4 border-2 border-pink-300">
      <h4 class="font-bold text-pink-900 flex items-center space-x-2">
        <ion-icon name="flame" class="text-2xl"></ion-icon>
        <span>Cincinnati Formula - Pediatric Burn</span>
      </h4>
      <p class="text-sm text-pink-700 mt-1">
        Formula khusus anak dengan luka bakar - Shriners Hospital Cincinnati
      </p>
    </div>

    <!-- Pediatric Warning -->
    <div class="bg-pink-100 border-l-4 border-pink-500 p-4 rounded">
      <div class="flex items-start">
        <ion-icon name="people" class="text-2xl text-pink-700 mr-3 flex-shrink-0 mt-1"></ion-icon>
        <div>
          <p class="font-bold text-pink-900">Khusus Pasien Pediatrik</p>
          <p class="text-sm text-pink-800 mt-1">
            Formula ini dikembangkan khusus untuk anak-anak dengan luka bakar. 
            Mempertimbangkan BSA (Body Surface Area) untuk perhitungan lebih akurat.
          </p>
        </div>
      </div>
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
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          placeholder="Contoh: 5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <!-- Height -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 110"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>

      <!-- TBSA -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Luas Luka Bakar (% TBSA)</label>
        <input
          v-model.number="tbsa"
          type="number"
          step="0.1"
          min="0"
          max="100"
          placeholder="Contoh: 25"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 hover:from-pink-700 hover:via-rose-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Resusitasi Cincinnati
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- BSA Display -->
      <div class="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
        <p class="font-bold text-purple-900 mb-2">Body Surface Area (BSA):</p>
        <p class="text-4xl font-bold text-purple-700">{{ result.bsa.toFixed(3) }} m²</p>
        <p class="text-xs text-purple-600 mt-1">Dihitung menggunakan formula Mosteller</p>
      </div>

      <!-- Main Result -->
      <div class="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 border-2 border-pink-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-pink-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Cincinnati Formula</span>
        </h4>

        <!-- Total 24h -->
        <div class="bg-white rounded-lg p-6 border-2 border-pink-400 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Cairan 24 Jam</p>
          <p class="text-6xl font-bold text-pink-700 mb-1">{{ result.total24h.toFixed(0) }}</p>
          <p class="text-sm text-gray-500">mL dalam 24 jam</p>
        </div>

        <!-- Age-based schedule -->
        <div v-if="age! < 12" class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
          <p class="font-bold text-yellow-900 mb-2">
            <ion-icon name="warning" class="align-middle"></ion-icon> Protokol Usia <12 Tahun (Komposisi Berubah)
          </p>
          <div class="grid md:grid-cols-3 gap-3 text-sm">
            <div class="bg-white p-3 rounded-lg border border-red-200">
              <p class="text-xs text-gray-600 font-bold">8 JAM PERTAMA</p>
              <p class="text-lg font-bold text-red-700">{{ result.first8h.toFixed(0) }} mL</p>
              <p class="text-xs text-gray-600 mt-1">RL + 50 mEq NaHCO₃</p>
              <p class="text-sm font-bold text-red-600 mt-1">{{ result.rateFirst8h.toFixed(0) }} mL/jam</p>
            </div>
            <div class="bg-white p-3 rounded-lg border border-orange-200">
              <p class="text-xs text-gray-600 font-bold">8 JAM KEDUA</p>
              <p class="text-lg font-bold text-orange-700">{{ result.second8h.toFixed(0) }} mL</p>
              <p class="text-xs text-gray-600 mt-1">RL saja</p>
              <p class="text-sm font-bold text-orange-600 mt-1">{{ result.rateSecond8h.toFixed(0) }} mL/jam</p>
            </div>
            <div class="bg-white p-3 rounded-lg border border-blue-200">
              <p class="text-xs text-gray-600 font-bold">8 JAM KETIGA</p>
              <p class="text-lg font-bold text-blue-700">{{ result.third8h.toFixed(0) }} mL</p>
              <p class="text-xs text-gray-600 mt-1">RL + Albumin 25% 12.5g/L</p>
              <p class="text-sm font-bold text-blue-600 mt-1">{{ result.rateThird8h.toFixed(0) }} mL/jam</p>
            </div>
          </div>
        </div>

        <div v-else class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg p-6 border-2 border-rose-400">
            <p class="text-sm font-bold text-rose-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 8 JAM PERTAMA (50%)
            </p>
            <p class="text-4xl font-bold text-rose-700 mb-1">{{ result.first8h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 8 jam</p>
            <p class="text-2xl font-bold text-rose-600 mt-3">{{ result.rateFirst8h.toFixed(0) }} mL/jam</p>
          </div>

          <div class="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 border-2 border-blue-400">
            <p class="text-sm font-bold text-blue-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 16 JAM BERIKUTNYA (50%)
            </p>
            <p class="text-4xl font-bold text-blue-700 mb-1">{{ result.next16h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 16 jam</p>
            <p class="text-2xl font-bold text-blue-600 mt-3">{{ result.rateNext16h.toFixed(0) }} mL/jam</p>
          </div>
        </div>

        <!-- Calculation steps -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p class="text-sm font-bold text-purple-900 mb-2">
            <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan:
          </p>
          <div class="space-y-1 text-sm text-purple-800">
            <div v-for="(step, index) in result.steps" :key="index" class="flex items-start">
              <span class="font-mono mr-2">{{ index + 1 }}.</span>
              <span>{{ step }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Clinical Notes -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-3 flex items-center space-x-2">
          <ion-icon name="medical" class="text-xl"></ion-icon>
          <span>Protokol Cincinnati untuk Anak</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-2">
          <li>• <strong>Target Urine Output:</strong> 0.5-1 mL/kg/jam untuk anak ({{ (weight! * 0.5).toFixed(0) }}-{{ (weight! * 1).toFixed(0) }} mL/jam)</li>
          <li>• <strong>Komposisi Cairan (usia <12 tahun):</strong> Berubah setiap 8 jam untuk optimalisasi elektrolit</li>
          <li>• <strong>Monitoring Ketat:</strong> Vital signs, urine output, elektrolit serum setiap 4-6 jam</li>
          <li>• <strong>BSA-Based Calculation:</strong> Lebih akurat untuk populasi pediatrik</li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-pink-50 border-2 border-pink-300 rounded-xl p-4">
      <h5 class="font-bold text-pink-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Cincinnati Formula</span>
      </h5>
      <div class="text-sm text-pink-800 space-y-2">
        <p><strong>Dikembangkan oleh:</strong> Shriners Hospital for Children - Cincinnati, Ohio (Burn Center)</p>

        <p><strong>Formula:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-pink-200 text-xs space-y-1">
          <p class="font-mono">Total 24h = (4 mL/kg × %TBSA) + (1500 mL/m² × BSA total)</p>
          <p class="mt-2">BSA = √[(Tinggi cm × BB kg) / 3600]</p>
        </div>

        <p><strong>Protokol Usia <12 tahun:</strong></p>
        <ul class="text-xs space-y-1 ml-4">
          <li>• <strong>0-8 jam:</strong> RL + 50 mEq NaHCO₃ (koreksi asidosis)</li>
          <li>• <strong>8-16 jam:</strong> RL saja</li>
          <li>• <strong>16-24 jam:</strong> RL + Albumin 25% 12.5 g/L (maintenance oncotic pressure)</li>
        </ul>

        <p><strong>Protokol Usia ≥12 tahun:</strong> Sama seperti dewasa (50% dalam 8 jam, 50% dalam 16 jam)</p>

        <p class="text-xs text-pink-600 mt-2">
          <strong>Referensi:</strong> Shriners Hospitals for Children Burn Center Protocol, 
          Pediatric Burn Resuscitation Guidelines
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const age = ref<number | null>(null)
const height = ref<number | null>(null)
const tbsa = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && 
         age.value !== null && age.value >= 0 &&
         height.value && height.value > 0 &&
         tbsa.value && tbsa.value > 0 && tbsa.value <= 100
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value || !age.value || !height.value || !tbsa.value) return

  // Calculate BSA using Mosteller formula
  const bsa = Math.sqrt((height.value * weight.value) / 3600)

  // Cincinnati Formula: (4 mL/kg × %TBSA) + (1500 mL/m² × BSA)
  const burnComponent = 4 * weight.value * tbsa.value
  const maintenanceComponent = 1500 * bsa
  const total24h = burnComponent + maintenanceComponent

  let first8h, second8h, third8h, next16h
  let rateFirst8h, rateSecond8h, rateThird8h, rateNext16h

  if (age.value < 12) {
    // Split into 3 equal 8-hour periods
    first8h = total24h / 3
    second8h = total24h / 3
    third8h = total24h / 3
    rateFirst8h = first8h / 8
    rateSecond8h = second8h / 8
    rateThird8h = third8h / 8
    next16h = 0
    rateNext16h = 0
  } else {
    // Standard 50-50 split
    first8h = total24h / 2
    next16h = total24h / 2
    rateFirst8h = first8h / 8
    rateNext16h = next16h / 16
    second8h = 0
    third8h = 0
    rateSecond8h = 0
    rateThird8h = 0
  }

  const steps = [
    `Tinggi: ${height.value} cm, Berat: ${weight.value} kg`,
    `BSA (Mosteller) = √[(${height.value} × ${weight.value}) / 3600] = ${bsa.toFixed(3)} m²`,
    `Komponen luka bakar: 4 mL/kg × ${tbsa.value}% = 4 × ${weight.value} × ${tbsa.value} = ${burnComponent.toFixed(0)} mL`,
    `Komponen maintenance: 1500 mL/m² × ${bsa.toFixed(3)} = ${maintenanceComponent.toFixed(0)} mL`,
    `Total 24 jam = ${burnComponent.toFixed(0)} + ${maintenanceComponent.toFixed(0)} = ${total24h.toFixed(0)} mL`,
    age.value < 12 
      ? `Usia <12 tahun: Bagi 3 periode 8 jam masing-masing ${(total24h / 3).toFixed(0)} mL`
      : `Usia ≥12 tahun: 50% (${first8h.toFixed(0)} mL) dalam 8 jam, 50% (${next16h.toFixed(0)} mL) dalam 16 jam`
  ]

  result.value = {
    bsa,
    total24h,
    first8h,
    second8h,
    third8h,
    next16h,
    rateFirst8h,
    rateSecond8h,
    rateThird8h,
    rateNext16h,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Cincinnati Formula (Pediatric)',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      height_cm: height.value,
      tbsa_percent: tbsa.value
    },
    results: {
      bsa_m2: bsa.toFixed(3),
      total_24h_ml: total24h.toFixed(0),
      first_8h_ml: first8h.toFixed(0),
      rate_first_8h_ml_per_hour: rateFirst8h.toFixed(0)
    }
  })
}
</script>
