import React, { useState } from 'react';

export default function PreskripsiDietCalculator() {
  const [bb, setBb] = useState<number | ''>('');
  const [kondisi, setKondisi] = useState<string>('lansia');

  const getPreskripsi = () => {
    if (bb === '') return null;
    const w = Number(bb);

    switch (kondisi) {
      case 'lansia':
        return {
          energi: `${(25 * w).toFixed(0)} - ${(30 * w).toFixed(0)}`,
          protein: `${(1.0 * w).toFixed(1)} - ${(1.2 * w).toFixed(1)}`,
          lemak: '20-35% total energi',
          karbo: '45-65% total energi',
          catatan: 'Batasi gula, garam, lemak jenuh. Cukup kalsium & serat.'
        };
      case 'sirosis':
        return {
          energi: `${(25 * w).toFixed(0)} - ${(35 * w).toFixed(0)}`,
          protein: `${(1.0 * w).toFixed(1)} - ${(1.2 * w).toFixed(1)}`,
          lemak: '20-30% total energi',
          karbo: '45-65% total energi',
          catatan: 'Jika malnutrisi/stres: Energi 35-40 kkal/kg, Protein 1.5 g/kg. Batasi natrium jika edema.'
        };
      case 'ppok':
        return {
          energi: `${(20 * w).toFixed(0)} - ${(35 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)} - ${(1.7 * w).toFixed(1)}`,
          lemak: '30-45% total energi',
          karbo: '40-55% total energi',
          catatan: 'Rendah karbohidrat, tinggi lemak untuk menjaga RQ (Respiratory Quotient).'
        };
      case 'asamurat':
        return {
          energi: 'Sesuai kebutuhan (kurangi 10-15% jika obesitas)',
          protein: `${(1.0 * w).toFixed(1)} - ${(1.2 * w).toFixed(1)}`,
          lemak: '10-20% total energi',
          karbo: '65-75% total energi',
          catatan: 'Rendah purin (<150 mg/hari). Tinggi cairan (2-2.5 L/hari).'
        };
      case 'tbc':
        return {
          energi: `${(35 * w).toFixed(0)} - ${(40 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)} - ${(1.5 * w).toFixed(1)}`,
          lemak: 'Cukup',
          karbo: 'Cukup',
          catatan: 'Tinggi kalori tinggi protein (TKTP) untuk mencegah wasting.'
        };
      case 'kanker':
        return {
          energi: `${(25 * w).toFixed(0)} - ${(35 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)} - ${(1.5 * w).toFixed(1)}`,
          lemak: 'Cukup (utamakan lemak tidak jenuh)',
          karbo: 'Cukup',
          catatan: 'Jika hipermetabolik/stres: Energi 35 kkal/kg. Diet nabati dianjurkan.'
        };
      case 'ginjal_predialisis':
        return {
          energi: `${(30 * w).toFixed(0)} - ${(35 * w).toFixed(0)}`,
          protein: `${(0.6 * w).toFixed(1)} - ${(1.0 * w).toFixed(1)}`,
          lemak: 'Cukup',
          karbo: 'Cukup',
          catatan: 'Protein nilai biologis tinggi. Batasi natrium, kalium, fosfor sesuai lab.'
        };
      case 'ginjal_hd':
        return {
          energi: `${(35 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)}`,
          lemak: 'Cukup',
          karbo: 'Cukup',
          catatan: 'Cairan: 750-1000 ml + keluaran urin. Batasi natrium, kalium, fosfor.'
        };
      case 'stroke':
        return {
          energi: `${(25 * w).toFixed(0)} - ${(45 * w).toFixed(0)}`,
          protein: `${(0.8 * w).toFixed(1)} - ${(1.5 * w).toFixed(1)}`,
          lemak: '20-25% total energi',
          karbo: '60-70% total energi',
          catatan: 'Rendah natrium (<5000 mg/hari), rendah lemak trans, tinggi omega 3.'
        };
      case 'hiv':
        return {
          energi: `${(30 * w).toFixed(0)} - ${(45 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)} - ${(1.5 * w).toFixed(1)}`,
          lemak: '25-30% total energi',
          karbo: 'Cukup',
          catatan: 'Porsi kecil tapi sering. Hindari makanan mentah/setengah matang.'
        };
      case 'kritis':
        return {
          energi: `${(25 * w).toFixed(0)} - ${(30 * w).toFixed(0)}`,
          protein: `${(1.2 * w).toFixed(1)} - ${(2.0 * w).toFixed(1)}`,
          lemak: '25-30% total energi',
          karbo: 'Cukup',
          catatan: 'Kalorimetri tidak langsung lebih baik. Fase awal bisa hipokalori (14 kkal/kg).'
        };
      case 'refeeding':
        return {
          energi: `${(5 * w).toFixed(0)} - ${(10 * w).toFixed(0)}`,
          protein: '15-20% total energi',
          lemak: '30-40% total energi',
          karbo: '50-60% total energi',
          catatan: 'Mulai perlahan (5-10 kkal/kg/hari). Pantau ketat fosfat, kalium, magnesium.'
        };
      default:
        return null;
    }
  };

  const hasil = getPreskripsi();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Preskripsi Diet Penyakit</h2>
          <p className="text-gray-500 mt-1">Hitung cepat kebutuhan makronutrien berdasarkan kondisi klinis spesifik.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input 
                type="number" 
                value={bb} 
                onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Contoh: 60"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi Klinis</label>
              <select 
                value={kondisi} 
                onChange={(e) => setKondisi(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="lansia">Lansia</option>
                <option value="sirosis">Sirosis Hepatis</option>
                <option value="ppok">PPOK (Paru)</option>
                <option value="asamurat">Asam Urat</option>
                <option value="tbc">Tuberkulosis (TBC)</option>
                <option value="kanker">Kanker</option>
                <option value="ginjal_predialisis">Gagal Ginjal (Pre-dialisis)</option>
                <option value="ginjal_hd">Gagal Ginjal (Hemodialisis)</option>
                <option value="stroke">Stroke</option>
                <option value="hiv">HIV / AIDS</option>
                <option value="kritis">Penyakit Kritis (ICU)</option>
                <option value="refeeding">Risiko Refeeding Syndrome</option>
              </select>
            </div>
          </div>

          {hasil !== null && (
            <div className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Energi Harian:</p>
                  <div className="text-xl font-bold text-emerald-700">{hasil.energi} <span className="text-sm font-medium">kkal</span></div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Protein Harian:</p>
                  <div className="text-xl font-bold text-emerald-700">{hasil.protein} <span className="text-sm font-medium">g</span></div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Lemak:</p>
                  <div className="text-md font-semibold text-emerald-700">{hasil.lemak}</div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Karbohidrat:</p>
                  <div className="text-md font-semibold text-emerald-700">{hasil.karbo}</div>
                </div>
              </div>
              <div className="pt-3 border-t border-emerald-200">
                <p className="text-sm text-emerald-800 mb-1">Catatan Diet:</p>
                <p className="text-sm text-emerald-900">{hasil.catatan}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
