<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Laboratorium Gizi</h2>
        <p class="text-gray-500 mt-1">Perhitungan klinis berdasarkan parameter biokimia darah dan urin.</p>
      </div>
      
      <div class="flex overflow-x-auto border-b border-gray-100 hide-scrollbar">
        <button
          :class="['px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors', tab === 'nitrogen' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'nitrogen'"
        >
          Nitrogen Balance
        </button>
        <button
          :class="['px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors', tab === 'kalsium' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'kalsium'"
        >
          Koreksi Kalsium
        </button>
        <button
          :class="['px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors', tab === 'osmolaritas' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'osmolaritas'"
        >
          Osmolaritas
        </button>
        <button
          :class="['px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors', tab === 'ganzoni' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'ganzoni'"
        >
          Defisit Besi (Ganzoni)
        </button>
      </div>

      <div class="p-6 space-y-5">
        
        <div v-if="tab === 'nitrogen'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Asupan Protein (g/hari)</label>
              <input type="number" v-model="protein" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">UUN (Urine Urea Nitrogen) (g/hari)</label>
              <input type="number" v-model="uun" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          
          <div v-if="resNitrogen !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Keseimbangan Nitrogen:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resNitrogen.toFixed(2) }} <span class="text-lg font-medium">g</span></div>
            <p class="text-xs text-emerald-700 mt-2">
              Positif (+) = Anabolik (Membangun otot/pemulihan). Negatif (-) = Katabolik (Pemecahan otot/stres). Target pemulihan: +2 s/d +4.
            </p>
          </div>
        </div>

        <div v-if="tab === 'kalsium'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Total Kalsium Serum (mg/dL)</label>
              <input type="number" step="0.1" v-model="ca" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Albumin Serum (g/dL)</label>
              <input type="number" step="0.1" v-model="albumin" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          
          <div v-if="resKalsium !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Kalsium Terkoreksi:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resKalsium.toFixed(2) }} <span class="text-lg font-medium">mg/dL</span></div>
            <p class="text-xs text-emerald-700 mt-2">
              Gunakan nilai ini untuk mendiagnosis hipokalsemia pada pasien dengan hipoalbuminemia. Normal: 8.5 - 10.5 mg/dL.
            </p>
          </div>
        </div>

        <div v-if="tab === 'osmolaritas'" class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Natrium (mEq/L)</label>
              <input type="number" v-model="na" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Glukosa (mg/dL)</label>
              <input type="number" v-model="glukosa" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">BUN (mg/dL)</label>
              <input type="number" v-model="bun" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          
          <div v-if="resOsmolaritas !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Osmolaritas Darah:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resOsmolaritas.toFixed(1) }} <span class="text-lg font-medium">mOsm/kg</span></div>
            <p class="text-xs text-emerald-700 mt-2">
              Normal: 275 - 295 mOsm/kg. &gt;295 = Dehidrasi / Hiperosmolar.
            </p>
          </div>
        </div>

        <div v-if="tab === 'ganzoni'" class="space-y-4">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input type="number" v-model="bb" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hb Aktual (g/dL)</label>
              <input type="number" step="0.1" v-model="hbAktual" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hb Target (g/dL)</label>
              <input type="number" step="0.1" v-model="hbTarget" class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
            </div>
          </div>
          
          <div v-if="resGanzoni !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Total Defisit Besi (Ganzoni):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resGanzoni.toFixed(0) }} <span class="text-lg font-medium">mg</span></div>
            <p class="text-xs text-emerald-700 mt-2">
              Digunakan untuk menghitung dosis suplementasi besi intravena pada anemia defisiensi besi. (Sudah termasuk 500mg untuk cadangan besi).
            </p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tab = ref<'nitrogen' | 'kalsium' | 'osmolaritas' | 'ganzoni'>('nitrogen')

// State
const protein = ref<number | ''>('')
const uun = ref<number | ''>('')
const ca = ref<number | ''>('')
const albumin = ref<number | ''>('')
const na = ref<number | ''>('')
const glukosa = ref<number | ''>('')
const bun = ref<number | ''>('')
const bb = ref<number | ''>('')
const hbAktual = ref<number | ''>('')
const hbTarget = ref<number>(15)

// Diperbaiki: Mengubah function biasa menjadi computed properties
const resNitrogen = computed(() => {
  if (protein.value === '' || uun.value === '') return null;
  const nIntake = Number(protein.value) / 6.25;
  const nOutput = Number(uun.value) + 4;
  return nIntake - nOutput;
});

const resKalsium = computed(() => {
  if (ca.value === '' || albumin.value === '') return null;
  return Number(ca.value) + 0.8 * (4.0 - Number(albumin.value));
});

const resOsmolaritas = computed(() => {
  if (na.value === '' || glukosa.value === '' || bun.value === '') return null;
  return (2 * Number(na.value)) + (Number(glukosa.value) / 18) + (Number(bun.value) / 2.8);
});

const resGanzoni = computed(() => {
  if (bb.value === '' || hbAktual.value === '') return null;
  // Defisit Besi (mg) = BB (kg) * (Target Hb - Actual Hb) * 2.4 + Depot Iron (500mg)
  return (Number(bb.value) * (hbTarget.value - Number(hbAktual.value)) * 2.4) + 500;
});
</script>