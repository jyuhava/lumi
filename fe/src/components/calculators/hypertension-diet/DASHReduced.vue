<template>
  <div class="space-y-6">
    <!-- Header Info -->
    <div class="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-300">
      <h4 class="font-bold text-gray-900 mb-3 flex items-center">
        <ion-icon name="warning" class="text-xl text-red-600 mr-2"></ion-icon>
        DASH Reduced Sodium (1500mg/hari)
      </h4>
      <p class="text-sm text-gray-700 mb-2">
        <strong>Untuk:</strong> Hipertensi Stage 1-2, Gagal Kontrol dengan DASH Standard
      </p>
      <p class="text-sm text-gray-700 mb-2">
        <strong>Expected Result:</strong> Penurunan TD sistolik 8-14 mmHg, diastolik 4-7 mmHg dalam 8-12 minggu
      </p>
      <p class="text-sm text-red-700 font-bold">
        ⚠️ Lebih efektif dibanding DASH Standard untuk penurunan tekanan darah
      </p>
    </div>

    <!-- Sodium Comparison -->
    <div class="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
      <div class="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="analytics" class="text-lg mr-2"></ion-icon>
          Perbandingan DASH Standard vs Reduced Sodium
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Parameter</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">DASH Standard</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700 bg-red-50">DASH Reduced Sodium ✓</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 font-medium">Sodium Limit</td>
              <td class="px-4 py-3"><2300mg (1 sdt)</td>
              <td class="px-4 py-3 bg-red-50"><strong><1500mg (⅔ sdt)</strong></td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium">Indikasi</td>
              <td class="px-4 py-3">Prehipertensi, Stage 1 ringan</td>
              <td class="px-4 py-3 bg-red-50"><strong>Stage 1-2, Gagal kontrol</strong></td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium">Penurunan TD Sistolik</td>
              <td class="px-4 py-3">6-11 mmHg</td>
              <td class="px-4 py-3 bg-red-50"><strong>8-14 mmHg</strong></td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium">Penurunan TD Diastolik</td>
              <td class="px-4 py-3">3-6 mmHg</td>
              <td class="px-4 py-3 bg-red-50"><strong>4-7 mmHg</strong></td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-medium">Timeline Hasil</td>
              <td class="px-4 py-3">4-8 minggu</td>
              <td class="px-4 py-3 bg-red-50"><strong>8-12 minggu</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Key Modifications -->
    <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-300">
      <h4 class="font-bold text-orange-900 mb-4 flex items-center">
        <ion-icon name="list" class="text-xl mr-2"></ion-icon>
        Modifikasi dari DASH Standard
      </h4>
      <div class="space-y-3">
        <div class="flex items-start">
          <ion-icon name="close-circle" class="text-xl text-red-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>TIDAK menambah garam</strong> pada masakan (baik saat memasak maupun di meja)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="close-circle" class="text-xl text-red-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>HINDARI semua makanan olahan & kalengan</strong> (75% sodium berasal dari sini)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-circle" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>Pilih produk "low-sodium" atau "no salt added"</strong> pada label kemasan</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-circle" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>Perbanyak makanan SEGAR:</strong> Sayuran, buah, daging/ikan segar (bukan olahan)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="close-circle" class="text-xl text-red-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>HINDARI:</strong> Daging olahan (sosis, ham, bacon), makanan cepat saji, snack kemasan</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-circle" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p class="text-sm"><strong>Gunakan bumbu alternatif:</strong> Bawang, jahe, lemon, herbs, rempah-rempah</p>
        </div>
      </div>
    </div>

    <!-- High Sodium Foods to AVOID -->
    <div class="bg-white rounded-xl border-2 border-red-300 overflow-hidden">
      <div class="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="close-circle" class="text-lg mr-2"></ion-icon>
          Makanan TINGGI SODIUM yang HARUS DIHINDARI
        </h4>
      </div>
      <div class="p-6 space-y-3">
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Makanan Kalengan/Kemasan</p>
          <p class="text-sm text-gray-700">300-500mg sodium/porsi - Soup kaleng (800-1000mg), sayur kalengan, ikan kalengan</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Makanan Cepat Saji (Fast Food)</p>
          <p class="text-sm text-gray-700">1000-2000mg sodium/meal - Burger, pizza, fried chicken, mie instan</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Daging Olahan</p>
          <p class="text-sm text-gray-700">500-1000mg - Sosis, ham, bacon, kornet, salami, nugget</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Saus & Condiments</p>
          <p class="text-sm text-gray-700">1000mg/tbsp - Kecap asin, soy sauce, teriyaki, fish sauce, MSG</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Snack Kemasan</p>
          <p class="text-sm text-gray-700">200-400mg - Keripik, crackers, pretzels, popcorn kemasan</p>
        </div>
        <div class="bg-red-50 rounded-lg p-3 border-l-4 border-red-500">
          <p class="font-bold text-red-900 mb-1">Makanan Beku/Frozen</p>
          <p class="text-sm text-gray-700">400-800mg - Pizza beku, frozen dinner, nugget beku</p>
        </div>
      </div>
    </div>

    <!-- Low Sodium Alternatives -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
      <h4 class="font-bold text-green-900 mb-4 flex items-center">
        <ion-icon name="checkmark-circle" class="text-xl mr-2"></ion-icon>
        Alternatif Rendah Sodium (REKOMENDASI)
      </h4>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white/70 rounded-lg p-3">
          <p class="font-bold text-gray-900 mb-2">Protein Segar</p>
          <ul class="text-sm space-y-1 ml-4 list-disc">
            <li>Ikan segar (bukan kaleng/asap)</li>
            <li>Ayam tanpa kulit segar</li>
            <li>Telur</li>
            <li>Tahu/tempe segar (bukan goreng kemasan)</li>
          </ul>
        </div>
        <div class="bg-white/70 rounded-lg p-3">
          <p class="font-bold text-gray-900 mb-2">Sayuran & Buah Segar</p>
          <ul class="text-sm space-y-1 ml-4 list-disc">
            <li>Sayuran hijau segar (bayam, brokoli)</li>
            <li>Buah segar (pisang, jeruk, alpukat)</li>
            <li>Kentang, ubi jalar (bukan frozen/instant)</li>
          </ul>
        </div>
        <div class="bg-white/70 rounded-lg p-3">
          <p class="font-bold text-gray-900 mb-2">Bumbu Alami</p>
          <ul class="text-sm space-y-1 ml-4 list-disc">
            <li>Bawang putih, bawang merah, jahe</li>
            <li>Lemon, jeruk nipis</li>
            <li>Herbs (basil, oregano, thyme)</li>
            <li>Rempah (merica, kunyit, ketumbar)</li>
          </ul>
        </div>
        <div class="bg-white/70 rounded-lg p-3">
          <p class="font-bold text-gray-900 mb-2">Produk Low-Sodium</p>
          <ul class="text-sm space-y-1 ml-4 list-disc">
            <li>Low-sodium bread</li>
            <li>Unsalted butter</li>
            <li>No-salt-added canned goods</li>
            <li>Low-sodium cheese</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Expected Results -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
      <h4 class="font-bold text-blue-900 mb-4 flex items-center">
        <ion-icon name="trending-down" class="text-xl mr-2"></ion-icon>
        Hasil yang Diharapkan
      </h4>
      <div class="space-y-3 text-sm">
        <div class="flex items-start">
          <ion-icon name="checkmark-done" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p><strong>8-14 mmHg penurunan TD sistolik</strong> (lebih besar dibanding DASH standard)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-done" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p><strong>4-7 mmHg penurunan TD diastolik</strong></p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-done" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p><strong>Hasil optimal dalam 8-12 minggu</strong> (konsisten mengikuti diet)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-done" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p><strong>Efek lebih baik pada pasien dengan baseline BP tinggi</strong> (>160/100)</p>
        </div>
        <div class="flex items-start">
          <ion-icon name="checkmark-done" class="text-xl text-green-600 mr-2 mt-0.5"></ion-icon>
          <p><strong>Kombinasi dengan penurunan BB 5-10%:</strong> Penurunan TD total 11-22 mmHg</p>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300">
      <h4 class="font-bold text-yellow-900 mb-4 flex items-center">
        <ion-icon name="bulb" class="text-xl mr-2"></ion-icon>
        Tips Keberhasilan DASH Reduced Sodium
      </h4>
      <div class="space-y-2 text-sm">
        <p>✓ <strong>Mulai gradual:</strong> Kurangi sodium 25% per minggu (lidah adaptasi 1-2 minggu)</p>
        <p>✓ <strong>Baca label:</strong> Pilih produk dengan <140mg sodium per serving</p>
        <p>✓ <strong>Meal prep:</strong> Masak di rumah untuk kontrol sodium penuh</p>
        <p>✓ <strong>Restaurant tips:</strong> Minta "no salt added", saus terpisah</p>
        <p>✓ <strong>Monitoring:</strong> Cek TD setiap hari, catat food recall 24 jam</p>
        <p>✓ <strong>Support:</strong> Ajak keluarga diet bersama untuk kepatuhan</p>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> DASH Sodium Study (NIH), Kemenkes RI 2022, AHA Guidelines 2017, PREMIER Trial, Intersalt Study
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
    method: 'DASH Reduced Sodium (1500mg)',
    inputs: {},
    results: {
      info: 'Viewed DASH Reduced Sodium guidelines',
      target: '<1500mg sodium/day, avoid processed foods, fresh foods priority'
    }
  })
})
</script>
