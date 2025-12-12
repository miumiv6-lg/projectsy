import React, { useState } from 'react';
import { Page } from '../types';
import { ShoppingBag, Search, Plus, History, CreditCard, Gift, ChevronRight, Command, Download, Check, Star, Filter } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenCase = () => {
    if (dailyCaseClaimed) return;
    setIsCaseModalOpen(true);
  };

  const handleCaseClosed = () => {
    setIsCaseModalOpen(false);
    setDailyCaseClaimed(true);
    sessionState.dailyCaseClaimed = true;
  };

  // --- HISTORY VIEW (Output Log Style) ---
  if (showHistory) {
    return (
      <div className="w-full min-h-screen bg-background pt-safe-top font-mono text-sm">
        <div className="border-b border-border p-3 flex items-center gap-3 bg-surface/50 sticky top-0 backdrop-blur-sm z-10">
           <button onClick={() => setShowHistory(false)} className="text-muted hover:text-white transition-colors">
              <ChevronRight size={16} className="rotate-180" />
           </button>
           <span className="text-xs font-medium text-white">ВЫВОД</span>
           <span className="text-xs text-muted">Журнал операций</span>
        </div>
        
        <div className="p-4 space-y-1">
          <div className="flex gap-3 text-[10px] opacity-50 mb-4 border-b border-border/50 pb-2">
            <div className="w-16">ВРЕМЯ</div>
            <div className="w-20">ТИП</div>
            <div className="flex-1">ОПИСАНИЕ</div>
            <div>СУММА</div>
          </div>

          <div className="flex gap-3 text-xs group hover:bg-surface-hover p-1 -mx-1 rounded cursor-default">
            <div className="w-16 text-zinc-500">10:42</div>
            <div className="w-20 text-green-400">DEPOSIT</div>
            <div className="flex-1 text-zinc-300">Пополнение (GM Donate)</div>
            <div className="text-white">+500 SY</div>
          </div>
          
          <div className="flex gap-3 text-xs group hover:bg-surface-hover p-1 -mx-1 rounded cursor-default">
            <div className="w-16 text-zinc-500">09:15</div>
            <div className="w-20 text-blue-400">PURCHASE</div>
            <div className="flex-1 text-zinc-300">SYSub Premium (Месяц)</div>
            <div className="text-muted">-100 SY</div>
          </div>
          
          <div className="mt-8 pt-4 border-t border-border text-xs text-zinc-500 font-sans">
             &gt; Транзакция не найдена? <button onClick={() => setPage?.(Page.TICKETS)} className="text-accent hover:underline">Создать тикет</button>
          </div>
        </div>
      </div>
    );
  }

  // --- TOP UP VIEW (Config Form Style) ---
  if (showTopUp) {
    return (
      <div className="w-full min-h-screen bg-background pt-safe-top pb-12">
        <div className="border-b border-border p-3 flex items-center gap-3 bg-surface/50 sticky top-0 z-10">
           <button onClick={() => setShowTopUp(false)} className="text-muted hover:text-white transition-colors">
              <ChevronRight size={16} className="rotate-180" />
           </button>
           <span className="text-xs font-medium text-white">КОНФИГУРАЦИЯ БАЛАНСА</span>
        </div>

        <div className="p-4 max-w-2xl mx-auto">
          <div className="cursor-card-bordered p-4 mb-6">
            <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Текущий баланс</div>
            <div className="text-3xl font-light text-white tracking-tight">1,250 <span className="text-zinc-600 text-lg">SY</span></div>
          </div>

          <h3 className="text-xs font-medium text-zinc-400 uppercase mb-3 pl-1">Выберите сумму</h3>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[100, 300, 500, 1000, 2500, 5000].map((amount) => (
              <button key={amount} className="cursor-card-bordered p-3 text-center hover:border-zinc-600 active:bg-zinc-800 transition-colors">
                <div className="text-sm font-medium text-white">{amount}</div>
                <div className="text-[10px] text-zinc-500">{amount} ₽</div>
              </button>
            ))}
          </div>

          <h3 className="text-xs font-medium text-zinc-400 uppercase mb-3 pl-1">Способ оплаты</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-between p-3 cursor-card-bordered hover:bg-surface-hover group">
              <div className="flex items-center gap-3">
                 <CreditCard size={16} className="text-zinc-400 group-hover:text-white" />
                 <span className="text-sm text-zinc-300 group-hover:text-white">Банковская карта</span>
              </div>
              <div className="w-3 h-3 rounded-full border border-zinc-600 group-hover:border-accent"></div>
            </button>
             <button className="w-full flex items-center justify-between p-3 cursor-card-bordered hover:bg-surface-hover group">
              <div className="flex items-center gap-3">
                 <span className="font-bold text-[10px] bg-zinc-200 text-black px-1 rounded-sm">G</span>
                 <span className="text-sm text-zinc-300 group-hover:text-white">GM Donate</span>
              </div>
              <div className="w-3 h-3 rounded-full border border-zinc-600 group-hover:border-accent"></div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN SHOP VIEW (Marketplace) ---
  return (
    <div className="w-full min-h-screen bg-background pt-safe-top pb-12 flex flex-col">
      
      {/* Marketplace Header */}
      <div className="sticky top-0 bg-background z-20 border-b border-border">
         <div className="p-3">
            <div className="relative group">
               <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
               <input 
                 type="text" 
                 placeholder="Поиск расширений..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="cursor-input w-full pl-9 pr-12 py-2 text-sm"
               />
               <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="px-1.5 py-0.5 rounded border border-border bg-surface text-[10px] text-zinc-500 font-mono hidden sm:block">⌘K</div>
                  <Filter size={14} className="text-zinc-500 sm:hidden" />
               </div>
            </div>
         </div>
         <div className="flex px-3 gap-4 overflow-x-auto no-scrollbar border-b border-transparent">
            <button className="text-[11px] font-medium text-white border-b border-accent pb-2 whitespace-nowrap">Рекомендуемые</button>
            <button className="text-[11px] font-medium text-muted hover:text-zinc-300 pb-2 transition-colors whitespace-nowrap">Популярные</button>
            <button className="text-[11px] font-medium text-muted hover:text-zinc-300 pb-2 transition-colors whitespace-nowrap">Новые</button>
            <button className="text-[11px] font-medium text-muted hover:text-zinc-300 pb-2 transition-colors whitespace-nowrap">Установленные</button>
         </div>
      </div>

      <div className="p-2 space-y-0.5">
        
        {/* Balance Row */}
        <div className="flex items-center justify-between p-3 rounded hover:bg-surface-hover transition-colors mb-2">
            <div className="flex flex-col">
               <span className="text-[10px] text-muted uppercase font-bold tracking-wider">БАЛАНС</span>
               <span className="text-sm font-mono text-white">1,250 SY</span>
            </div>
            <div className="flex gap-2">
               <button onClick={() => setShowHistory(true)} className="cursor-button-secondary px-3 py-1 flex items-center gap-2 h-8">
                  <History size={12} />
                  <span className="hidden xs:inline">Журнал</span>
               </button>
               <button onClick={() => setShowTopUp(true)} className="cursor-button px-3 py-1 flex items-center gap-2 h-8">
                  <Plus size={12} />
                  <span>Пополнить</span>
               </button>
            </div>
        </div>

        {/* Extension Item: SYSub */}
        <div className="group flex items-start gap-3 p-3 rounded hover:bg-surface-hover transition-colors cursor-pointer active:bg-surface-hover" onClick={() => setPage?.(Page.SUBSCRIPTION)}>
           <div className="w-10 h-10 bg-[#2b2d31] rounded flex items-center justify-center text-white shrink-0 mt-0.5">
              <Star size={20} fill="currentColor" className="text-yellow-500" />
           </div>
           <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                 <h3 className="text-sm font-semibold text-white">SYSub Premium</h3>
                 <div className="px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-medium border border-blue-500/20">Проверено</div>
              </div>
              <p className="text-xs text-zinc-400 truncate">Эксклюзивный контент, ранний доступ и бонусы.</p>
              <div className="flex items-center gap-3 mt-1.5">
                 <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Download size={10} /> 12k</span>
                 <span className="text-[10px] text-zinc-500 flex items-center gap-1"><Star size={10} /> 5.0</span>
              </div>
           </div>
           <button className="cursor-button px-3 py-1 self-center h-7 text-xs">Обзор</button>
        </div>

        {/* Extension Item: Daily Case */}
        <div className="group flex items-start gap-3 p-3 rounded hover:bg-surface-hover transition-colors cursor-pointer active:bg-surface-hover" onClick={handleOpenCase}>
           <div className="w-10 h-10 bg-[#2b2d31] rounded flex items-center justify-center text-white shrink-0 mt-0.5">
              <Gift size={20} className={dailyCaseClaimed ? "text-zinc-500" : "text-green-400"} />
           </div>
           <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                 <h3 className="text-sm font-semibold text-white">Ежедневный бонус</h3>
                 {!dailyCaseClaimed && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>}
              </div>
              <p className="text-xs text-zinc-400 truncate">Бесплатные награды каждые 24 часа.</p>
              <div className="flex items-center gap-3 mt-1.5">
                 <span className="text-[10px] text-zinc-500">Издатель: System</span>
              </div>
           </div>
           <button 
             disabled={dailyCaseClaimed}
             className={`px-3 py-1 text-xs font-medium rounded border transition-colors self-center h-7 ${
               dailyCaseClaimed 
                 ? 'bg-transparent border-transparent text-zinc-500 cursor-not-allowed' 
                 : 'bg-blue-600 border-blue-600 text-white hover:bg-blue-500'
             }`}
           >
             {dailyCaseClaimed ? 'Таймаут' : 'Открыть'}
           </button>
        </div>

         {/* Extension Item: Skins */}
         <div className="group flex items-start gap-3 p-3 rounded hover:bg-surface-hover transition-colors cursor-pointer active:bg-surface-hover" onClick={() => setPage?.(Page.SKINS)}>
           <div className="w-10 h-10 bg-[#2b2d31] rounded flex items-center justify-center text-zinc-300 shrink-0 mt-0.5">
              <div className="grid grid-cols-2 gap-0.5">
                 <div className="w-2 h-2 bg-zinc-500 rounded-[1px]"></div>
                 <div className="w-2 h-2 bg-zinc-500 rounded-[1px]"></div>
                 <div className="w-2 h-2 bg-zinc-500 rounded-[1px]"></div>
                 <div className="w-2 h-2 bg-zinc-500 rounded-[1px]"></div>
              </div>
           </div>
           <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                 <h3 className="text-sm font-semibold text-white">Каталог скинов</h3>
              </div>
              <p className="text-xs text-zinc-400 truncate">Просмотр и покупка моделей игроков.</p>
              <div className="flex items-center gap-3 mt-1.5">
                 <span className="text-[10px] text-zinc-500">v2.4.0</span>
              </div>
           </div>
           <button className="cursor-button-secondary px-3 py-1 self-center h-7 text-xs">Каталог</button>
        </div>

      </div>

      <CaseOpeningModal 
        isOpen={isCaseModalOpen} 
        onClose={handleCaseClosed} 
      />
    </div>
  );
};

export default Shop;
