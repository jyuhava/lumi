<template>
  <AdminLayout>
    <div class="space-y-6">
      <!-- Header with Actions -->
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Jadwal Karyawan</h2>
          <p class="text-sm text-gray-600 mt-1">Kelola jadwal shift karyawan bulanan</p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            @click="showGenerateModal = true"
            class="flex items-center space-x-2 px-4 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition"
          >
            <ion-icon name="sparkles-outline" class="text-xl"></ion-icon>
            <span class="font-medium">Generate Jadwal</span>
          </button>
          <button
            @click="exportSchedule"
            class="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            <ion-icon name="download-outline" class="text-xl"></ion-icon>
            <span class="font-medium">Export</span>
          </button>
        </div>
      </div>

      <!-- Month Selector -->
      <div class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ion-icon name="chevron-back-outline" class="text-2xl text-gray-600"></ion-icon>
        </button>
        
        <div class="flex items-center space-x-4">
          <select
            v-model="selectedMonth"
            @change="loadSchedules"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent"
          >
            <option v-for="month in months" :key="month.value" :value="month.value">
              {{ month.label }}
            </option>
          </select>
          <select
            v-model="selectedYear"
            @change="loadSchedules"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0] focus:border-transparent"
          >
            <option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>

        <button
          @click="nextMonth"
          class="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ion-icon name="chevron-forward-outline" class="text-2xl text-gray-600"></ion-icon>
        </button>
      </div>

      <!-- Statistics Panel -->
      <div v-if="statistics" class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total Jadwal</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statistics.total_schedules }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ion-icon name="calendar-outline" class="text-2xl text-blue-600"></ion-icon>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Karyawan Aktif</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ statistics.employee_statistics?.length || 0 }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <ion-icon name="people-outline" class="text-2xl text-green-600"></ion-icon>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Rata-rata Jam</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ averageHours }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ion-icon name="time-outline" class="text-2xl text-purple-600"></ion-icon>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Cuti/Sakit</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ totalLeaves }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ion-icon name="medical-outline" class="text-2xl text-orange-600"></ion-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <!-- Calendar Header -->
        <div class="grid grid-cols-8 bg-gray-50 border-b">
          <div class="p-3 text-center font-semibold text-gray-700 border-r">Karyawan</div>
          <div v-for="day in daysInMonth" :key="day.date" class="p-3 text-center border-r last:border-r-0">
            <div class="text-xs text-gray-600">{{ day.dayName }}</div>
            <div class="text-sm font-semibold text-gray-900">{{ day.dayNumber }}</div>
          </div>
        </div>

        <!-- Calendar Body -->
        <div v-if="loading" class="p-12 text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#5F9EA0]"></div>
          <p class="text-gray-600 mt-4">Memuat jadwal...</p>
        </div>

        <div v-else-if="employees.length === 0" class="p-12 text-center">
          <ion-icon name="people-outline" class="text-6xl text-gray-300"></ion-icon>
          <p class="text-gray-600 mt-4">Tidak ada karyawan aktif</p>
        </div>

        <div v-else class="divide-y">
          <div v-for="employee in employees" :key="employee.id" class="grid grid-cols-8 hover:bg-gray-50 transition">
            <!-- Employee Name -->
            <div class="p-3 border-r flex items-center">
              <div class="flex items-center space-x-2">
                <div class="w-8 h-8 bg-[#5F9EA0] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {{ employee.name.charAt(0) }}
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">{{ employee.name }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ employee.position }}</p>
                </div>
              </div>
            </div>

            <!-- Schedule Cells -->
            <div
              v-for="day in daysInMonth"
              :key="`${employee.id}-${day.date}`"
              class="p-1 border-r last:border-r-0 min-h-[60px]"
            >
              <div
                @click="editSchedule(employee, day.date)"
                :class="getScheduleClass(employee.id, day.date)"
                class="h-full rounded-lg p-2 cursor-pointer hover:opacity-80 transition"
              >
                <div v-if="getSchedule(employee.id, day.date)" class="text-center">
                  <p class="text-xs font-semibold">{{ getScheduleShift(employee.id, day.date) }}</p>
                  <p class="text-[10px] mt-0.5">{{ getScheduleTime(employee.id, day.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Generate Schedule Modal -->
    <div v-if="showGenerateModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold text-gray-900">Generate Jadwal Otomatis</h3>
          <p class="text-sm text-gray-600 mt-1">Atur parameter untuk generate jadwal bulanan</p>
        </div>

        <div class="p-6 space-y-4">
          <!-- Month/Year -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Bulan</label>
              <select v-model="generateForm.month" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
                <option v-for="month in months" :key="month.value" :value="month.value">{{ month.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
              <select v-model="generateForm.year" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
                <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
              </select>
            </div>
          </div>

          <!-- Employee Constraints -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Min Karyawan/Hari</label>
              <input v-model.number="generateForm.min_employees_per_day" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Karyawan/Hari</label>
              <input v-model.number="generateForm.max_employees_per_day" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            </div>
          </div>

          <!-- Work Hours Constraints -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Jam/Hari</label>
              <input v-model.number="generateForm.max_hours_per_day" type="number" min="1" max="24" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Jam/Minggu</label>
              <input v-model.number="generateForm.max_hours_per_week" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Max Jam/Bulan</label>
              <input v-model.number="generateForm.max_hours_per_month" type="number" min="1" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
            </div>
          </div>

          <!-- Options -->
          <div class="flex items-center space-x-2">
            <input v-model="generateForm.random_assignment" type="checkbox" id="random" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
            <label for="random" class="text-sm text-gray-700">Random Assignment</label>
          </div>

          <div class="flex items-center space-x-2">
            <input v-model="generateForm.overwrite" type="checkbox" id="overwrite" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
            <label for="overwrite" class="text-sm text-gray-700">Overwrite jadwal yang sudah ada</label>
          </div>
        </div>

        <div class="p-6 border-t flex items-center justify-end space-x-3">
          <button
            @click="showGenerateModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Batal
          </button>
          <button
            @click="generateSchedule"
            :disabled="generating"
            class="px-4 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition disabled:opacity-50"
          >
            <span v-if="generating">Generating...</span>
            <span v-else>Generate Jadwal</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Schedule Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div class="p-6 border-b">
          <h3 class="text-xl font-bold text-gray-900">Edit Jadwal</h3>
          <p class="text-sm text-gray-600 mt-1">{{ editForm.employee?.name }} - {{ editForm.date }}</p>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Shift</label>
            <select v-model="editForm.shift_id" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
              <option :value="null">Tidak ada shift (Off)</option>
              <option v-for="shift in shifts" :key="shift.id" :value="shift.id">
                {{ shift.name }} ({{ shift.start_time }} - {{ shift.end_time }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select v-model="editForm.status" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]">
              <option value="scheduled">Scheduled</option>
              <option value="leave">Cuti</option>
              <option value="sick">Sakit</option>
              <option value="holiday">Libur</option>
              <option value="off">Off</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catatan</label>
            <textarea v-model="editForm.notes" rows="3" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5F9EA0]"></textarea>
          </div>
        </div>

        <div class="p-6 border-t flex items-center justify-between">
          <button
            v-if="editForm.id"
            @click="deleteSchedule"
            class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            Hapus
          </button>
          <div class="flex items-center space-x-3 ml-auto">
            <button
              @click="showEditModal = false"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Batal
            </button>
            <button
              @click="saveSchedule"
              class="px-4 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

// Data
const loading = ref(false)
const generating = ref(false)
const showGenerateModal = ref(false)
const showEditModal = ref(false)

const selectedMonth = ref(new Date().getMonth() + 1)
const selectedYear = ref(new Date().getFullYear())

const schedules = ref<any[]>([])
const employees = ref<any[]>([])
const shifts = ref<any[]>([])
const statistics = ref<any>(null)

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

const generateForm = ref({
  month: selectedMonth.value,
  year: selectedYear.value,
  min_employees_per_day: 2,
  max_employees_per_day: 5,
  max_hours_per_day: 8,
  max_hours_per_week: 40,
  max_hours_per_month: 160,
  random_assignment: false,
  overwrite: false,
})

const editForm = ref<any>({
  id: null,
  employee: null,
  date: null,
  shift_id: null,
  status: 'scheduled',
  notes: '',
})

// Computed
const daysInMonth = computed(() => {
  const year = selectedYear.value
  const month = selectedMonth.value
  const daysCount = new Date(year, month, 0).getDate()
  const days = []

  for (let i = 1; i <= daysCount; i++) {
    const date = new Date(year, month - 1, i)
    days.push({
      date: `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`,
      dayNumber: i,
      dayName: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'][date.getDay()],
    })
  }

  return days
})

const averageHours = computed(() => {
  if (!statistics.value?.employee_statistics) return '0'
  const total = statistics.value.employee_statistics.reduce((sum: number, emp: any) => sum + emp.total_hours, 0)
  const avg = total / statistics.value.employee_statistics.length
  return avg.toFixed(1)
})

const totalLeaves = computed(() => {
  if (!statistics.value?.employee_statistics) return 0
  return statistics.value.employee_statistics.reduce((sum: number, emp: any) => 
    sum + emp.leave_days + emp.sick_days, 0)
})

// Methods
const loadSchedules = async () => {
  loading.value = true
  try {
    const [schedulesRes, employeesRes, shiftsRes, statsRes] = await Promise.all([
      api.get('/schedules', {
        params: {
          month: selectedMonth.value,
          year: selectedYear.value,
        },
      }),
      api.get('/employees'),
      api.get('/shifts'),
      api.get('/schedules/summary', {
        params: {
          month: selectedMonth.value,
          year: selectedYear.value,
        },
      }),
    ])

    schedules.value = schedulesRes.data.data
    employees.value = employeesRes.data.data.filter((e: any) => e.status === 'active')
    shifts.value = shiftsRes.data.data
    statistics.value = statsRes.data.data
  } catch (error) {
    console.error('Error loading schedules:', error)
  } finally {
    loading.value = false
  }
}

const getSchedule = (employeeId: number, date: string) => {
  return schedules.value.find(s => s.employee_id === employeeId && s.schedule_date === date)
}

const getScheduleClass = (employeeId: number, date: string) => {
  const schedule = getSchedule(employeeId, date)
  if (!schedule) return 'bg-gray-50'

  const statusColors: Record<string, string> = {
    scheduled: 'bg-[#5F9EA0] text-white',
    leave: 'bg-yellow-100 text-yellow-800',
    sick: 'bg-red-100 text-red-800',
    holiday: 'bg-purple-100 text-purple-800',
    off: 'bg-gray-100 text-gray-600',
  }

  return statusColors[schedule.status] || 'bg-gray-100'
}

const getScheduleShift = (employeeId: number, date: string) => {
  const schedule = getSchedule(employeeId, date)
  if (!schedule) return ''
  if (schedule.status !== 'scheduled') return schedule.status.toUpperCase()
  return schedule.shift?.code || 'N/A'
}

const getScheduleTime = (employeeId: number, date: string) => {
  const schedule = getSchedule(employeeId, date)
  if (!schedule || schedule.status !== 'scheduled' || !schedule.shift) return ''
  return `${schedule.shift.start_time}-${schedule.shift.end_time}`
}

const editSchedule = (employee: any, date: string) => {
  const schedule = getSchedule(employee.id, date)
  
  editForm.value = {
    id: schedule?.id || null,
    employee,
    date,
    shift_id: schedule?.shift_id || null,
    status: schedule?.status || 'scheduled',
    notes: schedule?.notes || '',
  }
  
  showEditModal.value = true
}

const saveSchedule = async () => {
  try {
    const payload = {
      employee_id: editForm.value.employee.id,
      shift_id: editForm.value.shift_id,
      schedule_date: editForm.value.date,
      status: editForm.value.status,
      notes: editForm.value.notes,
    }

    if (editForm.value.id) {
      await api.put(`/schedules/${editForm.value.id}`, payload)
    } else {
      await api.post('/schedules', payload)
    }

    showEditModal.value = false
    loadSchedules()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal menyimpan jadwal')
  }
}

const deleteSchedule = async () => {
  if (!confirm('Hapus jadwal ini?')) return

  try {
    await api.delete(`/schedules/${editForm.value.id}`)
    showEditModal.value = false
    loadSchedules()
  } catch (error) {
    alert('Gagal menghapus jadwal')
  }
}

const generateSchedule = async () => {
  generating.value = true
  try {
    await api.post('/schedules/generate', generateForm.value)
    showGenerateModal.value = false
    selectedMonth.value = generateForm.value.month
    selectedYear.value = generateForm.value.year
    loadSchedules()
  } catch (error: any) {
    alert(error.response?.data?.message || 'Gagal generate jadwal')
  } finally {
    generating.value = false
  }
}

const exportSchedule = () => {
  alert('Export feature coming soon!')
}

const previousMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
  loadSchedules()
}

const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
  loadSchedules()
}

onMounted(() => {
  loadSchedules()
})
</script>
