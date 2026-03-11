<template>
  <AdminLayout>
    <div class="mb-6 flex items-center gap-3">
      <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
        <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
      </router-link>
      <div>
        <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight">Kalkulator Gizi Klinis Komprehensif</h2>
        <p class="text-sm font-medium text-gray-500 mt-1">Berdasarkan Metodologi PAGT – Kemenkes RI & WHO</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="q in QUADRANTS"
        :key="q"
        @click="setQuadrant(q)"
        class="px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
        :class="quadrant === q
          ? 'bg-[#4a6825] text-white shadow-md shadow-[#4a6825]/20 scale-105'
          : 'bg-white text-gray-600 hover:bg-[#f8faf6] hover:text-[#4a6825] border border-gray-200'"
      >
        {{ q }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

      <div class="lg:col-span-5 space-y-5">

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div class="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
            <div class="w-8 h-8 bg-[#f8faf6] border border-[#bcdd5a]/40 rounded-lg flex items-center justify-center">
              <ion-icon name="person-outline" class="text-[#4a6825]"></ion-icon>
            </div>
            <h3 class="font-bold text-[#16200B] text-base">Data Pasien</h3>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Jenis Kelamin</label>
                <div class="relative">
                  <select v-model="gender" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium appearance-none pr-8">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></ion-icon>
                </div>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Usia</label>
                <div class="flex">
                  <input type="number" v-model="age" placeholder="0" class="w-full border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium" />
                  <template v-if="quadrant.includes('Anak')">
                    <select v-model="ageUnit" class="border border-gray-200 bg-gray-100 rounded-r-xl px-2 text-xs font-bold text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#739b1a]">
                      <option value="tahun">Thn</option>
                      <option value="bulan">Bln</option>
                    </select>
                  </template>
                  <template v-else>
                    <span class="border border-gray-200 bg-gray-100 rounded-r-xl px-3 text-xs font-bold text-gray-500 flex items-center">Thn</span>
                  </template>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Berat Badan (kg)</label>
                <input type="number" v-model="weight" placeholder="Contoh: 67" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Tinggi Badan (cm)</label>
                <input type="number" v-model="height" placeholder="Contoh: 175" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium" />
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div class="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
            <div class="w-8 h-8 bg-[#f8faf6] border border-[#bcdd5a]/40 rounded-lg flex items-center justify-center">
              <ion-icon name="clipboard-outline" class="text-[#4a6825]"></ion-icon>
            </div>
            <h3 class="font-bold text-[#16200B] text-base">Faktor Klinis</h3>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                <ion-icon name="walk-outline" class="text-[#4a6825]"></ion-icon>Faktor Aktivitas
              </label>
              <div class="relative">
                <select v-model="activity" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium appearance-none pr-8">
                  <template v-if="quadrant.includes('Sehat')">
                    <option :value="1.2">Sedenter / Istirahat (1.2)</option>
                    <option :value="1.375">Aktivitas Ringan (1.375)</option>
                    <option :value="1.55">Aktivitas Sedang (1.55)</option>
                    <option :value="1.9">Sangat Berat (1.9)</option>
                  </template>
                  <template v-else>
                    <option :value="1.2">Bed Rest Total (1.2)</option>
                    <option :value="1.3">Ambulatory / Tidak Bed Rest (1.3)</option>
                  </template>
                </select>
                <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm"></ion-icon>
              </div>
            </div>

            <template v-if="quadrant.includes('Sakit')">
              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1.5">
                  <ion-icon name="pulse-outline" class="text-red-500"></ion-icon>Faktor Stres / Patologis
                </label>
                <div class="relative">
                  <select v-model="stress" class="w-full border border-red-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-red-50 text-red-800 font-medium appearance-none pr-8">
                    <option :value="1.0">Tidak Ada / Minimal (1.0)</option>
                    <option :value="1.3">Infeksi Pediatrik (1.3)</option>
                    <option :value="1.4">Stres Ringan – Operasi minor (1.4)</option>
                    <option :value="1.5">Stres Sedang – Sepsis fokal (1.5)</option>
                    <option :value="1.7">Stres Berat – Trauma ganda, sepsis luas (1.7)</option>
                  </select>
                  <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 pointer-events-none text-sm"></ion-icon>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-600 mb-1.5">Target Protein Akut (g/kg BB)</label>
                <input type="number" step="0.1" v-model="proteinPerKg" class="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] bg-gray-50 text-gray-800 font-medium" />
                <p class="text-[11px] text-gray-400 mt-1 font-medium">Standar infeksi/sepsis: 1.5 – 2.5 g/kg BB.</p>
              </div>

              <label v-if="quadrant === 'Dewasa Sakit'" class="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-xl cursor-pointer hover:bg-red-100/60 transition-colors">
                <input type="checkbox" v-model="isParenteral" class="rounded text-red-500 focus:ring-red-400 w-4 h-4" />
                <span class="text-sm font-bold text-red-800">Nutrisi Parenteral Penuh (Abaikan SDA 10%)</span>
              </label>
            </template>
          </div>
        </div>

        <div class="bg-[#f8faf6] border border-[#bcdd5a]/40 rounded-2xl p-5">
          <div class="flex items-center gap-2 mb-2">
            <ion-icon name="flask-outline" class="text-[#4a6825] text-lg"></ion-icon>
            <span class="text-xs font-extrabold text-[#4a6825] uppercase tracking-widest">Formula Aktif</span>
          </div>
          <p class="text-sm font-bold text-[#16200B]">{{ activeFormula }}</p>
          <p class="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{{ activeFormulaDesc }}</p>
        </div>
      </div>

      <div class="lg:col-span-7">

        <div
          v-if="!results"
          class="h-full min-h-96 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 p-10 text-center"
        >
          <div class="w-20 h-20 bg-white rounded-full border border-gray-200 flex items-center justify-center mb-4">
            <ion-icon name="calculator-outline" class="text-4xl text-gray-300"></ion-icon>
          </div>
          <p class="text-base font-bold text-gray-500 mb-1">Lengkapi Data Terlebih Dahulu</p>
          <p class="text-sm text-gray-400">Isi Usia, Berat, dan Tinggi Badan untuk<br/>mengaktifkan persamaan kalkulasi gizi.</p>
        </div>

        <div v-else class="space-y-4">

          <div class="bg-white border-l-4 border-l-blue-500 border border-gray-100 rounded-2xl shadow-sm p-5">
            <h4 class="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">{{ results.anthropometry.title }}</h4>
            <div class="bg-[#16200B] text-[#bcdd5a] font-mono p-3.5 rounded-xl text-xs mb-3 overflow-x-auto leading-relaxed">
              {{ results.anthropometry.formula }}
            </div>
            <p class="text-base font-extrabold text-[#16200B] leading-relaxed">{{ results.anthropometry.value }}</p>
          </div>

          <div class="bg-white border-l-4 border-l-indigo-500 border border-gray-100 rounded-2xl shadow-sm p-5">
            <h4 class="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">{{ results.bmr.title }}</h4>
            <div class="bg-[#16200B] text-[#bcdd5a] font-mono p-3.5 rounded-xl text-xs mb-3 overflow-x-auto leading-relaxed">
              {{ results.bmr.formula }}
            </div>
            <p class="text-2xl font-black text-indigo-700">{{ results.bmr.value }}</p>
          </div>

          <div class="bg-gradient-to-br from-[#4a6825] to-[#2d4016] text-white rounded-2xl shadow-md p-6 relative overflow-hidden">
            <h4 class="text-xs font-extrabold text-[#bcdd5a] uppercase tracking-widest mb-3">{{ results.tee.title }}</h4>
            <div class="bg-[#16200B]/50 text-[#bcdd5a] font-mono p-3.5 rounded-xl text-xs mb-4 overflow-x-auto border border-white/10 leading-relaxed">
              {{ results.tee.formula }}
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-5xl font-black">{{ results.tee.value.split(' ')[0] }}</span>
              <span class="text-lg text-white/60 font-medium">kkal / hari</span>
            </div>
            <div class="absolute -bottom-6 -right-6 opacity-[0.04] pointer-events-none">
              <ion-icon name="flash" class="text-[10rem] text-white"></ion-icon>
            </div>
          </div>

          <div class="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h4 class="text-sm font-bold text-[#16200B] mb-4 border-b border-gray-100 pb-3">Distribusi Makronutrien</h4>
            <div class="grid grid-cols-3 gap-4">

              <div class="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-center">
                <div class="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest mb-1">Karbohidrat</div>
                <div class="text-[10px] font-bold text-orange-400 mb-2">{{ results.macros.carbs.p }}%</div>
                <div class="text-2xl font-black text-orange-700">{{ results.macros.carbs.gram.toFixed(1) }}<span class="text-xs font-bold text-orange-300 ml-0.5">g</span></div>
                <div class="text-[10px] text-orange-400 mt-1 font-medium">{{ Math.round(results.macros.carbs.kkal) }} kkal</div>
                <div v-if="results.macros.carbs.note" class="text-[9px] text-orange-400 mt-0.5 font-semibold opacity-75">{{ results.macros.carbs.note }}</div>
              </div>

              <div class="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-center relative overflow-hidden">
                <div v-if="quadrant.includes('Sakit')" class="absolute top-0 right-0 bg-rose-600 text-white text-[8px] px-1.5 py-0.5 rounded-bl-lg font-extrabold tracking-wide">TKTP</div>
                <div class="text-[10px] font-extrabold text-rose-500 uppercase tracking-widest mb-1">Protein</div>
                <div class="text-[10px] font-bold text-rose-400 mb-2">{{ results.macros.protein.p }}%</div>
                <div class="text-2xl font-black text-rose-700">{{ results.macros.protein.gram.toFixed(1) }}<span class="text-xs font-bold text-rose-300 ml-0.5">g</span></div>
                <div class="text-[10px] text-rose-400 mt-1 font-medium">{{ Math.round(results.macros.protein.kkal) }} kkal</div>
                <div v-if="results.macros.protein.note" class="text-[9px] text-rose-400 mt-0.5 font-semibold opacity-75">{{ results.macros.protein.note }}</div>
              </div>

              <div class="bg-amber-50 border border-amber-100 p-4 rounded-2xl text-center">
                <div class="text-[10px] font-extrabold text-amber-500 uppercase tracking-widest mb-1">Lemak</div>
                <div class="text-[10px] font-bold text-amber-400 mb-2">{{ results.macros.fat.p }}%</div>
                <div class="text-2xl font-black text-amber-700">{{ results.macros.fat.gram.toFixed(1) }}<span class="text-xs font-bold text-amber-300 ml-0.5">g</span></div>
                <div class="text-[10px] text-amber-400 mt-1 font-medium">{{ Math.round(results.macros.fat.kkal) }} kkal</div>
                <div v-if="results.macros.fat.note" class="text-[9px] text-amber-400 mt-0.5 font-semibold opacity-75">{{ results.macros.fat.note }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-[#16200B] text-gray-400 p-6 rounded-2xl mb-6">
      <div class="flex items-center gap-2 mb-4">
        <ion-icon name="book-outline" class="text-[#bcdd5a] text-xl"></ion-icon>
        <h3 class="text-white font-bold text-sm">Daftar Pustaka & Referensi Metodologi</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1.5">
        <p
          v-for="(ref, idx) in REFERENCES"
          :key="idx"
          class="text-[11px] font-medium truncate hover:text-white hover:whitespace-normal transition-all cursor-default"
          :title="ref"
        >
          {{ ref }}
        </p>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// ─── Constants ────────────────────────────────────────────────────────────────
const QUADRANTS = ['Dewasa Sehat', 'Dewasa Sakit', 'Anak Sehat', 'Anak Sakit']

const REFERENCES = [
  "1. Dietary energy | Eat For Health, diakses Maret 2026",
  "2. Kepmenkes RI No. HK.01.07/MENKES/393/2019 – Pedoman Nasional Pelayanan Kedokteran",
  "3. Pedoman Asuhan Gizi Terstandar 2014 | PDF – Scribd",
  "4. Pedoman PAGT – Poltekkes TNI AU Adisutjipto",
  "5. Pedoman PGRS (Pelayanan Gizi Rumah Sakit)",
  "6. BAB II – Proses Asuhan Gizi Terstandar (PAGT)",
  "7. Perhitungan Kebutuhan Gizi Individu – Univ. Muhammadiyah Semarang",
  "8. Memahami Specific Dynamic Action (SDA) – Kesehatan Holistik",
  "9. Mifflin-St Jeor Equation – Medscape Reference",
  "10. Harris-Benedict Equation – Wikipedia",
  "11. Basal Energy Expenditure: Harris-Benedict Equation",
  "12. Energy Calculations – Kementerian Kesihatan Malaysia",
  "13. Menghitung Kebutuhan Gizi | PDF – Scribd",
  "14. Rumus Kebutuhan Gizi Pasien Anak | PDF – Scribd",
  "15. Basal & Total Metabolic Rate – Mifflin St. Jeor Equations",
  "16. Cara Menghitung Kebutuhan Kalori Harian – Hello Sehat",
]

// ─── Inputs ─────────────────────────────────────────────────────────────────
const quadrant = ref('Dewasa Sehat')
const age = ref<number | ''>('')
const ageUnit = ref('tahun')
const gender = ref('L')
const weight = ref<number | ''>('')
const height = ref<number | ''>('')
const activity = ref(1.55)
const stress = ref(1.0)
const isParenteral = ref(false)
const proteinPerKg = ref(1.5)

// ─── Set quadrant and reset defaults ────────────────────────────────────────
const setQuadrant = (q: string) => {
  quadrant.value = q
  if (q === 'Dewasa Sehat') { activity.value = 1.55; stress.value = 1.0 }
  if (q === 'Dewasa Sakit') { activity.value = 1.2; stress.value = 1.5; proteinPerKg.value = 1.5 }
  if (q === 'Anak Sehat')  { activity.value = 1.4; stress.value = 1.0; ageUnit.value = 'tahun' }
  if (q === 'Anak Sakit')  { activity.value = 1.0; stress.value = 1.3; proteinPerKg.value = 1.5 }
}

// ─── Computed formula labels ─────────────────────────────────────────────────
const activeFormula = computed(() => {
  if (quadrant.value === 'Dewasa Sehat') return 'Mifflin-St Jeor (1990)'
  if (quadrant.value === 'Dewasa Sakit') return 'Harris-Benedict – Roza-Shizgal (1984)'
  if (quadrant.value === 'Anak Sehat')  return 'Schofield / WHO (2004)'
  return 'Holliday-Segar (1957) – Rumatan'
})
const activeFormulaDesc = computed(() => {
  if (quadrant.value === 'Dewasa Sehat') return 'Formula BMR paling akurat untuk dewasa sehat (≥18 tahun).'
  if (quadrant.value === 'Dewasa Sakit') return 'Revisi Harris-Benedict; digunakan untuk pasien dewasa dalam kondisi klinis stres patologis.'
  if (quadrant.value === 'Anak Sehat')  return 'Formula WHO yang direkomendasikan untuk BMR anak berdasarkan kelompok usia dan jenis kelamin.'
  return 'Rumus Holliday-Segar untuk energi dan cairan rumatan anak sakit/pasca operasi.'
})

// ─── Results type ─────────────────────────────────────────────────────────────
interface MacroItem { p: number | string; kkal: number; gram: number; note?: string }
interface Results {
  anthropometry: { title: string; formula: string; value: string }
  bmr: { title: string; formula: string; value: string }
  tee: { title: string; formula: string; value: string }
  macros: { carbs: MacroItem; protein: MacroItem; fat: MacroItem }
}

const results = ref<Results | null>(null)

// ─── Core Calculation ────────────────────────────────────────────────────────
const calculate = () => {
  if (age.value === '' || weight.value === '' || height.value === '') {
    results.value = null
    return
  }

  const w = parseFloat(String(weight.value))
  const h = parseFloat(String(height.value))
  const a = parseFloat(String(age.value))
  const ageInYears = ageUnit.value === 'bulan' ? a / 12 : a
  const g = gender.value
  const q = quadrant.value

  const res: Results = {
    anthropometry: { title: '', formula: '', value: '' },
    bmr: { title: '', formula: '', value: '' },
    tee: { title: '', formula: '', value: '' },
    macros: {
      carbs:   { p: 0, kkal: 0, gram: 0 },
      protein: { p: 0, kkal: 0, gram: 0 },
      fat:     { p: 0, kkal: 0, gram: 0 },
    }
  }

  // ── 1. ANTHROPOMETRY ──────────────────────────────────────────────────────
  if (q === 'Dewasa Sehat' || q === 'Dewasa Sakit') {
    const hM = h / 100
    const bmi = w / (hM * hM)
    let status = 'Normal'
    if (bmi < 18.5) status = 'Kurang Berat Badan'
    else if (bmi > 25) status = 'Kelebihan Berat Badan'
    const bbi = (h - 100) - ((h - 100) * 0.1)
    res.anthropometry = {
      title: 'Indeks Massa Tubuh (IMT) & BBI',
      formula: `IMT = ${w} / (${hM.toFixed(2)}²)`,
      value: `IMT: ${bmi.toFixed(2)} kg/m² (${status}) | BBI (Brocca): ${bbi.toFixed(1)} kg`
    }
  } else {
    let bbi = 0
    let formulaStr = ''
    if (ageUnit.value === 'bulan' && a < 12) { 
      bbi = (a / 2) + 4; 
      formulaStr = `(${a} bln / 2) + 4` 
    }
    else { 
      const y = Math.floor(ageInYears);
      bbi = (y * 2) + 8; 
      formulaStr = `(${y} thn × 2) + 8` 
    }
    res.anthropometry = {
      title: 'Berat Badan Ideal (BBI) Anak',
      formula: `BBI = ${formulaStr}`,
      value: `${bbi.toFixed(1)} kg`
    }
  }

  // ── 2. BMR + SDA + TEE ───────────────────────────────────────────────────
  let bmrVal = 0
  let sdaVal = 0
  let teeVal = 0

  if (q === 'Dewasa Sehat') {
    bmrVal = g === 'L'
      ? (10 * w) + (6.25 * h) - (5 * a) + 5
      : (10 * w) + (6.25 * h) - (5 * a) - 161
    const formulaConst = g === 'L' ? '+5' : '-161'
    res.bmr = {
      title: 'BMR (Persamaan Mifflin-St Jeor 1990)',
      formula: `BMR = (10 × ${w}) + (6.25 × ${h}) - (5 × ${a}) ${formulaConst}`,
      value: `${bmrVal.toFixed(1)} kkal`
    }
    sdaVal = bmrVal * 0.10
    teeVal = (bmrVal * activity.value) + sdaVal
    res.tee = {
      title: 'Total Energy Expenditure (TEE)',
      formula: `TEE = (${bmrVal.toFixed(1)} × ${activity.value}) + SDA(${sdaVal.toFixed(1)})`,
      value: `${teeVal.toFixed(1)} kkal/hari`
    }
    res.macros = {
      carbs:   { p: 60, kkal: teeVal * 0.60, gram: (teeVal * 0.60) / 4 },
      protein: { p: 15, kkal: teeVal * 0.15, gram: (teeVal * 0.15) / 4 },
      fat:     { p: 25, kkal: teeVal * 0.25, gram: (teeVal * 0.25) / 9 },
    }
  }
  else if (q === 'Dewasa Sakit') {
    bmrVal = g === 'L'
      ? 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
      : 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a)
    const baseConst = g === 'L' ? '88.362' : '447.593'
    res.bmr = {
      title: 'BMR (Harris-Benedict Revisi Roza-Shizgal 1984)',
      formula: `BMR = ${baseConst} + (13.397 × ${w}) + (4.799 × ${h}) - (5.677 × ${a})`,
      value: `${bmrVal.toFixed(1)} kkal`
    }
    sdaVal = isParenteral.value ? 0 : (bmrVal * 0.10)
    teeVal = (bmrVal * activity.value * stress.value) + sdaVal
    res.tee = {
      title: 'Total Energy Expenditure (TEE) Klinis',
      formula: `TEE = (${bmrVal.toFixed(1)} × ${activity.value} × ${stress.value}) + SDA(${sdaVal.toFixed(1)})`,
      value: `${teeVal.toFixed(1)} kkal/hari`
    }
    const pGram = w * proteinPerKg.value
    const pKkal = pGram * 4
    const sisa = teeVal - pKkal
    const cKkal = sisa * 0.70; const fKkal = sisa * 0.30
    res.macros = {
      protein: { p: ((pKkal / teeVal) * 100).toFixed(1), kkal: pKkal, gram: pGram, note: `${proteinPerKg.value}g/kg BB` },
      carbs:   { p: ((cKkal / teeVal) * 100).toFixed(1), kkal: cKkal, gram: cKkal / 4, note: 'Sisa Energi' },
      fat:     { p: ((fKkal / teeVal) * 100).toFixed(1), kkal: fKkal, gram: fKkal / 9, note: 'Sisa Energi' },
    }
  }
  else if (q === 'Anak Sehat') {
    if (ageInYears <= 3) {
      bmrVal = g === 'L' ? (60.9 * w) - 54 : (61.0 * w) - 51
      res.bmr.formula = g === 'L' ? `BMR = (60.9 × ${w}) - 54` : `BMR = (61.0 × ${w}) - 51`
    } else if (ageInYears <= 10) {
      bmrVal = g === 'L' ? (22.7 * w) + 495 : (22.5 * w) + 499
      res.bmr.formula = g === 'L' ? `BMR = (22.7 × ${w}) + 495` : `BMR = (22.5 × ${w}) + 499`
    } else {
      bmrVal = g === 'L' ? (17.5 * w) + 651 : (12.2 * w) + 746
      res.bmr.formula = g === 'L' ? `BMR = (17.5 × ${w}) + 651` : `BMR = (12.2 × ${w}) + 746`
    }
    res.bmr.title = 'BMR (Persamaan Schofield / WHO)'
    res.bmr.value = `${bmrVal.toFixed(1)} kkal`
    sdaVal = bmrVal * 0.10
    teeVal = (bmrVal * activity.value) + sdaVal
    res.tee = {
      title: 'Total Energy Expenditure (TEE)',
      formula: `TEE = (${bmrVal.toFixed(1)} × ${activity.value}) + SDA(${sdaVal.toFixed(1)})`,
      value: `${teeVal.toFixed(1)} kkal/hari`
    }
    res.macros = {
      carbs:   { p: 55, kkal: teeVal * 0.55, gram: (teeVal * 0.55) / 4 },
      protein: { p: 15, kkal: teeVal * 0.15, gram: (teeVal * 0.15) / 4 },
      fat:     { p: 30, kkal: teeVal * 0.30, gram: (teeVal * 0.30) / 9 },
    }
  }
  else {
    let formulaStr = ''
    if (w <= 10) { bmrVal = w * 100; formulaStr = `${w}kg × 100` }
    else if (w <= 20) { bmrVal = 1000 + ((w - 10) * 50); formulaStr = `1000 + (${w}-10)kg × 50` }
    else { bmrVal = 1500 + ((w - 20) * 20); formulaStr = `1500 + (${w}-20)kg × 20` }
    res.bmr = {
      title: 'Energi Rumatan (Holliday-Segar 1957)',
      formula: `Rumatan = ${formulaStr}`,
      value: `${bmrVal.toFixed(1)} kkal  (≈ ${bmrVal.toFixed(1)} ml Cairan/hari)`
    }
    teeVal = bmrVal * stress.value
    res.tee = {
      title: 'Total Energy Klinis (TEE)',
      formula: `TEE = ${bmrVal.toFixed(1)} × Faktor Stres (${stress.value})`,
      value: `${teeVal.toFixed(1)} kkal/hari`
    }
    const pGram = w * proteinPerKg.value
    const pKkal = pGram * 4
    const sisa = teeVal - pKkal
    const cKkal = sisa * 0.65; const fKkal = sisa * 0.35
    res.macros = {
      protein: { p: ((pKkal / teeVal) * 100).toFixed(1), kkal: pKkal, gram: pGram, note: `${proteinPerKg.value}g/kg BB` },
      carbs:   { p: ((cKkal / teeVal) * 100).toFixed(1), kkal: cKkal, gram: cKkal / 4, note: 'Sisa Energi' },
      fat:     { p: ((fKkal / teeVal) * 100).toFixed(1), kkal: fKkal, gram: fKkal / 9, note: 'Sisa Energi' },
    }
  }

  results.value = res
}

// ─── Auto recalculate ────────────────────────────────────────────────────────
watch([quadrant, age, ageUnit, gender, weight, height, activity, stress, isParenteral, proteinPerKg], calculate, { immediate: true })
</script>

<style scoped>
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
input[type=number] { -moz-appearance: textfield; appearance: textfield; }
</style>