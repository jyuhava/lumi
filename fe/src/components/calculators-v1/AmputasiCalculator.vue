<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Koreksi Amputasi</h2>
        <p class="text-gray-500 mt-1">Penyesuaian Berat Badan Ideal (BBI) dan Estimasi BB untuk pasien amputasi (Osterkamp).</p>
      </div>
      
      <div class="p-6 space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <select 
              v-model="gender"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option value="l">Laki-laki</option>
              <option value="p">Perempuan</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bagian Amputasi</label>
            <select 
              v-model="bagian"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option :value="0">Tidak Ada (0%)</option>
              <optgroup label="Ekstremitas Atas">
                <option :value="5.0">Seluruh Lengan (5.0%)</option>
                <option :value="2.7">Lengan Atas (2.7%)</option>
                <option :value="1.6">Lengan Bawah (1.6%)</option>
                <option :value="0.8">Tangan (0.8%)</option>
              </optgroup>
              <optgroup label="Ekstremitas Bawah">
                <option :value="16.0">Seluruh Kaki (16.0%)</option>
                <option :value="10.1">Paha (10.1%)</option>
                <option :value="5.9">Betis (5.9%)</option>
                <option :value="1.5">Telapak Kaki (1.5%)</option>
              </optgroup>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">BB Aktual Saat Ini (kg)</label>
            <input 
              type="number" 
              v-model="bb"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="BB dengan kondisi amputasi"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
            <input 
              type="number" 
              v-model="tb"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="TB sebelum amputasi"
            />
          </div>
        </div>

        <div v-if="hasil !== null && bagian > 0" class="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-4">
          <div class="grid grid-cols-2 gap-4 border-b border-emerald-200 pb-4">
            <div>
              <p class="text-sm text-emerald-800 mb-1">BBI Normal (Tanpa Amputasi):</p>
              <div class="text-xl font-bold text-emerald-700">{{ hasil.bbiNormal.toFixed(1) }} kg</div>
            </div>
            <div>
              <p class="text-sm text-emerald-800 mb-1">Estimasi BB Utuh (Jika tidak amputasi):</p>
              <div class="text-xl font-bold text-emerald-700">{{ hasil.bbEstimasi.toFixed(1) }} kg</div>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-emerald-800 mb-1">BBI Koreksi Amputasi:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ hasil.bbiAmputasi.toFixed(1) }} <span class="text-lg font-medium">kg</span></div>
            <p class="text-xs text-emerald-700 mt-1">
              Gunakan BBI Koreksi ini sebagai target berat badan ideal pasien saat ini.
            </p>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const bb = ref<number | ''>('')
const tb = ref<number | ''>('')
const gender = ref<'l' | 'p'>('l')
const bagian = ref<number>(0)

const hitung = () => {
  if (bb.value === '' || tb.value === '') return null;
  const w = Number(bb.value);
  const h = Number(tb.value);
  const persentase = bagian.value / 100;

  // BBI Normal (Broca)
  let bbiNormal = 0;
  if (gender.value === 'l') {
    bbiNormal = (h - 100) - ((h - 100) * 0.1);
  } else {
    bbiNormal = (h - 100) - ((h - 100) * 0.15);
  }
  if (h < 160 && gender.value === 'l') bbiNormal = h - 100;
  if (h < 150 && gender.value === 'p') bbiNormal = h - 100;

  // BBI Amputasi
  const bbiAmputasi = bbiNormal - (bbiNormal * persentase);

  // Estimasi BB Aktual (Jika pasien ditimbang dengan sisa tubuhnya)
  const bbEstimasi = w / (1 - persentase);

  return { bbiNormal, bbiAmputasi, bbEstimasi };
};

const hasil = computed(() => hitung())
</script>