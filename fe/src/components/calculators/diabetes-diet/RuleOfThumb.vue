<template>
  <div class="font-sans text-slate-800 space-y-6">
    
    <!-- Header Area Inside Component (Optional, keeping consistent with React) -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
      <div class="flex flex-col md:flex-row items-center gap-4">
        <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200">
           <ion-icon name="calculator" class="text-3xl"></ion-icon>
        </div>
        <div class="text-center md:text-left">
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900">Kalkulator Medis DM PERKENI</h1>
          <p class="text-slate-500 mt-1">Berdasarkan Pedoman Pengelolaan dan Pencegahan DMT2 Dewasa 2024</p>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="flex space-x-2 bg-slate-200/50 p-1 rounded-xl w-full md:w-max">
      <button
        @click="activeTab = 'kalori'"
        :class="[
          'flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all',
          activeTab === 'kalori' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <ion-icon name="restaurant" class="text-lg"></ion-icon>
        Kebutuhan Kalori & IMT
      </button>
      <button
        @click="activeTab = 'fib4'"
        :class="[
          'flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all',
          activeTab === 'fib4' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
        ]"
      >
        <ion-icon name="pulse" class="text-lg"></ion-icon>
        Skrining FIB-4
      </button>
    </div>

    <!-- CONTENT TABS -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      
      <!-- TAB 1: KALORI & IMT -->
      <div v-if="activeTab === 'kalori'" class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <!-- Form Section -->
        <div class="lg:col-span-5 p-6 md:p-8 space-y-6 bg-white">
          <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ion-icon name="scale" class="text-blue-500 text-xl"></ion-icon> Parameter Pasien
          </h2>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Jenis Kelamin</label>
              <select 
                v-model="gender"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              >
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Umur (Tahun)</label>
              <input 
                type="number" v-model="age" min="1"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Tinggi Badan (cm)</label>
              <input 
                type="number" v-model="height" min="1"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Berat Badan (kg)</label>
              <input 
                type="number" v-model="weight" min="1"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Tingkat Aktivitas Fisik</label>
            <select 
              v-model="activity"
              class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option :value="0.1">Istirahat (+10%)</option>
              <option :value="0.2">Ringan (+20%)</option>
              <option :value="0.3">Sedang (+30%)</option>
              <option :value="0.4">Berat (+40%)</option>
              <option :value="0.5">Sangat Berat (+50%)</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Kondisi Stres Metabolik</label>
            <select 
              v-model="stress"
              class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option :value="0">Tidak Ada (0%)</option>
              <option :value="0.1">Ringan (Sepsis/Operasi ringan) (+10%)</option>
              <option :value="0.2">Sedang (+20%)</option>
              <option :value="0.3">Berat (Trauma berat) (+30%)</option>
            </select>
          </div>
          
          <button
            @click="saveCalculationHistory"
            :disabled="!nutritionResults"
            class="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-all shadow-md mt-4"
          >
            <ion-icon name="save" class="align-middle mr-2"></ion-icon>
            Simpan Hasil
          </button>
        </div>

        <!-- Results Section -->
        <div class="lg:col-span-7 bg-slate-50/50 p-6 md:p-8">
          <div v-if="nutritionResults" class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <!-- IMT Card -->
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p class="text-sm font-medium text-slate-500 mb-1">IMT (Kriteria Asia-Pasifik)</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-black text-slate-800">{{ nutritionResults.imt }}</span>
                  <span class="text-sm text-slate-500">kg/m²</span>
                </div>
                <span :class="['inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100', nutritionResults.imtColor]">
                  {{ nutritionResults.imtKategori }}
                </span>
              </div>
              
              <!-- BBI Card -->
              <div class="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                <p class="text-sm font-medium text-slate-500 mb-1">Berat Badan Ideal (BBI)</p>
                <div class="flex items-baseline gap-2">
                  <span class="text-3xl font-black text-slate-800">{{ nutritionResults.bbi }}</span>
                  <span class="text-sm text-slate-500">kg</span>
                </div>
                <span class="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                  Status BB: {{ nutritionResults.bbStatusTxt }}
                </span>
              </div>
            </div>

            <!-- Total Calories Card -->
            <div class="bg-blue-600 p-6 md:p-8 rounded-2xl shadow-md text-white relative overflow-hidden">
              <div class="absolute top-0 right-0 -mt-4 -mr-4 opacity-10">
                 <ion-icon name="restaurant" class="text-[120px]"></ion-icon>
              </div>
              <div class="relative z-10">
                <p class="text-blue-100 font-medium">Total Kebutuhan Kalori Harian</p>
                <div class="mt-2 flex items-baseline gap-2">
                  <span class="text-5xl font-black tracking-tight">{{ nutritionResults.total.toLocaleString('id-ID') }}</span>
                  <span class="text-lg text-blue-200 font-medium">kkal/hari</span>
                </div>
                <p class="mt-4 text-sm text-blue-100/80 flex items-center gap-1">
                   <ion-icon name="information-circle"></ion-icon> Berdasarkan modifikasi umur, aktivitas, BB, & stres.
                </p>
              </div>
            </div>

            <!-- Meal Distribution -->
            <div>
              <h3 class="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider">Anjuran Distribusi Makanan</h3>
              <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div class="grid grid-cols-4 text-center divide-x divide-slate-100">
                  <div class="p-4">
                    <p class="text-xs font-semibold text-slate-500 mb-1">PAGI (20%)</p>
                    <p class="text-lg font-bold text-slate-800">{{ nutritionResults.distribusi.pagi }} <span class="text-xs font-normal text-slate-500">kkal</span></p>
                  </div>
                  <div class="p-4">
                    <p class="text-xs font-semibold text-slate-500 mb-1">SIANG (30%)</p>
                    <p class="text-lg font-bold text-slate-800">{{ nutritionResults.distribusi.siang }} <span class="text-xs font-normal text-slate-500">kkal</span></p>
                  </div>
                  <div class="p-4">
                    <p class="text-xs font-semibold text-slate-500 mb-1">MALAM (25%)</p>
                    <p class="text-lg font-bold text-slate-800">{{ nutritionResults.distribusi.malam }} <span class="text-xs font-normal text-slate-500">kkal</span></p>
                  </div>
                  <div class="p-4 bg-slate-50">
                    <p class="text-xs font-semibold text-slate-500 mb-1">SNACK (25%)</p>
                    <p class="text-lg font-bold text-slate-800">{{ nutritionResults.distribusi.snack }} <span class="text-xs font-normal text-slate-500">kkal</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div v-else class="h-full flex items-center justify-center">
            <p class="text-slate-400">Masukkan data untuk melihat hasil.</p>
          </div>
        </div>
      </div>

      <!-- TAB 2: FIB-4 SCREENING -->
      <div v-if="activeTab === 'fib4'" class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        <!-- Form Section -->
        <div class="lg:col-span-5 p-6 md:p-8 space-y-6 bg-white">
          <div>
            <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2">
               <ion-icon name="pulse" class="text-red-500 text-xl"></ion-icon> Parameter Laboratorium
            </h2>
            <p class="text-xs text-slate-500 mt-1 leading-relaxed">
              Evaluasi komorbiditas Metabolic dysfunction-associated Steatotic Liver Disease (MASLD) sesuai Pedoman Bab 5.2.7
            </p>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Usia (Tahun)</label>
              <input 
                type="number" v-model="fibAge" min="1"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">AST / SGOT (U/L)</label>
                <input 
                  type="number" v-model="fibAst" min="1"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700">ALT / SGPT (U/L)</label>
                <input 
                  type="number" v-model="fibAlt" min="1"
                  class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Trombosit (10⁹/L atau ribu/µL)</label>
              <input 
                type="number" v-model="fibPlt" min="1"
                class="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <!-- Results Section -->
        <div class="lg:col-span-7 bg-slate-50/50 p-6 md:p-8 flex flex-col justify-center">
          <div v-if="fib4Result" class="space-y-6 max-w-md mx-auto w-full">
            <div class="text-center">
              <p class="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Nilai Indeks FIB-4</p>
              <div class="text-6xl font-black text-slate-800 tracking-tighter">
                {{ fib4Result.value }}
              </div>
            </div>

            <div :class="['p-4 rounded-xl border flex items-start gap-3', fib4Result.color]">
               <ion-icon name="alert-circle" class="shrink-0 mt-0.5 text-xl"></ion-icon>
              <div>
                <p class="font-bold text-sm">{{ fib4Result.risk }}</p>
                <p class="text-xs mt-1 opacity-90">
                  {{ 
                    Number(fib4Result.value) < 1.3 
                      ? "Pasien kemungkinan tidak memiliki fibrosis hati lanjut." 
                      : Number(fib4Result.value) <= 2.67 
                      ? "Risiko tidak dapat dipastikan. Penilaian lebih lanjut seperti elastografi mungkin diperlukan." 
                      : "Indikasi kuat fibrosis hati yang signifikan. Dirujuk ke ahli hepatologi/gastroenterologi dianjurkan." 
                  }}
                </p>
              </div>
            </div>
            
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-xs text-slate-500 leading-relaxed">
              <span class="font-bold text-slate-700">Catatan Pedoman:</span> Penyandang DMT2 atau prediabetes dengan obesitas atau faktor risiko kardiometabolik harus dilakukan stratifikasi risiko untuk MASLD atau fibrosis menggunakan indeks fibrosis-4, walaupun hasil pemeriksaan enzim hati normal.
            </div>
          </div>
          <div v-else class="text-center">
            <p class="text-slate-400">Masukkan semua parameter untuk melihat skor FIB-4.</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const activeTab = ref('kalori')

