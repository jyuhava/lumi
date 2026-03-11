<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Estimasi Antropometri</h2>
        <p class="text-gray-500 mt-1">Estimasi BB dari LiLA atau TB dari Ulna/Rentang Tangan.</p>
      </div>
      
      <div class="flex border-b border-gray-100">
        <button
          :class="['flex-1 py-3 text-sm font-medium transition-colors', tab === 'bb' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'bb'"
        >
          Estimasi BB (Dewasa)
        </button>
        <button
          :class="['flex-1 py-3 text-sm font-medium transition-colors', tab === 'tb' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50']"
          @click="tab = 'tb'"
        >
          Estimasi TB
        </button>
      </div>

      <div class="p-6">
        <div v-if="tab === 'bb'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="l" v-model="genderBB" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Laki-laki</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="p" v-model="genderBB" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Lingkar Lengan Atas (LiLA) dalam cm</label>
            <input 
              type="number" 
              v-model="lila"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: 28"
            />
          </div>

          <div v-if="lila !== '' && estBB !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Estimasi Berat Badan:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ estBB.toFixed(1) }} <span class="text-lg font-medium">kg</span></div>
          </div>
        </div>

        <div v-if="tab === 'tb'" class="space-y-4">
          <div class="flex gap-4 mb-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="dewasa" v-model="tbType" class="text-emerald-500 focus:ring-emerald-500" />
              <span class="text-gray-700">Dewasa (Ulna)</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" value="anak" v-model="tbType" class="text-emerald-500 focus:ring-emerald-500" />
              <span class="text-gray-700">Anak (Rentang Tangan)</span>
            </label>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div class="flex gap-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="l" v-model="genderTB" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Laki-laki</span>
              </label>
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="radio" value="p" v-model="genderTB" class="text-emerald-500 focus:ring-emerald-500" />
                <span class="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>

          <div v-if="tbType === 'dewasa'">
            <label class="block text-sm font-medium text-gray-700 mb-1">Panjang Ulna (cm)</label>
            <input 
              type="number" 
              v-model="ulna"
              class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: 25"
            />
          </div>
          
          <div v-else class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Usia Anak (Bulan)</label>
              <select 
                v-model="usiaAnak"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value="13-24">13 - 24 Bulan</option>
                <option value="25-36">25 - 36 Bulan</option>
                <option value="37-48">37 - 48 Bulan</option>
                <option value="49-60">49 - 60 Bulan</option>
              </select>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rentang Tangan (cm)</label>
              <input 
                type="number" 
                v-model="rt"
                class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Contoh: 80"
              />
            </div>
          </div>

          <div v-if="((tbType === 'dewasa' && ulna !== '') || (tbType === 'anak' && rt !== '')) && estTB !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p class="text-sm text-emerald-800 mb-1">Estimasi Tinggi Badan:</p>
            <div class="text-3xl font-bold text-emerald-600">{{ estTB.toFixed(1) }} <span class="text-lg font-medium">cm</span></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const tab = ref<'bb' | 'tb'>('bb')
const lila = ref<number | ''>('')
const genderBB = ref<'l' | 'p'>('l')

const tbType = ref<'anak' | 'dewasa'>('dewasa')
const genderTB = ref<'l' | 'p'>('l')
const ulna = ref<number | ''>('')
const rt = ref<number | ''>('')
const usiaAnak = ref<string>('13-24')

const hitungEstimasiBB = () => {
  if (lila.value === '') return null;
  const l = Number(lila.value);
  if (genderBB.value === 'l') {
    return (2.592 * l) - 12.902;
  } else {
    return (2.001 * l) - 1.223;
  }
};

const hitungEstimasiTB = () => {
  if (tbType.value === 'dewasa') {
    if (ulna.value === '') return null;
    const u = Number(ulna.value);
    if (genderTB.value === 'l') {
      return 97.252 + (2.645 * u);
    } else {
      return 68.777 + (3.536 * u);
    }
  } else {
    if (rt.value === '') return null;
    const r = Number(rt.value);
    if (genderTB.value === 'l') {
      if (usiaAnak.value === '13-24') return 27.793 + 0.685 * r;
      if (usiaAnak.value === '25-36') return 21.364 + 0.771 * r;
      if (usiaAnak.value === '37-48') return 32.157 + 0.686 * r;
      if (usiaAnak.value === '49-60') return 54.681 + 0.461 * r;
    } else {
      if (usiaAnak.value === '13-24') return 49.398 + 0.367 * r;
      if (usiaAnak.value === '25-36') return 20.185 + 0.796 * r;
      if (usiaAnak.value === '37-48') return 32 + 0.674 * r;
      if (usiaAnak.value === '49-60') return 13.861 + 0.884 * r;
    }
  }
  return null;
};

const estBB = computed(() => hitungEstimasiBB())
const estTB = computed(() => hitungEstimasiTB())
</script>