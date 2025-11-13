<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-200">
      <h4 class="font-bold text-cyan-900 flex items-center space-x-2">
        <ion-icon name="trending-up" class="text-xl"></ion-icon>
        <span>Indeks Glikemik (IG) Makanan</span>
      </h4>
      <p class="text-sm text-cyan-700 mt-1">Panduan pemilihan makanan berdasarkan kecepatan naikkan gula darah</p>
    </div>

    <!-- GI Categories -->
    <div class="space-y-4">
      <!-- Low GI -->
      <div class="bg-white border-2 border-green-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h5 class="font-bold text-green-900 text-lg">✓ INDEKS GLIKEMIK RENDAH (<55)</h5>
          <div class="bg-green-100 px-4 py-2 rounded-lg">
            <p class="text-sm font-bold text-green-700">PILIHAN TERBAIK</p>
          </div>
        </div>
        <p class="text-sm text-green-800 mb-4">Lambat menaikkan gula darah - Cocok untuk DM</p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="font-bold text-sm mb-2">Karbohidrat:</p>
            <ul class="text-sm space-y-1">
              <li>• Whole wheat bread (51)</li>
              <li>• Oatmeal (55)</li>
              <li>• Nasi merah (55)</li>
              <li>• Ubi jalar (44)</li>
              <li>• Pasta whole grain (42)</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-2">Buah:</p>
            <ul class="text-sm space-y-1">
              <li>• Apel (36)</li>
              <li>• Jeruk (42)</li>
              <li>• Pir (38)</li>
              <li>• Strawberry (40)</li>
              <li>• Anggur (46)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Medium GI -->
      <div class="bg-white border-2 border-yellow-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h5 class="font-bold text-yellow-900 text-lg">⚠ INDEKS GLIKEMIK SEDANG (55-70)</h5>
          <div class="bg-yellow-100 px-4 py-2 rounded-lg">
            <p class="text-sm font-bold text-yellow-700">BATASI PORSI</p>
          </div>
        </div>
        <p class="text-sm text-yellow-800 mb-4">Moderat menaikkan gula darah - Konsumsi terbatas</p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="font-bold text-sm mb-2">Karbohidrat:</p>
            <ul class="text-sm space-y-1">
              <li>• Pisang (56)</li>
              <li>• Roti gandum (60)</li>
              <li>• Nasi basmati (58)</li>
              <li>• Madu (61)</li>
              <li>• Jagung manis (60)</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-2">Buah:</p>
            <ul class="text-sm space-y-1">
              <li>• Nanas (59)</li>
              <li>• Pepaya (59)</li>
              <li>• Mangga (60)</li>
              <li>• Kismis (64)</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- High GI -->
      <div class="bg-white border-2 border-red-300 rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <h5 class="font-bold text-red-900 text-lg">✗ INDEKS GLIKEMIK TINGGI (>70)</h5>
          <div class="bg-red-100 px-4 py-2 rounded-lg">
            <p class="text-sm font-bold text-red-700">HINDARI</p>
          </div>
        </div>
        <p class="text-sm text-red-800 mb-4">Cepat menaikkan gula darah - Tidak dianjurkan untuk DM</p>
        
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <p class="font-bold text-sm mb-2">Karbohidrat:</p>
            <ul class="text-sm space-y-1">
              <li>• Nasi putih (72)</li>
              <li>• Roti putih (75)</li>
              <li>• Kentang goreng (75)</li>
              <li>• Cornflakes (81)</li>
              <li>• Bihun (92)</li>
            </ul>
          </div>
          <div>
            <p class="font-bold text-sm mb-2">Lainnya:</p>
            <ul class="text-sm space-y-1">
              <li>• Semangka (72)</li>
              <li>• Kurma (103)</li>
              <li>• Gula murni (100)</li>
              <li>• Kue/pastry (70-85)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
      <h5 class="font-bold text-indigo-900 mb-3">💡 Tips Menurunkan Indeks Glikemik Makanan:</h5>
      <div class="space-y-2 text-sm">
        <div class="flex items-start space-x-2">
          <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
          <p>Kombinasikan dengan <strong>protein dan serat</strong> (memperlambat penyerapan)</p>
        </div>
        <div class="flex items-start space-x-2">
          <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
          <p>Pilih biji-bijian <strong>utuh</strong> (whole grain) daripada refined</p>
        </div>
        <div class="flex items-start space-x-2">
          <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
          <p>Masak <strong>al dente</strong> (tidak terlalu lembek) untuk pasta/nasi</p>
        </div>
        <div class="flex items-start space-x-2">
          <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
          <p>Tambahkan <strong>cuka atau lemon</strong> pada makanan (menurunkan IG)</p>
        </div>
        <div class="flex items-start space-x-2">
          <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
          <p>Konsumsi buah <strong>utuh</strong> (bukan jus) untuk manfaat serat</p>
        </div>
      </div>
    </div>

    <!-- Comparison Table -->
    <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h5 class="font-bold text-gray-900 mb-3">Perbandingan IG Makanan Sejenis:</h5>
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Tinggi IG (Hindari)</th>
            <th class="px-4 py-2 text-center">→</th>
            <th class="px-4 py-2 text-left">Rendah IG (Pilih)</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="px-4 py-2 text-red-700">Nasi putih (72)</td>
            <td class="px-4 py-2 text-center">→</td>
            <td class="px-4 py-2 text-green-700 font-bold">Nasi merah (55)</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 text-red-700">Roti putih (75)</td>
            <td class="px-4 py-2 text-center">→</td>
            <td class="px-4 py-2 text-green-700 font-bold">Roti gandum utuh (51)</td>
          </tr>
          <tr class="border-b">
            <td class="px-4 py-2 text-red-700">Kentang panggang (85)</td>
            <td class="px-4 py-2 text-center">→</td>
            <td class="px-4 py-2 text-green-700 font-bold">Ubi jalar (44)</td>
          </tr>
          <tr>
            <td class="px-4 py-2 text-red-700">Cornflakes (81)</td>
            <td class="px-4 py-2 text-center">→</td>
            <td class="px-4 py-2 text-green-700 font-bold">Oatmeal (55)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
      <h5 class="font-bold text-cyan-900 mb-2">Catatan Penting:</h5>
      <ul class="text-sm text-cyan-800 space-y-1">
        <li>• IG rendah membantu kontrol gula darah lebih stabil</li>
        <li>• Kombinasi makanan mempengaruhi IG total</li>
        <li>• Porsi tetap penting meski IG rendah</li>
        <li>• Referensi: International GI Database, PERKENI 2024</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component is informational only, no calculation needed
</script>
