<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="thermometer" class="text-xl"></ion-icon>
        <span>Perubahan Metabolik Pada Luka Bakar</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">Analisis hipermetabolisme & katabolisme protein pada pasien luka bakar</p>
    </div>

    <!-- Burn Assessment -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Luas Luka Bakar (% TBSA)</label>
        <input
          v-model.number="burnTBSA"
          type="number"
          step="1"
          min="0"
          max="100"
          placeholder="Contoh: 30"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <p class="text-xs text-gray-500 mt-1">Total Body Surface Area yang terbakar (%)</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Derajat Luka Bakar</label>
        <select v-model="burnDegree" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option value="superficial">Superficial (Derajat I)</option>
          <option value="partial">Partial Thickness (Derajat II)</option>
          <option value="full">Full Thickness (Derajat III)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 70"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Fase Luka Bakar</label>
        <select v-model="burnPhase" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option value="acute">Fase Akut (0-48 jam)</option>
          <option value="subacute">Fase Subakut (3-14 hari)</option>
          <option value="recovery">Fase Pemulihan (>14 hari)</option>
        </select>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Analisis Perubahan Metabolik
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil Analisis Metabolik</h4>

        <!-- Hypermetabolism -->
        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Estimasi Peningkatan Laju Metabolik</p>
          <p class="text-6xl font-bold text-red-700 mb-1">{{ result.metabolicIncrease }}%</p>
          <p class="text-sm text-gray-500">di atas metabolisme basal</p>
        </div>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-4 border-2 border-orange-200">
            <p class="text-xs font-bold text-gray-700 mb-1">KATEGORI HIPERMETABOLISME</p>
            <p class="text-2xl font-bold text-red-700">{{ result.severity }}</p>
          </div>

          <div class="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-200">
            <p class="text-xs font-bold text-gray-700 mb-1">FASE METABOLIK</p>
            <p class="text-2xl font-bold text-orange-700">{{ result.phaseText }}</p>
          </div>
        </div>

        <!-- Metabolic Changes -->
        <div class="bg-white rounded-lg p-6 border-2">
          <h5 class="font-bold text-gray-900 mb-3">Perubahan Metabolik:</h5>
          <div class="space-y-2">
            <div v-for="(change, idx) in result.changes" :key="idx" class="flex items-start space-x-2">
              <ion-icon name="alert-circle" class="text-red-600 mt-0.5 text-lg flex-shrink-0"></ion-icon>
              <p class="text-sm">{{ change }}</p>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200 mt-4">
          <h5 class="font-bold text-blue-900 mb-3">Rekomendasi Manajemen Nutrisi:</h5>
          <div class="space-y-2">
            <div v-for="(rec, idx) in result.recommendations" :key="idx" class="flex items-start space-x-2">
              <ion-icon name="checkmark-circle" class="text-blue-600 mt-0.5 text-lg flex-shrink-0"></ion-icon>
              <p class="text-sm text-blue-900">{{ rec }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Reference Information -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Referensi Perubahan Metabolik Luka Bakar:</h5>
        <div class="space-y-3 text-sm">
          <div class="bg-red-50 p-3 rounded-lg">
            <p class="font-bold text-red-900 mb-1">🔥 Hipermetabolisme (50-100% peningkatan):</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Luka bakar 10-20% TBSA: +20-40% metabolisme</li>
              <li>• Luka bakar 20-40% TBSA: +40-70% metabolisme</li>
              <li>• Luka bakar >40% TBSA: +70-100% metabolisme</li>
            </ul>
          </div>

          <div class="bg-orange-50 p-3 rounded-lg">
            <p class="font-bold text-orange-900 mb-1">💪 Katabolisme Protein Masif:</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Ekskresi nitrogen meningkat 20-30g/hari (normal 10-15g)</li>
              <li>• Kehilangan massa otot 0.5-1 kg/hari</li>
              <li>• Negative nitrogen balance persisten</li>
            </ul>
          </div>

          <div class="bg-yellow-50 p-3 rounded-lg">
            <p class="font-bold text-yellow-900 mb-1">🔄 Perubahan Metabolisme Lipid:</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Lipolysis masif: peningkatan asam lemak bebas</li>
              <li>• Trigliserida serum meningkat</li>
              <li>• Gangguan utilisasi lipid untuk energi</li>
            </ul>
          </div>

          <div class="bg-blue-50 p-3 rounded-lg">
            <p class="font-bold text-blue-900 mb-1">⏰ Fase Metabolik:</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Fase Ebb (0-48h): Hipovolemia, shock, hipotermi, metabolisme ↓</li>
              <li>• Fase Flow (3-14 hari): Peak hipermetabolisme, katabolisme maksimal</li>
              <li>• Fase Pemulihan (>14 hari): Anabolisme bertahap, metabolisme normalisasi</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2">⚠️ Pentingnya Manajemen Nutrisi Pada Luka Bakar</h5>
      <p class="text-sm text-red-800">
        Luka bakar menyebabkan hipermetabolisme ekstrem (50-100% peningkatan) dan katabolisme protein masif. 
        Intervensi nutrisi agresif SEGERA diperlukan untuk mencegah malnutrisi berat, infeksi, dan kegagalan penyembuhan luka. 
        Gunakan NRS 2002 untuk skrining (spesifisitas 100% pada luka bakar).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const burnTBSA = ref<number | null>(null)
const burnDegree = ref<string>('partial')
const weight = ref<number | null>(null)
const burnPhase = ref<string>('subacute')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return burnTBSA.value !== null && burnTBSA.value > 0 && weight.value && weight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !burnTBSA.value || !weight.value) return

  // Estimate metabolic increase based on TBSA
  let metabolicIncrease = 0
  if (burnTBSA.value < 10) {
    metabolicIncrease = 10 + burnTBSA.value
  } else if (burnTBSA.value < 20) {
    metabolicIncrease = 20 + (burnTBSA.value - 10) * 2
  } else if (burnTBSA.value < 40) {
    metabolicIncrease = 40 + (burnTBSA.value - 20) * 1.5
  } else {
    metabolicIncrease = 70 + (burnTBSA.value - 40) * 0.5
    if (metabolicIncrease > 100) metabolicIncrease = 100
  }

  // Adjust for burn degree
  if (burnDegree.value === 'superficial') {
    metabolicIncrease *= 0.7
  } else if (burnDegree.value === 'full') {
    metabolicIncrease *= 1.2
  }

  // Adjust for phase
  let phaseMultiplier = 1
  let phaseText = ''
  if (burnPhase.value === 'acute') {
    phaseMultiplier = 0.6
    phaseText = 'Fase Ebb (Akut)'
  } else if (burnPhase.value === 'subacute') {
    phaseMultiplier = 1.2
    phaseText = 'Fase Flow (Hipermetabolik Puncak)'
  } else {
    phaseMultiplier = 0.8
    phaseText = 'Fase Pemulihan'
  }

  metabolicIncrease = Math.round(metabolicIncrease * phaseMultiplier)

  let severity = ''
  let colorClass = ''
  if (metabolicIncrease < 30) {
    severity = 'Ringan'
    colorClass = 'bg-yellow-50 border-yellow-300'
  } else if (metabolicIncrease < 60) {
    severity = 'Sedang'
    colorClass = 'bg-orange-50 border-orange-300'
  } else {
    severity = 'Berat'
    colorClass = 'bg-red-50 border-red-300'
  }

  const changes = [
    `Hipermetabolisme ${metabolicIncrease}% di atas basal - peningkatan kebutuhan energi drastis`,
    `Katabolisme protein masif - ekskresi nitrogen 20-30g/hari (kehilangan otot 0.5-1kg/hari)`,
    `Lipolysis meningkat - peningkatan asam lemak bebas dan trigliserida`,
    `Glukoneogenesis ↑ - resistensi insulin, hiperglikemia`,
    `Kehilangan cairan & elektrolit masif melalui luka`,
    `Peningkatan kebutuhan mikronutrien (Vitamin C, Zinc, Selenium) untuk penyembuhan`,
    `Respons inflamasi sistemik - sitokin pro-inflamasi (IL-1, IL-6, TNF-α)`
  ]

  const recommendations = [
    `Kebutuhan energi: 1.5-2x BEE atau 25-40 kcal/kg/hari tergantung luas luka`,
    `Protein tinggi: 1.5-2.5 g/kg/hari (pada luka >20% TBSA bisa sampai 3g/kg)`,
    `Mulai feeding enteral DINI (dalam 24-48 jam) untuk mencegah translokasi bakteri`,
    `Monitoring ketat: nitrogen balance, prealbumin, berat badan harian`,
    `Suplementasi mikronutrien: Vitamin C 500-1000mg, Zinc 15-25mg, Vitamin A`,
    `Jika asupan oral <60% target → Enteral feeding via NGT`,
    `Hindari overfeeding → risiko hepatic steatosis, hiperglikemia, infeksi`,
    `Pertimbangkan glutamin, arginin, omega-3 untuk imunonutrisi`
  ]

  result.value = {
    metabolicIncrease,
    severity,
    phaseText,
    colorClass,
    changes,
    recommendations
  }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'Burn Metabolic Changes',
    inputs: {
      burn_tbsa_percent: burnTBSA.value,
      burn_degree: burnDegree.value,
      weight_kg: weight.value,
      burn_phase: burnPhase.value
    },
    results: {
      metabolic_increase_percent: metabolicIncrease.toString(),
      severity: severity,
      phase: phaseText
    }
  })
}
</script>
