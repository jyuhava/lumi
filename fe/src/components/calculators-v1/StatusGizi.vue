<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Status Gizi</h2>
        <p class="text-gray-500 mt-1">Evaluasi status gizi berdasarkan IMT, %LiLA, atau RLPP.</p>
      </div>
      
      <div class="flex border-b border-gray-100">
        <button
          :class="['flex-1 py-3 text-sm font-medium transition-colors', tab === 'imt' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'imt'"
        >
          IMT
        </button>
        <button
          :class="['flex-1 py-3 text-sm font-medium transition-colors', tab === 'lila' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'lila'"
        >
          % LiLA
        </button>
        <button
          :class="['flex-1 py-3 text-sm font-medium transition-colors', tab === 'rlpp' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'rlpp'"
        >
          RLPP
        </button>
      </div>

      <div class="p-6">
        
        <div v-if="tab === 'imt'" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input 
                type="number" 
                v-model="bbIMT"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input 
                type="number" 
                v-model="tbIMT"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div v-if="resIMT !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Indeks Massa Tubuh (IMT):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resIMT.imt.toFixed(2) }}</div>
            <p class="text-sm font-medium text-emerald-700 mt-1">Status: {{ resIMT.status }}</p>
          </div>
        </div>

        <div v-if="tab === 'lila'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="l" v-model="lilaGender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Laki-laki</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="p" v-model="lilaGender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Kelompok Usia</label>
              <select 
                v-model="lilaAge"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="1-1.9">1 - 1.9 thn</option>
                <option value="2-2.9">2 - 2.9 thn</option>
                <option value="3-3.9">3 - 3.9 thn</option>
                <option value="4-4.9">4 - 4.9 thn</option>
                <option value="5-5.9">5 - 5.9 thn</option>
                <option value="6-6.9">6 - 6.9 thn</option>
                <option value="7-7.9">7 - 7.9 thn</option>
                <option value="8-8.9">8 - 8.9 thn</option>
                <option value="9-9.9">9 - 9.9 thn</option>
                <option value="10-10.9">10 - 10.9 thn</option>
                <option value="11-11.9">11 - 11.9 thn</option>
                <option value="12-12.9">12 - 12.9 thn</option>
                <option value="13-13.9">13 - 13.9 thn</option>
                <option value="14-14.9">14 - 14.9 thn</option>
                <option value="15-15.9">15 - 15.9 thn</option>
                <option value="16-16.9">16 - 16.9 thn</option>
                <option value="17-17.9">17 - 17.9 thn</option>
                <option value="18-18.9">18 - 18.9 thn</option>
                <option value="19-24.9">19 - 24.9 thn</option>
                <option value="25-34.9">25 - 34.9 thn</option>
                <option value="35-44.9">35 - 44.9 thn</option>
                <option value="45-54.9">45 - 54.9 thn</option>
                <option value="55-64.9">55 - 64.9 thn</option>
                <option value="65-74.9">65 - 74.9 thn</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">LiLA Aktual (cm)</label>
              <input 
                type="number" 
                v-model="lilaAktual"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div v-if="resLila !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Persentase LiLA:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resLila.persen.toFixed(1) }}%</div>
            <p class="text-sm font-medium text-emerald-700 mt-1">Status: {{ resLila.status }}</p>
            <p class="text-xs text-emerald-600 mt-1">Standar LiLA: {{ resLila.standar }} cm</p>
          </div>
        </div>

        <div v-if="tab === 'rlpp'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="l" v-model="rlppGender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Laki-laki</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="p" v-model="rlppGender" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lingkar Pinggang (cm)</label>
              <input 
                type="number" 
                v-model="lp"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lingkar Pinggul (cm)</label>
              <input 
                type="number" 
                v-model="lpi"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>
          
          <div v-if="resRLPP !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Rasio Lingkar Pinggang Pinggul (RLPP):</p>
            <div class="text-3xl font-bold text-emerald-600">{{ resRLPP.ratio.toFixed(2) }}</div>
            <p class="text-sm font-medium text-emerald-700 mt-1">Status: {{ resRLPP.status }}</p>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tab = ref<'imt' | 'lila' | 'rlpp'>('imt')

