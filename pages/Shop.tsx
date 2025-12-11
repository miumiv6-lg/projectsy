import React from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ChevronRight } from 'lucide-react';

interface ShopProps {
  setPage?: (page: Page) => void;
}

const Shop: React.FC<ShopProps> = ({ setPage }) => {
  // Removed filters and search state as requested
  
  // Only SYSub remains, but it's displayed in the banner.
  // The grid items list is empty as requested ("remove list of items... except subscription").
  // Since subscription is in the banner, the items list is effectively empty for the grid.
  const items: any[] = []; 

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
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

        {/* Featured Banner (SYSub) */}
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
              <h3 className="text-lg font-bold text-white mb-1">SYSub</h3>
              <p className="text-gray-400 text-sm max-w-[200px]">
                Новые возможности для вашей игры.
              </p>
            </div>
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-500 transition-colors">
              <ChevronRight size={20} />
            </div>
          </div>
        </div>

        {/* Empty State Message */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-[#181a20] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2d313a]">
            <Package size={24} className="text-gray-600" />
          </div>
          <h3 className="text-white font-bold mb-1">Товаров пока нет</h3>
          <p className="text-gray-500 text-xs">Загляните позже, мы готовим что-то интересное</p>
        </div>

      </div>
    </div>
  );
};

export default Shop;
