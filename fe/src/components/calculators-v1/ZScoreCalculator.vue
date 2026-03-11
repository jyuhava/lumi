<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Status Gizi Anak (Z-Score)</h2>
        <p class="text-gray-500 mt-1">Hitung Z-Score berdasarkan nilai median dan standar deviasi (SD) rujukan WHO.</p>
      </div>
      
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nilai Aktual Anak (BB/TB/IMT)</label>
          <input 
            type="number" 
            step="0.1"
            v-model="nilaiAnak"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Contoh: 9"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nilai Median (Rujukan WHO)</label>
          <input 
            type="number" 
            step="0.1"
            v-model="nilaiMedian"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Contoh: 9.9"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nilai SD Rujukan {{ nilaiAnak !== '' && nilaiMedian !== '' && Number(nilaiAnak) < Number(nilaiMedian) ? '(-1 SD)' : '(+1 SD)' }}
          </label>
          <input 
            type="number" 
            step="0.1"
            v-model="nilaiSD"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Masukkan nilai pada kolom -1SD atau +1SD tabel WHO"
          />
          <p class="text-xs text-gray-500 mt-1">
            Jika nilai anak &lt; median, masukkan nilai rujukan -1 SD. Jika nilai anak &gt; median, masukkan nilai rujukan +1 SD.
          </p>
        </div>

        <div v-if="zscore !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p class="text-sm text-emerald-800 mb-1">Hasil Z-Score:</p>
          <div class="text-3xl font-bold text-emerald-600">{{ zscore.toFixed(2) }}</div>
          <p class="text-xs text-emerald-700 mt-2">
            Cocokkan hasil ini dengan tabel Kategori Z-Score (misal: -2 SD s/d +1 SD = Normal).
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const nilaiAnak = ref<number | ''>('')
const nilaiMedian = ref<number | ''>('')
const nilaiSD = ref<number | ''>('')

// Diperbaiki: Langsung menggunakan computed property untuk performa yang optimal
const zscore = computed(() => {
  if (nilaiAnak.value === '' || nilaiMedian.value === '' || nilaiSD.value === '') return null;
  const anak = Number(nilaiAnak.value);
  const median = Number(nilaiMedian.value);
  const sd = Number(nilaiSD.value);

  if (anak < median) {
    return (anak - median) / (median - sd);
  } else if (anak > median) {
    return (anak - median) / (sd - median);
  } else {
    return 0;
  }
});
</script>