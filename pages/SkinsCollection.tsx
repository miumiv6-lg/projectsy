import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Shield, User, Target, AlertTriangle, Crown, ChevronRight, LayoutGrid } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isSubscribed = sessionState.isSubscribed;

  const categories = [
    { id: 'metro', name: 'Метро', icon: Shield, description: 'Скины из вселенной Метро 2033' },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle, description: 'Легенды Зоны' },
    { id: 'military', name: 'Военные', icon: Target, description: 'Спецподразделения и армия' },
    { id: 'civilians', name: 'Гражданские', icon: User, description: 'Жители и работники станций' },
  ];

  const skins: Record<string, Array<{ id: number, name: string, price: number, rarity: string, image: string }>> = {
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

  const handleBack = () => {
    if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      setPage(Page.SHOP);
    }
  };

  const currentSkins = selectedCategory ? skins[selectedCategory] : [];
  const currentCategoryInfo = categories.find(c => c.id === selectedCategory);

  return (
    <div className="w-full min-h-screen pt-8 pb-24 px-6 bg-black flex flex-col animate-fade-in">
      <div className="max-w-md mx-auto w-full flex-grow flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all bg-[#0A0A0A] hover:bg-[#121212]"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex-grow">
            <h1 className="text-xl font-medium text-white tracking-tight">
              {selectedCategory ? currentCategoryInfo?.name : 'Коллекция'}
            </h1>
            <p className="text-xs text-zinc-500">
              {selectedCategory 
                ? `${currentSkins.length} доступно` 
                : 'Выберите категорию'}
            </p>
          </div>

          {!selectedCategory && (
            <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 text-zinc-500 bg-[#0A0A0A]">
               <LayoutGrid size={18} />
            </div>
          )}
        </div>

        {/* View Switcher */}
        {!selectedCategory ? (
          // --- CATALOG VIEW (CATEGORIES) ---
          <div className="space-y-3 animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="w-full p-5 rounded-2xl bg-[#0A0A0A] border border-white/5 flex items-center justify-between group hover:bg-[#121212] hover:border-white/10 transition-all active:scale-[0.98]"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors">
                    <cat.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-medium text-white mb-0.5">{cat.name}</h3>
                    <p className="text-xs text-zinc-500">{skins[cat.id]?.length || 0} позиций</p>
                  </div>
                </div>
                
                <ChevronRight size={18} className="text-zinc-600 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        ) : (
          // --- DETAIL VIEW (SKINS GRID) ---
          <div className="grid grid-cols-2 gap-4 animate-slide-up">
            {currentSkins.map((skin) => (
              <div 
                key={skin.id}
                className="cursor-card group flex flex-col p-3 rounded-2xl hover:bg-zinc-900/40 bg-[#0A0A0A] border-white/5"
              >
                {/* Preview Placeholder */}
                <div className={`aspect-[3/4] w-full rounded-xl ${skin.image} mb-3 relative overflow-hidden ring-1 ring-white/5 group-hover:ring-white/10 transition-all`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  
                  {/* Rarity Dot */}
                  <div className={`absolute top-3 left-3 w-1.5 h-1.5 rounded-full ${
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
                <button className={`w-full py-3 rounded-xl font-medium text-xs flex items-center justify-center gap-2 transition-all mt-auto active:scale-[0.98] ${
                  isSubscribed
                    ? 'bg-white/5 text-white hover:bg-white/10 border border-white/5'
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
        )}

      </div>
    </div>
  );
};

export default SkinsCollection;
