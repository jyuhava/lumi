<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
      <h4 class="font-bold text-indigo-900 flex items-center space-x-2">
        <ion-icon name="clipboard" class="text-xl"></ion-icon>
        <span>NRS 2002 - Skrining Risiko Malnutrisi</span>
      </h4>
      <p class="text-sm text-indigo-700 mt-1">Tool skrining dalam 24 jam masuk rumah sakit (Nutritional Risk Screening 2002)</p>
    </div>

    <!-- Screening Questions -->
    <div class="space-y-6">
      <!-- Question 1 -->
      <div class="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h5 class="font-bold text-gray-900 mb-3">
          <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mr-2">1</span>
          Apakah IMT <20.5 kg/m² ATAU berat badan berkurang >5% dalam 3 bulan?
        </h5>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q1"
              type="radio"
              value="0"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Tidak (0 poin)</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q1"
              type="radio"
              value="1"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Ya (1 poin)</span>
          </label>
        </div>
      </div>

      <!-- Question 2 -->
      <div class="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h5 class="font-bold text-gray-900 mb-3">
          <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mr-2">2</span>
          Apakah ada penurunan berat badan >10% dalam 3 bulan?
        </h5>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q2"
              type="radio"
              value="0"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Tidak (0 poin)</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q2"
              type="radio"
              value="1"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Ya (1 poin)</span>
          </label>
        </div>
      </div>

      <!-- Question 3 -->
      <div class="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h5 class="font-bold text-gray-900 mb-3">
          <span class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm mr-2">3</span>
          Apakah ada efek akut dari penyakit (sakit berat/kondisi kritis)?
        </h5>
        <div class="space-y-2">
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q3"
              type="radio"
              value="0"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Tidak / Sakit ringan (0 poin)</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q3"
              type="radio"
              value="1"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Sakit sedang (1 poin)</span>
          </label>
          <label class="flex items-center space-x-3 cursor-pointer">
            <input
              v-model="q3"
              type="radio"
              value="2"
              class="w-5 h-5 text-pink-600 focus:ring-pink-500"
            />
            <span class="text-gray-700">Sakit berat / Kritis (2 poin)</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Skor NRS 2002
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Score Display -->
      <div :class="[
        'border-2 rounded-xl p-6',
        result.riskLevel === 'high' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' :
        result.riskLevel === 'moderate' ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300' :
        'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
      ]">
        <h4 class="text-lg font-bold mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Skrining NRS 2002</span>
        </h4>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white/80 rounded-lg p-6 border">
            <p class="text-sm text-gray-600 mb-1">Total Skor</p>
            <p class="text-5xl font-bold" :class="{
              'text-red-700': result.riskLevel === 'high',
              'text-yellow-700': result.riskLevel === 'moderate',
              'text-green-700': result.riskLevel === 'low'
            }">{{ result.totalScore }}</p>
            <p class="text-xs text-gray-500">poin</p>
          </div>

          <div class="bg-white/80 rounded-lg p-6 border">
            <p class="text-sm text-gray-600 mb-1">Tingkat Risiko</p>
            <p class="text-2xl font-bold" :class="{
              'text-red-700': result.riskLevel === 'high',
              'text-yellow-700': result.riskLevel === 'moderate',
              'text-green-700': result.riskLevel === 'low'
            }">{{ result.riskText }}</p>
          </div>
        </div>

        <!-- Recommendation -->
        <div :class="[
          'p-4 rounded-lg border-2',
          result.riskLevel === 'high' ? 'bg-red-100 border-red-300' :
          result.riskLevel === 'moderate' ? 'bg-yellow-100 border-yellow-300' :
          'bg-green-100 border-green-300'
        ]">
          <p class="font-bold mb-2" :class="{
            'text-red-900': result.riskLevel === 'high',
            'text-yellow-900': result.riskLevel === 'moderate',
            'text-green-900': result.riskLevel === 'low'
          }">
            <ion-icon name="medical" class="align-middle"></ion-icon> Rekomendasi:
          </p>
          <p class="text-sm" :class="{
            'text-red-800': result.riskLevel === 'high',
            'text-yellow-800': result.riskLevel === 'moderate',
            'text-green-800': result.riskLevel === 'low'
          }">{{ result.recommendation }}</p>
        </div>
      </div>

      <!-- Action Plan -->
      <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <h5 class="font-bold text-indigo-900 mb-2 flex items-center space-x-2">
          <ion-icon name="list" class="text-xl"></ion-icon>
          <span>Rencana Tindakan</span>
        </h5>
        <ul class="text-sm text-indigo-800 space-y-1">
          <li v-for="(action, index) in result.actionPlan" :key="index">
            • {{ action }}
          </li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang NRS 2002</span>
      </h5>
      <ul class="text-sm text-blue-800 space-y-1">
        <li>• <strong>NRS 2002:</strong> Nutritional Risk Screening 2002</li>
        <li>• Direkomendasikan oleh ESPEN (European Society for Clinical Nutrition and Metabolism)</li>
        <li>• Harus dilakukan dalam <strong>24 jam</strong> setelah pasien masuk rumah sakit</li>
        <li>• Validitas tinggi untuk memprediksi outcome klinis</li>
        <li>• Digunakan di seluruh dunia sebagai standar skrining malnutrisi</li>
      </ul>
      <p class="text-xs text-blue-600 mt-2">Referensi: Kemenkes - Manajemen Nutrisi Pasien Sakit Kritis, ESPEN Guidelines</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const q1 = ref('')
