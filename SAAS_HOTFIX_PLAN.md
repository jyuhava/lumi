# 🛠️ Rencana Perbaikan Kritis SaaS (Keamanan & Alur Bisnis)

Berikut adalah cetak biru (blueprint) perbaikan untuk mengatasi 2 cacat logika fatal pada sistem SaaS: ketiadaan keamanan (login) di Portal Super Admin dan tidak adanya pembuatan akun kredensial untuk klien baru.

## Masalah 1: Portal SaaS Admin Terbuka Tanpa Otentikasi
**Analisis Kelemahan:** Menggunakan panel manajemen master tanpa otentikasi memungkinkan pihak luar untuk membaca, memodifikasi, dan menghapus database klien. Proteksi wajib diterapkan.
**Solusi:** Memisahkan entitas "Super Admin" secara fisik dari "Nakes/Pegawai RS" dengan membuat tabel dan *Auth Guard* khusus di Laravel.

### Langkah Pengerjaan (Backend):
1. **Migration & Model `sys_admins`**: Membuat tabel khusus untuk pemilik SaaS (`id`, `name`, `email`, `password`) agar kredensial Super Admin tidak tercampur dengan tabel `users` (nakes) yang harus selalu terikat pada `tenant_id`.
2. **Setup config/auth.php**: Membuat *guard* autentikasi baru bernama `sys_admin` yang merujuk ke tabel `sys_admins`.
3. **Auth Controller Khusus**: Membuat `App\Http\Controllers\SaaS\AuthController` dengan *endpoint* login/logout yang mengembalikan token Sanctum.
4. **Proteksi Route**: Membungkus rute `/api/saas/*` dengan `middleware('auth:sanctum')` yang menggunakan guard khusus tersebut.

### Langkah Pengerjaan (Frontend `/saas-admin`):
1. **Sistem State & Axios Interceptor**: Mengkonfigurasi Axios untuk menyimpan token login di `localStorage` dan menyuntikkannya ke `Authorization: Bearer` pada setiap *request*.
2. **Halaman Login & Router**: Mendesain ulang Vue dengan mengaktifkan Vue Router sepenuhnya, menambahkan View Login (`/login`), komponen Layout, dan Setup *Navigation Guards* (Jika belum login, redirect paksa ke halaman login).

---

## Masalah 2: Pendaftaran Klien Baru Gagal Memberikan Akses (Blank User)
**Analisis Kelemahan:** Mendaftarkan data Rumah Sakit ke tabel `tenants` saja tidak berguna karena tidak ada "Pengguna (User)" yang diikat ke `tenant_id` tersebut. Pihak RS tidak akan memiliki akun / jalan masuk ke sistem Gizi mereka.
**Solusi:** Merombak API Create Tenant agar memproses pembuatan 2 data sekaligus dalam satu Transaksi Database (*Database Transaction*).

### Langkah Pengerjaan (Backend):
1. **Modifikasi Payload (Form Request)**: Rute `POST /api/saas/tenants` kini akan mewajibkan pemohon untuk mengirimkan data PIC Klien: `pic_name`, `pic_username`, `pic_email`, dan `pic_password`.
2. **Database Transaction**: Di dalam `TenantController@store`:
   - (A) Buat data RS di tabel `tenants`.
   - (B) Otomatis buat 1 baris di tabel `users` dengan `tenant_id` yang baru tercipta. Proses ini dibungkus dalam `DB::transaction()` sehingga jika gagal salah satu, semua dibatalkan (*roll-back*).

### Langkah Pengerjaan (Frontend `/saas-admin`):
1. **Ekspansi Modal Form**: Menambahkan kolom input berupa form kredensial Nakes Pertama (Nama Penanggung Jawab, Hak Akses Email/Username, dan Password Default) di dalam Modal "Registrasi Klien Baru".

---

## Urutan Eksekusi (*Execution Pipeline*)

Tahapan yang akan dikerjakan selanjutnya secara berurutan:
1. Membuat Tabel dan *Seeder* untuk `sys_admins`.
2. Konfigurasi Sistem Authentication Guard di Laravel.
3. Membuat endpoint Login khusus SaaS & Memodifikasi Rute API Backend (Penambahan Proteksi).
4. Update fungsi API `TenantController@store` beserta pembuatan user pertama dalam Transaksi Database.
5. Merombak UI project `/saas-admin` menjadi memiliki Router, Halaman Login, Interceptor Otentikasi, serta penambahan form kredensial awal di modal.
