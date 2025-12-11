import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ChevronRight, Plus, History, CreditCard, Box, Gift, Lock } from 'lucide-react';
import CaseOpeningModal from '../components/CaseOpeningModal';
import { sessionState } from '../utils/sessionState';

interface ShopProps {
  setPage?: (page: Page) => void;
}

const Shop: React.FC<ShopProps> = ({ setPage }) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [dailyCaseClaimed, setDailyCaseClaimed] = useState(sessionState.dailyCaseClaimed);

  const handleOpenCase = () => {
    if (dailyCaseClaimed) return;
    setIsCaseModalOpen(true);
  };

  const handleCaseClosed = () => {
    setIsCaseModalOpen(false);
    setDailyCaseClaimed(true);
    sessionState.dailyCaseClaimed = true;
  };

  // --- HISTORY VIEW ---
  if (showHistory) {
    return (
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-black">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowHistory(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-medium text-white tracking-tight">История операций</h1>
          </div>
          
          <div className="space-y-2">
            <div className="cursor-card p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-green-500/10 text-green-400">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Пополнение счета</h3>
                  <span className="text-xs text-white/40">10.12.2025 • GM Donate</span>
                </div>
              </div>
              <span className="text-sm font-medium text-green-400">+500 SY</span>
            </div>
            
            <div className="cursor-card p-4 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Покупка SYSub</h3>
                  <span className="text-xs text-white/40">05.12.2025 • Подписка</span>
                </div>
              </div>
              <span className="text-sm font-medium text-white">-100 SY</span>
            </div>
            
            <div className="mt-6 p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-center">
              <p className="text-xs text-blue-400 mb-3">Возникли проблемы с оплатой?</p>
              <button 
                onClick={() => setPage?.(Page.TICKETS)}
                className="text-xs font-medium text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Написать в поддержку
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- TOP UP VIEW ---
  if (showTopUp) {
    return (
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-black">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowTopUp(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-medium text-white tracking-tight">Пополнение счета</h1>
          </div>

          <div className="cursor-card rounded-xl p-6 mb-6">
            <div className="text-xs text-white/50 mb-1 font-medium tracking-wide">Текущий баланс</div>
            <div className="text-3xl font-light text-white tracking-tight font-mono">1,250 SY</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[100, 300, 500, 1000, 2500, 5000].map((amount) => (
              <button key={amount} className="cursor-card p-4 text-center rounded-xl hover:bg-white/5 active:scale-[0.98]">
                <div className="text-lg font-medium text-white mb-1">{amount} SY</div>
                <div className="text-xs text-white/40">{amount} ₽</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button className="w-full cursor-button py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
              <CreditCard size={16} />
              <span>Оплатить картой</span>
            </button>
            <button className="w-full cursor-button-secondary py-3.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-[10px] font-bold text-black">G</div>
              <span>GM Donate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN SHOP VIEW ---
  return (
    <div className="w-full min-h-screen pt-8 pb-24 px-6 bg-black">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-white tracking-tight">Магазин</h1>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 px-3 py-1.5 rounded-md border border-white/10 flex items-center gap-3 backdrop-blur-md">
              <span className="text-sm font-mono text-white">1,250 SY</span>
              <button 
                onClick={() => setShowTopUp(true)}
                className="w-5 h-5 bg-white text-black rounded flex items-center justify-center hover:bg-white/90 transition-colors"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
            >
              <History size={16} />
            </button>
          </div>
        </div>

        {/* Featured Card (SYSub) */}
        <div 
          onClick={() => setPage?.(Page.SUBSCRIPTION)}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-6 mb-6 cursor-pointer group transition-all hover:border-white/20"
        >
          {/* Subtle Glow */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/30 transition-all duration-500"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase inline-flex items-center gap-1.5">
                <Star size={10} fill="currentColor" />
                Featured
              </div>
              <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-white mb-2">SYSub Premium</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Unlock exclusive content and daily rewards.
              </p>
            </div>
          </div>
        </div>

        {/* Skins Link */}
        <div 
          onClick={() => setPage?.(Page.SKINS)}
          className="cursor-card p-5 mb-6 rounded-xl flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-white/70 group-hover:text-white transition-colors border border-white/5">
              <Box size={18} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Коллекция скинов</h3>
              <p className="text-xs text-white/40 mt-0.5">Browse catalog</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
        </div>

        {/* Daily Case Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className="font-medium text-white/50 text-xs tracking-wider uppercase">Daily Reward</h3>
          </div>
          
          <div 
            onClick={handleOpenCase}
            className={`cursor-card rounded-xl p-1 group ${dailyCaseClaimed ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-white/20'}`}
          >
            <div className="rounded-lg p-4 flex items-center gap-4 bg-black/40">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                dailyCaseClaimed ? 'bg-white/5 border-white/5 text-white/30' : 'bg-white text-black border-white'
              }`}>
                <Gift size={20} strokeWidth={1.5} />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-medium text-sm text-white">
                    Ежедневный кейс
                  </h3>
                  {!dailyCaseClaimed && (
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                  )}
                </div>
                <p className="text-xs text-white/40 font-light">
                  {dailyCaseClaimed 
                    ? 'Available tomorrow' 
                    : 'Open for free'}
                </p>
              </div>

              {dailyCaseClaimed ? (
                <Lock size={16} className="text-white/30" />
              ) : (
                <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Case Opening Modal */}
      <CaseOpeningModal 
        isOpen={isCaseModalOpen} 
        onClose={handleCaseClosed} 
      />
    </div>
  );
};

export default Shop;
