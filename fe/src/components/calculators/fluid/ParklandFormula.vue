<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-red-50 via-orange-50 to-yellow-50 rounded-xl p-4 border-2 border-red-300">
      <h4 class="font-bold text-red-900 flex items-center space-x-2">
        <ion-icon name="flame" class="text-2xl"></ion-icon>
        <span>Parkland Formula (Baxter) - Standar Emas Burn Resuscitation</span>
      </h4>
      <p class="text-sm text-red-700 mt-1">
        Formula resusitasi cairan luka bakar paling banyak digunakan di dunia - Parkland Memorial Hospital (1968)
      </p>
    </div>

    <!-- Warning -->
    <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded">
      <div class="flex items-start">
        <ion-icon name="warning" class="text-2xl text-red-700 mr-3 flex-shrink-0 mt-1"></ion-icon>
        <div>
          <p class="font-bold text-red-900">PERINGATAN KRITIS</p>
          <p class="text-sm text-red-800 mt-1">
            Formula ini untuk <strong>luka bakar ≥15-20% TBSA</strong> pada dewasa atau <strong>≥10% TBSA</strong> pada anak.
            Luka bakar >40% TBSA memerlukan perawatan intensif di ICU burn unit.
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
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
          class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
        <p class="text-xs text-gray-500 mt-1">Jika pasien datang terlambat, masukkan berapa jam sejak cedera terjadi</p>
      </div>
    </div>

    <!-- Calculate Button -->
    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 hover:from-red-700 hover:via-orange-700 hover:to-yellow-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Resusitasi Cairan Parkland
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <!-- Severity Warning -->
      <div v-if="tbsa && tbsa > 40" class="bg-red-100 border-2 border-red-500 rounded-xl p-4">
        <p class="font-bold text-red-900 flex items-center">
          <ion-icon name="alert-circle" class="text-2xl mr-2"></ion-icon>
          LUKA BAKAR BERAT (>40% TBSA)
        </p>
        <p class="text-sm text-red-800 mt-1">
          Segera rujuk ke ICU Burn Unit. Risiko tinggi shock, ARDS, gagal ginjal akut, dan sepsis.
        </p>
      </div>

      <!-- Main Result -->
      <div class="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border-2 border-red-300 rounded-xl p-6">
        <h4 class="text-lg font-bold text-red-900 mb-4 flex items-center space-x-2">
          <ion-icon name="checkmark-circle" class="text-2xl"></ion-icon>
          <span>Hasil Perhitungan Parkland Formula</span>
        </h4>

        <!-- Total 24h -->
        <div class="bg-white rounded-lg p-6 border-2 border-red-400 mb-4">
          <p class="text-sm text-gray-600 mb-2">Total Cairan 24 Jam (Ringer Laktat)</p>
          <p class="text-6xl font-bold text-red-700 mb-1">{{ result.total24h.toFixed(0) }}</p>
          <p class="text-sm text-gray-500">mL dalam 24 jam</p>
          <p class="text-xs text-gray-600 mt-2">Formula: 4 mL × {{ weight }} kg × {{ tbsa }}% = {{ result.total24h.toFixed(0) }} mL</p>
        </div>

        <!-- Time Schedule -->
        <div class="grid md:grid-cols-2 gap-4 mb-4">
          <div class="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-6 border-2 border-orange-400">
            <p class="text-sm font-bold text-orange-900 mb-2">
              <ion-icon name="time" class="align-middle"></ion-icon> 8 JAM PERTAMA (50%)
            </p>
            <p class="text-4xl font-bold text-orange-700 mb-1">{{ result.first8h.toFixed(0) }}</p>
            <p class="text-sm text-gray-600">mL dalam 8 jam</p>
            <p class="text-2xl font-bold text-orange-600 mt-3">{{ result.rateFirst8h.toFixed(0) }} mL/jam</p>
            <p class="text-xs text-gray-600 mt-1">{{ result.timeFirst8h }}</p>
          </div>

          <div class="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-6 border-2 border-blue-400">
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
              <ion-icon name="analytics" class="align-middle"></ion-icon> Perhitungan Langkah-demi-Langkah:
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
              <ion-icon name="pulse" class="align-middle"></ion-icon> Target Monitoring (KRITIS):
            </p>
            <div class="space-y-1 text-sm text-yellow-800">
              <p>• <strong>Urine Output Target:</strong></p>
              <p class="ml-4">- Dewasa: <strong>0.5 mL/kg/jam</strong> = {{ (weight! * 0.5).toFixed(0) }} mL/jam</p>
              <p class="ml-4">- Anak: <strong>0.5-1 mL/kg/jam</strong> = {{ (weight! * 0.5).toFixed(0) }}-{{ (weight! * 1).toFixed(0) }} mL/jam</p>
              <p>• <strong>Vital Signs:</strong> MAP >65 mmHg, HR <120/menit</p>
              <p>• <strong>Capillary Refill:</strong> <2 detik</p>
              <p>• <strong>Mental Status:</strong> Sadar, oriented</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Clinical Protocol -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-4">
        <h5 class="font-bold text-amber-900 mb-3 flex items-center space-x-2">
          <ion-icon name="medical" class="text-xl"></ion-icon>
          <span>Protokol Klinis Parkland</span>
        </h5>
        <div class="text-sm text-amber-800 space-y-2">
          <p><strong>Cairan yang Digunakan:</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• <strong>24 jam pertama:</strong> Ringer Laktat (RL) - pilihan utama</li>
            <li>• <strong>Pasca 24 jam:</strong> D5-½NS + Albumin 5% (jika albumin <2 g/dL)</li>
          </ul>

          <p><strong>Penyesuaian Kecepatan (Titration):</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• Jika urine <strong><0.5 mL/kg/jam</strong> → Tingkatkan kecepatan 20-25%</li>
            <li>• Jika urine <strong>>1 mL/kg/jam</strong> → Turunkan kecepatan 20-25%</li>
            <li>• Re-evaluasi setiap 1-2 jam pada fase awal</li>
          </ul>

          <p><strong>Komplikasi yang Harus Diwaspadai:</strong></p>
          <ul class="ml-4 space-y-1 text-xs">
            <li>• Over-resuscitation: Edema paru, compartment syndrome, ARDS</li>
            <li>• Under-resuscitation: Shock, gagal ginjal akut, kematian</li>
            <li>• Abdominal compartment syndrome (bila cairan >250 mL/kg/24jam)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Information -->
    <div class="bg-red-50 border-2 border-red-300 rounded-xl p-4">
      <h5 class="font-bold text-red-900 mb-2 flex items-center space-x-2">
        <ion-icon name="information-circle" class="text-xl"></ion-icon>
        <span>Tentang Parkland Formula (Baxter Formula)</span>
      </h5>
      <div class="text-sm text-red-800 space-y-2">
        <p><strong>Sejarah:</strong> Dikembangkan oleh Dr. Charles Baxter di Parkland Memorial Hospital, Dallas, Texas pada tahun 1968. Menjadi standar emas resusitasi luka bakar di seluruh dunia.</p>

        <p><strong>Formula Lengkap:</strong></p>
        <div class="bg-white p-3 rounded-lg border border-red-200 font-mono text-xs space-y-1">
          <p>Total Cairan 24 jam = 4 mL × BB (kg) × % TBSA luka bakar</p>
          <p class="mt-2">Pemberian:</p>
          <p>• 50% diberikan dalam 8 jam pertama sejak cedera</p>
          <p>• 50% diberikan dalam 16 jam berikutnya</p>
        </div>

        <p><strong>Indikasi:</strong></p>
        <ul class="text-xs space-y-1 ml-4">
          <li>• Luka bakar ≥15-20% TBSA pada dewasa</li>
          <li>• Luka bakar ≥10% TBSA pada anak</li>
          <li>• Luka bakar dengan inhalasi injury</li>
          <li>• Electrical burns dengan kerusakan jaringan dalam</li>
        </ul>

        <p><strong>Validitas:</strong> Terbukti menurunkan mortalitas luka bakar dari >50% menjadi <10% pada luka bakar 40-60% TBSA.</p>

        <p class="text-xs text-red-600 mt-2">
          <strong>Referensi:</strong> Baxter CR (1968), American Burn Association, WHO Guidelines, Parkland Memorial Hospital Protocol
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

  // Parkland Formula: 4 mL × kg × %TBSA
  const total24h = 4 * weight.value * tbsa.value
  const first8h = total24h / 2
  const next16h = total24h / 2

  // Calculate rates
  const hoursRemaining8h = Math.max(0, 8 - hoursSinceInjury)
  const hoursRemaining16h = 16

  const rateFirst8h = hoursRemaining8h > 0 ? first8h / hoursRemaining8h : 0
  const rateNext16h = next16h / hoursRemaining16h

  // Time calculation from injury
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
    ? `Sisa ${hoursRemaining8h.toFixed(1)} jam (sampai ${formatTime(end8h)})`
    : `Jam ke-0 sampai jam ke-8 (sampai ${formatTime(end8h)})`
  
  const timeNext16h = `Jam ke-8 sampai jam ke-24 (${formatTime(end8h)} - ${formatTime(end24h)})`

  const steps = [
    `Berat badan: ${weight.value} kg`,
    `Luas luka bakar: ${tbsa.value}% TBSA`,
    `Formula Parkland: 4 mL × BB × %TBSA`,
    `Total 24 jam = 4 × ${weight.value} × ${tbsa.value} = ${total24h.toFixed(0)} mL`,
    `50% pertama (8 jam): ${first8h.toFixed(0)} mL`,
    `50% kedua (16 jam): ${next16h.toFixed(0)} mL`,
    hoursSinceInjury > 0 
      ? `Pasien datang ${hoursSinceInjury} jam setelah cedera, sisa waktu 8 jam pertama: ${hoursRemaining8h.toFixed(1)} jam`
      : 'Mulai segera dari waktu cedera',
    `Kecepatan 8 jam pertama: ${first8h.toFixed(0)} ÷ ${hoursRemaining8h > 0 ? hoursRemaining8h.toFixed(1) : 8} = ${rateFirst8h.toFixed(0)} mL/jam`,
    `Kecepatan 16 jam berikutnya: ${next16h.toFixed(0)} ÷ 16 = ${rateNext16h.toFixed(0)} mL/jam`
  ]

  result.value = {
    total24h,
    first8h,
    next16h,
    rateFirst8h,
    rateNext16h,
    timeFirst8h,
    timeNext16h,
    steps
  }

  // Save to history
  await saveCalculation({
    calculator_type: 'fluid',
    method: 'Parkland Formula (Baxter)',
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
      rate_next_16h_ml_per_hour: rateNext16h.toFixed(0)
    }
  })
}
</script>
