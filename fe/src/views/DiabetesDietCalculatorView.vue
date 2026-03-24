<template>
  <AdminLayout>
    <div class="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="flex items-center gap-3">
           <router-link to="/calculator" class="text-gray-400 hover:text-blue-600 transition-colors">
              <ion-icon name="arrow-back-outline" class="text-xl"></ion-icon>
           </router-link>
           <h2 class="text-3xl font-extrabold text-[#16200B] tracking-tight flex items-center gap-2">
             <ion-icon name="pulse" class="text-blue-600"></ion-icon> Diabetes Diet Calculator
           </h2>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-2 max-w-xl leading-relaxed ml-9">
          Perhitungan diet Diabetes Melitus Tipe 2 - Standar PERKENI 2024 & Kemenkes RI
        </p>
      </div>
      <div>
         <router-link
            to="/calculator/history?type=diabetes_diet"
            class="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 hover:text-blue-600 hover:border-blue-600 transition-all shadow-sm flex items-center gap-2 text-sm"
          >
            <ion-icon name="time-outline" class="text-lg"></ion-icon>
            Riwayat
          </router-link>
      </div>
    </div>

    <!-- Info Box -->
    <div class="bg-blue-50/50 rounded-2xl px-6 py-4 border border-blue-100 mb-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-3 bg-white rounded-xl shadow-sm border border-blue-50">
          <ion-icon name="calculator" class="text-2xl text-blue-500 mb-1"></ion-icon>
          <p class="text-xs font-bold text-gray-700">Kalori & Makro</p>
        </div>
        <div class="p-3 bg-white rounded-xl shadow-sm border border-blue-50">
          <ion-icon name="restaurant" class="text-2xl text-blue-500 mb-1"></ion-icon>
          <p class="text-xs font-bold text-gray-700">Sistem Penukar</p>
        </div>
        <div class="p-3 bg-white rounded-xl shadow-sm border border-blue-50">
          <ion-icon name="time" class="text-2xl text-blue-500 mb-1"></ion-icon>
          <p class="text-xs font-bold text-gray-700">Pola 3J</p>
        </div>
        <div class="p-3 bg-white rounded-xl shadow-sm border border-blue-50">
          <ion-icon name="analytics" class="text-2xl text-blue-500 mb-1"></ion-icon>
          <p class="text-xs font-bold text-gray-700">Monitoring</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
      <!-- Sidebar / Tabs -->
      <div class="md:col-span-1 space-y-2">
        <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 px-2">
          <ion-icon name="list-outline" class="text-blue-500 text-xl"></ion-icon> Metode
        </h3>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Kebutuhan Energi</p>
        <button 
          @click="selectedMethod = 'rule-of-thumb'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'rule-of-thumb' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="flash-outline" class="text-lg"></ion-icon>
          PERKENI 2024
        </button>
        <button 
          @click="selectedMethod = 'harris-benedict'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'harris-benedict' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="flask-outline" class="text-lg"></ion-icon>
          Harris-Benedict
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Makronutrien</p>
        <button 
          @click="selectedMethod = 'macronutrient-distribution'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'macronutrient-distribution' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="pie-chart-outline" class="text-lg"></ion-icon>
          Distribusi
        </button>
        <button 
          @click="selectedMethod = 'food-exchange'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'food-exchange' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="cart-outline" class="text-lg"></ion-icon>
          Sistem Penukar
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Perencanaan Menu</p>
        <button 
          @click="selectedMethod = 'meal-pattern-3j'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'meal-pattern-3j' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="restaurant-outline" class="text-lg"></ion-icon>
          Pola Makan 3J
        </button>
        <button 
          @click="selectedMethod = 'glycemic-index'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'glycemic-index' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="trending-up-outline" class="text-lg"></ion-icon>
          Indeks Glikemik
        </button>

        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-4 mb-2 px-2">Standar Diet</p>
        <button 
          @click="selectedMethod = 'standard-dm-diet'"
          :class="[
            'w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-3 border',
            selectedMethod === 'standard-dm-diet' 
              ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          ]"
        >
          <ion-icon name="document-text-outline" class="text-lg"></ion-icon>
          Diet DM I-VIII
        </button>
      </div>

      <!-- Main Content / Calculator Component -->
      <div class="md:col-span-3 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 min-h-[500px]">
        
        <div class="space-y-5">
          <!-- Calculator Component -->
          <div v-if="selectedMethod" class="animate-fade-in-up">
            <component :is="calculatorComponents[selectedMethod]" />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in-up flex flex-col items-center">
             <div class="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
               <ion-icon name="medical" class="text-4xl"></ion-icon>
             </div>
             <p class="text-lg font-bold text-slate-800">Pilih Metode Perhitungan</p>
             <p class="text-sm text-slate-500 mt-2 max-w-sm">Silakan pilih metode penilaian dari menu di samping untuk memulai kalkulasi diet diabetes.</p>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, markRaw } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Energy Calculation Components
import RuleOfThumb from '@/components/calculators/diabetes-diet/RuleOfThumb.vue'
import HarrisBenedict from '@/components/calculators/diabetes-diet/HarrisBenedict.vue'

// Macronutrient Components
import MacronutrientDistribution from '@/components/calculators/diabetes-diet/MacronutrientDistribution.vue'
import FoodExchange from '@/components/calculators/diabetes-diet/FoodExchange.vue'

// Meal Planning Components
import MealPattern3J from '@/components/calculators/diabetes-diet/MealPattern3J.vue'
import GlycemicIndex from '@/components/calculators/diabetes-diet/GlycemicIndex.vue'

// Standard Diet Component
import StandardDMDiet from '@/components/calculators/diabetes-diet/StandardDMDiet.vue'

const selectedMethod = ref('rule-of-thumb')

const calculatorComponents: Record<string, any> = {
  'rule-of-thumb': markRaw(RuleOfThumb),
  'harris-benedict': markRaw(HarrisBenedict),
  'macronutrient-distribution': markRaw(MacronutrientDistribution),
  'food-exchange': markRaw(FoodExchange),
  'meal-pattern-3j': markRaw(MealPattern3J),
  'glycemic-index': markRaw(GlycemicIndex),
  'standard-dm-diet': markRaw(StandardDMDiet),
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-up {
  animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}
</style>
