import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ArrowRight, Zap, Shield, Gift, Search, Filter } from 'lucide-react';

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
    { id: 1, name: 'SYSub', price: 150, type: 'Premium', desc: 'Подписка с расширенными возможностями. 3 уровня на выбор.', image: null, tag: 'ХИТ' },
    { id: 2, name: '81-717 "Номерной"', price: 500, type: 'Trains', desc: 'Легендарный советский поезд. Классическая синяя ливрея.', image: null, tag: 'НОВИНКА' },
    { id: 3, name: 'Форма машиниста', price: 50, type: 'Skins', desc: 'Стандартная форма работника метрополитена.', image: null, tag: 'СКИН' },
    // { id: 4, name: 'Коллекция FNAF', price: 300, type: 'Bundles', desc: 'Лимитированный набор скинов аниматроников.', image: '/images/fnaf/freddy.webp', tag: 'EVENT' },
    { id: 5, name: '81-740 "Русич"', price: 750, type: 'Trains', desc: 'Современный поезд с сочлененными вагонами.', image: null, tag: 'ПОЕЗД' },
    { id: 6, name: 'VIP Статус', price: 1000, type: 'Premium', desc: 'Пожизненный VIP статус с уникальным цветом ника.', image: null, tag: 'VIP' },
  ];

  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.type === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Магазин</h1>
              <p className="text-gray-400 text-sm">Лучшие товары для вашего метро</p>
            </div>
            <div className="w-10 h-10 bg-[#181a20] rounded-full flex items-center justify-center border border-[#2d313a]">
              <ShoppingBag size={20} className="text-white" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Поиск товаров..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181a20] border border-[#2d313a] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-white text-black shadow-lg shadow-white/10' 
                    : 'bg-[#181a20] text-gray-400 border border-[#2d313a] hover:border-gray-600'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Banners */}
        {activeCategory === 'All' && !searchQuery && (
          <div className="grid gap-4 mb-8">
            {/* Subscription Banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-900/40 to-[#0f1115] border border-blue-500/20 p-5">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Star size={100} className="text-blue-400" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Рекомендуем</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">SYSub</h3>
                <p className="text-gray-400 text-xs mb-4 max-w-[70%]">
                  Три уровня подписки под любой стиль игры. Выберите свой максимум.
                </p>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setPage?.(Page.SUBSCRIPTION)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                  >
                    Подробнее
                  </button>
                  <span className="text-white font-mono font-bold">от 150 SY</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-3">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="bg-[#181a20] rounded-xl overflow-hidden border border-[#2d313a] group hover:border-gray-600 transition-all cursor-pointer flex flex-col"
            >
              <div className="aspect-square bg-[#22252b] relative flex items-center justify-center overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <Package size={40} className="text-[#2d313a] group-hover:text-gray-600 transition-colors" />
                )}
                
                {item.tag && (
                  <div className="absolute top-2 left-2">
                    <span className={`text-[9px] font-bold px-2 py-1 rounded backdrop-blur-md border ${
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
              
              <div className="p-3 flex flex-col flex-grow">
                <div className="mb-1">
                  <h3 className="text-white font-bold text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
                
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-white font-mono font-bold text-sm">{item.price} SY</span>
                  <button className="w-8 h-8 rounded-lg bg-[#2d313a] flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                    <ShoppingBag size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-[#181a20] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-600" />
            </div>
            <h3 className="text-white font-bold mb-1">Ничего не найдено</h3>
            <p className="text-gray-500 text-xs">Попробуйте изменить параметры поиска</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Shop;
