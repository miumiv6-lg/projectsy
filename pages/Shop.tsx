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
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-zinc-950">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowHistory(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-semibold text-white tracking-tight">История операций</h1>
          </div>
          
          <div className="space-y-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-green-400">
                  <Plus size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Пополнение счета</h3>
                  <span className="text-xs text-zinc-500">10.12.2025 • GM Donate</span>
                </div>
              </div>
              <span className="text-sm font-medium text-green-400">+500 SY</span>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-zinc-800 text-blue-400">
                  <ShoppingBag size={18} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white">Покупка SYSub</h3>
                  <span className="text-xs text-zinc-500">05.12.2025 • Подписка</span>
                </div>
              </div>
              <span className="text-sm font-medium text-white">-100 SY</span>
            </div>
            
            <div className="mt-6 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-center">
              <p className="text-xs text-zinc-400 mb-3">Возникли проблемы с оплатой?</p>
              <button 
                onClick={() => setPage?.(Page.TICKETS)}
                className="text-xs font-medium text-white bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
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
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-zinc-950">
        <div className="max-w-md mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowTopUp(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-semibold text-white tracking-tight">Пополнение счета</h1>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
            <div className="text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">Текущий баланс</div>
            <div className="text-3xl font-bold text-white tracking-tight">1,250 SY</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[100, 300, 500, 1000, 2500, 5000].map((amount) => (
              <button key={amount} className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800 rounded-2xl p-4 text-center transition-all group active:scale-95">
                <div className="text-lg font-bold text-white mb-1">{amount} SY</div>
                <div className="text-xs text-zinc-500 group-hover:text-zinc-400">{amount} ₽</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white text-black font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-zinc-200 active:scale-95 transition-all">
              <CreditCard size={18} strokeWidth={1.5} />
              <span>Оплатить картой</span>
            </button>
            <button className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-500 active:scale-95 transition-all">
              <div className="w-4 h-4 bg-white rounded flex items-center justify-center text-[10px] font-bold text-blue-600">G</div>
              <span>GM Donate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN SHOP VIEW ---
  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 bg-zinc-950">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Магазин</h1>
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 pl-3 pr-1.5 py-1.5 rounded-full border border-zinc-800 flex items-center gap-3">
              <span className="text-sm font-semibold text-white">1,250 SY</span>
              <button 
                onClick={() => setShowTopUp(true)}
                className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-black hover:bg-zinc-200 transition-colors"
              >
                <Plus size={14} strokeWidth={3} />
              </button>
            </div>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            >
              <History size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Featured Card (SYSub) */}
        <div 
          onClick={() => setPage?.(Page.SUBSCRIPTION)}
          className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 p-6 mb-6 cursor-pointer active:scale-[0.98] transition-all group"
        >
          {/* Subtle gradient accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-8">
              <div className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide inline-flex items-center gap-1.5">
                <Star size={10} fill="currentColor" />
                Рекомендуем
              </div>
              <div className="text-zinc-500 group-hover:translate-x-1 transition-transform">
                <ChevronRight size={20} strokeWidth={1.5} />
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-2">SYSub Premium</h3>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[80%]">
                Откройте доступ к эксклюзивному контенту и скидкам.
              </p>
            </div>
          </div>
        </div>

        {/* Skins Link */}
        <div 
          onClick={() => setPage?.(Page.SKINS)}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 mb-8 cursor-pointer active:scale-[0.98] transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <Box size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Коллекция скинов</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Осмотр моделей и покупка</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
        </div>

        {/* Daily Case Section */}
        <div>
          <div className="flex items-center gap-2 mb-4 px-1">
            <h3 className="font-semibold text-white text-sm tracking-wide uppercase text-zinc-500">Ежедневный бонус</h3>
          </div>
          
          <div 
            onClick={handleOpenCase}
            className={`relative overflow-hidden rounded-3xl border p-1 transition-all active:scale-[0.98] ${
              dailyCaseClaimed 
                ? 'bg-zinc-900 border-zinc-800 opacity-60 cursor-not-allowed' 
                : 'bg-zinc-900 border-zinc-800 cursor-pointer hover:border-zinc-700'
            }`}
          >
            <div className={`rounded-[20px] p-5 flex items-center gap-5 ${
               dailyCaseClaimed ? 'bg-zinc-900' : 'bg-gradient-to-br from-zinc-800 to-zinc-900'
            }`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm ${
                dailyCaseClaimed ? 'bg-zinc-800 text-zinc-600' : 'bg-white text-black'
              }`}>
                <Gift size={24} strokeWidth={1.5} />
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-bold text-base ${dailyCaseClaimed ? 'text-zinc-500' : 'text-white'}`}>
                    Ежедневный кейс
                  </h3>
                  {!dailyCaseClaimed && (
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  {dailyCaseClaimed 
                    ? 'Доступно завтра' 
                    : 'Откройте бесплатно'}
                </p>
              </div>

              {dailyCaseClaimed ? (
                <Lock size={20} className="text-zinc-600" strokeWidth={1.5} />
              ) : (
                <div className="bg-white/10 p-2 rounded-full text-white">
                   <ChevronRight size={18} strokeWidth={1.5} />
                </div>
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
