<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="calculator" class="text-xl"></ion-icon>
        <span>Rule of Thumb - Kebutuhan Energi Praktis (PERKENI 2024)</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">Metode cepat: 25-30 kkal/kg berat badan ideal</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan Ideal (kg)</label>
        <input
          v-model.number="idealWeight"
          type="number"
          step="0.1"
          placeholder="Contoh: 60"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <p class="text-xs text-gray-500 mt-1">Gunakan IBW Calculator jika belum tahu BB ideal</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Stress Metabolik</label>
        <select v-model="stressLevel" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
          <option value="none">Tidak Ada Stress (25-30 kkal/kg)</option>
          <option value="mild">Ringan (30-35 kkal/kg)</option>
          <option value="moderate">Sedang (35-40 kkal/kg)</option>
          <option value="severe">Berat (40-45 kkal/kg)</option>
        </select>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Energi
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div class="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-300 rounded-xl p-6">
        <h4 class="text-lg font-bold mb-4 text-red-900">Hasil Perhitungan</h4>

        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-red-200">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Energi Minimum</p>
            <p class="text-5xl font-bold text-red-700 mb-1">{{ result.minCalories }}</p>
            <p class="text-sm text-gray-500">kkal/hari</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-orange-200">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Energi Maksimum</p>
            <p class="text-5xl font-bold text-orange-700 mb-1">{{ result.maxCalories }}</p>
            <p class="text-sm text-gray-500">kkal/hari</p>
          </div>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-red-200">
          <p class="text-sm font-bold mb-2">Rentang Target:</p>
          <p class="text-3xl font-bold text-red-700">{{ result.minCalories }} - {{ result.maxCalories }} kkal/hari</p>
          <p class="text-sm text-gray-600 mt-2">{{ result.recommendation }}</p>
        </div>
      </div>

      <!-- Reference Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Panduan Rule of Thumb (PERKENI 2024):</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Kondisi</th>
              <th class="px-4 py-2 text-left">Kalori per kg BB Ideal</th>
              <th class="px-4 py-2 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Tidak Ada Stress</td>
              <td class="px-4 py-2">25-30 kkal/kg</td>
              <td class="px-4 py-2 text-xs">Pasien DM stabil, aktivitas normal</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Stress Ringan</td>
              <td class="px-4 py-2">30-35 kkal/kg</td>
              <td class="px-4 py-2 text-xs">Infeksi ringan, bedah minor</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Stress Sedang</td>
              <td class="px-4 py-2">35-40 kkal/kg</td>
              <td class="px-4 py-2 text-xs">Bedah mayor, infeksi sedang</td>
            </tr>
            <tr>
              <td class="px-4 py-2 font-bold">Stress Berat</td>
              <td class="px-4 py-2">40-45 kkal/kg</td>
              <td class="px-4 py-2 text-xs">Sepsis, luka bakar, trauma berat</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-red-50 border border-red-200 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2">Catatan Penting:</h5>
      <ul class="text-sm text-red-800 space-y-1">
        <li>• Metode ini praktis untuk estimasi cepat kebutuhan energi harian</li>
        <li>• Untuk hasil lebih presisi, gunakan metode Harris-Benedict</li>
        <li>• Sesuaikan dengan kontrol glikemik dan target berat badan pasien</li>
        <li>• Referensi: PERKENI 2024, Kemenkes RI</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const idealWeight = ref<number | null>(null)
const stressLevel = ref<string>('none')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return idealWeight.value && idealWeight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !idealWeight.value) return

  let minMultiplier = 25
  let maxMultiplier = 30
  let stressText = 'Tidak Ada Stress Metabolik'

  switch (stressLevel.value) {
    case 'mild':
      minMultiplier = 30
      maxMultiplier = 35
      stressText = 'Stress Ringan'
      break
    case 'moderate':
      minMultiplier = 35
      maxMultiplier = 40
      stressText = 'Stress Sedang'
      break
    case 'severe':
      minMultiplier = 40
      maxMultiplier = 45
      stressText = 'Stress Berat'
      break
  }

  const minCalories = Math.round(idealWeight.value * minMultiplier)
  const maxCalories = Math.round(idealWeight.value * maxMultiplier)

  const recommendation = `Untuk pasien DM dengan BB ideal ${idealWeight.value} kg dan ${stressText.toLowerCase()}, target kalori harian adalah ${minCalories}-${maxCalories} kkal. Bagi dalam 3 kali makan utama dan 1-2 snack.`

  result.value = {
    minCalories,
    maxCalories,
    stressText,
    recommendation
  }

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Rule of Thumb',
    inputs: {
      ideal_weight_kg: idealWeight.value,
      stress_level: stressLevel.value
    },
    results: {
      min_calories: minCalories.toString(),
      max_calories: maxCalories.toString(),
      target_range: `${minCalories}-${maxCalories} kkal/hari`
    }
  })
}
</script>
