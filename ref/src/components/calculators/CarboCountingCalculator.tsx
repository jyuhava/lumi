import React, { useState } from 'react';

export default function CarboCountingCalculator() {
  const [karboTotal, setKarboTotal] = useState<number | ''>('');
  const [kalori, setKalori] = useState<number | ''>('');
  const [persenKarbo, setPersenKarbo] = useState<number>(50);

  const hitungDariKarbo = () => {
    if (karboTotal === '') return null;
    return Number(karboTotal) / 15;
  };

  const hitungDariKalori = () => {
    if (kalori === '') return null;
    const totalKarboGram = (Number(kalori) * (persenKarbo / 100)) / 4;
    const serving = totalKarboGram / 15;
    return { totalKarboGram, serving };
  };

  const servingKarbo = hitungDariKarbo();
  const hasilKalori = hitungDariKalori();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Carbo Counting</h2>
          <p className="text-gray-500 mt-1">Hitung jumlah porsi (serving) karbohidrat. 1 porsi = 15 gram karbohidrat.</p>
        </div>
        
        <div className="p-6 space-y-8">
          {/* Kalkulator Langsung */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Hitung dari Gram Karbohidrat</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Karbohidrat (gram)</label>
                <input 
                  type="number" 
                  value={karboTotal} 
                  onChange={(e) => setKarboTotal(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: 45"
                />
              </div>
              <div className="flex-1 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800 mb-1">Jumlah Porsi (Serving):</p>
                <div className="text-2xl font-bold text-emerald-600">{servingKarbo !== null ? servingKarbo.toFixed(1) : '-'}</div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Kalkulator dari Kalori */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Hitung dari Total Kalori Harian</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Kalori (kkal)</label>
                <input 
                  type="number" 
                  value={kalori} 
                  onChange={(e) => setKalori(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Contoh: 1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Persentase Karbohidrat (%)</label>
                <input 
                  type="number" 
                  value={persenKarbo} 
                  onChange={(e) => setPersenKarbo(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {hasilKalori !== null && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Total Karbohidrat:</p>
                  <div className="text-xl font-bold text-emerald-700">{hasilKalori.totalKarboGram.toFixed(0)} gram</div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Total Porsi (Serving) / Hari:</p>
                  <div className="text-2xl font-bold text-emerald-600">{hasilKalori.serving.toFixed(1)}</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
