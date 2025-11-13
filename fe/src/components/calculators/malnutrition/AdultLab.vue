<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
      <h4 class="font-bold text-teal-900 flex items-center space-x-2">
        <ion-icon name="flask" class="text-xl"></ion-icon>
        <span>Parameter Laboratorium Malnutrisi</span>
      </h4>
      <p class="text-sm text-teal-700 mt-1">Penilaian status gizi berdasarkan marker biokimia</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-3 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Albumin (g/dL)</label>
        <input
          v-model.number="albumin"
          type="number"
          step="0.1"
          placeholder="Normal: > 3.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <p class="text-xs text-gray-500 mt-1">Normal: > 3.5 g/dL</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Prealbumin (mg/dL)</label>
        <input
          v-model.number="prealbumin"
          type="number"
          step="0.1"
          placeholder="Normal: 20-40"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <p class="text-xs text-gray-500 mt-1">Normal: 20-40 mg/dL</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Total Limfosit (/mm³)</label>
        <input
          v-model.number="lymphocytes"
          type="number"
          step="1"
          placeholder="Normal: 1500-3000"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <p class="text-xs text-gray-500 mt-1">Normal: 1500-3000 /mm³</p>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Analisis Parameter Lab
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.overallColorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil Analisis Laboratorium</h4>

        <!-- Individual Parameters -->
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div :class="['rounded-lg p-4 border-2', result.albuminColorClass]">
            <p class="text-xs font-bold text-gray-600 mb-1">ALBUMIN</p>
            <p class="text-3xl font-bold" :class="result.albuminStatusColor">{{ albumin }}</p>
            <p class="text-xs mt-1">g/dL</p>
            <p class="text-sm font-bold mt-2">{{ result.albuminStatus }}</p>
          </div>

          <div :class="['rounded-lg p-4 border-2', result.prealbuminColorClass]">
            <p class="text-xs font-bold text-gray-600 mb-1">PREALBUMIN</p>
            <p class="text-3xl font-bold" :class="result.prealbuminStatusColor">{{ prealbumin }}</p>
            <p class="text-xs mt-1">mg/dL</p>
            <p class="text-sm font-bold mt-2">{{ result.prealbuminStatus }}</p>
          </div>

          <div :class="['rounded-lg p-4 border-2', result.lymphocytesColorClass]">
            <p class="text-xs font-bold text-gray-600 mb-1">TOTAL LIMFOSIT</p>
            <p class="text-3xl font-bold" :class="result.lymphocytesStatusColor">{{ lymphocytes }}</p>
            <p class="text-xs mt-1">/mm³</p>
            <p class="text-sm font-bold mt-2">{{ result.lymphocytesStatus }}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border-2">
          <p class="text-sm font-bold mb-2">Kesimpulan Malnutrisi:</p>
          <p class="text-3xl font-bold" :class="result.overallStatusColor">{{ result.overallStatus }}</p>
          <p class="text-sm mt-3">{{ result.recommendation }}</p>
        </div>
      </div>

      <!-- Reference Tables -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h5 class="font-bold text-gray-900 mb-2 text-sm">Albumin (g/dL):</h5>
          <table class="w-full text-xs">
            <tbody>
              <tr class="border-b bg-green-50">
                <td class="px-2 py-1 font-bold">> 3.5</td>
                <td class="px-2 py-1">Normal</td>
              </tr>
              <tr class="border-b bg-yellow-50">
                <td class="px-2 py-1 font-bold">3.0-3.5</td>
                <td class="px-2 py-1">Ringan</td>
              </tr>
              <tr class="border-b bg-orange-50">
                <td class="px-2 py-1 font-bold">2.1-3.0</td>
                <td class="px-2 py-1">Sedang</td>
              </tr>
              <tr class="bg-red-50">
                <td class="px-2 py-1 font-bold">< 2.1</td>
                <td class="px-2 py-1">Berat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h5 class="font-bold text-gray-900 mb-2 text-sm">Prealbumin (mg/dL):</h5>
          <table class="w-full text-xs">
            <tbody>
              <tr class="border-b bg-green-50">
                <td class="px-2 py-1 font-bold">20-40</td>
                <td class="px-2 py-1">Normal</td>
              </tr>
              <tr class="border-b bg-yellow-50">
                <td class="px-2 py-1 font-bold">15-20</td>
                <td class="px-2 py-1">Ringan</td>
              </tr>
              <tr class="border-b bg-orange-50">
                <td class="px-2 py-1 font-bold">10-15</td>
                <td class="px-2 py-1">Sedang</td>
              </tr>
              <tr class="bg-red-50">
                <td class="px-2 py-1 font-bold">< 10</td>
                <td class="px-2 py-1">Berat</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white border-2 border-gray-200 rounded-xl p-4">
          <h5 class="font-bold text-gray-900 mb-2 text-sm">Total Limfosit (/mm³):</h5>
          <table class="w-full text-xs">
            <tbody>
              <tr class="border-b bg-green-50">
                <td class="px-2 py-1 font-bold">1500-3000</td>
                <td class="px-2 py-1">Normal</td>
              </tr>
              <tr class="border-b bg-yellow-50">
                <td class="px-2 py-1 font-bold">1200-1500</td>
                <td class="px-2 py-1">Ringan</td>
              </tr>
              <tr class="border-b bg-orange-50">
                <td class="px-2 py-1 font-bold">800-1200</td>
                <td class="px-2 py-1">Sedang</td>
              </tr>
              <tr class="bg-red-50">
                <td class="px-2 py-1 font-bold">< 800</td>
                <td class="px-2 py-1">Berat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-teal-50 border border-teal-200 rounded-xl p-4">
      <h5 class="font-bold text-teal-900 mb-2">Tentang Parameter Lab</h5>
      <ul class="text-sm text-teal-800 space-y-1">
        <li>• <strong>Albumin:</strong> Marker jangka panjang, half-life 20 hari</li>
        <li>• <strong>Prealbumin:</strong> Marker sensitif, half-life 2 hari, responsif terhadap perubahan status gizi</li>
        <li>• <strong>Total Limfosit:</strong> Indikator imunitas terkait malnutrisi protein</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const albumin = ref<number | null>(null)
