import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Shield, User, Target, AlertTriangle, Crown, ShoppingCart, Lock, Filter } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('metro');
  const isSubscribed = sessionState.isSubscribed;

  const categories = [
    { id: 'metro', name: 'Метро', icon: Shield },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle },
    { id: 'military', name: 'Военные', icon: Target },
    { id: 'civilians', name: 'Гражданские', icon: User },
  ];

  const skins = {
    metro: [
      { id: 1, name: 'Артем', price: 50, rarity: 'legendary', image: 'bg-zinc-800' },
      { id: 2, name: 'Мельник', price: 40, rarity: 'epic', image: 'bg-zinc-800' },
      { id: 3, name: 'Хантер', price: 35, rarity: 'epic', image: 'bg-zinc-800' },
      { id: 4, name: 'Бандит', price: 15, rarity: 'common', image: 'bg-zinc-900' },
    ],
    stalker: [
      { id: 5, name: 'Одиночка', price: 20, rarity: 'common', image: 'bg-zinc-800' },
      { id: 6, name: 'Долговец', price: 30, rarity: 'rare', image: 'bg-zinc-800' },
      { id: 7, name: 'Свободовец', price: 30, rarity: 'rare', image: 'bg-zinc-800' },
    ],
    military: [
      { id: 8, name: 'Спецназ', price: 35, rarity: 'rare', image: 'bg-zinc-800' },
      { id: 9, name: 'Офицер', price: 25, rarity: 'common', image: 'bg-zinc-900' },
    ],
    civilians: [
      { id: 10, name: 'Рабочий', price: 10, rarity: 'common', image: 'bg-zinc-900' },
      { id: 11, name: 'Торговец', price: 15, rarity: 'common', image: 'bg-zinc-900' },
    ]
  };

  const currentSkins = skins[activeCategory as keyof typeof skins] || [];

  return (
    <div className="w-full min-h-screen pt-8 pb-24 px-6 bg-black flex flex-col animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-grow flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex-grow">
            <h1 className="text-xl font-medium text-white tracking-tight">Коллекция</h1>
            <p className="text-xs text-zinc-500">{currentSkins.length} скинов доступно</p>
          </div>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all">
             <Filter size={14} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide no-scrollbar -mx-6 px-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent border-white/10 text-zinc-500 hover:text-white hover:border-white/30'
              }`}
            >
              <cat.icon size={12} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skins Grid */}
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          {currentSkins.map((skin) => (
            <div 
              key={skin.id}
              className="cursor-card group flex flex-col p-3 rounded-2xl hover:bg-zinc-900/50"
            >
              {/* Preview Placeholder */}
              <div className={`aspect-[3/4] w-full rounded-xl ${skin.image} mb-3 relative overflow-hidden ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                {/* Rarity Indicator */}
                <div className={`absolute top-2 left-2 w-1.5 h-1.5 rounded-full ${
                      skin.rarity === 'legendary' ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.8)]' :
                      skin.rarity === 'epic' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' :
                      skin.rarity === 'rare' ? 'bg-blue-500' :
                      'bg-zinc-500'
                   }`}></div>
                
                {isSubscribed && (
                   <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1 rounded-md border border-white/10">
                      <Crown size={10} fill="currentColor" className="text-yellow-400" />
                   </div>
                )}
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                   <h3 className="font-medium text-white text-sm truncate">{skin.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                   <span className="text-[10px] text-zinc-500 capitalize">{skin.rarity}</span>
                </div>
              </div>

              {/* Action Button */}
              <button className={`w-full py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all mt-auto active:scale-[0.98] ${
                isSubscribed
                  ? 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
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
