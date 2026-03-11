import React, { useState } from 'react';

export default function ZScoreCalculator() {
  const [nilaiAnak, setNilaiAnak] = useState<number | ''>('');
  const [nilaiMedian, setNilaiMedian] = useState<number | ''>('');
  const [nilaiSD, setNilaiSD] = useState<number | ''>('');

  const hitungZScore = () => {
    if (nilaiAnak === '' || nilaiMedian === '' || nilaiSD === '') return null;
    const anak = Number(nilaiAnak);
    const median = Number(nilaiMedian);
    const sd = Number(nilaiSD);

    if (anak < median) {
      return (anak - median) / (median - sd);
    } else if (anak > median) {
      return (anak - median) / (sd - median);
    } else {
      return 0;
    }
  };

  const zscore = hitungZScore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Status Gizi Anak (Z-Score)</h2>
          <p className="text-gray-500 mt-1">Hitung Z-Score berdasarkan nilai median dan standar deviasi (SD) rujukan WHO.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Aktual Anak (BB/TB/IMT)</label>
            <input 
              type="number" 
              step="0.1"
              value={nilaiAnak} 
              onChange={(e) => setNilaiAnak(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: 9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Median (Rujukan WHO)</label>
            <input 
              type="number" 
              step="0.1"
              value={nilaiMedian} 
              onChange={(e) => setNilaiMedian(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: 9.9"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nilai SD Rujukan {nilaiAnak !== '' && nilaiMedian !== '' && Number(nilaiAnak) < Number(nilaiMedian) ? '(-1 SD)' : '(+1 SD)'}
            </label>
            <input 
              type="number" 
              step="0.1"
              value={nilaiSD} 
              onChange={(e) => setNilaiSD(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Masukkan nilai pada kolom -1SD atau +1SD tabel WHO"
            />
            <p className="text-xs text-gray-500 mt-1">
              Jika nilai anak &lt; median, masukkan nilai rujukan -1 SD. Jika nilai anak &gt; median, masukkan nilai rujukan +1 SD.
            </p>
          </div>

          {zscore !== null && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 mb-1">Hasil Z-Score:</p>
              <div className="text-3xl font-bold text-emerald-600">{zscore.toFixed(2)}</div>
              <p className="text-xs text-emerald-700 mt-2">
                Cocokkan hasil ini dengan tabel Kategori Z-Score (misal: -2 SD s/d +1 SD = Normal).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
