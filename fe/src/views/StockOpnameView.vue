<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Stok Opname</h2>
      <p class="text-gray-600">Ringkasan stok produk saat ini</p>
    </div>

    <!-- Action Buttons -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <router-link
        to="/stock/purchase"
        class="flex items-center justify-center space-x-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow-sm"
      >
        <ion-icon name="add-circle" class="text-3xl"></ion-icon>
        <div class="text-left">
          <div class="font-bold text-lg">Pembelian</div>
          <div class="text-sm text-green-100">Tambah stok produk</div>
        </div>
      </router-link>

      <router-link
        to="/stock/usage"
        class="flex items-center justify-center space-x-3 px-6 py-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition shadow-sm"
      >
        <ion-icon name="remove-circle" class="text-3xl"></ion-icon>
        <div class="text-left">
          <div class="font-bold text-lg">Pemakaian</div>
          <div class="text-sm text-red-100">Kurangi stok produk</div>
        </div>
      </router-link>
    </div>

    <!-- History Button -->
    <div class="mb-6">
      <router-link
        to="/stock/history"
        class="inline-flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <ion-icon name="time-outline" class="text-xl"></ion-icon>
        <span>Lihat History Transaksi</span>
      </router-link>
    </div>

    <!-- Stock Summary Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-900">Stok Saat Ini</h3>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="products.length === 0" class="p-12 text-center">
        <ion-icon name="cube-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Tidak ada data produk</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Produk
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satuan
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ product.code }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <ion-icon name="cube" class="text-blue-600"></ion-icon>
                  </div>
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {{ product.category?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 text-sm font-bold rounded-full',
                    product.stock > 10 ? 'bg-green-100 text-green-800' : 
                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ product.unit }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  code: string
  name: string
  stock: number
  unit: string
  category?: Category
}

const products = ref<Product[]>([])
const loading = ref(false)

const fetchStockSummary = async () => {
  loading.value = true
  try {
    const response = await api.get('/stock-summary')
    if (response.data.success) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching stock summary:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStockSummary()
})
</script>
