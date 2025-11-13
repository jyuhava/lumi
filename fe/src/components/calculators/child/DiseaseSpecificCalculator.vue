<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
      <h4 class="font-bold text-orange-900 flex items-center space-x-2">
        <ion-icon name="medical-outline" class="text-xl"></ion-icon>
        <span>Kebutuhan Nutrisi Penyakit Spesifik</span>
      </h4>
      <p class="text-sm text-orange-700 mt-1">Perhitungan untuk kondisi khusus: Pneumonia, Diare, Tifoid, Luka Bakar</p>
    </div>

    <!-- Disease Selection -->
    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Pilih Penyakit</label>
      <select
        v-model="disease"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      >
        <option value="">-- Pilih Penyakit --</option>
        <option value="pneumonia">Pneumonia / Infeksi Respiratori</option>
        <option value="diarrhea">Diare / Gastroenteritis</option>
        <option value="typhoid">Demam Tifoid</option>
        <option value="burn">Luka Bakar (Curreri Formula)</option>
      </select>
    </div>

    <!-- Dynamic Form based on disease -->
    <div v-if="disease" class="space-y-6">
      <!-- Common inputs -->
      <div class="grid md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
          <input
            v-model.number="age"
            type="number"
            step="0.1"
            min="0"
            placeholder="Contoh: 6"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
          <input
            v-model.number="weight"
            type="number"
            step="0.1"
            placeholder="Contoh: 20"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
          />
        </div>
      </div>

      <!-- Burn-specific input -->
      <div v-if="disease === 'burn'">
        <label class="block text-sm font-bold text-gray-700 mb-2">Luas Luka Bakar (%)</label>
        <input
          v-model.number="burnArea"
          type="number"
          step="1"
          min="0"
          max="100"
          placeholder="Contoh: 30"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
        />
        <p class="text-xs text-gray-500 mt-1">Persentase luas permukaan tubuh yang terkena luka bakar</p>
      </div>

      <!-- Calculate Button -->
      <button
        @click="calculate"
        :disabled="!canCalculate"
        class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
      >
        <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
        Hitung Kebutuhan Nutrisi
      </button>
    </div>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div class="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-orange-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Kebutuhan Nutrisi - {{ result.diseaseName }}</span>
        </h4>

        <!-- Energy & Protein -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-orange-200">
            <p class="text-sm text-gray-600 mb-1">Kebutuhan Kalori</p>
            <p class="text-4xl font-bold text-orange-700">{{ result.calories.toFixed(0) }}</p>
            <p class="text-xs text-gray-500">kkal/hari</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-red-200">
            <p class="text-sm text-gray-600 mb-1">Kebutuhan Protein</p>
            <p class="text-3xl font-bold text-red-700">{{ result.protein }}</p>
            <p class="text-xs text-gray-500">gram/hari</p>
          </div>
        </div>

        <!-- Formula -->
        <div v-if="result.formula" class="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
          <p class="text-sm font-bold text-blue-900 mb-1">Formula:</p>
          <p class="text-sm text-blue-800">{{ result.formula }}</p>
        </div>

        <!-- Specific Nutritional Needs -->
        <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p class="text-sm font-bold text-purple-900 mb-2">
            <ion-icon name="nutrition" class="align-middle"></ion-icon> Kebutuhan Zat Gizi Khusus:
          </p>
          <ul class="text-sm text-purple-800 space-y-1">
            <li v-for="(need, index) in result.specificNeeds" :key="index">
              • {{ need }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Clinical Notes -->
      <div v-if="result.clinicalNotes" class="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-2 flex items-center space-x-2">
          <ion-icon name="alert-circle" class="text-xl"></ion-icon>
          <span>Catatan Klinis</span>
        </h5>
        <div class="text-sm text-amber-800 space-y-1">
          <p v-for="(note, index) in result.clinicalNotes" :key="index">• {{ note }}</p>
        </div>
      </div>
    </div>

    <!-- Disease Information -->
    <div v-if="disease" class="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2">Informasi: {{ diseaseInfo[disease]?.name }}</h5>
      <p class="text-sm text-blue-800">{{ diseaseInfo[disease]?.description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const disease = ref('')
const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const burnArea = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  if (!weight.value || weight.value <= 0) return false
  if (disease.value === 'burn' && (!burnArea.value || burnArea.value <= 0)) return false
  return true
})

const diseaseInfo: Record<string, any> = {
  pneumonia: {
    name: 'Pneumonia / Infeksi Respiratori',
    description: 'Infeksi saluran pernapasan yang meningkatkan kebutuhan energi dan protein. Status gizi kurang meningkatkan risiko pneumonia 9-27 kali lipat.'
  },
  diarrhea: {
    name: 'Diare / Gastroenteritis',
    description: 'Penyebab utama malnutrisi pada balita. Memerlukan penggantian cairan dan elektrolit yang hilang serta nutrisi untuk regenerasi usus.'
  },
  typhoid: {
    name: 'Demam Tifoid',
    description: 'Infeksi sistemik yang memerlukan diet khusus dan peningkatan kalori untuk kompensasi katabolisme.'
  },
  burn: {
    name: 'Luka Bakar',
    description: 'Kondisi hipermetabolik yang memerlukan kalori dan protein sangat tinggi untuk penyembuhan luka.'
  }
}

const calculate = async () => {
  if (!canCalculate.value || !weight.value) return

  let calories = 0
  let protein = ''
  let formula = ''
  let specificNeeds: string[] = []
  let clinicalNotes: string[] = []

  // Calculate basal using Holliday-Segar
  let basalCalories = 0
  if (weight.value <= 10) {
    basalCalories = weight.value * 100
  } else if (weight.value > 10 && weight.value <= 20) {
    basalCalories = 1000 + ((weight.value - 10) * 50)
  } else {
    basalCalories = 1500 + ((weight.value - 20) * 20)
  }

  if (disease.value === 'pneumonia') {
    calories = basalCalories * 1.4
    protein = `${(weight.value * 1.5).toFixed(1)} - ${(weight.value * 2.0).toFixed(1)} g/hari`
    formula = `Kalori = ${basalCalories.toFixed(0)} × 1.4 (SF Pneumonia) = ${calories.toFixed(0)} kkal/hari`
    specificNeeds = [
      'Protein: 1.5-2.0 g/kg BB/hari (untuk imunitas)',
      'Vitamin A: 1.500-2.000 IU/hari (epitel respiratori)',
      'Vitamin C: 100-200 mg/hari (antioksidan)',
      'Seng (Zinc): 10-15 mg/hari (imunitas)',
      'Cairan: Tambah 10-20% dari kebutuhan basal'
    ]
    clinicalNotes = [
      'Status gizi kurang meningkatkan risiko pneumonia 9-27× lipat',
      'Malnutrisi menurunkan sistem imun dan meningkatkan kerentanan infeksi',
      'Monitor saturasi oksigen dan distress pernapasan'
    ]
  } else if (disease.value === 'diarrhea') {
    calories = basalCalories * 1.375
    protein = `${(weight.value * 1.5).toFixed(1)} - ${(weight.value * 2.0).toFixed(1)} g/hari`
    formula = `Kalori = ${basalCalories.toFixed(0)} × 1.375 (SF Diare) = ${calories.toFixed(0)} kkal/hari`
    specificNeeds = [
      'Cairan: Tambah 20-50% (sesuai derajat dehidrasi)',
      'Elektrolit: Ganti natrium, kalium, klorida yang hilang',
      'Protein: 1.5-2.0 g/kg BB/hari (regenerasi usus)',
      'Zinc: 10-20 mg/hari (mempercepat penyembuhan diare)',
      'Diet BRAT: Banana, Rice, Applesauce, Toast (fase akut)'
    ]
    clinicalNotes = [
      'Diare adalah penyebab utama malnutrisi pada balita',
      'Rehidrasi adalah prioritas utama',
      'Lanjutkan pemberian makan untuk mencegah malnutrisi',
      'Monitor tanda dehidrasi (turgor kulit, mata cekung, produksi urin)'
    ]
  } else if (disease.value === 'typhoid') {
    calories = basalCalories * 1.4
    protein = `${(weight.value * 1.5).toFixed(1)} - ${(weight.value * 2.0).toFixed(1)} g/hari`
    formula = `Kalori = ${basalCalories.toFixed(0)} × 1.4 (SF Tifoid) = ${calories.toFixed(0)} kkal/hari`
    specificNeeds = [
      'Diet: Lunak/cair pada fase akut, gradual ke makanan lembek',
      'Kalori: Cukup untuk kompensasi katabolisme',
      'Protein: 1.5-2.0 g/kg BB/hari',
      'Cairan: Cukup untuk mengganti kehilangan',
      'Hindari makanan pedas, asam, dan berserat tinggi'
    ]
    clinicalNotes = [
      'Istirahat usus pada fase akut demam',
      'Tingkatkan konsistensi makanan bertahap sesuai toleransi',
      'Monitor komplikasi (perforasi usus, perdarahan)',
      'Nutrisi parenteral jika tidak toleran oral'
    ]
  } else if (disease.value === 'burn' && burnArea.value) {
    // Curreri Formula for burns
    calories = (25 * weight.value) + (40 * burnArea.value)
    protein = `${(weight.value * 2.0).toFixed(1)} - ${(weight.value * 3.0).toFixed(1)} g/hari`
    formula = `Curreri Formula: (25 × ${weight.value} kg) + (40 × ${burnArea.value}% luas luka) = ${calories.toFixed(0)} kkal/hari`
    specificNeeds = [
      'Protein: 2.0-3.0 g/kg BB/hari (SANGAT TINGGI untuk penyembuhan)',
      'Vitamin C: 500-1000 mg/hari (penyembuhan luka)',
      'Seng (Zinc): 15-30 mg/hari',
      'Cairan: Cukup untuk keseimbangan cairan (gunakan Parkland formula)',
      'Kalori tinggi untuk hipermetabolisme'
    ]
    clinicalNotes = [
      'Luka bakar menyebabkan keadaan hipermetabolik ekstrim',
      'Kebutuhan protein sangat tinggi untuk regenerasi jaringan',
      'Monitor albumin serum dan prealbumin',
      'Nutrisi enteral dini (dalam 24-48 jam) jika memungkinkan',
      `Luas luka bakar ${burnArea.value}% - ${burnArea.value > 40 ? 'KRITIS' : burnArea.value > 20 ? 'BERAT' : 'SEDANG'}`
    ]
  }

  result.value = {
    diseaseName: diseaseInfo[disease.value].name,
    calories,
    protein,
    formula,
    specificNeeds,
    clinicalNotes: clinicalNotes.length > 0 ? clinicalNotes : null
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'child_nutrition',
    method: `Disease Specific - ${diseaseInfo[disease.value].name}`,
    inputs: {
      age_years: age.value || 'Tidak diisi',
      weight_kg: weight.value,
      burn_area_percent: disease.value === 'burn' ? burnArea.value : null
    },
    results: {
      calories_kcal: calories.toFixed(0),
      protein_g: protein,
      formula: formula
    }
  })
}
</script>
