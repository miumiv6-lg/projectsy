import React from 'react';
import { ShoppingBag, MessageSquare } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#181a20] border-t border-[#2d313a] pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center h-16">
        <button
          onClick={() => setPage(Page.SHOP)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPage === Page.SHOP ? 'text-white' : 'text-gray-500'
          }`}
        >
          <ShoppingBag size={24} strokeWidth={currentPage === Page.SHOP ? 2.5 : 2} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Магазин</span>
        </button>

        <button
          onClick={() => setPage(Page.TICKETS)}
          className={`flex flex-col items-center gap-1 transition-colors ${
            currentPage === Page.TICKETS ? 'text-white' : 'text-gray-500'
          }`}
        >
          <MessageSquare size={24} strokeWidth={currentPage === Page.TICKETS ? 2.5 : 2} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Жалобы</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
