import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Shield, User, Target, AlertTriangle, Crown, ShoppingCart } from 'lucide-react';
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
      { id: 3, name: 'Хантер', price: 35, rarity: 'epic', image: 'bg-gray-800' },
      { id: 4, name: 'Бандит', price: 15, rarity: 'common', image: 'bg-yellow-900' },
    ],
    stalker: [
      { id: 5, name: 'Одиночка', price: 20, rarity: 'common', image: 'bg-green-800' },
      { id: 6, name: 'Долговец', price: 30, rarity: 'rare', image: 'bg-red-900' },
      { id: 7, name: 'Свободовец', price: 30, rarity: 'rare', image: 'bg-green-600' },
    ],
    military: [
      { id: 8, name: 'Спецназ', price: 35, rarity: 'rare', image: 'bg-gray-700' },
      { id: 9, name: 'Офицер', price: 25, rarity: 'common', image: 'bg-blue-800' },
    ],
    civilians: [
      { id: 10, name: 'Рабочий', price: 10, rarity: 'common', image: 'bg-orange-900' },
      { id: 11, name: 'Торговец', price: 15, rarity: 'common', image: 'bg-yellow-800' },
    ]
  };

  const currentSkins = skins[activeCategory as keyof typeof skins];

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-[#0f1115] flex flex-col">
      <div className="max-w-[600px] mx-auto w-full flex-grow flex flex-col">
        
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

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:bg-[#22252b]'
              }`}
            >
              <cat.icon size={14} />
              <span className="text-sm font-bold">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Skins List */}
        <div className="flex flex-col gap-3">
          {currentSkins.map((skin) => (
            <div 
              key={skin.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-[#181a20] border border-[#2d313a] hover:border-gray-600 transition-colors"
            >
              {/* Skin Image/Icon */}
              <div className={`w-16 h-16 rounded-lg ${skin.image} flex-shrink-0 shadow-inner border border-white/5`}></div>
              
              {/* Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white truncate">{skin.name}</h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${
                    skin.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-500' :
                    skin.rarity === 'epic' ? 'bg-purple-500/20 text-purple-500' :
                    skin.rarity === 'rare' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-gray-500/20 text-gray-500'
                  }`}>
                    {skin.rarity}
                  </span>
                </div>
                
                {isSubscribed ? (
                  <div className="flex items-center gap-1.5 text-green-400 text-xs font-medium">
                    <Crown size={12} />
                    <span>Бесплатно с SYSub</span>
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">
                    Цена: <span className="text-white font-bold">{skin.price} SY</span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button className={`h-10 px-4 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                isSubscribed
                  ? 'bg-[#2d313a] text-white hover:bg-[#363b45]'
                  : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20'
              }`}>
                {isSubscribed ? (
                  'Выбрать'
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    <span>{skin.price}</span>
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
