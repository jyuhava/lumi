import os

vue_dir = '/Users/wiibs/project/nut/fe/src/components/calculators-v1'
files = [f for f in os.listdir(vue_dir) if f.endswith('.vue')]
imports = []
calc_array = []

labels_map = {
    'AmputasiCalculator.vue': 'Koreksi Amputasi',
    'BBICalculator.vue': 'Berat Badan Ideal',
    'BBKCalculator.vue': 'Berat Badan Koreksi',
    'BumilBusuiCalculator.vue': 'Gizi Ibu Hamil & Menyusui',
    'CarboCountingCalculator.vue': 'Carbo Counting',
    'EstimasiAntropometri.vue': 'Estimasi Antropometri',
    'FungsiGinjal.vue': 'Fungsi Ginjal (eGFR)',
    'GCSCalculator.vue': 'GCS',
    'GiziAnakCalculator.vue': 'Gizi Anak',
    'GiziKlinisCalculator.vue': 'Kalkulator Gizi Klinis',
    'KebutuhanCairan.vue': 'Kebutuhan Cairan',
    'KebutuhanEnergi.vue': 'Kebutuhan Energi',
    'LabGiziCalculator.vue': 'Lab & Gizi',
    'PenurunanBBCalculator.vue': 'Penurunan Berat Badan',
    'PreskripsiDietCalculator.vue': 'Preskripsi Diet',
    'StatusGizi.vue': 'Status Gizi',
    'TinggiLututCalculator.vue': 'Tinggi Lutut',
    'ZScoreCalculator.vue': 'Z-Score (WHO)'
}

for f in sorted(files):
    name = f[:-4]
    imports.append(f"import {name} from '@/components/calculators-v1/{f}'")
    label = labels_map.get(f, name)
    calc_array.append(f"  {{ id: '{name.lower()}', label: '{label}', icon: 'calculator-outline', component: {name} }}, ")

view_content = f"""<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-bold text-[#4a6825] flex items-center gap-2">
            <ion-icon name="calculator"></ion-icon>
            Kalkulator Klinis (v1)
          </h2>
          <p class="text-gray-500 text-sm mt-1">Kumpulan kalkulator skrining dan perhitungan gizi terpadu.</p>
        </div>
      </div>

      <!-- Main Layout -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Sidebar Tabs -->
        <div class="w-full lg:w-64 flex-shrink-0">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-4 border-b border-gray-50 bg-gray-50/50">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-widest">Daftar Kalkulator</h3>
            </div>
            <div class="p-2 space-y-1 h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
              <button
                v-for="calc in calculators"
                :key="calc.id"
                @click="activeTab = calc.id"
                :class="[
                  'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center gap-3',
                  activeTab === calc.id 
                    ? 'bg-[#739b1a] text-white shadow-md shadow-[#739b1a]/20' 
                    : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                ]"
              >
                <ion-icon :name="calc.icon" :class="activeTab === calc.id ? 'text-white' : 'text-gray-400'"></ion-icon>
                {{{{ calc.label }}}}
              </button>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[500px] overflow-hidden">
          <Transition mode="out-in" name="fade">
            <component :is="activeComponent" :key="activeTab" />
          </Transition>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import {{ ref, computed }} from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

{chr(10).join(imports)}

const calculators = [
{chr(10).join(calc_array)}
]

const activeTab = ref(calculators[0].id)

const activeComponent = computed(() => {{
  const calc = calculators.find(c => c.id === activeTab.value)
  return calc ? calc.component : null
}})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {{
  transition: opacity 0.2s ease, transform 0.2s ease;
}}
.fade-enter-from,
.fade-leave-to {{
  opacity: 0;
  transform: translateX(10px);
}}
.scrollbar-thin::-webkit-scrollbar {{
  width: 4px;
}}
.scrollbar-thin::-webkit-scrollbar-track {{
  background: transparent;
}}
.scrollbar-thin::-webkit-scrollbar-thumb {{
  background-color: #e5e7eb;
  border-radius: 20px;
}}
</style>
"""

with open('/Users/wiibs/project/nut/fe/src/views/CalculatorV1View.vue', 'w') as f:
    f.write(view_content)
