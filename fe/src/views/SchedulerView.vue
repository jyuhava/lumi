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
      <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
        <!-- Calendar Header -->
        <div class="inline-flex min-w-full">
          <div class="sticky left-0 z-10 bg-gray-50 border-b border-r">
            <button 
              @click="togglePositionSort"
              class="w-48 p-3 text-center font-semibold text-gray-700 hover:bg-gray-100 transition flex items-center justify-center space-x-2"
            >
              <span>Karyawan</span>
              <ion-icon 
                v-if="positionSort === 'asc'" 
                name="arrow-up-outline" 
                class="text-sm"
              ></ion-icon>
              <ion-icon 
                v-else-if="positionSort === 'desc'" 
                name="arrow-down-outline" 
                class="text-sm"
              ></ion-icon>
              <ion-icon 
                v-else
                name="swap-vertical-outline" 
                class="text-sm text-gray-400"
              ></ion-icon>
            </button>
          </div>
          <div class="flex bg-gray-50 border-b">
            <div v-for="day in daysInMonth" :key="day.date" class="border-r min-w-[80px]">
              <div class="p-3 text-center">
                <div class="text-xs text-gray-600">{{ day.dayName }}</div>
                <div class="text-sm font-semibold text-gray-900">{{ day.dayNumber }}</div>
              </div>
            </div>
            <div class="border-r-0 min-w-[100px] bg-blue-50">
              <div class="p-3 text-center">
                <div class="text-xs text-blue-600">Total</div>
                <div class="text-sm font-semibold text-blue-900">Hadir</div>
              </div>
            </div>
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
          <div v-for="employee in sortedEmployees" :key="employee.id" class="inline-flex min-w-full hover:bg-gray-50 transition">
            <!-- Employee Name -->
            <div class="sticky left-0 z-10 bg-white border-r w-48 p-3 flex items-center">
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
            <div class="flex">
              <div
                v-for="day in daysInMonth"
                :key="`${employee.id}-${day.date}`"
                class="border-r min-w-[80px] min-h-[60px] p-1"
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
              
              <!-- Total Hadir Column -->
              <div class="border-r-0 min-w-[100px] min-h-[60px] p-1 bg-blue-50">
                <div class="h-full rounded-lg p-2 flex items-center justify-center">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-blue-900">{{ getTotalPresent(employee.id) }}</p>
                    <p class="text-[10px] text-blue-600 mt-0.5">hari</p>
                  </div>
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
          <div class="grid grid-cols-2 gap-3">
            <div class="flex items-center space-x-2">
              <input v-model="generateForm.random_assignment" type="checkbox" id="random" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="random" class="text-sm text-gray-700">Random Assignment</label>
            </div>

            <div class="flex items-center space-x-2">
              <input v-model="generateForm.use_approved_leaves" type="checkbox" id="use_approved_leaves" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="use_approved_leaves" class="text-sm text-gray-700">Gunakan cuti yang sudah disetujui</label>
            </div>

            <div class="flex items-center space-x-2">
              <input v-model="generateForm.include_saturday" type="checkbox" id="include_saturday" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="include_saturday" class="text-sm text-gray-700">Sabtu Masuk</label>
            </div>

            <div class="flex items-center space-x-2">
              <input v-model="generateForm.include_sunday" type="checkbox" id="include_sunday" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="include_sunday" class="text-sm text-gray-700">Minggu Masuk</label>
            </div>

            <div class="flex items-center space-x-2 col-span-2">
              <input v-model="generateForm.use_5_1_pattern" type="checkbox" id="use_5_1_pattern" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="use_5_1_pattern" class="text-sm text-gray-700">Pola 5 Hari Kerja, 1 Hari Off (berurutan per karyawan)</label>
            </div>

            <div class="flex items-center space-x-2 col-span-2">
              <input v-model="generateForm.overwrite" type="checkbox" id="overwrite" class="w-4 h-4 text-[#5F9EA0] border-gray-300 rounded focus:ring-[#5F9EA0]">
              <label for="overwrite" class="text-sm text-gray-700">Overwrite jadwal yang sudah ada</label>
            </div>
          </div>

          <!-- Position Requirements -->
          <div class="mt-4 pt-4 border-t">
            <label class="block text-sm font-medium text-gray-700 mb-3">Minimum Karyawan per Posisi (Opsional)</label>
            <div v-if="uniquePositions.length === 0" class="text-xs text-gray-500 italic">
              Tidak ada posisi tersedia. Tambahkan karyawan terlebih dahulu.
            </div>
            <div v-else class="space-y-2">
              <div v-for="position in uniquePositions" :key="position" class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <span class="text-sm font-medium text-gray-700">{{ position }}</span>
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-gray-500">Min:</label>
                  <input 
                    v-model.number="positionRequirementsMap[position]" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9EA0]"
                  >
                </div>
              </div>
              <p class="text-xs text-gray-500 italic mt-2">* Isi 0 atau kosongkan jika tidak ada batasan untuk posisi tersebut</p>
            </div>
          </div>

          <!-- Shift Limits -->
          <div class="mt-4 pt-4 border-t">
            <label class="block text-sm font-medium text-gray-700 mb-3">Maximum Karyawan per Shift (Opsional)</label>
            <div v-if="shifts.length === 0" class="text-xs text-gray-500 italic">
              Tidak ada shift tersedia. Tambahkan shift terlebih dahulu.
            </div>
            <div v-else class="space-y-2">
              <div v-for="shift in shifts" :key="shift.id" class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-medium text-gray-700">{{ shift.code }}</span>
                  <span class="text-xs text-gray-500">({{ shift.start_time }}-{{ shift.end_time }})</span>
                </div>
                <div class="flex items-center space-x-2">
                  <label class="text-xs text-gray-500">Max:</label>
                  <input 
                    v-model.number="shiftLimitsMap[shift.id]" 
                    type="number" 
                    min="0" 
                    placeholder="0" 
                    class="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-[#5F9EA0]"
                  >
                </div>
              </div>
              <p class="text-xs text-gray-500 italic mt-2">* Isi 0 atau kosongkan jika tidak ada batasan untuk shift tersebut</p>
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex items-center justify-end space-x-3">
          <button
            @click="generateAIPrompt"
            :disabled="generating || loadingLeaves"
            class="flex items-center space-x-2 px-4 py-2 bg-purple-50 text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-100 transition disabled:opacity-50"
          >
            <ion-icon name="sparkles-outline" class="text-xl"></ion-icon>
            <span v-if="loadingLeaves">Fetching Cuti...</span>
            <span v-else>Generate AI Prompt</span>
          </button>
          <div class="flex-1"></div>
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

    <!-- AI Prompt Modal -->
    <div v-if="showAIPromptModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div class="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div class="p-6 border-b flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-900">AI Prompt Generator</h3>
            <p class="text-sm text-gray-600 mt-1">Copy prompt ini ke ChatGPT atau AI lainnya untuk membantu membuat jadwal</p>
          </div>
          <button @click="showAIPromptModal = false" class="text-gray-400 hover:text-gray-600 transition">
            <ion-icon name="close-outline" class="text-2xl"></ion-icon>
          </button>
        </div>

        <div class="p-6 overflow-y-auto flex-1">
          <textarea 
            v-model="aiPromptText" 
            readonly 
            rows="15" 
            class="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:ring-0 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="p-6 border-t flex items-center justify-end space-x-3">
          <button
            @click="showAIPromptModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Tutup
          </button>
          <button
            @click="copyPromptToClipboard"
            class="flex items-center space-x-2 px-6 py-2 bg-[#5F9EA0] text-white rounded-lg hover:bg-[#4F8E90] transition"
          >
            <ion-icon :name="copySuccess ? 'checkmark-outline' : 'copy-outline'" class="text-xl"></ion-icon>
            <span class="font-medium">{{ copySuccess ? 'Copied!' : 'Copy to Clipboard' }}</span>
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
const showAIPromptModal = ref(false)
const aiPromptText = ref('')
const loadingLeaves = ref(false)
const copySuccess = ref(false)
const positionSort = ref<'asc' | 'desc' | null>(null)

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
  use_approved_leaves: true,
  include_saturday: true,
  include_sunday: false,
  use_5_1_pattern: false,
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
const uniquePositions = computed(() => {
  const positions = employees.value
    .map((e: any) => e.position?.trim()) // Trim whitespace
    .filter(Boolean) // Remove null/undefined/empty
  const unique = [...new Set(positions)].sort()
  console.log('Employees count:', employees.value.length)
  console.log('All positions:', positions)
  console.log('Unique positions:', unique)
  return unique
})

