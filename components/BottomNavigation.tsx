import React from 'react';
import { ShoppingBag, MessageSquare, LifeBuoy, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flat-panel pb-safe pt-2 px-6 z-50 bg-background">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        <button
          onClick={() => setPage(Page.SHOP)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors duration-200 group ${
            currentPage === Page.SHOP ? 'text-primary' : 'text-muted hover:text-primary'
          }`}
        >
          <ShoppingBag size={22} strokeWidth={currentPage === Page.SHOP ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Магазин</span>
        </button>

        <button
          onClick={() => setPage(Page.TICKETS)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors duration-200 group ${
            currentPage === Page.TICKETS ? 'text-primary' : 'text-muted hover:text-primary'
          }`}
        >
          <LifeBuoy size={22} strokeWidth={currentPage === Page.TICKETS ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Поддержка</span>
        </button>

        <button
          onClick={() => setPage(Page.PROFILE)}
          className={`relative flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors duration-200 group ${
            currentPage === Page.PROFILE ? 'text-primary' : 'text-muted hover:text-primary'
          }`}
        >
          <User size={22} strokeWidth={currentPage === Page.PROFILE ? 2 : 1.5} />
          <span className="text-[10px] font-medium tracking-wide">Профиль</span>
        </button>
      </div>
    </div>
  );
};

export default BottomNavigation;
