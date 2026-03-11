<template>
  <div class="space-y-6">
    <!-- Input Form -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <h4 class="font-bold text-gray-900 mb-4 flex items-center">
        <ion-icon name="calculator" class="text-xl text-blue-600 mr-2"></ion-icon>
        Perhitungan Distribusi Makronutrien DASH
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Total Kalori Target (kkal/hari) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="totalCalories"
            type="number"
            placeholder="2000"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
          <p class="text-xs text-gray-500 mt-1">Standard DASH: 2000 kkal/hari</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Karbohidrat (%) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="carbPercent"
            type="number"
            min="45"
            max="65"
            placeholder="55"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
          <p class="text-xs text-gray-500 mt-1">Range: 45-65% (default 55%)</p>
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Protein (%) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="proteinPercent"
            type="number"
            min="10"
            max="20"
            placeholder="18"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
          <p class="text-xs text-gray-500 mt-1">Range: 10-20% (default 18%)</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-bold text-gray-700 mb-2">
            Lemak (%) <span class="text-red-600">*</span>
          </label>
          <input
            v-model.number="fatPercent"
            type="number"
            min="20"
            max="30"
            placeholder="27"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            @input="calculate"
          />
          <p class="text-xs text-gray-500 mt-1">Range: 20-30% (default 27%)</p>
        </div>
      </div>

      <div v-if="totalPercent !== 100" class="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg">
        <p class="text-sm text-red-700 font-medium">
          ⚠️ Total persentase harus 100%. Saat ini: {{ totalPercent }}%
        </p>
      </div>
    </div>

    <!-- Results -->
    <div v-if="results && totalPercent === 100" class="space-y-4">
      <!-- Macronutrient Cards -->
      <div class="grid md:grid-cols-3 gap-4">
        <!-- Carbohydrate -->
        <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300">
          <h4 class="font-bold text-yellow-900 mb-3 flex items-center">
            <ion-icon name="nutrition" class="text-xl mr-2"></ion-icon>
            Karbohidrat
          </h4>
          <div class="space-y-2">
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Persentase</p>
              <p class="text-2xl font-bold text-yellow-700">{{ carbPercent }}%</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Kalori</p>
              <p class="text-xl font-bold text-yellow-700">{{ results.carbCalories }} kkal</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Gram</p>
              <p class="text-xl font-bold text-yellow-700">{{ results.carbGrams }} g</p>
              <p class="text-xs text-gray-500">÷ 4 kkal/g</p>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-3">
            <strong>Fokus:</strong> Whole grains, sayuran, buah (kompleks)
          </p>
        </div>

        <!-- Protein -->
        <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-300">
          <h4 class="font-bold text-red-900 mb-3 flex items-center">
            <ion-icon name="fitness" class="text-xl mr-2"></ion-icon>
            Protein
          </h4>
          <div class="space-y-2">
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Persentase</p>
              <p class="text-2xl font-bold text-red-700">{{ proteinPercent }}%</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Kalori</p>
              <p class="text-xl font-bold text-red-700">{{ results.proteinCalories }} kkal</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Gram</p>
              <p class="text-xl font-bold text-red-700">{{ results.proteinGrams }} g</p>
              <p class="text-xs text-gray-500">÷ 4 kkal/g</p>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-3">
            <strong>Fokus:</strong> Ikan, ayam tanpa kulit, low-fat dairy
          </p>
        </div>

        <!-- Fat -->
        <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-300">
          <h4 class="font-bold text-orange-900 mb-3 flex items-center">
            <ion-icon name="water" class="text-xl mr-2"></ion-icon>
            Lemak
          </h4>
          <div class="space-y-2">
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Persentase</p>
              <p class="text-2xl font-bold text-orange-700">{{ fatPercent }}%</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Kalori</p>
              <p class="text-xl font-bold text-orange-700">{{ results.fatCalories }} kkal</p>
            </div>
            <div class="bg-white/70 rounded-lg p-3">
              <p class="text-xs text-gray-600">Gram</p>
              <p class="text-xl font-bold text-orange-700">{{ results.fatGrams }} g</p>
              <p class="text-xs text-gray-500">÷ 9 kkal/g</p>
            </div>
          </div>
          <p class="text-xs text-gray-600 mt-3">
            <strong>Fokus:</strong> Lemak tidak jenuh (olive oil, nuts)
          </p>
        </div>
      </div>

      <!-- Fat Breakdown -->
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-300">
        <h4 class="font-bold text-purple-900 mb-4 flex items-center">
          <ion-icon name="pie-chart" class="text-xl mr-2"></ion-icon>
          Detail Lemak (DASH Recommendation)
        </h4>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white/70 rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Lemak Jenuh</p>
            <p class="text-2xl font-bold text-red-700">{{ results.saturatedFatGrams }} g</p>
            <p class="text-xs text-gray-600 mt-1"><6% kalori total</p>
            <p class="text-xs text-red-600 font-bold mt-2">BATASI!</p>
          </div>
          <div class="bg-white/70 rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Lemak Tidak Jenuh</p>
            <p class="text-2xl font-bold text-green-700">{{ results.unsaturatedFatGrams }} g</p>
            <p class="text-xs text-gray-600 mt-1">Sisa dari total lemak</p>
            <p class="text-xs text-green-600 font-bold mt-2">PRIORITAS</p>
          </div>
          <div class="bg-white/70 rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Lemak Trans</p>
            <p class="text-2xl font-bold text-red-900">0 g</p>
            <p class="text-xs text-red-700 font-bold mt-3">HINDARI TOTAL!</p>
          </div>
        </div>
      </div>

      <!-- Fiber -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <h4 class="font-bold text-green-900 mb-3 flex items-center">
          <ion-icon name="leaf" class="text-xl mr-2"></ion-icon>
          Serat (Fiber)
        </h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white/70 rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Target Serat DASH</p>
            <p class="text-3xl font-bold text-green-700">{{ results.fiberGrams }} g/hari</p>
            <p class="text-xs text-gray-600 mt-1">14g per 1000 kkal</p>
          </div>
          <div class="bg-white/70 rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-2">Sumber Serat Tinggi:</p>
            <ul class="text-xs space-y-1">
              <li>• Sayuran hijau (bayam, brokoli)</li>
              <li>• Buah dengan kulit (apel, pir)</li>
              <li>• Whole grains (oatmeal, brown rice)</li>
              <li>• Kacang-kacangan & biji-bijian</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Reference Table -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="book" class="text-lg mr-2"></ion-icon>
          Standar Komposisi Makronutrien DASH (Kemenkes 2022)
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Makronutrien</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">% Kalori</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Untuk 2000 kkal</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Fokus</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-yellow-50">
              <td class="px-4 py-3 font-medium">Karbohidrat</td>
              <td class="px-4 py-3">55% (45-65%)</td>
              <td class="px-4 py-3">275g (1100 kkal ÷ 4)</td>
              <td class="px-4 py-3 text-xs">Whole grains, sayuran, buah</td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium">Protein</td>
              <td class="px-4 py-3">18% (10-20%)</td>
              <td class="px-4 py-3">90g (360 kkal ÷ 4)</td>
              <td class="px-4 py-3 text-xs">Ikan, ayam, low-fat dairy</td>
            </tr>
            <tr class="hover:bg-orange-50">
              <td class="px-4 py-3 font-medium">Lemak Total</td>
              <td class="px-4 py-3">27% (20-30%)</td>
              <td class="px-4 py-3">60g (540 kkal ÷ 9)</td>
              <td class="px-4 py-3 text-xs">Lemak tidak jenuh prioritas</td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium">- Lemak Jenuh</td>
              <td class="px-4 py-3"><6%</td>
              <td class="px-4 py-3"><13g</td>
              <td class="px-4 py-3 text-xs text-red-600">BATASI</td>
            </tr>
            <tr class="hover:bg-green-50">
              <td class="px-4 py-3 font-medium">Serat</td>
              <td class="px-4 py-3">-</td>
              <td class="px-4 py-3">25-30g</td>
              <td class="px-4 py-3 text-xs">14g per 1000 kkal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> Kemenkes RI - Diet DASH 2022, DASH Diet Original NIH, American Heart Association
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const totalCalories = ref(2000)
const carbPercent = ref(55)
const proteinPercent = ref(18)
const fatPercent = ref(27)
const results = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const totalPercent = computed(() => {
  return (carbPercent.value || 0) + (proteinPercent.value || 0) + (fatPercent.value || 0)
})

