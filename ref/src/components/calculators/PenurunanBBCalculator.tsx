import React, { useState } from 'react';

export default function PenurunanBBCalculator() {
  const [gender, setGender] = useState<'l' | 'p'>('l');
  const [bb, setBb] = useState<number | ''>('');
  const [tb, setTb] = useState<number | ''>('');
  const [usia, setUsia] = useState<number | ''>('');
  const [aktivitas, setAktivitas] = useState<number>(1.2);
  const [targetTurun, setTargetTurun] = useState<number>(500);

  const hitung = () => {
    if (bb === '' || tb === '' || usia === '') return null;
    const w = Number(bb);
    const h = Number(tb);
    const u = Number(usia);

    // BMR Mifflin
    let bmr = 0;
    if (gender === 'l') {
      bmr = (10 * w) + (6.25 * h) - (5 * u) + 5;
    } else {
      bmr = (10 * w) + (6.25 * h) - (5 * u) - 161;
    }

    const tdee = bmr * aktivitas;
    const targetKalori = tdee - targetTurun;
    
    // Protein 1 - 1.2 g/kgBB (Diet Tinggi Protein untuk Penurunan BB)
    const proteinMin = w * 1.0;
    const proteinMax = w * 1.2;

    return { bmr, tdee, targetKalori, proteinMin, proteinMax };
  };

  const hasil = hitung();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Target Penurunan Berat Badan</h2>
          <p className="text-gray-500 mt-1">Hitung defisit kalori untuk penurunan berat badan yang sehat (0.5 - 1 kg/minggu).</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value as 'l' | 'p')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value="l">Laki-laki</option>
                <option value="p">Perempuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
              <input 
                type="number" 
                value={usia} 
                onChange={(e) => setUsia(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
              <input 
                type="number" 
                value={bb} 
                onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input 
                type="number" 
                value={tb} 
                onChange={(e) => setTb(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Aktivitas</label>
              <select 
                value={aktivitas} 
                onChange={(e) => setAktivitas(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value={1.2}>Sangat Jarang Olahraga (1.2)</option>
                <option value={1.375}>Jarang Olahraga (1.375)</option>
                <option value={1.55}>Cukup Olahraga (1.55)</option>
                <option value={1.725}>Sering Olahraga (1.725)</option>
                <option value={1.9}>Sangat Sering Olahraga (1.9)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Penurunan</label>
              <select 
                value={targetTurun} 
                onChange={(e) => setTargetTurun(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
              >
                <option value={500}>0.5 kg / minggu (-500 kkal)</option>
                <option value={750}>0.75 kg / minggu (-750 kkal)</option>
                <option value={1000}>1 kg / minggu (-1000 kkal)</option>
              </select>
            </div>
          </div>

          {hasil !== null && (
            <div className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100 space-y-4">
              <div className="grid grid-cols-2 gap-4 border-b border-emerald-200 pb-4">
                <div>
                  <p className="text-sm text-emerald-800 mb-1">BMR (Mifflin):</p>
                  <div className="text-xl font-bold text-emerald-700">{hasil.bmr.toFixed(0)} kkal</div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">TDEE (Pemeliharaan):</p>
                  <div className="text-xl font-bold text-emerald-700">{hasil.tdee.toFixed(0)} kkal</div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-emerald-800 mb-1">Target Kalori Harian (Defisit):</p>
                <div className="text-3xl font-bold text-emerald-600">{hasil.targetKalori.toFixed(0)} <span className="text-lg font-medium">kkal/hari</span></div>
                <p className="text-xs text-emerald-700 mt-1">
                  *Batas aman asupan kalori minimal 1200 kkal (wanita) atau 1500 kkal (pria).
                </p>
              </div>

              <div className="pt-2">
                <p className="text-sm text-emerald-800 mb-1">Rekomendasi Protein (Diet Tinggi Protein):</p>
                <div className="text-xl font-bold text-emerald-700">{hasil.proteinMin.toFixed(0)} - {hasil.proteinMax.toFixed(0)} g/hari</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
