<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="document-text" class="text-[#739b1a]"></ion-icon> Buku Register Gizi
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Laporan Kunjungan Pasien Rawat Inap & Intervensi Dietetik.
        </p>
      </div>
      <div>
        <button
          @click="openModal()"
          class="px-5 py-2.5 bg-[#739b1a] text-white font-bold rounded-xl hover:bg-[#5f8016] transition-all shadow-sm flex items-center gap-2 text-sm"
        >
          <ion-icon name="add-circle-outline" class="text-lg"></ion-icon>
          Tambah Kunjungan Baru
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header actions / filters -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex gap-3 items-center">
            <div class="relative">
                <select v-model="filterMonth" class="pl-10 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] appearance-none font-medium">
                    <option value="">Semua Bulan</option>
                    <option v-for="m in 12" :key="m" :value="m">{{ new Date(2024, m - 1, 1).toLocaleString('id-ID', { month: 'long' }) }}</option>
                </select>
                <ion-icon name="calendar-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
                <ion-icon name="chevron-down-outline" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"></ion-icon>
            </div>
            <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Cari Nama / No RM..." class="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] w-64" />
                <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
            </div>
        </div>
        <button @click="fetchVisits" class="p-2 text-gray-500 hover:text-[#739b1a] hover:bg-gray-50 rounded-lg transition-colors" title="Refresh Data">
            <ion-icon name="refresh-outline" class="text-xl"></ion-icon>
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left whitespace-nowrap">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 font-bold">No</th>
              <th class="px-4 py-3 font-bold">Ahli Gizi</th>
              <th class="px-4 py-3 font-bold">Tgl. Kunj</th>
              <th class="px-4 py-3 font-bold">No RM</th>
              <th class="px-4 py-3 font-bold">Nama Pasien</th>
              <th class="px-4 py-3 font-bold">Ruangan</th>
              <th class="px-4 py-3 font-bold">Diagnosis</th>
              <th class="px-4 py-3 font-bold">Diet</th>
              <th class="px-4 py-3 font-bold text-center">IMT</th>
              <th class="px-4 py-3 font-bold text-center">St. Gizi</th>
              <th class="px-4 py-3 font-bold text-center">Risiko Malnutrisi</th>
              <th class="px-4 py-3 font-bold text-center">Tindakan</th>
              <th class="px-4 py-3 font-bold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b">
                <td colspan="13" class="px-4 py-8 text-center text-gray-500">
                    <ion-icon name="sync-outline" class="text-2xl animate-spin mx-auto block mb-2 text-[#739b1a]"></ion-icon>
                    Memuat data kunjungan...
                </td>
            </tr>
            <tr v-else-if="filteredVisits.length === 0" class="border-b">
                <td colspan="13" class="px-4 py-12 text-center">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 text-gray-400">
                      <ion-icon name="folder-open-outline" class="text-3xl"></ion-icon>
                    </div>
                    <p class="text-gray-500 font-medium">Belum ada catatan kunjungan.</p>
                </td>
            </tr>
            <tr v-else v-for="(visit, index) in filteredVisits" :key="visit.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-4 py-3 font-medium text-gray-900">{{ index + 1 }}</td>
              <td class="px-4 py-3 text-gray-600">{{ visit.nutritionist?.name?.split(' ')[0] || '-' }}</td>
              <td class="px-4 py-3">
                  <span class="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      <ion-icon name="calendar" class="text-gray-400"></ion-icon>
                      {{ formatDate(visit.visit_date) }}
                  </span>
              </td>
              <td class="px-4 py-3 font-mono text-xs text-[#739b1a] font-bold">{{ visit.patient?.no_rm }}</td>
              <td class="px-4 py-3">
                  <p class="font-bold text-gray-900">{{ visit.patient?.name }}</p>
                  <p class="text-xs text-gray-500">{{ visit.patient?.age ? `${visit.patient.age} thn` : '-' }}</p>
              </td>
              <td class="px-4 py-3 font-medium text-gray-600">{{ visit.room_number || '-' }}</td>
              <td class="px-4 py-3 text-xs text-gray-600 max-w-[150px] truncate" :title="visit.medical_diagnosis">{{ visit.medical_diagnosis || '-' }}</td>
              <td class="px-4 py-3 text-xs text-gray-600 font-bold whitespace-normal max-w-[100px]">{{ visit.diet_prescription || '-' }}</td>
              <td class="px-4 py-3 text-center">
                  <span v-if="visit.bmi" class="font-mono text-xs font-bold">{{ visit.bmi }}</span>
                  <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-4 py-3 text-center">
                  <span v-if="visit.nutritional_status" class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                        :class="getStatusColor(visit.nutritional_status)">
                      {{ visit.nutritional_status }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-4 py-3 text-center">
                   <span v-if="visit.malnutrition_risk" class="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide"
                        :class="getRiskColor(visit.malnutrition_risk)">
                      {{ visit.malnutrition_risk }}
                  </span>
                  <span v-else class="text-gray-300">-</span>
              </td>
              <td class="px-4 py-3 text-center">
                  <div class="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-400">
                      <span :class="visit.is_emr_filled ? 'text-[#739b1a]' : 'opacity-40'" title="EMR">EMR</span>•
                      <span :class="visit.is_educated ? 'text-blue-500' : 'opacity-40'" title="Edukasi">EDU</span>•
                      <span :class="visit.is_care_provided ? 'text-orange-500' : 'opacity-40'" title="Asuhan">ASU</span>
                  </div>
              </td>
              <td class="px-4 py-3 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openModal(visit)" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit">
                    <ion-icon name="create-outline" class="text-lg"></ion-icon>
                  </button>
                  <button @click="deleteVisit(visit.id)" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Hapus">
                    <ion-icon name="trash-outline" class="text-lg"></ion-icon>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <TransitionRoot appear :show="isModalOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-50">
        <!-- Backdrop -->
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto w-screen h-screen">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 translate-y-8 scale-95"
              enter-to="opacity-100 translate-y-0 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 translate-y-0 scale-100"
              leave-to="opacity-0 translate-y-8 scale-95"
            >
              <DialogPanel class="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col max-h-[90vh]">
                <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-[#739b1a]/5">
                    <DialogTitle as="h3" class="text-lg font-bold text-[#16200B] flex items-center gap-2">
                        <ion-icon :name="isEditing ? 'create' : 'add-circle'" class="text-[#739b1a] text-xl"></ion-icon>
                        {{ isEditing ? 'Edit Catatan Kunjungan' : 'Tambah Kunjungan Gizi Baru' }}
                    </DialogTitle>
                    <button @click="closeModal" class="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors focus:outline-none">
                        <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                    </button>
                </div>
                
                <div class="p-6 overflow-y-auto flex-1">
                <form @submit.prevent="saveVisit" class="space-y-6">
                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ion-icon name="person-circle-outline"></ion-icon> Identitas Pasien</h4>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">No. RM *</label>
                                <input v-model="form.no_rm" type="text" required class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a] font-mono font-bold" />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Nama Pasien *</label>
                                <input v-model="form.name" type="text" required class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Usia (Thn)</label>
                                <input v-model="form.age" type="number" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Tgl Masuk</label>
                                <input v-model="form.admission_date" type="date" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Tgl Kunjungan *</label>
                                <input v-model="form.visit_date" type="date" required class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Ruangan</label>
                                <input v-model="form.room_number" type="text" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a] font-mono" />
                            </div>
                        </div>
                    </div>

                    <hr class="border-gray-100" />

                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ion-icon name="medkit-outline"></ion-icon> Kondisi Klinis & Antropometri</h4>
                        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Diagnosis Medis</label>
                                <input v-model="form.medical_diagnosis" type="text" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div class="md:col-span-2">
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Diet</label>
                                <div class="flex flex-wrap gap-2">
                                    <button 
                                        v-for="diet in dietsList" 
                                        :key="diet.id"
                                        type="button"
                                        @click="toggleDiet(diet)"
                                        :class="[
                                            'px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors',
                                            form.diet_prescription.includes(diet.abbreviation || diet.name) 
                                                ? 'bg-[#739b1a] text-white border-[#739b1a] shadow-sm' 
                                                : 'bg-white text-gray-600 border-gray-200 hover:border-[#739b1a] hover:bg-gray-50'
                                        ]"
                                    >
                                        {{ diet.abbreviation || diet.name }}
                                    </button>
                                </div>
                                <p class="text-[10px] text-gray-400 mt-2">*Klik untuk memilih (bisa lebih dari satu).</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">BB (kg)</label>
                                <input v-model.number="form.weight" @input="calculateBMI" type="number" step="0.1" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">TB (Meter)</label>
                                <input v-model.number="form.height" @input="calculateBMI" type="number" step="0.01" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">IMT</label>
                                <input v-model.number="form.bmi" type="number" step="0.01" readonly class="w-full p-2 bg-gray-100 border border-gray-200 rounded-lg text-sm font-mono font-bold text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Status Gizi</label>
                                <select v-model="form.nutritional_status" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#739b1a]">
                                    <option value="">-- Pilih --</option>
                                    <option value="Kurang">Kurang</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Overweight">Overweight</option>
                                    <option value="Obesitas">Obesitas</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-gray-700 mb-1.5">Risiko Malnutrisi</label>
                                <select v-model="form.malnutrition_risk" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-[#739b1a]">
                                    <option value="">-- Pilih --</option>
                                    <option value="Tidak berisiko">Tidak berisiko</option>
                                    <option value="Risiko malnutrisi">Risiko malnutrisi</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <hr class="border-gray-100" />

                    <div>
                        <h4 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><ion-icon name="checkbox-outline"></ion-icon> Tindakan</h4>
                        <div class="flex flex-wrap gap-6 mb-4">
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input v-model="form.is_emr_filled" type="checkbox" class="w-4 h-4 text-[#739b1a] rounded border-gray-300 focus:ring-[#739b1a]" />
                                <span class="text-sm font-bold text-gray-700 group-hover:text-[#739b1a]">EMR</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input v-model="form.is_educated" type="checkbox" class="w-4 h-4 text-[#739b1a] rounded border-gray-300 focus:ring-[#739b1a]" />
                                <span class="text-sm font-bold text-gray-700 group-hover:text-[#739b1a]">Edukasi Gizi</span>
                            </label>
                            <label class="flex items-center gap-2 cursor-pointer group">
                                <input v-model="form.is_care_provided" type="checkbox" class="w-4 h-4 text-[#739b1a] rounded border-gray-300 focus:ring-[#739b1a]" />
                                <span class="text-sm font-bold text-gray-700 group-hover:text-[#739b1a]">Asuhan Gizi</span>
                            </label>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-700 mb-1.5">Keterangan Khusus</label>
                            <textarea v-model="form.remarks" rows="2" class="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#739b1a]" placeholder="#teh #santan..."></textarea>
                        </div>
                    </div>
                </form>
            </div>

            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 z-10">
                <button @click="closeModal" type="button" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">Batal</button>
                <button @click="saveVisit" :disabled="saving" class="px-6 py-2.5 bg-[#739b1a] text-white font-bold rounded-xl hover:bg-[#5f8016] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <ion-icon v-if="saving" name="sync-outline" class="animate-spin"></ion-icon>
                    <ion-icon v-else name="save-outline"></ion-icon>
                    {{ saving ? 'Menyimpan...' : 'Simpan Kunjungan' }}
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
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

const visits = ref<any[]>([])
const dietsList = ref<any[]>([])
const loading = ref(false)
const filterMonth = ref<string>('')
const searchQuery = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const getTodayDate = () => new Date().toISOString().split('T')[0]

// Initial form state
const defaultForm = {
    id: null as number | null,
    no_rm: '',
    name: '',
    age: null as number | null,
    admission_date: '',
    visit_date: getTodayDate(),
    room_number: '',
    medical_diagnosis: '',
    diet_prescription: [] as string[],
    weight: null as number | null,
    height: null as number | null,
    bmi: null as number | null,
    nutritional_status: '',
    malnutrition_risk: '',
    remarks: '',
    is_emr_filled: false,
    is_educated: false,
    is_care_provided: false,
}

const form = ref({ ...defaultForm })

// Computeds
const filteredVisits = computed(() => {
    let result = visits.value
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(v => 
            v.patient?.name?.toLowerCase().includes(q) || 
            v.patient?.no_rm?.toLowerCase().includes(q)
        )
    }
    return result
})

