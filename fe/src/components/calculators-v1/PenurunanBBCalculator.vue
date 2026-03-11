<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Target Penurunan Berat Badan</h2>
        <p class="text-gray-500 mt-1">Hitung defisit kalori untuk penurunan berat badan yang sehat (0.5 - 1 kg/minggu).</p>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
            <input 
              type="number" 
              v-model="usia"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
            <input 
              type="number" 
              v-model="bb"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
            <input 
              type="number" 
              v-model="tb"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tingkat Aktivitas</label>
            <select 
              v-model="aktivitas"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option :value="1.2">Sangat Jarang Olahraga (1.2)</option>
              <option :value="1.375">Jarang Olahraga (1.375)</option>
              <option :value="1.55">Cukup Olahraga (1.55)</option>
              <option :value="1.725">Sering Olahraga (1.725)</option>
              <option :value="1.9">Sangat Sering Olahraga (1.9)</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Target Penurunan</label>
            <select 
              v-model="targetTurun"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            >
              <option :value="500">0.5 kg / minggu (-500 kkal)</option>
              <option :value="750">0.75 kg / minggu (-750 kkal)</option>
              <option :value="1000">1 kg / minggu (-1000 kkal)</option>
            </select>
          </div>
        </div>

        <div v-if="hasil !== null" class="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-4">
          <div class="grid grid-cols-2 gap-4 border-b border-emerald-200 pb-4">
            <div>
              <p class="text-sm text-emerald-800 mb-1">BMR (Mifflin):</p>
              <div class="text-xl font-bold text-emerald-700">{{ hasil.bmr.toFixed(0) }} kkal</div>
            </div>
            <div>
              <p class="text-sm text-emerald-800 mb-1">TDEE (Pemeliharaan):</p>
              <div class="text-xl font-bold text-emerald-700">{{ hasil.tdee.toFixed(0) }} kkal</div>
            </div>
          </div>
          
          <div>
            <p class="text-sm text-emerald-800 mb-1">Target Kalori Harian (Defisit):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ hasil.targetKalori.toFixed(0) }} <span class="text-lg font-medium">kkal/hari</span></div>
            <p class="text-xs text-emerald-700 mt-1">
              *Batas aman asupan kalori minimal 1200 kkal (wanita) atau 1500 kkal (pria).
            </p>
          </div>

          <div class="pt-2">
            <p class="text-sm text-emerald-800 mb-1">Rekomendasi Protein (Diet Tinggi Protein):</p>
            <div class="text-xl font-bold text-emerald-700">{{ hasil.proteinMin.toFixed(0) }} - {{ hasil.proteinMax.toFixed(0) }} g/hari</div>
          </div>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const gender = ref<'l' | 'p'>('l')
const bb = ref<number | ''>('')
const tb = ref<number | ''>('')
const usia = ref<number | ''>('')
const aktivitas = ref<number>(1.2)
const targetTurun = ref<number>(500)

// Diperbaiki: Langsung menggunakan satu computed property utuh
const hasil = computed(() => {
  if (bb.value === '' || tb.value === '' || usia.value === '') return null;
  const w = Number(bb.value);
  const h = Number(tb.value);
  const u = Number(usia.value);

  // BMR Mifflin
  let bmr = 0;
  if (gender.value === 'l') {
    bmr = (10 * w) + (6.25 * h) - (5 * u) + 5;
  } else {
    bmr = (10 * w) + (6.25 * h) - (5 * u) - 161;
  }

  const tdee = bmr * aktivitas.value;
  const targetKalori = tdee - targetTurun.value;
  
  // Protein 1 - 1.2 g/kgBB (Diet Tinggi Protein untuk Penurunan BB)
  const proteinMin = w * 1.0;
  const proteinMax = w * 1.2;

  return { bmr, tdee, targetKalori, proteinMin, proteinMax };
});
</script>