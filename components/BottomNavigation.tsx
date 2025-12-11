import React from 'react';
import { ShoppingBag, MessageSquare, LifeBuoy } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 glass-panel pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => setPage(Page.SHOP)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 group ${
            currentPage === Page.SHOP ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {currentPage === Page.SHOP && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-fade-in"></div>
          )}
          <ShoppingBag size={20} strokeWidth={currentPage === Page.SHOP ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Магазин</span>
        </button>

        <button
          onClick={() => setPage(Page.TICKETS)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 group ${
            currentPage === Page.TICKETS ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {currentPage === Page.TICKETS && (
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-[1px] bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-fade-in"></div>
          )}
          <LifeBuoy size={20} strokeWidth={currentPage === Page.TICKETS ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Поддержка</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
