<template>
  <AdminLayout>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Kalkulator Medis</h2>
      <p class="text-gray-600">Pilih jenis kalkulator yang ingin digunakan</p>
    </div>

    <!-- Calculator Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Kebutuhan Gizi -->
      <router-link
        to="/calculator/nutrition"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-indigo-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="nutrition" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
            Kebutuhan Gizi
          </h3>
          <p class="text-sm text-gray-600">
            Hitung kebutuhan kalori dan nutrisi untuk pasien sehat maupun sakit
          </p>
        </div>
      </router-link>

      <!-- Nutritional Status -->
      <router-link
        to="/calculator/nutritional-status"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-purple-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="body" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
            Status Gizi
          </h3>
          <p class="text-sm text-gray-600">
            Hitung BMI/IMT dan LILA untuk penilaian status gizi
          </p>
        </div>
      </router-link>

      <!-- IBW Calculator -->
      <router-link
        to="/calculator/ibw"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-amber-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="scale" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
            Berat Badan Ideal
          </h3>
          <p class="text-sm text-gray-600">
            Hitung IBW dengan rumus Devine, Broca (Kemenkes), dan lainnya
          </p>
        </div>
      </router-link>

      <!-- Child Nutrition Calculator -->
      <router-link
        to="/calculator/child-nutrition"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-pink-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="happy" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-pink-600 transition-colors">
            Nutrisi Anak
          </h3>
          <p class="text-sm text-gray-600">
            Hitung kebutuhan nutrisi anak sehat & sakit (Permenkes 2019)
          </p>
        </div>
      </router-link>

      <!-- Fluid Calculator -->
      <router-link
        to="/calculator/fluid"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-cyan-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="water" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-cyan-600 transition-colors">
            Fluid Calculator
          </h3>
          <p class="text-sm text-gray-600">
            Hitung kebutuhan cairan maintenance & resusitasi luka bakar
          </p>
        </div>
      </router-link>

      <!-- Malnutrition Calculator -->
      <router-link
        to="/calculator/malnutrition"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-rose-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="fitness" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-rose-600 transition-colors">
            Malnutrition Calculator
          </h3>
          <p class="text-sm text-gray-600">
            Skrining malnutrisi anak, dewasa, luka bakar & sindrom metabolik
          </p>
        </div>
      </router-link>

      <!-- Diabetes Diet Calculator -->
      <router-link
        to="/calculator/diabetes-diet"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-red-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="pulse" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
            Diabetes Diet Calculator
          </h3>
          <p class="text-sm text-gray-600">
            Perhitungan diet DM Tipe 2 - PERKENI 2024 & Kemenkes RI
          </p>
        </div>
      </router-link>

      <!-- Hypertension Diet Calculator -->
      <router-link
        to="/calculator/hypertension-diet"
        class="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 cursor-pointer border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2 group"
      >
        <div class="flex flex-col items-center text-center">
          <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
            <ion-icon name="heart" class="text-5xl text-white"></ion-icon>
          </div>
          <h3 class="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            Hypertension Diet Calculator
          </h3>
          <p class="text-sm text-gray-600">
            DASH Diet - Kemenkes 2022, WHO, Evidence-Based
          </p>
        </div>
      </router-link>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/AdminLayout.vue'
</script>
