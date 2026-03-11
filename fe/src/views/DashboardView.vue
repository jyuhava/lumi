<template>
  <AdminLayout>
    <!-- Executive Header -->
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h2 class="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Administrator</h2>
        <p class="text-sm font-medium text-gray-500 mt-1">Ringkasan Analitik Sistem Manajemen Persediaan Instalasi Gizi</p>
      </div>
      <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
        <ion-icon name="calendar-outline" class="text-[#739b1a]"></ion-icon>
        <span class="text-sm font-semibold text-gray-700">Ringkasan Saat Ini</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col justify-center items-center py-20 space-y-4">
      <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-100 border-t-[#739b1a]"></div>
      <p class="text-sm font-medium text-gray-400">Memuat metrik operasional...</p>
    </div>

    <div v-else>
      <!-- Critical Alerts (Low Stock) -->
      <div v-if="stats.totals.low_stock > 0" class="bg-orange-50/50 border border-orange-200 rounded-xl p-4 mb-8 shadow-sm flex items-start sm:items-center relative overflow-hidden group">
        <div class="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-orange-400 to-red-500"></div>
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm border border-orange-100 flex-shrink-0 relative">
          <ion-icon name="warning" class="text-xl text-orange-500"></ion-icon>
          <span class="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
        <div>
          <h3 class="font-bold text-orange-900 text-sm tracking-wide">Atensi Eksekutif: Stok Bahan Makanan Kritis</h3>
          <p class="text-xs text-orange-800/80 mt-0.5 font-medium">Sistem mendeteksi <span class="font-bold text-red-600">{{ stats.totals.low_stock }}</span> item persediaan telah mencapai atau berada di bawah batas minimum pengaman.</p>
        </div>
      </div>

      <!-- Key Performance Indicators (KPIs) -->
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <!-- KPI 1 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
            <ion-icon name="cube" class="text-9xl text-gray-900"></ion-icon>
          </div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Item Persediaan</p>
              <h3 class="text-3xl font-extrabold text-[#16200B] tracking-tight">{{ stats.totals.products }}</h3>
            </div>
            <div class="w-12 h-12 bg-[#f8faf6] rounded-xl flex items-center justify-center border border-[#bcdd5a]/40 text-[#4a6825]">
              <ion-icon name="cube-outline" class="text-2xl"></ion-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-medium text-emerald-600">
            <ion-icon name="trending-up-outline" class="mr-1 text-sm"></ion-icon>
            <span>SKU Aktif Tercatat</span>
          </div>
        </div>

        <!-- KPI 2 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
             <ion-icon name="folder-open" class="text-9xl text-gray-900"></ion-icon>
          </div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Kategori Bahan</p>
              <h3 class="text-3xl font-extrabold text-[#16200B] tracking-tight">{{ stats.totals.categories }}</h3>
            </div>
            <div class="w-12 h-12 bg-[#f8faf6] rounded-xl flex items-center justify-center border border-[#bcdd5a]/40 text-[#4a6825]">
              <ion-icon name="folder-open-outline" class="text-2xl"></ion-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-medium text-gray-500">
            <ion-icon name="list-circle-outline" class="mr-1 text-sm text-gray-400"></ion-icon>
            <span>Klasifikasi Terdaftar</span>
          </div>
        </div>

        <!-- KPI 3 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
             <ion-icon name="business" class="text-9xl text-gray-900"></ion-icon>
          </div>
          <div class="flex items-start justify-between relative z-10">
            <div>
              <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mitra Pemasok</p>
              <h3 class="text-3xl font-extrabold text-[#16200B] tracking-tight">{{ stats.totals.suppliers }}</h3>
            </div>
            <div class="w-12 h-12 bg-[#f8faf6] rounded-xl flex items-center justify-center border border-[#bcdd5a]/40 text-[#4a6825]">
              <ion-icon name="business-outline" class="text-2xl"></ion-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-medium text-emerald-600">
             <ion-icon name="shield-checkmark-outline" class="mr-1 text-sm"></ion-icon>
             <span>Vendor Terverifikasi</span>
          </div>
        </div>

        <!-- KPI 4 -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
             <ion-icon name="wallet" class="text-9xl text-gray-900"></ion-icon>
          </div>
          <div class="flex items-start justify-between relative z-10">
            <div>
               <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Estimasi Aset Stok</p>
               <h3 class="text-2xl font-extrabold text-[#16200B] tracking-tight mt-1">Rp {{ formatPriceShort(stats.totals.stock_value) }}</h3>
            </div>
            <div class="w-12 h-12 bg-gradient-to-br from-[#739b1a] to-[#4a6825] rounded-xl flex items-center justify-center shadow-inner text-white flex-shrink-0">
              <ion-icon name="bar-chart-outline" class="text-xl"></ion-icon>
            </div>
          </div>
          <div class="mt-4 flex items-center text-xs font-medium text-gray-500">
             <span>Sistem Valuasi Dinamis</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Layout Grids -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        <!-- Recent Transactions -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 class="text-base font-bold text-gray-900 tracking-tight">Daftar Pengadaan & Distribusi Terkini</h3>
              <p class="text-xs text-gray-500 mt-0.5">Riwayat mutasi keluar/masuk gudang sentral.</p>
            </div>
            <button class="text-[#739b1a] p-1.5 hover:bg-[#f8faf6] rounded-md transition-colors" title="Lihat Semua">
               <ion-icon name="arrow-forward-outline"></ion-icon>
            </button>
          </div>
          <div class="p-0 overflow-y-auto flex-1 scrollbar-thin">
            <div v-if="stats.recent_transactions.length === 0" class="h-full flex flex-col justify-center items-center text-gray-400">
               <ion-icon name="document-text-outline" class="text-4xl mb-2 opacity-50"></ion-icon>
               <p class="text-sm font-medium">Belum ada riwayat transaksi</p>
            </div>
            
            <ul v-else class="divide-y divide-gray-100">
              <li 
                v-for="transaction in stats.recent_transactions" 
                :key="transaction.id"
                class="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group"
              >
                <div class="flex items-center space-x-4">
                  <!-- Trans Icon -->
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    :class="transaction.type === 'in' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'"
                  >
                    <ion-icon 
                      :name="transaction.type === 'in' ? 'arrow-down' : 'arrow-up'" 
                      class="text-xl"
                    ></ion-icon>
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 group-hover:text-[#4a6825] transition-colors">{{ transaction.transaction_number }}</p>
                    <div class="flex items-center gap-2 mt-0.5">
                       <p class="text-[11px] text-gray-500">{{ formatDateShort(transaction.transaction_date) }}</p>
                       <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                       <p class="text-[11px] font-medium" :class="transaction.type === 'in' ? 'text-emerald-600' : 'text-red-500'">
                         {{ transaction.type === 'in' ? 'Barang Masuk' : 'Barang Keluar' }}
                       </p>
                    </div>
                  </div>
                </div>
                <!-- Amount -->
                <div class="text-right">
                  <p class="text-sm font-bold text-gray-900 border border-gray-100 px-2 py-0.5 rounded bg-white shadow-sm inline-block">
                    {{ transaction.items?.length || 0 }} SKU
                  </p>
                  <p v-if="transaction.total_amount > 0" class="text-xs font-semibold text-gray-500 mt-1">
                    Rp {{ formatPriceShort(transaction.total_amount) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- Top Products by Value / Lowest Stock Alternatif -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[400px]">
          <div class="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
             <div>
              <h3 class="text-base font-bold text-gray-900 tracking-tight">Valuasi Stok Tertinggi</h3>
              <p class="text-xs text-gray-500 mt-0.5">Item dengan nilai aset kapital terbesar.</p>
            </div>
            <div class="p-1.5 bg-cyan-50 text-cyan-600 rounded-md">
               <ion-icon name="podium-outline" class="text-lg"></ion-icon>
            </div>
          </div>
          <div class="p-0 overflow-y-auto flex-1 scrollbar-thin">
            <div v-if="stats.top_products.length === 0" class="h-full flex flex-col justify-center items-center text-gray-400">
               <ion-icon name="cube-outline" class="text-4xl mb-2 opacity-50"></ion-icon>
               <p class="text-sm font-medium">Buku persediaan kosong</p>
            </div>
            
            <ul v-else class="divide-y divide-gray-100">
              <li 
                v-for="(product, index) in stats.top_products" 
                :key="product.id"
                class="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors group"
              >
                <div class="flex items-center space-x-4">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs"
                      :class="index < 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'"
                  >
                    #{{ index + 1 }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-cyan-700 transition-colors">{{ product.name }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">
                       <span class="font-semibold text-gray-700">{{ product.stock }}</span> {{ product.unit }} 
                       <span class="mx-1 text-gray-300">|</span> 
                       Satuan: Rp {{ formatPriceShort(product.price) }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[13px] font-black text-[#16200B] bg-[#f8faf6] border border-[#bcdd5a]/40 px-2 py-1 rounded-md">
                    Rp {{ formatPriceShort(product.stock_value) }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

    <!-- Access to Calculators Directory -->
    <div class="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
        <div>
          <h3 class="text-base font-bold text-[#4a6825] tracking-tight flex items-center gap-2">
            <ion-icon name="calculator" class="text-xl"></ion-icon>
            Direktori Kalkulator Klinis
          </h3>
          <p class="text-xs text-gray-500 mt-1">Akses cepat ke alat perhitungan gizi.</p>
        </div>
        <div class="flex p-1 bg-gray-100/80 rounded-xl border border-gray-200/50">
          <button @click="activeCalcTab = 'baru'" :class="activeCalcTab === 'baru' ? 'bg-white shadow-sm text-[#4a6825] border-gray-200' : 'text-gray-500 hover:text-[#739b1a] border-transparent'" class="px-5 py-2 text-xs font-bold rounded-lg transition-all border">Kalkulator Utama</button>
          <button @click="activeCalcTab = 'v1'" :class="activeCalcTab === 'v1' ? 'bg-white shadow-sm text-[#4a6825] border-gray-200' : 'text-gray-500 hover:text-[#739b1a] border-transparent'" class="px-5 py-2 text-xs font-bold rounded-lg transition-all border">Versi Legacy (v1)</button>
        </div>
      </div>
      
      <div class="p-6">
        <!-- New Calculators -->
        <div v-if="activeCalcTab === 'baru'" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          <router-link v-for="calc in calcBaru" :key="calc.path" :to="calc.path" class="group relative flex flex-col p-5 rounded-2xl border border-gray-100 bg-white hover:border-[#bcdd5a] hover:shadow-lg hover:shadow-[#739b1a]/5 transition-all duration-300 min-h-[140px] overflow-hidden">
            <!-- Decorative Background Element -->
            <div class="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
            
            <div class="relative z-10 flex flex-col h-full">
               <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-emerald-50 text-[#739b1a] group-hover:bg-[#739b1a] group-hover:text-white transition-colors duration-300">
                <ion-icon :name="calc.icon" class="text-2xl"></ion-icon>
              </div>
              <h4 class="font-extrabold text-[15px] text-[#16200B] group-hover:text-[#4a6825] transition-colors leading-tight mb-auto">{{ calc.title }}</h4>
              
              <div class="mt-4 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-[#739b1a] transition-colors">
                <span class="tracking-wide">BUKA ALAT</span>
                <ion-icon name="arrow-forward-outline" class="transform -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300"></ion-icon>
              </div>
            </div>
          </router-link>

           <!-- See All Link -->
           <router-link to="/calculator" class="group flex flex-col items-center justify-center p-5 rounded-2xl border border-dashed border-gray-300 bg-gray-50/50 hover:bg-[#f8faf6] hover:border-[#739b1a] transition-all duration-300 min-h-[140px]">
              <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-3 group-hover:bg-[#bcdd5a] group-hover:border-[#bcdd5a] transition-colors">
                <ion-icon name="grid-outline" class="text-gray-400 group-hover:text-[#2d4016]"></ion-icon>
              </div>
              <span class="text-xs font-bold text-gray-500 group-hover:text-[#4a6825]">Lihat Semua Modul</span>
           </router-link>
        </div>

        <!-- V1 Calculators -->
        <div v-if="activeCalcTab === 'v1'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
           <router-link v-for="calc in calcV1" :key="calc.id" :to="'/calculator-v1?tab=' + calc.id" class="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-[#bcdd5a] hover:bg-[#f8faf6] transition-all bg-white shadow-sm relative overflow-hidden">
             <!-- Selection Indicator Line -->
             <div class="absolute left-0 top-0 bottom-0 w-1 bg-[#bcdd5a] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div> 
             
            <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#4a6825] group-hover:text-white group-hover:border-[#4a6825] transition-colors text-gray-400">
              <ion-icon :name="calc.icon" class="text-lg"></ion-icon>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-bold text-sm text-gray-700 truncate group-hover:text-[#4a6825] transition-colors">{{ calc.label }}</h4>
            </div>
            <ion-icon name="chevron-forward-outline" class="text-gray-300 group-hover:text-[#739b1a] transition-colors"></ion-icon>
          </router-link>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

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

interface Stats {
  totals: {
    products: number
    categories: number
    suppliers: number
    stock_value: number
    low_stock: number
  }
  recent_transactions: any[]
  monthly_purchases: any[]
  monthly_usage: any[]
  top_products: any[]
}

const loading = ref(true)
const stats = ref<Stats>({
  totals: {
    products: 0,
    categories: 0,
    suppliers: 0,
    stock_value: 0,
    low_stock: 0
  },
  recent_transactions: [],
  monthly_purchases: [],
  monthly_usage: [],
  top_products: []
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatPriceShort = (price: number) => {
  if (price >= 1000000000) return (price / 1000000000).toFixed(1) + ' Miliar'
  if (price >= 1000000) return (price / 1000000).toFixed(1) + ' Juta'
  if (price >= 1000) return (price / 1000).toFixed(1) + ' Ribu'
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatDateShort = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    month: 'short', 
    day: 'numeric' 
  })
}

const fetchStats = async () => {
  loading.value = true
  try {
    const response = await api.get('/dashboard/stats')
    if (response.data.success) {
      stats.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})
</script>
