import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Search, Box, Shield, User, Target, AlertTriangle, ChevronRight, RotateCw } from 'lucide-react';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('metro');
  const [selectedSkinId, setSelectedSkinId] = useState<number | null>(null);

  const categories = [
    { id: 'metro', name: 'Метро 2033', icon: Shield, description: 'Выжившие в туннелях' },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle, description: 'Обитатели Зоны' },
    { id: 'military', name: 'Военные', icon: Target, description: 'Орден и Спецназ' },
    { id: 'civilians', name: 'Гражданские', icon: User, description: 'Жители станций' },
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

  // Get current skins based on category
  const currentSkins = skins[activeCategory as keyof typeof skins];
  // Selected skin object (default to first if none selected)
  const activeSkin = currentSkins.find(s => s.id === selectedSkinId) || currentSkins[0];

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

        <div className="flex flex-col lg:flex-row gap-6 flex-grow h-[calc(100vh-140px)]">
          
          {/* Left Sidebar: Collections List */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-2">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Коллекции</h2>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedSkinId(null); // Reset selection when changing category
                }}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                  activeCategory === cat.id
                    ? 'bg-[#2d313a] border-blue-500 shadow-lg'
                    : 'bg-[#181a20] border-[#2d313a] hover:bg-[#22252b] hover:border-gray-600'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  activeCategory === cat.id ? 'bg-blue-500 text-white' : 'bg-[#22252b] text-gray-500 group-hover:text-gray-300'
                }`}>
                  <cat.icon size={24} />
                </div>
                <div>
                  <span className={`font-bold block ${activeCategory === cat.id ? 'text-white' : 'text-gray-300'}`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-500">{cat.description}</span>
                </div>
                {activeCategory === cat.id && (
                  <div className="ml-auto">
                    <ChevronRight size={16} className="text-blue-500" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Right Area: Inspection & Selection */}
          <div className="flex-grow flex flex-col bg-[#181a20] border border-[#2d313a] rounded-2xl overflow-hidden">
            
            {/* 3D Viewer Area (Placeholder) */}
            <div className="flex-grow relative bg-gradient-to-b from-[#111] to-[#181a20] flex items-center justify-center min-h-[300px]">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
              
              {/* Rarity Badge */}
              <div className="absolute top-6 left-6">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                    activeSkin.rarity === 'legendary' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                    activeSkin.rarity === 'epic' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' :
                    activeSkin.rarity === 'rare' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                 }`}>
                   {activeSkin.rarity}
                 </span>
              </div>

              {/* 3D Model Placeholder */}
              <div className="relative z-10 flex flex-col items-center animate-fade-in">
                <div className={`w-48 h-64 rounded-2xl ${activeSkin.image} shadow-2xl flex items-center justify-center mb-4 border border-white/10`}>
                  <Box size={64} className="text-white/20" />
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <RotateCw size={12} />
                  <span>Покрутите модель (скоро)</span>
                </div>
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#181a20] to-transparent">
                <h2 className="text-3xl font-bold text-white mb-1">{activeSkin.name}</h2>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-400">{activeSkin.price} SY</div>
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl transition-colors shadow-lg shadow-blue-900/20">
                    Купить
                  </button>
                </div>
              </div>
            </div>

            {/* Skin Selector (Horizontal List) */}
            <div className="h-32 border-t border-[#2d313a] bg-[#1c1f26] p-4">
              <div className="flex gap-3 overflow-x-auto h-full pb-2 items-center">
                {currentSkins.map((skin) => (
                  <button
                    key={skin.id}
                    onClick={() => setSelectedSkinId(skin.id)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all relative overflow-hidden group ${
                      activeSkin.id === skin.id
                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                        : 'border-[#2d313a] hover:border-gray-500 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className={`w-full h-full ${skin.image}`}></div>
                    {activeSkin.id === skin.id && (
                      <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SkinsCollection;
