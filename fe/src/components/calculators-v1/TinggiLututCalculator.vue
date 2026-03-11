<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Estimasi TB dari Tinggi Lutut</h2>
        <p class="text-gray-500 mt-1">Menggunakan rumus Chumlea untuk pasien lansia atau bedrest yang tidak bisa berdiri.</p>
      </div>
      
      <div class="p-6 space-y-5">
        <div class="grid grid-cols-3 gap-4">
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
            <input 
              type="number" 
              v-model="usia"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Lutut (cm)</label>
            <input 
              type="number" 
              step="0.1"
              v-model="tl"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Contoh: 50"
            />
          </div>
        </div>

        <div v-if="hasil !== null" class="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <p class="text-sm text-emerald-800 mb-1">Estimasi Tinggi Badan (Chumlea):</p>
          <div class="text-3xl font-bold text-emerald-600">{{ hasil.toFixed(1) }} <span class="text-lg font-medium">cm</span></div>
          <p class="text-xs text-emerald-700 mt-2">
            Diukur dari telapak kaki hingga permukaan anterior paha (tepat di atas patela) dengan lutut ditekuk 90 derajat.
            
          </p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tl = ref<number | ''>('')
const usia = ref<number | ''>('')
const gender = ref<'l' | 'p'>('l')

// Diperbaiki: Langsung dieksekusi di dalam computed() agar reaktif dan bersih
const hasil = computed(() => {
  if (tl.value === '' || usia.value === '') return null;
  const lutut = Number(tl.value);
  const u = Number(usia.value);

  if (gender.value === 'l') {
    return 64.19 - (0.04 * u) + (2.02 * lutut);
  } else {
    return 84.88 - (0.24 * u) + (1.83 * lutut);
  }
});
</script>