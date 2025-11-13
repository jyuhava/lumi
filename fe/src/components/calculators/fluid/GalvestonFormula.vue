<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-teal-50 via-emerald-50 to-green-50 rounded-xl p-4 border-2 border-teal-300">
      <h4 class="font-bold text-teal-900 flex items-center space-x-2">
        <ion-icon name="flame" class="text-2xl"></ion-icon>
        <span>Galveston Formula - Pediatric Burn + Albumin</span>
      </h4>
      <p class="text-sm text-teal-700 mt-1">
        Formula pediatrik dengan albumin untuk maintenance oncotic pressure - Shriners Galveston
      </p>
    </div>

    <!-- Pediatric Warning -->
    <div class="bg-teal-100 border-l-4 border-teal-500 p-4 rounded">
      <div class="flex items-start">
        <ion-icon name="people" class="text-2xl text-teal-700 mr-3 flex-shrink-0 mt-1"></ion-icon>
        <div>
          <p class="font-bold text-teal-900">Khusus Pasien Pediatrik dengan Albumin</p>
          <p class="text-sm text-teal-800 mt-1">
            Galveston formula menggunakan volume lebih tinggi (5000 mL/m²) dengan albumin 
            untuk mempertahankan tekanan onkotik dan mencegah edema masif.
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
          placeholder="Contoh: 20"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          placeholder="Contoh: 8"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <!-- Height -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
        <input
          v-model.number="height"
          type="number"
          step="0.1"
          placeholder="Contoh: 125"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
          placeholder="Contoh: 35"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 hover:from-teal-700 hover:via-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Resusitasi Galveston
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
      <div class="bg-gradient-to-br from-teal-50 via-emerald-50 to-green-50 border-2 border-teal-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-teal-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Galveston Formula</span>
        </h4>

        <!-- Total 24h -->
        <div class="bg-white rounded-lg p-6 border-2 border-teal-400 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Cairan 24 Jam (RL + Albumin + D5%)</p>
          <p class="text-6xl font-bold text-teal-700 mb-1">{{ result.total24h.toFixed(0) }}</p>
          <p class="text-sm text-gray-500">mL dalam 24 jam</p>
        </div>

        <!-- Components Breakdown -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-red-100 to-orange-100 rounded-lg p-4 border-2 border-red-300">
            <p class="text-sm font-bold text-red-900 mb-2">Komponen Luka Bakar</p>
            <p class="text-3xl font-bold text-red-700">{{ result.burnComponent.toFixed(0) }} mL</p>
            <p class="text-xs text-gray-600 mt-1">5000 mL/m² × {{ tbsa }}% × {{ result.bsa.toFixed(3) }} m²</p>
          </div>

          <div class="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-4 border-2 border-blue-300">
            <p class="text-sm font-bold text-blue-900 mb-2">Komponen Maintenance</p>
            <p class="text-3xl font-bold text-blue-700">{{ result.maintenanceComponent.toFixed(0) }} mL</p>
            <p class="text-xs text-gray-600 mt-1">2000 mL/m² × {{ result.bsa.toFixed(3) }} m²</p>
          </div>
        </div>

        <!-- Time Schedule -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg p-6 border-2 border-emerald-400">
            <p class="text-sm font-bold text-emerald-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 8 JAM PERTAMA (50%)
            </p>
            <p class="text-4xl font-bold text-emerald-700 mb-1">{{ result.first8h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 8 jam</p>
            <p class="text-2xl font-bold text-emerald-600 mt-3">{{ result.rateFirst8h.toFixed(0) }} mL/jam</p>
          </div>

          <div class="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 border-2 border-indigo-400">
            <p class="text-sm font-bold text-indigo-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 16 JAM BERIKUTNYA (50%)
            </p>
            <p class="text-4xl font-bold text-indigo-700 mb-1">{{ result.next16h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 16 jam</p>
            <p class="text-2xl font-bold text-indigo-600 mt-3">{{ result.rateNext16h.toFixed(0) }} mL/jam</p>
          </div>
        </div>

        <!-- Albumin Requirement -->
        <div class="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-yellow-900 mb-2">
            <ion-icon name="medkit" class="align-middle"></ion-icon> Kebutuhan Albumin 25%:
          </p>
          <p class="text-3xl font-bold text-yellow-700">{{ result.albumin25Required.toFixed(0) }} mL</p>
          <p class="text-xs text-gray-600 mt-1">12.5 g Albumin per liter RL = {{ result.albumin25Required.toFixed(0) }} mL Albumin 25%</p>
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

      <!-- Clinical Protocol -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-3 flex items-center space-x-2">
          <ion-icon name="medical" class="text-xl"></ion-icon>
          <span>Protokol Galveston</span>
        </h5>
        <div class="text-sm text-amber-800 space-y-2">
          <p><strong>Komposisi Cairan:</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• <strong>Base Solution:</strong> Ringer Laktat (RL)</li>
            <li>• <strong>Albumin 25%:</strong> 12.5 g per liter RL ({{ result.albumin25Required.toFixed(0) }} mL untuk {{ (result.total24h / 1000).toFixed(1) }} L)</li>
            <li>• <strong>Dekstrosa 5%:</strong> Sesuai kebutuhan untuk mencegah hipoglikemia</li>
          </ul>

          <p><strong>Monitoring Intensif:</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• <strong>Urine Output:</strong> 0.5-1 mL/kg/jam = {{ (weight! * 0.5).toFixed(0) }}-{{ weight }} mL/jam</li>
            <li>• <strong>Albumin Serum:</strong> Target >2 g/dL (tambah albumin jika <2 g/dL)</li>
            <li>• <strong>Elektrolit:</strong> Cek setiap 4-6 jam (Na, K, Cl, albumin)</li>
            <li>• <strong>Vital Signs:</strong> MAP >65 mmHg, HR sesuai usia</li>
          </ul>

          <p><strong>Keunggulan Galveston:</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• Mempertahankan tekanan onkotik dengan albumin</li>
            <li>• Mengurangi edema interstitial masif</li>
            <li>• Cocok untuk luka bakar luas pada anak</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-teal-50 border-2 border-teal-300 rounded-xl p-4">
      <h5 class="font-bold text-teal-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Galveston Formula</span>
      </h5>
      <div class="text-sm text-teal-800 space-y-2">
        <p><strong>Dikembangkan oleh:</strong> Shriners Hospitals for Children - Galveston, Texas</p>

        <p><strong>Formula Lengkap:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-teal-200 text-xs space-y-1">
          <p class="font-mono">Total 24h = (5000 mL/m² × %TBSA × BSA) + (2000 mL/m² × BSA)</p>
          <p class="mt-2">BSA = √[(Tinggi cm × BB kg) / 3600]</p>
          <p class="mt-2">Cairan: RL + Albumin 25% (12.5 g/L) + Dekstrosa 5%</p>
        </div>

        <p><strong>Perbandingan dengan Formula Lain:</strong></p>
        <ul class="text-xs space-y-1 ml-4">
          <li>• <strong>Parkland:</strong> 4 mL/kg/%TBSA (kristaloid saja)</li>
          <li>• <strong>Cincinnati:</strong> 4 mL/kg/%TBSA + 1500 mL/m²/BSA</li>
          <li>• <strong>Galveston:</strong> 5000 mL/m²/%TBSA + 2000 mL/m²/BSA + <strong>Albumin</strong></li>
        </ul>

        <p><strong>Indikasi Khusus:</strong> Luka bakar luas >40% TBSA pada anak, burn dengan syok berat, hypoalbuminemia</p>

        <p class="text-xs text-teal-600 mt-2">
          <strong>Referensi:</strong> Shriners Hospitals for Children Galveston Protocol, 
          Pediatric Critical Care Medicine, Journal of Burn Care & Research
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

  // Galveston Formula: (5000 mL/m² × %TBSA × BSA) + (2000 mL/m² × BSA)
  const burnComponent = 5000 * (tbsa.value / 100) * bsa
  const maintenanceComponent = 2000 * bsa
  const total24h = burnComponent + maintenanceComponent

  // 50-50 split
  const first8h = total24h / 2
  const next16h = total24h / 2
  const rateFirst8h = first8h / 8
  const rateNext16h = next16h / 16

  // Albumin 25% requirement: 12.5 g per liter RL
  // 1 mL Albumin 25% = 0.25 g albumin
  // For 12.5 g/L: 12.5 / 0.25 = 50 mL Albumin 25% per liter
  const totalLiters = total24h / 1000
  const albumin25Required = totalLiters * 50 // mL of Albumin 25%

  const steps = [
    `Tinggi: ${height.value} cm, Berat: ${weight.value} kg`,
    `BSA (Mosteller) = √[(${height.value} × ${weight.value}) / 3600] = ${bsa.toFixed(3)} m²`,
    `Komponen luka bakar: 5000 mL/m² × ${tbsa.value}% × ${bsa.toFixed(3)} = ${burnComponent.toFixed(0)} mL`,
    `Komponen maintenance: 2000 mL/m² × ${bsa.toFixed(3)} = ${maintenanceComponent.toFixed(0)} mL`,
    `Total 24 jam = ${burnComponent.toFixed(0)} + ${maintenanceComponent.toFixed(0)} = ${total24h.toFixed(0)} mL`,
    `50% pertama (8 jam): ${first8h.toFixed(0)} mL = ${rateFirst8h.toFixed(0)} mL/jam`,
    `50% kedua (16 jam): ${next16h.toFixed(0)} mL = ${rateNext16h.toFixed(0)} mL/jam`,
    `Kebutuhan Albumin 25%: ${albumin25Required.toFixed(0)} mL (12.5 g/L)`
  ]

  result.value = {
    bsa,
    burnComponent,
    maintenanceComponent,
    total24h,
    first8h,
    next16h,
    rateFirst8h,
    rateNext16h,
    albumin25Required,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Galveston Formula (Pediatric)',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      height_cm: height.value,
      tbsa_percent: tbsa.value
    },
    results: {
      bsa_m2: bsa.toFixed(3),
      burn_component_ml: burnComponent.toFixed(0),
      maintenance_component_ml: maintenanceComponent.toFixed(0),
      total_24h_ml: total24h.toFixed(0),
      first_8h_ml: first8h.toFixed(0),
      rate_first_8h_ml_per_hour: rateFirst8h.toFixed(0),
      albumin_25_required_ml: albumin25Required.toFixed(0)
    }
  })
}
</script>
