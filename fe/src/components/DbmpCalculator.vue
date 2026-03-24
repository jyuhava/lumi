<template>
  <div class="font-sans">
    <main>
      
      <!-- TAB 1: TUKAR MAKANAN -->
      <div v-if="props.activeTab === 'exchange'" class="bg-white rounded-xl">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Kalkulator Penukar Makanan</h2>
        <div class="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 flex items-start gap-3">
          <ion-icon name="information-circle-outline" class="text-xl shrink-0 mt-0.5"></ion-icon>
          <div class="text-sm">
            Pilih golongan makanan. Penukaran hanya dapat dilakukan pada makanan yang berada di dalam <strong>satu golongan yang sama</strong> agar nilai gizinya tetap setara.
          </div>
        </div>

        <!-- Group Selector -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Golongan:</label>
          <select 
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
            v-model="selectedGroupId"
            @change="onGroupChange"
          >
            <option v-for="(group, key) in dbmpData" :key="key" :value="key">{{ group.title }}</option>
          </select>
          <p class="text-xs text-gray-500 mt-2">{{ activeGroup.nutrisi }}</p>
        </div>

        <div class="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          <!-- Source Food -->
          <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <h3 class="font-medium text-gray-700 mb-3">Makanan yang Anda miliki:</h3>
            <select 
              class="w-full p-2 border border-gray-300 rounded mb-4 focus:ring-emerald-500 outline-none"
              v-model="sourceFoodIdx"
              @change="onSourceFoodChange"
            >
              <option v-for="(item, idx) in activeGroup.items" :key="idx" :value="idx">{{ item.nama }}</option>
            </select>
            <div class="flex gap-2 items-center">
              <input 
                type="number" 
                v-model="sourceAmount"
                class="w-24 p-2 border border-gray-300 rounded text-center focus:ring-emerald-500 outline-none"
              />
              <span class="text-gray-600">gram</span>
            </div>
            <p class="text-sm text-gray-500 mt-3">
              (Setara dengan {{ satuanPenukar }} Satuan Penukar)
            </p>
          </div>

          <!-- Icon -->
          <div class="flex justify-center hidden md:flex">
            <div class="bg-emerald-100 p-3 rounded-full text-emerald-600">
              <ion-icon name="swap-horizontal-outline" class="text-2xl"></ion-icon>
            </div>
          </div>
          <div class="flex justify-center md:hidden">
            <ion-icon name="swap-horizontal-outline" class="text-2xl text-gray-400 rotate-90"></ion-icon>
          </div>

          <!-- Target Food -->
          <div class="bg-emerald-50 p-5 rounded-lg border border-emerald-200">
            <h3 class="font-medium text-emerald-800 mb-3">Dapat ditukar dengan:</h3>
            <select 
              class="w-full p-2 border border-emerald-300 rounded mb-4 focus:ring-emerald-500 outline-none"
              v-model="targetFoodIdx"
            >
              <option v-for="(item, idx) in activeGroup.items" :key="idx" :value="idx">{{ item.nama }}</option>
            </select>
            <div class="text-3xl font-bold text-emerald-700 my-2">
              {{ calculatedTargetAmount }} <span class="text-lg font-normal">gram</span>
            </div>
            <p class="text-sm text-emerald-600 mt-1">
              Atau sekitar: <strong>{{ calculatedTargetUrt }}</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- TAB 2: DATABASE -->
      <div v-if="props.activeTab === 'database'" class="bg-white rounded-xl">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">Daftar Bahan Makanan</h2>
          <div class="relative w-64">
            <ion-icon name="search-outline" class="text-xl absolute left-3 top-2 text-gray-400"></ion-icon>
            <input 
              type="text"
              placeholder="Cari makanan..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              v-model="searchTerm"
            />
          </div>
        </div>

        <div class="space-y-8">
          <div v-if="Object.keys(filteredDatabase).length === 0" class="text-center py-10 text-gray-500">Makanan tidak ditemukan.</div>
          
          <div v-for="(group, key) in filteredDatabase" :key="key" class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <h3 class="font-bold text-gray-800">{{ group.title }}</h3>
              <p class="text-xs text-gray-600 mt-1">{{ group.nutrisi }}</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm text-left">
                <thead class="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th class="px-4 py-3">Bahan Makanan</th>
                    <th class="px-4 py-3">Berat (g)</th>
                    <th class="px-4 py-3">URT (Ukuran Rumah Tangga)</th>
                    <th class="px-4 py-3">Ket.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in group.items" :key="idx" class="bg-white border-b last:border-0 hover:bg-gray-50">
                    <td class="px-4 py-3 font-medium text-gray-900">{{ item.nama }}</td>
                    <td class="px-4 py-3">{{ item.berat }}</td>
                    <td class="px-4 py-3">{{ item.urt }}</td>
                    <td class="px-4 py-3 text-red-500">{{ item.ket }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: API / ANALISA BEBAS -->
      <div v-if="props.activeTab === 'api'" class="bg-white rounded-xl">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Analisis Nutrisi Makanan Luar</h2>
        <div class="bg-orange-50 text-orange-800 p-4 rounded-lg mb-6 flex items-start gap-3">
          <ion-icon name="information-circle-outline" class="text-xl shrink-0 mt-0.5"></ion-icon>
          <div class="text-sm">
            Sistem DBMP bersifat kaku (per golongan). Jika Anda memiliki makanan kemasan atau dari aplikasi luar (seperti MyFitnessPal/FatSecret), masukkan nilai makronya di sini untuk mengetahui ini setara dengan berapa <strong>Satuan Penukar</strong>.
          </div>
        </div>

        <div class="grid md:grid-cols-2 gap-8">
          <!-- Source: Search API -->
          <div>
            <h3 class="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <ion-icon name="search-outline" class="text-emerald-600"></ion-icon> Cari di Database Global (Open Food Facts)
            </h3>
            <div class="relative flex gap-2 mb-6">
              <div class="relative flex-1">
                <ion-icon name="search-outline" class="absolute left-3 top-2.5 text-gray-400"></ion-icon>
                <input 
                  type="text" 
                  v-model="apiSearchQuery"
                  @keyup.enter="searchApi"
                  placeholder="Misal: Sari Roti, Indomie, Susu UHT..." 
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  :disabled="isSearching"
                />
              </div>
              <button 
                @click="searchApi" 
                :disabled="isSearching || !apiSearchQuery"
                class="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50 transition min-w-[80px]"
              >
                <ion-icon v-if="isSearching" name="sync" class="animate-spin"></ion-icon>
                <span v-else>Cari</span>
              </button>
            </div>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0" class="mb-6 bg-gray-50 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
              <button 
                v-for="product in searchResults" 
                :key="product.id"
                @click="selectProduct(product)"
                class="w-full text-left px-4 py-3 border-b border-gray-200 last:border-0 hover:bg-emerald-50 transition flex items-center gap-3"
              >
                <img v-if="product.image_front_thumb_url" :src="product.image_front_thumb_url" class="w-10 h-10 object-cover rounded bg-white border border-gray-200" />
                <div v-else class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  <ion-icon name="image-outline"></ion-icon>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-bold text-gray-800 truncate">{{ product.product_name || 'Produk Tanpa Nama' }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ product.brands || 'Tanpa Merk' }}</p>
                </div>
              </button>
            </div>
            <div v-else-if="hasSearched && searchResults.length === 0" class="mb-6 text-center text-sm text-gray-500 py-4 bg-gray-50 rounded-lg border border-gray-200">
              Tidak ada produk yang ditemukan.
            </div>

            <h3 class="font-medium text-gray-700 mb-4 pt-4 border-t border-gray-100">Atau Input Data Gizi Manual:</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 mb-1">Nama Makanan</label>
                <input type="text" v-model="customFoodName" placeholder="Misal: Roti Gandum Merek X" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm bg-gray-50" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1">Porsi / Takaran Saji (g)</label>
                  <input type="number" v-model="customPortion" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1 text-orange-500">Kalori (kcal)</label>
                  <input type="number" v-model="customCalories" class="w-full p-2 border border-orange-200 bg-orange-50 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold text-orange-700" />
                </div>
              </div>
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1">Karbo (g)</label>
                  <input type="number" v-model="customCarbs" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1">Protein (g)</label>
                  <input type="number" v-model="customProtein" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-500 mb-1">Lemak (g)</label>
                  <input type="number" v-model="customFat" class="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
              </div>
              <button class="w-full bg-gray-800 text-white py-2.5 rounded-lg font-bold mt-2 hover:bg-gray-700 transition" @click="analyzeNutrition">
                Analisis Satuan Penukar
              </button>
            </div>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg border border-gray-200 flex flex-col justify-center items-center text-center">
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <ion-icon name="calculator-outline" class="text-3xl text-emerald-600"></ion-icon>
            </div>
            <h4 class="text-gray-800 font-medium">Hasil Analisis DBMP:</h4>
            <div v-if="!showAnalysisResult" class="text-sm text-gray-400 mt-2">
              Masukkan data gizi dan klik analisis untuk melihat hasil penukaran.
            </div>
            <template v-else>
              <p class="text-sm text-gray-500 mt-2 mb-4">
                Berdasarkan proporsi gizi <strong v-if="customFoodName">({{ customFoodName }})</strong>, makanan ini setara dengan:
              </p>
              
              <div class="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 w-full animate-fade-in text-left">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="analysisResult.colorClass">
                     <ion-icon :name="analysisResult.icon" class="text-xl"></ion-icon>
                  </div>
                  <div>
                    <div class="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{{ analysisResult.kategori }}</div>
                    <div class="font-bold text-gray-800 leading-tight">{{ analysisResult.golongan }}</div>
                  </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-3 border border-gray-100 flex items-baseline justify-between">
                  <span class="text-xs font-bold text-gray-500 uppercase">Satuan Penukar</span>
                  <div>
                    <strong class="text-2xl font-black text-emerald-700">{{ analysisResult.satuan }}</strong>
                    <span class="text-xs text-gray-500 ml-1">SP</span>
                  </div>
                </div>
                <p class="text-[10px] text-gray-500 mt-3 leading-relaxed border-t border-gray-100 pt-2">
                  <span class="font-bold text-gray-700">Profil:</span> 
                  {{ customCalories }} kkal, {{ customCarbs }}g Karbo, {{ customProtein }}g Protein, {{ customFat }}g Lemak (per {{ customPortion }}g takaran).
                </p>
              </div>
            </template>
            <p class="text-[10px] text-gray-400 mt-4 italic text-left">*Analisis menggunakan pendekatan kalori dominan dan proporsi makronutrien berdasarkan pedoman DBMP. Data nutrisi didukung oleh Open Food Facts.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// --- DATABASE DBMP ---
const dbmpData: Record<string, any> = {
  karbohidrat: {
    title: 'Golongan 1: Karbohidrat',
    nutrisi: '1 Penukar = 175 Kalori, 4g Protein, 40g Karbohidrat',
    items: [
      { nama: 'Beras', berat: 50, urt: '1/2 gelas', ket: '' },
      { nama: 'Bihun', berat: 50, urt: '1/2 gelas', ket: '' },
      { nama: 'Biskuit', berat: 40, urt: '4 buah besar', ket: 'Na+' },
      { nama: 'Bubur beras', berat: 400, urt: '2 gelas', ket: '' },
      { nama: 'Crackers', berat: 50, urt: '5 buah sedang', ket: '' },
      { nama: 'Jagung segar', berat: 120, urt: '1/2 gelas', ket: 'S++' },
      { nama: 'Kentang', berat: 210, urt: '2 buah sedang', ket: 'K+' },
      { nama: 'Makaroni', berat: 50, urt: '1/2 gelas', ket: 'P' },
      { nama: 'Mi basah', berat: 200, urt: '2 gelas', ket: 'Na+ P-' },
      { nama: 'Mi kering', berat: 50, urt: '1 gelas', ket: 'Na+' },
      { nama: 'Nasi', berat: 100, urt: '3/4 gelas', ket: '' },
      { nama: 'Nasi tim', berat: 200, urt: '1 gelas', ket: '' },
      { nama: 'Roti putih', berat: 70, urt: '3 iris', ket: 'Na+' },
      { nama: 'Singkong', berat: 120, urt: '1,5 potong', ket: 'K+ P- S+' },
      { nama: 'Talas', berat: 125, urt: '1/2 buah sedang', ket: 'S+' },
      { nama: 'Tape singkong', berat: 100, urt: '1 potong sedang', ket: 'S++ Pr+' },
      { nama: 'Tepung beras', berat: 50, urt: '8 sdm', ket: '' },
      { nama: 'Tepung terigu', berat: 50, urt: '5 sdm', ket: '' },
      { nama: 'Tepung hunkwee', berat: 50, urt: '10 sdm', ket: '' },
      { nama: 'Ubi', berat: 135, urt: '1 buah sedang', ket: 'IS++' },
    ]
  },
  proteinHewaniRendahLemak: {
    title: 'Gol. 2A: Protein Hewani (Rendah Lemak)',
    nutrisi: '1 Penukar = 50 Kalori, 7g Protein, 2g Lemak',
    items: [
      { nama: 'Ayam tanpa kulit', berat: 40, urt: '1 potong sedang', ket: 'Fe+' },
      { nama: 'Babat', berat: 40, urt: '1 potong sedang', ket: 'Ko+ Pr*' },
      { nama: 'Daging kerbau', berat: 35, urt: '1 potong sedang', ket: '' },
      { nama: 'Ikan segar', berat: 40, urt: '1/3 ekor sedang', ket: '' },
      { nama: 'Ikan asin', berat: 15, urt: '1 potong kecil', ket: 'Na+' },
      { nama: 'Ikan teri', berat: 15, urt: '1 sdm', ket: '' },
      { nama: 'Kepiting', berat: 50, urt: '1/3 gelas', ket: '' },
      { nama: 'Kerang', berat: 90, urt: '1/2 gelas', ket: 'Na+ Pr+' },
      { nama: 'Udang segar', berat: 35, urt: '5 ekor sedang', ket: 'Ko+' },
      { nama: 'Cumi-cumi', berat: 45, urt: '1 ekor sedang', ket: '' },
      { nama: 'Putih telur ayam', berat: 65, urt: '1,5 butir', ket: '' },
    ]
  },
  proteinHewaniSedangLemak: {
    title: 'Gol. 2B: Protein Hewani (Lemak Sedang)',
    nutrisi: '1 Penukar = 75 Kalori, 7g Protein, 5g Lemak',
    items: [
      { nama: 'Bakso', berat: 170, urt: '10 buah sedang', ket: '' },
      { nama: 'Daging kambing', berat: 40, urt: '1 potong sedang', ket: '' },
      { nama: 'Daging sapi', berat: 35, urt: '1 potong sedang', ket: 'Ko+' },
      { nama: 'Hati ayam', berat: 30, urt: '1 potong sedang', ket: 'Pr+ Fe++' },
      { nama: 'Hati sapi', berat: 35, urt: '1 potong sedang', ket: 'Ko+ Pr+ Fe++' },
      { nama: 'Otak', berat: 60, urt: '1 potong besar', ket: 'Ko+ Pr+' },
      { nama: 'Telur ayam', berat: 55, urt: '1 butir', ket: 'Ko+' },
      { nama: 'Telur bebek', berat: 50, urt: '1 butir', ket: 'Ko+' },
      { nama: 'Usus sapi', berat: 50, urt: '1 potong besar', ket: 'Ko+ Pr+' },
    ]
  },
  proteinNabati: {
    title: 'Golongan 3: Protein Nabati',
    nutrisi: '1 Penukar = 75 Kalori, 5g Protein, 3g Lemak, 7g Karbohidrat',
    items: [
      { nama: 'Kacang hijau', berat: 20, urt: '2 sdm', ket: 'S++' },
      { nama: 'Kacang kedelai', berat: 25, urt: '2,5 sdm', ket: 'S\'' },
      { nama: 'Kacang merah', berat: 20, urt: '2 sdm', ket: 'S+' },
      { nama: 'Kacang tanah', berat: 15, urt: '2 sdm', ket: 'S+ TJ+' },
      { nama: 'Tahu', berat: 110, urt: '1 buah besar', ket: '' },
      { nama: 'Tempe kedelai', berat: 50, urt: '2 potong sedang', ket: 'S+' },
      { nama: 'Oncom', berat: 40, urt: '2 potong kecil', ket: 'S++' },
    ]
  },
  buah: {
    title: 'Golongan 5: Buah & Gula',
    nutrisi: '1 Penukar = 50 Kalori, 12g Karbohidrat',
    items: [
      { nama: 'Apel merah', berat: 85, urt: '1 buah kecil', ket: 'S++ K+' },
      { nama: 'Jeruk manis', berat: 110, urt: '2 buah sedang', ket: 'K+' },
      { nama: 'Mangga', berat: 90, urt: '3/4 buah besar', ket: '' },
      { nama: 'Pisang ambon', berat: 50, urt: '1 buah', ket: 'K+' },
      { nama: 'Pepaya', berat: 110, urt: '1 potong besar', ket: 'S++ K+' },
      { nama: 'Gula', berat: 13, urt: '1 sdm', ket: '' },
      { nama: 'Madu', berat: 15, urt: '1 sdm', ket: '' },
    ]
  }
}

const props = defineProps<{
  activeTab: string
}>()

const selectedGroupId = ref('karbohidrat')
const sourceFoodIdx = ref(0)
const targetFoodIdx = ref(1)
const sourceAmount = ref(100)
const searchTerm = ref('')
const showAnalysisResult = ref(false)

const activeGroup = computed(() => dbmpData[selectedGroupId.value])
const sourceFood = computed(() => activeGroup.value.items[sourceFoodIdx.value])
const targetFood = computed(() => activeGroup.value.items[targetFoodIdx.value])

const calculatedTargetAmount = computed(() => {
  if (sourceFood.value && targetFood.value) {
    return ((sourceAmount.value / sourceFood.value.berat) * targetFood.value.berat).toFixed(1)
  }
  return 0
})

const satuanPenukar = computed(() => {
  if (sourceFood.value) {
    return (sourceAmount.value / sourceFood.value.berat).toFixed(2)
  }
  return '0'
})

const calculatedTargetUrt = computed(() => {
  if (!targetFood.value) return 0
  const factor = Number(satuanPenukar.value)
  if (factor === 0) return 0
  
  // Try to parse URT number if it contains numbers like "1/2" or "1,5"
  let parsedUrt = parseFloat(targetFood.value.urt.replace(',', '.'))
  if (isNaN(parsedUrt)) return targetFood.value.urt
  
  return (factor * parsedUrt).toFixed(1).replace('.0', '') + targetFood.value.urt.replace(/^[0-9.,]+/, '')
})

const filteredDatabase = computed(() => {
  if (!searchTerm.value) return dbmpData
  const filtered: Record<string, any> = {}
  Object.keys(dbmpData).forEach(key => {
    const group = dbmpData[key]
    const matchedItems = group.items.filter((item: any) => 
      item.nama.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    if (matchedItems.length > 0) {
      filtered[key] = { ...group, items: matchedItems }
    }
  })
  return filtered
})

const onGroupChange = () => {
  sourceFoodIdx.value = 0
  targetFoodIdx.value = 1
  sourceAmount.value = activeGroup.value.items[0].berat
}

const onSourceFoodChange = () => {
  sourceAmount.value = activeGroup.value.items[sourceFoodIdx.value].berat
}

// --- API INTEGRATION (OPEN FOOD FACTS) ---
const apiSearchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchResults = ref<any[]>([])

const customFoodName = ref('')
const customPortion = ref(100)
const customCalories = ref(0)
const customCarbs = ref(0)
const customProtein = ref(0)
const customFat = ref(0)

const searchApi = async () => {
  if (!apiSearchQuery.value.trim()) return
  
  isSearching.value = true
  hasSearched.value = true
  searchResults.value = []
  showAnalysisResult.value = false
  
  try {
    // Open Food Facts API Endpoint (Public, Free, No Auth Required)
    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(apiSearchQuery.value)}&search_simple=1&action=process&json=1&page_size=10`
    const res = await fetch(url)
    const data = await res.json()
    
    if (data.products && data.products.length > 0) {
      // Filter out products without nutrition data
      searchResults.value = data.products.filter((p: any) => p.nutriments && p.nutriments['energy-kcal_100g'] !== undefined)
    }
  } catch (err) {
    console.error('Failed to fetch OFF API', err)
  } finally {
    isSearching.value = false
  }
}

const selectProduct = (product: any) => {
  customFoodName.value = `${product.product_name || ''} ${product.brands ? `(${product.brands})` : ''}`.trim()
  
  // Try to use serving size if available, fallback to 100g
  const servingSizeRaw = product.serving_quantity || 100
  customPortion.value = Number(servingSizeRaw) || 100
  
  const nutriments = product.nutriments || {}
  
  // Base 100g
  const cal100 = Number(nutriments['energy-kcal_100g']) || 0
  const carb100 = Number(nutriments['carbohydrates_100g']) || 0
  const prot100 = Number(nutriments['proteins_100g']) || 0
  const fat100 = Number(nutriments['fat_100g']) || 0
  
  // Calculate per serving
  const multiplier = customPortion.value / 100
  
  customCalories.value = Math.round(cal100 * multiplier)
  customCarbs.value = Number((carb100 * multiplier).toFixed(1))
  customProtein.value = Number((prot100 * multiplier).toFixed(1))
  customFat.value = Number((fat100 * multiplier).toFixed(1))
  
  // Clear search 
  searchResults.value = []
  apiSearchQuery.value = ''
  hasSearched.value = false
}

// --- ANALYSIS LOGIC ---
const analysisResult = ref({
  kategori: '',
  golongan: '',
  satuan: '0',
  icon: 'help-circle',
  colorClass: 'bg-gray-100 text-gray-500',
})

const analyzeNutrition = () => {
  if (customCalories.value <= 0) return
  
  // Tentukan Golongan Dominan Berdasarkan Rasio Makro & Energi
  const carbs = customCarbs.value
  const prot = customProtein.value
  const fat = customFat.value
  const cals = customCalories.value

  let gol = ''
  let kat = ''
  let sp = 0
  let icon = 'restaurant'
  let colorClass = 'bg-gray-100 text-gray-500'

  // DBMP Heuristics:
  // Karbohidrat: 1 SP = 175 kkal, 40g Kh, 4g Pro
  // Protein Hewani (Rendah/Sedang Lemak): 1 SP = 50-75 kkal, 7g Pro, 2-5g Lemak
  // Sayuran: 1 SP = 25 kkal, 5g Kh, 1g Pro
  // Buah: 1 SP = 50 kkal, 12g Kh

  const isCarbDominant = (carbs * 4) > (cals * 0.4) // Kh > 40% kalori
  const isProteinDominant = (prot * 4) > (cals * 0.25) || prot >= 7
  const isFatDominant = (fat * 9) > (cals * 0.4) // Lemak > 40% kalori

  if (isCarbDominant && cals >= 100) {
    kat = 'Sumber Karbohidrat'
    gol = 'Gol. 1: Karbohidrat'
    sp = cals / 175
    icon = 'nutrition'
    colorClass = 'bg-orange-100 text-orange-600'
  } 
  else if (isProteinDominant && isCarbDominant && prot >= 5) {
    kat = 'Sumber Protein Nabati'
    gol = 'Gol. 3: Protein Nabati'
    sp = cals / 75
    icon = 'leaf'
    colorClass = 'bg-green-100 text-green-600'
  }
  else if (isProteinDominant) {
    kat = 'Sumber Protein Hewani'
    if (fat >= 5) {
      gol = 'Gol. 2B/2C: Hewani Lemak'
      sp = cals / 75 // (atau 150 u/ lemak tinggi)
    } else {
      gol = 'Gol. 2A: Hewani Rendah Lemak'
      sp = cals / 50
    }
    icon = 'fish'
    colorClass = 'bg-rose-100 text-rose-600'
  }
  else if (isFatDominant) {
    kat = 'Sumber Lemak'
    gol = 'Gol. 6: Lemak & Minyak'
    sp = cals / 50 // 1 porsi lemak = 5g = 45-50 kkal
    icon = 'water'
    colorClass = 'bg-amber-100 text-amber-600'
  }
  else {
    kat = 'Buah-buahan / Gula'
    gol = 'Gol. 5: Buah & Gula'
    sp = cals / 50
    icon = 'rose'
    colorClass = 'bg-fuchsia-100 text-fuchsia-600'
  }

  analysisResult.value = {
    kategori: kat,
    golongan: gol,
    satuan: sp.toFixed(1),
    icon,
    colorClass
  }
  
  showAnalysisResult.value = false
  setTimeout(() => {
    showAnalysisResult.value = true
  }, 100)
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