// State for Kalori Calculator
const gender = ref<'L'|'P'>('L')
const age = ref(45)
const height = ref(165)
const weight = ref(65)
const activity = ref(0.2) // Default: Ringan
const stress = ref(0)

// State for FIB-4
const fibAge = ref(45)
const fibAst = ref(30)
const fibAlt = ref(35)
const fibPlt = ref(250)

const { saveCalculation } = useCalculationHistory()

// LOGIC UNTUK KALKULATOR KALORI & IMT
const nutritionResults = computed(() => {
  if (!height.value || !weight.value || !age.value) return null;

  // 1. IMT (Indeks Massa Tubuh)
  const heightInMeter = height.value / 100;
  const imt = weight.value / (heightInMeter * heightInMeter);
  let imtKategori = '';
  let imtColor = 'text-green-600';
  
  if (imt < 18.5) { imtKategori = 'BB kurang'; imtColor = 'text-blue-500'; }
  else if (imt <= 22.9) { imtKategori = 'BB normal'; imtColor = 'text-green-600'; }
  else if (imt <= 24.9) { imtKategori = 'BB lebih (dengan risiko)'; imtColor = 'text-yellow-600'; }
  else if (imt <= 29.9) { imtKategori = 'Obese I'; imtColor = 'text-orange-500'; }
  else { imtKategori = 'Obese II'; imtColor = 'text-red-600'; }

  // 2. Berat Badan Ideal (BBI) - Rumus Broca Modifikasi
  let bbi = 0;
  if ((gender.value === 'L' && height.value < 160) || (gender.value === 'P' && height.value < 150)) {
    bbi = height.value - 100;
  } else {
    bbi = (height.value - 100) * 0.9;
  }

  // Status BB (berdasarkan BBI +/- 10%)
  let bbStatusFactor = 0;
  let bbStatusTxt = 'Normal';
  const bbiMin = bbi * 0.9;
  const bbiMax = bbi * 1.1;

  if (weight.value < bbiMin) {
    bbStatusFactor = 0.20; // Ditambah 20%
    bbStatusTxt = 'Kurus';
  } else if (weight.value > bbiMax) {
    bbStatusFactor = -0.20; // Dikurangi 20%
    bbStatusTxt = 'Gemuk';
  }

  // 3. Kebutuhan Kalori Basal
  const basal = gender.value === 'L' ? bbi * 30 : bbi * 25;

  // 4. Koreksi Umur
  let ageFactor = 0;
  if (age.value >= 40 && age.value <= 59) ageFactor = -0.05;
  else if (age.value >= 60 && age.value <= 69) ageFactor = -0.10;
  else if (age.value >= 70) ageFactor = -0.20;

  // 5. Total Kalori
  // Rumus aditif: Basal + (Basal * %Aktivitas) + (Basal * %Stres) - (Basal * %Umur) +/- (Basal * %KoreksiBB)
  const totalKalori = basal + (basal * activity.value) + (basal * stress.value) + (basal * ageFactor) + (basal * bbStatusFactor);

  // Distribusi Makanan (Pagi 20%, Siang 30%, Malam 25%, 2-3x Snack 25%)
  const distPagi = totalKalori * 0.20;
  const distSiang = totalKalori * 0.30;
  const distMalam = totalKalori * 0.25;
  const distSnack = totalKalori * 0.25;

  return {
    imt: imt.toFixed(1),
    imtKategori,
    imtColor,
    bbi: bbi.toFixed(1),
    bbStatusTxt,
    basal: Math.round(basal),
    total: Math.round(totalKalori),
    distribusi: {
      pagi: Math.round(distPagi),
      siang: Math.round(distSiang),
      malam: Math.round(distMalam),
      snack: Math.round(distSnack)
    }
  };
});

