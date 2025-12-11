import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Shield, User, Target, AlertTriangle, Crown, ShoppingCart, Lock } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('metro');
  const isSubscribed = sessionState.isSubscribed;

  const categories = [
    { id: 'metro', name: 'Метро 2033', icon: Shield },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle },
    { id: 'military', name: 'Военные', icon: Target },
    { id: 'civilians', name: 'Гражданские', icon: User },
  ];

  const skins = {
    metro: [
      { id: 1, name: 'Артем', price: 50, rarity: 'legendary', image: 'bg-blue-900' },
      { id: 2, name: 'Мельник', price: 40, rarity: 'epic', image: 'bg-green-900' },
      { id: 3, name: 'Хантер', price: 35, rarity: 'epic', image: 'bg-zinc-700' },
      { id: 4, name: 'Бандит', price: 15, rarity: 'common', image: 'bg-yellow-900' },
    ],
    stalker: [
      { id: 5, name: 'Одиночка', price: 20, rarity: 'common', image: 'bg-green-800' },
      { id: 6, name: 'Долговец', price: 30, rarity: 'rare', image: 'bg-red-900' },
      { id: 7, name: 'Свободовец', price: 30, rarity: 'rare', image: 'bg-green-600' },
    ],
    military: [
      { id: 8, name: 'Спецназ', price: 35, rarity: 'rare', image: 'bg-zinc-600' },
      { id: 9, name: 'Офицер', price: 25, rarity: 'common', image: 'bg-blue-800' },
    ],
    civilians: [
      { id: 10, name: 'Рабочий', price: 10, rarity: 'common', image: 'bg-orange-900' },
      { id: 11, name: 'Торговец', price: 15, rarity: 'common', image: 'bg-yellow-800' },
    ]
  };

  const currentSkins = skins[activeCategory as keyof typeof skins];

  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 bg-zinc-950 flex flex-col">
      <div className="max-w-md mx-auto w-full flex-grow flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Коллекция</h1>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-2 scrollbar-hide no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border whitespace-nowrap transition-all text-sm font-medium ${
                activeCategory === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <cat.icon size={16} strokeWidth={1.5} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-2 gap-4">
          {currentSkins.map((skin) => (
            <div 
              key={skin.id}
              className="group flex flex-col p-3 rounded-3xl bg-zinc-900 border border-zinc-800 active:scale-[0.98] transition-all"
            >
              {/* Preview Placeholder */}
              <div className={`aspect-square w-full rounded-2xl ${skin.image} mb-3 relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                {isSubscribed && (
                   <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md text-white p-1.5 rounded-lg">
                      <Crown size={12} fill="currentColor" className="text-yellow-400" />
                   </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="font-semibold text-white text-sm truncate">{skin.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                   <span className={`w-1.5 h-1.5 rounded-full ${
                      skin.rarity === 'legendary' ? 'bg-yellow-500' :
                      skin.rarity === 'epic' ? 'bg-purple-500' :
                      skin.rarity === 'rare' ? 'bg-blue-500' :
                      'bg-zinc-500'
                   }`}></span>
                   <span className="text-xs text-zinc-500 capitalize">{skin.rarity}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all mt-auto ${
                isSubscribed
                  ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                  : 'bg-white text-black hover:bg-zinc-200'
              }`}>
                {isSubscribed ? (
                  'Выбрать'
                ) : (
                  <>
                    <span>{skin.price} SY</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SkinsCollection;