// Methods
const toggleDiet = (diet: any) => {
    const dietVal = diet.abbreviation || diet.name
    const index = form.value.diet_prescription.indexOf(dietVal)
    if (index === -1) {
        form.value.diet_prescription.push(dietVal)
    } else {
        form.value.diet_prescription.splice(index, 1)
    }
}

const fetchDiets = async () => {
    try {
        const { data } = await api.get('/diets')
        dietsList.value = data
    } catch (error) {
        console.error('Failed to fetch diets', error)
    }
}

const fetchVisits = async () => {
    loading.value = true
    try {
        const params: any = {}
        if (filterMonth.value) params.month = filterMonth.value
        
        const { data } = await api.get('/nutritional-visits', { params })
        visits.value = data
    } catch (error) {
        console.error('Failed to fetch visits', error)
    } finally {
        loading.value = false
    }
}

const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    return `${d.getDate()}/${d.getMonth()+1}`
}

const calculateBMI = () => {
    if (form.value.weight && form.value.height && form.value.height > 0) {
        let h = form.value.height
        if (h > 3) h = h / 100 // auto convert cm to m
        
        const bmi = form.value.weight / (h * h)
        form.value.bmi = parseFloat(bmi.toFixed(2))
        
        if (bmi < 18.5) form.value.nutritional_status = 'Kurang'
        else if (bmi <= 24.9) form.value.nutritional_status = 'Normal'
        else if (bmi <= 29.9) form.value.nutritional_status = 'Overweight'
        else form.value.nutritional_status = 'Obesitas'
    } else {
        form.value.bmi = null
        form.value.nutritional_status = ''
    }
}

