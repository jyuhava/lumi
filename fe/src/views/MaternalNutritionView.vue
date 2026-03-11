<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-[#739b1a] transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="woman" class="text-[#739b1a]"></ion-icon> Kalkulator Gizi Ibu & Anak
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Berdasarkan AKG 2019 & Analisis Gizi Klinis Nasional untuk fase kehamilan dan laktasi.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in-up">
      <!-- Form Input -->
      <div class="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 class="text-lg font-bold text-[#16200B] mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
          <ion-icon name="calculator" class="text-[#4a6825] text-xl"></ion-icon> Parameter Klinis Pasien
        </h3>
        
        <div class="space-y-5">
          <div class="grid grid-cols-2 gap-5">
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Usia (Tahun)</label>
              <input 
                type="number" 
                v-model="formData.age"
                class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-700 mb-1.5">Berat Aktual (kg)</label>
              <input 
                type="number" 
                v-model="formData.weight"
                class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all text-gray-800 font-medium"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5">Tinggi Badan (cm)</label>
            <input 
              type="number" 
              v-model="formData.height"
              class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all text-gray-800 font-medium"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <ion-icon name="pulse-outline" class="text-[#4a6825]"></ion-icon> Tingkat Aktivitas Fisik
            </label>
            <div class="relative">
              <select 
                v-model="formData.activity"
                class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all text-gray-800 font-medium appearance-none pr-10"
              >
                <option :value="1.2">Sangat Jarang (Bed Rest / Sedenter)</option>
                <option :value="1.375">Ringan (Aktivitas rumah tangga biasa)</option>
                <option :value="1.55">Sedang (Olahraga 3-5 hari/minggu)</option>
                <option :value="1.725">Berat (Aktivitas fisik intens / atlet)</option>
              </select>
               <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></ion-icon>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1.5 flex items-center gap-1.5">
              <ion-icon name="cafe-outline" class="text-[#4a6825]"></ion-icon> Fase Reporoduksi Saat Ini
            </label>
            <div class="relative">
              <select 
                v-model="formData.phase"
                class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all text-gray-800 font-medium appearance-none pr-10"
              >
                <option value="normal">Fase Normal / Prakonsepsi</option>
                <option value="t1">Hamil Trimester 1 (+180 kkal)</option>
                <option value="t2">Hamil Trimester 2 (+300 kkal)</option>
                <option value="t3">Hamil Trimester 3 (+300 kkal)</option>
                <option value="m1">Periode Menyusui 0-6 Bulan (+330 kkal)</option>
                <option value="m2">Periode Menyusui 7-12 Bulan (+400 kkal)</option>
              </select>
              <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></ion-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Result Display -->
      <div class="space-y-6">
        <!-- Main Energy Requirement Card -->
        <div class="bg-gradient-to-br from-[#4a6825] to-[#2d4016] text-white p-6 md:p-8 rounded-2xl shadow-md relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-[#bcdd5a] text-xs font-extrabold uppercase tracking-widest mb-1.5 opacity-90">Total Kebutuhan Energi Harian</p>
            <div class="flex items-baseline gap-2">
               <h3 class="text-5xl font-black tracking-tight">{{ results.tdee }}</h3>
               <span class="text-lg font-medium opacity-80">kkal/hari</span>
            </div>
            
            <div class="mt-5 inline-block">
               <span class="text-xs font-bold bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/20 text-[#f8faf6] flex items-center gap-2 shadow-inner">
                 <ion-icon :name="results.extraCal > 0 ? 'add-circle' : 'checkmark-circle'" class="text-lg" :class="results.extraCal > 0 ? 'text-[#bcdd5a]' : 'text-emerald-300'"></ion-icon>
                 {{ results.extraCal > 0 ? `Terdapat penambahan +${results.extraCal} kkal untuk fase ${getPhaseName(formData.phase)}` : 'Kebutuhan gizi basal normal (Prakonsepsi)' }}
               </span>
            </div>
          </div>
          <!-- Decorative Background Icon -->
          <div class="absolute -bottom-8 -right-8 p-4 opacity-[0.05] pointer-events-none transform -rotate-12">
             <ion-icon name="woman" class="text-[14rem]"></ion-icon>
          </div>
        </div>

        <!-- Macronutrients Grid -->
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-blue-200 transition-colors">
            <div class="absolute inset-x-0 top-0 h-1 bg-blue-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            <p class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Protein</p>
            <p class="text-2xl font-black text-blue-700">{{ results.protein }}<span class="text-xs font-bold text-blue-400 ml-0.5">g</span></p>
          </div>
          
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-orange-200 transition-colors">
            <div class="absolute inset-x-0 top-0 h-1 bg-orange-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            <p class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Lemak</p>
            <p class="text-2xl font-black text-orange-600">{{ results.fat }}<span class="text-xs font-bold text-orange-300 ml-0.5">g</span></p>
          </div>
          
          <div class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group hover:border-emerald-200 transition-colors">
             <div class="absolute inset-x-0 top-0 h-1 bg-emerald-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform"></div>
            <p class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Karbohidrat</p>
            <p class="text-2xl font-black text-emerald-600">{{ results.carbs }}<span class="text-xs font-bold text-emerald-300 ml-0.5">g</span></p>
          </div>
        </div>

        <!-- Clinical Warning Note -->
        <div class="bg-amber-50/80 border border-amber-200/60 p-5 rounded-2xl flex gap-4 shadow-sm relative overflow-hidden">
          <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-400"></div>
          <ion-icon name="information-circle" class="text-3xl text-amber-500 shrink-0 mt-0.5"></ion-icon>
          <div>
            <h4 class="text-sm font-bold text-amber-900 mb-1">Catatan Klinis</h4>
            <p class="text-xs text-amber-800/90 leading-relaxed font-medium">
              Kalkulasi ini merupakan estimasi rekomendasi populasi (RDA). Kebutuhan aktual individu dapat bervariasi bergantung pada status klinis komorbid, indeks massa tubuh pra-konsepsi, dan defisiensi mikronutrien spesifik (seperti zat besi atau asam folat).
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- References Section -->
    <section class="mt-12 pt-8 border-t border-gray-200 mb-8 animate-fade-in-up" style="animation-delay: 0.1s;">
      <h3 class="text-sm font-extrabold text-gray-800 mb-5 flex items-center gap-2">
         <ion-icon name="book-outline" class="text-[#4a6825] text-lg"></ion-icon> Daftar Pustaka & Referensi Regulasi
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-500 font-medium">
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Permenkes RI No. 28 Tahun 2019 tentang Angka Kecukupan Gizi (AKG) yang dianjurkan untuk masyarakat Indonesia.</span>
          </li>
          <li class="flex items-start gap-2">
            <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Ayo Sehat - Pedoman Klinis Kementerian Kesehatan RI (Fokus 1000 Hari Pertama Kehidupan).</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Status Gizi dan Perilaku Makan Ibu Hamil - Evaluasi Jurnal Klinis Nasional (e-journal UNDIP).</span>
          </li>
        </ul>
        <ul class="space-y-3">
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Analisis Laju Metabolisme Maternal - Dokumen Terlampir dan Komite Medik.</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Panduan Gizi Klinis Ibu Hamil per Trimester - Standar Generasi Maju.</span>
          </li>
          <li class="flex items-start gap-2">
             <ion-icon name="medical" class="text-gray-300 shrink-0 mt-0.5"></ion-icon>
            <span>Tinjauan Medis: Perbedaan Spesifik Kebutuhan Gizi Kehamilan vs Masa Laktasi.</span>
          </li>
        </ul>
      </div>
    </section>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Define the form data structure
interface FormData {
  age: number
  weight: number
  height: number
  activity: number
  phase: string // 'normal' | 't1' | 't2' | 't3' | 'm1' | 'm2'
}

// Define the results structure
interface Results {
  bmr: number
  tdee: number
  extraCal: number
  protein: number
  fat: number
  carbs: number
}

// Reactive state initialization
const formData = reactive<FormData>({
  age: 25,
  weight: 55,
  height: 160,
  activity: 1.2,
  phase: 'normal'
})

const results = reactive<Results>({
  bmr: 0,
  tdee: 0,
  extraCal: 0,
  protein: 0,
  fat: 0,
  carbs: 0
})

// Helper to display readable phase names
const getPhaseName = (phase: string) => {
   const names: Record<string, string> = {
      'normal': 'Prakonsepsi',
      't1': 'Trimester 1',
      't2': 'Trimester 2',
      't3': 'Trimester 3',
      'm1': 'Laktasi (0-6 Bln)',
      'm2': 'Laktasi (7-12 Bln)'
   }
   return names[phase] || 'Prakonsepsi'
}

// Main calculation logic ported from React
const calculateGizi = () => {
  // 1. Calculate BMR (Mifflin-St Jeor for Women)
  // BMR = 10 * weight + 6.25 * height - 5 * age - 161
  const bmr = (10 * formData.weight) + (6.25 * formData.height) - (5 * formData.age) - 161
  
  // 2. Calculate Base TDEE (Total Daily Energy Expenditure)
  const tdeeBase = bmr * formData.activity

  // 3. Additions Based on Phase (AKG 2019)
  let extraCalories = 0
  let extraProtein = 0

  switch (formData.phase) {
    case 't1':
      extraCalories = 180
      extraProtein = 1
      break
    case 't2':
      extraCalories = 300
      extraProtein = 10
      break
    case 't3':
      extraCalories = 300
      extraProtein = 30
      break
    case 'm1': // Lactation 0-6 months
      extraCalories = 330
      extraProtein = 20
      break
    case 'm2': // Lactation 7-12 months
      extraCalories = 400
      extraProtein = 15
      break
    default:
      extraCalories = 0
      extraProtein = 0
  }

  const totalCalories = tdeeBase + extraCalories
  
  // Protein Estimation: 1.1g/kg BW + extra for phase
  const totalProtein = (formData.weight * 1.1) + extraProtein
  
  // Fat Estimation (25% of total calories)
  const totalFat = (totalCalories * 0.25) / 9
  
  // Carbohydrate Estimation (Remaining calories)
  const totalCarbs = (totalCalories - (totalProtein * 4) - (totalFat * 9)) / 4

  // Update reactive results state
  results.bmr = Math.round(bmr)
  results.tdee = Math.round(totalCalories)
  results.extraCal = extraCalories
  results.protein = Math.round(totalProtein)
  results.fat = Math.round(totalFat)
  results.carbs = Math.round(totalCarbs)
}

// Watch for specific deep changes in formData and recalculate automatically
watch(formData, () => {
  calculateGizi()
}, { deep: true })

// Initial calculation on mount
onMounted(() => {
  calculateGizi()
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

/* Base styles for standardizing inputs across browsers to match our enterprise theme */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}
</style>
