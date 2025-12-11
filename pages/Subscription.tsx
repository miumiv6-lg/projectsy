import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Crown, CreditCard, Clock, Info, AlertTriangle, X } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'gmdonate'>('stripe');
  const [trialActivated, setTrialActivated] = useState(false);
  const [showTrialRules, setShowTrialRules] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(sessionState.isSubscribed);

  const handleSubscribe = () => {
    // Fake subscription logic
    sessionState.isSubscribed = true;
    setIsSubscribed(true);
  };

  const plan = {
    name: 'SYSub Premium',
    price: 100,
    features: [
      'Поезда: Яуза, Яуза .1, Ока',
      'Спавн 6 вагонов (вместо 4)',
      'Доступ ко всем скинам'
    ]
  };

  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 bg-zinc-950">
      <div className="max-w-md mx-auto">
        
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Подписка</h1>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden mb-6">
          {/* Hero Section */}
          <div className="p-8 pb-6 flex flex-col items-center text-center">
             <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-4">
                <Crown size={32} strokeWidth={1.5} />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">{plan.name}</h2>
             <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">{plan.price} ₽</span>
                <span className="text-zinc-500">/ месяц</span>
             </div>

             <div className="w-full space-y-4 mb-8 text-left">
                {plan.features.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white text-black flex items-center justify-center">
                         <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-zinc-300 text-sm font-medium">{feature}</span>
                   </div>
                ))}
             </div>

             <div className="w-full space-y-3">
              {isSubscribed ? (
                <div className="w-full py-4 rounded-2xl text-sm font-semibold text-green-400 bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2">
                  <Check size={18} strokeWidth={2} />
                  <span>Подписка активна</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full py-3.5 rounded-2xl text-base font-semibold text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all shadow-lg shadow-white/5"
                  >
                    Оформить подписку
                  </button>

                  {!trialActivated ? (
                    <button 
                      onClick={() => setShowTrialRules(true)}
                      className="w-full py-3.5 rounded-2xl text-sm font-medium text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Clock size={16} strokeWidth={1.5} />
                      <span>Попробовать бесплатно (5 дней)</span>
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-2xl text-sm font-medium text-green-400 bg-green-900/10 border border-green-900/30 flex items-center justify-center gap-2">
                      <Check size={16} />
                      <span>Пробный период активирован</span>
                    </div>
                  )}
                </>
              )}
             </div>
          </div>
        </div>

        {/* Payment Methods (Only show if not subscribed) */}
        {!isSubscribed && (
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-4">
             <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-3 text-center">Способ оплаты</div>
             <div className="grid grid-cols-2 gap-3">
                <button 
                   onClick={() => setPaymentMethod('stripe')}
                   className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      paymentMethod === 'stripe' 
                      ? 'bg-zinc-800 text-white border-zinc-700' 
                      : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-400'
                   }`}
                >
                   <CreditCard size={16} strokeWidth={1.5} />
                   <span className="text-xs font-semibold">Stripe</span>
                </button>
                <button 
                   onClick={() => setPaymentMethod('gmdonate')}
                   className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                      paymentMethod === 'gmdonate' 
                      ? 'bg-blue-600/10 text-blue-400 border-blue-500/20' 
                      : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-400'
                   }`}
                >
                   <div className="w-4 h-4 bg-current rounded flex items-center justify-center text-[9px] font-bold text-black">G</div>
                   <span className="text-xs font-semibold">GM Donate</span>
                </button>
             </div>
          </div>
        )}

        <div className="mt-8 text-center px-4">
          <p className="text-[10px] text-zinc-600 leading-relaxed">
            Подписка продлевается автоматически. Вы можете отменить её в любой момент.
            Нажимая кнопку "Оформить подписку", вы соглашаетесь с <button onClick={() => setPage(Page.TERMS)} className="text-zinc-400 hover:text-zinc-300 underline">условиями использования</button>.
          </p>
        </div>

        {/* Trial Rules Modal */}
        {showTrialRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="font-semibold text-white flex items-center gap-2 text-base">
                  <AlertTriangle size={18} className="text-yellow-500" strokeWidth={1.5} />
                  Правила Trial
                </h3>
                <button onClick={() => setShowTrialRules(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>
              <div className="p-6 space-y-5 text-sm text-zinc-400 leading-relaxed">
                <div>
                  <strong className="text-white block mb-1 text-sm font-medium">1. Мультиаккаунты запрещены</strong>
                  Использование твинков для повторной активации пробного периода строго запрещено.
                </div>
                
                <div>
                  <strong className="text-white block mb-1 text-sm font-medium">2. Блокировка за абуз</strong>
                  При обнаружении злоупотребления <span className="text-red-400">все аккаунты будут заблокированы</span>.
                </div>
                
                <div>
                  <strong className="text-white block mb-1 text-sm font-medium">3. Окончание периода</strong>
                  После 5 дней доступ отключится автоматически.
                </div>
                
                <button 
                  onClick={() => {
                    setShowTrialRules(false);
                    setTrialActivated(true);
                    sessionState.isSubscribed = true;
                    setIsSubscribed(true);
                  }}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-semibold py-3.5 rounded-2xl transition-all active:scale-95 mt-4"
                >
                  Всё понятно, оформить
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Subscription;
