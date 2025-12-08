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
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Produk</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totals.products }}</p>
          </div>
          <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <ion-icon name="cube-outline" class="text-2xl text-indigo-600"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Kategori</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totals.categories }}</p>
          </div>
          <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <ion-icon name="grid-outline" class="text-2xl text-green-600"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Total Supplier</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.totals.suppliers }}</p>
          </div>
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <ion-icon name="people-outline" class="text-2xl text-blue-600"></ion-icon>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600 mb-1">Nilai Stok</p>
            <p class="text-xl font-bold text-gray-900">Rp {{ formatPrice(stats.totals.stock_value) }}</p>
          </div>
          <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <ion-icon name="cash-outline" class="text-2xl text-yellow-600"></ion-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- Alert for Low Stock -->
    <div v-if="!loading && stats.totals.low_stock > 0" class="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
      <div class="flex items-center">
        <ion-icon name="warning-outline" class="text-2xl text-yellow-600 mr-3"></ion-icon>
        <div>
          <p class="font-semibold text-yellow-800">Peringatan Stok Rendah</p>
          <p class="text-sm text-yellow-700">Ada {{ stats.totals.low_stock }} produk dengan stok ≤ 10</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Recent Transactions -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Transaksi Terbaru</h3>
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
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    transaction.type === 'in' ? 'bg-green-100' : 'bg-red-100'
                  ]"
                >
                  <ion-icon 
                    :name="transaction.type === 'in' ? 'arrow-down' : 'arrow-up'" 
                    :class="[
                      'text-xl',
                      transaction.type === 'in' ? 'text-green-600' : 'text-red-600'
                    ]"
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
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h3 class="text-lg font-semibold text-gray-900">Top Produk (Nilai Stok)</h3>
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
                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span class="text-sm font-bold text-indigo-600">{{ index + 1 }}</span>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ product.name }}</p>
                  <p class="text-xs text-gray-500">{{ product.stock }} {{ product.unit }} × Rp {{ formatPrice(product.price) }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-indigo-600">Rp {{ formatPrice(product.stock_value) }}</p>
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
