import re
with open('/Users/wiibs/project/nut/fe/src/views/DashboardView.vue', 'r') as f:
    content = f.read()

template_insertion = """
      <!-- Access to Calculators Directory -->
      <div class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 class="text-base font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <ion-icon name="grid-outline" class="text-[#739b1a]"></ion-icon>
              Direktori Kalkulator Klinis
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">Akses cepat ke alat perhitungan gizi.</p>
          </div>
          <div class="flex p-1 bg-gray-100 rounded-lg">
            <button @click="activeCalcTab = 'baru'" :class="activeCalcTab === 'baru' ? 'bg-white shadow-sm text-[#4a6825]' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-1.5 text-xs font-bold rounded-md transition-all">Kalkulator Baru</button>
            <button @click="activeCalcTab = 'v1'" :class="activeCalcTab === 'v1' ? 'bg-white shadow-sm text-[#4a6825]' : 'text-gray-500 hover:text-gray-700'" class="px-4 py-1.5 text-xs font-bold rounded-md transition-all">Kalkulator v1</button>
          </div>
        </div>
        <div class="p-6">
          <div v-if="activeCalcTab === 'baru'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <router-link v-for="calc in calcBaru" :key="calc.path" :to="calc.path" class="group p-4 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 hover:shadow-md transition-all min-h-[120px] flex flex-col justify-between">
              <div>
                <ion-icon :name="calc.icon" class="text-2xl text-[#739b1a] mb-2"></ion-icon>
                <h4 class="font-bold text-sm text-gray-800">{{ calc.title }}</h4>
              </div>
            </router-link>
          </div>
          <div v-if="activeCalcTab === 'v1'" class="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-5 gap-3">
             <router-link v-for="calc in calcV1" :key="calc.id" :to="'/calculator-v1?tab=' + calc.id" class="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-[#f8faf6] hover:border-[#bcdd5a] bg-white shadow-sm">
              <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a6825] group-hover:text-white group-hover:border-[#4a6825] transition-colors text-gray-400">
                <ion-icon :name="calc.icon" class="text-lg"></ion-icon>
              </div>
              <h4 class="font-bold text-xs text-gray-800">{{ calc.label }}</h4>
            </router-link>
          </div>
        </div>
      </div>
"""

script_insertion = """
const activeCalcTab = ref('baru')

const calcBaru = [
  { title: 'Penilaian Status Gizi', path: '/calculator/nutritional-status', icon: 'body' },
  { title: 'Gizi Ibu Hamil & Menyusui', path: '/calculator/pregnancy', icon: 'woman' },
  { title: 'Perhitungan Carbo Counting', path: '/calculator/carbo-counting', icon: 'pie-chart' },
  { title: 'Estimasi Antropometri Lengkap', path: '/calculator/anthropometry', icon: 'man' },
  { title: 'Fungsi Ginjal & Laju Filtrasi', path: '/calculator/kidney-function', icon: 'water' },
  { title: 'GCS & Kebutuhan Kalori', path: '/calculator/gcs', icon: 'pulse' },
  { title: 'Kalkulator Gizi Klinis', path: '/calculator/clinical-nutrition', icon: 'medkit' }
]

const calcV1 = [
    { id: 'amputasicalculator', label: 'Koreksi Amputasi', icon: 'calculator-outline' }, 
    { id: 'bbkcalculator', label: 'Berat Badan Koreksi', icon: 'calculator-outline' }, 
    { id: 'bumilbusuicalculator', label: 'Gizi Ibu Hamil & Menyusui', icon: 'calculator-outline' }, 
    { id: 'carbocountingcalculator', label: 'Carbo Counting', icon: 'calculator-outline' }, 
    { id: 'estimasiantropometri', label: 'Estimasi Antropometri', icon: 'calculator-outline' }, 
    { id: 'fungsiginjal', label: 'Fungsi Ginjal (eGFR)', icon: 'calculator-outline' }, 
    { id: 'gcscalculator', label: 'GCS', icon: 'calculator-outline' }, 
    { id: 'gizianakcalculator', label: 'Gizi Anak', icon: 'calculator-outline' }, 
    { id: 'gizikliniscalculator', label: 'Kalkulator Gizi Klinis', icon: 'calculator-outline' }, 
    { id: 'labgizicalculator', label: 'Lab & Gizi', icon: 'calculator-outline' }, 
    { id: 'penurunanbbcalculator', label: 'Penurunan Berat Badan', icon: 'calculator-outline' }, 
    { id: 'preskripsidietcalculator', label: 'Preskripsi Diet', icon: 'calculator-outline' }, 
    { id: 'statusgizi', label: 'Status Gizi', icon: 'calculator-outline' }, 
    { id: 'tinggilututcalculator', label: 'Tinggi Lutut', icon: 'calculator-outline' }, 
    { id: 'zscorecalculator', label: 'Z-Score (WHO)', icon: 'calculator-outline' }
]
"""

content = content.replace("    </template>\n  </AdminLayout>", template_insertion + "\n    </template>\n  </AdminLayout>")
content = content.replace("import { ref, onMounted, computed } from 'vue'", "import { ref, onMounted, computed } from 'vue'\n" + script_insertion)

with open('/Users/wiibs/project/nut/fe/src/views/DashboardView.vue', 'w') as f:
    f.write(content)
