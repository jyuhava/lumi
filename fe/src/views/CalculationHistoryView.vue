<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button 
            @click="$router.back()"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ion-icon name="arrow-back" class="text-2xl text-gray-600"></ion-icon>
          </button>
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Riwayat Perhitungan</h2>
            <p class="text-gray-600">{{ getTitle() }}</p>
          </div>
        </div>
        
        <!-- Delete All Button -->
        <button
          v-if="history.length > 0"
          @click="confirmDeleteAll"
          class="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
        >
          <ion-icon name="trash-outline"></ion-icon>
          <span>Hapus Semua</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-md p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Tipe Kalkulator</label>
          <select
            v-model="filters.calculator_type"
            @change="loadHistory"
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            <option value="">Semua Tipe</option>
            <option value="nutrition">Kebutuhan Gizi</option>
            <option value="nutritional-status">Status Gizi</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">Metode</label>
          <select
            v-model="filters.method"
            @change="loadHistory"
            class="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all bg-white"
          >
            <option value="">Semua Metode</option>
            <option value="bmi">BMI</option>
            <option value="lila">LILA</option>
            <option value="weight-estimation">Estimasi BB</option>
            <option value="harris-benedict">Harris-Benedict</option>
            <option value="mifflin-st-jeor">Mifflin-St Jeor</option>
            <option value="broca">Broca</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-indigo-600"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="history.length === 0" class="bg-white rounded-xl shadow-md p-12 text-center">
      <div class="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <ion-icon name="document-text-outline" class="text-5xl text-gray-400"></ion-icon>
      </div>
      <h3 class="text-lg font-bold text-gray-700 mb-2">Belum Ada Riwayat</h3>
      <p class="text-gray-500">Riwayat perhitungan akan muncul di sini setelah Anda melakukan perhitungan</p>
    </div>

    <!-- History List -->
    <div v-else class="space-y-4">
      <div
        v-for="item in history"
        :key="item.id"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border-2 border-transparent hover:border-indigo-500"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start space-x-4 flex-1">
            <div 
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0',
                getMethodColor(item.method)
              ]"
            >
              <ion-icon :name="getMethodIcon(item.method)" class="text-2xl text-white"></ion-icon>
            </div>
            
            <div class="flex-1">
              <div class="flex items-center space-x-2 mb-1">
                <h4 class="font-bold text-gray-900">{{ getMethodName(item.method) }}</h4>
                <span class="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {{ getCalculatorTypeName(item.calculator_type) }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                {{ formatDate(item.created_at) }}
              </p>
            </div>
          </div>
          
          <button
            @click="deleteHistory(item.id)"
            class="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-500 hover:text-red-700"
          >
            <ion-icon name="trash-outline" class="text-xl"></ion-icon>
          </button>
        </div>

        <!-- Inputs -->
        <div class="bg-gray-50 rounded-lg p-4 mb-3">
          <p class="text-xs font-semibold text-gray-600 mb-2">Input:</p>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div v-for="(value, key) in item.inputs" :key="key" class="bg-white rounded px-3 py-2">
              <p class="text-xs text-gray-500 capitalize">{{ formatKey(key) }}</p>
              <p class="text-sm font-semibold text-gray-900">{{ formatValue(key, value) }}</p>
            </div>
          </div>
        </div>

        <!-- Results -->
        <div class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4">
          <p class="text-xs font-semibold text-indigo-900 mb-2">Hasil:</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div v-for="(value, key) in getMainResults(item.results)" :key="key" class="bg-white rounded px-3 py-2">
              <p class="text-xs text-gray-500 capitalize">{{ formatKey(key) }}</p>
              <p class="text-sm font-bold text-indigo-600">{{ value }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import { calculationHistoryApi, type CalculationHistory } from '@/api/calculationHistory'

const route = useRoute()
const loading = ref(false)
const history = ref<CalculationHistory[]>([])

const filters = ref({
  calculator_type: (route.query.type as string) || '',
  method: ''
})

const loadHistory = async () => {
  try {
    loading.value = true
    const response = await calculationHistoryApi.getHistory(filters.value)
    history.value = response.data.data
  } catch (error) {
    console.error('Failed to load history:', error)
  } finally {
    loading.value = false
  }
}

const deleteHistory = async (id: number) => {
  if (!confirm('Yakin ingin menghapus riwayat ini?')) return
  
  try {
    await calculationHistoryApi.deleteHistory(id)
    history.value = history.value.filter(h => h.id !== id)
  } catch (error) {
    console.error('Failed to delete history:', error)
    alert('Gagal menghapus riwayat')
  }
}

const confirmDeleteAll = async () => {
  if (!confirm('Yakin ingin menghapus SEMUA riwayat? Tindakan ini tidak dapat dibatalkan.')) return
  
  try {
    await calculationHistoryApi.deleteAll(filters.value.calculator_type || undefined)
    await loadHistory()
  } catch (error) {
    console.error('Failed to delete all history:', error)
    alert('Gagal menghapus riwayat')
  }
}

const getTitle = () => {
  const type = filters.value.calculator_type
  if (type === 'nutrition') return 'Kebutuhan Gizi'
  if (type === 'nutritional-status') return 'Status Gizi'
  return 'Semua Perhitungan'
}

const getMethodName = (method: string) => {
  const names: Record<string, string> = {
    'bmi': 'BMI/IMT',
    'lila': 'LILA',
    'weight-estimation': 'Estimasi Berat Badan',
    'harris-benedict': 'Harris-Benedict',
    'mifflin-st-jeor': 'Mifflin-St Jeor',
    'broca': 'Broca',
    'filipinos': 'Filipinos',
    'kemenkes': 'Kemenkes RI',
    'diabetes': 'Diabetes Mellitus',
    'cancer': 'Pasien Kanker',
    'burn': 'Luka Bakar',
    'nelson': 'Nelson (Anak)',
    'neonatal': 'Neonatus'
  }
  return names[method] || method
}

const getCalculatorTypeName = (type: string) => {
  const names: Record<string, string> = {
    'nutrition': 'Gizi',
    'nutritional-status': 'Status'
  }
  return names[type] || type
}

const getMethodIcon = (method: string) => {
  const icons: Record<string, string> = {
    'bmi': 'body',
    'lila': 'fitness',
    'weight-estimation': 'calculator'
  }
  return icons[method] || 'calculator'
}

const getMethodColor = (method: string) => {
  const colors: Record<string, string> = {
    'bmi': 'bg-gradient-to-br from-purple-500 to-pink-600',
    'lila': 'bg-gradient-to-br from-emerald-500 to-teal-600',
    'weight-estimation': 'bg-gradient-to-br from-cyan-500 to-blue-600'
  }
  return colors[method] || 'bg-gradient-to-br from-indigo-500 to-purple-600'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short'
  })
}

const formatKey = (key: string) => {
  const labels: Record<string, string> = {
    'weight': 'Berat Badan',
    'height': 'Tinggi Badan',
    'gender': 'Jenis Kelamin',
    'age': 'Usia',
    'lila': 'LILA',
    'bmi': 'BMI',
    'status': 'Status',
    'category': 'Kategori',
    'percentage': '%LILA'
  }
  return labels[key] || key
}

const formatValue = (key: string, value: any) => {
  if (key === 'weight') return `${value} kg`
  if (key === 'height') return `${value} cm`
  if (key === 'lila') return `${value} cm`
  if (key === 'gender') return value === 'male' ? 'Laki-laki' : 'Perempuan'
  if (key === 'age') return `${value} tahun`
  return value
}

const getMainResults = (results: any) => {
  // Filter only main results to display
  const main: any = {}
  const priority = ['bmi', 'status', 'category', 'percentage', 'lila']
  
  for (const key of priority) {
    if (results[key] !== undefined) {
      main[key] = results[key]
    }
  }
  
  return main
}

onMounted(() => {
  loadHistory()
})
</script>
