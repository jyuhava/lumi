import React, { useState } from 'react';

export default function BBICalculator() {
  const [tab, setTab] = useState<'anak' | 'dewasa'>('anak');
  
  // Anak state
  const [usiaAnak, setUsiaAnak] = useState<number | ''>('');
  const [satuanUsia, setSatuanUsia] = useState<'bulan' | 'tahun'>('bulan');
  
  // Dewasa state
  const [tbDewasa, setTbDewasa] = useState<number | ''>('');
  const [gender, setGender] = useState<'l' | 'p'>('l');

  const hitungBBIAnak = () => {
    if (usiaAnak === '') return null;
    const usia = Number(usiaAnak);
    
    if (satuanUsia === 'bulan') {
      if (usia >= 0 && usia <= 11) {
        return (usia / 2) + 4;
      }
      return null; // Out of range for formula
    } else {
      if (usia >= 1 && usia <= 10) {
        return (2 * usia) + 8;
      } else if (usia > 10 && usia <= 12) {
        return ((7 * usia) - 5) / 2;
      }
      return null;
    }
  };

  const hitungBBIDewasa = () => {
    if (tbDewasa === '') return null;
    const tb = Number(tbDewasa);
    
    let bbi = tb - 100;
    
    if ((gender === 'l' && tb < 160) || (gender === 'p' && tb < 150)) {
      // Tidak perlu dikurangi 10%
      return bbi;
    } else {
      return bbi - (0.1 * bbi);
    }
  };

  const bbiAnak = hitungBBIAnak();
  const bbiDewasa = hitungBBIDewasa();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Berat Badan Ideal (BBI)</h2>
          <p className="text-gray-500 mt-1">Hitung BBI berdasarkan usia (anak) atau tinggi badan (dewasa).</p>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'anak' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('anak')}
          >
            Anak (0-12 Tahun)
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'dewasa' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('dewasa')}
          >
            Dewasa
          </button>
        </div>

        <div className="p-6">
          {tab === 'anak' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Usia</label>
                  <input 
                    type="number" 
                    value={usiaAnak} 
                    onChange={(e) => setUsiaAnak(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Masukkan usia..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                  <select 
                    value={satuanUsia} 
                    onChange={(e) => setSatuanUsia(e.target.value as 'bulan' | 'tahun')}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                  >
                    <option value="bulan">Bulan (0-11)</option>
                    <option value="tahun">Tahun (1-12)</option>
                  </select>
                </div>
              </div>
              
              {usiaAnak !== '' && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Hasil BBI Anak:</p>
                  {bbiAnak !== null ? (
                    <div className="text-3xl font-bold text-emerald-600">{bbiAnak.toFixed(1)} <span className="text-lg font-medium">kg</span></div>
                  ) : (
                    <div className="text-red-500 text-sm">Usia di luar rentang rumus konvensional (0-11 bulan atau 1-12 tahun).</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
                <input 
                  type="number" 
                  value={tbDewasa} 
                  onChange={(e) => setTbDewasa(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Contoh: 165"
                />
              </div>

              {tbDewasa !== '' && bbiDewasa !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Hasil BBI Dewasa (Broca):</p>
                  <div className="text-3xl font-bold text-emerald-600">{bbiDewasa.toFixed(1)} <span className="text-lg font-medium">kg</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
