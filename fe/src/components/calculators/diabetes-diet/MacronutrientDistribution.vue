<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
      <h4 class="font-bold text-green-900 flex items-center space-x-2">
        <ion-icon name="pie-chart" class="text-xl"></ion-icon>
        <span>Distribusi Makronutrien - Standar PERKENI 2024</span>
      </h4>
      <p class="text-sm text-green-700 mt-1">Hitung pembagian Karbohidrat, Protein, dan Lemak</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Total Kalori Per Hari (kkal)</label>
        <input
          v-model.number="totalCalories"
          type="number"
          placeholder="Contoh: 2000"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        <p class="text-xs text-gray-500 mt-1">Gunakan Rule of Thumb atau Harris-Benedict untuk mengetahui kebutuhan kalori</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">% Karbohidrat</label>
        <input
          v-model.number="carbPercent"
          type="number"
          min="45"
          max="65"
          placeholder="45-65%"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
        <p class="text-xs text-gray-500 mt-1">Standar: 45-65% (PERKENI)</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">% Protein</label>
        <input
          v-model.number="proteinPercent"
          type="number"
          min="10"
          max="20"
          placeholder="10-20%"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
        <p class="text-xs text-gray-500 mt-1">Standar: 10-20%</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">% Lemak</label>
        <input
          v-model.number="fatPercent"
          type="number"
          min="20"
          max="30"
          placeholder="20-30%"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
        <p class="text-xs text-gray-500 mt-1">Standar: 20-25%, Max 30%</p>
      </div>

      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg) - untuk protein</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 60"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
        />
        <p class="text-xs text-gray-500 mt-1">Untuk validasi 1,0-1,2 g protein/kg BB</p>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Distribusi Makronutrien
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div class="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6">
        <h4 class="text-lg font-bold mb-4 text-green-900">Hasil Distribusi Makronutrien</h4>

        <!-- Macronutrient Cards -->
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <!-- Carbohydrate -->
          <div class="bg-white rounded-lg p-6 border-2 border-yellow-200">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-600">KARBOHIDRAT</p>
              <ion-icon name="restaurant" class="text-2xl text-yellow-600"></ion-icon>
            </div>
            <p class="text-4xl font-bold text-yellow-700 mb-1">{{ result.carb.grams.toFixed(0) }}g</p>
            <p class="text-sm text-gray-500">{{ result.carb.calories.toFixed(0) }} kkal ({{ carbPercent }}%)</p>
            <p class="text-xs text-yellow-700 mt-2 font-bold">≈ {{ result.carb.portions.toFixed(1) }} porsi</p>
            <p class="text-xs text-gray-500">(1 porsi = 40g KH)</p>
          </div>

          <!-- Protein -->
          <div class="bg-white rounded-lg p-6 border-2 border-red-200">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-600">PROTEIN</p>
              <ion-icon name="egg" class="text-2xl text-red-600"></ion-icon>
            </div>
            <p class="text-4xl font-bold text-red-700 mb-1">{{ result.protein.grams.toFixed(0) }}g</p>
            <p class="text-sm text-gray-500">{{ result.protein.calories.toFixed(0) }} kkal ({{ proteinPercent }}%)</p>
            <div class="mt-2 text-xs">
              <p class="text-red-700 font-bold">Hewani: {{ result.protein.animal.toFixed(1) }}g (65%)</p>
              <p class="text-red-700 font-bold">Nabati: {{ result.protein.plant.toFixed(1) }}g (35%)</p>
            </div>
          </div>

          <!-- Fat -->
          <div class="bg-white rounded-lg p-6 border-2 border-orange-200">
            <div class="flex items-center justify-between mb-2">
              <p class="text-sm font-bold text-gray-600">LEMAK</p>
              <ion-icon name="water" class="text-2xl text-orange-600"></ion-icon>
            </div>
            <p class="text-4xl font-bold text-orange-700 mb-1">{{ result.fat.grams.toFixed(0) }}g</p>
            <p class="text-sm text-gray-500">{{ result.fat.calories.toFixed(0) }} kkal ({{ fatPercent }}%)</p>
            <div class="mt-2 text-xs">
              <p class="text-orange-700 font-bold">Jenuh: {{ result.fat.saturated.toFixed(1) }}g (7%)</p>
              <p class="text-orange-700 font-bold">Tak Jenuh: {{ result.fat.unsaturated.toFixed(1) }}g ({{ (fatPercent - 7).toFixed(0) }}%)</p>
            </div>
          </div>
        </div>

        <!-- Fiber -->
        <div class="bg-white rounded-lg p-4 border-2 border-green-200">
          <p class="text-sm font-bold mb-2">Kebutuhan Serat:</p>
          <p class="text-2xl font-bold text-green-700">{{ result.fiber.toFixed(0) }} gram/hari</p>
          <p class="text-xs text-gray-500">Standar: 14g per 1000 kkal</p>
        </div>

        <!-- Validation -->
        <div v-if="weight" class="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
          <p class="text-sm font-bold text-blue-900 mb-1">Validasi Protein per BB:</p>
          <p class="text-sm">{{ result.protein.perKg.toFixed(2) }} g/kg BB</p>
          <p class="text-xs mt-1" :class="result.protein.perKg >= 1.0 && result.protein.perKg <= 1.2 ? 'text-green-700' : 'text-red-700'">
            {{ result.protein.perKg >= 1.0 && result.protein.perKg <= 1.2 ? '✓ Sesuai standar (1,0-1,2 g/kg BB)' : '⚠️ Di luar rentang standar' }}
          </p>
        </div>
      </div>

      <!-- Reference Table -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Standar Distribusi Makronutrien PERKENI 2024:</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Makronutrien</th>
              <th class="px-4 py-2 text-left">Target %</th>
              <th class="px-4 py-2 text-left">Keterangan</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Karbohidrat</td>
              <td class="px-4 py-2">45-65%</td>
              <td class="px-4 py-2 text-xs">Minimal 130 g/hari; kurangi jika kontrol glikemik jelek</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Protein</td>
              <td class="px-4 py-2">10-20%</td>
              <td class="px-4 py-2 text-xs">1,0-1,2 g/kg BB; 65% hewani, 35% nabati</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2 font-bold">Lemak</td>
              <td class="px-4 py-2">20-25% (Max 30%)</td>
              <td class="px-4 py-2 text-xs">7% jenuh, sisanya tidak jenuh</td>
            </tr>
            <tr>
              <td class="px-4 py-2 font-bold">Serat</td>
              <td class="px-4 py-2">14 g per 1000 kkal</td>
              <td class="px-4 py-2 text-xs">Untuk diet 2000 kkal = 28 g/hari</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-green-50 border border-green-200 rounded-xl p-4">
      <h5 class="font-bold text-green-900 mb-2">Catatan:</h5>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• Total % harus = 100% (KH + Protein + Lemak)</li>
        <li>• Sesuaikan dengan kontrol glikemik dan profil lipid pasien</li>
        <li>• Referensi: PERKENI 2024, Kemenkes RI</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const totalCalories = ref<number | null>(null)
