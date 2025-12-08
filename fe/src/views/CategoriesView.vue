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
            placeholder="Cari kategori..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <button
        @click="openCreateModal"
        class="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
        <span>Tambah Kategori</span>
      </button>
    </div>

    <!-- Categories Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="filteredCategories.length === 0" class="p-12 text-center">
        <ion-icon name="folder-open-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Tidak ada kategori ditemukan</p>
      </div>

      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Kategori
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Deskripsi
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Dibuat
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="category in filteredCategories" :key="category.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              #{{ category.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <ion-icon name="pricetag" class="text-indigo-600"></ion-icon>
                </div>
                <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              {{ category.description || '-' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ formatDate(category.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openEditModal(category)"
                class="text-indigo-600 hover:text-indigo-900 mr-4"
              >
                <ion-icon name="create-outline" class="text-xl"></ion-icon>
              </button>
              <button
                @click="openDeleteModal(category)"
                class="text-red-600 hover:text-red-900"
              >
                <ion-icon name="trash-outline" class="text-xl"></ion-icon>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit">
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Kategori <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Masukkan nama kategori"
                    />
                  </div>

                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi kategori"
                    ></textarea>
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
                  Hapus Kategori
                </DialogTitle>

                <p class="text-sm text-gray-600 text-center mb-6">
                  Apakah Anda yakin ingin menghapus kategori <strong>{{ deletingCategory?.name }}</strong>? 
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
  description: string | null
  created_at: string
  updated_at: string
}

const categories = ref<Category[]>([])
const loading = ref(false)
const searchQuery = ref('')

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingCategory = ref<Category | null>(null)
const deletingCategory = ref<Category | null>(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  name: '',
  description: ''
})

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(cat => 
    cat.name.toLowerCase().includes(query) ||
    cat.description?.toLowerCase().includes(query)
  )
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await api.get('/categories')
    if (response.data.success) {
      categories.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingCategory.value = null
  form.value = { name: '', description: '' }
  isModalOpen.value = true
}

const openEditModal = (category: Category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingCategory.value = null
  form.value = { name: '', description: '' }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editingCategory.value) {
      await api.put(`/categories/${editingCategory.value.id}`, form.value)
    } else {
      await api.post('/categories', form.value)
    }
    await fetchCategories()
    closeModal()
  } catch (error) {
    console.error('Error saving category:', error)
    alert('Gagal menyimpan kategori')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (category: Category) => {
  deletingCategory.value = category
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  deletingCategory.value = null
}

const handleDelete = async () => {
  if (!deletingCategory.value) return
  
  deleting.value = true
  try {
    await api.delete(`/categories/${deletingCategory.value.id}`)
    await fetchCategories()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting category:', error)
    alert('Gagal menghapus kategori')
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

onMounted(() => {
  fetchCategories()
})
</script>
