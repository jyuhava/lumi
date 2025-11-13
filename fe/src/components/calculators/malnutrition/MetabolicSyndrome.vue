<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-purple-50 to-fuchsia-50 rounded-xl p-4 border border-purple-200">
      <h4 class="font-bold text-purple-900 flex items-center space-x-2">
        <ion-icon name="heart-circle" class="text-xl"></ion-icon>
        <span>Sindrom Metabolik (NCEP-ATP III)</span>
      </h4>
      <p class="text-sm text-purple-700 mt-1">Deteksi dini sindrom metabolik - Kriteria NCEP-ATP III (≥3 dari 5 kriteria)</p>
    </div>

    <!-- Criteria Form -->
    <div class="space-y-4">
      <!-- 1. Waist Circumference -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h5 class="font-bold text-gray-900 mb-3">1. Lingkar Pinggang (Obesitas Sentral)</h5>
        <div class="grid md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Jenis Kelamin</label>
            <select v-model="gender" class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl">
              <option value="M">Laki-laki</option>
              <option value="F">Perempuan</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-bold text-gray-700 mb-2">Lingkar Pinggang (cm)</label>
            <input
              v-model.number="waist"
              type="number"
              step="0.1"
              :placeholder="gender === 'M' ? 'Laki: Abnormal ≥90 cm' : 'Perempuan: Abnormal ≥80 cm'"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
        </div>
        <div v-if="criteria.waist !== null" :class="['mt-3 p-3 rounded-lg', criteria.waist ? 'bg-red-100' : 'bg-green-100']">
          <p class="text-sm font-bold">{{ criteria.waist ? '✓ POSITIF' : '✗ Negatif' }} - {{ waistStatus }}</p>
        </div>
      </div>

      <!-- 2. Triglycerides -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h5 class="font-bold text-gray-900 mb-3">2. Trigliserida</h5>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Trigliserida (mg/dL)</label>
          <input
            v-model.number="triglycerides"
            type="number"
            step="1"
            placeholder="Abnormal: ≥150 mg/dL"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
          />
        </div>
        <div v-if="criteria.triglycerides !== null" :class="['mt-3 p-3 rounded-lg', criteria.triglycerides ? 'bg-red-100' : 'bg-green-100']">
          <p class="text-sm font-bold">{{ criteria.triglycerides ? '✓ POSITIF' : '✗ Negatif' }} - {{ triglyceridesStatus }}</p>
        </div>
      </div>

      <!-- 3. HDL Cholesterol -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h5 class="font-bold text-gray-900 mb-3">3. HDL Kolesterol</h5>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">HDL Kolesterol (mg/dL)</label>
          <input
            v-model.number="hdl"
            type="number"
            step="1"
            :placeholder="gender === 'M' ? 'Laki: Abnormal <40' : 'Perempuan: Abnormal <50'"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
          />
        </div>
        <div v-if="criteria.hdl !== null" :class="['mt-3 p-3 rounded-lg', criteria.hdl ? 'bg-red-100' : 'bg-green-100']">
          <p class="text-sm font-bold">{{ criteria.hdl ? '✓ POSITIF' : '✗ Negatif' }} - {{ hdlStatus }}</p>
        </div>
      </div>

      <!-- 4. Blood Pressure -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h5 class="font-bold text-gray-900 mb-3">4. Tekanan Darah</h5>
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Sistolik (mmHg)</label>
            <input
              v-model.number="systolic"
              type="number"
              placeholder="Abnormal: ≥130"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">Diastolik (mmHg)</label>
            <input
              v-model.number="diastolic"
              type="number"
              placeholder="Abnormal: ≥85"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
            />
          </div>
        </div>
        <div v-if="criteria.bloodPressure !== null" :class="['mt-3 p-3 rounded-lg', criteria.bloodPressure ? 'bg-red-100' : 'bg-green-100']">
          <p class="text-sm font-bold">{{ criteria.bloodPressure ? '✓ POSITIF' : '✗ Negatif' }} - {{ bpStatus }}</p>
        </div>
      </div>

      <!-- 5. Fasting Glucose -->
      <div class="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h5 class="font-bold text-gray-900 mb-3">5. Glukosa Darah Puasa</h5>
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Glukosa Puasa (mg/dL)</label>
          <input
            v-model.number="glucose"
            type="number"
            step="1"
            placeholder="Abnormal: ≥100 mg/dL"
            class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl"
          />
        </div>
        <div v-if="criteria.glucose !== null" :class="['mt-3 p-3 rounded-lg', criteria.glucose ? 'bg-red-100' : 'bg-green-100']">
          <p class="text-sm font-bold">{{ criteria.glucose ? '✓ POSITIF' : '✗ Negatif' }} - {{ glucoseStatus }}</p>
        </div>
      </div>
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Evaluasi Sindrom Metabolik
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div :class="['border-2 rounded-xl p-6', result.colorClass]">
        <h4 class="text-lg font-bold mb-4">Hasil Evaluasi Sindrom Metabolik</h4>

        <div class="bg-white rounded-lg p-6 border-2 mb-4">
          <p class="text-sm text-gray-600 mb-2">Kriteria Positif</p>
          <p class="text-6xl font-bold text-purple-700 mb-1">{{ result.positiveCount }} / 5</p>
          <p class="text-sm text-gray-500">kriteria NCEP-ATP III terpenuhi</p>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 mb-4">
          <p class="text-sm font-bold mb-2">Diagnosis:</p>
          <p class="text-3xl font-bold" :class="result.statusColor">{{ result.diagnosis }}</p>
        </div>

        <!-- Risk Assessment -->
        <div :class="['rounded-lg p-4 border-2', result.hasSyndrome ? 'bg-red-50 border-red-300' : 'bg-green-50 border-green-300']">
          <h5 class="font-bold mb-2">{{ result.hasSyndrome ? '⚠️ RISIKO KESEHATAN:' : '✓ Status Kesehatan:' }}</h5>
          <ul class="text-sm space-y-1">
            <li v-for="(risk, idx) in result.risks" :key="idx">{{ risk }}</li>
          </ul>
        </div>

        <!-- Recommendations -->
        <div class="bg-blue-50 rounded-lg p-4 border-2 border-blue-300 mt-4">
          <h5 class="font-bold text-blue-900 mb-2">Rekomendasi:</h5>
          <ul class="text-sm space-y-1">
            <li v-for="(rec, idx) in result.recommendations" :key="idx" class="flex items-start space-x-2">
              <ion-icon name="checkmark-circle" class="text-blue-600 mt-0.5 flex-shrink-0"></ion-icon>
              <span>{{ rec }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Criteria Reference -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Kriteria NCEP-ATP III (≥3 dari 5 = Sindrom Metabolik):</h5>
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left">Parameter</th>
              <th class="px-4 py-2 text-left">Kriteria Abnormal</th>
            </tr>
          </thead>
          <tbody>
            <tr class="border-b">
              <td class="px-4 py-2">Lingkar Pinggang</td>
              <td class="px-4 py-2 font-bold">Laki ≥90 cm, Perempuan ≥80 cm</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2">Trigliserida</td>
              <td class="px-4 py-2 font-bold">≥150 mg/dL</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2">HDL Kolesterol</td>
              <td class="px-4 py-2 font-bold">Laki <40 mg/dL, Perempuan <50 mg/dL</td>
            </tr>
            <tr class="border-b">
              <td class="px-4 py-2">Tekanan Darah</td>
              <td class="px-4 py-2 font-bold">≥130/85 mmHg</td>
            </tr>
            <tr>
              <td class="px-4 py-2">Glukosa Puasa</td>
              <td class="px-4 py-2 font-bold">≥100 mg/dL</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-purple-50 border border-purple-200 rounded-xl p-4">
      <h5 class="font-bold text-purple-900 mb-2">Tentang Sindrom Metabolik</h5>
      <p class="text-sm text-purple-800">
        Sindrom metabolik adalah kumpulan kondisi yang meningkatkan risiko penyakit jantung, stroke, dan diabetes tipe 2. 
        Deteksi dini dan modifikasi gaya hidup dapat mencegah komplikasi serius. 
        Kriteria menggunakan standar NCEP-ATP III yang diadaptasi untuk populasi Asia.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const gender = ref<string>('M')
const waist = ref<number | null>(null)
const triglycerides = ref<number | null>(null)
const hdl = ref<number | null>(null)
const systolic = ref<number | null>(null)
const diastolic = ref<number | null>(null)
const glucose = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const criteria = computed(() => {
  const waistCriteria = waist.value !== null ? 
    (gender.value === 'M' ? waist.value >= 90 : waist.value >= 80) : null
  
  const triglycerideCriteria = triglycerides.value !== null ? triglycerides.value >= 150 : null
  
  const hdlCriteria = hdl.value !== null ?
    (gender.value === 'M' ? hdl.value < 40 : hdl.value < 50) : null
  
  const bpCriteria = (systolic.value !== null && diastolic.value !== null) ?
    (systolic.value >= 130 || diastolic.value >= 85) : null
  
  const glucoseCriteria = glucose.value !== null ? glucose.value >= 100 : null

  return {
    waist: waistCriteria,
    triglycerides: triglycerideCriteria,
    hdl: hdlCriteria,
    bloodPressure: bpCriteria,
    glucose: glucoseCriteria
  }
})

const waistStatus = computed(() => {
  if (waist.value === null) return ''
  const cutoff = gender.value === 'M' ? 90 : 80
  return waist.value >= cutoff ? 
    `${waist.value} cm ≥ ${cutoff} cm (Obesitas sentral)` : 
    `${waist.value} cm < ${cutoff} cm (Normal)`
})

const triglyceridesStatus = computed(() => {
  if (triglycerides.value === null) return ''
  return triglycerides.value >= 150 ? 
    `${triglycerides.value} mg/dL ≥ 150 (Tinggi)` : 
    `${triglycerides.value} mg/dL < 150 (Normal)`
})

const hdlStatus = computed(() => {
  if (hdl.value === null) return ''
  const cutoff = gender.value === 'M' ? 40 : 50
  return hdl.value < cutoff ? 
    `${hdl.value} mg/dL < ${cutoff} (Rendah)` : 
    `${hdl.value} mg/dL ≥ ${cutoff} (Normal)`
})

const bpStatus = computed(() => {
  if (systolic.value === null || diastolic.value === null) return ''
  return (systolic.value >= 130 || diastolic.value >= 85) ? 
    `${systolic.value}/${diastolic.value} mmHg (Hipertensi)` : 
    `${systolic.value}/${diastolic.value} mmHg (Normal)`
})

const glucoseStatus = computed(() => {
  if (glucose.value === null) return ''
  return glucose.value >= 100 ? 
    `${glucose.value} mg/dL ≥ 100 (Tinggi/Prediabetes)` : 
    `${glucose.value} mg/dL < 100 (Normal)`
})

const canCalculate = computed(() => {
  return Object.values(criteria.value).every(c => c !== null)
})

const calculate = async () => {
  if (!canCalculate.value) return

  const positiveCount = Object.values(criteria.value).filter(c => c === true).length

  const hasSyndrome = positiveCount >= 3

  let diagnosis = ''
  let colorClass = ''
  let statusColor = ''
  let risks: string[] = []
  let recommendations: string[] = []

  if (hasSyndrome) {
    diagnosis = 'SINDROM METABOLIK'
    colorClass = 'bg-red-50 border-red-300'
    statusColor = 'text-red-700'
    risks = [
      '• Risiko penyakit jantung koroner 2-3x lipat',
      '• Risiko diabetes tipe 2 meningkat 5x lipat',
      '• Risiko stroke meningkat signifikan',
      '• Risiko penyakit hati berlemak non-alkoholik',
      '• Peningkatan risiko gagal ginjal kronik'
    ]
    recommendations = [
      'SEGERA konsultasi dokter untuk evaluasi komprehensif',
      'Modifikasi gaya hidup intensif: diet rendah kalori, rendah lemak jenuh, tinggi serat',
      'Aktivitas fisik minimal 150 menit/minggu (jalan cepat, jogging, berenang)',
      'Target penurunan berat badan 5-10% dalam 6 bulan',
      'Berhenti merokok dan batasi alkohol',
      'Monitoring berkala: tekanan darah, gula darah, profil lipid setiap 3-6 bulan',
      'Pertimbangkan terapi farmakologi sesuai indikasi (statin, antihipertensi, metformin)'
    ]
  } else if (positiveCount === 2) {
    diagnosis = 'Berisiko Sindrom Metabolik (2/5 kriteria)'
    colorClass = 'bg-orange-50 border-orange-300'
    statusColor = 'text-orange-700'
    risks = [
      '• Belum memenuhi kriteria sindrom metabolik, namun sudah ada 2 faktor risiko',
      '• Risiko berkembang menjadi sindrom metabolik dalam 5 tahun',
      '• Risiko penyakit kardiovaskular meningkat'
    ]
    recommendations = [
      'Konsultasi dokter untuk evaluasi dan pencegahan',
      'Modifikasi gaya hidup untuk mencegah progresivitas',
      'Diet seimbang dan olahraga teratur',
      'Monitoring faktor risiko setiap 6-12 bulan'
    ]
  } else if (positiveCount === 1) {
    diagnosis = 'Risiko Rendah (1/5 kriteria)'
    colorClass = 'bg-yellow-50 border-yellow-300'
    statusColor = 'text-yellow-700'
    risks = [
      '• 1 faktor risiko terdeteksi - perlu perhatian',
      '• Risiko sindrom metabolik masih rendah'
    ]
    recommendations = [
      'Fokus perbaikan faktor risiko yang positif',
      'Pertahankan gaya hidup sehat',
      'Screening rutin setiap tahun'
    ]
  } else {
    diagnosis = 'Tidak Ada Sindrom Metabolik'
    colorClass = 'bg-green-50 border-green-300'
    statusColor = 'text-green-700'
    risks = [
      '• Tidak ada kriteria sindrom metabolik terpenuhi',
      '• Risiko penyakit metabolik rendah',
      '• Status kesehatan metabolik baik'
    ]
    recommendations = [
      'Pertahankan pola hidup sehat',
      'Diet seimbang dan aktivitas fisik teratur',
      'Screening ulang setiap 1-2 tahun atau jika ada perubahan berat badan signifikan'
    ]
  }

  result.value = {
    positiveCount,
    hasSyndrome,
    diagnosis,
    colorClass,
    statusColor,
    risks,
    recommendations
  }

  await saveCalculation({
    calculator_type: 'malnutrition',
    method: 'Metabolic Syndrome (NCEP-ATP III)',
    inputs: {
      gender: gender.value,
      waist_cm: waist.value,
      triglycerides_mg_dl: triglycerides.value,
      hdl_mg_dl: hdl.value,
      systolic_mmhg: systolic.value,
      diastolic_mmhg: diastolic.value,
      glucose_mg_dl: glucose.value
    },
    results: {
      positive_criteria: positiveCount.toString(),
      has_metabolic_syndrome: hasSyndrome.toString(),
      diagnosis: diagnosis
    }
  })
}
</script>
