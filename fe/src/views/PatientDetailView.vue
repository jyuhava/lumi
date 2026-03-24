<template>
  <AdminLayout>
    <div class="mb-6">
      <router-link to="/patients" class="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium mb-4 inline-flex">
        <ion-icon name="arrow-back-outline"></ion-icon> Kembali ke Daftar Pasien
      </router-link>
      
      <div v-if="loading" class="p-12 text-center text-gray-500">
        <ion-icon name="sync-outline" class="text-4xl animate-spin mb-2 text-indigo-500"></ion-icon>
        <p>Memuat data detail pasien...</p>
      </div>
      
      <template v-else-if="patient">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div class="flex items-start justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ patient.name }}</h1>
              <p class="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <ion-icon name="medical-outline" class="text-indigo-500"></ion-icon> RM: {{ patient.no_rm }}
              </p>
            </div>
            <div class="text-right">
              <div class="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-sm">
                {{ patient.gender === 'L' ? 'Laki-laki' : (patient.gender === 'P' ? 'Perempuan' : '-') }}, {{ patient.age ? patient.age + ' Tahun' : '-' }}
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Didaftarkan Pada</p>
              <p class="text-sm font-medium text-gray-900">{{ formatDate(patient.created_at) }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Kunjungan Gizi</p>
              <p class="text-sm font-medium text-gray-900">{{ visits.length }} Kali</p>
            </div>
          </div>
        </div>

        <h2 class="text-lg font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block mb-4">Riwayat Kunjungan / Asuhan Gizi</h2>
        
        <div v-if="visits.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          <ion-icon name="document-text-outline" class="text-5xl text-gray-300 mb-3"></ion-icon>
          <p>Belum ada riwayat kunjungan gizi untuk pasien ini.</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="(visit, index) in visits" :key="visit.id" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <span class="inline-block px-2 py-1 bg-green-50 text-green-700 font-bold rounded text-xs mb-2">Kunjungan ke-{{ visits.length - index }}</span>
                <h3 class="text-md font-bold text-gray-900">{{ formatDate(visit.visit_date) }}</h3>
              </div>
              <!-- Navigate back to nutritional-visits with maybe filtered view or just to the page -->
              <router-link :to="`/nutritional-visits?search=${visit.id}`" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                Lihat Detail <ion-icon name="arrow-forward-outline"></ion-icon>
              </router-link>
            </div>
            <div class="text-sm text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 bg-gray-50 p-3 rounded-lg">
              <div><strong class="text-gray-800">Diagnosis Medis:</strong> {{ visit.medical_diagnosis || '-' }}</div>
              <div><strong class="text-gray-800">Diet (Preskripsi):</strong> {{ visit.diet || '-' }}</div>
              <div v-if="visit.visit_type"><strong class="text-gray-800">Tipe Kunjungan:</strong> {{ visit.visit_type }}</div>
            </div>
          </div>
        </div>

        <h2 class="text-lg font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block mb-4 mt-8">Riwayat Asupan Makanan (Recall)</h2>
        
        <div v-if="meals.length === 0" class="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          <ion-icon name="restaurant-outline" class="text-5xl text-gray-300 mb-3"></ion-icon>
          <p>Belum ada riwayat recall asupan makanan.</p>
        </div>

        <div v-else class="space-y-6">
          <div v-for="dailyMeal in meals" :key="dailyMeal.date" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <h3 class="font-bold text-gray-800 flex items-center gap-2">
                <ion-icon name="calendar-outline" class="text-indigo-500"></ion-icon>
                {{ formatDate(dailyMeal.date) }}
              </h3>
            </div>
            <div class="p-5 space-y-4">
              <div v-for="session in dailyMeal.sessions" :key="session.id" class="border rounded-lg p-3">
                <h4 class="text-sm font-bold text-gray-700 mb-2 border-b pb-1 inline-block">{{ getMealTypeLabel(session.meal_type) }}</h4>
                <ul v-if="session.items && session.items.length > 0" class="space-y-1">
                  <li v-for="item in session.items" :key="item.id" class="text-sm text-gray-600 flex justify-between">
                    <span>• {{ item.food?.name || 'Unknown' }}</span>
                    <span class="font-medium">{{ item.quantity }}g</span>
                  </li>
                </ul>
                <p v-else class="text-xs text-gray-400 italic">Tidak ada makanan tercatat</p>
              </div>
            </div>
          </div>
        </div>
      </template>
      
      <div v-else class="text-center text-red-500 p-12 bg-white rounded-xl shadow-sm border border-gray-100">
        Pasien tidak ditemukan.
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

const route = useRoute()
const patientId = route.params.id

const patient = ref<any>(null)
const visits = ref<any[]>([])
const meals = ref<any[]>([])
const loading = ref(true)

const fetchPatientDetail = async () => {
  loading.value = true
  try {
    const { data } = await api.get(`/patients/${patientId}`)
    patient.value = data
    visits.value = data.nutritional_visits || []
    
    // Group meals by date
    if (data.meals) {
      const groupedMeals: Record<string, any[]> = {}
      data.meals.forEach((meal: any) => {
        if (!groupedMeals[meal.date]) {
          groupedMeals[meal.date] = []
        }
        groupedMeals[meal.date]!.push(meal)
      })
      
      // Convert to array of objects and sort by date descending
      meals.value = Object.keys(groupedMeals).map(date => ({
        date,
        sessions: groupedMeals[date]
      })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }
  } catch (error) {
    console.error("Gagal mengambil detail pasien")
  } finally {
    loading.value = false
  }
}

const getMealTypeLabel = (type: string) => {
  const map: Record<string, string> = {
    breakfast: 'Makan Pagi',
    lunch: 'Makan Siang',
    dinner: 'Makan Malam',
    snack: 'Selingan (Snack)'
  }
  return map[type] || type
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeStyle: 'short' }).format(date)
}

onMounted(() => {
  fetchPatientDetail()
})
</script>
