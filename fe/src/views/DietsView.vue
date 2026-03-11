<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="restaurant" class="text-[#739b1a]"></ion-icon> Master Diet
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Kelola data nama dan singkatan tipe diet untuk mempermudah preskripsi.
        </p>
      </div>
      <div>
        <button
          @click="openModal()"
          class="px-5 py-2.5 bg-[#739b1a] text-white font-bold rounded-xl hover:bg-[#5f8016] transition-all shadow-sm flex items-center gap-2 text-sm"
        >
          <ion-icon name="add-circle-outline" class="text-lg"></ion-icon>
          Tambah Diet
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <!-- Table Header actions / filters -->
      <div class="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex gap-3 items-center">
            <div class="relative">
                <input v-model="searchQuery" type="text" placeholder="Cari Nama / Singkatan..." class="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#739b1a] w-64" />
                <ion-icon name="search-outline" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></ion-icon>
            </div>
        </div>
        <button @click="fetchDiets" class="p-2 text-gray-500 hover:text-[#739b1a] hover:bg-gray-50 rounded-lg transition-colors" title="Refresh Data">
            <ion-icon name="refresh-outline" class="text-xl"></ion-icon>
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead class="text-xs text-gray-500 uppercase bg-gray-50/50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 font-bold w-16 text-center">No</th>
              <th class="px-6 py-4 font-bold">Singkatan</th>
              <th class="px-6 py-4 font-bold">Nama Diet</th>
              <th class="px-6 py-4 font-bold">Keterangan</th>
              <th class="px-6 py-4 font-bold text-center w-24">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading" class="border-b">
                <td colspan="5" class="px-6 py-12 text-center text-gray-500">
                    <ion-icon name="sync-outline" class="text-3xl animate-spin mx-auto block mb-3 text-[#739b1a]"></ion-icon>
                    Memuat data...
                </td>
            </tr>
            <tr v-else-if="filteredDiets.length === 0" class="border-b">
                <td colspan="5" class="px-6 py-12 text-center">
                    <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100 text-gray-400">
                      <ion-icon name="restaurant-outline" class="text-3xl"></ion-icon>
                    </div>
                    <p class="text-gray-500 font-medium">Belum ada data diet.</p>
                </td>
            </tr>
            <tr v-else v-for="(diet, index) in filteredDiets" :key="diet.id" class="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4 font-medium text-gray-900 text-center">{{ index + 1 }}</td>
              <td class="px-6 py-4 font-mono text-sm text-[#739b1a] font-bold">{{ diet.abbreviation || '-' }}</td>
              <td class="px-6 py-4">
                  <p class="font-bold text-gray-900">{{ diet.name }}</p>
              </td>
              <td class="px-6 py-4 text-gray-600 max-w-md truncate" :title="diet.description || ''">{{ diet.description || '-' }}</td>
              <td class="px-6 py-4 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button @click="openModal(diet)" class="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <ion-icon name="create-outline" class="text-lg"></ion-icon>
                  </button>
                  <button @click="deleteDiet(diet.id)" class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
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
              <DialogPanel class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all flex flex-col">
                <div class="px-6 py-4 flex items-center justify-between border-b border-gray-100 bg-[#739b1a]/5">
                    <DialogTitle as="h3" class="text-lg font-bold text-[#16200B] flex items-center gap-2">
                        <ion-icon :name="isEditing ? 'create' : 'add-circle'" class="text-[#739b1a] text-xl"></ion-icon>
                        {{ isEditing ? 'Edit Data Diet' : 'Tambah Diet Baru' }}
                    </DialogTitle>
                    <button @click="closeModal" class="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors focus:outline-none">
                        <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                    </button>
                </div>
                
                <div class="p-6">
                    <form @submit.prevent="saveDiet" class="space-y-4">
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1.5">Nama Diet *</label>
                            <input v-model="form.name" type="text" required class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:border-transparent focus:ring-[#739b1a]" placeholder="Misal: Diet Jantung I" />
                        </div>
                        
                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1.5">Singkatan</label>
                            <input v-model="form.abbreviation" type="text" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:border-transparent focus:ring-[#739b1a] font-mono text-[#4a6825] font-bold" placeholder="Misal: DJ I" />
                        </div>

                        <div>
                            <label class="block text-sm font-bold text-gray-700 mb-1.5">Keterangan / Preskripsi</label>
                            <textarea v-model="form.description" rows="4" class="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:outline-none focus:border-transparent focus:ring-[#739b1a]" placeholder="Tinggi serat, rendah garam..."></textarea>
                        </div>
                    </form>
                </div>

                <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button @click="closeModal" type="button" class="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-sm">Batal</button>
                    <button @click="saveDiet" :disabled="saving" class="px-6 py-2.5 bg-[#739b1a] text-white font-bold rounded-xl hover:bg-[#5f8016] transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                        <ion-icon v-if="saving" name="sync-outline" class="animate-spin"></ion-icon>
                        <ion-icon v-else name="save-outline"></ion-icon>
                        {{ saving ? 'Menyimpan...' : 'Simpan' }}
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

interface Diet {
    id: number;
    name: string;
    abbreviation: string | null;
    description: string | null;
}

const diets = ref<Diet[]>([])
const loading = ref(false)
const searchQuery = ref('')

const isModalOpen = ref(false)
const isEditing = ref(false)
const saving = ref(false)

const defaultForm = {
    id: null as number | null,
    name: '',
    abbreviation: '',
    description: ''
}

const form = ref({ ...defaultForm })

const filteredDiets = computed(() => {
    let result = diets.value
    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(d => 
            d.name.toLowerCase().includes(q) || 
            (d.abbreviation && d.abbreviation.toLowerCase().includes(q))
        )
    }
    return result
})

const fetchDiets = async () => {
    loading.value = true
    try {
        const { data } = await api.get('/diets')
        diets.value = data
    } catch (error) {
        console.error('Failed to fetch diets', error)
    } finally {
        loading.value = false
    }
}

const openModal = (dietToEdit: Diet | null = null) => {
    if (dietToEdit) {
        isEditing.value = true
        form.value = {
            id: dietToEdit.id,
            name: dietToEdit.name,
            abbreviation: dietToEdit.abbreviation || '',
            description: dietToEdit.description || ''
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

const saveDiet = async () => {
    if (!form.value.name) return
    saving.value = true
    try {
        if (isEditing.value && form.value.id) {
            await api.put(`/diets/${form.value.id}`, form.value)
        } else {
            await api.post('/diets', form.value)
        }
        await fetchDiets()
        closeModal()
    } catch (e: any) {
        console.error(e)
        alert('Terjadi kesalahan saat menyimpan data.')
    } finally {
        saving.value = false
    }
}

const deleteDiet = async (id: number) => {
    if(!confirm('Anda yakin ingin menghapus data diet ini?')) return
    try {
        await api.delete(`/diets/${id}`)
        await fetchDiets()
    } catch(e) {
         alert('Gagal menghapus data')
    }
}

onMounted(() => {
    fetchDiets()
})
</script>
