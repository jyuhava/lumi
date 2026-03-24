<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-red-100">
      <div class="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Akses Layanan Diblokir</h1>
      <p class="text-gray-600 mb-6 leading-relaxed">
        Mohon maaf, sistem instalasi gizi tidak dapat diakses saat ini karena masa aktif berlangganan Rumah Sakit/Klinik Anda telah habis atau sedang dalam penangguhan.
      </p>
      
      <div class="bg-gray-50 p-4 rounded-xl text-left border border-gray-100 mb-8">
        <h3 class="text-sm font-semibold text-gray-700 mb-1">Butuh Bantuan?</h3>
        <p class="text-sm text-gray-500">Silakan hubungi tim IT/Manajemen RS Anda untuk segera melakukan perpanjangan lisensi aplikasi LUMINIE.</p>
      </div>
    </div>
    
    <p class="mt-8 text-sm text-gray-400 font-medium">LUMINIE by Syntaf © {{ new Date().getFullYear() }}</p>
  </div>
</template>