<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-200">
      <h4 class="font-bold text-violet-900 flex items-center space-x-2">
        <ion-icon name="list" class="text-xl"></ion-icon>
        <span>Standar Diet DM I-VIII (PERKENI & Kemenkes RI)</span>
      </h4>
      <p class="text-sm text-violet-700 mt-1">Panduan cepat pemilihan diet sesuai karakteristik pasien</p>
    </div>

    <!-- Standard Diet Table -->
    <div class="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-violet-100 to-purple-100">
          <tr>
            <th class="px-4 py-3 text-left font-bold text-gray-900">Diet</th>
            <th class="px-4 py-3 text-left font-bold text-gray-900">Kalori</th>
            <th class="px-4 py-3 text-left font-bold text-gray-900">Target Pasien</th>
            <th class="px-4 py-3 text-left font-bold text-gray-900">Karakteristik</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-violet-50 cursor-pointer" @click="selectDiet('DM I', 1100)">
            <td class="px-4 py-3 font-bold text-violet-700">DM I</td>
            <td class="px-4 py-3"><span class="bg-violet-100 px-3 py-1 rounded-full text-sm font-bold">1.100 kkal</span></td>
            <td class="px-4 py-3 text-sm">Wanita kecil, BB kurang</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB <150cm, BB <45kg</td>
          </tr>
          <tr class="border-b hover:bg-purple-50 cursor-pointer" @click="selectDiet('DM II', 1300)">
            <td class="px-4 py-3 font-bold text-purple-700">DM II</td>
            <td class="px-4 py-3"><span class="bg-purple-100 px-3 py-1 rounded-full text-sm font-bold">1.300 kkal</span></td>
            <td class="px-4 py-3 text-sm">Wanita kecil-sedang</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB 150-155cm, BB 45-50kg</td>
          </tr>
          <tr class="border-b hover:bg-indigo-50 cursor-pointer" @click="selectDiet('DM III', 1500)">
            <td class="px-4 py-3 font-bold text-indigo-700">DM III</td>
            <td class="px-4 py-3"><span class="bg-indigo-100 px-3 py-1 rounded-full text-sm font-bold">1.500 kkal</span></td>
            <td class="px-4 py-3 text-sm">Wanita sedang, pria kecil</td>
            <td class="px-4 py-3 text-xs text-gray-600">Wanita TB 155-160cm / Pria TB <160cm</td>
          </tr>
          <tr class="border-b hover:bg-blue-50 cursor-pointer" @click="selectDiet('DM IV', 1700)">
            <td class="px-4 py-3 font-bold text-blue-700">DM IV</td>
            <td class="px-4 py-3"><span class="bg-blue-100 px-3 py-1 rounded-full text-sm font-bold">1.700 kkal</span></td>
            <td class="px-4 py-3 text-sm">Pria sedang</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB 160-165cm, aktivitas ringan-sedang</td>
          </tr>
          <tr class="border-b hover:bg-cyan-50 cursor-pointer" @click="selectDiet('DM V', 1900)">
            <td class="px-4 py-3 font-bold text-cyan-700">DM V</td>
            <td class="px-4 py-3"><span class="bg-cyan-100 px-3 py-1 rounded-full text-sm font-bold">1.900 kkal</span></td>
            <td class="px-4 py-3 text-sm">Pria besar</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB 165-170cm, aktivitas sedang</td>
          </tr>
          <tr class="border-b hover:bg-teal-50 cursor-pointer" @click="selectDiet('DM VI', 2100)">
            <td class="px-4 py-3 font-bold text-teal-700">DM VI</td>
            <td class="px-4 py-3"><span class="bg-teal-100 px-3 py-1 rounded-full text-sm font-bold">2.100 kkal</span></td>
            <td class="px-4 py-3 text-sm">Pria besar, aktivitas berat</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB >170cm, kerja fisik</td>
          </tr>
          <tr class="border-b hover:bg-green-50 cursor-pointer" @click="selectDiet('DM VII', 2300)">
            <td class="px-4 py-3 font-bold text-green-700">DM VII</td>
            <td class="px-4 py-3"><span class="bg-green-100 px-3 py-1 rounded-full text-sm font-bold">2.300 kkal</span></td>
            <td class="px-4 py-3 text-sm">Pria sangat besar</td>
            <td class="px-4 py-3 text-xs text-gray-600">TB >175cm, aktivitas sangat berat</td>
          </tr>
          <tr class="hover:bg-emerald-50 cursor-pointer" @click="selectDiet('DM VIII', 2500)">
            <td class="px-4 py-3 font-bold text-emerald-700">DM VIII</td>
            <td class="px-4 py-3"><span class="bg-emerald-100 px-3 py-1 rounded-full text-sm font-bold">2.500 kkal</span></td>
            <td class="px-4 py-3 text-sm">Pria sangat besar, atlet</td>
            <td class="px-4 py-3 text-xs text-gray-600">BB >80kg, aktivitas ekstrem</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Selected Diet Detail -->
    <div v-if="selectedDietData" class="bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-300 rounded-xl p-6">
      <h4 class="text-lg font-bold mb-4 text-violet-900">Detail {{ selectedDietData.name }}</h4>

      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div class="bg-white rounded-lg p-4 border-2 border-violet-200">
          <p class="text-sm text-gray-600 mb-1">Total Kalori</p>
          <p class="text-4xl font-bold text-violet-700">{{ selectedDietData.calories }}</p>
          <p class="text-xs text-gray-500">kkal/hari</p>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-purple-200">
          <p class="text-sm text-gray-600 mb-1">Karbohidrat (55%)</p>
          <p class="text-4xl font-bold text-purple-700">{{ selectedDietData.carb.toFixed(0) }}</p>
          <p class="text-xs text-gray-500">gram/hari</p>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-indigo-200">
          <p class="text-sm text-gray-600 mb-1">Protein (15%)</p>
          <p class="text-4xl font-bold text-indigo-700">{{ selectedDietData.protein.toFixed(0) }}</p>
          <p class="text-xs text-gray-500">gram/hari</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4 border-2 border-blue-200">
          <p class="text-sm text-gray-600 mb-1">Lemak (30%)</p>
          <p class="text-3xl font-bold text-blue-700">{{ selectedDietData.fat.toFixed(0) }}</p>
          <p class="text-xs text-gray-500">gram/hari</p>
        </div>

        <div class="bg-white rounded-lg p-4 border-2 border-cyan-200">
          <p class="text-sm text-gray-600 mb-1">Serat</p>
          <p class="text-3xl font-bold text-cyan-700">{{ selectedDietData.fiber.toFixed(0) }}</p>
          <p class="text-xs text-gray-500">gram/hari</p>
        </div>
      </div>
    </div>

    <!-- Adjustment Guidelines -->
    <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h5 class="font-bold text-gray-900 mb-3">Panduan Penyesuaian Diet:</h5>
      <div class="space-y-3 text-sm">
        <div class="bg-blue-50 p-3 rounded-lg">
          <p class="font-bold text-blue-900 mb-1">📊 Obesitas (BMI >25):</p>
          <p>Kurangi 500 kkal/hari dari kebutuhan untuk penurunan 0.5-1 kg/minggu</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg">
          <p class="font-bold text-green-900 mb-1">🏃 Aktivitas Fisik Tinggi:</p>
          <p>Tambahkan 200-300 kkal untuk kompensasi energi yang digunakan</p>
        </div>
        <div class="bg-yellow-50 p-3 rounded-lg">
          <p class="font-bold text-yellow-900 mb-1">⚠️ Kontrol Glikemik Jelek (HbA1c >8%):</p>
          <p>Kurangi karbohidrat menjadi 45% dan tingkatkan protein menjadi 20%</p>
        </div>
        <div class="bg-red-50 p-3 rounded-lg">
          <p class="font-bold text-red-900 mb-1">🏥 Komplikasi Ginjal (CKD):</p>
          <p>Batasi protein menjadi 0.8 g/kg BB/hari (10%) - konsultasi dokter</p>
        </div>
      </div>
    </div>

    <!-- Special Conditions -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6">
      <h5 class="font-bold text-orange-900 mb-3">⚕️ Diet Khusus DM dengan Obesitas (Remisi):</h5>
      <div class="space-y-2 text-sm">
        <p><strong>Diet Kalori Sangat Rendah (VLCD):</strong> 700 kkal/hari selama 3 bulan</p>
        <ul class="ml-4 space-y-1">
          <li>• Menggunakan formula cair pengganti makanan 3×/hari</li>
          <li>• Target: Penurunan >15 kg yang dipertahankan</li>
          <li>• Kondisi: Tanpa insulin, HbA1c <12%, BMI 27-45</li>
          <li>• <strong class="text-red-700">HARUS di bawah supervisi medis!</strong></li>
        </ul>
        <p class="text-xs text-orange-700 mt-2">Referensi: Alomedika, VLCD untuk Remisi DM Tipe 2</p>
      </div>
    </div>

    <div class="bg-violet-50 border border-violet-200 rounded-xl p-4">
      <h5 class="font-bold text-violet-900 mb-2">Catatan Penting:</h5>
      <ul class="text-sm text-violet-800 space-y-1">
        <li>• Standar diet ini adalah panduan umum, perlu disesuaikan individual</li>
        <li>• Pertimbangkan kontrol glikemik, komplikasi, dan target terapi</li>
        <li>• Monitoring berkala HbA1c, gula darah, dan berat badan</li>
        <li>• Referensi: PERKENI 2024, Kemenkes RI</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const selectedDietData = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const selectDiet = async (name: string, calories: number) => {
  // Calculate macronutrients (55% carb, 15% protein, 30% fat)
  const carb = (calories * 0.55) / 4 // 4 kkal/g
  const protein = (calories * 0.15) / 4 // 4 kkal/g
  const fat = (calories * 0.30) / 9 // 9 kkal/g
  const fiber = (calories / 1000) * 14 // 14g per 1000 kkal

  selectedDietData.value = {
    name,
    calories,
    carb,
    protein,
    fat,
    fiber
  }

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Standard DM Diet',
    inputs: {
      diet_type: name,
      total_calories: calories
    },
    results: {
      carb_grams: carb.toFixed(1),
      protein_grams: protein.toFixed(1),
      fat_grams: fat.toFixed(1),
      fiber_grams: fiber.toFixed(1)
    }
  })
}
</script>