const prealbumin = ref<number | null>(null)
const lymphocytes = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return (albumin.value !== null && albumin.value >= 0) ||
         (prealbumin.value !== null && prealbumin.value >= 0) ||
         (lymphocytes.value !== null && lymphocytes.value >= 0)
})

const assessParameter = (value: number | null, ranges: any) => {
  if (value === null || value < 0) return { status: 'Tidak diinput', colorClass: 'bg-gray-50 border-gray-300', statusColor: 'text-gray-500', severity: 0 }
  
  if (value >= ranges.normal) return { status: 'Normal', colorClass: 'bg-green-50 border-green-300', statusColor: 'text-green-700', severity: 0 }
  if (value >= ranges.mild) return { status: 'Malnutrisi Ringan', colorClass: 'bg-yellow-50 border-yellow-300', statusColor: 'text-yellow-700', severity: 1 }
  if (value >= ranges.moderate) return { status: 'Malnutrisi Sedang', colorClass: 'bg-orange-50 border-orange-300', statusColor: 'text-orange-700', severity: 2 }
  return { status: 'Malnutrisi Berat', colorClass: 'bg-red-50 border-red-300', statusColor: 'text-red-700', severity: 3 }
}

const calculate = async () => {
  if (!canCalculate.value) return

  // Assess each parameter
  const albuminAssessment = assessParameter(albumin.value, { normal: 3.5, mild: 3.0, moderate: 2.1 })
  const prealbuminAssessment = assessParameter(prealbumin.value, { normal: 20, mild: 15, moderate: 10 })
  const lymphocytesAssessment = assessParameter(lymphocytes.value, { normal: 1500, mild: 1200, moderate: 800 })

  // Overall assessment (worst parameter determines overall status)
  const maxSeverity = Math.max(albuminAssessment.severity, prealbuminAssessment.severity, lymphocytesAssessment.severity)
  
  let overallStatus = ''
  let overallColorClass = ''
  let overallStatusColor = ''
  let recommendation = ''

  if (maxSeverity === 0) {
    overallStatus = 'Tidak Ada Malnutrisi'
    overallColorClass = 'bg-green-50 border-green-300'
    overallStatusColor = 'text-green-700'
    recommendation = 'Status gizi baik secara laboratoris. Pertahankan asupan nutrisi seimbang.'
  } else if (maxSeverity === 1) {
    overallStatus = 'Malnutrisi Ringan'
    overallColorClass = 'bg-yellow-50 border-yellow-300'
    overallStatusColor = 'text-yellow-700'
    recommendation = 'Tingkatkan asupan protein dan kalori. Monitoring berkala diperlukan.'
  } else if (maxSeverity === 2) {
    overallStatus = 'Malnutrisi Sedang'
    overallColorClass = 'bg-orange-50 border-orange-300'
    overallStatusColor = 'text-orange-700'
    recommendation = 'Intervensi gizi segera. Konsultasi ahli gizi dan pertimbangkan suplemen nutrisi.'
  } else {
    overallStatus = 'Malnutrisi Berat'
    overallColorClass = 'bg-red-50 border-red-300'
    overallStatusColor = 'text-red-700'
    recommendation = 'SEGERA konsultasi dokter untuk terapi nutrisi agresif. Risiko tinggi komplikasi.'
  }

  result.value = {
    albuminStatus: albuminAssessment.status,
    albuminColorClass: albuminAssessment.colorClass,
    albuminStatusColor: albuminAssessment.statusColor,
    prealbuminStatus: prealbuminAssessment.status,
    prealbuminColorClass: prealbuminAssessment.colorClass,
    prealbuminStatusColor: prealbuminAssessment.statusColor,
    lymphocytesStatus: lymphocytesAssessment.status,
    lymphocytesColorClass: lymphocytesAssessment.colorClass,
    lymphocytesStatusColor: lymphocytesAssessment.statusColor,
    overallStatus,
    overallColorClass,
    overallStatusColor,
    recommendation
  }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'Laboratory Parameters',
    inputs: {
      albumin_g_dl: albumin.value,
      prealbumin_mg_dl: prealbumin.value,
      total_lymphocytes: lymphocytes.value
    },
    results: {
      albumin_status: albuminAssessment.status,
      prealbumin_status: prealbuminAssessment.status,
      lymphocytes_status: lymphocytesAssessment.status,
      overall_malnutrition: overallStatus
    }
  })
}
</script>
