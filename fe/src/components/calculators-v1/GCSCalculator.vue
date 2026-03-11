<template>
  <div class="h-full bg-white">
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <h2 class="text-2xl font-bold text-gray-800">Tingkat Kesadaran (GCS)</h2>
        <p class="text-gray-500 mt-1">Glasgow Coma Scale untuk memperkirakan hasil cedera otak.</p>
      </div>
      
      <div class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mata / Eye (E)</label>
          <select 
            v-model="eye"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option :value="4">4 - Membuka mata secara spontan</option>
            <option :value="3">3 - Membuka dengan rangsang suara (dipanggil)</option>
            <option :value="2">2 - Rangsangan terhadap tekanan (dicubit, ditepuk)</option>
            <option :value="1">1 - Tidak membuka mata</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Verbal (V)</label>
          <select 
            v-model="verbal"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option :value="5">5 - Orientasi baik</option>
            <option :value="4">4 - Berbicara mengacau, bingung</option>
            <option :value="3">3 - Hanya berkata-kata saja</option>
            <option :value="2">2 - Bersuara tidak jelas (mengerang, menggumam)</option>
            <option :value="1">1 - Tidak bersuara</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Motorik (M)</label>
          <select 
            v-model="motor"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
          >
            <option :value="6">6 - Mematuhi perintah</option>
            <option :value="5">5 - Melokalisir nyeri (menjangkau lokasi stimulus)</option>
            <option :value="4">4 - Fleksi normal (menarik anggota tubuh yang dirangsang)</option>
            <option :value="3">3 - Fleksi abnormal, dekortikasi</option>
            <option :value="2">2 - Ekstensi abnormal, deserebasi</option>
            <option :value="1">1 - Tidak bergerak</option>
          </select>
        </div>

        <div class="mt-8 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
          <div class="flex items-end justify-between mb-4">
            <div>
              <p class="text-sm text-emerald-800 mb-1">Total Skor GCS:</p>
              <div class="text-4xl font-bold text-emerald-600">{{ total }}</div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-emerald-700">{{ getCategory(total) }}</p>
            </div>
          </div>
          <div class="pt-4 border-t border-emerald-200">
            <p class="text-sm text-emerald-800 mb-1">Estimasi Tingkat Kesadaran:</p>
            <p class="font-semibold text-emerald-900">{{ getKesadaran(total) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const eye = ref<number>(4)
const verbal = ref<number>(5)
const motor = ref<number>(6)

// Diperbaiki: Harus menggunakan computed agar reaktif terhadap perubahan dropdown
const total = computed(() => eye.value + verbal.value + motor.value);

const getCategory = (score: number) => {
  if (score >= 14) return 'Cedera Otak Ringan';
  if (score >= 9) return 'Cedera Otak Sedang';
  return 'Cedera Otak Berat';
};

const getKesadaran = (score: number) => {
  if (score >= 14) return 'Composmentis (Sadar Penuh)';
  if (score >= 12) return 'Apatis (Acuh tak acuh)';
  if (score >= 10) return 'Delirium (Gelisah / Disorientasi)';
  if (score >= 7) return 'Somnolen (Cenderung tertidur)';
  if (score >= 5) return 'Sopor (Kesadaran hilang, respons nyeri)';
  if (score === 4) return 'Semi-koma (Hanya refleks kornea/pupil)';
  return 'Koma (Tidak ada respons)';
};
</script>