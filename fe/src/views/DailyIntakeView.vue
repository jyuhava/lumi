<template>
  <AdminLayout>
    <!-- Header -->
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">Daily Intake Tracker (24h Recall)</h1>
        <p class="text-sm text-gray-500 mt-1">Catat dan pantau asupan makanan pasien per sesi secara akurat</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      <!-- Main Content: Timeline / Kanban Blocks -->
      <div class="lg:col-span-2 space-y-6">
        
        <!-- Filter Bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <label class="block text-xs font-medium text-gray-700 mb-1">Pilih Pasien</label>
            <div class="relative">
              <input 
                type="text" 
                v-model="patientSearch" 
                @focus="searchPatients"
                @input="searchPatients"
                placeholder="Cari Nama / No. RM Pasien..." 
                class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
              />
              <ion-icon name="person-outline" class="absolute right-3 top-2.5 text-gray-400"></ion-icon>
            </div>
            
            <!-- Dropdown Results -->
            <div v-if="showPatientList && patients.length > 0" class="absolute z-10 w-full mt-1 bg-white shadow-lg border border-gray-100 rounded-lg max-h-48 overflow-y-auto">
              <ul class="py-1 text-sm text-gray-700">
                <li v-for="p in patients" :key="p.id" @click="selectPatient(p)" class="px-4 py-2 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0">
                  <div class="font-medium text-indigo-700">{{ p.name }}</div>
                  <div class="text-xs text-gray-500">RM: {{ p.no_rm || '-' }}</div>
                </li>
              </ul>
            </div>
          </div>
          
          <div class="w-full sm:w-48">
            <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
            <input 
              type="date" 
              v-model="selectedDate" 
              @change="fetchMeals"
              class="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
            />
          </div>
        </div>

        <!-- Alert if no patient -->
        <div v-if="!activePatient" class="bg-indigo-50 text-indigo-700 p-6 rounded-xl border border-indigo-100 text-center flex flex-col items-center">
          <ion-icon name="albums-outline" class="text-4xl mb-2 opacity-60"></ion-icon>
          <h3 class="font-semibold text-lg">Mulai Pencatatan</h3>
          <p class="text-sm mt-1 max-w-md">Silakan cari dan pilih profil pasien serta tanggal aktivitas untuk melihat histori recall asupan nutrisi.</p>
        </div>

        <template v-else>
          <div v-if="loadingMeals" class="py-12 flex justify-center">
            <ion-icon name="sync-outline" class="text-4xl text-indigo-600 animate-spin"></ion-icon>
          </div>
          
          <div v-else class="space-y-4">
            <!-- Iterate Over Meal Types -->
            <div v-for="session in mealSessions" :key="session.type" class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div class="bg-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center cursor-pointer" @click="session.expanded = !session.expanded">
                <div class="flex items-center gap-3">
                  <div :class="`w-8 h-8 rounded-full flex items-center justify-center text-white ${session.color}`">
                    <ion-icon :name="session.icon"></ion-icon>
                  </div>
                  <div>
                    <h3 class="font-bold text-gray-800">{{ session.label }}</h3>
                    <p class="text-xs text-gray-500">{{ session.items.length }} Item(s) tercatat</p>
                  </div>
                </div>
                <div>
                  <ion-icon :name="session.expanded ? 'chevron-up-outline' : 'chevron-down-outline'" class="text-gray-400"></ion-icon>
                </div>
              </div>
              
              <div v-show="session.expanded" class="p-5">
                <div v-if="session.items.length === 0" class="text-center py-6 text-gray-400 border-2 border-dashed rounded-lg mb-4">
                  Buka form di bawah untuk menambahkan asupan
                </div>
                
                <ul v-else class="divide-y divide-gray-100 mb-4">
                  <li v-for="(item, idx) in session.items" :key="idx" class="py-3 flex justify-between items-center group">
                    <div>
                      <div class="font-medium text-gray-800 text-sm">{{ item.food ? item.food.name : 'Unknown Food' }}</div>
                      <div class="text-xs text-gray-500 mt-0.5">
                        {{ item.quantity }}g • {{ calcItemEnergy(item) }} kkal
                      </div>
                    </div>
                    <button @click="removeItem(session, idx)" class="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ion-icon name="close-circle-outline" class="text-xl"></ion-icon>
                    </button>
                  </li>
                </ul>
                
                <!-- Quick Add Item Form -->
                <div class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h4 class="text-xs font-semibold text-gray-700 uppercase mb-2">Tambahkan Makanan</h4>
                  <div class="flex flex-col sm:flex-row gap-2">
                    <div class="flex-1 relative">
                      <input 
                        type="text" 
                        v-model="session.newSearch" 
                        @input="searchFood(session)"
                        @focus="searchFood(session)"
                        placeholder="Cari dari database makanan..." 
                        class="w-full text-sm border-gray-300 rounded outline-none px-3 py-1.5 focus:border-indigo-500"
                      />
                      <!-- Food Search Results -->
                      <div v-if="session.showResults && session.foodResults.length > 0" class="absolute z-20 w-full mt-1 bg-white shadow-xl border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                        <ul class="py-1 text-xs text-gray-700">
                          <li v-for="f in session.foodResults" :key="f.id" @click="selectFoodForItem(session, f)" class="px-3 py-2 hover:bg-indigo-50 cursor-pointer border-b">
                            <div class="font-semibold">{{ f.name }}</div>
                            <div class="text-gray-500">{{ f.energy }} kkal / 100g</div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div class="w-24 relative">
                      <input type="number" v-model="session.newQuantity" placeholder="Gram" class="w-full text-sm border-gray-300 rounded outline-none px-3 py-1.5 focus:border-indigo-500" />
                      <span class="absolute right-2 top-1.5 text-xs text-gray-400">g</span>
                    </div>
                    
                    <button @click="addItemToSession(session)" :disabled="!session.selectedFood || !session.newQuantity" class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition">
                      Tambah
                    </button>
                  </div>
                  
                  <div v-if="session.selectedFood" class="mt-2 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded inline-block">
                    Terpilih: <strong>{{ session.selectedFood.name }}</strong> 
                    <button @click="session.selectedFood = null" class="ml-2 font-bold text-red-500">x</button>
                  </div>
                </div>

                <div class="mt-4 flex justify-end">
                  <button @click="saveSession(session)" :disabled="session.saving" class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2">
                    <ion-icon v-if="session.saving" name="sync-outline" class="animate-spin"></ion-icon>
                    <ion-icon v-else name="save-outline"></ion-icon>
                    Simpan {{ session.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Sidebar: Macro/Micro Analisis -->
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
          <div class="flex justify-between items-center mb-4 border-b pb-2">
            <h2 class="text-lg font-bold text-gray-800">Analisis Harian</h2>
            <button v-if="activePatient" @click="showTargetModal = true" class="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
              <ion-icon name="options-outline"></ion-icon> Atur Target
            </button>
          </div>
          
          <div v-if="!activePatient" class="text-sm text-gray-400 text-center py-10">
            Data belum tersedia
          </div>
          <div v-else>
            <!-- Target & Summary gauge -->
            <div class="flex justify-center mb-6">
              <div class="relative w-40 h-40 flex items-center justify-center rounded-full border-8 border-gray-100">
                <svg class="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="76" stroke="currentColor" stroke-width="8" fill="transparent" class="text-gray-100" />
                  <circle cx="80" cy="80" r="76" stroke="currentColor" stroke-width="8" fill="transparent" :stroke-dasharray="477" :stroke-dashoffset="477 - (477 * Math.min((totals.energy / target.energy), 1))" :class="(totals.energy > target.energy + 200) ? 'text-red-500' : 'text-indigo-600'" class="transition-all duration-1000" />
                </svg>
                <div class="text-center z-10 bg-white rounded-full p-2">
                  <div class="text-2xl font-bold" :class="(totals.energy > target.energy + 200) ? 'text-red-600' : 'text-indigo-700'">
                    {{ Math.round(totals.energy) }}
                  </div>
                  <div class="text-xs text-gray-500">of {{ target.energy }} kkal</div>
                </div>
              </div>
            </div>
            <div class="text-center mb-6">
              <span v-if="totals.energy < (target.energy - 300)" class="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Deficiency (Kurang)</span>
              <span v-else-if="totals.energy >= (target.energy - 300) && totals.energy <= (target.energy + 200)" class="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Adequate (Cukup)</span>
              <span v-else class="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Excess (Berlebih)</span>
            </div>

            <!-- Macros Bar -->
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-gray-700">Protein</span>
                  <span class="text-gray-600">{{ totals.protein }} / {{ target.protein }}g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-blue-500 h-2.5 rounded-full" :style="`width: ${Math.min((totals.protein/target.protein)*100, 100)}%`"></div>
                </div>
              </div>
              
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-gray-700">Lemak</span>
                  <span class="text-gray-600">{{ totals.fat }} / {{ target.fat }}g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-yellow-500 h-2.5 rounded-full" :style="`width: ${Math.min((totals.fat/target.fat)*100, 100)}%`"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="font-medium text-gray-700">Karbohidrat</span>
                  <span class="text-gray-600">{{ totals.carbohydrate }} / {{ target.carbohydrate }}g</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-green-500 h-2.5 rounded-full" :style="`width: ${Math.min((totals.carbohydrate/target.carbohydrate)*100, 100)}%`"></div>
                </div>
              </div>
            </div>

            <!-- Micro grid -->
            <div class="mt-6 pt-4 border-t grid grid-cols-2 gap-3 text-sm">
              <div class="bg-gray-50 p-2 rounded">
                <span class="block text-gray-500 text-xs">Serat</span>
                <span class="font-bold text-gray-800">{{ totals.fiber }} g</span>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <span class="block text-gray-500 text-xs">Sodium (Na)</span>
                <span class="font-bold text-gray-800">{{ totals.sodium }} mg</span>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <span class="block text-gray-500 text-xs">Gula</span>
                <span class="font-bold text-gray-800">{{ totals.sugar }} g</span>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <span class="block text-gray-500 text-xs">Kalsium</span>
                <span class="font-bold text-gray-800">{{ totals.calcium }} mg</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Target Settings Modal -->
    <div v-if="showTargetModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-800">Atur Target Harian Custom</h3>
          <button @click="showTargetModal = false" class="text-gray-400 hover:text-gray-600"><ion-icon name="close-outline" class="text-2xl"></ion-icon></button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-2 gap-4">
             <div>
               <label class="block text-xs font-medium text-gray-700 mb-1">Total Energi (kkal)</label>
               <input type="number" v-model.number="target.energy" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
             </div>
             <div>
               <label class="block text-xs font-medium text-gray-700 mb-1">Protein (g)</label>
               <input type="number" v-model.number="target.protein" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
             </div>
             <div>
               <label class="block text-xs font-medium text-gray-700 mb-1">Lemak (g)</label>
               <input type="number" v-model.number="target.fat" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
             </div>
             <div>
               <label class="block text-xs font-medium text-gray-700 mb-1">Karbohidrat (g)</label>
               <input type="number" v-model.number="target.carbohydrate" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
             </div>
          </div>
          <div class="bg-indigo-50 text-indigo-700 text-xs p-3 rounded mt-2">
            Target standar dihitung otomatis dari estimasi BMR / kunjungan terakhir, Anda dapat mengubah manual di sini jika menggunakan diet spesifik.
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t">
          <button @click="showTargetModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">Tutup</button>
          <!-- For simplicity in this tracker we just apply it to frontend state -->
          <button @click="showTargetModal = false" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">Simpan Target</button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, watch } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

// State
const patientSearch = ref('')
const patients = ref<any[]>([])
const showPatientList = ref(false)
const activePatient = ref<any | null>(null)
const selectedDate = ref(new Date().toISOString().split('T')[0])

const loadingMeals = ref(false)
const showTargetModal = ref(false)

const totals = ref({
  energy: 0, protein: 0, fat: 0, carbohydrate: 0, 
  fiber: 0, sodium: 0, sugar: 0, calcium: 0
})

const target = ref({
  energy: 2000, protein: 60, fat: 60, carbohydrate: 300,
  fiber: 30, sodium: 2000, sugar: 50, calcium: 1000
})

// Meal sessions config
type SessionType = {
  type: string;
  label: string;
  icon: string;
  color: string;
  expanded: boolean;
  items: any[];
  newSearch: string;
  newQuantity: string | number;
  showResults: boolean;
  foodResults: any[];
  selectedFood: any | null;
  saving: boolean;
};

const mealSessions = reactive<SessionType[]>([
  { type: 'breakfast', label: 'Makan Pagi', icon: 'partly-sunny-outline', color: 'bg-yellow-400', expanded: true, items: [], newSearch: '', newQuantity: '', showResults: false, foodResults: [], selectedFood: null, saving: false },
  { type: 'snack', label: 'Selingan (Snack)', icon: 'cafe-outline', color: 'bg-orange-400', expanded: false, items: [], newSearch: '', newQuantity: '', showResults: false, foodResults: [], selectedFood: null, saving: false },
  { type: 'lunch', label: 'Makan Siang', icon: 'sunny-outline', color: 'bg-blue-400', expanded: false, items: [], newSearch: '', newQuantity: '', showResults: false, foodResults: [], selectedFood: null, saving: false },
  { type: 'dinner', label: 'Makan Malam', icon: 'moon-outline', color: 'bg-indigo-800', expanded: false, items: [], newSearch: '', newQuantity: '', showResults: false, foodResults: [], selectedFood: null, saving: false },
])

// Patient Logic
let searchTimeout: any;
const searchPatients = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get('/patients', { params: { search: patientSearch.value, paginate: false } })
      patients.value = Array.isArray(data) ? data : (data.data || [])
      showPatientList.value = true
    } catch (e) {}
  }, 300)
}

