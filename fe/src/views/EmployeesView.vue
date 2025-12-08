<template>
  <AdminLayout>
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Data Karyawan</h2>
          <p class="text-gray-600">Kelola data karyawan</p>
        </div>
        <button
          @click="openCreateModal"
          class="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium inline-flex items-center space-x-2"
        >
          <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
          <span>Tambah Karyawan</span>
        </button>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-2 gap-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ion-icon name="search-outline" class="text-gray-400 text-xl"></ion-icon>
          </div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari karyawan..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          v-model="statusFilter"
          class="block w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Semua Status</option>
          <option value="active">Aktif</option>
          <option value="inactive">Tidak Aktif</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
        <p class="mt-4 text-gray-600">Memuat data...</p>
      </div>

      <div v-else-if="filteredEmployees.length === 0" class="p-12 text-center">
        <ion-icon name="people-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Belum ada data karyawan</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Karyawan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontak</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="employee in filteredEmployees" :key="employee.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ employee.employee_id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ employee.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ employee.position }}
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">
                <div>{{ employee.phone || '-' }}</div>
                <div class="text-xs text-gray-500">{{ employee.email || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 text-xs font-medium rounded-full',
                    employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ employee.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="openEditModal(employee)" class="text-indigo-600 hover:text-indigo-900">
                  <ion-icon name="create-outline" class="text-xl"></ion-icon>
                </button>
                <button @click="confirmDelete(employee)" class="text-red-600 hover:text-red-900">
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
                  {{ editingEmployee ? 'Edit Karyawan' : 'Tambah Karyawan' }}
                </DialogTitle>

                <form @submit.prevent="saveEmployee" class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        ID Karyawan <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.employee_id"
                        type="text"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="EMP001"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Nama Lengkap <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Posisi <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="form.position"
                        type="text"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Status <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="form.status"
                        required
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="active">Aktif</option>
                        <option value="inactive">Tidak Aktif</option>
                      </select>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Telepon
                      </label>
                      <input
                        v-model="form.phone"
                        type="text"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Alamat
                    </label>
                    <textarea
                      v-model="form.address"
                      rows="3"
                      class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    ></textarea>
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
                  Hapus Karyawan
                </DialogTitle>

                <p class="text-sm text-gray-600 mb-6">
                  Apakah Anda yakin ingin menghapus karyawan <strong>{{ employeeToDelete?.name }}</strong>?
                </p>

                <div class="flex justify-end space-x-3">
                  <button
                    @click="isDeleteModalOpen = false"
                    class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    Batal
                  </button>
                  <button
                    @click="deleteEmployee"
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
import { ref, computed, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

interface Employee {
  id: number
  employee_id: string
  name: string
  position: string
  phone: string | null
  email: string | null
  address: string | null
  status: 'active' | 'inactive'
}

const employees = ref<Employee[]>([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')

const isModalOpen = ref(false)
const editingEmployee = ref<Employee | null>(null)
const saving = ref(false)

const isDeleteModalOpen = ref(false)
const employeeToDelete = ref<Employee | null>(null)
const deleting = ref(false)

const form = ref({
  employee_id: '',
  name: '',
  position: '',
  phone: '',
  email: '',
  address: '',
  status: 'active' as 'active' | 'inactive'
})

const filteredEmployees = computed(() => {
  let filtered = employees.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(e => 
      e.name.toLowerCase().includes(query) ||
      e.employee_id.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter(e => e.status === statusFilter.value)
  }

  return filtered
})

const fetchEmployees = async () => {
  loading.value = true
  try {
    const response = await api.get('/employees')
    if (response.data.success) {
      employees.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching employees:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingEmployee.value = null
  form.value = {
    employee_id: '',
    name: '',
    position: '',
    phone: '',
    email: '',
    address: '',
    status: 'active'
  }
  isModalOpen.value = true
}

const openEditModal = (employee: Employee) => {
  editingEmployee.value = employee
  form.value = {
    employee_id: employee.employee_id,
    name: employee.name,
    position: employee.position,
    phone: employee.phone || '',
    email: employee.email || '',
    address: employee.address || '',
    status: employee.status
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingEmployee.value = null
}

const saveEmployee = async () => {
  saving.value = true
  try {
    if (editingEmployee.value) {
      const response = await api.put(`/employees/${editingEmployee.value.id}`, form.value)
      if (response.data.success) {
        await fetchEmployees()
        closeModal()
      }
    } else {
      const response = await api.post('/employees', form.value)
      if (response.data.success) {
        await fetchEmployees()
        closeModal()
      }
    }
  } catch (error: any) {
    console.error('Error saving employee:', error)
    alert(error.response?.data?.message || 'Gagal menyimpan data karyawan')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (employee: Employee) => {
  employeeToDelete.value = employee
  isDeleteModalOpen.value = true
}

const deleteEmployee = async () => {
  if (!employeeToDelete.value) return

  deleting.value = true
  try {
    const response = await api.delete(`/employees/${employeeToDelete.value.id}`)
    if (response.data.success) {
      await fetchEmployees()
      isDeleteModalOpen.value = false
      employeeToDelete.value = null
    }
  } catch (error: any) {
    console.error('Error deleting employee:', error)
    alert(error.response?.data?.message || 'Gagal menghapus karyawan')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  fetchEmployees()
})
</script>
