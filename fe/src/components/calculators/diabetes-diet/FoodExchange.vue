<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-200">
      <h4 class="font-bold text-purple-900 flex items-center space-x-2">
        <ion-icon name="swap-horizontal" class="text-xl"></ion-icon>
        <span>Sistem Penukar Makanan (DBMP PERKENI)</span>
      </h4>
      <p class="text-sm text-purple-700 mt-1">Daftar Bahan Makanan Penukar untuk variasi menu DM</p>
    </div>

    <!-- Food Exchange Tables -->
    <div class="space-y-4">
      <!-- Golongan I: Karbohidrat -->
      <div class="bg-white border-2 border-yellow-200 rounded-xl p-4">
        <h5 class="font-bold text-yellow-900 mb-3 flex items-center space-x-2">
          <ion-icon name="restaurant" class="text-xl"></ion-icon>
          <span>Golongan I: Karbohidrat (175 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 40g KH, 4g Protein</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-yellow-50 p-2 rounded">• Nasi ¾ gelas (100g)</div>
          <div class="bg-yellow-50 p-2 rounded">• Roti 1 lembar (30g)</div>
          <div class="bg-yellow-50 p-2 rounded">• Kentang 2 buah (200g)</div>
          <div class="bg-yellow-50 p-2 rounded">• Singkong 1 potong (100g)</div>
          <div class="bg-yellow-50 p-2 rounded">• Ubi 1 potong (135g)</div>
          <div class="bg-yellow-50 p-2 rounded">• Mi kering 50g</div>
        </div>
      </div>

      <!-- Golongan II: Protein Hewani -->
      <div class="bg-white border-2 border-red-200 rounded-xl p-4">
        <h5 class="font-bold text-red-900 mb-3 flex items-center space-x-2">
          <ion-icon name="fish" class="text-xl"></ion-icon>
          <span>Golongan II: Protein Hewani (50 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 7g Protein, 2g Lemak</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-red-50 p-2 rounded">• Ikan 30g (1 potong kecil)</div>
          <div class="bg-red-50 p-2 rounded">• Daging sapi 25g</div>
          <div class="bg-red-50 p-2 rounded">• Ayam 25g</div>
          <div class="bg-red-50 p-2 rounded">• Telur ½ butir (30g)</div>
          <div class="bg-red-50 p-2 rounded">• Udang 30g</div>
          <div class="bg-red-50 p-2 rounded">• Keju 30g</div>
        </div>
      </div>

      <!-- Golongan III: Protein Nabati -->
      <div class="bg-white border-2 border-green-200 rounded-xl p-4">
        <h5 class="font-bold text-green-900 mb-3 flex items-center space-x-2">
          <ion-icon name="leaf" class="text-xl"></ion-icon>
          <span>Golongan III: Protein Nabati (80 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 8g Protein, 3g Lemak, 6g KH</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-green-50 p-2 rounded">• Tahu 100g (½ blok besar)</div>
          <div class="bg-green-50 p-2 rounded">• Tempe 50g (2 potong sedang)</div>
          <div class="bg-green-50 p-2 rounded">• Kacang hijau 3 sdm</div>
          <div class="bg-green-50 p-2 rounded">• Kacang kedelai 3 sdm</div>
          <div class="bg-green-50 p-2 rounded">• Kacang merah 3 sdm</div>
          <div class="bg-green-50 p-2 rounded">• Susu kedelai 200ml</div>
        </div>
      </div>

      <!-- Golongan IV-A: Sayuran Hijau -->
      <div class="bg-white border-2 border-emerald-200 rounded-xl p-4">
        <h5 class="font-bold text-emerald-900 mb-3 flex items-center space-x-2">
          <ion-icon name="nutrition" class="text-xl"></ion-icon>
          <span>Golongan IV-A: Sayuran Hijau (25 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 5g KH, 1g Protein</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-emerald-50 p-2 rounded">• Bayam 1 piring (100g)</div>
          <div class="bg-emerald-50 p-2 rounded">• Kangkung 1 piring</div>
          <div class="bg-emerald-50 p-2 rounded">• Brokoli 1 piring</div>
          <div class="bg-emerald-50 p-2 rounded">• Sawi 1 piring</div>
          <div class="bg-emerald-50 p-2 rounded">• Tomat 1 buah besar</div>
          <div class="bg-emerald-50 p-2 rounded">• Wortel 100g</div>
        </div>
      </div>

      <!-- Golongan V: Buah -->
      <div class="bg-white border-2 border-orange-200 rounded-xl p-4">
        <h5 class="font-bold text-orange-900 mb-3 flex items-center space-x-2">
          <ion-icon name="leaf" class="text-xl"></ion-icon>
          <span>Golongan V: Buah (60 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 12g KH (Pilih IG rendah-sedang)</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-orange-50 p-2 rounded">• Apel 1 buah (75g)</div>
          <div class="bg-orange-50 p-2 rounded">• Jeruk 1 buah (100g)</div>
          <div class="bg-orange-50 p-2 rounded">• Pepaya 1 potong (100g)</div>
          <div class="bg-orange-50 p-2 rounded">• Semangka 1 potong (200g)</div>
          <div class="bg-orange-50 p-2 rounded">• Melon 1 potong (200g)</div>
          <div class="bg-orange-50 p-2 rounded">• Pisang ½ buah (50g)</div>
        </div>
      </div>

      <!-- Golongan VI: Lemak -->
      <div class="bg-white border-2 border-amber-200 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-3 flex items-center space-x-2">
          <ion-icon name="water" class="text-xl"></ion-icon>
          <span>Golongan VI: Lemak (45 kkal)</span>
        </h5>
        <p class="text-sm mb-3"><strong>Komposisi:</strong> 5g Lemak (Pilih tak jenuh)</p>
        <div class="grid md:grid-cols-3 gap-2 text-sm">
          <div class="bg-amber-50 p-2 rounded">• Minyak zaitun 1 sdt (5ml)</div>
          <div class="bg-amber-50 p-2 rounded">• Minyak sayur 1 sdt</div>
          <div class="bg-amber-50 p-2 rounded">• Kemiri 1 buah</div>
          <div class="bg-amber-50 p-2 rounded">• Kacang tanah 1 sdm</div>
          <div class="bg-amber-50 p-2 rounded">• Alpukat 50g</div>
          <div class="bg-amber-50 p-2 rounded">• Santan encer 2 sdm</div>
        </div>
      </div>
    </div>

    <!-- Example Calculation -->
    <div class="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-3">💡 Contoh Penggunaan Sistem Penukar:</h5>
      <div class="text-sm space-y-2">
        <p><strong>Untuk diet 2000 kkal (55% KH = 275g = ≈7 porsi KH):</strong></p>
        <div class="bg-white p-3 rounded space-y-1">
          <p>• Pagi: 2 porsi KH → Bisa diganti: Nasi 1½ gelas ATAU Roti 2 lembar + Kentang 1 buah</p>
          <p>• Siang: 3 porsi KH → Nasi 2¼ gelas ATAU Mi 150g + Kentang 1 buah</p>
          <p>• Malam: 2 porsi KH → Nasi 1½ gelas ATAU Kentang 4 buah ATAU Ubi 2 potong</p>
        </div>
        <p class="text-xs text-blue-700 mt-2">* Sistem ini memungkinkan variasi menu tanpa mengubah nilai gizi</p>
      </div>
    </div>

    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h5 class="font-bold text-purple-900 mb-2">Keunggulan Sistem Penukar:</h5>
      <ul class="text-sm text-purple-800 space-y-1">
        <li>• Variasi menu lebih mudah tanpa repot hitung ulang kalori</li>
        <li>• Pasien tidak bosan dengan menu yang sama</li>
        <li>• Tetap terkontrol nilai gizinya</li>
        <li>• Referensi: DBMP PERKENI, RS Fatmawati Jakarta</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component is informational only, no calculation needed
</script>
