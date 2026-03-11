<template>
  <div class="space-y-6">
    <!-- Calculator Form -->
    <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-300">
      <h4 class="font-bold text-gray-900 mb-4 flex items-center">
        <ion-icon name="calculator" class="text-xl text-red-600 mr-2"></ion-icon>
        Kalkulator Sodium Intake Harian
      </h4>

      <div class="space-y-4">
        <p class="text-sm text-gray-700 mb-4">
          Masukkan estimasi konsumsi makanan Anda untuk menghitung total sodium intake
        </p>

        <!-- Food Categories -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Makanan Olahan/Kalengan (porsi/hari)
            </label>
            <input
              v-model.number="processedFood"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈400mg sodium/porsi (soup kaleng, sayur kaleng, ikan kalengan)</p>
          </div>

          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Fast Food/Makanan Cepat Saji (porsi/hari)
            </label>
            <input
              v-model.number="fastFood"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈1500mg sodium/meal (burger, pizza, fried chicken, mie instan)</p>
          </div>

          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Daging Olahan (porsi/hari)
            </label>
            <input
              v-model.number="processedMeat"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈750mg sodium/porsi (sosis, ham, bacon, kornet, salami)</p>
          </div>

          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Saus/Condiments (sendok makan/hari)
            </label>
            <input
              v-model.number="sauces"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈1000mg sodium/tbsp (kecap asin, soy sauce, fish sauce, teriyaki)</p>
          </div>

          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Snack Kemasan (porsi/hari)
            </label>
            <input
              v-model.number="snacks"
              type="number"
              min="0"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈300mg sodium/porsi (keripik, crackers, pretzels, popcorn)</p>
          </div>

          <div class="bg-white rounded-lg p-4">
            <label class="block text-sm font-bold text-gray-700 mb-2">
              Garam Meja (sendok teh/hari)
            </label>
            <input
              v-model.number="tableSalt"
              type="number"
              min="0"
              step="0.1"
              placeholder="0"
              class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              @input="calculate"
            />
            <p class="text-xs text-gray-500 mt-1">≈2300mg sodium/tsp (garam yang ditambahkan saat memasak atau di meja)</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Results -->
    <div v-if="results" class="space-y-4">
      <!-- Total Sodium -->
      <div :class="['rounded-xl p-6 border-2', sodiumColor]">
        <h4 class="font-bold text-lg mb-3 flex items-center">
          <ion-icon name="analytics" class="text-2xl mr-2"></ion-icon>
          Total Sodium Intake
        </h4>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Estimasi Total Sodium</p>
            <p class="text-4xl font-bold" :class="sodiumTextColor">
              {{ results.totalSodium }} <span class="text-lg">mg</span>
            </p>
            <p class="text-xs text-gray-600 mt-1">per hari</p>
          </div>
          <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
            <p class="text-xs text-gray-600 mb-1">Status</p>
            <p class="text-2xl font-bold" :class="sodiumTextColor">{{ results.status }}</p>
            <p class="text-xs text-gray-600 mt-1">{{ results.recommendation }}</p>
          </div>
        </div>
      </div>

      <!-- Breakdown -->
      <div class="bg-white rounded-xl border-2 border-gray-200 p-6">
        <h4 class="font-bold text-gray-900 mb-4">Rincian Sodium dari Setiap Sumber:</h4>
        <div class="space-y-2">
          <div v-if="results.breakdown.processedFood > 0" class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="text-sm">Makanan Olahan/Kalengan</span>
            <span class="font-bold text-gray-900">{{ results.breakdown.processedFood }} mg</span>
          </div>
          <div v-if="results.breakdown.fastFood > 0" class="flex justify-between items-center p-3 bg-red-50 rounded-lg">
            <span class="text-sm">Fast Food</span>
            <span class="font-bold text-red-700">{{ results.breakdown.fastFood }} mg</span>
          </div>
          <div v-if="results.breakdown.processedMeat > 0" class="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
            <span class="text-sm">Daging Olahan</span>
            <span class="font-bold text-orange-700">{{ results.breakdown.processedMeat }} mg</span>
          </div>
          <div v-if="results.breakdown.sauces > 0" class="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span class="text-sm">Saus/Condiments</span>
            <span class="font-bold text-yellow-700">{{ results.breakdown.sauces }} mg</span>
          </div>
          <div v-if="results.breakdown.snacks > 0" class="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span class="text-sm">Snack Kemasan</span>
            <span class="font-bold text-purple-700">{{ results.breakdown.snacks }} mg</span>
          </div>
          <div v-if="results.breakdown.tableSalt > 0" class="flex justify-between items-center p-3 bg-red-100 rounded-lg">
            <span class="text-sm">Garam Meja</span>
            <span class="font-bold text-red-900">{{ results.breakdown.tableSalt }} mg</span>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
        <h4 class="font-bold text-blue-900 mb-3 flex items-center">
          <ion-icon name="bulb" class="text-xl mr-2"></ion-icon>
          Rekomendasi Pengurangan Sodium
        </h4>
        <div class="space-y-2 text-sm">
          <p v-if="results.totalSodium > 2300">
            ⚠️ <strong>Sodium Anda melebihi target DASH Standard (2300mg)</strong>
          </p>
          <p v-if="results.totalSodium > 1500">
            ⚠️ <strong>Untuk hipertensi, target optimal adalah <1500mg/hari</strong>
          </p>
          <div class="mt-3 space-y-1">
            <p class="font-bold text-blue-900">Langkah-langkah:</p>
            <p v-if="fastFood > 0">• <strong>PRIORITAS TINGGI:</strong> Kurangi/hilangkan fast food (kontributor terbesar)</p>
            <p v-if="processedMeat > 0">• Ganti daging olahan dengan protein segar (ikan, ayam tanpa kulit)</p>
            <p v-if="sauces > 0">• Batasi saus kemasan, gunakan bumbu alami (lemon, herbs, rempah)</p>
            <p v-if="tableSalt > 0">• Kurangi garam meja secara bertahap (25% per minggu)</p>
            <p v-if="processedFood > 0">• Pilih produk "low-sodium" atau "no salt added"</p>
            <p>• Perbanyak makanan segar: sayuran, buah, whole grain</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Reference Targets -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="book" class="text-lg mr-2"></ion-icon>
          Target Sodium DASH & Klasifikasi
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Kategori</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Sodium Limit</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Indikasi</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-green-50">
              <td class="px-4 py-3 font-medium text-green-700">Optimal (DASH Reduced)</td>
              <td class="px-4 py-3"><strong><1500mg</strong></td>
              <td class="px-4 py-3 text-xs">Hipertensi Stage 1-2, optimal control</td>
              <td class="px-4 py-3 text-xs text-green-700">⭐⭐⭐ Excellent</td>
            </tr>
            <tr class="hover:bg-yellow-50">
              <td class="px-4 py-3 font-medium text-yellow-700">Good (DASH Standard)</td>
              <td class="px-4 py-3">1500-2300mg</td>
              <td class="px-4 py-3 text-xs">Prehipertensi, Stage 1 ringan</td>
              <td class="px-4 py-3 text-xs text-yellow-700">⭐⭐ Good</td>
            </tr>
            <tr class="hover:bg-orange-50">
              <td class="px-4 py-3 font-medium text-orange-700">Borderline High</td>
              <td class="px-4 py-3">2300-3000mg</td>
              <td class="px-4 py-3 text-xs">Perlu pengurangan bertahap</td>
              <td class="px-4 py-3 text-xs text-orange-700">⚠️ Reduce</td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium text-red-700">High (Rata-rata Indonesia)</td>
              <td class="px-4 py-3">3000-4000mg</td>
              <td class="px-4 py-3 text-xs">Risiko tinggi hipertensi</td>
              <td class="px-4 py-3 text-xs text-red-700">❌ High Risk</td>
            </tr>
            <tr class="hover:bg-red-100">
              <td class="px-4 py-3 font-medium text-red-900">Very High</td>
              <td class="px-4 py-3">>4000mg</td>
              <td class="px-4 py-3 text-xs">Perlu intervensi segera</td>
              <td class="px-4 py-3 text-xs text-red-900">🚨 Very High</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
      <h4 class="font-bold text-green-900 mb-3 flex items-center">
        <ion-icon name="checkmark-circle" class="text-xl mr-2"></ion-icon>
        Tips Mengurangi Sodium
      </h4>
      <div class="grid md:grid-cols-2 gap-3 text-sm">
        <div>
          <p class="font-bold text-gray-900 mb-1">✓ Lakukan:</p>
          <ul class="space-y-1 ml-4 list-disc">
            <li>Masak di rumah dengan bahan segar</li>
            <li>Baca label nutrisi (pilih <140mg/serving)</li>
            <li>Gunakan bumbu alami (herbs, lemon, jahe)</li>
            <li>Bilas makanan kalengan dengan air</li>
          </ul>
        </div>
        <div>
          <p class="font-bold text-gray-900 mb-1">✗ Hindari:</p>
          <ul class="space-y-1 ml-4 list-disc">
            <li>Fast food & makanan olahan</li>
            <li>Daging olahan (sosis, ham, bacon)</li>
            <li>Saus kemasan (kecap, teriyaki, soy sauce)</li>
            <li>Snack kemasan tinggi sodium</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> Kemenkes RI 2022, DASH Diet NIH, AHA Guidelines 2017, WHO Sodium Recommendations
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const processedFood = ref(0)
const fastFood = ref(0)
const processedMeat = ref(0)
const sauces = ref(0)
const snacks = ref(0)
const tableSalt = ref(0)
const results = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const sodiumColor = computed(() => {
  if (!results.value) return ''
  const total = results.value.totalSodium
  if (total < 1500) return 'bg-green-50 border-green-400'
  if (total < 2300) return 'bg-yellow-50 border-yellow-400'
  if (total < 3000) return 'bg-orange-50 border-orange-400'
  return 'bg-red-50 border-red-400'
})

