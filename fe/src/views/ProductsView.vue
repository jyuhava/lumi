<template>
  <AdminLayout>
    <!-- Header Actions -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ion-icon name="search-outline" class="text-gray-400 text-xl"></ion-icon>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari produk..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <button
        @click="openCreateModal"
        class="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
        <span>Tambah Produk</span>
      </button>
    </div>

    <!-- Products Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="p-12 text-center">
        <ion-icon name="cube-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Tidak ada produk ditemukan</p>
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
                Harga
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stok
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Satuan
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ product.code }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <ion-icon name="cube" class="text-green-600"></ion-icon>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                    <div v-if="product.description" class="text-xs text-gray-500">{{ product.description }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full">
                  {{ product.category?.name || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                Rp {{ formatPrice(product.price) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
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
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <ion-icon name="create-outline" class="text-xl"></ion-icon>
                </button>
                <button
                  @click="openDeleteModal(product)"
                  class="text-red-600 hover:text-red-900"
                >
                  <ion-icon name="trash-outline" class="text-xl"></ion-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  {{ editingProduct ? 'Edit Produk' : 'Tambah Produk' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kode Produk <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.code"
                        type="text"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Masukkan kode produk"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kategori <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="form.category_id"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Pilih kategori</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                          {{ cat.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Masukkan nama produk"
                    />
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      v-model="form.description"
                      rows="2"
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi produk"
                    ></textarea>
                  </div>

                  <div class="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Harga <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Stok <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.stock"
                        type="number"
                        min="0"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Satuan <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.unit"
                        type="text"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="pcs"
                      />
                    </div>
                  </div>

                  <div class="flex justify-end space-x-3">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      :disabled="submitting"
                      class="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                    >
                      {{ submitting ? 'Menyimpan...' : 'Simpan' }}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Delete Confirmation Modal -->
    <TransitionRoot appear :show="isDeleteModalOpen" as="template">
      <Dialog as="div" @close="closeDeleteModal" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div class="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <ion-icon name="warning-outline" class="text-red-600 text-3xl"></ion-icon>
                </div>

                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-2 text-center">
                  Hapus Produk
                </DialogTitle>

                <p class="text-sm text-gray-600 text-center mb-6">
                  Apakah Anda yakin ingin menghapus produk <strong>{{ deletingProduct?.name }}</strong>? 
                  Tindakan ini tidak dapat dibatalkan.
                </p>

                <div class="flex justify-center space-x-3">
                  <button
                    type="button"
                    @click="closeDeleteModal"
                    class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    @click="handleDelete"
                    :disabled="deleting"
                    class="px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
                  >
                    {{ deleting ? 'Menghapus...' : 'Hapus' }}
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  category_id: number
  code: string
  name: string
  description: string | null
  price: number
  stock: number
  unit: string
  category?: Category
  created_at: string
  updated_at: string
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingProduct = ref<Product | null>(null)
const deletingProduct = ref<Product | null>(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  category_id: '',
  code: '',
  name: '',
  description: '',
  price: 0,
  stock: 0,
  unit: 'pcs'
})

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  
  const query = searchQuery.value.toLowerCase()
  return products.value.filter(prod => 
    prod.name.toLowerCase().includes(query) ||
    prod.code.toLowerCase().includes(query) ||
    prod.description?.toLowerCase().includes(query) ||
    prod.category?.name.toLowerCase().includes(query)
  )
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await api.get('/products')
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

const openCreateModal = () => {
  editingProduct.value = null
  form.value = {
    category_id: '',
    code: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    unit: 'pcs'
  }
  isModalOpen.value = true
}

const openEditModal = (product: Product) => {
  editingProduct.value = product
  form.value = {
    category_id: product.category_id.toString(),
    code: product.code,
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    unit: product.unit
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingProduct.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const payload = {
      ...form.value,
      category_id: parseInt(form.value.category_id as any)
    }
    
    if (editingProduct.value) {
      await api.put(`/products/${editingProduct.value.id}`, payload)
    } else {
      await api.post('/products', payload)
    }
    await fetchProducts()
    closeModal()
  } catch (error) {
    console.error('Error saving product:', error)
    alert('Gagal menyimpan produk')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (product: Product) => {
  deletingProduct.value = product
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  deletingProduct.value = null
}

const handleDelete = async () => {
  if (!deletingProduct.value) return
  
  deleting.value = true
  try {
    await api.delete(`/products/${deletingProduct.value.id}`)
    await fetchProducts()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Gagal menghapus produk')
  } finally {
    deleting.value = false
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>
