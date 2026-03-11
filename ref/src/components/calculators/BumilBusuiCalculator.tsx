import React, { useState } from 'react';

export default function BumilBusuiCalculator() {
  const [kaloriDasar, setKaloriDasar] = useState<number | ''>('');
  const [proteinDasar, setProteinDasar] = useState<number | ''>('');
  const [fase, setFase] = useState<string>('t1');

  const getTambahan = () => {
    switch (fase) {
      case 't1': return { kalori: 180, protein: 1 };
      case 't2': return { kalori: 300, protein: 10 };
      case 't3': return { kalori: 300, protein: 30 };
      case 'm1': return { kalori: 330, protein: 20 };
      case 'm2': return { kalori: 400, protein: 15 };
      default: return { kalori: 0, protein: 0 };
    }
  };

  const tambahan = getTambahan();
  const totalKalori = kaloriDasar !== '' ? Number(kaloriDasar) + tambahan.kalori : null;
  const totalProtein = proteinDasar !== '' ? Number(proteinDasar) + tambahan.protein : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Kebutuhan Gizi Ibu Hamil & Menyusui</h2>
          <p className="text-gray-500 mt-1">Sesuai AKG 2019 (Peningkatan Zat Gizi).</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan Kalori Dasar (kkal)</label>
              <input 
                type="number" 
                value={kaloriDasar} 
                onChange={(e) => setKaloriDasar(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Contoh: 2000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kebutuhan Protein Dasar (g)</label>
              <input 
                type="number" 
                value={proteinDasar} 
                onChange={(e) => setProteinDasar(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                placeholder="Contoh: 60"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fase Kehamilan / Menyusui</label>
            <select 
              value={fase} 
              onChange={(e) => setFase(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <optgroup label="Hamil">
                <option value="t1">Trimester I</option>
                <option value="t2">Trimester II</option>
                <option value="t3">Trimester III</option>
              </optgroup>
              <optgroup label="Menyusui">
                <option value="m1">6 Bulan Pertama</option>
                <option value="m2">6 Bulan Kedua</option>
              </optgroup>
            </select>
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h3 className="font-semibold text-emerald-800 mb-4">Hasil Perhitungan:</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                <span className="text-emerald-700">Tambahan Kalori:</span>
                <span className="font-bold text-emerald-900">+{tambahan.kalori} kkal</span>
              </div>
              <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                <span className="text-emerald-700">Total Kalori:</span>
                <span className="font-bold text-emerald-900 text-xl">{totalKalori !== null ? totalKalori : '-'} kkal</span>
              </div>
              
              <div className="flex justify-between items-center border-b border-emerald-200 pb-2 pt-2">
                <span className="text-emerald-700">Tambahan Protein:</span>
                <span className="font-bold text-emerald-900">+{tambahan.protein} g</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="text-emerald-700">Total Protein:</span>
                <span className="font-bold text-emerald-900 text-xl">{totalProtein !== null ? totalProtein : '-'} g</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