const q2 = ref('')
const q3 = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return q1.value !== '' && q2.value !== '' && q3.value !== ''
})

const calculate = async () => {
  if (!canCalculate.value) return

  const totalScore = parseInt(q1.value) + parseInt(q2.value) + parseInt(q3.value)

  let riskLevel = ''
  let riskText = ''
  let recommendation = ''
  let actionPlan: string[] = []

  if (totalScore === 0) {
    riskLevel = 'low'
    riskText = 'Risiko Rendah'
    recommendation = 'Tidak ada risiko malnutrisi. Lakukan skrining ulang setiap minggu jika pasien masih dirawat.'
    actionPlan = [
      'Lanjutkan pemberian nutrisi normal sesuai kebutuhan',
      'Skrining ulang setiap 1 minggu',
      'Monitor asupan makan dan status klinis',
      'Dokumentasi asupan nutrisi harian'
    ]
  } else if (totalScore === 1) {
    riskLevel = 'moderate'
    riskText = 'Risiko Sedang'
    recommendation = 'Pasien berisiko malnutrisi. Lakukan monitoring ketat dan pertimbangkan intervensi nutrisi.'
    actionPlan = [
      'Monitoring ketat asupan nutrisi (food recall 24 jam)',
      'Skrining ulang setiap 3 hari',
      'Timbang berat badan 2× seminggu',
      'Konsultasi ahli gizi jika asupan <75% kebutuhan',
      'Pertimbangkan suplemen oral nutrition',
      'Evaluasi laboratorium: albumin, prealbumin'
    ]
  } else {
    riskLevel = 'high'
    riskText = 'Risiko Tinggi'
    recommendation = 'INTERVENSI NUTRISI SEGERA! Pasien berisiko tinggi malnutrisi dan memerlukan manajemen nutrisi intensif.'
    actionPlan = [
      '🚨 KONSULTASI AHLI GIZI SEGERA (dalam 24 jam)',
      'Hitung kebutuhan kalori dan protein (gunakan Holliday-Segar + stress factor)',
      'Rencana nutrisi komprehensif (oral/enteral/parenteral)',
      'Monitoring harian: asupan, berat badan, tanda vital',
      'Pemeriksaan laboratorium: albumin, prealbumin, elektrolit, hemoglobin',
      'Skrining ulang setiap 1-3 hari',
      'Dokumentasi lengkap dan evaluasi outcome',
      'Pertimbangkan nutrisi enteral/parenteral jika oral inadequate'
    ]
  }

  result.value = {
    totalScore,
    riskLevel,
    riskText,
    recommendation,
    actionPlan
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'child_nutrition',
    method: 'NRS 2002 Screening',
    inputs: {
      q1_bmi_weight_loss: `${q1.value} poin`,
      q2_severe_weight_loss: `${q2.value} poin`,
      q3_disease_severity: `${q3.value} poin`
    },
    results: {
      total_score: totalScore,
      risk_level: riskText,
      recommendation: recommendation
    }
  })
}
</script>
