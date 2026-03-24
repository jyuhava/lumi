<template>
  <AdminLayout>
    <div class="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 border-b-2 border-indigo-500 pb-2 inline-block">Menu Planner & Diet Prescription</h1>
        <p class="text-sm text-gray-500 mt-1">Buat rancangan program menu diet mingguan yang presisi untuk pasien</p>
      </div>
    </div>

    <!-- Wrap Content -->
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      <!-- LEFT COLUMN: Patient & Plan Select -->
      <div class="space-y-6">
        <!-- Patient Search -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <label class="block text-sm font-semibold text-gray-800 mb-3">1. Pilih Pasien</label>
          <div class="relative">
            <input 
              type="text" 
              v-model="patientSearch" 
              @focus="searchPatients"
              @input="searchPatients"
              placeholder="Cari Nama / No. RM Pasien..." 
              class="block w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm bg-gray-50"
            />
            <ion-icon name="search-outline" class="absolute right-3 top-3 text-gray-400"></ion-icon>
          </div>
          
          <div v-if="showPatientList && patients.length > 0" class="absolute z-20 w-full md:w-80 mt-1 bg-white shadow-xl border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
            <ul class="py-1 text-sm text-gray-700">
              <li v-for="p in patients" :key="p.id" @click="selectPatient(p)" class="px-4 py-3 hover:bg-indigo-50 cursor-pointer border-b last:border-b-0">
                <div class="font-bold text-indigo-700">{{ p.name }}</div>
                <div class="text-xs text-gray-500">RM: {{ p.no_rm || '-' }}</div>
              </li>
            </ul>
          </div>
          
          <div v-if="activePatient" class="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center font-bold">
                {{ activePatient.name.charAt(0) }}
              </div>
              <div class="flex-1">
                <div class="font-semibold text-sm text-gray-900 truncate">{{ activePatient.name }}</div>
                <div class="text-xs text-gray-600">Terpilih</div>
              </div>
            </div>
            
            <div class="mt-3 pt-3 border-t border-indigo-100 grid grid-cols-2 gap-2 text-xs">
              <div class="text-gray-600">Target TEE:</div>
              <div class="font-bold text-indigo-700 text-right">{{ Math.round(target.energy) }} kkal</div>
            </div>
          </div>
        </div>

        <!-- Plan Selection -->
        <div v-if="activePatient" class="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div class="flex justify-between items-center mb-3">
            <label class="block text-sm font-semibold text-gray-800">2. Program Diet</label>
            <button @click="openCreatePlanDialog" class="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"><ion-icon name="add"></ion-icon> Baru</button>
          </div>
          
          <div v-if="loadingPlans" class="py-4 text-center text-sm text-gray-400">Loading...</div>
          <div v-else-if="plans.length === 0" class="py-6 px-4 bg-gray-50 rounded-lg text-center border-2 border-dashed border-gray-200">
            <p class="text-xs text-gray-500">Belum ada program diet.</p>
          </div>
          <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-1">
            <div 
              v-for="plan in plans" 
              :key="plan.id"
              @click="loadPlan(plan.id)"
              :class="activePlan?.id === plan.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:bg-gray-50'"
              class="border rounded-lg p-3 cursor-pointer transition relative group"
            >
              <div class="font-medium text-sm text-gray-800">{{ plan.plan_name }}</div>
              <div class="text-xs text-gray-500 mt-1">
                {{ plan.start_date ? plan.start_date : 'No Date' }} - {{ plan.end_date ? plan.end_date : 'Continuous' }}
              </div>
              <button @click.prevent.stop="deletePlan(plan.id)" class="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100"><ion-icon name="trash"></ion-icon></button>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN PLAN CANVAS -->
      <div class="lg:col-span-3">
        <div v-if="!activePlan" class="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-16 h-full min-h-[400px]">
          <ion-icon name="calendar-outline" class="text-6xl text-gray-300 mb-4"></ion-icon>
          <h3 class="text-lg font-medium text-gray-600 mb-1">Canvas Program Kosong</h3>
          <p class="text-sm text-gray-400 text-center max-w-sm">Pilih pasien dan buka/buat Program Diet di panel kiri untuk mulai menyusun menu harian.</p>
        </div>
        
        <div v-else class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
          <div class="bg-indigo-700 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h2 class="font-bold text-lg leading-tight">{{ activePlan.plan_name }}</h2>
              <p class="text-indigo-200 text-xs mt-0.5">Pasien: {{ activePatient.name }}</p>
            </div>
              <button @click="generatePDF" class="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-800 border border-indigo-400 px-3 py-1.5 rounded-lg text-sm font-medium transition shadow-sm">
                <ion-icon name="document-text-outline"></ion-icon>
                Cetak PDF
              </button>
            </div>

            <!-- Day Tabs -->
            <div class="flex overflow-x-auto border-b border-gray-200 custom-scrollbar bg-gray-50">
              <button 
                v-for="d in days" :key="d.id"
            </button>
          </div>

          <!-- Day Content -->
          <div class="flex flex-col lg:flex-row flex-1 overflow-hidden" v-if="planData">
            
            <!-- Items Area -->
            <div class="flex-1 p-5 overflow-y-auto max-h-[600px] border-r">
              <div v-for="mealOption in mealTypes" :key="mealOption.id" class="mb-6 last:mb-0">
                <div class="flex justify-between items-center mb-2 pb-2 border-b border-dashed border-gray-200">
                  <h3 class="font-bold text-gray-800 text-sm flex items-center gap-2">
                    <ion-icon :name="mealOption.icon" :class="mealOption.iconColor"></ion-icon>
                    {{ mealOption.label }}
                  </h3>
                  <div class="text-xs font-semibold text-gray-500" v-if="mealTotals[mealOption.id]">
                    {{ mealTotals[mealOption.id].energy }} kkal
                  </div>
                </div>
                
                <!-- Diet Items -->
                <div class="space-y-2 mb-3">
                  <div v-if="!planData[activeDay][mealOption.id] || planData[activeDay][mealOption.id].length === 0" class="text-center py-4 bg-gray-50 rounded text-xs text-gray-400 italic">
                    Belum ada menu di sesi ini
                  </div>
                  
                  <div v-for="(item, idx) in planData[activeDay][mealOption.id]" :key="idx" class="flex justify-between items-start bg-white border border-gray-100 p-2.5 rounded hover:border-indigo-200 group">
                    <div class="pr-2">
                      <div class="text-sm font-medium text-gray-800">{{ item.food ? item.food.name : 'Unknown Food' }}</div>
                      <div class="text-xs text-gray-500 flex gap-2">
                        <span>{{ item.quantity }}g</span>
                        <span class="text-gray-300">|</span>
                        <span class="text-orange-600">{{ calcMacro(item, 'energy') }} kkal</span>
                        <span class="text-blue-600">{{ calcMacro(item, 'protein') }} P</span>
                        <span class="text-yellow-600">{{ calcMacro(item, 'fat') }} L</span>
                        <span class="text-green-600">{{ calcMacro(item, 'carbohydrate') }} K</span>
                      </div>
                    </div>
                    <button @click="removeItem(mealOption.id, Number(idx))" class="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><ion-icon name="trash"></ion-icon></button>
                  </div>
                </div>

                <!-- Add quick input -->
                <div class="flex gap-2 relative mt-2 items-center bg-gray-50 p-2 rounded">
                  <div class="flex-1 relative">
                    <input 
                      type="text" 
                      v-model="editStates[mealOption.id].search"
                      @input="searchFood(mealOption.id)"
                      @focus="searchFood(mealOption.id)"
                      placeholder="Cari makanan..."
                      class="w-full text-xs border border-gray-200 rounded px-2.5 py-1.5 outline-none focus:border-indigo-400"
                    />
                    <!-- Picker Popover -->
                    <div v-if="editStates[mealOption.id].show && editStates[mealOption.id].results.length > 0" class="absolute z-10 w-full mt-1 bg-white shadow-lg border border-gray-100 rounded-md max-h-40 overflow-y-auto">
                      <ul class="py-1">
                        <li v-for="f in editStates[mealOption.id].results" :key="f.id" @click="selectFood(mealOption.id, f)" class="px-3 py-1.5 text-xs hover:bg-indigo-50 cursor-pointer border-b">
                          <div class="font-semibold">{{ f.name }}</div>
                          <div class="text-gray-500">{{ f.energy }} kkal / 100g</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div class="w-16">
                    <input type="number" v-model="editStates[mealOption.id].qty" placeholder="Gram" class="w-full text-xs border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-indigo-400 text-center" />
                  </div>
                  <button @click="addItem(mealOption.id)" :disabled="!editStates[mealOption.id].food" class="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50">
                    Tambah
                  </button>
                  
                  <div v-if="editStates[mealOption.id].food" class="absolute top-10 left-0 bg-indigo-700 text-white text-xs px-2 py-1 rounded shadow-md flex items-center gap-2 z-10">
                    {{ editStates[mealOption.id].food.name }}
                    <ion-icon name="close" @click="editStates[mealOption.id].food = null; editStates[mealOption.id].search=''" class="cursor-pointer font-bold bg-white text-indigo-700 rounded-full"></ion-icon>
                  </div>
                </div>

              </div>

              <!-- Save Day Button -->
              <div class="mt-8 mb-4 border-t pt-4 flex justify-between items-center text-sm">
                <span class="text-gray-500 content-center font-medium">*Harap simpan perubahan sesi hari ini</span>
                <button @click="savePlanDay" class="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold flex gap-2 items-center shadow-sm">
                  <ion-icon name="save-outline"></ion-icon> Simpan Menu {{ days.find(d => d.id === activeDay)?.label }}
                </button>
              </div>
            </div>

            <!-- Totals Side (Day Analysis) -->
            <div class="w-full lg:w-64 bg-gray-50 p-5 shrink-0 flex flex-col pt-6">
              <h3 class="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2 flex gap-2"><ion-icon name="pie-chart" class="text-indigo-600"></ion-icon> Rekap {{ days.find(d => d.id === activeDay)?.label }}</h3>
              
              <div class="text-center mb-5">
                <span class="text-xs text-gray-500 font-semibold block mb-1">Total Kalori</span>
                <div class="text-3xl font-black" :class="(dayTotals.energy > target.energy + 100) ? 'text-red-600' : 'text-indigo-700'">
                  {{ dayTotals.energy }}
                </div>
                <div class="text-xs text-gray-500 mt-1">Target: <b>{{ Math.round(target.energy) }}</b></div>
              </div>

              <div class="space-y-4 text-xs font-medium">
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Protein ({{ dayTotals.protein }}g)</span>
                    <span class="text-gray-800">{{ target.protein > 0 ? Math.round((dayTotals.protein/target.protein)*100) : 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-blue-500 h-1.5 rounded-full" :style="`width: ${Math.min((dayTotals.protein/target.protein)*100, 100)}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Lemak ({{ dayTotals.fat }}g)</span>
                    <span class="text-gray-800">{{ target.fat > 0 ? Math.round((dayTotals.fat/target.fat)*100) : 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-yellow-500 h-1.5 rounded-full" :style="`width: ${Math.min((dayTotals.fat/target.fat)*100, 100)}%`"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-1">
                    <span class="text-gray-600">Karbo ({{ dayTotals.carbohydrate }}g)</span>
                    <span class="text-gray-800">{{ target.carbohydrate > 0 ? Math.round((dayTotals.carbohydrate/target.carbohydrate)*100) : 0 }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-1.5">
                    <div class="bg-green-500 h-1.5 rounded-full" :style="`width: ${Math.min((dayTotals.carbohydrate/target.carbohydrate)*100, 100)}%`"></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>

    <!-- Create Plan Modal -->
    <div v-if="showCreatePlan" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
          <h3 class="font-bold text-gray-800">Buat Program Diet Baru</h3>
          <button @click="showCreatePlan = false" class="text-gray-400 hover:text-gray-600"><ion-icon name="close-outline" class="text-2xl"></ion-icon></button>
        </div>
        <form @submit.prevent="submitCreatePlan" class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">Nama Program (Label)</label>
            <input type="text" v-model="newPlan.plan_name" required placeholder="Contoh: Diet Rendah Garam 1500k, Diet DM 1300..." class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tgl Mulai (Opsional)</label>
              <input type="date" v-model="newPlan.start_date" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">Tgl Selesai (Opsional)</label>
              <input type="date" v-model="newPlan.end_date" class="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-indigo-500 outline-none text-sm" />
            </div>
          </div>
          
          <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3 rounded-b-xl border-t mt-4 -mx-6 -mb-6">
            <button type="button" @click="showCreatePlan = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50">Batal</button>
            <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700">Simpan Draft</button>
          </div>
        </form>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'
import api from '@/api/axios'

// == Logic Select Patient ==
const patientSearch = ref('')
const patients = ref<any[]>([])
const showPatientList = ref(false)
const activePatient = ref<any | null>(null)

const target = ref({
  energy: 2000, protein: 60, fat: 60, carbohydrate: 300
})

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
  
  // fetch target & plans
  fetchTarget()
  fetchPlans()
}

const fetchTarget = async () => {
  if (!activePatient.value) return
  try {
    const { data } = await api.get(`/nutrition-calculator/target/${activePatient.value.id}`)
    if (data.available) {
      const req = await api.post('/nutrition-calculator/requirements', {
        patient_id: activePatient.value.id,
        weight: data.weight, height: data.height, age: data.age, gender: data.gender, activity_factor: 1.2, stress_factor: 1.0,
      })
      if (req.data && req.data.requirements) target.value = req.data.requirements
    }
  } catch (error) { console.error(error) }
}

// == Logic Plans Selection ==
const plans = ref<any[]>([])
const loadingPlans = ref(false)
const activePlan = ref<any | null>(null)

const fetchPlans = async () => {
  if (!activePatient.value) return
  loadingPlans.value = true
  activePlan.value = null
  try {
    const { data } = await api.get('/nutrition-plans', { params: { patient_id: activePatient.value.id } })
    plans.value = data
  } catch (e) {}
  loadingPlans.value = false
}

// == Create Plan Form ==
const showCreatePlan = ref(false)
const newPlan = ref({ plan_name: '', start_date: '', end_date: '' })

const openCreatePlanDialog = () => {
  newPlan.value = { plan_name: '', start_date: '', end_date: '' }
  showCreatePlan.value = true
}

const submitCreatePlan = async () => {
  try {
    const res = await api.post('/nutrition-plans', { ...newPlan.value, patient_id: activePatient.value.id })
    showCreatePlan.value = false
    await fetchPlans()
    loadPlan(res.data.id)
  } catch (e) {
    alert("Gagal membuat plan")
  }
}

const deletePlan = async (id: number) => {
  if (!confirm("Hapus program diet ini beserta seluruh rancangan menunya?")) return
  try {
    await api.delete(`/nutrition-plans/${id}`)
    if(activePlan.value && activePlan.value.id === id) activePlan.value = null;
    fetchPlans()
  } catch(e){}
}

// == Detail Plan Editor (Canvas) ==
const days = [
  { id: 'Monday', label: 'Senin' }, { id: 'Tuesday', label: 'Selasa' }, { id: 'Wednesday', label: 'Rabu' },
  { id: 'Thursday', label: 'Kamis' }, { id: 'Friday', label: 'Jumat' }, { id: 'Saturday', label: 'Sabtu' }, { id: 'Sunday', label: 'Minggu' }
]
const mealTypes = [
  { id: 'breakfast', label: 'Makan Pagi', icon: 'partly-sunny', iconColor: 'text-yellow-500' },
  { id: 'snack', label: 'Selingan', icon: 'cafe', iconColor: 'text-orange-400' },
  { id: 'lunch', label: 'Makan Siang', icon: 'sunny', iconColor: 'text-blue-500' },
  { id: 'dinner', label: 'Makan Malam', icon: 'moon', iconColor: 'text-indigo-800' }
]

const activeDay = ref('Monday')
const planData = ref<any>(null) // structured by day -> meal_type -> items[]

const loadPlan = async (id: number) => {
  try {
    const { data } = await api.get(`/nutrition-plans/${id}`)
    activePlan.value = data.plan
    planData.value = data.grouped_items
    
    // reset states
    mealTypes.forEach(m => {
      editStates[m.id] = { search: '', qty: '', results: [], show: false, food: null }
    })
  } catch (e) {}
}

const calcMacro = (item: any, prop: string) => {
  if (!item.food) return 0
  return Math.round((item.food[prop] * item.quantity) / 100)
}

// Quick Inputs State
const editStates = reactive<Record<string, any>>({
  breakfast: { search: '', qty: '', results: [], show: false, food: null },
  snack: { search: '', qty: '', results: [], show: false, food: null },
  lunch: { search: '', qty: '', results: [], show: false, food: null },
  dinner: { search: '', qty: '', results: [], show: false, food: null },
})

let foodSearchTimeout: any;
const searchFood = (mealId: string) => {
  const state = editStates[mealId]
  clearTimeout(foodSearchTimeout)
  foodSearchTimeout = setTimeout(async () => {
    try {
      const { data } = await api.get('/foods', { params: { search: state.search, per_page: 20 } })
      state.results = data.data || []
      state.show = true
    } catch (e) {}
  }, 300)
}

const selectFood = (mealId: string, food: any) => {
  const state = editStates[mealId]
  state.food = food
  state.search = food.name
  state.show = false
}

const addItem = (mealId: string) => {
  const state = editStates[mealId]
  if (!state.food || !state.qty) return
  
  planData.value[activeDay.value][mealId].push({
    food_id: state.food.id,
    food: state.food,
    quantity: parseFloat(state.qty)
  })
  
  state.food = null; state.search = ''; state.qty = ''; state.show = false;
}

const removeItem = (mealId: string, idx: number) => {
  planData.value[activeDay.value][mealId].splice(idx, 1)
}

// Save Daily Menu logic
const savePlanDay = async () => {
  if (!activePlan.value) return
  try {
    for (const mt of mealTypes) {
      await api.put(`/nutrition-plans/${activePlan.value.id}/items`, {
        day_of_week: activeDay.value,
        meal_type: mt.id,
        items: planData.value[activeDay.value][mt.id].map((i: any) => ({
          id: i.id || null, food_id: i.food_id, quantity: i.quantity
        }))
      })
    }
    // reload to get valid IDs
    loadPlan(activePlan.value.id)
  } catch (e) {
    alert('Gagal menyimpan menu')
  }
}

// Computed Totals
const dayTotals = computed(() => {
  let res = { energy: 0, protein: 0, fat: 0, carbohydrate: 0 }
  if(!planData.value) return res
  
  const dData = planData.value[activeDay.value]
  Object.keys(dData).forEach(mealKey => {
    dData[mealKey].forEach((i: any) => {
      res.energy += calcMacro(i, 'energy')
      res.protein += calcMacro(i, 'protein')
      res.fat += calcMacro(i, 'fat')
      res.carbohydrate += calcMacro(i, 'carbohydrate')
    })
  })
  return res
})

const mealTotals = computed(() => {
  let res: Record<string, any> = {}
  if(!planData.value) return res
  
  const dData = planData.value[activeDay.value]
  Object.keys(dData).forEach(mealKey => {
    res[mealKey] = { energy: 0 }
    dData[mealKey].forEach((i: any) => {
      res[mealKey].energy += calcMacro(i, 'energy')
    })
  })
  return res
})

// == PDF Generation ==
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const generatePDF = () => {
  if (!activePlan.value || !planData.value) return

  const doc = new jsPDF()
  const pName = activePlan.value.plan_name
  const patientName = activePatient.value.name

  // Header
  doc.setFontSize(18)
  doc.text('Preskripsi Diet & Rencana Menu', 14, 20)
  
  doc.setFontSize(11)
  doc.text(`Pasien : ${patientName}`, 14, 30)
  doc.text(`Program : ${pName}`, 14, 36)
  doc.text(`Target Harian : ${Math.round(target.value.energy)} kkal (P: ${Math.round(target.value.protein)}g, L: ${Math.round(target.value.fat)}g, K: ${Math.round(target.value.carbohydrate)}g)`, 14, 42)

  let yPos = 55

  // Render per hari
  for (const day of days) {
    const dData = planData.value[day.id]
    if (!dData) continue;

    // Check if day has any items
    const hasItems = mealTypes.some(mt => dData[mt.id] && dData[mt.id].length > 0)
    if (!hasItems) continue;

    // Add new page if close to bottom
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    // Hari label
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Menu Hari: ${day.label}`, 14, yPos)
    yPos += 5

    // Prepare table data
    const tableBody: any[] = []
    
    // Day subtotals
    let dtP = 0, dtL = 0, dtK = 0, dtE = 0;

    for (const mt of mealTypes) {
      const items = dData[mt.id]
      if (items && items.length > 0) {
        // Group header (bold)
        tableBody.push([{ content: mt.label, colSpan: 6, styles: { fillColor: [240, 240, 240], fontStyle: 'bold' } }])
        
        // Items
        items.forEach((item: any) => {
          const e = calcMacro(item, 'energy')
          const p = calcMacro(item, 'protein')
          const f = calcMacro(item, 'fat')
          const c = calcMacro(item, 'carbohydrate')
          
          dtE += e; dtP += p; dtL += f; dtK += c;

          tableBody.push([
            item.food ? item.food.name : 'Unknown',
            `${item.quantity} g`,
            `${e} kkal`,
            `${p} g`,
            `${f} g`,
            `${c} g`
          ])
        })
      }
    }
    
    // Day Total Row
    tableBody.push([{ content: 'TOTAL HARIAN', colSpan: 2, styles: { fontStyle: 'bold' } }, 
      { content: `${dtE} kkal`, styles: { fontStyle: 'bold' } }, 
      { content: `${dtP} g`, styles: { fontStyle: 'bold' } },
      { content: `${dtL} g`, styles: { fontStyle: 'bold' } },
      { content: `${dtK} g`, styles: { fontStyle: 'bold' } }
    ])

    // @ts-ignore
    doc.autoTable({
      startY: yPos,
      head: [['Makanan', 'Porsi', 'Energi', 'Protein', 'Lemak', 'Karbo']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] }, // indigo-600
      fontSize: 9,
      margin: { left: 14, right: 14 }
    })

    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 15
  }

  // Save PDF
  doc.save(`Diet_Plan_${patientName.replace(/\s+/g, '_')}_${pName.replace(/\s+/g, '_')}.pdf`)
}

// Closes popups outside
onMounted(() => {
  document.addEventListener('click', (e: Event) => {
    if (!(e.target as Element).closest('.relative')) {
      showPatientList.value = false
      Object.keys(editStates).forEach(k => editStates[k].show = false)
    }
  })
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>
