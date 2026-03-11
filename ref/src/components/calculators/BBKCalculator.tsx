import React, { useState } from 'react';

type FluidType = 'oedema' | 'ascites' | 'efusi' | 'hydrothorax';
type Severity = 'ringan' | 'sedang' | 'berat';

export default function BBKCalculator() {
  const [bbAktual, setBbAktual] = useState<number | ''>('');
  const [fluidType, setFluidType] = useState<FluidType>('oedema');
  const [severity, setSeverity] = useState<Severity>('ringan');

  const hitungBBK = () => {
    if (bbAktual === '') return null;
    const bb = Number(bbAktual);
    let deduction = 0;

    if (fluidType === 'oedema') {
      if (severity === 'ringan') deduction = bb * 0.10;
      else if (severity === 'sedang') deduction = bb * 0.20;
      else if (severity === 'berat') deduction = bb * 0.30;
    } else if (fluidType === 'ascites') {
      if (severity === 'ringan') deduction = 2.2;
      else if (severity === 'sedang') deduction = 6;
      else if (severity === 'berat') deduction = 10;
    } else if (fluidType === 'efusi') {
      if (severity === 'ringan') deduction = bb * 0.20;
      else if (severity === 'sedang') deduction = 0; // Not defined in table, assume 0 or N/A
      else if (severity === 'berat') deduction = bb * 0.25;
    } else if (fluidType === 'hydrothorax') {
      if (severity === 'ringan') deduction = bb * 0.25;
      else if (severity === 'sedang') deduction = 0; // Not defined
      else if (severity === 'berat') deduction = bb * 0.30;
    }

    return bb - deduction;
  };

  const bbk = hitungBBK();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Berat Badan Kering/Koreksi (BBK)</h2>
          <p className="text-gray-500 mt-1">Koreksi berat badan berdasarkan penumpukan cairan.</p>
        </div>
        
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Berat Badan Aktual (kg)</label>
            <input 
              type="number" 
              value={bbAktual} 
              onChange={(e) => setBbAktual(e.target.value ? Number(e.target.value) : '')}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              placeholder="Contoh: 65"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Penumpukan Cairan</label>
            <select 
              value={fluidType} 
              onChange={(e) => setFluidType(e.target.value as FluidType)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="oedema">Oedema</option>
              <option value="ascites">Ascites</option>
              <option value="efusi">Efusi Pleura</option>
              <option value="hydrothorax">Hydrothorax</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tingkat Keparahan</label>
            <select 
              value={severity} 
              onChange={(e) => setSeverity(e.target.value as Severity)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all bg-white"
            >
              <option value="ringan">Ringan</option>
              <option value="sedang" disabled={fluidType === 'efusi' || fluidType === 'hydrothorax'}>Sedang</option>
              <option value="berat">Berat</option>
            </select>
            {(fluidType === 'efusi' || fluidType === 'hydrothorax') && severity === 'sedang' && (
              <p className="text-xs text-amber-500 mt-1">Tingkat sedang tidak didefinisikan untuk jenis cairan ini dalam referensi.</p>
            )}
          </div>

          {bbAktual !== '' && bbk !== null && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-sm text-emerald-800 mb-1">Hasil Berat Badan Koreksi:</p>
              <div className="text-3xl font-bold text-emerald-600">{bbk.toFixed(1)} <span className="text-lg font-medium">kg</span></div>
              <p className="text-xs text-emerald-600 mt-2">
                Pengurangan: {(Number(bbAktual) - bbk).toFixed(1)} kg
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
