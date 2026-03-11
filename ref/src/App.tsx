import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BBICalculator from './components/calculators/BBICalculator';
import BBKCalculator from './components/calculators/BBKCalculator';
import EstimasiAntropometri from './components/calculators/EstimasiAntropometri';
import StatusGizi from './components/calculators/StatusGizi';
import ZScoreCalculator from './components/calculators/ZScoreCalculator';
import GiziAnakCalculator from './components/calculators/GiziAnakCalculator';
import BumilBusuiCalculator from './components/calculators/BumilBusuiCalculator';
import KebutuhanCairan from './components/calculators/KebutuhanCairan';
import KebutuhanEnergi from './components/calculators/KebutuhanEnergi';
import FungsiGinjal from './components/calculators/FungsiGinjal';
import GiziKlinisCalculator from './components/calculators/GiziKlinisCalculator';
import GCSCalculator from './components/calculators/GCSCalculator';
import PenurunanBBCalculator from './components/calculators/PenurunanBBCalculator';
import CarboCountingCalculator from './components/calculators/CarboCountingCalculator';
import PreskripsiDietCalculator from './components/calculators/PreskripsiDietCalculator';
import LabGiziCalculator from './components/calculators/LabGiziCalculator';
import AmputasiCalculator from './components/calculators/AmputasiCalculator';
import TinggiLututCalculator from './components/calculators/TinggiLututCalculator';

export default function App() {
  const [activeTab, setActiveTab] = useState('bbi');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'bbi': return <BBICalculator />;
      case 'bbk': return <BBKCalculator />;
      case 'amputasi': return <AmputasiCalculator />;
      case 'estimasi': return <EstimasiAntropometri />;
      case 'tinggilutut': return <TinggiLututCalculator />;
      case 'status': return <StatusGizi />;
      case 'zscore': return <ZScoreCalculator />;
      case 'gizianak': return <GiziAnakCalculator />;
      case 'bumil': return <BumilBusuiCalculator />;
      case 'cairan': return <KebutuhanCairan />;
      case 'energi': return <KebutuhanEnergi />;
      case 'penurunan': return <PenurunanBBCalculator />;
      case 'carbo': return <CarboCountingCalculator />;
      case 'ginjal': return <FungsiGinjal />;
      case 'labgizi': return <LabGiziCalculator />;
      case 'gcs': return <GCSCalculator />;
      case 'klinis': return <GiziKlinisCalculator />;
      case 'preskripsi': return <PreskripsiDietCalculator />;
      default: return <BBICalculator />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <h1 className="text-xl font-bold text-gray-800">Nutritionist Calc</h1>
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-5xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
