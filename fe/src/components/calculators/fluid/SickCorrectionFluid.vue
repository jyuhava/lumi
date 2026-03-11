<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
      <h4 class="font-bold text-rose-900 flex items-center space-x-2">
        <ion-icon name="medkit" class="text-xl"></ion-icon>
        <span>Koreksi Cairan pada Kondisi Sakit</span>
      </h4>
      <p class="text-sm text-rose-700 mt-1">Penambahan cairan untuk diare, muntah, dan kondisi hipermetabolik</p>
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
          placeholder="Contoh: 12"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          step="0.1"
          placeholder="Contoh: 3"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
      </div>

      <!-- Condition -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Kondisi Klinis</label>
        <select
          v-model="condition"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        >
          <option value="">-- Pilih Kondisi --</option>
          <optgroup label="Gangguan Gastrointestinal">
            <option value="diarrhea_mild">Diare Ringan (+10%)</option>
            <option value="diarrhea_moderate">Diare Sedang (+25%)</option>
            <option value="diarrhea_severe">Diare Berat (+50%)</option>
            <option value="vomiting_mild">Muntah Ringan (+10%)</option>
            <option value="vomiting_moderate">Muntah Sedang (+15%)</option>
            <option value="vomiting_severe">Muntah Berat (+25%)</option>
          </optgroup>
          <optgroup label="Kondisi Hipermetabolik">
            <option value="hypermetabolic">Hipermetabolik (+20-30%)</option>
            <option value="sweating">Hiperhidrosis/Keringat Berlebih (+15%)</option>
            <option value="perioperative">Perioperatif/Anestesi (+10-15%)</option>
          </optgroup>
        </select>
      </div>

      <!-- Custom Addition (optional) -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">
          Atau Masukkan Penambahan Kustom (%)
        </label>
        <input
          v-model.number="customAddition"
          type="number"
          step="1"
          min="0"
          max="100"
          placeholder="Contoh: 20 (opsional)"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Cairan dengan Koreksi
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div class="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-rose-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan dengan Koreksi</span>
        </h4>

        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-blue-300">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Basal</p>
            <p class="text-3xl font-bold text-blue-700 mb-1">{{ result.basalFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-orange-300">
            <p class="text-sm text-gray-600 mb-2">Tambahan {{ result.additionPercent }}%</p>
            <p class="text-3xl font-bold text-orange-700 mb-1">+{{ result.addition.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-rose-300">
            <p class="text-sm text-gray-600 mb-2">Total Cairan</p>
            <p class="text-3xl font-bold text-rose-700 mb-1">{{ result.totalFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>
        </div>

        <!-- Calculation details -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <p>• Kondisi: <strong>{{ result.conditionLabel }}</strong></p>
              <p>• Kebutuhan basal: {{ result.basalFluid.toFixed(0) }} mL/hari (Holliday-Segar)</p>
              <p>• Penambahan: {{ result.basalFluid.toFixed(0) }} × {{ result.additionPercent }}% = {{ result.addition.toFixed(0) }} mL</p>
              <p>• Total: {{ result.basalFluid.toFixed(0) }} + {{ result.addition.toFixed(0) }} = <strong>{{ result.totalFluid.toFixed(0) }} mL/hari</strong></p>
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
          <span>Catatan Klinis</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-1">
          <li>• Monitor tanda dehidrasi dan elektrolit</li>
          <li>• Target urine output: <strong>0.5-1 mL/kg/jam</strong></li>
          <li>• Untuk diare berat, pertimbangkan oralit/rehidrasi oral</li>
          <li>• Re-evaluasi kebutuhan cairan setiap 4-6 jam</li>
          <li>• Sesuaikan dengan kondisi klinis dan respons pasien</li>
        </ul>
      </div>
    </div>

    <!-- Information Table -->
    <div class="bg-rose-50 border border-rose-200 rounded-xl p-4">
      <h5 class="font-bold text-rose-900 mb-3 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Panduan Penambahan Cairan Berdasarkan Kondisi</span>
      </h5>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-rose-100">
            <tr>
              <th class="px-4 py-2 text-left text-rose-900">Kondisi</th>
              <th class="px-4 py-2 text-center text-rose-900">Penambahan</th>
              <th class="px-4 py-2 text-left text-rose-900">Catatan</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2 font-bold" colspan="3">Gangguan Gastrointestinal</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Diare Ringan</td>
              <td class="px-4 py-2 text-center font-bold">+10%</td>
              <td class="px-4 py-2 text-xs">3-5x BAB/hari, masih mau minum</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Diare Sedang</td>
              <td class="px-4 py-2 text-center font-bold">+25%</td>
              <td class="px-4 py-2 text-xs">6-10x BAB/hari, turgor kulit menurun</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Diare Berat</td>
              <td class="px-4 py-2 text-center font-bold">+50%</td>
              <td class="px-4 py-2 text-xs">>10x BAB/hari, dehidrasi berat</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Muntah Ringan</td>
              <td class="px-4 py-2 text-center font-bold">+10%</td>
              <td class="px-4 py-2 text-xs">2-3x/hari, masih bisa minum</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Muntah Sedang</td>
              <td class="px-4 py-2 text-center font-bold">+15%</td>
              <td class="px-4 py-2 text-xs">4-6x/hari, minum sedikit</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Muntah Berat</td>
              <td class="px-4 py-2 text-center font-bold">+25%</td>
              <td class="px-4 py-2 text-xs">>6x/hari, tidak bisa minum</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2 font-bold" colspan="3">Kondisi Lain</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Hipermetabolik</td>
              <td class="px-4 py-2 text-center font-bold">+20-30%</td>
              <td class="px-4 py-2 text-xs">Hipertiroid, sepsis, luka bakar</td>
            </tr>
            <tr class="border-b border-rose-100">
              <td class="px-4 py-2">Hiperhidrosis</td>
              <td class="px-4 py-2 text-center font-bold">+10-25%</td>
              <td class="px-4 py-2 text-xs">Keringat berlebih, cuaca panas</td>
            </tr>
            <tr>
              <td class="px-4 py-2">Perioperatif</td>
              <td class="px-4 py-2 text-center font-bold">+10-15%</td>
              <td class="px-4 py-2 text-xs">Sebelum/sesudah operasi</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-rose-600 mt-3">
        <strong>Referensi:</strong> WHO Guidelines, IDAI Consensus, Konsensus Terapi Cairan pada Anak
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const age = ref<number | null>(null)
const condition = ref<string>('')
const customAddition = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && 
         age.value !== null && age.value >= 0 &&
         (condition.value || customAddition.value)
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value || age.value === null) return

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

  let additionPercent = customAddition.value || 0
  let conditionLabel = 'Kustom'

  const conditionMap: Record<string, { percent: number; label: string }> = {
    diarrhea_mild: { percent: 10, label: 'Diare Ringan' },
    diarrhea_moderate: { percent: 25, label: 'Diare Sedang' },
    diarrhea_severe: { percent: 50, label: 'Diare Berat' },
    vomiting_mild: { percent: 10, label: 'Muntah Ringan' },
    vomiting_moderate: { percent: 15, label: 'Muntah Sedang' },
    vomiting_severe: { percent: 25, label: 'Muntah Berat' },
    hypermetabolic: { percent: 25, label: 'Hipermetabolik (rata-rata 20-30%)' },
    sweating: { percent: 15, label: 'Hiperhidrosis/Keringat Berlebih' },
    perioperative: { percent: 12.5, label: 'Perioperatif/Anestesi (rata-rata 10-15%)' }
  }

  if (condition.value && conditionMap[condition.value as string]) {
    additionPercent = conditionMap[condition.value as string]?.percent || 0
    conditionLabel = conditionMap[condition.value as string]?.label || ''
  }

  const addition = basalFluid * (additionPercent / 100)
  const totalFluid = basalFluid + addition
  const fluidPerHour = totalFluid / 24

  result.value = {
    basalFluid,
    additionPercent,
    addition,
    totalFluid,
    fluidPerHour,
    conditionLabel
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Sick Condition Correction',
    inputs: {
      age_years: age.value,
      weight_kg: weight.value,
      condition: conditionLabel,
      addition_percent: additionPercent
    },
    results: {
      basal_fluid_ml: basalFluid.toFixed(0),
      addition_ml: addition.toFixed(0),
      total_fluid_ml: totalFluid.toFixed(0),
      fluid_per_hour_ml: fluidPerHour.toFixed(0)
    }
  })
}
</script>
