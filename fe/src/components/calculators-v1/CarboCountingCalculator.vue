<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Carbo Counting</h2>
        <p class="text-gray-500 mt-1">Hitung jumlah porsi (serving) karbohidrat. 1 porsi = 15 gram karbohidrat.</p>
      </div>
      
      <div class="p-6 space-y-8">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Hitung dari Gram Karbohidrat</h3>
          <div class="flex gap-4 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Karbohidrat (gram)</label>
              <input 
                type="number" 
                v-model="karboTotal"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Contoh: 45"
              />
            </div>
            <div class="flex-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <p class="text-sm text-emerald-800 mb-1">Jumlah Porsi (Serving):</p>
              <div class="text-2xl font-bold text-emerald-600">{{ servingKarbo !== null ? servingKarbo.toFixed(1) : '-' }}</div>
            </div>
          </div>
        </div>

        <div class="h-px bg-gray-100"></div>

        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-3">Hitung dari Total Kalori Harian</h3>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Kalori (kkal)</label>
              <input 
                type="number" 
                v-model="kalori"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Contoh: 1500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Persentase Karbohidrat (%)</label>
              <input 
                type="number" 
                v-model="persenKarbo"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div v-if="hasilKalori !== null" class="p-4 bg-emerald-50 rounded-xl border border-emerald-100 grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-emerald-800 mb-1">Total Karbohidrat:</p>
              <div class="text-xl font-bold text-emerald-700">{{ hasilKalori.totalKarboGram.toFixed(0) }} gram</div>
            </div>
            <div>
              <p class="text-sm text-emerald-800 mb-1">Total Porsi (Serving) / Hari:</p>
              <div class="text-2xl font-bold text-emerald-600">{{ hasilKalori.serving.toFixed(1) }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const karboTotal = ref<number | ''>('')
const kalori = ref<number | ''>('')
const persenKarbo = ref<number>(50)

const hitungDariKarbo = () => {
  if (karboTotal.value === '') return null;
  return Number(karboTotal.value) / 15;
};

const hitungDariKalori = () => {
  if (kalori.value === '') return null;
  const totalKarboGram = (Number(kalori.value) * (persenKarbo.value / 100)) / 4;
  const serving = totalKarboGram / 15;
  return { totalKarboGram, serving };
};

const servingKarbo = computed(() => hitungDariKarbo())
const hasilKalori = computed(() => hitungDariKalori())
</script>