const positionRequirementsMap = ref<Record<string, number>>({})
const shiftLimitsMap = ref<Record<number, number>>({})


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

const sortedEmployees = computed(() => {
  if (!positionSort.value) {
    return employees.value
  }
  
  return [...employees.value].sort((a, b) => {
    const posA = (a.position || '').toLowerCase()
    const posB = (b.position || '').toLowerCase()
    
    if (positionSort.value === 'asc') {
      return posA.localeCompare(posB)
    } else {
      return posB.localeCompare(posA)
    }
  })
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
    
    // Debug: log schedules data
    console.log('Loaded schedules:', schedules.value.length)
    console.log('Sample schedule:', schedules.value[0])
    console.log('Employees:', employees.value.length)
  } catch (error) {
    console.error('Error loading schedules:', error)
  } finally {
    loading.value = false
  }
}

const getSchedule = (employeeId: number, date: string) => {
  return schedules.value.find(s => {
    // Normalize both dates to YYYY-MM-DD format for comparison
    const scheduleDate = typeof s.schedule_date === 'string' 
      ? s.schedule_date.split('T')[0] 
      : s.schedule_date
    return s.employee_id === employeeId && scheduleDate === date
  })
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
    // Convert positionRequirementsMap to array format
    const position_requirements = Object.entries(positionRequirementsMap.value)
      .filter(([_, count]) => count > 0)
      .map(([position, min_count]) => ({ position, min_count }))

    // Convert shiftLimitsMap to array format
    const shift_limits = Object.entries(shiftLimitsMap.value)
      .filter(([_, count]) => count > 0)
      .map(([shift_id, max_count]) => ({ shift_id: parseInt(shift_id), max_count }))

    const payload = {
      ...generateForm.value,
      position_requirements,
      shift_limits
    }
    
    await api.post('/schedules/generate', payload)
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
  if (schedules.value.length === 0) {
    alert('Tidak ada jadwal untuk di-export')
    return
  }

  // Import xlsx dynamically
  import('xlsx').then((XLSX) => {
    // Prepare data for Excel
    const monthName = months.find(m => m.value === selectedMonth.value)?.label || ''
    const year = selectedYear.value
    
    // Create header row with dates
    const headerRow = ['Karyawan', 'Posisi']
    daysInMonth.value.forEach(day => {
      headerRow.push(`${day.dayNumber}\n${day.dayName}`)
    })
    headerRow.push('Total Hadir')
    
    // Create data rows for each employee
    const dataRows: any[][] = []
    employees.value.forEach((employee: any) => {
      const row = [employee.name, employee.position]
      
      daysInMonth.value.forEach(day => {
        const schedule = getSchedule(employee.id, day.date)
        let cellValue = ''
        
        if (schedule) {
          if (schedule.status === 'scheduled' && schedule.shift) {
            cellValue = `${schedule.shift.code}\n${schedule.shift.start_time}-${schedule.shift.end_time}`
          } else if (schedule.status === 'leave') {
            cellValue = 'CUTI'
          } else if (schedule.status === 'off') {
            cellValue = 'OFF'
          } else if (schedule.status === 'holiday') {
            cellValue = 'LIBUR'
          } else {
            cellValue = schedule.status.toUpperCase()
          }
        }
        
        row.push(cellValue)
      })
      
      // Add total present count
      row.push(getTotalPresent(employee.id))
      
      dataRows.push(row)
    })
    
    // Combine all rows
    const allRows = [
      [`Jadwal ${monthName} ${year}`], // Title
      [], // Empty row
      headerRow,
      ...dataRows
    ]
    
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(allRows)
    
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Karyawan
      { wch: 15 }, // Posisi
    ]
    daysInMonth.value.forEach(() => {
      colWidths.push({ wch: 12 }) // Date columns
    })
    ws['!cols'] = colWidths
    
    // Merge title cell
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headerRow.length - 1 } }
    ]
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, `${monthName} ${year}`)
    
    // Generate Excel file
    XLSX.writeFile(wb, `Jadwal_${monthName}_${year}.xlsx`)
  })
}

