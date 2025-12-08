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
            placeholder="Cari supplier..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <button
        @click="openCreateModal"
        class="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
        <span>Tambah Supplier</span>
      </button>
    </div>

    <!-- Suppliers Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="filteredSuppliers.length === 0" class="p-12 text-center">
        <ion-icon name="people-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Tidak ada supplier ditemukan</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kode
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Supplier
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kontak
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="supplier in filteredSuppliers" :key="supplier.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ supplier.code }}
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <ion-icon name="business" class="text-purple-600"></ion-icon>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-gray-900">{{ supplier.name }}</div>
                    <div v-if="supplier.contact_person" class="text-xs text-gray-500">{{ supplier.contact_person }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div v-if="supplier.phone || supplier.email" class="text-sm text-gray-900">
                  <div v-if="supplier.phone" class="flex items-center mb-1">
                    <ion-icon name="call-outline" class="text-gray-400 mr-1"></ion-icon>
                    {{ supplier.phone }}
                  </div>
                  <div v-if="supplier.email" class="flex items-center">
                    <ion-icon name="mail-outline" class="text-gray-400 mr-1"></ion-icon>
                    {{ supplier.email }}
                  </div>
                </div>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="px-6 py-4">
                <div v-if="supplier.address || supplier.city" class="text-sm text-gray-600">
                  <div v-if="supplier.address">{{ supplier.address }}</div>
                  <div v-if="supplier.city" class="text-xs text-gray-500">{{ supplier.city }}</div>
                </div>
                <span v-else class="text-sm text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="openEditModal(supplier)"
                  class="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <ion-icon name="create-outline" class="text-xl"></ion-icon>
                </button>
                <button
                  @click="openDeleteModal(supplier)"
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
                  {{ editingSupplier ? 'Edit Supplier' : 'Tambah Supplier' }}
                </DialogTitle>

                <form @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Kode Supplier <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.code"
                        type="text"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="SUP001"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nama Supplier <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="PT. Supplier Jaya"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Kontak
                    </label>
                    <input
                      v-model="form.contact_person"
                      type="text"
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Nama PIC"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Telepon
                      </label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="08123456789"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="supplier@example.com"
                      />
                    </div>
                  </div>

                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      v-model="form.address"
                      rows="2"
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Jl. Contoh No. 123"
                    ></textarea>
                  </div>

                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Kota
                    </label>
                    <input
                      v-model="form.city"
                      type="text"
                      class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Jakarta"
                    />
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
                  Hapus Supplier
                </DialogTitle>

                <p class="text-sm text-gray-600 text-center mb-6">
                  Apakah Anda yakin ingin menghapus supplier <strong>{{ deletingSupplier?.name }}</strong>? 
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

interface Supplier {
  id: number
  code: string
  name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  address: string | null
  city: string | null
  created_at: string
  updated_at: string
}

const suppliers = ref<Supplier[]>([])
const loading = ref(false)
const searchQuery = ref('')

const isModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const editingSupplier = ref<Supplier | null>(null)
const deletingSupplier = ref<Supplier | null>(null)
const submitting = ref(false)
const deleting = ref(false)

const form = ref({
  code: '',
  name: '',
  contact_person: '',
  phone: '',
  email: '',
  address: '',
  city: ''
})

const filteredSuppliers = computed(() => {
  if (!searchQuery.value) return suppliers.value
  
  const query = searchQuery.value.toLowerCase()
  return suppliers.value.filter(sup => 
    sup.name.toLowerCase().includes(query) ||
    sup.code.toLowerCase().includes(query) ||
    sup.contact_person?.toLowerCase().includes(query) ||
    sup.phone?.toLowerCase().includes(query) ||
    sup.email?.toLowerCase().includes(query) ||
    sup.city?.toLowerCase().includes(query)
  )
})

const fetchSuppliers = async () => {
  loading.value = true
  try {
    const response = await api.get('/suppliers')
    if (response.data.success) {
      suppliers.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingSupplier.value = null
  form.value = {
    code: '',
    name: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    city: ''
  }
  isModalOpen.value = true
}

const openEditModal = (supplier: Supplier) => {
  editingSupplier.value = supplier
  form.value = {
    code: supplier.code,
    name: supplier.name,
    contact_person: supplier.contact_person || '',
    phone: supplier.phone || '',
    email: supplier.email || '',
    address: supplier.address || '',
    city: supplier.city || ''
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingSupplier.value = null
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (editingSupplier.value) {
      await api.put(`/suppliers/${editingSupplier.value.id}`, form.value)
    } else {
      await api.post('/suppliers', form.value)
    }
    await fetchSuppliers()
    closeModal()
  } catch (error) {
    console.error('Error saving supplier:', error)
    alert('Gagal menyimpan supplier')
  } finally {
    submitting.value = false
  }
}

const openDeleteModal = (supplier: Supplier) => {
  deletingSupplier.value = supplier
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  deletingSupplier.value = null
}

const handleDelete = async () => {
  if (!deletingSupplier.value) return
  
  deleting.value = true
  try {
    await api.delete(`/suppliers/${deletingSupplier.value.id}`)
    await fetchSuppliers()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting supplier:', error)
    alert('Gagal menghapus supplier')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchSuppliers()
})
</script>
