import React, { useState } from 'react';

export default function TinggiLututCalculator() {
  const [tl, setTl] = useState<number | ''>('');
  const [usia, setUsia] = useState<number | ''>('');
  const [gender, setGender] = useState<'l' | 'p'>('l');

  const hitungChumlea = () => {
    if (tl === '' || usia === '') return null;
    const lutut = Number(tl);
    const u = Number(usia);

    if (gender === 'l') {
      return 64.19 - (0.04 * u) + (2.02 * lutut);
    } else {
      return 84.88 - (0.24 * u) + (1.83 * lutut);
    }
  };

  const hasil = hitungChumlea();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Estimasi TB dari Tinggi Lutut</h2>
          <p className="text-gray-500 mt-1">Menggunakan rumus Chumlea untuk pasien lansia atau bedrest yang tidak bisa berdiri.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Lutut (cm)</label>
              <input 
                type="number" 
                step="0.1"
                value={tl} 
                onChange={(e) => setTl(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="Contoh: 50"
              />
            </div>
          </div>

          {hasil !== null && (
            <div className="mt-6 p-5 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 mb-1">Estimasi Tinggi Badan (Chumlea):</p>
              <div className="text-3xl font-bold text-emerald-600">{hasil.toFixed(1)} <span className="text-lg font-medium">cm</span></div>
              <p className="text-xs text-emerald-700 mt-2">
                Diukur dari telapak kaki hingga permukaan anterior paha (tepat di atas patela) dengan lutut ditekuk 90 derajat.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
