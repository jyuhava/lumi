<template>
  <div class="space-y-6">
    <!-- Calculator Title -->
    <div class="flex items-center space-x-3 mb-4">
      <div class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
        <ion-icon name="calculator" class="text-xl text-white"></ion-icon>
      </div>
      <div>
        <h4 class="font-bold text-gray-900">Estimasi Berat Badan dari LILA</h4>
        <p class="text-sm text-gray-600">Ketika pengukuran BB langsung tidak memungkinkan</p>
      </div>
    </div>

    <!-- Method Selection -->
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Pilih Metode Estimasi
      </label>
      <select
        v-model="method"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
      >
        <option value="">-- Pilih Metode --</option>
        <option value="crandal">Rumus Crandal (dengan TB)</option>
        <option value="jung">Rumus Jung (dengan Tinggi Lutut)</option>
        <option value="cerra">Rumus Cerra (sederhana)</option>
      </select>
    </div>

    <!-- Crandal Method -->
    <div v-if="method === 'crandal'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Kelamin
          </label>
          <select
            v-model="gender"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
          >
            <option value="">Pilih</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            LILA (cm)
          </label>
          <input
            v-model.number="lila"
            type="number"
            step="0.1"
            placeholder="Contoh: 28.5"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Tinggi Badan (cm)
          </label>
          <input
            v-model.number="height"
            type="number"
            step="0.1"
            placeholder="Contoh: 170"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <button
        @click="calculateCrandal"
        :disabled="!gender || !lila || !height"
        class="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ion-icon name="calculator-outline" class="align-middle mr-2"></ion-icon>
        Hitung Estimasi BB (Crandal)
      </button>
    </div>

    <!-- Jung Method -->
    <div v-if="method === 'jung'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            LILA (cm)
          </label>
          <input
            v-model.number="lila"
            type="number"
            step="0.1"
            placeholder="Contoh: 28.5"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Tinggi Lutut (cm)
          </label>
          <input
            v-model.number="kneeHeight"
            type="number"
            step="0.1"
            placeholder="Contoh: 52"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <button
        @click="calculateJung"
        :disabled="!lila || !kneeHeight"
        class="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ion-icon name="calculator-outline" class="align-middle mr-2"></ion-icon>
        Hitung Estimasi BB (Jung)
      </button>
    </div>

    <!-- Cerra Method -->
    <div v-if="method === 'cerra'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Jenis Kelamin
          </label>
          <select
            v-model="gender"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all bg-white"
          >
            <option value="">Pilih</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            LILA (cm)
          </label>
          <input
            v-model.number="lila"
            type="number"
            step="0.1"
            placeholder="Contoh: 28.5"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Tinggi Badan (cm)
          </label>
          <input
            v-model.number="height"
            type="number"
            step="0.1"
            placeholder="Contoh: 170"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          />
        </div>
      </div>

      <button
        @click="calculateCerra"
        :disabled="!gender || !lila || !height"
        class="w-full py-3 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ion-icon name="calculator-outline" class="align-middle mr-2"></ion-icon>
        Hitung Estimasi BB (Cerra)
      </button>
    </div>

    <!-- Result -->
    <div v-if="result" class="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-200">
      <h5 class="font-bold text-cyan-900 mb-4 flex items-center">
        <ion-icon name="analytics" class="mr-2 text-xl"></ion-icon>
        Hasil Estimasi
      </h5>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Metode</p>
          <p class="text-lg font-bold text-cyan-600">{{ result.methodName }}</p>
        </div>
        
        <div class="bg-white rounded-lg p-4 shadow-sm">
          <p class="text-sm text-gray-600 mb-1">Estimasi Berat Badan</p>
          <p class="text-3xl font-bold text-cyan-600">{{ result.weight }}</p>
          <p class="text-xs text-gray-500 mt-1">kg</p>
        </div>
      </div>

      <div class="bg-white rounded-lg p-4 shadow-sm">
        <p class="text-sm font-semibold text-gray-700 mb-2">Catatan:</p>
        <p class="text-sm text-gray-600 mb-2">{{ result.note }}</p>
        <p class="text-xs text-amber-700 bg-amber-50 p-2 rounded">
          ⚠️ <strong>Bias estimasi:</strong> {{ result.bias }}
        </p>
      </div>
    </div>

    <!-- Formula Information -->
    <div class="grid grid-cols-1 gap-4">
      <div class="bg-indigo-50 border-l-4 border-indigo-500 rounded-lg p-4">
        <p class="text-sm font-semibold text-indigo-900 mb-2">Rumus Crandal:</p>
        <div class="bg-white rounded p-3 space-y-1 text-xs font-mono">
          <p><strong>Pria:</strong> BB = -93,2 + (3,29 × LILA) + (0,43 × TB)</p>
          <p><strong>Wanita:</strong> BB = -64,6 + (2,15 × LILA) + (0,54 × TB)</p>
        </div>
      </div>

      <div class="bg-purple-50 border-l-4 border-purple-500 rounded-lg p-4">
        <p class="text-sm font-semibold text-purple-900 mb-2">Rumus Jung:</p>
        <div class="bg-white rounded p-3 text-xs font-mono">
          BB = (3,07 × LILA) + (1,10 × Tinggi Lutut) - 75,81
        </div>
      </div>

      <div class="bg-pink-50 border-l-4 border-pink-500 rounded-lg p-4">
        <p class="text-sm font-semibold text-pink-900 mb-2">Rumus Cerra (Sederhana):</p>
        <div class="bg-white rounded p-3 space-y-1 text-xs font-mono">
          <p>BB = (LILA Diukur / LILA Standar Cerra) × (TB - 100)</p>
          <p class="text-gray-600">Standar Cerra: Pria 29 cm, Wanita 28,5 cm</p>
        </div>
      </div>
    </div>

    <!-- Reference -->
    <div class="bg-gray-50 rounded-xl p-4">
      <p class="text-xs text-gray-600">
        <strong>Sumber:</strong> Repository Unimus - Buku Rumus Edisi 3, Oktober 2018
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const method = ref('')
const gender = ref('')
const lila = ref<number | null>(null)
const height = ref<number | null>(null)
const kneeHeight = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const calculateCrandal = async () => {
  if (!gender.value || !lila.value || !height.value) return

  let weight = 0
  let bias = ''

  if (gender.value === 'male') {
    weight = -93.2 + (3.29 * lila.value) + (0.43 * height.value)
    bias = '± 10,1 kg'
  } else {
    weight = -64.6 + (2.15 * lila.value) + (0.54 * height.value)
    bias = '± 9,9 kg'
  }

  result.value = {
    methodName: 'Crandal',
    weight: weight.toFixed(1),
    note: 'Metode Crandal menggunakan LILA dan tinggi badan untuk estimasi berat badan.',
    bias: bias
  }

  await saveCalculation({
    calculator_type: 'nutritional_status',
    method: 'Weight Estimation - Crandal',
    inputs: {
      gender: gender.value,
      lila: lila.value,
      height: height.value
    },
    results: result.value
  })
}