const openModal = (visitToEdit: any = null) => {
    if (visitToEdit) {
        isEditing.value = true
        form.value = {
            id: visitToEdit.id,
            no_rm: visitToEdit.patient.no_rm,
            name: visitToEdit.patient.name,
            age: visitToEdit.patient.age,
            admission_date: visitToEdit.admission_date ? visitToEdit.admission_date.split('T')[0] : '',
            visit_date: visitToEdit.visit_date ? visitToEdit.visit_date.split('T')[0] : getTodayDate(),
            room_number: visitToEdit.room_number,
            medical_diagnosis: visitToEdit.medical_diagnosis,
            diet_prescription: visitToEdit.diet_prescription ? visitToEdit.diet_prescription.split(', ') : [],
            weight: visitToEdit.weight ? parseFloat(visitToEdit.weight) : null,
            height: visitToEdit.height ? parseFloat(visitToEdit.height) : null,
            bmi: visitToEdit.bmi ? parseFloat(visitToEdit.bmi) : null,
            nutritional_status: visitToEdit.nutritional_status || '',
            malnutrition_risk: visitToEdit.malnutrition_risk || '',
            remarks: visitToEdit.remarks || '',
            is_emr_filled: visitToEdit.is_emr_filled === 1 || visitToEdit.is_emr_filled === true,
            is_educated: visitToEdit.is_educated === 1 || visitToEdit.is_educated === true,
            is_care_provided: visitToEdit.is_care_provided === 1 || visitToEdit.is_care_provided === true,
        }
    } else {
        isEditing.value = false
        form.value = { ...defaultForm }
    }
    isModalOpen.value = true
}

