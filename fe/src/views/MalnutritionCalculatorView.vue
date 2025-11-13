<template>
  <AdminLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div class="max-w-7xl mx-auto">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-4xl font-bold text-gray-900 mb-2 flex items-center space-x-3">
            <ion-icon name="fitness" class="text-rose-600"></ion-icon>
            <span>Malnutrition Calculator</span>
          </h1>
          <p class="text-gray-600">
            Skrining dan penilaian status gizi - Malnutrisi anak, dewasa, luka bakar, dan sindrom metabolik
          </p>
        </div>

        <!-- Calculator Selection -->
        <div class="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <label class="block text-lg font-bold text-gray-800 mb-4">
            Pilih Jenis Penilaian:
          </label>
          <select
            v-model="selectedCalculator"
            class="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
          >
            <option value="">-- Pilih Metode Penilaian --</option>
            
            <optgroup label="MALNUTRISI ANAK">
              <option value="child-zscore">Z-Score Anthropometric (WHO-NCHS)</option>
              <option value="child-muac">MUAC - Lingkar Lengan Atas</option>
              <option value="child-waterlow">Waterlow Method (Weight for Height)</option>
              <option value="strongkids">STRONGkids Screening Tool</option>
            </optgroup>

            <optgroup label="MALNUTRISI DEWASA">
              <option value="adult-bmi">IMT & Klasifikasi KEP</option>
              <option value="adult-lab">Parameter Laboratorium</option>
              <option value="must">MUST (Malnutrition Universal Screening)</option>
            </optgroup>

            <optgroup label="MALNUTRISI LUKA BAKAR">
              <option value="nrs2002">NRS 2002 (Nutrition Risk Screening)</option>
              <option value="burn-metabolic">Perubahan Metabolik Luka Bakar</option>
            </optgroup>

            <optgroup label="SINDROM METABOLIK">
              <option value="metabolic-syndrome">NCEP-ATP III Criteria</option>
            </optgroup>
          </select>
        </div>

        <!-- Calculator Components -->
        <div v-if="selectedCalculator" class="bg-white rounded-2xl shadow-xl p-8">
          <component :is="currentComponent" />
        </div>

        <!-- Info Box -->
        <div v-else class="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-2xl p-8">
          <h3 class="font-bold text-rose-900 mb-4 flex items-center text-xl">
            <ion-icon name="information-circle" class="text-2xl mr-2"></ion-icon>
            Tentang Malnutrition Calculator
          </h3>
          <div class="text-rose-800 space-y-3">
            <p>
              Calculator ini menyediakan berbagai metode skrining dan penilaian status gizi berdasarkan 
              standar Kemenkes RI, WHO, ASPEN, dan protokol internasional.
            </p>
            
            <div class="grid md:grid-cols-2 gap-4 mt-4">
              <div class="bg-white p-4 rounded-lg border border-rose-200">
                <p class="font-bold text-rose-900 mb-2">🧒 Anak</p>
                <ul class="text-sm space-y-1">
                  <li>• Z-Score (WHO-NCHS)</li>
                  <li>• MUAC ≥13,5 cm</li>
                  <li>• Waterlow Method</li>
                  <li>• STRONGkids Tool</li>
                </ul>
              </div>

              <div class="bg-white p-4 rounded-lg border border-rose-200">
                <p class="font-bold text-rose-900 mb-2">👨 Dewasa</p>
                <ul class="text-sm space-y-1">
                  <li>• IMT & KEP</li>
                  <li>• Lab Parameters</li>
                  <li>• MUST Screening</li>
                </ul>
              </div>

              <div class="bg-white p-4 rounded-lg border border-rose-200">
                <p class="font-bold text-rose-900 mb-2">🔥 Luka Bakar</p>
                <ul class="text-sm space-y-1">
                  <li>• NRS 2002 (Spesifisitas 100%)</li>
                  <li>• Metabolic Changes</li>
                </ul>
              </div>

              <div class="bg-white p-4 rounded-lg border border-rose-200">
                <p class="font-bold text-rose-900 mb-2">⚕️ Sindrom Metabolik</p>
                <ul class="text-sm space-y-1">
                  <li>• NCEP-ATP III</li>
                  <li>• 5 Kriteria Diagnosis</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AdminLayout from '@/components/AdminLayout.vue'

// Child Malnutrition Components
import ChildZScore from '@/components/calculators/malnutrition/ChildZScore.vue'
import ChildMUAC from '@/components/calculators/malnutrition/ChildMUAC.vue'
import ChildWaterlow from '@/components/calculators/malnutrition/ChildWaterlow.vue'
import STRONGkids from '@/components/calculators/malnutrition/STRONGkids.vue'

// Adult Malnutrition Components
import AdultBMI from '@/components/calculators/malnutrition/AdultBMI.vue'
import AdultLab from '@/components/calculators/malnutrition/AdultLab.vue'
import MUST from '@/components/calculators/malnutrition/MUST.vue'

// Burn Malnutrition Components
import NRS2002 from '@/components/calculators/malnutrition/NRS2002.vue'
import BurnMetabolic from '@/components/calculators/malnutrition/BurnMetabolic.vue'

// Metabolic Syndrome
import MetabolicSyndrome from '@/components/calculators/malnutrition/MetabolicSyndrome.vue'

const selectedCalculator = ref<string>('')

const currentComponent = computed(() => {
  const components: Record<string, any> = {
    'child-zscore': ChildZScore,
    'child-muac': ChildMUAC,
    'child-waterlow': ChildWaterlow,
    'strongkids': STRONGkids,
    'adult-bmi': AdultBMI,
    'adult-lab': AdultLab,
    'must': MUST,
    'nrs2002': NRS2002,
    'burn-metabolic': BurnMetabolic,
    'metabolic-syndrome': MetabolicSyndrome
  }
  return components[selectedCalculator.value] || null
})
</script>