const calculate = async () => {
  if (!totalCalories.value || totalPercent.value !== 100) {
    results.value = null
    return
  }

  // Carbohydrate
  const carbCalories = Math.round((totalCalories.value * carbPercent.value) / 100)
  const carbGrams = Math.round(carbCalories / 4)

  // Protein
  const proteinCalories = Math.round((totalCalories.value * proteinPercent.value) / 100)
  const proteinGrams = Math.round(proteinCalories / 4)

  // Fat
  const fatCalories = Math.round((totalCalories.value * fatPercent.value) / 100)
  const fatGrams = Math.round(fatCalories / 9)

  // Fat breakdown
  const saturatedFatCalories = Math.round(totalCalories.value * 0.06) // <6%
  const saturatedFatGrams = Math.round(saturatedFatCalories / 9)
  const unsaturatedFatGrams = fatGrams - saturatedFatGrams

  // Fiber
  const fiberGrams = Math.round((totalCalories.value / 1000) * 14)

  results.value = {
    carbCalories,
    carbGrams,
    proteinCalories,
    proteinGrams,
    fatCalories,
    fatGrams,
    saturatedFatGrams,
    unsaturatedFatGrams,
    fiberGrams
  }

  // Auto-save
  await saveCalculation({
    calculator_type: 'hypertension_diet',
    method: 'DASH Macronutrient Distribution',
    inputs: {
      totalCalories: totalCalories.value,
      carbPercent: carbPercent.value,
      proteinPercent: proteinPercent.value,
      fatPercent: fatPercent.value
    },
    results: {
      carb: `${carbGrams}g (${carbCalories} kkal)`,
      protein: `${proteinGrams}g (${proteinCalories} kkal)`,
      fat: `${fatGrams}g (${fatCalories} kkal)`,
      saturatedFat: `${saturatedFatGrams}g`,
      fiber: `${fiberGrams}g`
    }
  })
}

// Initial calculation
calculate()
</script>
