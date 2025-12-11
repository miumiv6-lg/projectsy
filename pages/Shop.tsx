import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ArrowRight } from 'lucide-react';

interface ShopProps {
  setPage?: (page: Page) => void;
}

const Shop: React.FC<ShopProps> = ({ setPage }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'Все' },
    { id: 'Trains', label: 'Поезда' },
    { id: 'Skins', label: 'Скины' },
    { id: 'Bundles', label: 'Наборы' },
  ];
  
  const items = [
    { id: 1, name: 'SYSub Plus', price: 150, type: 'Premium', desc: 'Месячная подписка с расширенными лимитами спавна.', image: null, tag: 'Подписка' },
    { id: 2, name: '81-717 "Номерной"', price: 500, type: 'Trains', desc: 'Легендарный советский поезд. Классическая синяя ливрея.', image: null, tag: 'Поезд' },
    { id: 3, name: 'Форма машиниста', price: 50, type: 'Skins', desc: 'Стандартная форма работника метрополитена.', image: null, tag: 'Скин' },
    { id: 4, name: 'FNAF Collection', price: 300, type: 'Bundles', desc: 'Лимитированный набор скинов аниматроников.', image: '/images/fnaf/freddy.webp', tag: 'Коллаборация' },
  ];

  const filteredItems = activeCategory === 'All' 
    ? items 
    : items.filter(item => item.type === activeCategory);

  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 animate-fade-in">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Магазин</h1>
            <p className="text-gray-400 text-sm">Внутриигровые товары и услуги</p>
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
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

        {/* Wide banner with subscription + FNAF collab */}
        <div className="metro-card static-card rounded-lg p-4 mb-6 overflow-hidden">
          <div className="flex flex-col gap-6">
            {/* Subscription */}
            <div className="bg-[#0f1115] border border-[#2d313a] rounded-lg p-4">
              <div className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">Подписка</div>
              <h3 className="text-xl font-bold text-white mb-2">SYSub Plus</h3>
              <p className="text-gray-400 text-xs mb-4">
                Увеличенные лимиты спавна, приоритетные слоты и бонусные SY каждый месяц.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-white font-mono text-lg font-bold">150 SY</span>
                <button 
                  className="metro-button-outline text-xs py-2 px-3"
                  onClick={() => setPage?.(Page.SUBSCRIPTION)}
                >
                  Подробнее
                </button>
              </div>
            </div>

            {/* FNAF Collab */}
            <div className="relative overflow-hidden rounded-lg border border-[#2d313a] bg-[#000] group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-transparent to-transparent z-10" />
              
              {/* Static Noise Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none z-20" 
                   style={{ backgroundImage: 'url(https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif)', backgroundSize: 'cover' }}></div>
              
              <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                <img src="https://i.ibb.co/7hdnthf/generated-image-2.jpg" alt="FNAF" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
              </div>
              
              <div className="relative p-4 flex flex-col gap-2 z-30">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-red-500 font-bold">Security Breach</div>
                </div>
                
                <h3 className="text-2xl font-bold text-white font-fnaf-mono tracking-widest" style={{ textShadow: '2px 2px 0px #ff0000' }}>
                  FNAF Collection
                </h3>
                
                <p className="text-gray-400 text-xs font-mono border-l-2 border-red-900 pl-3">
                  Лимитированный набор скинов.
                </p>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-red-500 font-mono text-lg font-bold tracking-widest">300 SY</span>
                  <button 
                    className="bg-red-900/20 hover:bg-red-900/40 border border-red-900/50 text-red-500 px-3 py-2 text-xs uppercase tracking-widest transition-all"
                    onClick={() => {
                      const audio = new Audio('/sounds/fnaf_btn_click.mp3');
                      audio.volume = 0.5;
                      audio.play().catch(e => console.error("Audio play failed", e));
                      setPage?.(Page.FNAF);
                    }}
                  >
                    Терминал
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="metro-card rounded-lg overflow-hidden group cursor-pointer flex flex-col h-full"
            >
              <div className="aspect-square bg-[#22252b] relative flex items-center justify-center border-b border-[#2d313a]">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Package size={32} className="text-[#2d313a]" />
                )}
                {item.tag && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-[#0f1115]/90 backdrop-blur-sm text-gray-200 text-[9px] font-semibold px-1.5 py-0.5 rounded border border-[#2d313a]">
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-3 flex-grow flex flex-col">
                <h3 className="text-white font-bold text-sm mb-1 leading-tight">{item.name}</h3>
                <p className="text-[10px] text-gray-400 mb-3 flex-grow leading-relaxed line-clamp-2">{item.desc}</p>
                
                <div className="flex items-center justify-between pt-2 border-t border-[#2d313a]">
                  <span className="text-white font-mono font-bold text-sm">{item.price} SY</span>
                  <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider">
                    Купить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Shop;
