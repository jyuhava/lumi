<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
      <h4 class="font-bold text-cyan-900 flex items-center space-x-2">
        <ion-icon name="medical" class="text-xl"></ion-icon>
        <span>Holliday-Segar Formula (Standar Emas)</span>
      </h4>
      <p class="text-sm text-cyan-700 mt-1">Formula presisi untuk kebutuhan cairan maintenance - Holliday MA & Segar WE (1957)</p>
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
          placeholder="Contoh: 5"
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
          placeholder="Contoh: 18"
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
          <span>Hasil Perhitungan Holliday-Segar</span>
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

        <!-- Step by step calculation -->
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

          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-bold text-blue-900 mb-1">Formula yang Digunakan:</p>
            <p class="text-sm text-blue-800">{{ result.formula }}</p>
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
          <li>• Cairan yang digunakan: <strong>Awal = Kristaloid isotonis (NS 0.9%, RL)</strong></li>
          <li>• Maintenance jangka panjang: <strong>D5-½NS atau D5-⅕NS</strong> (hipotonis)</li>
          <li>• Monitor urine output: <strong>0.5-1 mL/kg/jam</strong> untuk anak</li>
          <li>• Pantau tanda dehidrasi dan over-hydration</li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
      <h5 class="font-bold text-cyan-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Holliday-Segar Formula</span>
      </h5>
      <div class="text-sm text-cyan-800 space-y-2">
        <p><strong>Referensi:</strong> Holliday MA & Segar WE (1957) - "The maintenance need for water in parenteral fluid therapy"</p>
        
        <p><strong>Formula Lengkap:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-cyan-200 font-mono text-xs space-y-1">
          <p>• Jika BB ≤ 10 kg: Cairan = BB × 100 mL/kg</p>
          <p>• Jika BB 10-20 kg: Cairan = 1000 + [(BB - 10) × 50]</p>
          <p>• Jika BB > 20 kg: Cairan = 1500 + [(BB - 20) × 20]</p>
        </div>

        <p><strong>Contoh Perhitungan:</strong></p>
        <div class="space-y-1 text-xs">
          <p>1. Anak BB 8 kg → 8 × 100 = <strong>800 mL/hari</strong> (33 mL/jam)</p>
          <p>2. Anak BB 15 kg → 1000 + (5 × 50) = <strong>1.250 mL/hari</strong> (52 mL/jam)</p>
          <p>3. Anak BB 30 kg → 1500 + (10 × 20) = <strong>1.700 mL/hari</strong> (71 mL/jam)</p>
        </div>

        <p class="text-xs text-cyan-600 mt-2">Digunakan di seluruh dunia oleh WHO, American Academy of Pediatrics, IDAI</p>
      </div>
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
  return weight.value && weight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value) return

  let fluid24h = 0
  let formula = ''
  let steps: string[] = []

  if (weight.value <= 10) {
    fluid24h = weight.value * 100
    formula = `BB ≤ 10 kg: Cairan = ${weight.value} kg × 100 mL/kg`
    steps = [
      `Berat badan ${weight.value} kg (≤ 10 kg)`,
      `Gunakan formula: BB × 100 mL/kg`,
      `Cairan 24 jam = ${weight.value} × 100 = ${fluid24h.toFixed(0)} mL/hari`,
      `Cairan per jam = ${fluid24h.toFixed(0)} ÷ 24 = ${(fluid24h / 24).toFixed(0)} mL/jam`
    ]
  } else if (weight.value > 10 && weight.value <= 20) {
    const excess = weight.value - 10
    fluid24h = 1000 + (excess * 50)
    formula = `BB 10-20 kg: Cairan = 1000 + [(${weight.value} - 10) × 50]`
    steps = [
      `Berat badan ${weight.value} kg (10-20 kg)`,
      `10 kg pertama: 10 × 100 = 1000 mL`,
      `Sisa ${excess.toFixed(1)} kg: ${excess.toFixed(1)} × 50 = ${(excess * 50).toFixed(0)} mL`,
      `Total: 1000 + ${(excess * 50).toFixed(0)} = ${fluid24h.toFixed(0)} mL/hari`,
      `Cairan per jam = ${fluid24h.toFixed(0)} ÷ 24 = ${(fluid24h / 24).toFixed(0)} mL/jam`
    ]
  } else {
    const excess = weight.value - 20
    fluid24h = 1500 + (excess * 20)
    formula = `BB > 20 kg: Cairan = 1500 + [(${weight.value} - 20) × 20]`
    steps = [
      `Berat badan ${weight.value} kg (> 20 kg)`,
      `10 kg pertama: 10 × 100 = 1000 mL`,
      `10 kg kedua: 10 × 50 = 500 mL`,
      `Sisa ${excess.toFixed(1)} kg: ${excess.toFixed(1)} × 20 = ${(excess * 20).toFixed(0)} mL`,
      `Total: 1000 + 500 + ${(excess * 20).toFixed(0)} = ${fluid24h.toFixed(0)} mL/hari`,
      `Cairan per jam = ${fluid24h.toFixed(0)} ÷ 24 = ${(fluid24h / 24).toFixed(0)} mL/jam`
    ]
  }

  const fluidPerHour = fluid24h / 24

  result.value = {
    fluid24h,
    fluidPerHour,
    formula,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Holliday-Segar Formula',
    inputs: {
      age_years: age.value || 'Tidak diisi',
      weight_kg: weight.value
    },
    results: {
      fluid_24h_ml: fluid24h.toFixed(0),
      fluid_per_hour_ml: fluidPerHour.toFixed(0),
      formula: formula
    }
  })
}
</script>
