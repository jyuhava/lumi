<template>
  <AdminLayout>
    <div class="flex flex-col h-full space-y-6">
      <!-- Header Section with Search -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <!-- Background Decoration -->
        <div class="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-gradient-to-br from-[#bcdd5a]/20 to-[#4a6825]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="relative z-10">
          <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight">Kalkulator Klinis Eksekutif</h2>
          <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed">
            Pusat instrumen perhitungan medis terpadu. Pilih modul asesmen gizi, kalkulasi persentase kebutuhan cairan, hingga protokol diet spesifik pasien.
          </p>
        </div>

        <div class="relative z-10 w-full md:w-96">
          <div class="relative flex items-center">
            <ion-icon name="search-outline" class="absolute left-4 text-gray-400 text-lg"></ion-icon>
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Cari modul kalkulator..." 
              class="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] focus:bg-white transition-all shadow-inner text-gray-800 font-medium placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <!-- Main Content Split -->
      <div class="flex flex-col lg:flex-row gap-8 items-start pb-8">
        
        <!-- Category Sidebar (In-page) -->
        <div class="w-full lg:w-64 flex-shrink-0 bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
          <h3 class="text-xs font-extrabold text-gray-400 uppercase tracking-widest px-4 mb-3">Kategori Modul</h3>
          <nav class="space-y-1">
            <button 
              v-for="cat in categories" 
              :key="cat.id"
              @click="activeCategory = cat.id"
              class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 text-left"
              :class="activeCategory === cat.id ? 'bg-[#4a6825] text-white shadow-md shadow-[#4a6825]/20' : 'text-gray-600 hover:bg-[#f8faf6] hover:text-[#4a6825]'"
            >
              <span class="flex items-center text-lg transition-colors" :class="activeCategory === cat.id ? 'text-[#bcdd5a]' : 'text-gray-400'">
                <ion-icon :name="cat.icon"></ion-icon>
              </span>
              {{ cat.name }}
              <span 
                v-if="cat.id === 'all'" 
                class="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                :class="activeCategory === cat.id ? 'bg-[#2d4016] text-[#bcdd5a]' : 'bg-gray-100 text-gray-500'"
              >
                {{ calculators.length }}
              </span>
            </button>
          </nav>
        </div>

        <!-- Calculator List Area -->
        <div class="flex-1 w-full min-w-0">
          <transition-group 
            name="list" 
            tag="div" 
            class="grid grid-cols-1 xl:grid-cols-2 gap-5"
          >
            <div 
              v-for="calc in filteredCalculators" 
              :key="calc.path"
              class="group"
            >
              <router-link
                :to="calc.path"
                class="flex items-start gap-5 p-5 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-[#739b1a]/50 transition-all duration-300 h-full relative overflow-hidden"
              >
                <!-- Selection Indicator Line -->
                <div class="absolute left-0 top-0 bottom-0 w-1.5 bg-[#bcdd5a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>

                <!-- Icon Box -->
                <div class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" :class="calc.colorClass">
                  <ion-icon :name="calc.icon" class="text-2xl"></ion-icon>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <h3 class="font-extrabold text-[15px] text-[#16200B] truncate pr-4 group-hover:text-[#4a6825] transition-colors">
                      {{ calc.title }}
                    </h3>
                    <ion-icon name="arrow-forward" class="text-gray-300 group-hover:text-[#739b1a] transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"></ion-icon>
                  </div>
                  <p class="text-[13px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-3">
                    {{ calc.description }}
                  </p>
                  
                  <div class="flex items-center gap-2">
                    <span class="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-[10px] font-extrabold text-gray-500 uppercase tracking-wider border border-gray-100">
                      {{ getCategoryName(calc.categoryId) }}
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </transition-group>

          <!-- Empty State -->
          <div v-if="filteredCalculators.length === 0" class="bg-white border text-center border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center">
            <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
               <ion-icon name="search-outline" class="text-4xl text-gray-300"></ion-icon>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-1">Modul tidak ditemukan</h3>
            <p class="text-sm text-gray-500">Gunakan kata kunci lain atau pilih kategori yang berbeda.</p>
            <button @click="resetFilters" class="mt-6 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold text-sm rounded-lg hover:bg-gray-50 hover:text-[#4a6825] transition-colors">
              Reset Pencarian
            </button>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Search and Filter State
const searchQuery = ref('')
const activeCategory = ref('all')

