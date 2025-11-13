<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
      <h4 class="font-bold text-green-900 flex items-center space-x-2">
        <ion-icon name="document-text" class="text-xl"></ion-icon>
        <span>AKG Kemenkes 2019 (Standar Nasional)</span>
      </h4>
      <p class="text-sm text-green-700 mt-1">Berdasarkan Peraturan Menteri Kesehatan RI No. 28 Tahun 2019</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Gender -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Pilih Jenis Kelamin</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <!-- Age Group -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Kelompok Usia</label>
        <select
          v-model="ageGroup"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        >
          <option value="">Pilih Kelompok Usia</option>
          <option value="0-6m">0-6 bulan</option>
          <option value="6-11m">6-11 bulan</option>
          <option value="1-3y">1-3 tahun</option>
          <option value="4-6y">4-6 tahun</option>
          <option value="7-9y">7-9 tahun</option>
          <option value="10-12y">10-12 tahun</option>
          <option value="13-15y">13-15 tahun</option>
          <option value="16-18y">16-18 tahun</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Tampilkan Kebutuhan Nutrisi
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Results -->
      <div class="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-pink-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Kebutuhan Nutrisi Harian (AKG 2019)</span>
        </h4>

        <!-- Energy & Macros -->
        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Energi/Kalori</p>
            <p class="text-3xl font-bold text-pink-700">{{ result.energy }}</p>
            <p class="text-xs text-gray-500">kkal/hari</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Protein</p>
            <p class="text-3xl font-bold text-pink-700">{{ result.protein }}</p>
            <p class="text-xs text-gray-500">gram/hari</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Lemak</p>
            <p class="text-3xl font-bold text-pink-700">{{ result.fat }}</p>
            <p class="text-xs text-gray-500">gram/hari (20-25%)</p>
          </div>
        </div>

        <!-- Additional Nutrients -->
        <div class="grid md:grid-cols-4 gap-4">
          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Karbohidrat</p>
            <p class="text-2xl font-bold text-pink-700">{{ result.carbs }}</p>
            <p class="text-xs text-gray-500">gram/hari (50-65%)</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Kalsium</p>
            <p class="text-2xl font-bold text-pink-700">{{ result.calcium }}</p>
            <p class="text-xs text-gray-500">mg/hari</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">Zat Besi</p>
            <p class="text-2xl font-bold text-pink-700">{{ result.iron }}</p>
            <p class="text-xs text-gray-500">mg/hari</p>
          </div>

          <div class="bg-white rounded-lg p-4 border border-pink-200">
            <p class="text-sm text-gray-600 mb-1">BB/TB Referensi</p>
            <p class="text-lg font-bold text-pink-700">{{ result.refWeight }}kg / {{ result.refHeight }}cm</p>
          </div>
        </div>

        <!-- Reference -->
        <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-sm text-green-900">
            <strong>Referensi:</strong> Peraturan Menteri Kesehatan RI No. 28 Tahun 2019 tentang Angka Kecukupan Gizi yang Dianjurkan untuk Masyarakat Indonesia
          </p>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-green-50 border border-green-200 rounded-xl p-4">
      <h5 class="font-bold text-green-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang AKG Kemenkes 2019</span>
      </h5>
      <ul class="text-sm text-green-800 space-y-1">
        <li>• Standar resmi dari Kementerian Kesehatan Republik Indonesia</li>
        <li>• Ditetapkan melalui Permenkes No. 28 Tahun 2019 (26 Agustus 2019)</li>
        <li>• Berlaku untuk seluruh masyarakat Indonesia</li>
        <li>• Digunakan sebagai acuan program gizi nasional</li>
        <li>• Nilai berdasarkan berat dan tinggi badan referensi untuk tiap kelompok usia</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref('')
const ageGroup = ref('')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return gender.value && ageGroup.value
})

// AKG Data from Permenkes 28/2019
const akgData: Record<string, any> = {
  '0-6m': { energy: 550, protein: 9, calcium: 200, iron: 0.3, refWeight: 6, refHeight: 64 },
  '6-11m': { energy: 800, protein: 15, calcium: 250, iron: 10, refWeight: 8, refHeight: 72 },
  '1-3y': { energy: 1350, protein: 26, calcium: 650, iron: 8, refWeight: 13, refHeight: 94 },
  '4-6y': { energy: 1400, protein: 35, calcium: 1000, iron: 10, refWeight: 17, refHeight: 106 },
  '7-9y': { energy: 1650, protein: 40, calcium: 1200, iron: 13, refWeight: 25, refHeight: 120 },
  '10-12y': {
    male: { energy: 2000, protein: 50, calcium: 1200, iron: 15, refWeight: 35, refHeight: 138 },
    female: { energy: 1900, protein: 50, calcium: 1200, iron: 15, refWeight: 38, refHeight: 145 }
  },
  '13-15y': {
    male: { energy: 2400, protein: 60, calcium: 1200, iron: 19, refWeight: 50, refHeight: 160 },
    female: { energy: 2050, protein: 55, calcium: 1200, iron: 15, refWeight: 48, refHeight: 158 }
  },
  '16-18y': {
    male: { energy: 2650, protein: 65, calcium: 1200, iron: 15, refWeight: 55, refHeight: 165 },
    female: { energy: 2100, protein: 62, calcium: 1200, iron: 15, refWeight: 50, refHeight: 160 }
  }
}

const calculate = async () => {
  if (!canCalculate.value) return

  let data: any
  const needsGender = ['10-12y', '13-15y', '16-18y'].includes(ageGroup.value)

  if (needsGender) {
    if (!gender.value) {
      alert('Pilih jenis kelamin untuk kelompok usia ini')
      return
    }
    data = akgData[ageGroup.value][gender.value]
  } else {
    data = akgData[ageGroup.value]
  }

  // Calculate macronutrients
  const fat = ((data.energy * 0.225) / 9).toFixed(1) // 20-25% from fat (avg 22.5%), 9 kkal/g
  const carbs = ((data.energy * 0.55) / 4).toFixed(1) // 50-65% from carbs (avg 55%), 4 kkal/g

  result.value = {
    energy: data.energy,
    protein: data.protein,
    fat: fat,
    carbs: carbs,
    calcium: data.calcium,
    iron: data.iron,
    refWeight: data.refWeight,
    refHeight: data.refHeight
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'child_nutrition',
    method: 'AKG Kemenkes 2019',
    inputs: {
      gender: gender.value === 'male' ? 'Laki-laki' : gender.value === 'female' ? 'Perempuan' : 'Tidak spesifik',
      age_group: ageGroup.value
    },
    results: {
      energy_kcal: data.energy,
      protein_g: data.protein,
      fat_g: fat,
      carbs_g: carbs,
      calcium_mg: data.calcium,
      iron_mg: data.iron,
      ref_weight_kg: data.refWeight,
      ref_height_cm: data.refHeight
    }
  })
}
</script>