const selectPatient = (p: any) => {
  activePatient.value = p
  patientSearch.value = `${p.name} (${p.no_rm})`
  showPatientList.value = false
  fetchTarget()
  fetchMeals()
}

const fetchTarget = async () => {
  if (!activePatient.value) return
  try {
    const { data } = await api.get(`/nutrition-calculator/target/${activePatient.value.id}`)
    if (data.available) {
      // Auto-calculate requirements
      const req = await api.post('/nutrition-calculator/requirements', {
        patient_id: activePatient.value.id,
        weight: data.weight,
        height: data.height,
        age: data.age,
        gender: data.gender,
        activity_factor: 1.2, // Default sedentary
        stress_factor: 1.0,
      })
      if (req.data && req.data.requirements) {
        target.value = { ...target.value, ...req.data.requirements }
      }
    }
  } catch (error) {
    console.error('Failed fetching target', error)
  }
}

// Meals Logic
const fetchMeals = async () => {
  if (!activePatient.value) return
  
  loadingMeals.value = true
  try {
    const { data } = await api.get('/meals', {
      params: { patient_id: activePatient.value.id, date: selectedDate.value }
    })
    
    // Distribute items to slots
    mealSessions.forEach(session => {
      const source = data.meals[session.type]
      session.items = source && source.items ? [...source.items] : []
    })
    
    totals.value = data.totals
  } catch (error) {
    console.error(error)
  } finally {
    loadingMeals.value = false
  }
}

