<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-4 border-2 border-indigo-300">
      <h4 class="font-bold text-indigo-900 flex items-center space-x-2">
        <ion-icon name="flame" class="text-2xl"></ion-icon>
        <span>Modified Brooke Formula - Konservatif</span>
      </h4>
      <p class="text-sm text-indigo-700 mt-1">
        Formula burn resuscitation konservatif untuk mengurangi risiko over-resuscitation
      </p>
    </div>

    <!-- Info Box -->
    <div class="bg-indigo-100 border-l-4 border-indigo-500 p-4 rounded">
      <div class="flex items-start">
        <ion-icon name="information-circle" class="text-2xl text-indigo-700 mr-3 flex-shrink-0 mt-1"></ion-icon>
        <div>
          <p class="font-bold text-indigo-900">Modified Brooke vs Parkland</p>
          <p class="text-sm text-indigo-800 mt-1">
            Modified Brooke memberikan <strong>50% lebih sedikit cairan</strong> (2 mL/kg/%TBSA vs 4 mL/kg/%TBSA) 
            untuk mengurangi komplikasi edema paru dan abdominal compartment syndrome.
          </p>
        </div>
      </div>
    </div>

    <!-- Input Form -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- Weight -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Berat Badan (kg)</label>
        <input
          v-model.number="weight"
          type="number"
          step="0.1"
          placeholder="Contoh: 70"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <!-- TBSA -->
      <div>
        <label class="block text-sm font-bold text-gray-700 mb-2">Luas Luka Bakar (% TBSA)</label>
        <input
          v-model.number="tbsa"
          type="number"
          step="0.1"
          min="0"
          max="100"
          placeholder="Contoh: 30"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <p class="text-xs text-gray-500 mt-1">Gunakan Rule of Nine atau Lund-Browder Chart</p>
      </div>

      <!-- Time since injury -->
      <div class="md:col-span-2">
        <label class="block text-sm font-bold text-gray-700 mb-2">Waktu Sejak Cedera (jam)</label>
        <input
          v-model.number="hoursSinceInjury"
          type="number"
          step="0.5"
          min="0"
          max="24"
          placeholder="Contoh: 2 (opsional - default 0)"
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Resusitasi Cairan Modified Brooke
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Comparison with Parkland -->
      <div class="bg-purple-50 border-2 border-purple-300 rounded-xl p-4">
        <p class="font-bold text-purple-900 mb-2">Perbandingan dengan Parkland Formula:</p>
        <div class="grid md:grid-cols-2 gap-3 text-sm">
          <div class="bg-white p-3 rounded-lg border border-purple-200">
            <p class="text-xs text-gray-600">Modified Brooke (2 mL/kg/%TBSA)</p>
            <p class="text-2xl font-bold text-indigo-700">{{ result.total24h.toFixed(0) }} mL</p>
          </div>
          <div class="bg-white p-3 rounded-lg border border-red-200">
            <p class="text-xs text-gray-600">Parkland (4 mL/kg/%TBSA)</p>
            <p class="text-2xl font-bold text-red-700">{{ result.parklandComparison.toFixed(0) }} mL</p>
          </div>
        </div>
        <p class="text-xs text-purple-700 mt-2">
          Modified Brooke menggunakan <strong>50% lebih sedikit</strong> cairan untuk mengurangi komplikasi over-hydration
        </p>
      </div>

      <!-- Main Result -->
      <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-indigo-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Modified Brooke</span>
        </h4>

        <!-- Total 24h -->
        <div class="bg-white rounded-lg p-6 border-2 border-indigo-400 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Cairan 24 Jam (Ringer Laktat)</p>
          <p class="text-6xl font-bold text-indigo-700 mb-1">{{ result.total24h.toFixed(0) }}</p>
          <p class="text-sm text-gray-500">mL dalam 24 jam</p>
          <p class="text-xs text-gray-600 mt-2">Formula: 2 mL × {{ weight }} kg × {{ tbsa }}% = {{ result.total24h.toFixed(0) }} mL</p>
        </div>

        <!-- Time Schedule -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 border-2 border-purple-400">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 8 JAM PERTAMA (50%)
            </p>
            <p class="text-4xl font-bold text-purple-700 mb-1">{{ result.first8h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 8 jam</p>
            <p class="text-2xl font-bold text-purple-600 mt-3">{{ result.rateFirst8h.toFixed(0) }} mL/jam</p>
            <p class="text-xs text-gray-600 mt-1">{{ result.timeFirst8h }}</p>
          </div>

          <div class="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 border-2 border-blue-400">
            <p class="text-sm font-bold text-blue-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 16 JAM BERIKUTNYA (50%)
            </p>
            <p class="text-4xl font-bold text-blue-700 mb-1">{{ result.next16h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 16 jam</p>
            <p class="text-2xl font-bold text-blue-600 mt-3">{{ result.rateNext16h.toFixed(0) }} mL/jam</p>
            <p class="text-xs text-gray-600 mt-1">{{ result.timeNext16h }}</p>
          </div>
        </div>

        <!-- Calculation steps -->
        <div class="space-y-3">
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p class="text-sm font-bold text-purple-900 mb-2">
              <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan:
            </p>
            <div class="space-y-1 text-sm text-purple-800">
              <div v-for="(step, index) in result.steps" :key="index" class="flex items-start">
                <span class="font-mono mr-2">{{ index + 1 }}.</span>
                <span>{{ step }}</span>
              </div>
            </div>
          </div>

          <!-- Monitoring -->
          <div class="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <p class="text-sm font-bold text-yellow-900 mb-2">
              <ion-icon name="pulse" class="align-middle"></ion-icon> Target Monitoring:
            </p>
            <div class="space-y-1 text-sm text-yellow-800">
              <p>• <strong>Urine Output:</strong> 0.5 mL/kg/jam = {{ (weight! * 0.5).toFixed(0) }} mL/jam</p>
              <p>• <strong>MAP:</strong> >65 mmHg</p>
              <p>• <strong>Lactate:</strong> Normalisasi dalam 24 jam</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clinical Notes -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-3 flex items-center space-x-2">
          <ion-icon name="medical" class="text-xl"></ion-icon>
          <span>Keunggulan Modified Brooke</span>
        </h5>
        <ul class="text-sm text-amber-800 space-y-2">
          <li>• <strong>Mengurangi Over-Resuscitation:</strong> Volume lebih konservatif menurunkan risiko edema paru</li>
          <li>• <strong>Mencegah Abdominal Compartment Syndrome:</strong> Komplikasi serius dari pemberian cairan berlebihan</li>
          <li>• <strong>Lebih Aman untuk Pasien Obesitas:</strong> Menghindari fluid overload</li>
          <li>• <strong>Tetap Efektif:</strong> Studi menunjukkan outcome sama baiknya dengan Parkland</li>
          <li>• <strong>Direkomendasikan untuk:</strong> Luka bakar 20-40% TBSA, pasien dengan risiko cardiac/renal</li>
        </ul>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-indigo-50 border-2 border-indigo-300 rounded-xl p-4">
      <h5 class="font-bold text-indigo-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Modified Brooke Formula</span>
      </h5>
      <div class="text-sm text-indigo-800 space-y-2">
        <p><strong>Sejarah:</strong> Modifikasi dari Brooke Formula original (3 mL/kg/%TBSA + koloid). 
        Formula modern hanya menggunakan 2 mL/kg/%TBSA kristaloid untuk mengurangi komplikasi.</p>

        <p><strong>Formula:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-indigo-200 font-mono text-xs">
          <p>Total Cairan 24 jam = 2 mL × BB (kg) × % TBSA</p>
          <p class="mt-2">• 50% dalam 8 jam pertama</p>
          <p>• 50% dalam 16 jam berikutnya</p>
        </div>

        <p><strong>Evidence Base:</strong></p>
        <ul class="text-xs space-y-1 ml-4">
          <li>• Studi menunjukkan outcome mortalitas sama dengan Parkland</li>
          <li>• Menurunkan kejadian fluid overload complications sebesar 30-40%</li>
          <li>• Direkomendasikan oleh American Burn Association sebagai alternatif valid</li>
        </ul>

        <p class="text-xs text-indigo-600 mt-2">
          <strong>Referensi:</strong> Modified Brooke Formula, American Burn Association Guidelines, 
          Cochrane Review on Burn Resuscitation (2020)
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const weight = ref<number | null>(null)
const tbsa = ref<number | null>(null)
const hoursSinceInjury = ref<number>(0)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return weight.value && weight.value > 0 && 
         tbsa.value && tbsa.value > 0 && tbsa.value <= 100
})

const calculate = async () => {
  if (!canCalculate.value || !weight.value || !tbsa.value) return

  // Modified Brooke: 2 mL × kg × %TBSA
  const total24h = 2 * weight.value * tbsa.value
  const first8h = total24h / 2
  const next16h = total24h / 2

  // Parkland comparison
  const parklandComparison = 4 * weight.value * tbsa.value

  // Calculate rates
  const hoursRemaining8h = Math.max(0, 8 - hoursSinceInjury)
  const rateFirst8h = hoursRemaining8h > 0 ? first8h / hoursRemaining8h : 0
  const rateNext16h = next16h / 16

  // Time calculation
  const injuryTime = new Date()
  injuryTime.setHours(injuryTime.getHours() - hoursSinceInjury)
  
  const end8h = new Date(injuryTime)
  end8h.setHours(end8h.getHours() + 8)
  
  const end24h = new Date(injuryTime)
  end24h.setHours(end24h.getHours() + 24)

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  }

  const timeFirst8h = hoursSinceInjury > 0 
    ? `Sisa ${hoursRemaining8h.toFixed(1)} jam`
    : `Jam ke-0 sampai jam ke-8`
  
  const timeNext16h = `Jam ke-8 sampai jam ke-24`

  const steps = [
    `Formula Modified Brooke: 2 mL × BB × %TBSA`,
    `Total 24 jam = 2 × ${weight.value} × ${tbsa.value} = ${total24h.toFixed(0)} mL`,
    `50% pertama (8 jam): ${first8h.toFixed(0)} mL`,
    `50% kedua (16 jam): ${next16h.toFixed(0)} mL`,
    `Kecepatan 8 jam pertama: ${rateFirst8h.toFixed(0)} mL/jam`,
    `Kecepatan 16 jam berikutnya: ${rateNext16h.toFixed(0)} mL/jam`,
    `Volume ini adalah 50% dari Parkland (${parklandComparison.toFixed(0)} mL)`
  ]

  result.value = {
    total24h,
    first8h,
    next16h,
    rateFirst8h,
    rateNext16h,
    timeFirst8h,
    timeNext16h,
    parklandComparison,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Modified Brooke Formula',
    inputs: {
      weight_kg: weight.value,
      tbsa_percent: tbsa.value,
      hours_since_injury: hoursSinceInjury
    },
    results: {
      total_24h_ml: total24h.toFixed(0),
      first_8h_ml: first8h.toFixed(0),
      next_16h_ml: next16h.toFixed(0),
      rate_first_8h_ml_per_hour: rateFirst8h.toFixed(0),
      rate_next_16h_ml_per_hour: rateNext16h.toFixed(0),
      parkland_comparison_ml: parklandComparison.toFixed(0)
    }
  })
}
</script>
