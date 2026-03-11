<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
      <h4 class="font-bold text-green-900 mb-3 flex items-center">
        <ion-icon name="fitness" class="text-xl mr-2"></ion-icon>
        Mikronutrien Penting dalam DASH Diet
      </h4>
      <p class="text-sm text-gray-700">
        Mikronutrien kunci yang berperan dalam menurunkan tekanan darah dan kesehatan kardiovaskular
      </p>
    </div>

    <!-- Micronutrient Cards -->
    <div class="space-y-4">
      <!-- Potassium (Kalium) -->
      <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-bold text-yellow-900 text-lg flex items-center">
              <ion-icon name="flash" class="text-2xl mr-2"></ion-icon>
              Kalium (Potassium - K)
            </h4>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-600">Target DASH</p>
            <p class="text-2xl font-bold text-yellow-700">3500-4700 mg</p>
            <p class="text-xs text-gray-600">per hari</p>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Manfaat untuk Hipertensi:</p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li><strong>Counteract sodium:</strong> Membantu tubuh mengeluarkan sodium berlebih melalui urin</li>
            <li><strong>Relaksasi pembuluh darah:</strong> Mengurangi ketegangan dinding vaskular</li>
            <li><strong>Penurunan TD:</strong> Efektif menurunkan sistolik 3-5 mmHg, diastolik 2-3 mmHg</li>
          </ul>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Rasio K:Na Penting (Intersalt Study):</p>
          <p class="text-sm text-gray-700">Target rasio K:Na = <strong>1:1 hingga 3:1</strong> (semakin tinggi K, semakin baik)</p>
          <p class="text-sm text-gray-700 mt-1">Peningkatan rasio dari 1:3 → 1:1 dapat menurunkan TD sistolik 3.4 mmHg</p>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Sumber Kalium Tinggi:</p>
          <div class="grid md:grid-cols-2 gap-2">
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Buah:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Alpukat: 485 mg/100g ⭐</li>
                <li>• Pisang: 422 mg/105g ⭐</li>
                <li>• Jeruk: 237 mg/150g</li>
                <li>• Melon: 267 mg/100g</li>
                <li>• Kiwi: 312 mg/100g</li>
              </ul>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Sayuran & Lain:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Bayam: 558 mg/100g ⭐⭐</li>
                <li>• Kentang: 425 mg/100g</li>
                <li>• Tomat: 237 mg/100g</li>
                <li>• Kacang putih: 561 mg/100g ⭐⭐</li>
                <li>• Ubi jalar: 337 mg/100g</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Calcium (Kalsium) -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-bold text-blue-900 text-lg flex items-center">
              <ion-icon name="fitness" class="text-2xl mr-2"></ion-icon>
              Kalsium (Calcium - Ca)
            </h4>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-600">Target DASH</p>
            <p class="text-2xl font-bold text-blue-700">1000-1200 mg</p>
            <p class="text-xs text-gray-600">per hari</p>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Manfaat untuk Hipertensi:</p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li><strong>Relaksasi otot vaskular:</strong> Kalsium membantu kontraksi & relaksasi pembuluh darah</li>
            <li><strong>Regulasi BP:</strong> Kekurangan kalsium dikaitkan dengan peningkatan risiko hipertensi</li>
            <li><strong>Efek sinergis:</strong> Bekerja sama dengan magnesium untuk kesehatan kardiovaskular</li>
          </ul>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Sumber Kalsium (Prioritas Low-Fat Dairy):</p>
          <div class="grid md:grid-cols-2 gap-2">
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Dairy Rendah Lemak:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Skim milk: 300 mg/200ml ⭐⭐</li>
                <li>• Yogurt plain: 240 mg/150ml ⭐</li>
                <li>• Low-fat cheese: 200 mg/40g</li>
              </ul>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Sayuran & Alternatif:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Bayam: 99 mg/100g</li>
                <li>• Brokoli: 47 mg/100g</li>
                <li>• Tahu: 350 mg/100g ⭐⭐</li>
                <li>• Ikan sarden (with bones): 382 mg/100g ⭐⭐</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Magnesium -->
      <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-300">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-bold text-purple-900 text-lg flex items-center">
              <ion-icon name="magnet" class="text-2xl mr-2"></ion-icon>
              Magnesium (Mg)
            </h4>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-600">Target DASH</p>
            <p class="text-2xl font-bold text-purple-700">320-420 mg</p>
            <p class="text-xs text-gray-600">per hari (W: 320, M: 420)</p>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Manfaat untuk Hipertensi:</p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li><strong>Relaksasi otot polos:</strong> Membantu relaksasi dinding pembuluh darah</li>
            <li><strong>Regulasi BP:</strong> Defisiensi Mg dikaitkan dengan resistensi insulin & hipertensi</li>
            <li><strong>Anti-inflamasi:</strong> Mengurangi inflamasi vaskular</li>
            <li><strong>Penurunan TD:</strong> Suplementasi Mg dapat menurunkan TD 2-3 mmHg</li>
          </ul>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Sumber Magnesium:</p>
          <div class="grid md:grid-cols-2 gap-2">
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Whole Grains:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Brown rice: 43 mg/100g</li>
                <li>• Oatmeal: 177 mg/100g ⭐⭐</li>
                <li>• Whole wheat bread: 82 mg/100g</li>
              </ul>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Nuts, Seeds, Legumes:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Almonds: 270 mg/100g ⭐⭐</li>
                <li>• Biji bunga matahari: 325 mg/100g ⭐⭐⭐</li>
                <li>• Kacang hitam: 60 mg/100g</li>
                <li>• Bayam: 79 mg/100g</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Fiber (Serat) -->
      <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
        <div class="flex items-start justify-between mb-4">
          <div>
            <h4 class="font-bold text-green-900 text-lg flex items-center">
              <ion-icon name="leaf" class="text-2xl mr-2"></ion-icon>
              Serat (Dietary Fiber)
            </h4>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-600">Target DASH</p>
            <p class="text-2xl font-bold text-green-700">25-30 g</p>
            <p class="text-xs text-gray-600">per hari (14g/1000 kkal)</p>
          </div>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Manfaat untuk Hipertensi:</p>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li><strong>Penurunan BP:</strong> Intake serat tinggi menurunkan sistolik 1-3 mmHg</li>
            <li><strong>Penurunan LDL:</strong> Serat larut mengikat kolesterol</li>
            <li><strong>Kontrol glukosa:</strong> Memperlambat absorbsi gula</li>
            <li><strong>Weight management:</strong> Meningkatkan rasa kenyang</li>
          </ul>
        </div>

        <div class="bg-white/70 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-bold text-gray-900 mb-2">Sumber Serat Tinggi:</p>
          <div class="grid md:grid-cols-2 gap-2">
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Sayuran & Buah:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Bayam: 2.2g/100g</li>
                <li>• Brokoli: 2.6g/100g</li>
                <li>• Apel (with skin): 2.4g/100g</li>
                <li>• Pir (with skin): 3.1g/100g</li>
              </ul>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-700 mb-1">Whole Grains & Kacang:</p>
              <ul class="text-sm text-gray-700 space-y-1">
                <li>• Oatmeal: 10.6g/100g ⭐⭐⭐</li>
                <li>• Brown rice: 3.5g/100g</li>
                <li>• Kacang merah: 15.6g/100g ⭐⭐⭐</li>
                <li>• Kacang hitam: 16g/100g ⭐⭐⭐</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Summary Table -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="book" class="text-lg mr-2"></ion-icon>
          Ringkasan Target Mikronutrien DASH
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Nutrient</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Target/Hari</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Manfaat Utama</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Sumber Terbaik</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-yellow-50">
              <td class="px-4 py-3 font-medium">Kalium (K)</td>
              <td class="px-4 py-3">3500-4700 mg</td>
              <td class="px-4 py-3 text-xs">Counteract Na, relaksasi vaskular</td>
              <td class="px-4 py-3 text-xs">Pisang, alpukat, bayam, kentang</td>
            </tr>
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Kalsium (Ca)</td>
              <td class="px-4 py-3">1000-1200 mg</td>
              <td class="px-4 py-3 text-xs">Relaksasi otot vaskular</td>
              <td class="px-4 py-3 text-xs">Low-fat dairy, tahu, sarden</td>
            </tr>
            <tr class="hover:bg-purple-50">
              <td class="px-4 py-3 font-medium">Magnesium (Mg)</td>
              <td class="px-4 py-3">320-420 mg</td>
              <td class="px-4 py-3 text-xs">Relaksasi otot, regulasi BP</td>
              <td class="px-4 py-3 text-xs">Whole grain, nuts, seeds</td>
            </tr>
            <tr class="hover:bg-green-50">
              <td class="px-4 py-3 font-medium">Serat</td>
              <td class="px-4 py-3">25-30 g</td>
              <td class="px-4 py-3 text-xs">↓BP, ↓LDL, kontrol glukosa</td>
              <td class="px-4 py-3 text-xs">Sayuran, buah, whole grain</td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium">Sodium (Na)</td>
              <td class="px-4 py-3"><strong><1500mg (optimal)</strong></td>
              <td class="px-4 py-3 text-xs text-red-600">BATASI - kontrol volume darah</td>
              <td class="px-4 py-3 text-xs">Hindari makanan olahan</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> Kemenkes RI 2022, DASH Diet NIH, Intersalt Study (K:Na ratio), American Heart Association, WHO Guidelines
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
    method: 'DASH Micronutrient Guide',
    inputs: {},
    results: {
      info: 'Viewed micronutrient targets',
      targets: 'K: 3500-4700mg, Ca: 1000-1200mg, Mg: 320-420mg, Fiber: 25-30g, Na: <1500mg'
    }
  })
})
</script>
