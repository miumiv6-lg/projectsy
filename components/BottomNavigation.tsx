import React from 'react';
import { ShoppingBag, MessageSquare, LifeBuoy, User } from 'lucide-react';
import { Page } from '../types';

interface BottomNavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPage, setPage }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-background)] pb-safe z-50">
      <div className="flex items-center h-10 px-2 text-[11px] font-medium text-muted-foreground">
        
        {/* IDE Status Bar Style Items */}
        <button
          onClick={() => setPage(Page.SHOP)}
          className={`flex items-center gap-1.5 px-3 h-full hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors ${
            currentPage === Page.SHOP ? 'bg-[var(--color-accent)] text-white' : ''
          }`}
        >
          <ShoppingBag size={13} />
          <span>Marketplace</span>
        </button>

        <button
          onClick={() => setPage(Page.TICKETS)}
          className={`flex items-center gap-1.5 px-3 h-full hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors ${
            currentPage === Page.TICKETS ? 'bg-[var(--color-accent)] text-white' : ''
          }`}
        >
          <LifeBuoy size={13} />
          <span>AI Chat</span>
        </button>

        <button
          onClick={() => setPage(Page.PROFILE)}
          className={`flex items-center gap-1.5 px-3 h-full hover:bg-[var(--color-surface-hover)] hover:text-white transition-colors ${
            currentPage === Page.PROFILE ? 'bg-[var(--color-accent)] text-white' : ''
          }`}
        >
          <User size={13} />
          <span>User</span>
        </button>

        <div className="flex-grow" />

        <div className="px-3 flex items-center gap-2 text-[10px] text-zinc-600 font-mono">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"/> Online</span>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;