// IMT State
const bbIMT = ref<number | ''>('')
const tbIMT = ref<number | ''>('')

// LILA State
const lilaAktual = ref<number | ''>('')
const lilaGender = ref<'l' | 'p'>('l')
const lilaAge = ref<string>('1-1.9')

// RLPP State
const lp = ref<number | ''>('')
const lpi = ref<number | ''>('')
const rlppGender = ref<'l' | 'p'>('l')

// Diperbaiki: Menggunakan computed properties penuh
const resIMT = computed(() => {
  if (bbIMT.value === '' || tbIMT.value === '') return null;
  const bb = Number(bbIMT.value);
  const tbM = Number(tbIMT.value) / 100;
  const imt = bb / (tbM * tbM);

  let status = '';
  if (imt < 18.5) status = 'Gizi Kurang';
  else if (imt >= 18.5 && imt <= 24.9) status = 'Gizi Baik (Normal)';
  else if (imt >= 25 && imt <= 29.9) status = 'Gizi Lebih (Overweight)';
  else if (imt >= 30) status = 'Obesitas';

  return { imt, status };
});

// Diperbaiki: Memisahkan standar LiLA ke computed tersendiri
const standarLila = computed(() => {
  const standar: Record<string, { l: number, p: number }> = {
    '1-1.9': { l: 15.9, p: 15.6 },
    '2-2.9': { l: 16.2, p: 16.0 },
    '3-3.9': { l: 16.7, p: 16.7 },
    '4-4.9': { l: 17.1, p: 16.9 },
    '5-5.9': { l: 17.5, p: 17.3 },
    '6-6.9': { l: 17.9, p: 17.6 },
    '7-7.9': { l: 18.7, p: 18.3 },
    '8-8.9': { l: 19.0, p: 19.5 },
    '9-9.9': { l: 20.0, p: 20.0 },
    '10-10.9': { l: 21.0, p: 21.0 },
    '11-11.9': { l: 22.3, p: 22.4 },
    '12-12.9': { l: 23.2, p: 23.7 },
    '13-13.9': { l: 24.7, p: 25.2 },
    '14-14.9': { l: 25.3, p: 25.2 },
    '15-15.9': { l: 26.4, p: 25.4 },
    '16-16.9': { l: 27.8, p: 25.8 },
    '17-17.9': { l: 28.5, p: 26.4 },
    '18-18.9': { l: 29.7, p: 25.8 },
    '19-24.9': { l: 30.8, p: 26.5 },
    '25-34.9': { l: 31.9, p: 27.7 },
    '35-44.9': { l: 32.6, p: 29.0 },
    '45-54.9': { l: 32.2, p: 29.9 },
    '55-64.9': { l: 31.7, p: 30.3 },
    '65-74.9': { l: 30.7, p: 29.9 },
  };
  return standar[lilaAge.value as keyof typeof standar]?.[lilaGender.value as 'l' | 'p'] || 0;
});

// Diperbaiki: Menggunakan standarLila.value di dalam computed
const resLila = computed(() => {
  if (lilaAktual.value === '') return null;
  const aktual = Number(lilaAktual.value);
  const standar = standarLila.value;
  const persen = (aktual / standar) * 100;

  let status = '';
  if (persen > 120) status = 'Obesitas';
  else if (persen >= 110 && persen <= 120) status = 'Overweight';
  else if (persen >= 85 && persen < 110) status = 'Gizi Baik';
  else if (persen >= 70.1 && persen < 85) status = 'Gizi Kurang';
  else if (persen < 70) status = 'Gizi Buruk';

  return { persen, status, standar };
});

const resRLPP = computed(() => {
  if (lp.value === '' || lpi.value === '') return null;
  const ratio = Number(lp.value) / Number(lpi.value);
  let status = '';
  if (rlppGender.value === 'l') {
    status = ratio >= 0.90 ? 'Obesitas Sentral' : 'Tidak Obesitas';
  } else {
    status = ratio >= 0.80 ? 'Obesitas Sentral' : 'Tidak Obesitas';
  }
  return { ratio, status };
});
</script>