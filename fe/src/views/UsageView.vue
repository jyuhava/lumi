<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-2">
        <router-link to="/stock-opname" class="text-gray-400 hover:text-gray-600">
          <ion-icon name="arrow-back" class="text-2xl"></ion-icon>
        </router-link>
        <h2 class="text-2xl font-bold text-gray-900">Pemakaian Stok</h2>
      </div>
      <p class="text-gray-600">Kurangi stok produk untuk pemakaian</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.transaction_date"
            type="date"
            required
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Catatan
          </label>
          <input
            v-model="form.notes"
            type="text"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Catatan pemakaian"
          />
        </div>
      </div>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Daftar Produk</h3>
          <div class="text-sm text-gray-600">
            Total item: <span class="font-bold text-red-600">{{ selectedItemsCount }}</span>
          </div>
        </div>
        
        <!-- Search and Filter -->
        <div class="grid grid-cols-2 gap-4">
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ion-icon name="search-outline" class="text-gray-400 text-xl"></ion-icon>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Cari produk..."
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            v-model="categoryFilter"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-red-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok Saat Ini
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jumlah Pakai
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok Setelah
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <ion-icon name="cube" class="text-red-600"></ion-icon>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.code }}</div>
                  </div>
                </div>
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
                  {{ product.stock }} {{ product.unit }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <input
                  v-model.number="quantities[product.id]"
                  type="number"
                  min="0"
                  :max="product.stock"
                  :disabled="product.stock === 0"
                  class="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder="0"
                />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  v-if="quantities[product.id] > 0"
                  :class="[
                    'px-3 py-1 text-sm font-bold rounded-full',
                    (product.stock - quantities[product.id]) > 10 ? 'bg-green-100 text-green-800' : 
                    (product.stock - quantities[product.id]) > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  ]"
                >
                  {{ product.stock - quantities[product.id] }} {{ product.unit }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end space-x-3">
      <router-link
        to="/stock-opname"
        class="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
      >
        Batal
      </router-link>
      <button
        @click="handleSubmit"
        :disabled="submitting || selectedItemsCount === 0"
        class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'Menyimpan...' : 'Simpan Pemakaian' }}
      </button>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  category_id: number
  category?: Category
}

const router = useRouter()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const loading = ref(false)
const submitting = ref(false)

const form = ref({
  transaction_date: new Date().toISOString().split('T')[0],
  notes: ''
})

const quantities = ref<Record<number, number>>({})

const selectedItemsCount = computed(() => {
  return Object.values(quantities.value).filter(q => q > 0).length
})

const filteredProducts = computed(() => {
  let filtered = products.value

  // Filter by category
  if (categoryFilter.value) {
    filtered = filtered.filter(p => p.category_id === parseInt(categoryFilter.value))
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.code.toLowerCase().includes(query)
    )
  }

  return filtered
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/stock-summary')
    if (response.data.success) {
      products.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await api.get('/categories')
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const handleSubmit = async () => {
  const items = Object.entries(quantities.value)
    .filter(([_, qty]) => qty > 0)
    .map(([productId, quantity]) => ({
      product_id: parseInt(productId),
      quantity
    }))

  if (items.length === 0) {
    alert('Masukkan jumlah pemakaian minimal 1 produk')
    return
  }

  // Validate stock
  for (const item of items) {
    const product = products.value.find(p => p.id === item.product_id)
    if (product && item.quantity > product.stock) {
      alert(`Stok ${product.name} tidak mencukupi. Stok tersedia: ${product.stock}`)
      return
    }
  }

  submitting.value = true
  try {
    const payload = {
      type: 'out',
      transaction_date: form.value.transaction_date,
      notes: form.value.notes || null,
      items
    }

    const response = await api.post('/stock-transactions', payload)
    if (response.data.success) {
      alert('Pemakaian berhasil disimpan!')
      router.push('/stock-opname')
    }
  } catch (error: any) {
    console.error('Error saving usage:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan pemakaian')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