const generateAIPrompt = async () => {
  loadingLeaves.value = true
  try {
    // 1. Calculate previous month for context
    let prevMonth = generateForm.value.month - 1
    let prevYear = generateForm.value.year
    if (prevMonth === 0) {
      prevMonth = 12
      prevYear--
    }

    // 2. Fetch approved leaves AND previous month schedules
    const [leavesRes, prevSchedulesRes] = await Promise.all([
      api.get('/leave-requests', {
        params: {
          month: generateForm.value.month,
          year: generateForm.value.year,
          status: 'approved'
        }
      }),
      api.get('/schedules', {
        params: {
          month: prevMonth,
          year: prevYear
        }
      })
    ])

    const approvedLeaves = leavesRes.data.data
    const prevSchedules = prevSchedulesRes.data.data

    // 3. Get last 6 days of previous month for prompt context
    const daysInPrevMonth = new Date(prevYear, prevMonth, 0).getDate()
    const lastDaysContext: string[] = []
    
    // Sort prev schedules by date descending to get the last ones
    const sortedPrevSchedules = [...prevSchedules].sort((a, b) => 
      new Date(b.schedule_date).getTime() - new Date(a.schedule_date).getTime()
    )

    employees.value.forEach((emp: any) => {
      const empLastDays = sortedPrevSchedules
        .filter(s => s.employee_id === emp.id)
        .slice(0, 6) // Get last 6 days for 5-1 context
        .reverse()
        .map(s => {
          // Normalize schedule_date which might be ISO string
          const d = new Date(s.schedule_date)
          const day = d.getDate()
          const status = s.status === 'scheduled' ? (s.shift?.code || 'WORK') : s.status.toUpperCase()
          return `${day}:${status}`
        })
      
      if (empLastDays.length > 0) {
        lastDaysContext.push(`- ${emp.name}: ${empLastDays.join(', ')}`)
      }
    })

    // 4. Format Month/Year
    const monthName = months.find(m => m.value === generateForm.value.month)?.label
    const targetDate = `${monthName} ${generateForm.value.year}`

    // 5. Collect Employees
    const employeeList = employees.value.map(e => `- ${e.name} (Posisi: ${e.position})`).join('\n')

    // 6. Collect Shifts
    const shiftList = shifts.value.map(s => `- ${s.code}: ${s.name} (${s.start_time} - ${s.end_time})`).join('\n')

    // 7. Collect Constraints
    const constraints = [
      `Min Karyawan per Hari: ${generateForm.value.min_employees_per_day}`,
      `Max Karyawan per Hari: ${generateForm.value.max_employees_per_day}`,
      `Max Jam per Hari: ${generateForm.value.max_hours_per_day} jam`,
      `Max Jam per Minggu: ${generateForm.value.max_hours_per_week} jam`,
      `Max Jam per Bulan: ${generateForm.value.max_hours_per_month} jam`,
      `Sabtu Masuk: ${generateForm.value.include_saturday ? 'Ya' : 'Tidak'}`,
      `Minggu Masuk: ${generateForm.value.include_sunday ? 'Ya' : 'Tidak'}`,
      `Pola 5-1 Prioritas: ${generateForm.value.use_5_1_pattern ? 'Ya' : 'Tidak'}`
    ].join('\n')

    // 8. Collect Position Requirements
    const posReqs = Object.entries(positionRequirementsMap.value)
      .filter(([_, count]) => count > 0)
      .map(([pos, count]) => `- ${pos}: Min ${count} orang/hari`)
      .join('\n') || 'Tidak ada batasan posisi khusus.'

    // 9. Collect Shift Limits
    const sLimits = Object.entries(shiftLimitsMap.value)
      .filter(([_, count]) => count > 0)
      .map(([sid, count]) => {
        const shift = shifts.value.find(s => s.id === parseInt(sid))
        return `- ${shift?.code || sid}: Max ${count} orang`
      })
      .join('\n') || 'Tidak ada batasan shift khusus.'

    // 10. Collect Approved Leaves
    const leaveList = approvedLeaves.map((l: any) => {
      return `- ${l.employee.name}: ${l.start_date} s/d ${l.end_date} (${l.leave_type})`
    }).join('\n') || 'Tidak ada cuti yang disetujui untuk periode ini.'

    const prevMonthData = lastDaysContext.length > 0 
      ? `### KONTEKS JADWAL AKHIR BULAN LALU (${months.find(m => m.value === prevMonth)?.label}):\n(Format: Tanggal:Status)\n${lastDaysContext.join('\n')}\n\nPENTING: Gunakan data di atas untuk melanjutkan pola 5-1 (5 hari kerja, 1 hari off) agar tetap adil.`
      : '### KONTEKS JADWAL BULAN LALU:\nTidak ada data jadwal bulan lalu. Silakan mulai pola baru.'

    // 11. Construct Final Prompt
    aiPromptText.value = `Tolong buatkan jadwal kerja karyawan untuk bulan ${targetDate} dengan kriteria berikut:

${prevMonthData}

### DATA KARYAWAN:
${employeeList}

### DAFTAR SHIFT:
${shiftList}

### ATURAN UTAMA:
${constraints}

### KEBUTUHAN POSISI (Minimal per hari):
${posReqs}

### BATASAN SHIFT (Maksimal per hari):
${sLimits}

### DAFTAR CUTI (Karyawan TIDAK boleh dijadwalkan):
${leaveList}

### FORMAT OUTPUT:
Mohon buatkan jadwal dalam bentuk tabel Markdown dengan kolom: Tanggal, Nama Karyawan, dan Nama Shift. Pastikan distribusi shift adil dan semua aturan di atas terpenuhi.`

    showAIPromptModal.value = true
  } catch (error) {
    console.error('Error generating AI prompt:', error)
    alert('Gagal mengambil data untuk prompt')
  } finally {
    loadingLeaves.value = false
  }
}

const copyPromptToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(aiPromptText.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
    alert('Gagal menyalin teks ke clipboard')
  }
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

// Get total days present (scheduled status) for an employee
const getTotalPresent = (employeeId: number) => {
  return schedules.value.filter(s => 
    s.employee_id === employeeId && s.status === 'scheduled'
  ).length
}

// Toggle position sort
const togglePositionSort = () => {
  if (positionSort.value === null) {
    positionSort.value = 'asc'
  } else if (positionSort.value === 'asc') {
    positionSort.value = 'desc'
  } else {
    positionSort.value = null
  }
}
</script>
