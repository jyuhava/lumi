<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="fitness" class="text-xl"></ion-icon>
        <span>Kebutuhan Nutrisi Anak Sakit (Stress Factor)</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">Perhitungan dengan faktor stress metabolik untuk kondisi sakit</p>
    </div>

    <!-- Input Form -->
    <div class="space-y-6">
      <!-- Weight & Age -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
          <input
            v-model.number="age"
            type="number"
            step="0.1"
            min="0"
            placeholder="Contoh: 5"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
          <input
            v-model.number="weight"
            type="number"
            step="0.1"
            placeholder="Contoh: 18"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      <!-- Condition -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Kondisi Klinis</label>
        <select
          v-model="condition"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Pilih Kondisi Klinis</option>
          <optgroup label="Kondisi Ringan-Sedang">
            <option value="mild">Sakit Ringan / Operasi Kecil (SF: 1.1-1.25)</option>
            <option value="moderate">Sakit Sedang / Operasi Besar (SF: 1.25-1.5)</option>
          </optgroup>
          <optgroup label="Infeksi">
            <option value="pneumonia">Pneumonia / Infeksi Respiratori (SF: 1.3-1.5)</option>
            <option value="diarrhea">Diare / Gastroenteritis (SF: 1.25-1.5)</option>
            <option value="typhoid">Demam Tifoid (SF: 1.3-1.5)</option>
            <option value="malaria">Malaria (SF: 1.4-1.6)</option>
          </optgroup>
          <optgroup label="Kondisi Berat">
            <option value="sepsis">Sepsis / Luka Bakar Sedang (SF: 1.5-1.75)</option>
            <option value="severe_burn">Luka Bakar Berat >40% (SF: 1.75-2.0)</option>
            <option value="critical">Penyakit Kritis / Trauma Berat (SF: 2.0+)</option>
          </optgroup>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Sakit
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Results -->
      <div class="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-red-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan</span>
        </h4>

        <!-- Comparison -->
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-lg p-4 border border-green-200">
            <p class="text-xs text-gray-600 mb-1">Kebutuhan Basal (Sehat)</p>
            <p class="text-2xl font-bold text-green-700">{{ result.basalCalories.toFixed(0) }}</p>
            <p class="text-xs text-gray-500">kkal/hari</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-orange-200">
            <p class="text-xs text-gray-600 mb-1">Stress Factor</p>
            <p class="text-3xl font-bold text-orange-700">×{{ result.stressFactor }}</p>
          </div>

          <div class="bg-red-100 rounded-lg p-4 border-2 border-red-300">
            <p class="text-xs text-gray-600 mb-1">Kebutuhan Sakit</p>
            <p class="text-3xl font-bold text-red-700">{{ result.sickCalories.toFixed(0) }}</p>
            <p class="text-xs text-red-600">kkal/hari</p>
          </div>
        </div>

        <!-- Protein Needs -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-4 border border-blue-200">
            <p class="text-sm text-gray-600 mb-1">Kebutuhan Protein</p>
            <p class="text-2xl font-bold text-blue-700">{{ result.proteinMin.toFixed(1) }} - {{ result.proteinMax.toFixed(1) }} g/hari</p>
            <p class="text-xs text-gray-500">{{ result.proteinFactor }} g/kg BB</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-purple-200">
            <p class="text-sm text-gray-600 mb-1">Peningkatan dari Basal</p>
            <p class="text-2xl font-bold text-purple-700">+{{ (result.sickCalories - result.basalCalories).toFixed(0) }} kkal</p>
            <p class="text-xs text-gray-500">+{{ (((result.sickCalories / result.basalCalories) - 1) * 100).toFixed(0) }}%</p>
          </div>
        </div>

        <!-- Formula -->
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm font-bold text-blue-900 mb-1">Formula:</p>
          <p class="text-sm text-blue-800">
            Kalori Sakit = Kalori Basal (Holliday-Segar) × Stress Factor<br>
            = {{ result.basalCalories.toFixed(0) }} kkal × {{ result.stressFactor }} = {{ result.sickCalories.toFixed(0) }} kkal/hari
          </p>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tabel Stress Factor & Kebutuhan Protein</span>
      </h5>
      <div class="overflow-x-auto">
        <table class="w-full text-xs text-red-800 border-collapse">
          <thead class="bg-red-100">
            <tr>
              <th class="border border-red-300 p-2 text-left">Kondisi</th>
              <th class="border border-red-300 p-2">Stress Factor</th>
              <th class="border border-red-300 p-2">Protein (g/kg/hari)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td class="border border-red-200 p-2">Sehat</td><td class="border border-red-200 p-2 text-center">1.0</td><td class="border border-red-200 p-2 text-center">1.0-1.2</td></tr>
            <tr><td class="border border-red-200 p-2">Sakit Ringan</td><td class="border border-red-200 p-2 text-center">1.1-1.25</td><td class="border border-red-200 p-2 text-center">1.2-1.5</td></tr>
            <tr><td class="border border-red-200 p-2">Infeksi (Pneumonia, Diare)</td><td class="border border-red-200 p-2 text-center">1.3-1.5</td><td class="border border-red-200 p-2 text-center">1.5-2.0</td></tr>
            <tr><td class="border border-red-200 p-2">Sepsis/Luka Bakar</td><td class="border border-red-200 p-2 text-center">1.5-1.75</td><td class="border border-red-200 p-2 text-center">2.0-3.0</td></tr>
            <tr><td class="border border-red-200 p-2">Trauma Berat</td><td class="border border-red-200 p-2 text-center">2.0+</td><td class="border border-red-200 p-2 text-center">2.5-3.5</td></tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-red-600 mt-2">Referensi: ASPEN Guidelines, Kemenkes - Manajemen Nutrisi Pasien Sakit Kritis</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const condition = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && condition.value
})

