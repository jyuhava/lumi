# Master Plan: Implementasi Modul Analisis Nutrisi (Lumine - NutriSurvey Alternative)

Dokumen ini memuat rencana pengembangan sistem modul analisis nutrisi modern dengan kapabilitas menyerupai NutriSurvey, diadaptasi ke dalam arsitektur Multi-Tenant SaaS berbasis Vue 3 dan Laravel milik Lumine.

## 📊 Status Implementasi Saat Ini

**✅ Sudah Dikerjakan:**
- **Database & Migrations**: Tabel `foods`, `meals`, `meal_items`, `nutrition_plans`, dan `nutrition_plan_items` sudah ada di sistem (`database/migrations/`).
- **Eloquent Models**: Model untuk entitas di atas juga sudah tersedia di `app/Models/`.
- **Frontend (Parsial)**: Beberapa komponen kalkulator gizi klinis sudah berjalan, namun *Core Feature* untuk pencatatan makanan ala NutriSurvey belum tersedia secara fungsionalitas UI.

**❌ Belum Dikerjakan:**
- **Controller & API Endpoint**: Belum ada endpoint backend untuk manajemen Master Makanan, Asupan (Meal), Perencanaan, dan proxy ke external API.
- **Service Lintas Aplikasi**: `OpenFoodFactsService` belum didesain/dibuat.
- **Frontend Master Data**: Dashboard seperti `FoodDatabaseExplorer.vue`, Daily Intake Tracker, dan draggable Menu Planner belum ada.

---

## 🏗️ 1. Arsitektur Database Makanan
Sistem membedakan sumber data makanan menjadi: 
1. **Sistem Dasar** (Bawaan Lumine / Internal)
2. **User Defined** (Custom dari pengguna/Nakes/RS)
3. **External** (Open Food Facts / OFF API)

*Struktur Tabel Inti:*
- `foods`: Menyimpan master data makanan beserta nilai makronutrien dan mikronutrien (per 100g).
- `meals`: Pencatatan histori asupan berdasar sesi makan (Breakfast, Lunch, Dinner, Snack). **Relasi independen ke `patient_id`** agar pasien bisa merekam asupannya walau tanpa kunjungan, tapi disarankan memiliki (nullable) *linking* ke `nutritional_visit_id` agar terintegrasi dengan modul rekammedis/gizi.
- `meal_items`: Detail makanan dan kuantitas (gram) per sesi `meals`.
- `nutrition_plans` & `nutrition_plan_items`: Sistem perancangan menu diet dalam rentang tanggal.

---

## 🗓️ 2. Timeline & Langkah Eksekusi Berjenjang (Sprints)

### 🚀 Fase 1: Struktur & Database Makanan (Prioritas Utama)
*Fokus pada pembuatan engine untuk Master Data Makanan sebelum menghitung asupan menu.*
1. Membuat `App\Services\OpenFoodFactsService` untuk membangun proxy search makanan via Barcode / Nama.
2. Membuat controller `FoodController` beserta routing API untuk `/api/foods` (CRUD Lokal vs Proxy OFF).
3. Pembuatan `FoodSeeder` untuk menyuntik data makanan standard baku (AKG / WHO / Data Bawaan).
4. **Frontend**: Membuat `FoodDatabaseExplorer.vue` (Tabel GRID untuk mengelola, export/import data Makanan).

### 📝 Fase 2: Food Recall & Asupan (Daily Intake Tracker)
*Fokus pada pencatatan log harian pasien berdasarkan Database Makanan di Fase 1.*
1. Membuat controller `MealController` untuk input data form konsumsi 24h (Batch insert ke `meal_items`).
2. Logika Agregasi: Menghitung (Quantity * Nilai Nutrisi per 100g / 100) dari setiap elemen yang disimpan.
3. **Frontend**: UI Timeline / Kanban layout untuk grouping Sarapan, Makan Siang, Makan Malam, dll. Dilengkapi grafik Pie/Bar sisa kalori real-time berdasar hasil fetch dari API.

### 🧮 Fase 3: Kebutuhan Gizi & Komparasi Kepatuhan
*Fokus mempertemukan Total Intake (Fase 2) dengan Target Kebutuhan Pasien.*
1. Pembuatan endpoint `/api/nutrition-calculator/requirements` (BMR, TEE, Kebutuhan Macro/Micro berdasarkan Antropometri pasien: BB, TB, Umur, Gender, Faktor Aktivitas).
2. Mekanisme pencatatan histori rekaman perhitungan kebutuhan gizi.
3. **Frontend**: Integrasi kalkulator dengan Panel summary di Daily Intake Tracker (Menampilkan Indikator status gizi: *Deficiency, Adequate, Excess*). 

### 📅 Fase 4: Planner & Reporting PDF
*Fokus merancang prospek menu (Plan) mingguan & ekspor / generator label pelaporan.*
1. Endpoint CRUD lengkap `/api/nutrition-plans`.
2. **Frontend**: Menu Planner UI mingguan bergaya kalender interaktif dengan kemampuan API *Drag & Drop* item makanan langsung dari Master Tabel Makanan.
3. **Frontend**: Generator Nutrition Facts menggunakan library `jspdf` atau `html2canvas` berdasar standar label gizi universal.

---

## 📝 Rekomendasi Penting

1. **Arahan Relasi Modul Kunjungan (Nutritional Visits):** 
   Aktivitas `Meals` **harus terikat mandiri pada Profil Pasien (`patient_id`)**. Jika hanya terikat pada `id_visit`, sistem tidak valid untuk digunakan merekam *food recall / diary makanan* di luar hari konsultasi medis. Agar tetap sinkron dengan Modul Rekam Medis Gizi, tambahkan saja kolom `nutritional_visit_id` dengan status *nullable* di tabel `meals` sehingga rekam asupan bisa di-*attach* bilamana dicatat saat jadwal visit oleh Nakes.

2. **Titik Eksekusi Selanjutnya:**
   Implementasi **Wajib Dimulai dari Fase 1** secara penuh. Tanpa endpoint yang kokoh untuk API Makanan Lokal (Lumine) dan Eksternal (Open Food Facts), tidak ada kalkulasi *Macro/Micro* yang bisa diproses untuk Tracker dan Planner.
