<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">Database Makanan</h1>
        <p class="text-sm text-gray-500 mt-1">Kelola data makanan sistem, kustom, atau cari dari Open Food Facts</p>
      </div>
      
      <button
        @click="openCreateModal"
        class="flex items-center space-x-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <ion-icon name="add-circle-outline" class="text-xl"></ion-icon>
        <span>Tambah Makanan</span>
      </button>
    </div>

    <!-- Search Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-4 relative">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ion-icon name="search-outline" class="text-gray-400 text-xl"></ion-icon>
          </div>
          <input
            v-model="searchQuery"
            @keyup.enter="handleSearch(1)"
            type="text"
            placeholder="Cari nama makanan atau Barcode..."
            class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>
        <div class="flex gap-2 relative overflow-x-auto pb-1">
          <button @click="searchMode = 'local'; handleSearch(1)" :class="searchMode === 'local' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-300'" class="px-4 py-2.5 border rounded-lg hover:bg-indigo-50 transition font-medium whitespace-nowrap">Lokal Database</button>
          
          <button @click="searchMode = 'tkpi'; handleSearch(1)" :class="searchMode === 'tkpi' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-300'" class="px-4 py-2.5 border rounded-lg hover:bg-indigo-50 transition font-medium flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
            <ion-icon name="library-outline"></ion-icon> TKPI (Indonesia)
          </button>
          
          <button @click="searchMode = 'external'; handleSearch(1)" :class="searchMode === 'external' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 border-gray-300'" class="px-4 py-2.5 border rounded-lg hover:bg-indigo-50 transition font-medium flex-shrink-0 flex items-center gap-2 whitespace-nowrap">
            <ion-icon name="globe-outline"></ion-icon> Open Food Facts
          </button>
        </div>
      </div>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div v-if="loading" class="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
        <ion-icon name="sync-outline" class="text-4xl text-indigo-600 animate-spin"></ion-icon>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sumber</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Makanan</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energi (kkal)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protein (g)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lemak (g)</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Karbo (g)</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="food in foods" :key="food.id || food.barcode || food.name">
              <td class="px-6 py-4 whitespace-nowrap">
                <span v-if="food.source === 'system'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Sistem</span>
                <span v-else-if="food.source === 'custom'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Kustom</span>
                <span v-else-if="food.source === 'tkpi'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">TKPI/IDN</span>
                <span v-else class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">External</span>
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-gray-900 max-w-[200px] truncate" :title="food.name">{{ food.name }}</div>
                <div class="text-xs text-gray-500 truncate max-w-[200px]" :title="food.category">{{ food.category }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ food.energy }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ food.protein }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ food.fat }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ food.carbohydrate }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button v-if="searchMode === 'external' || searchMode === 'tkpi'" @click="importFood(food)" class="text-indigo-600 border border-indigo-600 hover:bg-indigo-60 px-3 py-1.5 rounded-md text-xs font-medium transition">Simpan ke Lokal</button>
                <div v-else class="flex justify-end gap-3 text-lg items-center">
                  <button @click="editFood(food)" class="text-indigo-600 hover:text-indigo-900" v-if="food.source !== 'system' && food.source !== 'tkpi'"><ion-icon name="create-outline"></ion-icon></button>
                  <button @click="confirmDelete(food)" class="text-red-500 hover:text-red-700" v-if="food.source !== 'system' && food.source !== 'tkpi'"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
              </td>
            </tr>
            <tr v-if="foods.length === 0 && !loading">
              <td colspan="7" class="px-6 py-12 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <ion-icon name="search-outline" class="text-4xl text-gray-300 mb-3"></ion-icon>
                  <p class="text-gray-400">Tidak ada data makanan ditemukan.</p>
                  <p v-if="searchMode === 'local'" class="text-sm text-gray-400 mt-1">Coba gunakan fitur pencarian Open Food Facts</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="(searchMode === 'local' || searchMode === 'tkpi') && totalPages > 1" class="px-6 py-4 border-t flex items-center justify-between bg-gray-50">
        <button @click="handleSearch(page - 1)" :disabled="page <= 1" class="px-4 py-2 border bg-white rounded-lg text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition">Sebelumnya</button>
        <span class="text-sm font-medium text-gray-700">Halaman {{ page }} / {{ totalPages }}</span>
        <button @click="handleSearch(page + 1)" :disabled="page >= totalPages" class="px-4 py-2 border bg-white rounded-lg text-sm text-gray-600 disabled:opacity-50 hover:bg-gray-50 shadow-sm transition">Selanjutnya</button>
      </div>
    </div>

    <!-- Modal Form -->
    <TransitionRoot as="template" :show="isModalOpen">
      <Dialog as="div" class="relative z-50" @close="closeModal">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-100">
                <div class="bg-white px-6 pb-6 pt-6">
                  <div class="flex justify-between items-center mb-5 border-b pb-4">
                    <DialogTitle as="h3" class="text-lg font-bold text-gray-900">
                      {{ isEditing ? 'Edit Makanan Kustom' : (isImporting ? 'Simpan Makanan (' + (form.source === 'tkpi' ? 'TKPI' : 'OpenFoodFacts') + ')' : 'Tambah Makanan Kustom') }}
                    </DialogTitle>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
                      <ion-icon name="close-outline" class="text-2xl"></ion-icon>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5 text-left text-sm mt-2">
                    <div class="col-span-2">
                      <label class="block font-medium text-gray-700 mb-1">Nama Makanan *</label>
                      <input type="text" v-model="form.name" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" required />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Kategori</label>
                      <input type="text" v-model="form.category" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Barcode</label>
                      <input type="text" v-model="form.barcode" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" :readonly="isImporting" />
                    </div>
                    <div class="col-span-2 border-t mt-2 pt-4">
                      <h4 class="font-semibold text-gray-800 mb-3"><ion-icon name="nutrition-outline" class="mr-1"></ion-icon> Makronutrien (per 100g)</h4>
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Energi / Kalori (kkal)</label>
                      <input type="number" step="0.1" v-model="form.energy" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Protein (g)</label>
                      <input type="number" step="0.1" v-model="form.protein" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Karbohidrat (g)</label>
                      <input type="number" step="0.1" v-model="form.carbohydrate" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                    </div>
                    <div>
                      <label class="block font-medium text-gray-700 mb-1">Lemak (g)</label>
                      <input type="number" step="0.1" v-model="form.fat" class="block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition" />
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3 rounded-b-xl">
                  <button type="button" class="inline-flex justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm border border-gray-300 hover:bg-gray-50" @click="closeModal">Batal</button>
                  <button type="button" class="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50 space-x-2 items-center" @click="submitForm" :disabled="submitting">
                    <ion-icon v-if="submitting" name="refresh-outline" class="animate-spin"></ion-icon>
                    <ion-icon v-else name="save-outline"></ion-icon>
                    <span>{{ submitting ? 'Menyimpan...' : 'Simpan Makanan' }}</span>
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

