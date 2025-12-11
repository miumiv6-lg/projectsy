import React from 'react';
import { ShoppingBag, MessageSquare, LifeBuoy } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0f1115]/95 backdrop-blur-md border-t border-[#2d313a] pb-safe pt-1 px-6 z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => setPage(Page.SHOP)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all group ${
            currentPage === Page.SHOP ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {currentPage === Page.SHOP && (
            <span className="absolute -top-1 w-12 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          )}
          <ShoppingBag size={22} strokeWidth={currentPage === Page.SHOP ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Магазин</span>
        </button>

        <button
          onClick={() => setPage(Page.TICKETS)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all group ${
            currentPage === Page.TICKETS ? 'text-blue-500' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          {currentPage === Page.TICKETS && (
            <span className="absolute -top-1 w-12 h-0.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
          )}
          <LifeBuoy size={22} strokeWidth={currentPage === Page.TICKETS ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wider">Поддержка</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
