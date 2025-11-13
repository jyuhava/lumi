<template>
  <div class="space-y-6">
    <!-- Calculator Title -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
        <ion-icon name="calculator" class="text-xl text-white"></ion-icon>
      </div>
      <div>
        <h4 class="font-bold text-gray-900">Kalkulator LILA</h4>
        <p class="text-sm text-gray-600">Lingkar Lengan Atas (MUAC)</p>
      </div>
    </div>

    <!-- Input Form -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          Jenis Kelamin
        </label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
        >
          <option value="">Pilih jenis kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          LILA yang Diukur (cm)
        </label>
        <input
          v-model.number="lila"
          type="number"
          step="0.1"
          placeholder="Contoh: 28.5"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!gender || !lila"
      class="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ion-icon name="calculator-outline" class="align-middle mr-2"></ion-icon>
      Hitung Status LILA
    </button>

    <!-- Result -->
    <div v-if="result" class="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200">
      <h5 class="font-bold text-emerald-900 mb-4 flex items-center">
        <ion-icon name="analytics" class="mr-2 text-xl"></ion-icon>
        Hasil Perhitungan
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">LILA Diukur</p>
          <p class="text-3xl font-bold text-emerald-600">{{ result.lila }}</p>
          <p class="text-xs text-gray-500 mt-1">cm</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Standar WHO-NCHS</p>
          <p class="text-2xl font-bold text-gray-700">{{ result.standard }}</p>
          <p class="text-xs text-gray-500 mt-1">cm</p>
        </div>

        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Persentase LILA</p>
          <p class="text-3xl font-bold text-emerald-600">{{ result.percentage }}%</p>
          <p class="text-xs text-gray-500 mt-1">dari standar</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm mb-4">
        <p class="text-sm font-semibold text-gray-700 mb-2">Status Gizi:</p>
        <p :class="['text-xl font-bold mb-2', result.statusColor]">
          {{ result.status }}
        </p>
        <p class="text-sm text-gray-600">{{ result.interpretation }}</p>
      </div>

      <!-- KEK Status (untuk wanita) -->
      <div v-if="gender === 'female'" class="bg-white rounded-lg p-4 shadow-sm border-2" :class="result.kekBorder">
        <p class="text-sm font-semibold mb-2" :class="result.kekColor">
          Status KEK (Kemenkes RI):
        </p>
        <p :class="['text-lg font-bold', result.kekColor]">
          {{ result.kekStatus }}
        </p>
        <p class="text-xs text-gray-600 mt-1">{{ result.kekNote }}</p>
      </div>
    </div>

    <!-- Reference Tables -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Percentage Table -->
      <div class="bg-gray-50 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-4">Kategori %LILA (WHO-NCHS)</h5>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-200">
              <tr>
                <th class="px-4 py-2 text-left font-semibold">Persentase</th>
                <th class="px-4 py-2 text-left font-semibold">Status Gizi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-gray-100">
                <td class="px-4 py-2">&gt; 120%</td>
                <td class="px-4 py-2 text-red-600 font-semibold">Obesitas</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="px-4 py-2">110 - 120%</td>
                <td class="px-4 py-2 text-orange-600 font-semibold">Overweight</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="px-4 py-2">90 - 110%</td>
                <td class="px-4 py-2 text-green-600 font-semibold">Normal</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="px-4 py-2">60 - 90%</td>
                <td class="px-4 py-2 text-blue-600 font-semibold">Kekurangan gizi</td>
              </tr>
              <tr class="hover:bg-gray-100">
                <td class="px-4 py-2">&lt; 60%</td>
                <td class="px-4 py-2 text-purple-600 font-semibold">Kekurangan gizi berat</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- KEK Standards -->
      <div class="bg-gray-50 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-4">Standar LILA</h5>
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-3">
            <p class="text-sm font-semibold text-gray-700">WHO-NCHS (Jelliffe):</p>
            <p class="text-sm text-gray-600">• Pria: 29 cm</p>
            <p class="text-sm text-gray-600">• Wanita: 28,5 cm</p>
          </div>
          <div class="bg-white rounded-lg p-3">
            <p class="text-sm font-semibold text-gray-700">Kemenkes RI (WUS & Bumil):</p>
            <p class="text-sm text-green-600 font-semibold">• ≥ 23,5 cm: Normal</p>
            <p class="text-sm text-red-600 font-semibold">• &lt; 23,5 cm: Risiko KEK</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Formula Display -->
    <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4">
      <p class="text-sm font-semibold text-indigo-900 mb-2">Rumus %LILA:</p>
      <div class="bg-white rounded p-3 font-mono text-sm">
        %LILA = (LILA Diukur / LILA Standar) × 100%
      </div>
      <p class="text-xs text-indigo-700 mt-2">
        <strong>Sumber:</strong> WHO-NCHS (Jelliffe & Jelliffe 1989), Kemenkes RI
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const lila = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculate = async () => {
  if (!gender.value || !lila.value) return

  const standard = gender.value === 'male' ? 29 : 28.5
  const percentage = (lila.value / standard) * 100
  
  let status = ''
  let statusColor = ''
  let interpretation = ''

  if (percentage > 120) {
    status = 'Obesitas'
    statusColor = 'text-red-600'
    interpretation = 'LILA lebih dari standar, menunjukkan kemungkinan obesitas.'
  } else if (percentage >= 110) {
    status = 'Overweight'
    statusColor = 'text-orange-600'
    interpretation = 'LILA sedikit lebih dari standar, menunjukkan kelebihan berat badan.'
  } else if (percentage >= 90) {
    status = 'Normal'
    statusColor = 'text-green-600'
    interpretation = 'LILA dalam batas normal, status gizi baik.'
  } else if (percentage >= 60) {
    status = 'Kekurangan Gizi'
    statusColor = 'text-blue-600'
    interpretation = 'LILA kurang dari standar, menunjukkan kekurangan gizi.'
  } else {
    status = 'Kekurangan Gizi Berat'
    statusColor = 'text-purple-600'
    interpretation = 'LILA jauh kurang dari standar, menunjukkan kekurangan gizi berat.'
  }

  // KEK Status (Kemenkes RI) - untuk wanita
  let kekStatus = ''
  let kekColor = ''
  let kekBorder = ''
  let kekNote = ''

  if (gender.value === 'female') {
    if (lila.value >= 23.5) {
      kekStatus = 'Normal'
      kekColor = 'text-green-600'
      kekBorder = 'border-green-300'
      kekNote = 'Tidak ada risiko KEK (Kekurangan Energi Kronis)'
    } else {
      kekStatus = 'Risiko KEK'
      kekColor = 'text-red-600'
      kekBorder = 'border-red-300'
      kekNote = 'Berisiko mengalami KEK. Penting untuk WUS dan ibu hamil mencegah BBLR dan stunting.'
    }
  }

  result.value = {
    lila: lila.value.toFixed(1),
    standard: standard.toFixed(1),
    percentage: percentage.toFixed(1),
    status,
    statusColor,
    interpretation,
    kekStatus,
    kekColor,
    kekBorder,
    kekNote
  }

  await saveCalculation({
    calculator_type: 'nutritional_status',
    method: 'LILA',
    inputs: {
      gender: gender.value,
      lila: lila.value
    },
    results: result.value
  })
}
</script>
