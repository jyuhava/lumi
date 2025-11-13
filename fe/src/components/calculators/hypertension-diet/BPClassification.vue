<template>
  <div class="space-y-6">
    <!-- Input Form -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <h4 class="font-bold text-gray-900 mb-4 flex items-center">
        <ion-icon name="medical" class="text-xl text-blue-600 mr-2"></ion-icon>
        Input Tekanan Darah
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Sistolik (mmHg) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="systolic"
            type="number"
            placeholder="120"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Diastolik (mmHg) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="diastolic"
            type="number"
            placeholder="80"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="classification" class="space-y-4">
      <!-- Classification Result -->
      <div :class="['rounded-xl p-6 border-2', classificationColor]">
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h4 class="font-bold text-lg mb-2 flex items-center">
              <ion-icon :name="classificationIcon" class="text-2xl mr-2"></ion-icon>
              {{ classification.category }}
            </h4>
            <p class="text-sm font-medium mb-3">{{ classification.description }}</p>
            
            <div class="bg-white/50 backdrop-blur-sm rounded-lg p-3 mb-3">
              <p class="text-xs font-bold text-gray-700 mb-1">Kriteria:</p>
              <p class="text-sm">{{ classification.criteria }}</p>
            </div>

            <div class="bg-white/50 backdrop-blur-sm rounded-lg p-3">
              <p class="text-xs font-bold text-gray-700 mb-1">Rekomendasi Tindakan:</p>
              <p class="text-sm font-medium">{{ classification.action }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Diet Indication -->
      <div v-if="classification.dashIndication" class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 class="font-bold text-green-900 mb-3 flex items-center">
          <ion-icon name="nutrition" class="text-xl mr-2"></ion-icon>
          Indikasi Diet DASH
        </h4>
        <div class="space-y-2">
          <p class="text-sm"><strong>Target:</strong> {{ classification.dashIndication.target }}</p>
          <p class="text-sm"><strong>Sodium Limit:</strong> {{ classification.dashIndication.sodiumLimit }}</p>
          <p class="text-sm"><strong>Expected Result:</strong> {{ classification.dashIndication.expectedResult }}</p>
        </div>
      </div>
    </div>

    <!-- Reference Table -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="book" class="text-lg mr-2"></ion-icon>
          Klasifikasi Hipertensi (JNC7 & Kemenkes 2022)
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Kategori</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Sistolik</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Diastolik</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Tindakan</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-green-50">
              <td class="px-4 py-3 font-medium text-green-700">Normal</td>
              <td class="px-4 py-3">&lt;120</td>
              <td class="px-4 py-3">&lt;80</td>
              <td class="px-4 py-3 text-xs">Monitor rutin</td>
            </tr>
            <tr class="hover:bg-yellow-50">
              <td class="px-4 py-3 font-medium text-yellow-700">Elevated</td>
              <td class="px-4 py-3">120-129</td>
              <td class="px-4 py-3">&lt;80</td>
              <td class="px-4 py-3 text-xs">Modifikasi gaya hidup</td>
            </tr>
            <tr class="hover:bg-orange-50">
              <td class="px-4 py-3 font-medium text-orange-700">Stage 1 Hypertension</td>
              <td class="px-4 py-3">130-139</td>
              <td class="px-4 py-3">80-89</td>
              <td class="px-4 py-3 text-xs"><strong>Diet DASH + monitoring</strong></td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium text-red-700">Stage 2 Hypertension</td>
              <td class="px-4 py-3">≥140</td>
              <td class="px-4 py-3">≥90</td>
              <td class="px-4 py-3 text-xs"><strong>Diet DASH + medikasi</strong></td>
            </tr>
            <tr class="hover:bg-red-100">
              <td class="px-4 py-3 font-medium text-red-900">Hypertensive Crisis</td>
              <td class="px-4 py-3">&gt;180</td>
              <td class="px-4 py-3">&gt;120</td>
              <td class="px-4 py-3 text-xs"><strong>EMERGENSI MEDIS</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> JNC7 (Seventh Report of Joint National Committee), Kemenkes RI 2022, American Heart Association 2017
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const systolic = ref<number>()
const diastolic = ref<number>()
const classification = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

interface BPClassification {
  category: string
  description: string
  criteria: string
  action: string
  color: string
  icon: string
  dashIndication?: {
    target: string
    sodiumLimit: string
    expectedResult: string
  }
}

const classifyBP = (sys: number, dia: number): BPClassification => {
  if (sys >= 180 || dia >= 120) {
    return {
      category: 'Hypertensive Crisis',
      description: 'Krisis Hipertensi - Memerlukan Penanganan Segera',
      criteria: 'Sistolik >180 mmHg ATAU Diastolik >120 mmHg',
      action: 'EMERGENSI MEDIS - Segera ke IGD, rujuk ke rumah sakit',
      color: 'bg-red-100 border-red-600 text-red-900',
      icon: 'warning'
    }
  } else if (sys >= 140 || dia >= 90) {
    return {
      category: 'Stage 2 Hypertension',
      description: 'Hipertensi Stage 2 - Perlu Intervensi Medis',
      criteria: 'Sistolik ≥140 mmHg ATAU Diastolik ≥90 mmHg',
      action: 'Diet DASH Reduced Sodium (<1500mg) + Medikasi antihipertensi + Monitoring ketat',
      color: 'bg-red-50 border-red-400 text-red-800',
      icon: 'alert-circle',
      dashIndication: {
        target: 'DASH Reduced Sodium (1500mg/hari)',
        sodiumLimit: '<1500mg sodium per hari (⅔ sendok teh garam)',
        expectedResult: 'Penurunan TD sistolik 8-14 mmHg, diastolik 4-7 mmHg dalam 8-12 minggu'
      }
    }
  } else if (sys >= 130 || dia >= 80) {
    return {
      category: 'Stage 1 Hypertension',
      description: 'Hipertensi Stage 1 - Modifikasi Gaya Hidup Intensif',
      criteria: 'Sistolik 130-139 mmHg ATAU Diastolik 80-89 mmHg',
      action: 'Diet DASH Standard (<2300mg sodium) + Olahraga + Penurunan BB + Monitoring bulanan',
      color: 'bg-orange-50 border-orange-400 text-orange-800',
      icon: 'alert',
      dashIndication: {
        target: 'DASH Standard (2300mg/hari) atau Reduced (1500mg)',
        sodiumLimit: '<2300mg sodium per hari (1 sendok teh garam)',
        expectedResult: 'Penurunan TD sistolik 6-11 mmHg, diastolik 3-6 mmHg dalam 4-8 minggu'
      }
    }
  } else if (sys >= 120 && dia < 80) {
    return {
      category: 'Elevated Blood Pressure',
      description: 'Tekanan Darah Meningkat - Risiko Hipertensi',
      criteria: 'Sistolik 120-129 mmHg DAN Diastolik <80 mmHg',
      action: 'Modifikasi gaya hidup: Diet sehat, olahraga teratur, kelola stress, monitoring 3-6 bulan',
      color: 'bg-yellow-50 border-yellow-400 text-yellow-800',
      icon: 'information-circle',
      dashIndication: {
        target: 'Diet DASH Standard (preventif)',
        sodiumLimit: '<2300mg sodium per hari',
        expectedResult: 'Pencegahan progresi ke hipertensi stage 1'
      }
    }
  } else {
    return {
      category: 'Normal Blood Pressure',
      description: 'Tekanan Darah Normal - Pertahankan',
      criteria: 'Sistolik <120 mmHg DAN Diastolik <80 mmHg',
      action: 'Pertahankan gaya hidup sehat, monitoring tahunan',
      color: 'bg-green-50 border-green-400 text-green-800',
      icon: 'checkmark-circle'
    }
  }
}

const classificationColor = computed(() => classification.value?.color || '')
const classificationIcon = computed(() => classification.value?.icon || 'help')

const calculate = async () => {
  if (!systolic.value || !diastolic.value) {
    classification.value = null
    return
  }

  classification.value = classifyBP(systolic.value, diastolic.value)

  // Auto-save
  await saveCalculation({
    calculator_type: 'hypertension_diet',
    calculation_data: {
      method: 'BP Classification',
      inputs: {
        systolic: systolic.value,
        diastolic: diastolic.value
      },
      results: {
        category: classification.value.category,
        action: classification.value.action,
        dashIndication: classification.value.dashIndication
      }
    }
  })
}
</script>