// Data Definitions
const categories = [
  { id: 'all', name: 'Semua Modul', icon: 'grid-outline' },
  { id: 'assessment', name: 'Penilaian Dasar', icon: 'clipboard-outline' },
  { id: 'nutrition', name: 'Kebutuhan Nutrisi', icon: 'restaurant-outline' },
  { id: 'pediatric', name: 'Gizi Pediatrik', icon: 'happy-outline' },
  { id: 'diet', name: 'Terapi Diet Khusus', icon: 'medical-outline' },
]

const calculators = [
  {
    title: 'Penilaian Status Gizi',
    description: 'Evaluasi klinis komprehensif berbasis Indeks Massa Tubuh (IMT) dan parameter Lingkar Lengan Atas (LILA).',
    path: '/calculator/nutritional-status',
    icon: 'body',
    categoryId: 'assessment',
    colorClass: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  },
  {
    title: 'Gizi Ibu Hamil & Menyusui',
    description: 'Kalkulasi energi BMR dan tambahan kebutuhan gizi makro berdasarkan fase kehamilan/laktasi (AKG 2019).',
    path: '/calculator/maternal-nutrition',
    icon: 'woman',
    categoryId: 'pediatric',
    colorClass: 'bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-100'
  },
  {
    title: 'Berat Badan Ideal (IBW)',
    description: 'Estimasi Ideal Body Weight standar menggunakan formula klinis Broca, Devine, dan Robinson.',
    path: '/calculator/ibw',
    icon: 'scale',
    categoryId: 'assessment',
    colorClass: 'bg-teal-50 text-teal-600 border border-teal-100'
  },
  {
    title: 'Kebutuhan Gizi & Kalori',
    description: 'Kalkulasi presisi estimasi energi dasar (BMR) dan rasio kebutuhan makronutrien harian pasien.',
    path: '/calculator/nutrition',
    icon: 'nutrition',
    categoryId: 'nutrition',
    colorClass: 'bg-[#f8faf6] text-[#4a6825] border border-[#bcdd5a]/40'
  },
  {
    title: 'Resusitasi Cairan',
    description: 'Perhitungan empiris kebutuhan cairan pemeliharaan & protokol rehidrasi luka bakar baku.',
    path: '/calculator/fluid',
    icon: 'water',
    categoryId: 'nutrition',
    colorClass: 'bg-cyan-50 text-cyan-600 border border-cyan-100'
  },
  {
    title: 'Nutrisi Pediatrik',
    description: 'Perhitungan spesifik kebutuhan gizi neonatus dan anak mengacu pada tabel regulasi RDA/Permenkes.',
    path: '/calculator/child-nutrition',
    icon: 'happy',
    categoryId: 'pediatric',
    colorClass: 'bg-indigo-50 text-indigo-600 border border-indigo-100'
  },
  {
    title: 'Skrining Malnutrisi',
    description: 'Modul pengkajian risiko malnutrisi klinis menggunakan tool tervalidasi (MST, STRONGKids, MUST).',
    path: '/calculator/malnutrition',
    icon: 'fitness',
    categoryId: 'pediatric',
    colorClass: 'bg-rose-50 text-rose-600 border border-rose-100'
  },
  {
    title: 'Alokasi Diet DM',
    description: 'Formulasi distribusi porsi diet terstandar untuk Diabetes Melitus Tipe 2 mengacu pada konsensus PERKENI terkini.',
    path: '/calculator/diabetes-diet',
    icon: 'pulse',
    categoryId: 'diet',
    colorClass: 'bg-orange-50 text-orange-600 border border-orange-100'
  },
  {
    title: 'Protokol Diet Hipertensi',
    description: 'Kalkulasi restriksi sodium dan penerapan protokol diet DASH (Dietary Approaches to Stop Hypertension).',
    path: '/calculator/hypertension-diet',
    icon: 'heart',
    categoryId: 'diet',
    colorClass: 'bg-blue-50 text-blue-600 border border-blue-100'
  }
]

// Computed filtering logic
const getCategoryName = (id: string) => {
  return categories.find(c => c.id === id)?.name || 'Lainnya'
}

const filteredCalculators = computed(() => {
  let result = calculators

  // Filter by category
  if (activeCategory.value !== 'all') {
    result = result.filter(c => c.categoryId === activeCategory.value)
  }

  // Filter by search query
  if (searchQuery.value.trim() !== '') {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.title.toLowerCase().includes(query) || 
      c.description.toLowerCase().includes(query)
    )
  }

  return result
})

const resetFilters = () => {
  searchQuery.value = ''
  activeCategory.value = 'all'
}
</script>

<style scoped>
/* List Transitions for Vue */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.list-leave-active {
  position: absolute; /* Allows smooth reflow of remaining items */
}
</style>
