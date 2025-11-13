<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200">
      <h4 class="font-bold text-teal-900 flex items-center space-x-2">
        <ion-icon name="body" class="text-xl"></ion-icon>
        <span>MUAC - Lingkar Lengan Atas (Mid-Upper Arm Circumference)</span>
      </h4>
      <p class="text-sm text-teal-700 mt-1">Metode praktis skrining malnutrisi akut - Standar Kemenkes & WHO</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (bulan)</label>
        <input
          v-model.number="ageMonths"
          type="number"
          min="6"
          max="60"
          placeholder="Contoh: 24"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <p class="text-xs text-gray-500 mt-1">6-60 bulan (6 bulan - 5 tahun)</p>
      </div>

      <!-- MUAC Measurement -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">MUAC / Lingkar Lengan Atas (cm)</label>
        <input
          v-model.number="muac"
          type="number"
          step="0.1"
          placeholder="Contoh: 13.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <p class="text-xs text-gray-500 mt-1">Diukur di tengah lengan atas kiri</p>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Evaluasi MUAC
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Evaluasi MUAC</span>
        </h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Lingkar Lengan Atas</p>
          <p class="text-6xl font-bold text-teal-700 mb-1">{{ muac }}</p>
          <p class="text-sm text-gray-500">cm</p>
        </div>

        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold text-gray-700 mb-2">Status Gizi:</p>
            <p class="text-3xl font-bold" :class="result.statusColor">{{ result.status }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold text-gray-700 mb-2">Interpretasi:</p>
            <p class="text-sm">{{ result.interpretation }}</p>
          </div>

          <div class="bg-white rounded-lg p-4 border-2">
            <p class="text-sm font-bold text-gray-700 mb-2">Rekomendasi:</p>
            <p class="text-sm">{{ result.recommendation }}</p>
          </div>
        </div>
      </div>

      <!-- Classification Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Klasifikasi MUAC (Usia 6-60 bulan):</h5>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 text-left">MUAC (cm)</th>
                <th class="px-4 py-2 text-left">Status Gizi</th>
                <th class="px-4 py-2 text-left">Kode Warna</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b bg-green-50">
                <td class="px-4 py-2 font-bold">≥ 13,5 cm</td>
                <td class="px-4 py-2"><strong>Normal / Gizi Baik</strong></td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                    Hijau
                  </div>
                </td>
              </tr>
              <tr class="border-b bg-yellow-50">
                <td class="px-4 py-2 font-bold">12,5 - 13,4 cm</td>
                <td class="px-4 py-2">Risiko Malnutrisi / KEK Ringan</td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                    Kuning
                  </div>
                </td>
              </tr>
              <tr class="border-b bg-orange-50">
                <td class="px-4 py-2 font-bold">11,5 - 12,4 cm</td>
                <td class="px-4 py-2"><strong>Malnutrisi Akut Sedang (MAM)</strong></td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                    Oranye
                  </div>
                </td>
              </tr>
              <tr class="bg-red-50">
                <td class="px-4 py-2 font-bold">< 11,5 cm</td>
                <td class="px-4 py-2"><strong>Malnutrisi Akut Berat (SAM)</strong></td>
                <td class="px-4 py-2">
                  <div class="flex items-center">
                    <div class="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                    Merah
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-teal-50 border border-teal-200 rounded-xl p-4">
      <h5 class="font-bold text-teal-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang MUAC</span>
      </h5>
      <div class="text-sm text-teal-800 space-y-2">
        <p><strong>Keunggulan MUAC:</strong></p>
        <ul class="ml-4 space-y-1 text-xs">
          <li>• Praktis, cepat, mudah di lapangan (Posyandu, Puskesmas)</li>
          <li>• Tidak memerlukan pengukuran BB dan TB</li>
          <li>• Indikator sensitif untuk malnutrisi akut</li>
          <li>• Direkomendasikan WHO untuk skrining komunitas</li>
        </ul>
        <p class="text-xs text-teal-600 mt-2">
          <strong>Referensi:</strong> WHO, UNICEF, Kemenkes RI, Buku Saku Nasional PSG 2017
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const ageMonths = ref<number | null>(null)
const muac = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return ageMonths.value !== null && ageMonths.value >= 6 && ageMonths.value <= 60 &&
         muac.value && muac.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !muac.value || !ageMonths.value) return

  let status = ''
  let interpretation = ''
  let recommendation = ''
  let colorClass = ''
  let statusColor = ''

  if (muac.value >= 13.5) {
    status = 'Normal / Gizi Baik'
    interpretation = 'MUAC ≥13,5 cm menunjukkan status gizi normal. Anak tidak mengalami malnutrisi akut.'
    recommendation = 'Pertahankan pola makan seimbang, ASI eksklusif (jika <6 bulan), dan pantau pertumbuhan rutin di Posyandu.'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
  } else if (muac.value >= 12.5) {
    status = 'Risiko Malnutrisi / KEK Ringan'
    interpretation = 'MUAC 12,5-13,4 cm menunjukkan risiko kekurangan energi kronis (KEK) ringan.'
    recommendation = 'Tingkatkan asupan kalori dan protein, konsultasi ke Puskesmas untuk program PMT (Pemberian Makanan Tambahan).'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
  } else if (muac.value >= 11.5) {
    status = 'Malnutrisi Akut Sedang (MAM)'
    interpretation = 'MUAC 11,5-12,4 cm menunjukkan malnutrisi akut sedang (Moderate Acute Malnutrition).'
    recommendation = 'SEGERA konsultasi ke Puskesmas/RS untuk program terapi gizi. Diperlukan PMT dan monitoring ketat.'
    colorClass = 'bg-orange-50 border-orange-300'
    statusColor = 'text-orange-700'
  } else {
    status = 'Malnutrisi Akut Berat (SAM)'
    interpretation = 'MUAC <11,5 cm menunjukkan malnutrisi akut berat (Severe Acute Malnutrition). KONDISI KRITIS!'
    recommendation = 'SEGERA RUJUK KE RS untuk penanganan gawat darurat gizi. Risiko tinggi komplikasi dan kematian.'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
  }

  result.value = {
    status,
    interpretation,
    recommendation,
    colorClass,
    statusColor
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'MUAC (Mid-Upper Arm Circumference)',
    inputs: {
      age_months: ageMonths.value,
      muac_cm: muac.value
    },
    results: {
      status_gizi: status,
      muac_cm: muac.value.toString()
    }
  })
}
</script>
