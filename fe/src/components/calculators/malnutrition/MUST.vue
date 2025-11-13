<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-sky-50 to-indigo-50 rounded-xl p-4 border border-sky-200">
      <h4 class="font-bold text-sky-900 flex items-center space-x-2">
        <ion-icon name="pulse" class="text-xl"></ion-icon>
        <span>MUST (Malnutrition Universal Screening Tool)</span>
      </h4>
      <p class="text-sm text-sky-700 mt-1">Skrining risiko malnutrisi dewasa - UK Standard</p>
    </div>

    <!-- Step 1: BMI -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">Step 1: Skor BMI</h5>
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
          <input
            v-model.number="weight"
            type="number"
            step="0.1"
            placeholder="Contoh: 55"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
          />
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Tinggi Badan (cm)</label>
          <input
            v-model.number="height"
            type="number"
            step="0.1"
            placeholder="Contoh: 165"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
          />
        </div>
      </div>
      <div v-if="bmiScore !== null" class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm">BMI: <strong>{{ calculatedBMI.toFixed(1) }}</strong> → Skor: <strong>{{ bmiScore }}</strong></p>
      </div>
    </div>

    <!-- Step 2: Weight Loss -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">Step 2: Penurunan Berat Badan (3-6 bulan terakhir)</h5>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Persentase Penurunan BB (%)</label>
        <input
          v-model.number="weightLossPercent"
          type="number"
          step="0.1"
          placeholder="Contoh: 5 (berarti turun 5%)"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
        <p class="text-xs text-gray-500 mt-1">Hitung: (BB sebelum - BB sekarang) / BB sebelum × 100%</p>
      </div>
      <div v-if="weightLossScore !== null" class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm">Penurunan: <strong>{{ weightLossPercent }}%</strong> → Skor: <strong>{{ weightLossScore }}</strong></p>
      </div>
    </div>

    <!-- Step 3: Acute Disease -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">Step 3: Efek Penyakit Akut</h5>
      <select v-model.number="acuteDiseaseScore" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
        <option :value="0">Tidak ada penyakit akut atau asupan nutrisi normal (Skor 0)</option>
        <option :value="2">Ada penyakit akut atau tidak ada asupan >5 hari (Skor 2)</option>
      </select>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Skor MUST
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil MUST Screening</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Skor MUST</p>
          <p class="text-6xl font-bold text-sky-700 mb-1">{{ result.totalScore }}</p>
          <p class="text-sm text-gray-500">BMI ({{ bmiScore }}) + Weight Loss ({{ weightLossScore }}) + Acute Disease ({{ acuteDiseaseScore }})</p>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Kategori Risiko:</p>
            <p class="text-3xl font-bold" :class="result.statusColor">{{ result.category }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Rencana Tindakan:</p>
            <div class="text-sm space-y-1">
              <p v-for="(action, idx) in result.actions" :key="idx">{{ action }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Classification Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Interpretasi MUST:</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Skor</th>
              <th class="px-4 py-2 text-left">Risiko</th>
              <th class="px-4 py-2 text-left">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-green-50">
              <td class="px-4 py-2 font-bold">0</td>
              <td class="px-4 py-2">Risiko Rendah</td>
              <td class="px-4 py-2 text-xs">Monitoring rutin, rescreening mingguan (pasien rawat)</td>
            </tr>
            <tr class="border-b bg-yellow-50">
              <td class="px-4 py-2 font-bold">1</td>
              <td class="px-4 py-2">Risiko Sedang</td>
              <td class="px-4 py-2 text-xs">Observasi 3 hari asupan makanan, konsultasi dietitian jika perlu</td>
            </tr>
            <tr class="bg-red-50">
              <td class="px-4 py-2 font-bold">≥ 2</td>
              <td class="px-4 py-2">Risiko Tinggi</td>
              <td class="px-4 py-2 text-xs">Rujuk ke dietitian SEGERA, implementasi care plan, monitoring ketat</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Scoring Reference -->
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h5 class="font-bold text-gray-900 mb-2 text-sm">Skor BMI:</h5>
          <ul class="text-xs space-y-1">
            <li>• BMI > 20: <strong>Skor 0</strong></li>
            <li>• BMI 18.5-20: <strong>Skor 1</strong></li>
            <li>• BMI < 18.5: <strong>Skor 2</strong></li>
          </ul>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h5 class="font-bold text-gray-900 mb-2 text-sm">Skor Penurunan BB:</h5>
          <ul class="text-xs space-y-1">
            <li>• < 5%: <strong>Skor 0</strong></li>
            <li>• 5-10%: <strong>Skor 1</strong></li>
            <li>• > 10%: <strong>Skor 2</strong></li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bg-sky-50 border border-sky-200 rounded-xl p-4">
      <h5 class="font-bold text-sky-900 mb-2">Tentang MUST</h5>
      <p class="text-sm text-sky-800">
        MUST adalah tool skrining 5-langkah untuk mengidentifikasi dewasa yang kurang gizi, berisiko malnutrisi (undernutrition), atau obesitas. 
        Dikembangkan oleh British Association for Parenteral and Enteral Nutrition (BAPEN).
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const height = ref<number | null>(null)
const weightLossPercent = ref<number | null>(null)
const acuteDiseaseScore = ref<number>(0)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculatedBMI = computed(() => {
  if (!weight.value || !height.value) return 0
  const heightM = height.value / 100
  return weight.value / (heightM * heightM)
})

const bmiScore = computed(() => {
  if (!weight.value || !height.value) return null
  const bmi = calculatedBMI.value
  if (bmi > 20) return 0
  if (bmi >= 18.5) return 1
  return 2
})

const weightLossScore = computed(() => {
  if (weightLossPercent.value === null) return null
  if (weightLossPercent.value < 5) return 0
  if (weightLossPercent.value <= 10) return 1
  return 2
})

const canCalculate = computed(() => {
  return bmiScore.value !== null && weightLossScore.value !== null
})

const calculate = async () => {
  if (!canCalculate.value || bmiScore.value === null || weightLossScore.value === null) return

  const totalScore = bmiScore.value + weightLossScore.value + acuteDiseaseScore.value

  let category = ''
  let colorClass = ''
  let statusColor = ''
  let actions: string[] = []

  if (totalScore === 0) {
    category = 'Risiko Rendah'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
    actions = [
      '• Monitoring nutrisi rutin',
      '• Rescreening mingguan untuk pasien rawat inap',
      '• Rescreening bulanan untuk pasien rawat jalan/komunitas',
      '• Promosi pola makan sehat'
    ]
  } else if (totalScore === 1) {
    category = 'Risiko Sedang'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
    actions = [
      '• Observasi asupan makanan selama 3 hari',
      '• Konsultasi dengan dietitian jika asupan tidak adekuat',
      '• Repeat screening mingguan',
      '• Dokumentasi diet dan evaluasi berkala'
    ]
  } else {
    category = 'Risiko Tinggi'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
    actions = [
      '• RUJUK ke dietitian/tim nutrisi SEGERA',
      '• Implementasi nutrition care plan',
      '• Set target asupan: semua kebutuhan nutrisi terpenuhi',
      '• Monitoring dan review mingguan',
      '• Pertimbangkan suplementasi nutrisi atau feeding support'
    ]
  }

  result.value = { totalScore, category, colorClass, statusColor, actions }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'MUST (Malnutrition Universal Screening Tool)',
    inputs: {
      weight_kg: weight.value,
      height_cm: height.value,
      bmi: calculatedBMI.value.toFixed(1),
      weight_loss_percent: weightLossPercent.value,
      acute_disease_score: acuteDiseaseScore.value,
      bmi_score: bmiScore.value,
      weight_loss_score: weightLossScore.value
    },
    results: {
      total_score: totalScore.toString(),
      risk_category: category
    }
  })
}
</script>