// LOGIKA FIB-4 INDEX
const fib4Result = computed(() => {
  if (!fibAge.value || !fibAst.value || !fibAlt.value || !fibPlt.value) return null;
  // Formula FIB-4 = (Age * AST) / (Platelets * sqrt(ALT))
  const index = (fibAge.value * fibAst.value) / (fibPlt.value * Math.sqrt(fibAlt.value));
  let risk = '';
  let color = '';

  if (index < 1.3) {
    risk = 'Risiko Rendah (Low Risk)';
    color = 'text-green-600 bg-green-50 border-green-200';
  } else if (index <= 2.67) {
    risk = 'Risiko Sedang (Indeterminate Risk)';
    color = 'text-yellow-700 bg-yellow-50 border-yellow-200';
  } else {
    risk = 'Risiko Tinggi (High Risk) - Evaluasi Lanjut Diperlukan';
    color = 'text-red-700 bg-red-50 border-red-200';
  }

  return { value: index.toFixed(2), risk, color };
});

const saveCalculationHistory = async () => {
  if (!nutritionResults.value) return

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Rule of Thumb (PERKENI 2024)',
    inputs: {
      gender: gender.value,
      age: age.value,
      height_cm: height.value,
      weight_kg: weight.value,
      activity_factor: activity.value,
      stress_factor: stress.value
    },
    results: {
      imt: nutritionResults.value.imt,
      imt_kategori: nutritionResults.value.imtKategori,
      bbi: nutritionResults.value.bbi,
      total_kalori: nutritionResults.value.total.toString(),
      distribusi_makan: nutritionResults.value.distribusi
    }
  })
}
</script>
