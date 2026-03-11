import React from 'react';
import { 
  Calculator, 
  Scale, 
  Ruler, 
  Activity, 
  Droplets, 
  Zap, 
  ActivitySquare,
  Baby,
  HeartPulse,
  Stethoscope,
  Brain,
  TrendingDown,
  Pizza,
  TestTube,
  UserMinus
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { id: 'bbi', label: 'Berat Badan Ideal (BBI)', icon: Scale },
  { id: 'bbk', label: 'Berat Badan Koreksi (BBK)', icon: Scale },
  { id: 'amputasi', label: 'Koreksi Amputasi', icon: UserMinus },
  { id: 'estimasi', label: 'Estimasi Antropometri', icon: Ruler },
  { id: 'tinggilutut', label: 'Estimasi TB (Tinggi Lutut)', icon: Ruler },
  { id: 'status', label: 'Status Gizi (IMT, LiLA)', icon: Activity },
  { id: 'zscore', label: 'Z-Score Anak', icon: Baby },
  { id: 'gizianak', label: 'Kebutuhan Gizi Anak', icon: Baby },
  { id: 'bumil', label: 'Gizi Bumil & Busui', icon: HeartPulse },
  { id: 'cairan', label: 'Kebutuhan Cairan', icon: Droplets },
  { id: 'energi', label: 'Kebutuhan Energi', icon: Zap },
  { id: 'penurunan', label: 'Target Penurunan BB', icon: TrendingDown },
  { id: 'carbo', label: 'Carbo Counting', icon: Pizza },
  { id: 'ginjal', label: 'Fungsi Ginjal (eGFR)', icon: ActivitySquare },
  { id: 'labgizi', label: 'Laboratorium Gizi', icon: TestTube },
  { id: 'gcs', label: 'Tingkat Kesadaran (GCS)', icon: Brain },
  { id: 'klinis', label: 'Gizi Klinis (DM, dll)', icon: Stethoscope },
  { id: 'preskripsi', label: 'Preskripsi Diet Penyakit', icon: Stethoscope },
];

export default function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-64 bg-white border-r border-gray-200
        transform transition-transform duration-200 ease-in-out
        flex flex-col h-full
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-gray-200 flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 leading-tight">
            Nutritionist<br/>Calc
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left
                      ${isActive 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
                    {item.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          Berdasarkan Nutritionist Guidebook
        </div>
      </div>
    </>
  );
}

