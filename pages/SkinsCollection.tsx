import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Search, Box, Shield, User } from 'lucide-react';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('metro');

  const categories = [
    { id: 'metro', name: 'Метро 2033', icon: Shield },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle },
    { id: 'military', name: 'Военные', icon: Target },
    { id: 'civilians', name: 'Гражданские', icon: User },
  ];

  const skins = {
    metro: [
      { id: 1, name: 'Артем', price: 500, rarity: 'legendary', image: 'bg-blue-900' },
      { id: 2, name: 'Мельник', price: 450, rarity: 'epic', image: 'bg-green-900' },
      { id: 3, name: 'Хантер', price: 400, rarity: 'epic', image: 'bg-gray-800' },
      { id: 4, name: 'Бандит', price: 150, rarity: 'common', image: 'bg-yellow-900' },
    ],
    stalker: [
      { id: 5, name: 'Одиночка', price: 200, rarity: 'common', image: 'bg-green-800' },
      { id: 6, name: 'Долговец', price: 300, rarity: 'rare', image: 'bg-red-900' },
      { id: 7, name: 'Свободовец', price: 300, rarity: 'rare', image: 'bg-green-600' },
    ],
    military: [
      { id: 8, name: 'Спецназ', price: 350, rarity: 'rare', image: 'bg-gray-700' },
      { id: 9, name: 'Офицер', price: 250, rarity: 'common', image: 'bg-blue-800' },
    ],
    civilians: [
      { id: 10, name: 'Рабочий', price: 100, rarity: 'common', image: 'bg-orange-900' },
      { id: 11, name: 'Торговец', price: 150, rarity: 'common', image: 'bg-yellow-800' },
    ]
  };

  // Helper icons for categories
  function AlertTriangle(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
  }
  function Target(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  }

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-[#0f1115] flex flex-col">
      <div className="max-w-[1200px] mx-auto w-full flex-grow flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181a20] border border-[#2d313a] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-white">Коллекция скинов</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6 flex-grow">
          {/* Sidebar (Categories) */}
          <div className="w-full md:w-64 flex-shrink-0 space-y-2 overflow-x-auto md:overflow-visible flex md:block pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all w-full min-w-[160px] md:min-w-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#2d313a] border-blue-500 text-white shadow-lg'
                    : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:bg-[#22252b]'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-[#22252b] text-gray-500'}`}>
                  <cat.icon size={18} />
                </div>
                <span className="font-bold text-sm">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Main Content (Skins Grid) */}
          <div className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {skins[activeCategory as keyof typeof skins].map((skin) => (
                <div key={skin.id} className="bg-[#181a20] border border-[#2d313a] rounded-xl overflow-hidden group hover:border-gray-500 transition-all">
                  {/* Placeholder for 3D Model/Image */}
                  <div className={`aspect-[3/4] ${skin.image} relative flex items-center justify-center`}>
                    <Box size={32} className="text-white/20" />
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white border border-white/10">
                      {skin.price} SY
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-bold text-white text-sm mb-1">{skin.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        skin.rarity === 'legendary' ? 'text-yellow-500' :
                        skin.rarity === 'epic' ? 'text-purple-500' :
                        skin.rarity === 'rare' ? 'text-blue-500' :
                        'text-gray-500'
                      }`}>
                        {skin.rarity}
                      </span>
                      <button className="w-6 h-6 bg-[#2d313a] rounded flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                        <Search size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkinsCollection;
