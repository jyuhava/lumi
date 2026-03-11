# 🚀 Master Plan Transformasi SaaS "Lumine" (Single Database - *Tenant ID*)

Pendekatan menggunakan `tenant_id` (Single Database, Multi-Tenant) adalah pilihan yang sangat efisien dan populer. Alih-alih membuat satu database per Rumah Sakit, **seluruh data klien akan disatukan dalam satu database**, namun diisolasi secara ketat di tingkat *query* menggunakan kolom `tenant_id`.

**Keuntungan Pendekatan Ini:**
- ⚡ **Lebih Ringan & Murah:** Tidak membebani server database (MySQL/PostgreSQL) karena tidak perlu membuat ratusan database baru seiring bertambahnya klien.
- 🛠 **Maintenance Mudah:** Saat ada perubahan struktur tabel (*migration*), cukup dijalankan satu kali untuk semua klien.
- 📊 **Agregasi Data Super Admin Lebih Mudah:** Pemilik SaaS dapat dengan mudah menarik kesimpulan statistik dari semua klien (misal: fitur gizi mana yang paling sering digunakan secara nasional) karena data berada di tabel yang sama.

---

## 1. Arsitektur Database & Backend (`/be` - Laravel)

### A. Tabel Fundamental Baru
Sistem membutuhkan tabel baru untuk mengelola hierarki ini:
1. **`tenants`**: Menyimpan data identitas Rumah Sakit/Klinik.
   - Kolom: `id`, `name`, `subdomain` (misal: `rs-melati`), `status` (active/suspended), `subscription_ends_at`.
2. **`saas_admins`** (Opsional/Bisa digabung dengan Roles): Menyimpan akun Anda sebagai master pemilik SaaS.

### B. Perombakan Master Data (Penambahan `tenant_id`)
Setiap tabel yang ada saat ini (**KECUALI** tabel `tenants` & `saas_admins`) wajib dititikberatkan dengan kolom `tenant_id`.
- `users` (Staff RS) -> tambah `tenant_id`
- `categories`, `products`, `suppliers` -> tambah `tenant_id`
- `stock_transactions`, `leave_requests`, dll -> tambah `tenant_id`

### C. Isolasi Data Otomatis (Global Scope)
Agar *developer* tidak lupa menambahkan `where('tenant_id', ...)` di setiap query, Laravel mendukung fitur **Global Scopes**.
Kita akan membuat Traits `BelongsToTenant`. Saat model (`Product`, `Category`, dll) dipanggil, backend akan otomatis memfilter:
`SELECT * FROM products WHERE tenant_id = XYZ`

---

## 2. Sistem Frontend Pemilik SaaS (`/saas-admin` - Vue 3)

Sebuah project Vue terpisah yang hanya bisa diakses oleh Anda (Super Admin).

### Fungsionalitas Utama:
- **Dashboard Metrik B2B:** Menampilkan Total Tenant, Total Pengguna Aktif (dari seluruh RS), dan Notifikasi masa aktif langganan.
- **Tenant Management (CRUD):** 
  - Form pendataan RS (Nama, Alamat RS).
  - Tentukan Subdomain/Slug untuk akses mereka (misal: `rs-sejahtera`).
  - Setel lisensi (Basic/Premium) dan durasi langganan.
- **Toggle Suspensi (Kill-switch):** Bisa mematikan akses sebuah RS hanya dengan 1 klik jika tidak memperpanjang lisensi atau melanggar ToS. Sistem `/fe` RS tersebut akan diforz-logout.

*(Project ini akan dibangun baru dari nol, tidak bentrok dengan instalasi gizi).*

---

## 3. Sistem Frontend Instalasi Gizi (`/fe` - Vue 3 Saat Ini)

Aplikasi `fe` sekarang hanya butuh modifikasi minor pada lapisan *network* (Axios) & integrasi Router, tanpa mengubah komponen UI secara drastis.

### A. Pengenalan Tenant via Subdomain / Slug URL
Ketika user gizi membuka App, Vue membaca URL tempat mereka berada.
- Jika URL adalah `rs-melati.lumine.com` (Subdomain) ATAU `app.lumine.com/rs-melati` (Path Slug).
- Vue mengekstrak kata `rs-melati`.

### B. Modifikasi Login & Axios
1. **Axios Interceptor:** Setiap *request* ke backend akan disisipkan Header HTTP `X-Tenant: rs-melati`.
2. Backend menerima Header ini, mendeteksi ID Tenant, dan menerapkan Global Scope pada setiap perintah ke database.
3. Login di `/fe` memastikan `username` dan `password` divalidasi TERHADAP `tenant_id` tersebut. (Sehingga Nakes bernama "Budi" di RS A tidak bisa sembarang masuk di RS B meskipun username sama).

### C. Whitelabeling Tenant (UI Fleksibel)
- **Kostumisasi API:** API `/settings` dapat dikembangkan mengembalikan Logo dan Warna Primer (opsional) spesifik untuk *tenant* yang login.
- Secara default, Vue akan menampilkan tulisan RS yang login di atas Sidebar.

---

## 🚀 Roadmap Rencana Eksekusi (Agile Step-by-step)

Untuk mewujudkannya tanpa merusak sistem saat ini, berikut rekomendasi eksekusinya:

### Phase 1: Database Migration & Scoping (Backend)
1. Buat migration tabel `tenants`.
2. Edit **SEMUA** file migration *eksisting* (produk, user, kalkulator) untuk menambahkan field: `$table->foreignId('tenant_id')->constrained(...)` atau ubah via file Alter baru jika database sdh production.
3. Buat Trait `Tenantable` dengan Global Scopes Laravel.
4. Buat Middleware API penyadap header `X-Tenant` penyetel *Context DB*.

### Phase 2: Persiapan Frontend SaaS Admin (`saas-admin`)
1. Buat folder/project baru `npm create vue@latest saas-admin`.
2. Setup layout *dashboard* simpel dan routing ke manajemen RS berstatus "Admin Syntaf".
3. Hubungkan HTTP request dari SaaS Admin ke rute API khusus di `/be/routes/api-admin.php` mengabaikan filter Tenant (`withoutGlobalScopes()`).

### Phase 3: Sinkronisasi Aplikasi Utama (`/fe`)
1. Ubah `axios.ts` pada `/fe` untuk mendeteksi domain tempat aplikasi dijalankan dan *inject* header ke *Backend*.
2. Testing flow Login Nakes.
3. Handle global error HTTP 403 / 401 jika RS tersebut disuspend di Admin SaaS.

### Phase 4: Data Seeding & Deployment Prep
1. Ubah `DatabaseSeeder.php` untuk men-*generate* "Dummy Tenant 1" dan "Dummy Tenant 2".
2. Seed data produk ke "Dummy Tenant 1", pastikan "Dummy Tenant 2" login dengan data bersih/kosong.