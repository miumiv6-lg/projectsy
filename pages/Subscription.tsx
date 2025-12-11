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
    sessionState.isSubscribed = true;
    setIsSubscribed(true);
  };

  const plan = {
    name: 'SYSub Premium',
    price: 100,
    features: [
      'Доступ к поездам: Яуза, Ока',
      'Спавн 6 вагонов',
      'Все премиум скины',
      'Приоритетная поддержка'
    ]
  };

  return (
    <div className="w-full min-h-screen pt-8 pb-24 px-6 bg-black animate-fade-in">
      <div className="max-w-md mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/5 text-zinc-500 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-medium text-white tracking-tight">Подписка</h1>
        </div>

        <div className="cursor-card rounded-2xl overflow-hidden mb-6 relative group border-white/10">
          {/* Subtle Radial Gradient */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="p-8 flex flex-col items-center text-center relative z-10">
             <div className="w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Crown size={24} strokeWidth={1.5} />
             </div>
             
             <h2 className="text-lg font-medium text-white mb-2 tracking-tight">{plan.name}</h2>
             <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-medium text-white tracking-tighter">{plan.price} ₽</span>
                <span className="text-zinc-500 text-sm">/ месяц</span>
             </div>

             <div className="w-full space-y-4 mb-8 text-left bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                {plan.features.map((feature, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                      <Check size={16} className="text-white mt-0.5" />
                      <span className="text-zinc-300 text-sm leading-tight">{feature}</span>
                   </div>
                ))}
             </div>

             <div className="w-full space-y-3">
              {isSubscribed ? (
                <div className="w-full py-3.5 rounded-xl text-sm font-medium text-black bg-white flex items-center justify-center gap-2">
                  <Check size={16} />
                  <span>Подписка активна</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full py-3.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    Подписаться
                  </button>

                  {!trialActivated ? (
                    <button 
                      onClick={() => setShowTrialRules(true)}
                      className="w-full py-3.5 rounded-xl text-sm font-medium text-zinc-400 border border-white/10 hover:text-white hover:border-white/30 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/5"
                    >
                      <span>Попробовать бесплатно</span>
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-xl text-sm font-medium text-white bg-white/10 border border-white/5 flex items-center justify-center gap-2">
                      <Clock size={14} />
                      <span>Trial активен</span>
                    </div>
                  )}
                </>
              )}
             </div>
          </div>
        </div>

        {/* Payment Methods */}
        {!isSubscribed && (
          <div className="grid grid-cols-2 gap-3 mb-8">
             <button 
                onClick={() => setPaymentMethod('stripe')}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                   paymentMethod === 'stripe' 
                   ? 'bg-white text-black border-white' 
                   : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'
                }`}
             >
                <CreditCard size={14} />
                <span className="text-xs font-medium">Stripe</span>
             </button>
             <button 
                onClick={() => setPaymentMethod('gmdonate')}
                className={`py-3 rounded-xl border flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                   paymentMethod === 'gmdonate' 
                   ? 'bg-white text-black border-white' 
                   : 'bg-transparent border-white/10 text-zinc-500 hover:text-white'
                }`}
             >
                <span className="text-[10px] font-bold border border-current rounded px-1">G</span>
                <span className="text-xs font-medium">GM Donate</span>
             </button>
          </div>
        )}

        <div className="text-center px-4">
          <p className="text-[10px] text-zinc-600 font-light leading-relaxed">
            Подписка продлевается автоматически. Отмена в любое время.
            <br />
            Нажимая кнопку, вы принимаете <button onClick={() => setPage(Page.TERMS)} className="text-zinc-500 hover:text-white underline decoration-zinc-700">Условия использования</button>.
          </p>
        </div>

        {/* Trial Rules Modal */}
        {showTrialRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
            <div className="cursor-card rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl animate-scale-in bg-[#0A0A0A] border-white/10">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2 text-sm">
                  Правила Trial
                </h3>
                <button onClick={() => setShowTrialRules(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <span className="text-zinc-600 font-mono text-xs pt-1">01</span>
                    <p className="text-zinc-300 text-xs leading-relaxed">Мультиаккаунты строго запрещены.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-zinc-600 font-mono text-xs pt-1">02</span>
                    <p className="text-zinc-300 text-xs leading-relaxed">Нарушение правил приведет к перманентной блокировке.</p>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-zinc-600 font-mono text-xs pt-1">03</span>
                    <p className="text-zinc-300 text-xs leading-relaxed">5 дней бесплатного доступа ко всем функциям.</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setShowTrialRules(false);
                    setTrialActivated(true);
                    sessionState.isSubscribed = true;
                    setIsSubscribed(true);
                  }}
                  className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3 rounded-xl transition-all active:scale-95 text-xs tracking-wide uppercase"
                >
                  Принять условия
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
