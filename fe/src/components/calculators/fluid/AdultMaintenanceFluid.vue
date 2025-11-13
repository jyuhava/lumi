<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
      <h4 class="font-bold text-blue-900 flex items-center space-x-2">
        <ion-icon name="person" class="text-xl"></ion-icon>
        <span>Cairan Maintenance Dewasa</span>
      </h4>
      <p class="text-sm text-blue-700 mt-1">Rumus 30 mL/kg/hari untuk dewasa sehat - Standar Kemenkes RI</p>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Age -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Usia (tahun)</label>
        <input
          v-model.number="age"
          type="number"
          min="18"
          placeholder="Contoh: 35"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 60"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Gender (optional for info) -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin (opsional)</label>
        <select
          v-model="gender"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Tidak dipilih</option>
          <option value="male">Laki-laki</option>
          <option value="female">Perempuan</option>
        </select>
      </div>

      <!-- Activity Level -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Tingkat Aktivitas</label>
        <select
          v-model="activityLevel"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="sedentary">Ringan (Tidur/Duduk)</option>
          <option value="normal">Normal (Aktivitas Harian)</option>
          <option value="active">Aktif (Olahraga Rutin)</option>
        </select>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Kebutuhan Cairan
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Main Result -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-blue-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Dewasa</span>
        </h4>

        <div class="grid md:grid-cols-3 gap-4 mb-4">
          <div class="bg-white rounded-lg p-6 border-2 border-blue-300">
            <p class="text-sm text-gray-600 mb-2">Kebutuhan Basal</p>
            <p class="text-4xl font-bold text-blue-700 mb-1">{{ result.basalFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-indigo-300">
            <p class="text-sm text-gray-600 mb-2">Dengan Aktivitas</p>
            <p class="text-4xl font-bold text-indigo-700 mb-1">{{ result.adjustedFluid.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/24 jam</p>
          </div>

          <div class="bg-white rounded-lg p-6 border-2 border-purple-300">
            <p class="text-sm text-gray-600 mb-2">Kecepatan per Jam</p>
            <p class="text-4xl font-bold text-purple-700 mb-1">{{ result.fluidPerHour.toFixed(0) }}</p>
            <p class="text-sm text-gray-500">mL/jam</p>
          </div>
        </div>

        <!-- Calculation details -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <p>• Rumus basal: {{ weight }} kg × 30 mL/kg = <strong>{{ result.basalFluid.toFixed(0) }} mL/hari</strong></p>
              <p>• Faktor aktivitas: <strong>{{ result.activityFactor }}</strong> ({{ result.activityLabel }})</p>
              <p>• Total dengan aktivitas: {{ result.basalFluid.toFixed(0) }} × {{ result.activityFactor }} = <strong>{{ result.adjustedFluid.toFixed(0) }} mL/hari</strong></p>
              <p>• Setara dengan: <strong>{{ (result.adjustedFluid / 1000).toFixed(1) }} liter/hari</strong></p>
            </div>
          </div>

          <div v-if="gender" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-sm font-bold text-blue-900 mb-1">
              <ion-icon name="information-circle" class="align-middle"></ion-icon> Standar Kemenkes RI:
            </p>
            <p class="text-sm text-blue-800">
              {{ gender === 'male' ? 'Laki-laki dewasa' : 'Perempuan dewasa' }}: 
              <strong>{{ gender === 'male' ? '2.500 mL/hari' : '2.100 mL/hari' }}</strong> (rata-rata)
            </p>
          </div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-2 flex items-center space-x-2">
          <ion-icon name="bulb" class="text-xl"></ion-icon>
          <span>Catatan Klinis</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-1">
          <li>• Rumus ini untuk dewasa sehat tanpa penyakit penyerta</li>
          <li>• Tambahkan cairan jika demam, diare, muntah, atau berkeringat banyak</li>
          <li>• Kurangi cairan pada gagal jantung atau gagal ginjal (konsultasi dokter)</li>
          <li>• Sumber: Air putih, teh, kopi, jus, sup, buah-buahan</li>
          <li>• Batasi minuman manis dan berkafein tinggi</li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
      <h5 class="font-bold text-blue-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Kebutuhan Cairan Dewasa</span>
      </h5>
      <div class="text-sm text-blue-800 space-y-2">
        <p><strong>Rumus Standar:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-blue-200 space-y-1">
          <p>• <strong>30 mL/kg/hari</strong> (standar internasional)</p>
          <p>• Atau <strong>25 mL/kg/hari</strong> (konservatif untuk lansia)</p>
          <p>• Standar Kemenkes RI: <strong>2.000 mL/hari</strong> (rata-rata dewasa)</p>
        </div>

        <p><strong>Faktor yang Mempengaruhi:</strong></p>
        <ul class="text-xs space-y-1">
          <li>• Aktivitas fisik (olahraga, pekerjaan berat)</li>
          <li>• Suhu lingkungan (cuaca panas, AC)</li>
          <li>• Status kesehatan (demam, diare, muntah)</li>
          <li>• Kehamilan dan menyusui (+300-700 mL/hari)</li>
        </ul>

        <p class="text-xs text-blue-600 mt-2">
          <strong>Referensi:</strong> Permenkes RI No. 28/2019, WHO, American College of Sports Medicine
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const age = ref<number | null>(null)
const weight = ref<number | null>(null)
const gender = ref<string>('')
const activityLevel = ref<'sedentary' | 'normal' | 'active'>('normal')
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value) return

  const basalFluid = weight.value * 30

  let activityFactor = 1
  let activityLabel = ''

  switch (activityLevel.value) {
    case 'sedentary':
      activityFactor = 0.9
      activityLabel = 'Ringan'
      break
    case 'normal':
      activityFactor = 1.0
      activityLabel = 'Normal'
      break
    case 'active':
      activityFactor = 1.2
      activityLabel = 'Aktif'
      break
  }

  const adjustedFluid = basalFluid * activityFactor
  const fluidPerHour = adjustedFluid / 24

  result.value = {
    basalFluid,
    adjustedFluid,
    fluidPerHour,
    activityFactor,
    activityLabel
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Adult Maintenance Fluid',
    inputs: {
      age_years: age.value || 'Tidak diisi',
      weight_kg: weight.value,
      gender: gender.value ? (gender.value === 'male' ? 'Laki-laki' : 'Perempuan') : 'Tidak diisi',
      activity_level: activityLabel
    },
    results: {
      basal_fluid_ml: basalFluid.toFixed(0),
      adjusted_fluid_ml: adjustedFluid.toFixed(0),
      fluid_per_hour_ml: fluidPerHour.toFixed(0)
    }
  })
}
</script>