interface Food {
  id?: number
  name: string
  category: string
  source: string
  barcode: string | null
  energy: number
  protein: number
  fat: number
  carbohydrate: number
}

const foods = ref<Food[]>([])
const loading = ref(false)
const searchQuery = ref('')
const searchMode = ref<'local'|'tkpi'|'external'>('local')
const page = ref(1)
const totalPages = ref(1)

const isModalOpen = ref(false)
const isEditing = ref(false)
const isImporting = ref(false)
const submitting = ref(false)

const form = ref<any>({
  name: '',
  category: '',
  source: 'custom',
  barcode: '',
  energy: 0,
  protein: 0,
  fat: 0,
  carbohydrate: 0
})

onMounted(() => {
  handleSearch()
})

const handleSearch = async (p: number = 1) => {
  page.value = p
  if (searchMode.value === 'local') {
    await fetchLocal(p)
  } else if (searchMode.value === 'tkpi') {
    await fetchTkpi(p)
  } else {
    if (!searchQuery.value) return
    await fetchExternal()
  }
}

const fetchLocal = async (p: number) => {
  loading.value = true
  try {
    const { data } = await api.get('/foods', {
      params: { page: p, search: searchQuery.value }
    })
    foods.value = data.data || []
    totalPages.value = data.last_page || 1
  } catch (error) {
    console.error('Failed to fetch local foods', error)
  } finally {
    loading.value = false
  }
}

const fetchTkpi = async (p: number) => {
  loading.value = true
  try {
    const { data } = await api.get('/foods/tkpi', {
      params: { page: p, query: searchQuery.value, limit: 15 }
    })
    foods.value = data.data || []
    totalPages.value = data.last_page || 1
  } catch (error) {
    console.error('Failed to fetch TKPI foods', error)
  } finally {
    loading.value = false
  }
}

const fetchExternal = async () => {
  loading.value = true
  try {
    const isBarcode = /^\d{6,}$/.test(searchQuery.value)
    
    const params: any = {}
    if (isBarcode) {
      params.barcode = searchQuery.value
    } else {
      params.query = searchQuery.value
    }

    const { data } = await api.get('/foods/external', { params })
    if (isBarcode && data.product) {
      foods.value = [data.product]
    } else if (data.products) {
      foods.value = data.products
    }
  } catch (error) {
    console.error('External search failed', error)
    foods.value = []
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  isImporting.value = false
  form.value = { source: 'custom', name: '', category: '', energy: 0, protein: 0, fat: 0, carbohydrate: 0, barcode: '' }
  isModalOpen.value = true
}

const importFood = (food: Food) => {
  isEditing.value = false
  isImporting.value = true
  form.value = { ...food, source: searchMode.value === 'tkpi' ? 'tkpi' : 'openfoodfacts' }
  isModalOpen.value = true
}

const editFood = (food: Food) => {
  isEditing.value = true
  isImporting.value = false
  form.value = { ...food }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const submitForm = async () => {
  submitting.value = true
  try {
    if (isEditing.value && form.value.id) {
      await api.put(`/foods/${form.value.id}`, form.value)
    } else {
      await api.post('/foods', form.value)
    }
    closeModal()
    searchMode.value = 'local'
    searchQuery.value = form.value.name
    handleSearch()
  } catch (error) {
    console.error('Save failed', error)
    alert('Oops! Gagal menyimpan data')
  } finally {
    submitting.value = false
  }
}

const confirmDelete = async (food: Food) => {
  if (confirm(`Yakin membuang makanan ${food.name} dari custom database Anda?`)) {
    try {
      await api.delete(`/foods/${food.id}`)
      handleSearch()
    } catch (e) {
      console.error(e)
      alert("Hanya Admin atau pembuat custom food ini yang bisa menghapus.")
    }
  }
}
</script>
