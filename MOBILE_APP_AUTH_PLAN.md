# Rencana Pengembangan Otentikasi Aplikasi Mobile (Hospital Users)

## Ringkasan Eksekutif
Dokumen ini berisi arsitektur dan rencana langkah-langkah implementasi sistem otentikasi **Mobile App** (`customer_ver` - React Native / Expo) yang difokuskan untuk **pengguna internal Rumah Sakit** (seperti Ahli Gizi, Nakes, atau Manajemen RS). Aplikasi ini akan beroperasi dengan mulus bersama panel SaaS (Laravel Vue) yang sudah ada.

---

## Tahap 1: Arsitektur Backend & Routing (Laravel)
Kita akan memisahkan API Web (Vue) dengan API Mobile (Expo) menggunakan Namespace Controller khusus agar terisolasi dengan rapi, efisien dalam *response payload*, dan memudahkan versi mendatang.

1. **Pembuatan Namespace & Controller Baru**
   - **Direktori**: `be/app/Http/Controllers/CustomerVerApi/`
   - **File Controller Utama**: `AuthController.php`
   - **Dependensi Utama**: Menggunakan tabel `User`, *Laravel Sanctum* untuk token generator, dan *Hash* facade.

2. **Daftar *Routing* Khusus Mobile (`be/routes/api.php`)**
   Kita memakai *prefix* `/mobile` untuk menghindari bentrokan *session intercept* pada *web guard*:
   - `POST /api/mobile/login` → Menerima Email & Password.
   - `GET /api/mobile/me` → (Dilindungi oleh Auth Sanctum) Mendapat resume profil dan RS yang terafiliasi.
   - `POST /api/mobile/logout` → (Dilindungi oleh Auth Sanctum) Menghapus/mencabut sesi token dari perangkat.

---

## Tahap 2: Standardisasi Logika Otentikasi API
Aplikasi React Native harus memiliki aliran API berbasis murni (Stateless Token) tanpa mempedulikan Session Cookie.

1. **Endpoint Khusus Login (`login`)**
   - **Input Param**: `email`, `password`, dan (opsional) `device_name`.
   - **Validasi**: Mengecek apakah kredensial otentik valid di tabel `users`.
   - **Pembuatan Token**: Generator menggunakan token spesifik nama device: `$user->createToken('mobile-app')->plainTextToken;`.
   - **Pemberian Konteks Interaktif**: Karena User ini merujuk ke tabel `users` TenantSaaS, API perlu membundel profil Rumah Sakit (Tenant) terkait agar di HP bisa di-render nama Rumah Sakit-nya dengan benar.
   - _Payload Response_:
     ```json
     {
       "success": true,
       "message": "Login berhasil",
       "token": "2|XxXXxxXxxX...",
       "user": {
         "id": 1,
         "name": "Dr. Sarah Sp.GK",
         "email": "sarah@rs-medika.com",
         "tenant": {
           "id": 5,
           "name": "RS Medika Utama"
         }
       }
     }
     ```

2. **Endpoint Validasi Token (`me`)**
   Digunakan setiap aplikasi Expo dibuka dari status *Close/Sleep* untuk memastikan token belum kadaluwarsa.

3. **Endpoint Pencabutan/Logout (`logout`)**
   Harus menembak perintah `$request->user()->currentAccessToken()->delete()` secara eksplisit. Menjaga data pasien RS tidak bocor ketika *handphone* dipindah tangankan atau dirampas.

---

## Tahap 3: Implementasi UI/UX di Frontend (Expo React Native)
1. **Desain Layer `LoginScreen` Profesional**
   Mendesain visual masuk berkelas medis dengan Form Email, Keyboard bertipe *email-address*, dan Form Password tersamarkan (SecureTextEntry). Disertai lencana *branding* RS.
2. **Penyimpanan Token Secara Terenkripsi**
   Menyimpan token bukan dalam state sementara, tapi ke dalam **Expo Secure Store** / **AsyncStorage** secara permanen hingga Logout ditekan.
3. **Gateway Navigation Flow (React Navigation)**
   Pembuatan logika pengecekan kondisi otentikasi di akar navigasi (app router):
   * *Jika Token Kosong / Kadaluwarsa* $\rightarrow$ Menampilkan `AuthStack` (Halaman Login).
   * *Jika Token Valid* $\rightarrow$ Menampilkan `MainStack` (Halaman Menu Planner / Dashboard RS Khusus HP).
