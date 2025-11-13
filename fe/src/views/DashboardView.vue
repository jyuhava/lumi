<template>
  <AdminLayout>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Dashboard</h2>
      <p class="text-gray-600">Ringkasan sistem stok opname</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
    </div>

    <!-- Stats Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-indigo-100 mb-1 font-medium">Total Produk</p>
            <p class="text-3xl font-bold text-white">{{ stats.totals.products }}</p>
          </div>
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 group-hover:scale-110 transition-transform">
            <ion-icon name="cube-outline" class="text-3xl text-white"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-emerald-100 mb-1 font-medium">Total Kategori</p>
            <p class="text-3xl font-bold text-white">{{ stats.totals.categories }}</p>
          </div>
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 group-hover:scale-110 transition-transform">
            <ion-icon name="grid-outline" class="text-3xl text-white"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-cyan-100 mb-1 font-medium">Total Supplier</p>
            <p class="text-3xl font-bold text-white">{{ stats.totals.suppliers }}</p>
          </div>
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 group-hover:scale-110 transition-transform">
            <ion-icon name="people-outline" class="text-3xl text-white"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 transform hover:scale-105 group">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-amber-100 mb-1 font-medium">Nilai Stok</p>
            <p class="text-2xl font-bold text-white">Rp {{ formatPrice(stats.totals.stock_value) }}</p>
          </div>
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center ring-2 ring-white/30 group-hover:scale-110 transition-transform">
            <ion-icon name="cash-outline" class="text-3xl text-white"></ion-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert for Low Stock -->
    <div v-if="!loading && stats.totals.low_stock > 0" class="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-xl p-4 mb-6 shadow-md">
      <div class="flex items-center">
        <div class="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center mr-3 animate-pulse">
          <ion-icon name="warning" class="text-2xl text-white"></ion-icon>
        </div>
        <div>
          <p class="font-bold text-yellow-900">Peringatan Stok Rendah</p>
          <p class="text-sm text-yellow-800">Ada {{ stats.totals.low_stock }} produk dengan stok ≤ 10</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
          <h3 class="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Transaksi Terbaru</h3>
        </div>
        <div class="p-6">
          <div v-if="stats.recent_transactions.length === 0" class="text-center py-8 text-gray-500">
            Belum ada transaksi
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="transaction in stats.recent_transactions" 
              :key="transaction.id"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center space-x-3">
                <div 
                  :class="[
                    'w-12 h-12 rounded-xl flex items-center justify-center shadow-md',
                    transaction.type === 'in' ? 'bg-gradient-to-br from-emerald-400 to-green-500' : 'bg-gradient-to-br from-red-400 to-pink-500'
                  ]">
                  <ion-icon 
                    :name="transaction.type === 'in' ? 'arrow-down' : 'arrow-up'" 
                    class="text-2xl text-white"
                  ></ion-icon>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ transaction.transaction_number }}</p>
                  <p class="text-xs text-gray-500">{{ formatDate(transaction.transaction_date) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-gray-900">{{ transaction.items?.length || 0 }} item</p>
                <p v-if="transaction.total_amount > 0" class="text-xs text-green-600">
                  Rp {{ formatPrice(transaction.total_amount) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top Products by Value -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-cyan-50 to-blue-50">
          <h3 class="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Top Produk (Nilai Stok)</h3>
        </div>
        <div class="p-6">
          <div v-if="stats.top_products.length === 0" class="text-center py-8 text-gray-500">
            Belum ada produk
          </div>
          <div v-else class="space-y-4">
            <div 
              v-for="(product, index) in stats.top_products" 
              :key="product.id"
              class="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                  <span class="text-sm font-bold text-white">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500">{{ product.stock }} {{ product.unit }} × Rp {{ formatPrice(product.price) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Rp {{ formatPrice(product.stock_value) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
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
