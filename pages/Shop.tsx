import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ChevronRight, Plus, History, CreditCard, Box, Gift, Lock, ArrowUpRight } from 'lucide-react';
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
      <div className="w-full min-h-screen pt-safe-top pt-4 pb-24 px-4 bg-background animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <button 
              onClick={() => setShowHistory(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-zinc-400 hover:text-white hover:border-border-hover transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-lg font-semibold text-white tracking-tight">История операций</h1>
          </div>
          
          <div className="space-y-2">
            <div className="cursor-card p-4 rounded-xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-white/70 group-hover:text-white transition-colors">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Пополнение</h3>
                  <span className="text-xs text-zinc-500">10.12.2025 • GM Donate</span>
                </div>
              </div>
              <span className="text-sm font-medium text-white">+500 SY</span>
            </div>
            
            <div className="cursor-card p-4 rounded-xl flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-white/5 text-white/70 group-hover:text-white transition-colors">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">SYSub Premium</h3>
                  <span className="text-xs text-zinc-500">05.12.2025 • Подписка</span>
                </div>
              </div>
              <span className="text-sm font-medium text-zinc-400">-100 SY</span>
            </div>
            
            <div className="mt-8 p-4 rounded-xl border border-dashed border-border text-center">
              <p className="text-xs text-zinc-500 mb-3">Не нашли транзакцию?</p>
              <button 
                onClick={() => setPage?.(Page.TICKETS)}
                className="text-xs font-medium text-white bg-white/5 border border-border px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
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
      <div className="w-full min-h-screen pt-safe-top pt-4 pb-24 px-4 bg-background animate-fade-in">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowTopUp(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-zinc-400 hover:text-white hover:border-border-hover transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-lg font-semibold text-white tracking-tight">Пополнение</h1>
          </div>

          <div className="cursor-card rounded-xl p-6 mb-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-5">
                <CreditCard size={64} className="text-white" />
             </div>
            <div className="text-xs text-zinc-500 mb-2 font-medium tracking-wide uppercase">Баланс</div>
            <div className="text-4xl font-light text-white tracking-tighter">1,250 <span className="text-zinc-600 text-2xl">SY</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[100, 300, 500, 1000, 2500, 5000].map((amount) => (
              <button key={amount} className="cursor-card p-4 text-center rounded-xl active:scale-[0.98]">
                <div className="text-lg font-semibold text-white mb-1">{amount} SY</div>
                <div className="text-xs text-zinc-500">{amount} ₽</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button className="w-full cursor-button py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
              <CreditCard size={16} />
              <span>Банковская карта</span>
            </button>
            <button className="w-full cursor-button-secondary py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold">
              <span className="font-bold text-[10px] bg-white text-black px-1 rounded-sm">G</span>
              <span>GM Donate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN SHOP VIEW ---
  return (
    <div className="w-full min-h-screen pt-safe-top pt-6 pb-24 px-4 bg-background animate-fade-in">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-white tracking-tight">Магазин</h1>
          <div className="flex items-center gap-3">
            <div className="cursor-card px-3 py-1.5 rounded-lg flex items-center gap-3">
              <span className="text-sm font-semibold text-white tracking-tight">1,250 SY</span>
              <button 
                onClick={() => setShowTopUp(true)}
                className="w-5 h-5 rounded flex items-center justify-center bg-[var(--color-accent)] text-white hover:opacity-90 transition-opacity"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-zinc-400 hover:text-white hover:border-border-hover transition-colors"
            >
              <History size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Featured Card (SYSub) */}
        <div 
          onClick={() => setPage?.(Page.SUBSCRIPTION)}
          className="cursor-card relative overflow-hidden rounded-2xl p-6 mb-6 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-semibold border border-border bg-white/5 text-white">
              <Star size={12} />
              <span>Подписка</span>
            </div>
            <ArrowUpRight size={18} className="text-zinc-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">SYSub Premium</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Эксклюзивный контент, ранний доступ и специальные предложения.
          </p>
        </div>

        {/* Skins Link */}
        <div 
          onClick={() => setPage?.(Page.SKINS)}
          className="cursor-card p-5 mb-6 rounded-2xl flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-zinc-300 border border-border bg-[var(--color-surface-hover)]">
              <Box size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Каталог скинов</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Осмотр моделей и покупка</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-zinc-500" />
        </div>

        {/* Daily Case Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className="font-medium text-zinc-600 text-xs tracking-widest uppercase">Бонусы</h3>
          </div>
          
          <div 
            onClick={handleOpenCase}
            className={`cursor-card rounded-2xl p-1 group ${dailyCaseClaimed ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:border-border-hover'}`}
          >
            <div className="rounded-xl p-4 flex items-center gap-4 bg-[var(--color-surface-hover)]">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center border transition-colors ${
                dailyCaseClaimed ? 'bg-[var(--color-surface)] border-border text-zinc-500' : 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
              }`}>
                <Gift size={20} strokeWidth={1.5} />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-semibold text-sm text-white">
                    Ежедневный кейс
                  </h3>
                  {!dailyCaseClaimed && (
                    <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full"></span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 font-light">
                  {dailyCaseClaimed 
                    ? 'Доступно через 24ч' 
                    : 'Бесплатное открытие'}
                </p>
              </div>

              {dailyCaseClaimed ? (
                <Lock size={16} className="text-zinc-600" />
              ) : (
                <ChevronRight size={16} className="text-zinc-500" />
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