// Food Search Logic
let foodTimeout: any;
const searchFood = (session: any) => {
  clearTimeout(foodTimeout)
  foodTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get('/foods', { params: { search: session.newSearch, per_page: 20 } })
      session.foodResults = data.data || []
      session.showResults = true
    } catch (e) {}
  }, 300)
}

const selectFoodForItem = (session: any, food: any) => {
  session.selectedFood = food
  session.newSearch = food.name
  session.showResults = false
}

const calcItemEnergy = (item: any) => {
  if (!item.food) return 0
  return Math.round((item.food.energy * item.quantity) / 100)
}

const addItemToSession = (session: any) => {
  if (!session.selectedFood || !session.newQuantity) return
  
  session.items.push({
    food_id: session.selectedFood.id,
    food: session.selectedFood,
    quantity: parseFloat(session.newQuantity)
  })
  
  session.selectedFood = null
  session.newSearch = ''
  session.newQuantity = ''
}

const removeItem = (session: any, idx: number) => {
  session.items.splice(idx, 1)
}

const saveSession = async (session: any) => {
  if (!activePatient.value) return
  
  session.saving = true
  try {
    await api.post('/meals', {
      patient_id: activePatient.value.id,
      date: selectedDate.value,
      meal_type: session.type,
      items: session.items.map((i: any) => ({ 
        id: i.id || null, // send ID if exist for update
        food_id: i.food_id, 
        quantity: i.quantity 
      }))
    })
    
    // Refresh totals dynamically
    await fetchMeals()
  } catch (e) {
    console.error(e)
    alert("Gagal menympan sesi makan.")
  } finally {
    session.saving = false
  }
}

// Hide dropdowns conditionally
onMounted(() => {
  document.addEventListener('click', (e: Event) => {
    if (!(e.target as Element).closest('.relative')) {
      showPatientList.value = false
      mealSessions.forEach(s => s.showResults = false)
    }
  })
})
</script>