const calculateJung = async () => {
  if (!lila.value || !kneeHeight.value) return

  const weight = (3.07 * lila.value) + (1.10 * kneeHeight.value) - 75.81

  result.value = {
    methodName: 'Jung',
    weight: weight.toFixed(1),
    note: 'Metode Jung menggunakan LILA dan tinggi lutut untuk estimasi berat badan.',
    bias: 'Variabel sesuai populasi'
  }

  await saveCalculation({
    calculator_type: 'nutritional_status',
    method: 'Weight Estimation - Jung',
    inputs: {
      lila: lila.value,
      kneeHeight: kneeHeight.value
    },
    results: result.value
  })
}

const calculateCerra = async () => {
  if (!gender.value || !lila.value || !height.value) return

  const standard = gender.value === 'male' ? 29 : 28.5
  const weight = (lila.value / standard) * (height.value - 100)

  result.value = {
    methodName: 'Cerra (Sederhana)',
    weight: weight.toFixed(1),
    note: 'Metode Cerra menggunakan rasio LILA terhadap standar untuk estimasi berat badan.',
    bias: 'Metode praktis lapangan'
  }

  await saveCalculation({
    calculator_type: 'nutritional_status',
    method: 'Weight Estimation - Cerra',
    inputs: {
      gender: gender.value,
      lila: lila.value,
      height: height.value
    },
    results: result.value
  })
}
</script>
