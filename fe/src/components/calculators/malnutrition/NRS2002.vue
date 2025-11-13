<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
      <h4 class="font-bold text-orange-900 flex items-center space-x-2">
        <ion-icon name="flame" class="text-xl"></ion-icon>
        <span>NRS 2002 (Nutrition Risk Screening 2002)</span>
      </h4>
      <p class="text-sm text-orange-700 mt-1">Skrining risiko nutrisi - Rekomendasi ASPEN untuk pasien kritis & luka bakar (Spesifisitas 100%)</p>
    </div>

    <!-- Nutritional Impairment -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">A. Gangguan Status Nutrisi</h5>
      <select v-model.number="nutritionScore" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
        <option :value="0">Normal (Skor 0)</option>
        <option :value="1">Penurunan BB >5% dalam 3 bulan ATAU asupan 50-75% kebutuhan minggu lalu (Skor 1)</option>
        <option :value="2">Penurunan BB >5% dalam 2 bulan ATAU IMT 18.5-20.5 + kondisi umum buruk ATAU asupan 25-50% (Skor 2)</option>
        <option :value="3">Penurunan BB >5% dalam 1 bulan (>15% dalam 3 bulan) ATAU IMT <18.5 + kondisi buruk ATAU asupan 0-25% (Skor 3)</option>
      </select>
    </div>

    <!-- Disease Severity -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">B. Tingkat Keparahan Penyakit</h5>
      <select v-model.number="diseaseScore" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
        <option :value="0">Normal (Skor 0)</option>
        <option :value="1">Hip fracture, pasien kronik komplikasi (sirosis, COPD, hemodialisis kronik, diabetes, kanker) (Skor 1)</option>
        <option :value="2">Operasi abdomen mayor, stroke, pneumonia berat, keganasan hematologi (Skor 2)</option>
        <option :value="3">Trauma kepala, transplantasi sumsum tulang, ICU (APACHE >10), LUKA BAKAR MAYOR (Skor 3)</option>
      </select>
    </div>

    <!-- Age -->
    <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
      <h5 class="font-bold text-gray-900 mb-3">C. Usia</h5>
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          placeholder="Contoh: 75"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
      </div>
      <div v-if="ageScore !== null" class="mt-3 p-3 bg-blue-50 rounded-lg">
        <p class="text-sm">Usia {{ age }} tahun → Skor tambahan: <strong>{{ ageScore }}</strong> (≥70 tahun = +1)</p>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Skor NRS 2002
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil NRS 2002 Screening</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Skor NRS 2002</p>
          <p class="text-6xl font-bold text-orange-700 mb-1">{{ result.totalScore }}</p>
          <p class="text-sm text-gray-500">Nutrisi ({{ nutritionScore }}) + Penyakit ({{ diseaseScore }}) + Usia ({{ ageScore }})</p>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Status Risiko:</p>
            <p class="text-3xl font-bold" :class="result.statusColor">{{ result.status }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold mb-2">Rekomendasi:</p>
            <p class="text-sm">{{ result.recommendation }}</p>
          </div>

          <div v-if="diseaseScore === 3" class="bg-red-100 border-2 border-red-400 rounded-lg p-4">
            <p class="text-sm font-bold text-red-900 mb-1">⚠️ PERHATIAN KHUSUS LUKA BAKAR:</p>
            <p class="text-xs text-red-800">NRS 2002 memiliki spesifisitas 100% untuk pasien luka bakar (vs MUST 46.1%). 
            Tool ini sangat sensitif untuk mendeteksi risiko malnutrisi pada kondisi hipermetabolik.</p>
          </div>
        </div>
      </div>

      <!-- Classification Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Interpretasi NRS 2002:</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Total Skor</th>
              <th class="px-4 py-2 text-left">Status</th>
              <th class="px-4 py-2 text-left">Tindakan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b bg-green-50">
              <td class="px-4 py-2 font-bold">< 3</td>
              <td class="px-4 py-2">Tidak Ada Risiko</td>
              <td class="px-4 py-2 text-xs">Monitoring mingguan, rescreening jika kondisi berubah</td>
            </tr>
            <tr class="bg-red-50">
              <td class="px-4 py-2 font-bold">≥ 3</td>
              <td class="px-4 py-2"><strong>At Risk - Perlu Support Nutrisi</strong></td>
              <td class="px-4 py-2 text-xs">Implementasi nutrition care plan SEGERA, pertimbangkan EN/PN, monitoring ketat</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Scoring Details -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Detail Komponen Skor:</h5>
        <div class="space-y-4">
          <div>
            <p class="font-bold text-sm mb-2">A. Gangguan Status Nutrisi (0-3):</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Skor 1: Ringan (BB turun >5% dalam 3 bulan atau asupan 50-75%)</li>
              <li>• Skor 2: Sedang (BB turun >5% dalam 2 bulan atau IMT 18.5-20.5 atau asupan 25-50%)</li>
              <li>• Skor 3: Berat (BB turun >5% dalam 1 bulan atau IMT <18.5 atau asupan 0-25%)</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-2">B. Tingkat Keparahan Penyakit (0-3):</p>
            <ul class="text-xs space-y-1 ml-4">
              <li>• Skor 1: Ringan (hip fracture, penyakit kronik dengan komplikasi)</li>
              <li>• Skor 2: Sedang (operasi abdomen mayor, stroke, pneumonia berat, keganasan)</li>
              <li>• Skor 3: Berat (trauma kepala, ICU APACHE >10, <strong class="text-red-700">LUKA BAKAR MAYOR</strong>)</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-2">C. Usia:</p>
            <p class="text-xs ml-4">• Tambahkan skor 1 jika usia ≥70 tahun</p>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
      <h5 class="font-bold text-orange-900 mb-2">Tentang NRS 2002</h5>
      <p class="text-sm text-orange-800 mb-2">
        NRS 2002 adalah tool screening nutrisi yang direkomendasikan oleh ASPEN dan ESPEN untuk pasien rawat inap. 
        Sangat valid untuk pasien kritis dan luka bakar.
      </p>
      <p class="text-sm text-orange-800 font-bold">
        ⭐ Spesifisitas 100% untuk pasien luka bakar (Reference: Perbandingan NRS 2002 vs MUST pada pasien luka bakar)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const nutritionScore = ref<number>(0)
const diseaseScore = ref<number>(0)
const age = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const ageScore = computed(() => {
  if (age.value === null) return null
  return age.value >= 70 ? 1 : 0
})

const canCalculate = computed(() => {
  return age.value !== null && age.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || ageScore.value === null) return

  const totalScore = nutritionScore.value + diseaseScore.value + ageScore.value

  let status = ''
  let recommendation = ''
  let colorClass = ''
  let statusColor = ''

  if (totalScore < 3) {
    status = 'Tidak Ada Risiko Nutrisi'
    recommendation = 'Monitoring mingguan. Re-screening jika kondisi klinis berubah.'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
  } else {
    status = 'At Risk - Perlu Support Nutrisi'
    recommendation = 'SEGERA implementasi nutrition care plan. Konsultasi tim nutrisi. Pertimbangkan enteral/parenteral nutrition. Monitoring harian.'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
  }

  result.value = { totalScore, status, recommendation, colorClass, statusColor }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'NRS 2002 (Nutrition Risk Screening 2002)',
    inputs: {
      nutrition_impairment_score: nutritionScore.value,
      disease_severity_score: diseaseScore.value,
      age_years: age.value,
      age_score: ageScore.value
    },
    results: {
      total_score: totalScore.toString(),
      risk_status: status
    }
  })
}
</script>
