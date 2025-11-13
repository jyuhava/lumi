<template>
  <div class="space-y-6">
    <!-- Title -->
    <div class="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-200">
      <h4 class="font-bold text-pink-900 flex items-center space-x-2">
        <ion-icon name="time" class="text-xl"></ion-icon>
        <span>Pola Makan 3J (Jumlah, Jadwal, Jenis)</span>
      </h4>
      <p class="text-sm text-pink-700 mt-1">Pembagian jadwal makan untuk kontrol gula darah optimal</p>
    </div>

    <!-- Input -->
    <div>
      <label class="block text-sm font-bold text-gray-700 mb-2">Total Kalori Per Hari (kkal)</label>
      <input
        v-model.number="totalCalories"
        type="number"
        placeholder="Contoh: 2000"
        class="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      />
    </div>

    <button
      @click="calculate"
      :disabled="!canCalculate"
      class="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl"
    >
      <ion-icon name="calculator" class="align-middle mr-2 text-xl"></ion-icon>
      Hitung Pembagian Jadwal Makan
    </button>

    <!-- Results -->
    <div v-if="result !== null" class="space-y-4">
      <div class="bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300 rounded-xl p-6">
        <h4 class="text-lg font-bold mb-4 text-pink-900">Pembagian Jadwal Makan (3J)</h4>

        <!-- Meal Schedule -->
        <div class="space-y-3">
          <div class="bg-white rounded-lg p-4 border-2 border-yellow-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-900">🌅 PAGI (06:00 - 08:00)</p>
                <p class="text-xs text-gray-500">20-25% dari total kalori</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-yellow-700">{{ result.breakfast.toFixed(0) }}</p>
                <p class="text-sm text-gray-600">kkal</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-green-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-900">🍎 SNACK PAGI (10:00)</p>
                <p class="text-xs text-gray-500">5-10% dari total kalori</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-green-700">{{ result.morningSnack.toFixed(0) }}</p>
                <p class="text-sm text-gray-600">kkal</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-orange-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-900">☀️ SIANG (12:00 - 13:00)</p>
                <p class="text-xs text-gray-500">30-35% dari total kalori</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-orange-700">{{ result.lunch.toFixed(0) }}</p>
                <p class="text-sm text-gray-600">kkal</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-purple-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-900">🥤 SNACK SORE (15:00 - 16:00)</p>
                <p class="text-xs text-gray-500">5-10% dari total kalori</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-purple-700">{{ result.afternoonSnack.toFixed(0) }}</p>
                <p class="text-sm text-gray-600">kkal</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg p-4 border-2 border-blue-200">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-bold text-gray-900">🌙 MALAM (18:00 - 19:00)</p>
                <p class="text-xs text-gray-500">25-30% dari total kalori</p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-bold text-blue-700">{{ result.dinner.toFixed(0) }}</p>
                <p class="text-sm text-gray-600">kkal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recommendations -->
      <div class="bg-white border-2 border-gray-200 rounded-xl p-6">
        <h5 class="font-bold text-gray-900 mb-3">Panduan Jenis Makanan per Waktu:</h5>
        <div class="space-y-3 text-sm">
          <div class="bg-yellow-50 p-3 rounded">
            <p class="font-bold text-yellow-900 mb-1">PAGI ({{ result.breakfast.toFixed(0) }} kkal):</p>
            <p>• Nasi/roti + telur/ikan + sayur + buah + susu rendah lemak</p>
          </div>
          <div class="bg-green-50 p-3 rounded">
            <p class="font-bold text-green-900 mb-1">SNACK PAGI ({{ result.morningSnack.toFixed(0) }} kkal):</p>
            <p>• Buah segar (apel, jeruk) atau susu rendah lemak</p>
          </div>
          <div class="bg-orange-50 p-3 rounded">
            <p class="font-bold text-orange-900 mb-1">SIANG ({{ result.lunch.toFixed(0) }} kkal):</p>
            <p>• Nasi + lauk hewani + tempe/tahu + sayur + buah</p>
          </div>
          <div class="bg-purple-50 p-3 rounded">
            <p class="font-bold text-purple-900 mb-1">SNACK SORE ({{ result.afternoonSnack.toFixed(0) }} kkal):</p>
            <p>• Buah atau kacang-kacangan (porsi kecil)</p>
          </div>
          <div class="bg-blue-50 p-3 rounded">
            <p class="font-bold text-blue-900 mb-1">MALAM ({{ result.dinner.toFixed(0) }} kkal):</p>
            <p>• Nasi (lebih sedikit dari siang) + lauk + sayur</p>
          </div>
        </div>
      </div>

      <!-- 3J Explanation -->
      <div class="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-6">
        <h5 class="font-bold text-indigo-900 mb-3">Prinsip 3J Diabetes Melitus:</h5>
        <div class="space-y-2 text-sm">
          <div class="flex items-start space-x-2">
            <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
            <div>
              <p class="font-bold">1. JUMLAH:</p>
              <p>Kalori harian sesuai kebutuhan (jangan kurang/lebih)</p>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
            <div>
              <p class="font-bold">2. JADWAL:</p>
              <p>Makan teratur 3× sehari + 1-2 snack, jarak 3-4 jam</p>
            </div>
          </div>
          <div class="flex items-start space-x-2">
            <ion-icon name="checkmark-circle" class="text-indigo-600 text-lg mt-0.5"></ion-icon>
            <div>
              <p class="font-bold">3. JENIS:</p>
              <p>Karbohidrat kompleks, protein cukup, lemak tak jenuh, serat tinggi</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-pink-50 border border-pink-200 rounded-xl p-4">
      <h5 class="font-bold text-pink-900 mb-2">Manfaat Pola 3J:</h5>
      <ul class="text-sm text-pink-800 space-y-1">
        <li>• Mencegah lonjakan gula darah mendadak</li>
        <li>• Menghindari hipoglikemia (gula darah terlalu rendah)</li>
        <li>• Mengoptimalkan kerja obat diabetes</li>
        <li>• Referensi: PERKENI 2024, Kemenkes RI</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const totalCalories = ref<number | null>(null)
const result = ref<any>(null)

const { saveCalculation } = useCalculationHistory()

const canCalculate = computed(() => {
  return totalCalories.value && totalCalories.value > 0
})

const calculate = async () => {
  if (!canCalculate.value || !totalCalories.value) return

  const breakfast = totalCalories.value * 0.225 // 20-25%, ambil 22.5%
  const morningSnack = totalCalories.value * 0.075 // 5-10%, ambil 7.5%
  const lunch = totalCalories.value * 0.325 // 30-35%, ambil 32.5%
  const afternoonSnack = totalCalories.value * 0.075 // 5-10%, ambil 7.5%
  const dinner = totalCalories.value * 0.275 // 25-30%, ambil 27.5%

  result.value = {
    breakfast,
    morningSnack,
    lunch,
    afternoonSnack,
    dinner
  }

  await saveCalculation({
    calculator_type: 'diabetes_diet',
    method: 'Meal Pattern 3J',
    inputs: {
      total_calories: totalCalories.value
    },
    results: {
      breakfast: breakfast.toFixed(0),
      morning_snack: morningSnack.toFixed(0),
      lunch: lunch.toFixed(0),
      afternoon_snack: afternoonSnack.toFixed(0),
      dinner: dinner.toFixed(0)
    }
  })
}
</script>
