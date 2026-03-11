<template>
  <div class="space-y-6">
    <!-- Input Form -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <h4 class="font-bold text-gray-900 mb-4 flex items-center">
        <ion-icon name="calculator" class="text-xl text-blue-600 mr-2"></ion-icon>
        Data Pasien
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Berat Badan (kg) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="weight"
            type="number"
            step="0.1"
            placeholder="70"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Tingkat Aktivitas <span class="text-red-600">*</span>
          </label>
          <select
            v-model="activityLevel"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="calculate"
          >
            <option value="">-- Pilih --</option>
            <option value="light">Ringan (duduk, sedikit aktivitas)</option>
            <option value="moderate">Sedang (jalan, olahraga ringan)</option>
            <option value="heavy">Berat (aktif fisik, olahraga rutin)</option>
          </select>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Kondisi Tambahan
          </label>
          <select
            v-model="condition"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @change="calculate"
          >
            <option value="normal">Normal</option>
            <option value="overweight">Overweight/Obesitas (perlu defisit kalori)</option>
            <option value="diabetes">Hipertensi + Diabetes</option>
            <option value="ckd">Hipertensi + CKD</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="results" class="space-y-4">
      <!-- Energy Requirement -->
      <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300">
        <h4 class="font-bold text-yellow-900 mb-4 flex items-center">
          <ion-icon name="flash" class="text-xl mr-2"></ion-icon>
          Kebutuhan Energi
        </h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Kalori Harian (Rule of Thumb)</p>
            <p class="text-3xl font-bold text-yellow-700">{{ results.calories }} <span class="text-lg">kkal</span></p>
            <p class="text-xs text-gray-600 mt-1">{{ weight }} kg × {{ results.caloriesPerKg }} kkal/kg</p>
          </div>
          <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Target DASH Diet</p>
            <p class="text-3xl font-bold text-amber-700">{{ results.dashTarget }} <span class="text-lg">kkal</span></p>
            <p class="text-xs text-gray-600 mt-1">{{ results.dashNote }}</p>
          </div>
        </div>
      </div>

      <!-- Condition Note -->
      <div v-if="results.conditionNote" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-blue-300">
        <p class="text-sm"><strong>Catatan:</strong> {{ results.conditionNote }}</p>
      </div>

      <!-- DASH Recommendation -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 class="font-bold text-green-900 mb-3 flex items-center">
          <ion-icon name="nutrition" class="text-xl mr-2"></ion-icon>
          Rekomendasi Diet DASH
        </h4>
        <div class="space-y-2 text-sm">
          <p><strong>Target Kalori:</strong> {{ results.dashTarget }} kkal/hari</p>
          <p><strong>Sodium:</strong> {{ results.sodiumLimit }}</p>
          <p><strong>Kalium:</strong> 3500-4700 mg/hari (pisang, jeruk, alpukat, bayam)</p>
          <p><strong>Kalsium:</strong> 1000-1200 mg/hari (low-fat dairy, sayur hijau)</p>
          <p><strong>Magnesium:</strong> 320-420 mg/hari (whole grain, kacang, biji-bijian)</p>
          <p><strong>Serat:</strong> 25-30 g/hari (sayuran, buah, whole grain)</p>
        </div>
      </div>
    </div>

    <!-- Reference Table -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="book" class="text-lg mr-2"></ion-icon>
          Panduan Kebutuhan Energi (Kemenkes 2022)
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Tingkat Aktivitas</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Kkal/kg BB</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Contoh Aktivitas</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Ringan</td>
              <td class="px-4 py-3">20-25 kkal/kg</td>
              <td class="px-4 py-3 text-xs">Duduk sepanjang hari, sedikit berjalan</td>
            </tr>
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Sedang</td>
              <td class="px-4 py-3">25-30 kkal/kg</td>
              <td class="px-4 py-3 text-xs">Jalan kaki rutin, olahraga ringan 2-3x/minggu</td>
            </tr>
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Berat</td>
              <td class="px-4 py-3">30-35 kkal/kg</td>
              <td class="px-4 py-3 text-xs">Pekerjaan fisik berat, olahraga intens rutin</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> Kemenkes RI - Panduan Diet DASH 2022, WHO Guidelines on Sodium Intake, American Heart Association
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number>()
const activityLevel = ref('')
const condition = ref('normal')
const results = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!weight.value || !activityLevel.value) {
    results.value = null
    return
  }

  let caloriesPerKg = 0
  switch (activityLevel.value) {
    case 'light':
      caloriesPerKg = 22.5 // Average of 20-25
      break
    case 'moderate':
      caloriesPerKg = 27.5 // Average of 25-30
      break
    case 'heavy':
      caloriesPerKg = 32.5 // Average of 30-35
      break
  }

  const calories = Math.round(weight.value * caloriesPerKg)
  let dashTarget = 2000 // DASH standard
  let dashNote = 'Target standar DASH'
  let sodiumLimit = '<2300mg/hari (1 sdt garam)'
  let conditionNote = ''

  // Adjust based on condition
  switch (condition.value) {
    case 'overweight':
      dashTarget = Math.max(1500, calories - 500)
      dashNote = 'Defisit 500 kkal untuk penurunan BB'
      conditionNote = 'Untuk overweight/obesitas: Target penurunan 0.5-1 kg/minggu dengan defisit kalori 500 kkal/hari'
      sodiumLimit = '<1500mg/hari (reduced sodium)'
      break
    case 'diabetes':
      dashTarget = Math.min(2000, calories)
      dashNote = 'Kontrol kalori untuk DM+HT'
      conditionNote = 'Kombinasi Hipertensi + Diabetes: Batasi karbohidrat sederhana, fokus whole grain, kontrol porsi'
      sodiumLimit = '<1500mg/hari (reduced sodium)'
      break
    case 'ckd':
      dashTarget = Math.min(2000, calories)
      dashNote = 'Modified DASH untuk CKD'
      conditionNote = 'Hipertensi + CKD: Protein 0.8 g/kg BB, batasi kalium (<2000mg), fosfor rendah, sodium <1500mg'
      sodiumLimit = '<1500mg/hari (reduced sodium)'
      break
    default:
      if (calories > 2200) {
        dashTarget = 2000
        dashNote = 'Disesuaikan ke target DASH standard'
      } else if (calories < 1800) {
        dashTarget = 1800
        dashNote = 'Minimum untuk nutrisi adekuat'
      } else {
        dashTarget = calories
        dashNote = 'Sesuai kebutuhan individu'
      }
  }

  results.value = {
    calories,
    caloriesPerKg,
    dashTarget,
    dashNote,
    sodiumLimit,
    conditionNote
  }

  // Auto-save
  await saveCalculation({
    calculator_type: 'hypertension_diet',
    method: 'Energy Requirement',
    inputs: {
      weight: weight.value,
      activityLevel: activityLevel.value,
      condition: condition.value
    },
    results: {
      calories: results.value.calories,
      dashTarget: results.value.dashTarget,
      sodiumLimit: results.value.sodiumLimit
    }
  })
}
</script>
