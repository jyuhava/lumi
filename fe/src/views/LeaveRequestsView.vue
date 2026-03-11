<template>
  <AdminLayout>
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Permintaan Cuti</h2>
          <p class="text-gray-600">Kelola permintaan cuti karyawan</p>
        </div>
        <button
          @click="openCreateModal"
          class="flex items-center space-x-2 px-4 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition shadow-md"
        >
          <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
          <span>Tambah Permintaan Cuti</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div class="grid grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" @change="loadLeaveRequests" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Karyawan</label>
          <select v-model="filters.employee_id" @change="loadLeaveRequests" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            <option value="">Semua Karyawan</option>
            <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }}</option>
          </select>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
            <select v-model="filters.month" @change="loadLeaveRequests" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
              <option value="">Semua</option>
              <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
            <select v-model="filters.year" @change="loadLeaveRequests" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
              <option value="">Semua</option>
              <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div v-if="loading" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#5F9EA0]"></div>
        <p class="text-gray-600 mt-4">Memuat data...</p>
      </div>

      <div v-else-if="leaveRequests.length === 0" class="p-12 text-center">
        <ion-icon name="calendar-clear-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
        <p class="text-gray-600">Belum ada permintaan cuti</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karyawan</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durasi</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="leave in leaveRequests" :key="leave.id" class="hover:bg-gray-50 transition">
              <td class="px-6 py-4 whitespace-nowrap">
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ leave.employee?.name }}</div>
                  <div class="text-sm text-gray-500">{{ leave.employee?.employee_id }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ formatDate(leave.start_date) }}</div>
                <div class="text-sm text-gray-500">s/d {{ formatDate(leave.end_date) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ leave.duration_days }} hari
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getLeaveTypeClass(leave.leave_type)">
                  {{ getLeaveTypeLabel(leave.leave_type) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(leave.status)">
                  {{ getStatusLabel(leave.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="viewLeave(leave)" class="text-blue-600 hover:text-blue-900">
                  <ion-icon name="eye-outline" class="text-xl"></ion-icon>
                </button>
                <button v-if="leave.status === 'pending'" @click="openEditModal(leave)" class="text-indigo-600 hover:text-indigo-900">
                  <ion-icon name="create-outline" class="text-xl"></ion-icon>
                </button>
                <button v-if="leave.status === 'pending'" @click="approveLeave(leave)" class="text-green-600 hover:text-green-900">
                  <ion-icon name="checkmark-circle-outline" class="text-xl"></ion-icon>
                </button>
                <button v-if="leave.status === 'pending'" @click="openRejectModal(leave)" class="text-orange-600 hover:text-orange-900">
                  <ion-icon name="close-circle-outline" class="text-xl"></ion-icon>
                </button>
                <button @click="confirmDelete(leave)" class="text-red-600 hover:text-red-900">
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
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  {{ editingLeave ? 'Edit Permintaan Cuti' : 'Tambah Permintaan Cuti' }}
                </DialogTitle>

                <form @submit.prevent="saveLeave" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Karyawan <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.employee_id" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent">
                      <option value="">Pilih Karyawan</option>
                      <option v-for="emp in employees" :key="emp.id" :value="emp.id">{{ emp.name }} ({{ emp.employee_id }})</option>
                    </select>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Mulai <span class="text-red-500">*</span>
                      </label>
                      <input v-model="form.start_date" type="date" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        Tanggal Akhir <span class="text-red-500">*</span>
                      </label>
                      <input v-model="form.end_date" type="date" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Cuti <span class="text-red-500">*</span>
                    </label>
                    <select v-model="form.leave_type" required class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent">
                      <option value="annual">Tahunan</option>
                      <option value="sick">Sakit</option>
                      <option value="personal">Pribadi</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan</label>
                    <textarea v-model="form.reason" rows="3" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent" placeholder="Alasan cuti..."></textarea>
                  </div>

                  <div class="flex items-center justify-end space-x-3 pt-4">
                    <button type="button" @click="closeModal" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      Batal
                    </button>
                    <button type="submit" class="px-4 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition">
                      Simpan
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Reject Modal -->
    <TransitionRoot appear :show="isRejectModalOpen" as="template">
      <Dialog as="div" @close="closeRejectModal" class="relative z-50">
        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-black bg-opacity-25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95" enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
              <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4">
                  Tolak Permintaan Cuti
                </DialogTitle>

                <form @submit.prevent="rejectLeave" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Alasan Penolakan</label>
                    <textarea v-model="rejectForm.rejection_reason" rows="4" class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent" placeholder="Masukkan alasan penolakan..."></textarea>
                  </div>

                  <div class="flex items-center justify-end space-x-3 pt-4">
                    <button type="button" @click="closeRejectModal" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                      Batal
                    </button>
                    <button type="submit" class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                      Tolak
                    </button>
                  </div>
                </form>
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
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

// Data
const loading = ref(false)
const isModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const editingLeave = ref<any>(null)
const rejectingLeave = ref<any>(null)

const leaveRequests = ref<any[]>([])
const employees = ref<any[]>([])

const filters = ref({
  status: '',
  employee_id: '',
  month: '',
  year: '',
})

const form = ref({
  employee_id: '',
  start_date: '',
  end_date: '',
  leave_type: 'annual',
  reason: '',
})

const rejectForm = ref({
  rejection_reason: '',
})

const months = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]

const years = computed(() => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i)
})

// Methods
const loadLeaveRequests = async () => {
  loading.value = true
  try {
    const params: any = {}
    if (filters.value.status) params.status = filters.value.status
    if (filters.value.employee_id) params.employee_id = filters.value.employee_id
    if (filters.value.month) params.month = filters.value.month
    if (filters.value.year) params.year = filters.value.year

    const response = await api.get('/leave-requests', { params })
    leaveRequests.value = response.data.data
  } catch (error) {
    console.error('Error loading leave requests:', error)
  } finally {
    loading.value = false
  }
}

const loadEmployees = async () => {
  try {
    const response = await api.get('/employees')
    employees.value = response.data.data.filter((e: any) => e.status === 'active')
  } catch (error) {
    console.error('Error loading employees:', error)
  }
}

const openCreateModal = () => {
  editingLeave.value = null
  form.value = {
    employee_id: '',
    start_date: '',
    end_date: '',
    leave_type: 'annual',
    reason: '',
  }
  isModalOpen.value = true
}

const openEditModal = (leave: any) => {
  editingLeave.value = leave
  form.value = {
    employee_id: leave.employee_id,
    start_date: leave.start_date,
    end_date: leave.end_date,
    leave_type: leave.leave_type,
    reason: leave.reason || '',
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  editingLeave.value = null
}

const saveLeave = async () => {
  try {
    if (editingLeave.value) {
      await api.put(`/leave-requests/${editingLeave.value.id}`, form.value)
    } else {
      await api.post('/leave-requests', form.value)
    }
    closeModal()
    loadLeaveRequests()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menyimpan permintaan cuti')
  }
}

const approveLeave = async (leave: any) => {
  if (!confirm(`Setujui permintaan cuti ${leave.employee?.name}?`)) return

  try {
    await api.post(`/leave-requests/${leave.id}/approve`)
    loadLeaveRequests()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menyetujui permintaan cuti')
  }
}

const openRejectModal = (leave: any) => {
  rejectingLeave.value = leave
  rejectForm.value.rejection_reason = ''
  isRejectModalOpen.value = true
}

const closeRejectModal = () => {
  isRejectModalOpen.value = false
  rejectingLeave.value = null
}

const rejectLeave = async () => {
  try {
    await api.post(`/leave-requests/${rejectingLeave.value.id}/reject`, rejectForm.value)
    closeRejectModal()
    loadLeaveRequests()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menolak permintaan cuti')
  }
}

const confirmDelete = async (leave: any) => {
  if (!confirm(`Hapus permintaan cuti ${leave.employee?.name}?`)) return

  try {
    await api.delete(`/leave-requests/${leave.id}`)
    loadLeaveRequests()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menghapus permintaan cuti')
  }
}

const viewLeave = (leave: any) => {
  alert(`Detail:\n\nKaryawan: ${leave.employee?.name}\nTanggal: ${formatDate(leave.start_date)} - ${formatDate(leave.end_date)}\nDurasi: ${leave.duration_days} hari\nJenis: ${getLeaveTypeLabel(leave.leave_type)}\nAlasan: ${leave.reason || '-'}\nStatus: ${getStatusLabel(leave.status)}${leave.rejection_reason ? '\nAlasan Penolakan: ' + leave.rejection_reason : ''}`)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
  }
  return labels[status] || status
}

const getLeaveTypeClass = (type: string) => {
  const classes: Record<string, string> = {
    annual: 'bg-blue-100 text-blue-800',
    sick: 'bg-orange-100 text-orange-800',
    personal: 'bg-purple-100 text-purple-800',
    other: 'bg-gray-100 text-gray-800',
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getLeaveTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    annual: 'Tahunan',
    sick: 'Sakit',
    personal: 'Pribadi',
    other: 'Lainnya',
  }
  return labels[type] || type
}

onMounted(() => {
  loadLeaveRequests()
  loadEmployees()
})
</script>
