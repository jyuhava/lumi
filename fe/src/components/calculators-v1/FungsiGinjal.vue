<template>
  <div class="h-full bg-white">
    
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <h2 class="text-2xl font-bold text-gray-800">Fungsi Ginjal (eGFR)</h2>
          <p class="text-gray-500 mt-1">Estimasi Laju Filtrasi Glomerulus dengan Formula Cockcroft-Gault.</p>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="l" :checked="gender === 'l'" v-model="gender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Laki-laki</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="p" :checked="gender === 'p'" v-model="gender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
              <input 
                type="number" 
                v-model="usia"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input 
                type="number" 
                v-model="bb"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Serum Kreatinin (mg/dL)</label>
              <input 
                type="number" 
                step="0.1"
                v-model="kreatinin"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <template v-if="gfr !== null ">
            <div class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p class="text-sm text-emerald-800 mb-1">Estimasi GFR (ml/mnt):</p>
              <div class="text-3xl font-bold text-emerald-600">{{ gfr.toFixed(2) }}</div>
              <p class="text-sm font-medium text-emerald-700 mt-2">Kategori: {{ getStatus(gfr) }}</p>
            </div>
</template>
        </div>
      </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'


const usia = ref<number | ''>('')
const bb = ref<number | ''>('')
const kreatinin = ref<number | ''>('')
const gender = ref<'l' | 'p'>('l')

const hitungGFR = () => {
    if (usia.value === '' || bb.value === '' || kreatinin.value === '') return null;
    const u = Number(usia.value);
    const w = Number(bb.value);
    const cr = Number(kreatinin.value);

    let gfr = ((140 - u) * w) / (72 * cr);
    if (gender.value === 'p') {
      gfr = gfr * 0.85;
    }
    return gfr;
  };

  const getStatus = (gfr: number) => {
    if (gfr >= 90) return 'Kerusakan ginjal, fungsi normal/meningkat (Stadium 1)';
    if (gfr >= 60) return 'Penurunan fungsi ginjal ringan (Stadium 2)';
    if (gfr >= 30) return 'Penurunan fungsi ginjal sedang (Stadium 3)';
    if (gfr >= 15) return 'Penurunan fungsi ginjal parah (Stadium 4)';
    return 'Gagal ginjal (Stadium 5)';
  };

const gfr = computed(() => hitungGFR())
</script>