const sodiumTextColor = computed(() => {
  if (!results.value) return ''
  const total = results.value.totalSodium
  if (total < 1500) return 'text-green-700'
  if (total < 2300) return 'text-yellow-700'
  if (total < 3000) return 'text-orange-700'
  return 'text-red-700'
})

const calculate = async () => {
  const breakdown = {
    processedFood: (processedFood.value || 0) * 400,
    fastFood: (fastFood.value || 0) * 1500,
    processedMeat: (processedMeat.value || 0) * 750,
    sauces: (sauces.value || 0) * 1000,
    snacks: (snacks.value || 0) * 300,
    tableSalt: (tableSalt.value || 0) * 2300
  }

  const totalSodium = Object.values(breakdown).reduce((sum, val) => sum + val, 0)

  let status = ''
  let recommendation = ''

  if (totalSodium < 1500) {
    status = 'Excellent ⭐⭐⭐'
    recommendation = 'Pertahankan! Target optimal DASH tercapai'
  } else if (totalSodium < 2300) {
    status = 'Good ⭐⭐'
    recommendation = 'DASH Standard - Untuk hasil optimal, kurangi ke <1500mg'
  } else if (totalSodium < 3000) {
    status = 'Borderline High ⚠️'
    recommendation = 'Perlu pengurangan bertahap'
  } else if (totalSodium < 4000) {
    status = 'High Risk ❌'
    recommendation = 'Risiko tinggi hipertensi - intervensi diperlukan'
  } else {
    status = 'Very High Risk 🚨'
    recommendation = 'Perlu intervensi segera - konsultasi ahli gizi'
  }

  results.value = {
    totalSodium: Math.round(totalSodium),
    status,
    recommendation,
    breakdown
  }

  // Auto-save
  if (totalSodium > 0) {
    await saveCalculation({
      calculator_type: 'hypertension_diet',
      method: 'Sodium Calculator',
      inputs: {
        processedFood: processedFood.value,
        fastFood: fastFood.value,
        processedMeat: processedMeat.value,
        sauces: sauces.value,
        snacks: snacks.value,
        tableSalt: tableSalt.value
      },
      results: {
        totalSodium: results.value.totalSodium,
        status: results.value.status
      }
    })
  }
}
</script>
