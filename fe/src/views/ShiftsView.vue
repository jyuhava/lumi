<template>
  <AdminLayout>
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Data Shift</h2>
          <p class="text-gray-600">Kelola shift kerja</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center space-x-2"
        >
          <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
          <span>Tambah Shift</span>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="shifts.length === 0" class="p-12 text-center">
        <ion-icon name="time-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Belum ada data shift</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Shift</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam Kerja</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="shift in shifts" :key="shift.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ shift.code }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ shift.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ shift.start_time }} - {{ shift.end_time }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded border border-gray-300"
                    :style="{ backgroundColor: shift.color }"
                  ></div>
                  <span class="text-sm text-gray-600">{{ shift.color }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="openEditModal(shift)" class="text-indigo-600 hover:text-indigo-900">
                  <ion-icon name="create-outline" class="text-xl"></ion-icon>
                </button>
                <button @click="confirmDelete(shift)" class="text-red-600 hover:text-red-900">
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
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  {{ editingShift ? 'Edit Shift' : 'Tambah Shift' }}
                </DialogTitle>

                <form @submit.prevent="saveShift" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Kode Shift <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.code"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="SHIFT-A"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Nama Shift <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="form.name"
                      type="text"
                      required
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Pagi"
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Jam Mulai <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.start_time"
                        type="time"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Jam Selesai <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.end_time"
                        type="time"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Warna <span class="text-red-500">*</span>
                    </label>
                    <div class="flex items-center space-x-3">
                      <input
                        v-model="form.color"
                        type="color"
                        required
                        class="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        v-model="form.color"
                        type="text"
                        required
                        pattern="^#[0-9A-Fa-f]{6}$"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="#3B82F6"
                      />
                    </div>
                    <p class="mt-1 text-xs text-gray-500">Format: #RRGGBB</p>
                  </div>

                  <div class="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      @click="closeModal"
                      class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      :disabled="saving"
                      class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
                    >
                      {{ saving ? 'Menyimpan...' : 'Simpan' }}
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
      <Dialog as="div" @close="isDeleteModalOpen = false" class="relative z-50">
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
                  Hapus Shift
                </DialogTitle>

                <p class="text-sm text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus shift <strong>{{ shiftToDelete?.name }}</strong>?
                </p>

                <div class="flex justify-end space-x-3">
                  <button
                    @click="isDeleteModalOpen = false"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    @click="deleteShift"
                    :disabled="deleting"
                    class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium disabled:opacity-50"
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
import { ref, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

interface Shift {
  id: number
  name: string
  code: string
  start_time: string
  end_time: string
  color: string
}

const shifts = ref<Shift[]>([])
const loading = ref(false)

const isModalOpen = ref(false)
const editingShift = ref<Shift | null>(null)
const saving = ref(false)

const isDeleteModalOpen = ref(false)
const shiftToDelete = ref<Shift | null>(null)
const deleting = ref(false)

const form = ref({
  name: '',
  code: '',
  start_time: '',
  end_time: '',
  color: '#3B82F6'
})

const fetchShifts = async () => {
  loading.value = true
  try {
    const response = await api.get('/shifts')
    if (response.data.success) {
      shifts.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching shifts:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingShift.value = null
  form.value = {
    name: '',
    code: '',
    start_time: '',
    end_time: '',
    color: '#3B82F6'
  }
  isModalOpen.value = true
}

const openEditModal = (shift: Shift) => {
  editingShift.value = shift
  form.value = {
    name: shift.name,
    code: shift.code,
    start_time: shift.start_time,
    end_time: shift.end_time,
    color: shift.color
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingShift.value = null
}

const saveShift = async () => {
  saving.value = true
  try {
    if (editingShift.value) {
      const response = await api.put(`/shifts/${editingShift.value.id}`, form.value)
      if (response.data.success) {
        await fetchShifts()
        closeModal()
      }
    } else {
      const response = await api.post('/shifts', form.value)
      if (response.data.success) {
        await fetchShifts()
        closeModal()
      }
    }
  } catch (error: any) {
    console.error('Error saving shift:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan data shift')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (shift: Shift) => {
  shiftToDelete.value = shift
  isDeleteModalOpen.value = true
}

const deleteShift = async () => {
  if (!shiftToDelete.value) return

  deleting.value = true
  try {
    const response = await api.delete(`/shifts/${shiftToDelete.value.id}`)
    if (response.data.success) {
      await fetchShifts()
      isDeleteModalOpen.value = false
      shiftToDelete.value = null
    }
  } catch (error: any) {
    console.error('Error deleting shift:', error)
    alert(error.response?.data?.message || 'Gagal menghapus shift')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchShifts()
})
</script>
