<template>
  <div class="space-y-6">
    <!-- Clinical Effectiveness -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
      <h4 class="font-bold text-green-900 mb-4 flex items-center">
        <ion-icon name="trending-down" class="text-xl mr-2"></ion-icon>
        Efektivitas Klinis DASH Diet
      </h4>
      <p class="text-sm text-gray-700 mb-4">
        Hasil dari berbagai studi klinis (PREMIER Trial, DASH Sodium Study, Meta-analysis 2021-2023)
      </p>

      <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <tr>
                <th class="px-4 py-3 text-left font-bold">Intervensi</th>
                <th class="px-4 py-3 text-left font-bold">TD Sistolik ↓</th>
                <th class="px-4 py-3 text-left font-bold">TD Diastolik ↓</th>
                <th class="px-4 py-3 text-left font-bold">Catatan</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr class="hover:bg-yellow-50">
                <td class="px-4 py-3 font-medium">DASH Standard (2300mg Na)</td>
                <td class="px-4 py-3 text-yellow-700 font-bold">6-11 mmHg</td>
                <td class="px-4 py-3 text-yellow-700 font-bold">3-6 mmHg</td>
                <td class="px-4 py-3 text-xs">Moderat - untuk prehipertensi</td>
              </tr>
              <tr class="hover:bg-orange-50">
                <td class="px-4 py-3 font-medium">DASH Reduced Na (1500mg)</td>
                <td class="px-4 py-3 text-orange-700 font-bold">8-14 mmHg</td>
                <td class="px-4 py-3 text-orange-700 font-bold">4-7 mmHg</td>
                <td class="px-4 py-3 text-xs">Lebih efektif ✓ - untuk hipertensi</td>
              </tr>
              <tr class="hover:bg-green-50">
                <td class="px-4 py-3 font-medium">DASH + Weight Loss 5-10%</td>
                <td class="px-4 py-3 text-green-700 font-bold">11-22 mmHg</td>
                <td class="px-4 py-3 text-green-700 font-bold">5-10 mmHg</td>
                <td class="px-4 py-3 text-xs">Optimal ✓✓ - kombinasi terbaik</td>
              </tr>
              <tr class="hover:bg-blue-50">
                <td class="px-4 py-3 font-medium">DASH + Exercise 150 min/week</td>
                <td class="px-4 py-3 text-blue-700 font-bold">10-15 mmHg</td>
                <td class="px-4 py-3 text-blue-700 font-bold">6-9 mmHg</td>
                <td class="px-4 py-3 text-xs">Sangat baik ✓✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Timeline Results -->
    <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300">
      <h4 class="font-bold text-blue-900 mb-4 flex items-center">
        <ion-icon name="time" class="text-xl mr-2"></ion-icon>
        Timeline Hasil DASH Diet
      </h4>

      <div class="space-y-3">
        <div class="bg-white rounded-lg p-4 border-l-4 border-yellow-500">
          <p class="font-bold text-gray-900 mb-1">Minggu 1-2: Adaptasi Rasa</p>
          <ul class="text-sm text-gray-700 ml-4 list-disc">
            <li>Lidah beradaptasi dengan makanan rendah sodium</li>
            <li>Mulai terasa perbedaan rasa makanan asli (tanpa garam berlebih)</li>
            <li>Berat badan mungkin turun 0.5-1 kg (hilangnya retensi air)</li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4 border-l-4 border-orange-500">
          <p class="font-bold text-gray-900 mb-1">Minggu 4: Hasil Awal</p>
          <ul class="text-sm text-gray-700 ml-4 list-disc">
            <li>Penurunan TD sistolik 2-4 mmHg (measurable)</li>
            <li>Penurunan TD diastolik 1-2 mmHg</li>
            <li>Energi meningkat, lebih bertenaga</li>
            <li>Tidur lebih berkualitas</li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4 border-l-4 border-green-500">
          <p class="font-bold text-gray-900 mb-1">Minggu 8: Hasil Signifikan</p>
          <ul class="text-sm text-gray-700 ml-4 list-disc">
            <li>Penurunan TD sistolik 6-11 mmHg (DASH standard)</li>
            <li>Penurunan TD diastolik 3-6 mmHg</li>
            <li>Penurunan berat badan 2-4 kg (jika kombinasi dengan defisit kalori)</li>
            <li>LDL cholesterol turun 5-10%</li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <p class="font-bold text-gray-900 mb-1">Bulan 3+: Hasil Optimal</p>
          <ul class="text-sm text-gray-700 ml-4 list-disc">
            <li>Penurunan TD maksimal tercapai (8-14 mmHg untuk reduced sodium)</li>
            <li>Gaya hidup sehat menjadi kebiasaan</li>
            <li>Risiko komplikasi kardiovaskular menurun signifikan</li>
            <li>Kemungkinan pengurangan dosis obat antihipertensi (konsultasi dokter)</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Additional Benefits -->
    <div class="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-300">
      <h4 class="font-bold text-purple-900 mb-4 flex items-center">
        <ion-icon name="heart" class="text-xl mr-2"></ion-icon>
        Manfaat Tambahan DASH Diet (Beyond BP)
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white rounded-lg p-4">
          <h5 class="font-bold text-gray-900 mb-2 flex items-center">
            <ion-icon name="analytics" class="text-lg text-purple-600 mr-2"></ion-icon>
            Kardiovaskular
          </h5>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>↓ Risiko stroke: <strong>19%</strong></li>
            <li>↓ Risiko penyakit jantung: <strong>20%</strong></li>
            <li>↓ Total kolesterol: <strong>5-10%</strong></li>
            <li>↓ LDL (bad cholesterol): <strong>7-12%</strong></li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4">
          <h5 class="font-bold text-gray-900 mb-2 flex items-center">
            <ion-icon name="fitness" class="text-lg text-green-600 mr-2"></ion-icon>
            Metabolik
          </h5>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>↓ Risiko DM tipe 2: <strong>18-20%</strong></li>
            <li>Kontrol glukosa lebih baik</li>
            <li>↓ Resistensi insulin</li>
            <li>↓ Trigliserida: <strong>1.04 mmol/L</strong></li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4">
          <h5 class="font-bold text-gray-900 mb-2 flex items-center">
            <ion-icon name="scale" class="text-lg text-yellow-600 mr-2"></ion-icon>
            Berat Badan
          </h5>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>↓ Lingkar pinggang: <strong>1.57 cm</strong></li>
            <li>↓ BMI: <strong>0.42 kg/m²</strong></li>
            <li>Penurunan BB stabil (jika defisit kalori)</li>
            <li>Peningkatan komposisi tubuh</li>
          </ul>
        </div>

        <div class="bg-white rounded-lg p-4">
          <h5 class="font-bold text-gray-900 mb-2 flex items-center">
            <ion-icon name="shield-checkmark" class="text-lg text-blue-600 mr-2"></ion-icon>
            Lainnya
          </h5>
          <ul class="text-sm text-gray-700 space-y-1 ml-4 list-disc">
            <li>↓ Inflamasi sistemik (CRP)</li>
            <li>↓ Risiko gagal jantung</li>
            <li>Peningkatan kualitas hidup</li>
            <li>Fungsi ginjal lebih baik</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Monitoring Parameters -->
    <div class="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3">
        <h4 class="font-bold text-white flex items-center">
          <ion-icon name="clipboard" class="text-lg mr-2"></ion-icon>
          Parameter Monitoring & Evaluasi
        </h4>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Parameter</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Target</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Frekuensi</th>
              <th class="px-4 py-3 text-left font-bold text-gray-700">Metode</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Tekanan Darah</td>
              <td class="px-4 py-3"><strong><130/80 mmHg</strong> (optimal)</td>
              <td class="px-4 py-3">Setiap hari / 2 minggu</td>
              <td class="px-4 py-3 text-xs">Home BP monitor, klinik</td>
            </tr>
            <tr class="hover:bg-yellow-50">
              <td class="px-4 py-3 font-medium">Berat Badan</td>
              <td class="px-4 py-3">Stabil atau ↓ 0.5-1 kg/minggu</td>
              <td class="px-4 py-3">Mingguan</td>
              <td class="px-4 py-3 text-xs">Timbangan digital (pagi hari)</td>
            </tr>
            <tr class="hover:bg-green-50">
              <td class="px-4 py-3 font-medium">Lingkar Pinggang</td>
              <td class="px-4 py-3"><90 cm (M) / <80 cm (W)</td>
              <td class="px-4 py-3">Bulanan</td>
              <td class="px-4 py-3 text-xs">Meteran (setinggi pusar)</td>
            </tr>
            <tr class="hover:bg-purple-50">
              <td class="px-4 py-3 font-medium">Sodium Intake</td>
              <td class="px-4 py-3"><1500 mg (optimal) / <2300 mg</td>
              <td class="px-4 py-3">Food recall 24 jam</td>
              <td class="px-4 py-3 text-xs">Diary makanan, app tracking</td>
            </tr>
            <tr class="hover:bg-red-50">
              <td class="px-4 py-3 font-medium">Lipid Profile</td>
              <td class="px-4 py-3">Total <200, LDL <100 mg/dL</td>
              <td class="px-4 py-3">Setiap 3-6 bulan</td>
              <td class="px-4 py-3 text-xs">Lab test (puasa 12 jam)</td>
            </tr>
            <tr class="hover:bg-orange-50">
              <td class="px-4 py-3 font-medium">Glukosa Puasa</td>
              <td class="px-4 py-3"><110 mg/dL (normal)</td>
              <td class="px-4 py-3">Sesuai kebutuhan</td>
              <td class="px-4 py-3 text-xs">Lab test / glucometer</td>
            </tr>
            <tr class="hover:bg-blue-50">
              <td class="px-4 py-3 font-medium">Fungsi Ginjal</td>
              <td class="px-4 py-3">Kreatinin normal, eGFR >60</td>
              <td class="px-4 py-3">Tahunan (jika hipertensi)</td>
              <td class="px-4 py-3 text-xs">Lab test (kreatinin, eGFR)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Success Factors -->
    <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border-2 border-yellow-300">
      <h4 class="font-bold text-yellow-900 mb-4 flex items-center">
        <ion-icon name="trophy" class="text-xl mr-2"></ion-icon>
        Faktor Keberhasilan DASH Diet
      </h4>

      <div class="grid md:grid-cols-2 gap-4">
        <div class="space-y-2 text-sm">
          <p class="font-bold text-gray-900">✓ DO (Lakukan):</p>
          <ul class="space-y-1 ml-4 list-disc text-gray-700">
            <li><strong>Mulai gradual:</strong> Tidak harus sempurna dari awal</li>
            <li><strong>Meal planning:</strong> Rencanakan menu seminggu</li>
            <li><strong>Label reading:</strong> Kebiasaan membaca nutrisi kemasan</li>
            <li><strong>Support keluarga:</strong> Ajak keluarga diet bersama</li>
            <li><strong>Edukasi berkelanjutan:</strong> Konseling gizi rutin</li>
            <li><strong>Monitoring rutin:</strong> Evaluasi progress 2-4 minggu</li>
            <li><strong>Meal prep:</strong> Siapkan makanan sehat di rumah</li>
          </ul>
        </div>

        <div class="space-y-2 text-sm">
          <p class="font-bold text-gray-900">✗ DON'T (Hindari):</p>
          <ul class="space-y-1 ml-4 list-disc text-gray-700">
            <li><strong>Ekspektasi instan:</strong> Hasil butuh waktu 4-8 minggu</li>
            <li><strong>All or nothing:</strong> Perfeksionisme yang berlebihan</li>
            <li><strong>Skip meals:</strong> Makan teratur 3x + 2 snack</li>
            <li><strong>Fad diets:</strong> Diet ekstrem yang tidak sustainable</li>
            <li><strong>Isolasi:</strong> Diet sendirian tanpa dukungan</li>
            <li><strong>Kurang monitoring:</strong> Tidak cek progress</li>
            <li><strong>Stop medication sendiri:</strong> Harus konsultasi dokter</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Predictors of Better Results -->
    <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
      <h4 class="font-bold text-green-900 mb-3 flex items-center">
        <ion-icon name="stats-chart" class="text-xl mr-2"></ion-icon>
        Prediktor Hasil yang Lebih Baik
      </h4>
      <div class="space-y-2 text-sm">
        <p>✓ <strong>Baseline BP lebih tinggi</strong> (>160/100) → penurunan lebih signifikan</p>
        <p>✓ <strong>Kepatuhan konsisten</strong> (>80% adherence) → hasil optimal</p>
        <p>✓ <strong>Kombinasi dengan penurunan BB</strong> (5-10%) → efek sinergis</p>
        <p>✓ <strong>Aktivitas fisik rutin</strong> (150 min/minggu) → penurunan TD lebih besar</p>
        <p>✓ <strong>Berhenti merokok & batasi alkohol</strong> → kardiovaskular lebih baik</p>
        <p>✓ <strong>Stress management</strong> (meditasi, yoga) → BP lebih stabil</p>
        <p>✓ <strong>Tidur cukup</strong> (7-8 jam) → regulasi BP lebih baik</p>
      </div>
    </div>

    <!-- Reference -->
    <div class="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
      <strong>Referensi:</strong> PREMIER Trial, DASH Sodium Study, Meta-analysis 2021 (PMC8452928), Systematic Review 2023 (PMC10383418), AHA Guidelines, Kemenkes RI 2022
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useCalculationHistory } from '@/composables/useCalculationHistory'

const { saveCalculation } = useCalculationHistory()

onMounted(async () => {
  // Auto-save when component loads
  await saveCalculation({
    calculator_type: 'hypertension_diet',
    method: 'DASH Effectiveness & Monitoring',
    inputs: {},
    results: {
      info: 'Viewed effectiveness data and monitoring guidelines',
      effectiveness: 'DASH Standard: -6-11 mmHg, DASH Reduced: -8-14 mmHg, DASH+Weight Loss: -11-22 mmHg'
    }
  })
})
</script>
