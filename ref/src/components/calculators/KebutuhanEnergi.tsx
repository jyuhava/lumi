import React, { useState } from 'react';

export default function KebutuhanEnergi() {
  const [tab, setTab] = useState<'harris' | 'mifflin'>('harris');

  const [gender, setGender] = useState<'l' | 'p'>('l');
  const [bb, setBb] = useState<number | ''>('');
  const [tb, setTb] = useState<number | ''>('');
  const [usia, setUsia] = useState<number | ''>('');
  const [fa, setFa] = useState<number>(1.2);
  const [fs, setFs] = useState<number>(1.0);

  const hitungBMR = () => {
    if (bb === '' || tb === '' || usia === '') return null;
    const w = Number(bb);
    const h = Number(tb);
    const a = Number(usia);

    if (tab === 'harris') {
      if (gender === 'l') {
        return 66 + (13.7 * w) + (5 * h) - (6.8 * a);
      } else {
        return 655 + (9.6 * w) + (1.8 * h) - (4.7 * a);
      }
    } else {
      if (gender === 'l') {
        return (10 * w) + (6.25 * h) - (5 * a) + 5;
      } else {
        return (10 * w) + (6.25 * h) - (5 * a) - 161;
      }
    }
  };

  const bmr = hitungBMR();
  const totalEnergi = bmr ? bmr * fa * fs : null;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Kebutuhan Energi Dewasa</h2>
          <p className="text-gray-500 mt-1">Hitung kebutuhan energi menggunakan rumus Harris-Benedict (Sehat) atau Mifflin (Sakit).</p>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'harris' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('harris')}
          >
            Harris-Benedict (Sehat)
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'mifflin' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('mifflin')}
          >
            Mifflin (Sakit)
          </button>
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

          <div className="grid grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Badan (cm)</label>
              <input 
                type="number" 
                value={tb} 
                onChange={(e) => setTb(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usia (Tahun)</label>
              <input 
                type="number" 
                value={usia} 
                onChange={(e) => setUsia(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faktor Aktivitas</label>
              <select 
                value={fa} 
                onChange={(e) => setFa(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value={1.1}>Istirahat, bed rest (1.1 - 1.2)</option>
                <option value={1.3}>Tidak bed rest, bisa jalan (1.3)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faktor Stres</label>
              <select 
                value={fs} 
                onChange={(e) => setFs(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
              >
                <option value={1.0}>Tidak ada stres (1.0)</option>
                <option value={1.1}>Ringan (1.1 - 1.2)</option>
                <option value={1.4}>Sedang (1.4 - 1.5)</option>
                <option value={1.5}>Berat (1.5 - 1.6)</option>
                <option value={1.7}>Sangat Berat (1.7)</option>
              </select>
            </div>
          </div>

          {totalEnergi !== null && bmr !== null && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-emerald-800 mb-1">BMR (Basal):</p>
                  <div className="text-2xl font-bold text-emerald-600">{bmr.toFixed(0)} <span className="text-sm font-medium">kkal</span></div>
                </div>
                <div>
                  <p className="text-sm text-emerald-800 mb-1">Total Kebutuhan Energi:</p>
                  <div className="text-2xl font-bold text-emerald-600">{totalEnergi.toFixed(0)} <span className="text-sm font-medium">kkal/hari</span></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
