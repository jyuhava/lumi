import React, { useState } from 'react';

export default function FungsiGinjal() {
  const [usia, setUsia] = useState<number | ''>('');
  const [bb, setBb] = useState<number | ''>('');
  const [kreatinin, setKreatinin] = useState<number | ''>('');
  const [gender, setGender] = useState<'l' | 'p'>('l');

  const hitungGFR = () => {
    if (usia === '' || bb === '' || kreatinin === '') return null;
    const u = Number(usia);
    const w = Number(bb);
    const cr = Number(kreatinin);

    let gfr = ((140 - u) * w) / (72 * cr);
    if (gender === 'p') {
      gfr = gfr * 0.85;
    }
    return gfr;
  };

  const getStatus = (gfr: number) => {
    if (gfr >= 90) return 'Kerusakan ginjal, fungsi normal/meningkat (Stadium 1)';
    if (gfr >= 60) return 'Penurunan fungsi ginjal ringan (Stadium 2)';
    if (gfr >= 30) return 'Penurunan fungsi ginjal sedang (Stadium 3)';
    if (gfr >= 15) return 'Penurunan fungsi ginjal parah (Stadium 4)';
    return 'Gagal ginjal (Stadium 5)';
  };

  const gfr = hitungGFR();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Fungsi Ginjal (eGFR)</h2>
          <p className="text-gray-500 mt-1">Estimasi Laju Filtrasi Glomerulus dengan Formula Cockcroft-Gault.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="l" checked={gender === 'l'} onChange={() => setGender('l')} className="text-emerald-500 focus:ring-emerald-500" />
                <span className="text-gray-700">Laki-laki</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="gender" value="p" checked={gender === 'p'} onChange={() => setGender('p')} className="text-emerald-500 focus:ring-emerald-500" />
                <span className="text-gray-700">Perempuan</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
              <input 
                type="number" 
                value={usia} 
                onChange={(e) => setUsia(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
              <input 
                type="number" 
                value={bb} 
                onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serum Kreatinin (mg/dL)</label>
              <input 
                type="number" 
                step="0.1"
                value={kreatinin} 
                onChange={(e) => setKreatinin(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {gfr !== null && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 mb-1">Estimasi GFR (ml/mnt):</p>
              <div className="text-3xl font-bold text-emerald-600">{gfr.toFixed(2)}</div>
              <p className="text-sm font-medium text-emerald-700 mt-2">Kategori: {getStatus(gfr)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
