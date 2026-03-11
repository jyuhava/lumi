import React, { useState } from 'react';

export default function KebutuhanCairan() {
  const [tab, setTab] = useState<'holiday' | 'baxter'>('holiday');

  // Holiday Segar
  const [bbHoliday, setBbHoliday] = useState<number | ''>('');

  // Baxter
  const [bbBaxter, setBbBaxter] = useState<number | ''>('');
  const [lukaBakar, setLukaBakar] = useState<number | ''>('');

  const hitungHoliday = () => {
    if (bbHoliday === '') return null;
    const bb = Number(bbHoliday);
    let cairan = 0;

    if (bb <= 10) {
      cairan = bb * 100;
    } else if (bb <= 20) {
      cairan = 1000 + (50 * (bb - 10));
    } else {
      cairan = 1500 + (20 * (bb - 20));
    }

    return cairan;
  };

  const hitungBaxter = () => {
    if (bbBaxter === '' || lukaBakar === '') return null;
    const bb = Number(bbBaxter);
    let lb = Number(lukaBakar);
    
    if (lb > 50) lb = 50; // Max 50% according to book

    const cairan = 4 * bb * lb;
    return cairan;
  };

  const resHoliday = hitungHoliday();
  const resBaxter = hitungBaxter();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Kebutuhan Cairan</h2>
          <p className="text-gray-500 mt-1">Hitung kebutuhan cairan harian atau resusitasi luka bakar.</p>
        </div>
        
        <div className="flex border-b border-gray-100">
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'holiday' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('holiday')}
          >
            Holiday Segar (Harian)
          </button>
          <button
            className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'baxter' ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setTab('baxter')}
          >
            Baxter (Luka Bakar)
          </button>
        </div>

        <div className="p-6">
          {tab === 'holiday' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
                <input 
                  type="number" 
                  value={bbHoliday} 
                  onChange={(e) => setBbHoliday(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Contoh: 60"
                />
                <p className="text-xs text-gray-500 mt-2">*Restriksi jika terdapat edema atau asites.</p>
              </div>

              {resHoliday !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Kebutuhan Cairan Harian:</p>
                  <div className="text-3xl font-bold text-emerald-600">{resHoliday} <span className="text-lg font-medium">ml/hari</span></div>
                </div>
              )}
            </div>
          )}

          {tab === 'baxter' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Ideal (kg)</label>
                  <input 
                    type="number" 
                    value={bbBaxter} 
                    onChange={(e) => setBbBaxter(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Luas Luka Bakar (%)</label>
                  <input 
                    type="number" 
                    value={lukaBakar} 
                    onChange={(e) => setLukaBakar(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">*Bila &gt;50%, persentase yang digunakan tetap 50%</p>
                </div>
              </div>

              {resBaxter !== null && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <p className="text-sm text-emerald-800 mb-1">Kebutuhan Cairan (Ringer Laktat):</p>
                  <div className="text-3xl font-bold text-emerald-600">{resBaxter} <span className="text-lg font-medium">ml/24 jam</span></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