const carbPercent = ref<number>(55)
const proteinPercent = ref<number>(15)
const fatPercent = ref<number>(30)
const weight = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return totalCalories.value && totalCalories.value > 0 &&
         carbPercent.value > 0 && proteinPercent.value > 0 && fatPercent.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !totalCalories.value) return

  // Carbohydrate (4 kkal/g)
  const carbCalories = totalCalories.value * (carbPercent.value / 100)
  const carbGrams = carbCalories / 4
  const carbPortions = carbGrams / 40 // 1 porsi = 40g KH

  // Protein (4 kkal/g)
  const proteinCalories = totalCalories.value * (proteinPercent.value / 100)
  const proteinGrams = proteinCalories / 4
  const proteinAnimal = proteinGrams * 0.65 // 65% hewani
  const proteinPlant = proteinGrams * 0.35 // 35% nabati
  const proteinPerKg = weight.value ? proteinGrams / weight.value : 0

  // Fat (9 kkal/g)
  const fatCalories = totalCalories.value * (fatPercent.value / 100)
  const fatGrams = fatCalories / 9
  const fatSaturated = (totalCalories.value * 0.07) / 9 // 7% jenuh
  const fatUnsaturated = fatGrams - fatSaturated

  // Fiber (14g per 1000 kkal)
  const fiber = (totalCalories.value / 1000) * 14

  result.value = {
    carb: {
      calories: carbCalories,
      grams: carbGrams,
      portions: carbPortions
    },
    protein: {
      calories: proteinCalories,
      grams: proteinGrams,
      animal: proteinAnimal,
      plant: proteinPlant,
      perKg: proteinPerKg
    },
    fat: {
      calories: fatCalories,
      grams: fatGrams,
      saturated: fatSaturated,
      unsaturated: fatUnsaturated
    },
    fiber
  }

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Macronutrient Distribution',
    inputs: {
      total_calories: totalCalories.value,
      carb_percent: carbPercent.value,
      protein_percent: proteinPercent.value,
      fat_percent: fatPercent.value,
      weight_kg: weight.value
    },
    results: {
      carb_grams: carbGrams.toFixed(1),
      protein_grams: proteinGrams.toFixed(1),
      fat_grams: fatGrams.toFixed(1),
      fiber_grams: fiber.toFixed(1)
    }
  })
}
</script>