const closeModal = () => {
    isModalOpen.value = false
}

const saveVisit = async () => {
    if (!form.value.no_rm || !form.value.name || !form.value.visit_date) return
    saving.value = true
    try {
        const payload = {
            ...form.value,
            diet_prescription: Array.isArray(form.value.diet_prescription) ? form.value.diet_prescription.join(', ') : form.value.diet_prescription
        }
        if (isEditing.value && form.value.id) {
            await api.put(`/nutritional-visits/${form.value.id}`, payload)
        } else {
            await api.post('/nutritional-visits', payload)
        }
        await fetchVisits()
        closeModal()
    } catch (e:any) {
        console.error(e)
        alert('Terjadi kesalahan saat menyimpan data.')
    } finally {
        saving.value = false
    }
}

const deleteVisit = async (id: number) => {
    if(!confirm('Anda yakin ingin menghapus data kunjungan ini?')) return
    try {
        await api.delete(`/nutritional-visits/${id}`)
        await fetchVisits()
    } catch(e) {
         alert('Gagal menghapus data')
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Normal': return 'bg-emerald-100 text-emerald-700'
        case 'Kurang': return 'bg-amber-100 text-amber-700'
        case 'Overweight': return 'bg-blue-100 text-blue-700'
        case 'Obesitas': return 'bg-red-100 text-red-700'
        default: return 'bg-gray-100 text-gray-700'
    }
}

const getRiskColor = (risk: string) => {
    return risk === 'Tidak berisiko' 
        ? 'bg-blue-50 text-blue-600' 
        : (risk ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-500')
}

onMounted(() => {
    fetchVisits()
    fetchDiets()
})
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}
@keyframes slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-up {
  animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
