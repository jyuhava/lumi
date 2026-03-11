import React, { useState } from 'react';

export default function LabGiziCalculator() {
  const [tab, setTab] = useState<'nitrogen' | 'kalsium' | 'osmolaritas' | 'ganzoni'>('nitrogen');

  // Nitrogen Balance
  const [protein, setProtein] = useState<number | ''>('');
  const [uun, setUun] = useState<number | ''>('');

  // Koreksi Kalsium
  const [ca, setCa] = useState<number | ''>('');
  const [albumin, setAlbumin] = useState<number | ''>('');

  // Osmolaritas
  const [na, setNa] = useState<number | ''>('');
  const [glukosa, setGlukosa] = useState<number | ''>('');
  const [bun, setBun] = useState<number | ''>('');

  // Defisit Besi (Ganzoni)
  const [bb, setBb] = useState<number | ''>('');
  const [hbAktual, setHbAktual] = useState<number | ''>('');
  const [hbTarget, setHbTarget] = useState<number>(15);

  const hitungNitrogen = () => {
    if (protein === '' || uun === '') return null;
    const nIntake = Number(protein) / 6.25;
    const nOutput = Number(uun) + 4;
    return nIntake - nOutput;
  };

  const hitungKalsium = () => {
    if (ca === '' || albumin === '') return null;
    return Number(ca) + 0.8 * (4.0 - Number(albumin));
  };

  const hitungOsmolaritas = () => {
    if (na === '' || glukosa === '' || bun === '') return null;
    return (2 * Number(na)) + (Number(glukosa) / 18) + (Number(bun) / 2.8);
  };

  const hitungGanzoni = () => {
    if (bb === '' || hbAktual === '') return null;
    // Defisit Besi (mg) = BB (kg) * (Target Hb - Actual Hb) * 2.4 + Depot Iron (500mg)
    return (Number(bb) * (hbTarget - Number(hbAktual)) * 2.4) + 500;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Laboratorium Gizi</h2>
          <p className="text-gray-500 mt-1">Perhitungan klinis berdasarkan parameter biokimia darah dan urin.</p>
        </div>
        
        <div className="flex overflow-x-auto border-b border-gray-100 hide-scrollbar">
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === 'nitrogen' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('nitrogen')}
          >
            Nitrogen Balance
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === 'kalsium' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('kalsium')}
          >
            Koreksi Kalsium
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === 'osmolaritas' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('osmolaritas')}
          >
            Osmolaritas
          </button>
          <button
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${tab === 'ganzoni' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('ganzoni')}
          >
            Defisit Besi (Ganzoni)
          </button>
        </div>

        <div className="p-6 space-y-5">
          {tab === 'nitrogen' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asupan Protein (g/hari)</label>
                  <input type="number" value={protein} onChange={(e) => setProtein(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">UUN (Urine Urea Nitrogen) (g/hari)</label>
                  <input type="number" value={uun} onChange={(e) => setUun(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungNitrogen() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Keseimbangan Nitrogen:</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungNitrogen()?.toFixed(2)} <span className="text-lg font-medium">g</span></div>
                  <p className="text-xs text-emerald-700 mt-2">
                    Positif (+) = Anabolik (Membangun otot/pemulihan). Negatif (-) = Katabolik (Pemecahan otot/stres). Target pemulihan: +2 s/d +4.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'kalsium' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Kalsium Serum (mg/dL)</label>
                  <input type="number" step="0.1" value={ca} onChange={(e) => setCa(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Albumin Serum (g/dL)</label>
                  <input type="number" step="0.1" value={albumin} onChange={(e) => setAlbumin(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungKalsium() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Kalsium Terkoreksi:</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungKalsium()?.toFixed(2)} <span className="text-lg font-medium">mg/dL</span></div>
                  <p className="text-xs text-emerald-700 mt-2">
                    Gunakan nilai ini untuk mendiagnosis hipokalsemia pada pasien dengan hipoalbuminemia. Normal: 8.5 - 10.5 mg/dL.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'osmolaritas' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Natrium (mEq/L)</label>
                  <input type="number" value={na} onChange={(e) => setNa(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Glukosa (mg/dL)</label>
                  <input type="number" value={glukosa} onChange={(e) => setGlukosa(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BUN (mg/dL)</label>
                  <input type="number" value={bun} onChange={(e) => setBun(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungOsmolaritas() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Osmolaritas Darah:</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungOsmolaritas()?.toFixed(1)} <span className="text-lg font-medium">mOsm/kg</span></div>
                  <p className="text-xs text-emerald-700 mt-2">
                    Normal: 275 - 295 mOsm/kg. &gt;295 = Dehidrasi / Hiperosmolar.
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === 'ganzoni' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan (kg)</label>
                  <input type="number" value={bb} onChange={(e) => setBb(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hb Aktual (g/dL)</label>
                  <input type="number" step="0.1" value={hbAktual} onChange={(e) => setHbAktual(e.target.value ? Number(e.target.value) : '')} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hb Target (g/dL)</label>
                  <input type="number" step="0.1" value={hbTarget} onChange={(e) => setHbTarget(Number(e.target.value))} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
              </div>
              {hitungGanzoni() !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Total Defisit Besi (Ganzoni):</p>
                  <div className="text-3xl font-bold text-emerald-600">{hitungGanzoni()?.toFixed(0)} <span className="text-lg font-medium">mg</span></div>
                  <p className="text-xs text-emerald-700 mt-2">
                    Digunakan untuk menghitung dosis suplementasi besi intravena pada anemia defisiensi besi. (Sudah termasuk 500mg untuk cadangan besi).
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
