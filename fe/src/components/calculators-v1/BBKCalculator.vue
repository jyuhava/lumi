<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Berat Badan Kering/Koreksi (BBK)</h2>
        <p class="text-gray-500 mt-1">Koreksi berat badan berdasarkan penumpukan cairan.</p>
      </div>
      
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
          <input 
            type="number" 
            v-model="bbAktual"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            placeholder="Contoh: 65"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Penumpukan Cairan</label>
          <select 
            v-model="fluidType"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
          >
            <option value="oedema">Oedema</option>
            <option value="ascites">Ascites</option>
            <option value="efusi">Efusi Pleura</option>
            <option value="hydrothorax">Hydrothorax</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tingkat Keparahan</label>
          <select 
            v-model="severity"
            class="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
          >
            <option value="ringan">Ringan</option>
            <option value="sedang" :disabled="fluidType === 'efusi' || fluidType === 'hydrothorax'">Sedang</option>
            <option value="berat">Berat</option>
          </select>
          
          <p v-if="(fluidType === 'efusi' || fluidType === 'hydrothorax') && severity === 'sedang'" class="text-xs text-amber-500 mt-1">
            Tingkat sedang tidak didefinisikan untuk jenis cairan ini dalam referensi.
          </p>
        </div>

        <div v-if="bbAktual !== '' && bbk !== null" class="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
          <p class="text-sm text-emerald-800 mb-1">Hasil Berat Badan Koreksi:</p>
          <div class="text-3xl font-bold text-emerald-600">{{ bbk.toFixed(1) }} <span class="text-lg font-medium">kg</span></div>
          <p class="text-xs text-emerald-600 mt-2">
            Pengurangan: {{ (Number(bbAktual) - bbk).toFixed(1) }} kg
          </p>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

type FluidType = 'oedema' | 'ascites' | 'efusi' | 'hydrothorax';
type Severity = 'ringan' | 'sedang' | 'berat';

const bbAktual = ref<number | ''>('')
const fluidType = ref<FluidType>('oedema')
const severity = ref<Severity>('ringan')

// Tambahan UX: Reset otomatis jika user pindah ke cairan yang tidak punya level "Sedang"
watch(fluidType, (newVal) => {
  if ((newVal === 'efusi' || newVal === 'hydrothorax') && severity.value === 'sedang') {
    severity.value = 'ringan';
  }
});

const hitungBBK = () => {
  if (bbAktual.value === '') return null;
  const bb = Number(bbAktual.value);
  let deduction = 0;

  if (fluidType.value === 'oedema') {
    if (severity.value === 'ringan') deduction = bb * 0.10;
    else if (severity.value === 'sedang') deduction = bb * 0.20;
    else if (severity.value === 'berat') deduction = bb * 0.30;
  } else if (fluidType.value === 'ascites') {
    if (severity.value === 'ringan') deduction = 2.2;
    else if (severity.value === 'sedang') deduction = 6;
    else if (severity.value === 'berat') deduction = 10;
  } else if (fluidType.value === 'efusi') {
    if (severity.value === 'ringan') deduction = bb * 0.20;
    else if (severity.value === 'sedang') deduction = 0; // Not defined in table, assume 0 or N/A
    else if (severity.value === 'berat') deduction = bb * 0.25;
  } else if (fluidType.value === 'hydrothorax') {
    if (severity.value === 'ringan') deduction = bb * 0.25;
    else if (severity.value === 'sedang') deduction = 0; // Not defined
    else if (severity.value === 'berat') deduction = bb * 0.30;
  }

  return bb - deduction;
};

const bbk = computed(() => hitungBBK())
</script>