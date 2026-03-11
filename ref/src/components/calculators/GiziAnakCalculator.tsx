import React, { useState } from 'react';

export default function GiziAnakCalculator() {
  const [tab, setTab] = useState<'who' | 'aspen'>('who');

  // Common
  const [gender, setGender] = useState<'l' | 'p'>('l');
  const [bb, setBb] = useState<number | ''>('');
  const [tb, setTb] = useState<number | ''>('');
  const [usia, setUsia] = useState<number | ''>(''); // Tahun
  
  // WHO / Schofield
  const [fa, setFa] = useState<number>(1.2);
  const [fs, setFs] = useState<number>(1.0);

  const hitungWHO = () => {
    if (bb === '' || usia === '') return null;
    const w = Number(bb);
    const u = Number(usia);
    let bmr = 0;

    if (u <= 3) {
      bmr = gender === 'l' ? (60.9 * w) - 54 : (61 * w) - 51;
    } else if (u <= 10) {
      bmr = gender === 'l' ? (22.7 * w) + 495 : (22.5 * w) + 499;
    } else if (u <= 18) {
      bmr = gender === 'l' ? (17.5 * w) + 651 : (12.2 * w) + 746;
    } else {
      return null;
    }
    return bmr * fa * fs;
  };

  const hitungSchofield = () => {
    if (bb === '' || tb === '' || usia === '') return null;
    const w = Number(bb);
    const h = Number(tb);
    const u = Number(usia);
    let bmr = 0;

    if (u <= 3) {
      bmr = gender === 'l' ? (0.17 * w) + (15.17 * h) - 617.6 : (16.25 * w) + (10.232 * h) - 413.5;
    } else if (u <= 10) {
      bmr = gender === 'l' ? (19.6 * w) + (1.303 * h) + 414.9 : (16.97 * w) + (1.618 * h) + 371.2;
    } else if (u <= 18) {
      bmr = gender === 'l' ? (16.25 * w) + (1.372 * h) + 515.5 : (8.365 * w) + (4.65 * h) + 200.0;
    } else {
      return null;
    }
    return bmr * fa * fs;
  };

  const hitungASPEN = () => {
    if (bb === '' || tb === '' || usia === '') return null;
    const w = Number(bb);
    const h = Number(tb) / 100; // Formula ASPEN TB dalam meter
    const u = Number(usia);
    
    // Caldwell-Kennedy (<2 th)
    if (u < 2) {
      return 22 + (31.05 * w) + (1.16 * (h * 100)); // TB in cm for Caldwell
    }

    // Fleisch
    const lpt = Math.sqrt((w * (h * 100)) / 3600); // LPT formula
    if (u <= 12) {
      return gender === 'l' 
        ? 24 * lpt * (54 - (0.885 * u))
        : 24 * lpt * (54 - (1.045 * u));
    } else if (u <= 19) {
      return gender === 'l'
        ? 24 * lpt * (42.5 - (0.643 * (u - 13)))
        : 24 * lpt * (42.5 - (0.778 * (u - 11)));
    }
    return null;
  };

  const resWHO = hitungWHO();
  const resSchofield = hitungSchofield();
  const resASPEN = hitungASPEN();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Kebutuhan Gizi Anak Sakit</h2>
          <p className="text-gray-500 mt-1">Hitung kebutuhan energi anak menggunakan rumus WHO, Schofield, atau A.S.P.E.N.</p>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'who' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('who')}
          >
            WHO & Schofield
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'aspen' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('aspen')}
          >
            A.S.P.E.N (Kritis/Bedah)
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
              <select 
                value={gender} 
                onChange={(e) => setGender(e.target.value as 'l' | 'p')}
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          {tab === 'who' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faktor Aktivitas</label>
                <select 
                  value={fa} 
                  onChange={(e) => setFa(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                >
                  <option value={1.0}>Lumpuh, Tiduran (1.0)</option>
                  <option value={1.2}>Istirahat, Bed Rest (1.1 - 1.2)</option>
                  <option value={1.3}>Tidak bed rest, bisa jalan (1.2 - 1.3)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faktor Stres</label>
                <select 
                  value={fs} 
                  onChange={(e) => setFs(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                >
                  <option value={0.8}>Kelaparan (0.7 - 0.9)</option>
                  <option value={1.3}>Bedah (1.2 - 1.5)</option>
                  <option value={1.4}>Sepsis (1.2 - 1.6)</option>
                  <option value={1.5}>Trauma (1.1 - 1.8)</option>
                  <option value={1.7}>Gagal Tumbuh (1.5 - 2.0)</option>
                  <option value={2.0}>Luka Bakar (1.5 - 2.5)</option>
                </select>
              </div>
            </div>
          )}

          {tab === 'who' && (resWHO !== null || resSchofield !== null) && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-emerald-800 mb-1">Energi (WHO):</p>
                <div className="text-2xl font-bold text-emerald-600">{resWHO ? resWHO.toFixed(0) : '-'} <span className="text-sm font-medium">kkal</span></div>
              </div>
              <div>
                <p className="text-sm text-emerald-800 mb-1">Energi (Schofield):</p>
                <div className="text-2xl font-bold text-emerald-600">{resSchofield ? resSchofield.toFixed(0) : '-'} <span className="text-sm font-medium">kkal</span></div>
              </div>
            </div>
          )}

          {tab === 'aspen' && resASPEN !== null && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 mb-1">Energi Pasca Bedah/Kritis (A.S.P.E.N):</p>
              <div className="text-3xl font-bold text-emerald-600">{resASPEN.toFixed(0)} <span className="text-lg font-medium">kkal</span></div>
              <p className="text-xs text-emerald-700 mt-2">
                Menggunakan rumus Caldwell-Kennedy (&lt;2 th) atau Fleisch (1-19 th).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
