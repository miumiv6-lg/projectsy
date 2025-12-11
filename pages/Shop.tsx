import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { ShoppingBag, Package, Star, ChevronRight, Plus, History, CreditCard, Box, Gift, Lock } from 'lucide-react';

interface ShopProps {
  setPage?: (page: Page) => void;
}

const Shop: React.FC<ShopProps> = ({ setPage }) => {
  const [showTopUp, setShowTopUp] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [dailyReward, setDailyReward] = useState<{ claimed: boolean, index: number | null, reward: string | null }>({ claimed: false, index: null, reward: null });

  useEffect(() => {
    const saved = localStorage.getItem('daily_reward');
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.date === today) {
        setDailyReward({ claimed: true, index: parsed.index, reward: parsed.reward });
      }
    }
  }, []);

  const handleDailyClick = (index: number) => {
    if (dailyReward.claimed) return;

    const rewards = ['-10% на скины', '-20% на скины', '-5% на донат', '10 SY', '50 SY'];
    const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
    
    const newState = { claimed: true, index, reward: randomReward };
    setDailyReward(newState);
    localStorage.setItem('daily_reward', JSON.stringify({ date: new Date().toDateString(), ...newState }));
  }; 

  if (showHistory) {
    return (
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-[#0f1115]">
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowHistory(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181a20] border border-[#2d313a] text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-white">История операций</h1>
          </div>
          
          <div className="space-y-2">
            <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-400">
                  <Plus size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Пополнение счета</h3>
                  <span className="text-[10px] text-gray-500">10.12.2025 • GM Donate</span>
                </div>
              </div>
              <span className="text-sm font-bold text-green-400">+500 SY</span>
            </div>
            <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                  <ShoppingBag size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Покупка SYSub</h3>
                  <span className="text-[10px] text-gray-500">05.12.2025 • Подписка</span>
                </div>
              </div>
              <span className="text-sm font-bold text-white">-150 SY</span>
            </div>
            
            <div className="mt-4 p-4 bg-blue-900/10 border border-blue-500/20 rounded-xl text-center">
              <p className="text-xs text-blue-400 mb-2">Возникли проблемы с оплатой?</p>
              <button 
                onClick={() => setPage?.(Page.TICKETS)}
                className="text-xs font-bold text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Написать в поддержку
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showTopUp) {
    return (
      <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-[#0f1115]">
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setShowTopUp(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181a20] border border-[#2d313a] text-gray-400 hover:text-white transition-colors"
            >
              <ChevronRight size={16} className="rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-white">Пополнение счета</h1>
          </div>

          <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-4 mb-4">
            <div className="text-xs text-gray-500 mb-1">Текущий баланс</div>
            <div className="text-2xl font-bold text-white font-mono">1250 SY</div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[100, 300, 500, 1000, 2500, 5000].map((amount) => (
              <button key={amount} className="bg-[#181a20] border border-[#2d313a] hover:border-blue-500 hover:bg-[#1c1f26] rounded-xl p-4 text-center transition-all group">
                <div className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{amount} SY</div>
                <div className="text-xs text-gray-500">{amount} ₽</div>
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <button className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
              <CreditCard size={16} />
              <span>Оплатить картой (Stripe)</span>
            </button>
            <button className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors">
              <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center text-[10px] font-bold text-blue-600">G</div>
              <span>GM Donate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 bg-[#0f1115]">
      <div className="max-w-[1200px] mx-auto">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight">Магазин</h1>
          <div className="flex items-center gap-3">
            <div className="bg-[#181a20] px-3 py-1.5 rounded-full border border-[#2d313a] flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-mono font-bold text-white">1250 SY</span>
              <button 
                onClick={() => setShowTopUp(true)}
                className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white ml-1 hover:bg-blue-500 transition-colors"
              >
                <Plus size={10} />
              </button>
            </div>
            <button 
              onClick={() => setShowHistory(true)}
              className="w-9 h-9 bg-[#181a20] rounded-full flex items-center justify-center border border-[#2d313a] text-white hover:bg-[#22252b] transition-colors"
            >
              <History size={18} />
            </button>
          </div>
        </div>

        {/* Featured Banner (SYSub) */}
        <div 
          onClick={() => setPage?.(Page.SUBSCRIPTION)}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/20 to-[#181a20] border border-blue-500/20 p-4 mb-4 cursor-pointer group"
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

        {/* Skins Collection Block */}
        <div 
          onClick={() => setPage?.(Page.SKINS)}
          className="bg-[#181a20] border border-[#2d313a] rounded-xl p-4 mb-6 cursor-pointer hover:border-gray-500 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 transform rotate-12 scale-150 pointer-events-none">
            <Box size={100} />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#22252b] rounded-lg flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                <Box size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Коллекция скинов</h3>
                <p className="text-xs text-gray-500">Осмотр моделей и покупка</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-600 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Daily Discounts */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 px-1">
            <Gift size={16} className="text-yellow-500" />
            <h3 className="font-bold text-white text-sm">Ежедневная скидка</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((index) => {
              const isClaimed = dailyReward.claimed;
              const isSelected = dailyReward.index === index;
              
              return (
                <button
                  key={index}
                  disabled={isClaimed}
                  onClick={() => handleDailyClick(index)}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                    isSelected 
                      ? 'bg-yellow-500/20 border-yellow-500' 
                      : isClaimed 
                        ? 'bg-[#181a20] border-[#2d313a] opacity-50 cursor-not-allowed'
                        : 'bg-[#181a20] border-[#2d313a] hover:border-yellow-500/50 hover:bg-[#22252b] cursor-pointer'
                  }`}
                >
                  {isSelected ? (
                    <div className="text-center animate-fade-in p-1">
                      <span className="text-[10px] font-bold text-yellow-400 leading-tight block">{dailyReward.reward}</span>
                    </div>
                  ) : (
                    <>
                      {isClaimed ? (
                        <Lock size={16} className="text-gray-600" />
                      ) : (
                        <Gift size={20} className="text-gray-400" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-600 text-center mt-2">
            Нажмите на блок, чтобы получить случайную скидку. Доступно раз в 24 часа.
          </p>
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