// Stress factor and protein requirements mapping
const conditionData: Record<string, any> = {
  mild: { name: 'Sakit Ringan', sf: 1.175, protein: '1.2-1.5' },
  moderate: { name: 'Sakit Sedang', sf: 1.375, protein: '1.5-2.0' },
  pneumonia: { name: 'Pneumonia', sf: 1.4, protein: '1.5-2.0' },
  diarrhea: { name: 'Diare/Gastroenteritis', sf: 1.375, protein: '1.5-2.0' },
  typhoid: { name: 'Demam Tifoid', sf: 1.4, protein: '1.5-2.0' },
  malaria: { name: 'Malaria', sf: 1.5, protein: '1.5-2.0' },
  sepsis: { name: 'Sepsis/Luka Bakar Sedang', sf: 1.625, protein: '2.0-3.0' },
  severe_burn: { name: 'Luka Bakar Berat', sf: 1.875, protein: '2.0-3.0' },
  critical: { name: 'Kondisi Kritis', sf: 2.0, protein: '2.5-3.5' }
}

const calculate = async () => {
  if (!canCalculate.value || !weight.value) return

  // Calculate basal calories using Holliday-Segar
  let basalCalories = 0
  if (weight.value <= 10) {
    basalCalories = weight.value * 100
  } else if (weight.value > 10 && weight.value <= 20) {
    basalCalories = 1000 + ((weight.value - 10) * 50)
  } else {
    basalCalories = 1500 + ((weight.value - 20) * 20)
  }

  const data = conditionData[condition.value]
  const sickCalories = basalCalories * data.sf

  // Calculate protein range
  const proteinRange = data.protein.split('-')
  const proteinMin = weight.value * parseFloat(proteinRange[0])
  const proteinMax = weight.value * parseFloat(proteinRange[1])

  result.value = {
    basalCalories,
    stressFactor: data.sf,
    sickCalories,
    proteinMin,
    proteinMax,
    proteinFactor: data.protein,
    conditionName: data.name
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'child_nutrition',
    method: 'Stress Factor Calculation',
    inputs: {
      age_years: age.value || 'Tidak diisi',
      weight_kg: weight.value,
      condition: data.name,
      stress_factor: data.sf
    },
    results: {
      basal_calories_kcal: basalCalories.toFixed(0),
      sick_calories_kcal: sickCalories.toFixed(0),
      protein_g_per_day: `${proteinMin.toFixed(1)}-${proteinMax.toFixed(1)}`,
      increase_percent: `${(((sickCalories / basalCalories) - 1) * 100).toFixed(0)}%`
    }
  })
}
</script>
