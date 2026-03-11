<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Kebutuhan Gizi Klinis</h2>
        <p class="text-gray-500 mt-1">Kalkulator spesifik untuk berbagai kondisi klinis.</p>
      </div>
      
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Pilih Kondisi Klinis</label>
          <select 
            v-model="kondisi"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 text-emerald-800 font-medium"
          >
            <option value="dm">Diabetes Melitus Tipe 2 (Perkeni)</option>
            <option value="lukabakar">Luka Bakar (Curreri)</option>
            <option value="ginjalanak">Fungsi Ginjal Anak (Schwartz)</option>
          </select>
        </div>

        <div class="h-px bg-gray-100 my-4"></div>

        <div v-if="kondisi === 'dm'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select v-model="gender" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option value="l">Laki-laki</option>
                <option value="p">Perempuan</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
              <input type="number" v-model="umur" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input type="number" v-model="bb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input type="number" v-model="tb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Aktivitas Fisik</label>
              <select v-model="aktivitas" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option :value="10">Istirahat (+10%)</option>
                <option :value="20">Ringan (+20%)</option>
                <option :value="30">Sedang (+30%)</option>
                <option :value="40">Berat (+40%)</option>
                <option :value="50">Sangat Berat (+50%)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Stres Metabolik</label>
              <select v-model="stres" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                <option :value="0">Tidak Ada (0%)</option>
                <option :value="10">Ringan (+10%)</option>
                <option :value="20">Sedang (+20%)</option>
                <option :value="30">Berat (+30%)</option>
              </select>
            </div>
          </div>
          
          <div v-if="resDM !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Total Kebutuhan Energi DM:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resDM.toFixed(0) }} <span class="text-lg font-medium">kkal/hari</span></div>
          </div>
        </div>

        <div v-if="kondisi === 'lukabakar'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
              <input type="number" v-model="bb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Luas Luka Bakar (%)</label>
              <input type="number" v-model="lb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div v-if="resLukaBakar !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">BMR Luka Bakar (Curreri):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resLukaBakar.toFixed(0) }} <span class="text-lg font-medium">kkal/hari</span></div>
          </div>
        </div>

        <div v-if="kondisi === 'ginjalanak'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kategori Usia (Nilai k)</label>
            <select v-model="k" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
              <option :value="0.33">Bayi Prematur (k = 0.33)</option>
              <option :value="0.45">Bayi Aterm 0-1 thn (k = 0.45)</option>
              <option :value="0.55">Anak 1-13 thn / Perempuan &gt;13 thn (k = 0.55)</option>
              <option :value="0.70">Laki-laki &gt;13 thn (k = 0.70)</option>
            </select>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input type="number" v-model="tb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Serum Kreatinin (mg/dL)</label>
              <input type="number" step="0.1" v-model="cr" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>

          <div v-if="resGinjalAnak !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">eGFR Anak (Schwartz):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resGinjalAnak.toFixed(2) }} <span class="text-lg font-medium">ml/mnt</span></div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const kondisi = ref<string>('dm')
const bb = ref<number | ''>('')
const tb = ref<number | ''>('')
const gender = ref<'l' | 'p'>('l')
const umur = ref<number | ''>('')
const aktivitas = ref<number>(20)
const stres = ref<number>(0)
const lb = ref<number | ''>('')
const cr = ref<number | ''>('')
const k = ref<number>(0.55)

// Diperbaiki: Diubah menjadi computed
const resDM = computed(() => {
  if (bb.value === '' || tb.value === '' || umur.value === '') return null;
  const w = Number(bb.value);
  const h = Number(tb.value) / 100;
  const u = Number(umur.value);
  
  // BMR
  let bmr = gender.value === 'l' ? 30 * w : 25 * w;
  
  // Faktor Umur
  let fUmur = 0;
  if (u >= 40 && u <= 59) fUmur = -0.05;
  else if (u >= 60 && u <= 69) fUmur = -0.10;
  else if (u >= 70) fUmur = -0.20;

  // Faktor BB (IMT)
  const imt = w / (h * h);
  let fBB = 0;
  if (imt < 18.5) fBB = 0.20; // Kurus +20%
  else if (imt >= 25) fBB = -0.20; // Gemuk -20%

  const total = bmr + (bmr * fUmur) + (bmr * (aktivitas.value / 100)) + (bmr * (stres.value / 100)) + (bmr * fBB);
  return total;
});

// Diperbaiki: Diubah menjadi computed
const resLukaBakar = computed(() => {
  if (bb.value === '' || lb.value === '') return null;
  return (25 * Number(bb.value)) + (40 * Number(lb.value));
});

// Diperbaiki: Diubah menjadi computed
const resGinjalAnak = computed(() => {
  if (tb.value === '' || cr.value === '') return null;
  return (k.value * Number(tb.value)) / Number(cr.value);
});
</script>