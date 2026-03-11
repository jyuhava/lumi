import React, { useState } from 'react';

export default function GiziKlinisCalculator() {
  const [kondisi, setKondisi] = useState<string>('dm');

  // DM Perkeni
  const [bb, setBb] = useState<number | ''>('');
  const [tb, setTb] = useState<number | ''>('');
  const [gender, setGender] = useState<'l' | 'p'>('l');
  const [umur, setUmur] = useState<number | ''>('');
  const [aktivitas, setAktivitas] = useState<number>(20);
  const [stres, setStres] = useState<number>(0);

  // Luka Bakar
  const [lb, setLb] = useState<number | ''>('');

  // Ginjal Anak
  const [cr, setCr] = useState<number | ''>('');
  const [k, setK] = useState<number>(0.55);

  const hitungDM = () => {
    if (bb === '' || tb === '' || umur === '') return null;
    const w = Number(bb);
    const h = Number(tb) / 100;
    const u = Number(umur);
    
    // BMR
    let bmr = gender === 'l' ? 30 * w : 25 * w;
    
    // Faktor Umur
    let fUmur = 0;
    if (u >= 40 && u <= 59) fUmur = -0.05;
    else if (u >= 60 && u <= 69) fUmur = -0.10;
    else if (u >= 70) fUmur = -0.20;

    // Faktor BB (IMT)
    const imt = w / (h * h);
    let fBB = 0;
    if (imt < 18.5) fBB = 0.20; // Kurus +20%
    else if (imt >= 25) fBB = -0.20; // Gemuk -20%

    const total = bmr + (bmr * fUmur) + (bmr * (aktivitas / 100)) + (bmr * (stres / 100)) + (bmr * fBB);
    return total;
  };

  const hitungLukaBakar = () => {
    if (bb === '' || lb === '') return null;
    return (25 * Number(bb)) + (40 * Number(lb));
  };

  const hitungGinjalAnak = () => {
    if (tb === '' || cr === '') return null;
    return (k * Number(tb)) / Number(cr);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Kebutuhan Gizi Klinis</h2>
          <p className="text-gray-500 mt-1">Kalkulator spesifik untuk berbagai kondisi klinis.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kondisi Klinis</label>
            <select 
              value={kondisi} 
              onChange={(e) => setKondisi(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-emerald-50 text-emerald-800 font-medium"
            >
              <option value="dm">Diabetes Melitus Tipe 2 (Perkeni)</option>
              <option value="lukabakar">Luka Bakar (Curreri)</option>
              <option value="ginjalanak">Fungsi Ginjal Anak (Schwartz)</option>
            </select>
          </div>

          <div className="h-px bg-gray-100 my-4"></div>

          {kondisi === 'dm' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                  <select value={gender} onChange={(e) => setGender(e.target.value as 'l'|'p')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value="l">Laki-laki</option>
                    <option value="p">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
                  <input type="number" value={umur} onChange={(e) => setUmur(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
                  <input type="number" value={bb} onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
                  <input type="number" value={tb} onChange={(e) => setTb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aktivitas Fisik</label>
                  <select value={aktivitas} onChange={(e) => setAktivitas(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value={10}>Istirahat (+10%)</option>
                    <option value={20}>Ringan (+20%)</option>
                    <option value={30}>Sedang (+30%)</option>
                    <option value={40}>Berat (+40%)</option>
                    <option value={50}>Sangat Berat (+50%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stres Metabolik</label>
                  <select value={stres} onChange={(e) => setStres(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                    <option value={0}>Tidak Ada (0%)</option>
                    <option value={10}>Ringan (+10%)</option>
                    <option value={20}>Sedang (+20%)</option>
                    <option value={30}>Berat (+30%)</option>
                  </select>
                </div>
              </div>
              
              {hitungDM() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Total Kebutuhan Energi DM:</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungDM()?.toFixed(0)} <span className="text-lg font-medium">kkal/hari</span></div>
                </div>
              )}
            </div>
          )}

          {kondisi === 'lukabakar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
                  <input type="number" value={bb} onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Luas Luka Bakar (%)</label>
                  <input type="number" value={lb} onChange={(e) => setLb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungLukaBakar() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">BMR Luka Bakar (Curreri):</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungLukaBakar()?.toFixed(0)} <span className="text-lg font-medium">kkal/hari</span></div>
                </div>
              )}
            </div>
          )}

          {kondisi === 'ginjalanak' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Usia (Nilai k)</label>
                <select value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white">
                  <option value={0.33}>Bayi Prematur (k = 0.33)</option>
                  <option value={0.45}>Bayi Aterm 0-1 thn (k = 0.45)</option>
                  <option value={0.55}>Anak 1-13 thn / Perempuan &gt;13 thn (k = 0.55)</option>
                  <option value={0.70}>Laki-laki &gt;13 thn (k = 0.70)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
                  <input type="number" value={tb} onChange={(e) => setTb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serum Kreatinin (mg/dL)</label>
                  <input type="number" step="0.1" value={cr} onChange={(e) => setCr(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungGinjalAnak() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">eGFR Anak (Schwartz):</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungGinjalAnak()?.toFixed(2)} <span className="text-lg font-medium">ml/mnt</span></div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
