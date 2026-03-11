<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center space-x-3 mb-2">
        <router-link to="/stock-opname" class="text-gray-400 hover:text-gray-600">
          <ion-icon name="arrow-back" class="text-2xl"></ion-icon>
        </router-link>
        <h2 class="text-2xl font-bold text-gray-900">Pembelian Stok</h2>
      </div>
      <p class="text-gray-600">Tambah stok produk dari pembelian</p>
    </div>

    <!-- Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tanggal <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.transaction_date"
            type="date"
            required
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Supplier <span class="text-red-500">*</span>
          </label>
          <select
            v-model="form.supplier_id"
            required
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Pilih supplier</option>
            <option v-for="supplier in suppliers" :key="supplier.id" :value="supplier.id">
              {{ supplier.name }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Catatan
          </label>
          <input
            v-model="form.notes"
            type="text"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Catatan tambahan"
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
            Total: <span class="font-bold text-green-600">Rp {{ formatPrice(grandTotal) }}</span>
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
              class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <select
            v-model="categoryFilter"
            class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Semua Kategori</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Produk
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga Satuan
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diskon %
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Harga Akhir
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition">
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-2">
                    <ion-icon name="cube" class="text-green-600"></ion-icon>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div class="text-xs text-gray-500">{{ product.code }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-bold bg-gray-100 text-gray-800 rounded-full">
                  {{ product.stock }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <input
                  v-if="itemData[product.id]"
                  v-model.number="itemData[product.id]!.quantity"
                  type="number"
                  min="0"
                  class="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <input
                  v-if="itemData[product.id]"
                  v-model.number="itemData[product.id]!.unit_price"
                  type="number"
                  min="0"
                  step="0.01"
                  class="w-28 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  :placeholder="formatPrice(product.price)"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <input
                  v-if="itemData[product.id]"
                  v-model.number="itemData[product.id]!.discount_percent"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  class="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="0"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                Rp {{ formatPrice(calculateFinalPrice(product.id, product.price)) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-bold text-green-600">
                Rp {{ formatPrice(calculateSubtotal(product.id, product.price)) }}
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
        class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ submitting ? 'Menyimpan...' : `Simpan Pembelian (Rp ${formatPrice(grandTotal)})` }}
      </button>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
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
  price: number
  category_id: number
  category?: Category
}

interface Supplier {
  id: number
  name: string
}

interface ItemData {
  quantity: number
  unit_price: number | null
  discount_percent: number
}

const router = useRouter()
const products = ref<Product[]>([])
const suppliers = ref<Supplier[]>([])
const categories = ref<Category[]>([])
const searchQuery = ref('')
const categoryFilter = ref('')
const loading = ref(false)
const submitting = ref(false)

const form = ref({
  transaction_date: new Date().toISOString().split('T')[0],
  supplier_id: '',
  notes: ''
})

const itemData = reactive<Record<number, ItemData>>({})

const selectedItemsCount = computed(() => {
  return Object.values(itemData).filter(item => item.quantity > 0).length
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

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const calculateFinalPrice = (productId: number, defaultPrice: number) => {
  const item = itemData[productId]
  if (!item || item.quantity === 0) return 0
  
  const unitPrice = item.unit_price || defaultPrice
  const discountAmount = (unitPrice * item.discount_percent) / 100
  return unitPrice - discountAmount
}

const calculateSubtotal = (productId: number, defaultPrice: number) => {
  const item = itemData[productId]
  if (!item || item.quantity === 0) return 0
  
  const finalPrice = calculateFinalPrice(productId, defaultPrice)
  return finalPrice * item.quantity
}

const grandTotal = computed(() => {
  let total = 0
  products.value.forEach(product => {
    total += calculateSubtotal(product.id, product.price)
  })
  return total
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/stock-summary')
    if (response.data.success) {
      products.value = response.data.data
      // Initialize itemData for each product
      products.value.forEach(product => {
        itemData[product.id] = {
          quantity: 0,
          unit_price: null,
          discount_percent: 0
        }
      })
    }
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchSuppliers = async () => {
  try {
    const response = await api.get('/suppliers')
    if (response.data.success) {
      suppliers.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error)
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
  if (!form.value.supplier_id) {
    alert('Pilih supplier terlebih dahulu')
    return
  }

  const items = Object.entries(itemData)
    .filter(([_, item]) => item.quantity > 0)
    .map(([productId, item]) => ({
      product_id: parseInt(productId),
      quantity: item.quantity,
      unit_price: item.unit_price,
      discount_percent: item.discount_percent
    }))

  if (items.length === 0) {
    alert('Masukkan jumlah pembelian minimal 1 produk')
    return
  }

  submitting.value = true
  try {
    const payload = {
      type: 'in',
      transaction_date: form.value.transaction_date,
      supplier_id: parseInt(form.value.supplier_id as any),
      notes: form.value.notes || null,
      items
    }

    const response = await api.post('/stock-transactions', payload)
    if (response.data.success) {
      alert('Pembelian berhasil disimpan!')
      router.push('/stock-opname')
    }
  } catch (error: any) {
    console.error('Error saving purchase:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan pembelian')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  fetchProducts()
  fetchSuppliers()
  fetchCategories()
})
</script>
