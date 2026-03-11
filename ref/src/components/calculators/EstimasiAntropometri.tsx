import React, { useState } from 'react';

export default function EstimasiAntropometri() {
  const [tab, setTab] = useState<'bb' | 'tb'>('bb');
  
  // BB State
  const [lila, setLila] = useState<number | ''>('');
  const [genderBB, setGenderBB] = useState<'l' | 'p'>('l');

  // TB State
  const [tbType, setTbType] = useState<'anak' | 'dewasa'>('dewasa');
  const [genderTB, setGenderTB] = useState<'l' | 'p'>('l');
  const [ulna, setUlna] = useState<number | ''>('');
  const [rt, setRt] = useState<number | ''>('');
  const [usiaAnak, setUsiaAnak] = useState<string>('13-24');

  const hitungEstimasiBB = () => {
    if (lila === '') return null;
    const l = Number(lila);
    if (genderBB === 'l') {
      return (2.592 * l) - 12.902;
    } else {
      return (2.001 * l) - 1.223;
    }
  };

  const hitungEstimasiTB = () => {
    if (tbType === 'dewasa') {
      if (ulna === '') return null;
      const u = Number(ulna);
      if (genderTB === 'l') {
        return 97.252 + (2.645 * u);
      } else {
        return 68.777 + (3.536 * u);
      }
    } else {
      if (rt === '') return null;
      const r = Number(rt);
      if (genderTB === 'l') {
        if (usiaAnak === '13-24') return 27.793 + 0.685 * r;
        if (usiaAnak === '25-36') return 21.364 + 0.771 * r;
        if (usiaAnak === '37-48') return 32.157 + 0.686 * r;
        if (usiaAnak === '49-60') return 54.681 + 0.461 * r;
      } else {
        if (usiaAnak === '13-24') return 49.398 + 0.367 * r;
        if (usiaAnak === '25-36') return 20.185 + 0.796 * r;
        if (usiaAnak === '37-48') return 32 + 0.674 * r;
        if (usiaAnak === '49-60') return 13.861 + 0.884 * r;
      }
    }
    return null;
  };

  const estBB = hitungEstimasiBB();
  const estTB = hitungEstimasiTB();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Estimasi Antropometri</h2>
          <p className="text-gray-500 mt-1">Estimasi BB dari LiLA atau TB dari Ulna/Rentang Tangan.</p>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'bb' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('bb')}
          >
            Estimasi BB (Dewasa)
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'tb' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('tb')}
          >
            Estimasi TB
          </button>
        </div>

        <div className="p-6">
          {tab === 'bb' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="genderBB" value="l" checked={genderBB === 'l'} onChange={() => setGenderBB('l')} className="text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-gray-700">Laki-laki</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="genderBB" value="p" checked={genderBB === 'p'} onChange={() => setGenderBB('p')} className="text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-gray-700">Perempuan</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lingkar Lengan Atas (LiLA) dalam cm</label>
                <input 
                  type="number" 
                  value={lila} 
                  onChange={(e) => setLila(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Contoh: 28"
                />
              </div>

              {lila !== '' && estBB !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Estimasi Berat Badan:</p>
                  <div className="text-3xl font-bold text-emerald-600">{estBB.toFixed(1)} <span className="text-lg font-medium">kg</span></div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tbType" value="dewasa" checked={tbType === 'dewasa'} onChange={() => setTbType('dewasa')} className="text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-gray-700">Dewasa (Ulna)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="tbType" value="anak" checked={tbType === 'anak'} onChange={() => setTbType('anak')} className="text-emerald-500 focus:ring-emerald-500" />
                  <span className="text-gray-700">Anak (Rentang Tangan)</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="genderTB" value="l" checked={genderTB === 'l'} onChange={() => setGenderTB('l')} className="text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-gray-700">Laki-laki</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="genderTB" value="p" checked={genderTB === 'p'} onChange={() => setGenderTB('p')} className="text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-gray-700">Perempuan</span>
                  </label>
                </div>
              </div>

              {tbType === 'dewasa' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Panjang Ulna (cm)</label>
                  <input 
                    type="number" 
                    value={ulna} 
                    onChange={(e) => setUlna(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: 25"
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Usia Anak (Bulan)</label>
                    <select 
                      value={usiaAnak} 
                      onChange={(e) => setUsiaAnak(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
                    >
                      <option value="13-24">13 - 24 Bulan</option>
                      <option value="25-36">25 - 36 Bulan</option>
                      <option value="37-48">37 - 48 Bulan</option>
                      <option value="49-60">49 - 60 Bulan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rentang Tangan / RT (cm)</label>
                    <input 
                      type="number" 
                      value={rt} 
                      onChange={(e) => setRt(e.target.value ? Number(e.target.value) : '')}
                      className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Contoh: 80"
                    />
                  </div>
                </>
              )}

              {((tbType === 'dewasa' && ulna !== '') || (tbType === 'anak' && rt !== '')) && estTB !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Estimasi Tinggi Badan:</p>
                  <div className="text-3xl font-bold text-emerald-600">{estTB.toFixed(1)} <span className="text-lg font-medium">cm</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
