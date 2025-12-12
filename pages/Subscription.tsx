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
    <div className="w-full min-h-screen pt-safe-top pt-6 pb-24 px-4 bg-background animate-fade-in">
      <div className="max-w-md mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-zinc-400 hover:text-white hover:border-border-hover transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-semibold text-white tracking-tight">Подписка</h1>
        </div>

        <div className="cursor-card rounded-2xl overflow-hidden mb-6">
          <div className="p-7 flex flex-col items-center text-center">
             <div className="w-14 h-14 bg-[var(--color-accent)] text-white rounded-2xl flex items-center justify-center mb-6">
                <Crown size={24} strokeWidth={1.5} />
             </div>
             
             <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">{plan.name}</h2>
             <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-semibold text-white tracking-tighter">{plan.price} ₽</span>
                <span className="text-zinc-500 text-sm">/ месяц</span>
             </div>

             <div className="w-full space-y-4 mb-8 text-left bg-[var(--color-surface-hover)] p-4 rounded-xl border border-border">
                {plan.features.map((feature, idx) => (
                   <div key={idx} className="flex items-start gap-3">
                      <Check size={16} className="text-[var(--color-accent)] mt-0.5" />
                      <span className="text-zinc-300 text-sm leading-tight">{feature}</span>
                   </div>
                ))}
             </div>

             <div className="w-full space-y-3">
              {isSubscribed ? (
                <div className="w-full py-3.5 rounded-xl text-sm font-semibold text-black bg-white flex items-center justify-center gap-2">
                  <Check size={16} />
                  <span>Подписка активна</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full cursor-button py-3.5 rounded-xl text-sm font-semibold active:scale-95"
                  >
                    Подписаться
                  </button>

                  {!trialActivated ? (
                    <button 
                      onClick={() => setShowTrialRules(true)}
                      className="w-full cursor-button-secondary py-3.5 rounded-xl text-sm font-semibold active:scale-95 flex items-center justify-center gap-2"
                    >
                      <span>Попробовать бесплатно</span>
                    </button>
                  ) : (
                    <div className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-white/5 border border-border flex items-center justify-center gap-2">
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
          <div className="mb-8">
            <div className="text-xs font-medium text-zinc-500 tracking-wide uppercase mb-3 px-1">Оплата</div>
            <div className="cursor-card rounded-2xl p-1 flex gap-1">
              <button
                onClick={() => setPaymentMethod('stripe')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  paymentMethod === 'stripe'
                    ? 'bg-[var(--color-surface-hover)] text-white border border-border'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <CreditCard size={14} />
                  Stripe
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod('gmdonate')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  paymentMethod === 'gmdonate'
                    ? 'bg-[var(--color-surface-hover)] text-white border border-border'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <span className="text-[10px] font-bold border border-current rounded px-1">G</span>
                  GM Donate
                </span>
              </button>
            </div>
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
            <div className="cursor-card rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl animate-scale-in">
              <div className="p-5 border-b border-border flex items-center justify-between">
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
                  className="w-full cursor-button font-semibold py-3 rounded-xl transition-all active:scale-95 text-xs tracking-wide uppercase"
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
