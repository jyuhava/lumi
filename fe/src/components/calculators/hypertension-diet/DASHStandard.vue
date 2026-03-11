<template>
  <div class="space-y-6">
    <!-- Header Info -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
      <h4 class="font-bold text-gray-900 mb-3 flex items-center">
        <ion-icon name="restaurant" class="text-xl text-blue-600 mr-2"></ion-icon>
        DASH Standard (2300mg Sodium/hari)
      </h4>
      <p class="text-sm text-gray-700 mb-2">
        <strong>Untuk:</strong> Prehipertensi atau Hipertensi Ringan (Stage 1)
      </p>
      <p class="text-sm text-gray-700">
        <strong>Expected Result:</strong> Penurunan TD sistolik 6-11 mmHg, diastolik 3-6 mmHg dalam 4-8 minggu
      </p>
    </div>

    <!-- Daily Servings (2000 kcal) -->
    <div class="bg-white rounded-xl border-2 border-blue-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="pizza" class="text-lg mr-2"></ion-icon>
          Panduan Porsi Harian DASH (2000 kkal)
        </h4>
      </div>

      <div class="p-6 space-y-4">
        <!-- Whole Grains -->
        <div class="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-amber-900">Whole Grains (Karbohidrat Kompleks)</h5>
            <span class="px-3 py-1 bg-amber-200 text-amber-900 rounded-full text-sm font-bold">6-8 porsi</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Brown rice/nasi merah: ¾ gelas (100g cooked)</li>
            <li>Whole wheat bread: 1 slice</li>
            <li>Oatmeal: ½ gelas (dry)</li>
            <li>Pasta gandum utuh: 100g cooked</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> 275g KH, Serat tinggi, Magnesium, Selenium
          </p>
        </div>

        <!-- Vegetables -->
        <div class="bg-green-50 rounded-lg p-4 border-2 border-green-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-green-900">Vegetables (Sayuran)</h5>
            <span class="px-3 py-1 bg-green-200 text-green-900 rounded-full text-sm font-bold">4-5 porsi</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Sayuran mentah: 150g (1 gelas)</li>
            <li>Sayuran matang: 100g (½ gelas)</li>
            <li><strong>Pilihan terbaik:</strong> Bayam, brokoli, wortel, tomat, ubi, paprika</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> Kalium (K), Magnesium (Mg), Serat, Antioksidan
          </p>
        </div>

        <!-- Fruits -->
        <div class="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-orange-900">Fruits (Buah-buahan)</h5>
            <span class="px-3 py-1 bg-orange-200 text-orange-900 rounded-full text-sm font-bold">4-5 porsi</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>1 buah sedang (apel, jeruk, pir)</li>
            <li>Pisang: 1 buah (422mg K)</li>
            <li>Alpukat: 100g (485mg K)</li>
            <li>Buah potong: 100-150g</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> Kalium tinggi, Serat, Vitamin C, Antioksidan
          </p>
        </div>

        <!-- Low-fat Dairy -->
        <div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-blue-900">Low-fat Dairy</h5>
            <span class="px-3 py-1 bg-blue-200 text-blue-900 rounded-full text-sm font-bold">2-3 porsi</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Skim milk/low-fat milk: 200ml (1 gelas)</li>
            <li>Yogurt plain rendah lemak: 150ml</li>
            <li>Low-fat cheese: 40g</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> Kalsium (Ca), Protein, Vitamin D
          </p>
        </div>

        <!-- Lean Meat/Fish -->
        <div class="bg-red-50 rounded-lg p-4 border-2 border-red-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-red-900">Lean Meat/Fish/Poultry</h5>
            <span class="px-3 py-1 bg-red-200 text-red-900 rounded-full text-sm font-bold">≤2 porsi (≤6 oz)</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Ikan (salmon, tuna, nila): 85g (3 oz)</li>
            <li>Ayam tanpa kulit: 85g</li>
            <li><strong>HINDARI:</strong> Daging merah berlemak, jeroan, daging olahan</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> Protein 90g/hari, Omega-3 (ikan), Vitamin B12
          </p>
        </div>

        <!-- Nuts/Seeds -->
        <div class="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-purple-900">Nuts/Seeds/Legumes</h5>
            <span class="px-3 py-1 bg-purple-200 text-purple-900 rounded-full text-sm font-bold">4-5 porsi/minggu</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Almonds: 23 butir (1 oz/28g)</li>
            <li>Biji bunga matahari: 2 tbsp</li>
            <li>Kacang merah rebus: 150ml (½ gelas)</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> Magnesium, Kalium, Protein nabati, Serat, Lemak sehat
          </p>
        </div>

        <!-- Fats/Oils -->
        <div class="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-yellow-900">Fats/Oils (Lemak)</h5>
            <span class="px-3 py-1 bg-yellow-200 text-yellow-900 rounded-full text-sm font-bold">2-3 porsi</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Minyak zaitun/canola: 1 tsp (5ml)</li>
            <li><strong>HINDARI:</strong> Lemak trans, margarin keras</li>
            <li><strong>Prioritas:</strong> Lemak tidak jenuh (olive oil, avocado oil)</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">
            <strong>Nutrisi:</strong> 60g lemak total/hari (≤13g jenuh, 33g tidak jenuh)
          </p>
        </div>

        <!-- Sweets -->
        <div class="bg-pink-50 rounded-lg p-4 border-2 border-pink-200">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-pink-900">Sweets (Makanan Manis)</h5>
            <span class="px-3 py-1 bg-pink-200 text-pink-900 rounded-full text-sm font-bold">≤5 porsi/minggu</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>Ukuran 1 porsi:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Gula: 1 tbsp</li>
            <li><strong>BATASI:</strong> Soda, kue manis, permen</li>
            <li><strong>Alternatif:</strong> Buah segar sebagai dessert</li>
          </ul>
        </div>

        <!-- Sodium Limit -->
        <div class="bg-red-100 rounded-lg p-4 border-2 border-red-400">
          <div class="flex items-start justify-between mb-2">
            <h5 class="font-bold text-red-900">⚠️ Sodium (Garam)</h5>
            <span class="px-3 py-1 bg-red-300 text-red-900 rounded-full text-sm font-bold">&lt;2300mg</span>
          </div>
          <p class="text-sm text-gray-700 mb-2"><strong>≈ 1 sendok teh garam/hari</strong></p>
          <p class="text-sm text-gray-700 mb-2"><strong>Sumber sodium yang DIHINDARI:</strong></p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>Makanan kalengan/kemasan: 300-500mg/porsi</li>
            <li>Fast food: 1000-2000mg/meal</li>
            <li>Daging olahan (sosis, ham): 500-1000mg</li>
            <li>Saus (kecap, soy sauce): 1000mg/tbsp</li>
          </ul>
          <p class="text-xs text-red-700 mt-2 font-bold">
            75% sodium berasal dari makanan olahan - fokus pada makanan segar!
          </p>
        </div>
      </div>
    </div>

    <!-- Macronutrient Summary -->
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300">
        <p class="text-xs text-gray-600 mb-1">Karbohidrat</p>
        <p class="text-2xl font-bold text-yellow-700">55% <span class="text-sm">(275g)</span></p>
        <p class="text-xs text-gray-600 mt-1">1100 kkal ÷ 4</p>
      </div>
      <div class="bg-red-50 rounded-lg p-4 border-2 border-red-300">
        <p class="text-xs text-gray-600 mb-1">Protein</p>
        <p class="text-2xl font-bold text-red-700">18% <span class="text-sm">(90g)</span></p>
        <p class="text-xs text-gray-600 mt-1">360 kkal ÷ 4</p>
      </div>
      <div class="bg-orange-50 rounded-lg p-4 border-2 border-orange-300">
        <p class="text-xs text-gray-600 mb-1">Lemak</p>
        <p class="text-2xl font-bold text-orange-700">27% <span class="text-sm">(60g)</span></p>
        <p class="text-xs text-gray-600 mt-1">540 kkal ÷ 9</p>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> Kemenkes RI - Diet DASH 2022, DASH Diet Original (NIH), American Heart Association, PREMIER Trial
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const { saveCalculation } = useCalculationHistory()

onMounted(async () => {
  // Auto-save when component loads
  await saveCalculation({
    calculator_type: 'hypertension_diet',
    method: 'DASH Standard (2300mg Sodium)',
    inputs: {},
    results: {
      info: 'Viewed DASH Standard guidelines',
      target: '2000 kcal, <2300mg sodium, 6-8 whole grains, 4-5 veg, 4-5 fruit, 2-3 dairy, ≤6oz meat'
    }
  })
})
</script>
