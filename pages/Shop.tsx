import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ArrowRight, Zap, Shield, Gift, Search, Filter, ChevronRight } from 'lucide-react';

interface ShopProps {
  setPage?: (page: Page) => void;
}

const Shop: React.FC<ShopProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'All', label: 'Все' },
    { id: 'Trains', label: 'Поезда' },
    { id: 'Skins', label: 'Скины' },
    { id: 'Bundles', label: 'Наборы' },
    { id: 'Premium', label: 'Премиум' },
  ];
  
  const items = [
    { id: 1, name: 'SYSub', price: 150, type: 'Premium', desc: 'Подписка с расширенными возможностями.', image: null, tag: 'ХИТ' },
    { id: 2, name: '81-717 "Номерной"', price: 500, type: 'Trains', desc: 'Легендарный советский поезд.', image: null, tag: 'НОВИНКА' },
    { id: 3, name: 'Форма машиниста', price: 50, type: 'Skins', desc: 'Стандартная форма работника.', image: null, tag: 'СКИН' },
    // { id: 4, name: 'Коллекция FNAF', price: 300, type: 'Bundles', desc: 'Лимитированный набор скинов аниматроников.', image: '/images/fnaf/freddy.webp', tag: 'EVENT' },
    { id: 5, name: '81-740 "Русич"', price: 750, type: 'Trains', desc: 'Современный поезд с сочлененными вагонами.', image: null, tag: 'ПОЕЗД' },
    { id: 6, name: 'VIP Статус', price: 1000, type: 'Premium', desc: 'Пожизненный VIP статус.', image: null, tag: 'VIP' },
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Магазин</h1>
          <div className="flex items-center gap-3">
            <div className="bg-[#181a20] px-3 py-1.5 rounded-full border border-[#2d313a] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-white">1250 SY</span>
            </div>
            <button className="w-9 h-9 bg-[#181a20] rounded-full flex items-center justify-center border border-[#2d313a] text-white hover:bg-[#22252b] transition-colors">
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="sticky top-0 z-30 bg-[#0f1115]/95 backdrop-blur-sm py-2 -mx-4 px-4 mb-4 border-b border-[#2d313a]/50">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Поиск..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181a20] border border-[#2d313a] rounded-lg py-2.5 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-white text-black' 
                    : 'bg-[#181a20] text-gray-400 border border-[#2d313a]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banner (Compact) */}
        {activeCategory === 'All' && !searchQuery && (
          <div 
            onClick={() => setPage?.(Page.SUBSCRIPTION)}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/20 to-[#181a20] border border-blue-500/20 p-4 mb-6 cursor-pointer group"
          >
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-blue-600/10 to-transparent"></div>
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="text-blue-400 fill-blue-400" />
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Рекомендуем</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">SYSub Premium</h3>
                <p className="text-gray-400 text-[10px] max-w-[200px]">
                  Новые возможности для вашей игры.
                </p>
              </div>
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        )}

        {/* Compact Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-[#181a20] rounded-xl overflow-hidden border border-[#2d313a] group active:scale-[0.98] transition-all cursor-pointer relative"
            >
              {/* Image Area */}
              <div className="aspect-[4/3] bg-[#22252b] relative flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Package size={32} className="text-[#2d313a] group-hover:text-gray-600 transition-colors" />
                )}
                
                {/* Price Tag Overlay */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white font-mono text-xs font-bold border border-white/10">
                  {item.price} SY
                </div>

                {/* Tag Overlay */}
                {item.tag && (
                  <div className="absolute top-2 left-2">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md border ${
                      item.tag === 'ХИТ' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      item.tag === 'EVENT' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      item.tag === 'VIP' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                      'bg-black/40 text-white border-white/10'
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Info Area */}
              <div className="p-3">
                <h3 className="text-white font-bold text-xs mb-1 truncate">{item.name}</h3>
                <p className="text-[10px] text-gray-500 line-clamp-2 leading-tight">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Search size={24} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-xs">Ничего не найдено</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
