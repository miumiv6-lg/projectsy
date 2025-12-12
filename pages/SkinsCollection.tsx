import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Shield, User, Target, AlertTriangle, Crown, ChevronRight, LayoutGrid, Folder, File, Filter } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

interface SkinsCollectionProps {
  setPage: (page: Page) => void;
}

const SkinsCollection: React.FC<SkinsCollectionProps> = ({ setPage }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isSubscribed = sessionState.isSubscribed;

  const categories = [
    { id: 'metro', name: 'Метро 2033', icon: Shield, count: 4 },
    { id: 'stalker', name: 'S.T.A.L.K.E.R.', icon: AlertTriangle, count: 3 },
    { id: 'military', name: 'Военные', icon: Target, count: 2 },
    { id: 'civilians', name: 'Гражданские', icon: User, count: 2 },
  ];

  const skins: Record<string, Array<{ id: number, name: string, price: number, rarity: string, image: string }>> = {
    metro: [
      { id: 1, name: 'artem_suit.mdl', price: 50, rarity: 'legendary', image: 'bg-zinc-800' },
      { id: 2, name: 'miller_coat.mdl', price: 40, rarity: 'epic', image: 'bg-zinc-800' },
      { id: 3, name: 'hunter_armor.mdl', price: 35, rarity: 'epic', image: 'bg-zinc-800' },
      { id: 4, name: 'bandit_jacket.mdl', price: 15, rarity: 'common', image: 'bg-zinc-900' },
    ],
    stalker: [
      { id: 5, name: 'loner_sunrise.mdl', price: 20, rarity: 'common', image: 'bg-zinc-800' },
      { id: 6, name: 'duty_psz9.mdl', price: 30, rarity: 'rare', image: 'bg-zinc-800' },
      { id: 7, name: 'freedom_wind.mdl', price: 30, rarity: 'rare', image: 'bg-zinc-800' },
    ],
    military: [
      { id: 8, name: 'spetsnaz_berill.mdl', price: 35, rarity: 'rare', image: 'bg-zinc-800' },
      { id: 9, name: 'officer_uniform.mdl', price: 25, rarity: 'common', image: 'bg-zinc-900' },
    ],
    civilians: [
      { id: 10, name: 'worker_blue.mdl', price: 10, rarity: 'common', image: 'bg-zinc-900' },
      { id: 11, name: 'trader_fat.mdl', price: 15, rarity: 'common', image: 'bg-zinc-900' },
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

  return (
    <div className="w-full min-h-screen pt-safe-top pt-6 pb-24 px-4 bg-background flex flex-col font-sans text-sm animate-fade-in">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={handleBack}
            className="w-8 h-8 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div className="flex items-center gap-2 text-sm text-zinc-400">
             <span className="hover:text-white cursor-pointer" onClick={() => setPage(Page.SHOP)}>assets</span>
             <span>/</span>
             <span className={`hover:text-white cursor-pointer ${!selectedCategory ? 'text-white font-medium' : ''}`} onClick={() => setSelectedCategory(null)}>models</span>
             {selectedCategory && (
                <>
                   <span>/</span>
                   <span className="text-white font-medium">{selectedCategory}</span>
                </>
             )}
          </div>
        </div>

        {/* View Switcher */}
        {!selectedCategory ? (
          // --- CATALOG VIEW (FOLDERS) ---
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="cursor-card-bordered p-3 flex items-center gap-3 hover:bg-surface-hover group transition-all"
              >
                <Folder size={18} className="text-blue-400 fill-blue-400/20" />
                <div className="flex-1 text-left">
                   <div className="text-xs font-medium text-zinc-200 group-hover:text-white">{cat.name}</div>
                   <div className="text-[10px] text-zinc-500">{cat.count} items</div>
                </div>
                <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400" />
              </button>
            ))}
          </div>
        ) : (
          // --- DETAIL VIEW (FILES GRID) ---
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-slide-up">
            {currentSkins.map((skin) => (
              <div 
                key={skin.id}
                className="cursor-card-bordered p-2 flex flex-col group hover:border-zinc-600 transition-colors"
              >
                {/* Preview Placeholder */}
                <div className={`aspect-square w-full rounded ${skin.image} mb-2 relative overflow-hidden flex items-center justify-center bg-zinc-900`}>
                  <File size={24} className="text-zinc-700" />
                  
                  {isSubscribed && (
                     <div className="absolute top-1 right-1 text-yellow-500">
                        <Crown size={10} fill="currentColor" />
                     </div>
                  )}
                </div>
                
                <div className="mb-2">
                   <div className="text-xs font-medium text-zinc-300 truncate font-mono">{skin.name}</div>
                   <div className="flex items-center justify-between mt-1">
                      <span className={`text-[9px] px-1 rounded border ${
                         skin.rarity === 'legendary' ? 'border-yellow-500/30 text-yellow-500' :
                         skin.rarity === 'epic' ? 'border-purple-500/30 text-purple-500' :
                         skin.rarity === 'rare' ? 'border-blue-500/30 text-blue-500' :
                         'border-zinc-700 text-zinc-500'
                      }`}>
                         {skin.rarity}
                      </span>
                   </div>
                </div>

                {/* Action Button */}
                <button className={`w-full py-1.5 rounded text-[10px] font-medium transition-all mt-auto ${
                  isSubscribed
                    ? 'bg-zinc-800 text-white hover:bg-zinc-700'
                    : 'bg-white text-black hover:bg-zinc-200'
                }`}>
                  {isSubscribed ? (
                    'Установить'
                  ) : (
                    <>
                      Купить за {skin.price} SY
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
