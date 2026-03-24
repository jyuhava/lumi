<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">Data Pasien</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola master data profil pasien untuk kebutuhan analisis gizi</p>
      </div>
      <button @click="openDialog()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 whitespace-nowrap">
        <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
        Pasien Baru
      </button>
    </div>

    <!-- Search Bar -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-md">
        <input type="text" v-model="searchQuery" @keyup.enter="fetchPatients(1)" placeholder="Cari Nama atau No. Rekam Medis (Enter)" class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition" />
        <ion-icon name="search-outline" class="absolute left-3 top-2.5 text-gray-400 text-lg"></ion-icon>
      </div>
      <button @click="fetchPatients(1)" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition">Cari</button>
    </div>

    <!-- Table Data -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full overflow-x-auto">
      <div v-if="loading" class="p-12 text-center text-gray-500 flex flex-col items-center">
        <ion-icon name="sync-outline" class="text-4xl animate-spin mb-2 text-indigo-500"></ion-icon>
        <p>Memuat data...</p>
      </div>
      
      <div v-else-if="patients.length === 0" class="p-12 text-center text-gray-500">
        <ion-icon name="people-outline" class="text-5xl text-gray-300 mb-3"></ion-icon>
        <p>Tidak ada data pasien ditemukan.</p>
      </div>
      
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No. RM</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Pasien</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Usia</th>
            <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</th>
            <th class="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="p in patients" :key="p.id" class="hover:bg-gray-50 transition">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-700">{{ p.no_rm }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">{{ p.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ p.age ? `${p.age} Thn` : '-' }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span v-if="p.gender === 'L'" class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-bold">Laki-laki</span>
              <span v-else-if="p.gender === 'P'" class="px-2 py-1 bg-pink-100 text-pink-800 rounded text-xs font-bold">Perempuan</span>
              <span v-else>-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <router-link :to="`/patients/${p.id}`" class="text-blue-600 hover:text-blue-900 mr-3 px-2 py-1 bg-blue-50 rounded inline-flex items-center gap-1"><ion-icon name="eye-outline"></ion-icon> View</router-link>
              <button @click="openDialog(p)" class="text-indigo-600 hover:text-indigo-900 mr-3 px-2 py-1 bg-indigo-50 rounded inline-flex items-center gap-1"><ion-icon name="create-outline"></ion-icon> Edit</button>
              <button @click="deletePatient(p.id, p.name)" class="text-red-600 hover:text-red-900 px-2 py-1 bg-red-50 rounded inline-flex items-center gap-1"><ion-icon name="trash-outline"></ion-icon> Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination.last_page > 1" class="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
        <div class="text-sm text-gray-500">
          Halaman <span class="font-medium text-gray-900">{{ pagination.current_page }}</span> dari <span class="font-medium text-gray-900">{{ pagination.last_page }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="fetchPatients(pagination.current_page - 1)" :disabled="pagination.current_page === 1" class="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50">Prev</button>
          <button @click="fetchPatients(pagination.current_page + 1)" :disabled="pagination.current_page === pagination.last_page" class="px-3 py-1 bg-white border border-gray-300 rounded text-sm disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>

    <!-- Modal Form (Create/Edit) -->
    <TransitionRoot appear :show="showModal" as="template">
      <Dialog as="div" @close="showModal = false" class="relative z-50">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm" />
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
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                <form @submit.prevent="savePatient">
                  <div class="bg-white px-6 pt-6 pb-6">
                    <DialogTitle as="h3" class="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-3">
                      {{ isEdit ? 'Edit Data Pasien' : 'Tambah Pasien Baru' }}
                    </DialogTitle>
                    
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">No. Rekam Medis <span class="text-red-500">*</span></label>
                        <input type="text" v-model="form.no_rm" required class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 border outline-none" placeholder="Contoh: RM-00123" />
                        <p v-if="errors.no_rm" class="text-red-500 text-xs mt-1">{{ errors.no_rm[0] }}</p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Pasien <span class="text-red-500">*</span></label>
                        <input type="text" v-model="form.name" required class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 border outline-none" placeholder="Budi Santoso" />
                        <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name[0] }}</p>
                      </div>
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
                          <input type="number" v-model="form.age" min="0" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 border outline-none" placeholder="Umur" />
                        </div>
                        <div>
                          <label class="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                          <select v-model="form.gender" class="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm px-4 py-2 border outline-none bg-white">
                            <option value="">Pilih Gender...</option>
                            <option value="L">Laki-laki (L)</option>
                            <option value="P">Perempuan (P)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
                    <button type="button" @click="showModal = false" class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition">
                      Batal
                    </button>
                    <button type="submit" :disabled="saving" class="px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition">
                      <ion-icon v-if="saving" name="sync-outline" class="animate-spin"></ion-icon>
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
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

const patients = ref<any[]>([])
const loading = ref(false)
const searchQuery = ref('')
const pagination = ref({ current_page: 1, last_page: 1 })

const showModal = ref(false)
const saving = ref(false)
const isEdit = ref(false)
const errors = ref<Record<string, any>>({})

const form = ref({
  id: null as null | number,
  no_rm: '',
  name: '',
  age: '' as string | number,
  gender: ''
})

const fetchPatients = async (page = 1) => {
  loading.value = true
  try {
    const { data } = await api.get('/patients', {
      params: { 
        paginate: true, 
        page, 
        search: searchQuery.value 
      }
    })
    patients.value = data.data
    pagination.value = {
      current_page: data.current_page,
      last_page: data.last_page
    }
  } catch (error) {
    console.error("Gagal menarik data pasien")
  } finally {
    loading.value = false
  }
}

const openDialog = (patient: any = null) => {
  errors.value = {}
  if (patient) {
    isEdit.value = true
    form.value = {
      id: patient.id,
      no_rm: patient.no_rm,
      name: patient.name,
      age: patient.age || '',
      gender: patient.gender || ''
    }
  } else {
    isEdit.value = false
    form.value = { id: null, no_rm: '', name: '', age: '', gender: '' }
  }
  showModal.value = true
}

const savePatient = async () => {
  saving.value = true
  errors.value = {}
  try {
    if (isEdit.value && form.value.id) {
      await api.put(`/patients/${form.value.id}`, form.value)
    } else {
      await api.post('/patients', form.value)
    }
    showModal.value = false
    fetchPatients(isEdit.value ? pagination.value.current_page : 1)
  } catch (error: any) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    } else {
      alert("Terjadi kesalahan saat menyimpan data.")
    }
  } finally {
    saving.value = false
  }
}

const deletePatient = async (id: number, name: string) => {
  if (confirm(`Apakah Anda yakin ingin menghapus data pasien: ${name}? (Perhatian: akan menghapus historis gizi pasien ini juga)`)) {
    try {
      await api.delete(`/patients/${id}`)
      fetchPatients(pagination.value.current_page)
    } catch (e) {
      alert('Gagal menghapus data pasien')
    }
  }
}

onMounted(() => {
  fetchPatients()
})
</script>
