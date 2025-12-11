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
    <div className="w-full min-h-screen pt-8 pb-24 px-6 bg-black">
      <div className="max-w-md mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-medium text-white tracking-tight">Подписка</h1>
        </div>

        <div className="cursor-card rounded-2xl overflow-hidden mb-6 relative group">
          {/* Subtle Back Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>

          <div className="p-8 pb-6 flex flex-col items-center text-center relative z-10">
             <div className="w-12 h-12 bg-white/5 border border-white/10 text-white rounded-xl flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Crown size={20} strokeWidth={1.5} />
             </div>
             <h2 className="text-lg font-medium text-white mb-2">{plan.name}</h2>
             <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-light text-white tracking-tighter">{plan.price} ₽</span>
                <span className="text-white/40 text-sm">/ месяц</span>
             </div>

             <div className="w-full space-y-3 mb-8 text-left">
                {plan.features.map((feature, idx) => (
                   <div key={idx} className="flex items-center gap-3 py-1">
                      <div className="flex-shrink-0 w-4 h-4 rounded-full bg-white text-black flex items-center justify-center">
                         <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-white/70 text-sm font-light">{feature}</span>
                   </div>
                ))}
             </div>

             <div className="w-full space-y-3">
              {isSubscribed ? (
                <div className="w-full py-3 rounded-lg text-sm font-medium text-green-400 bg-green-500/5 border border-green-500/20 flex items-center justify-center gap-2">
                  <Check size={16} />
                  <span>Подписка активна</span>
                </div>
              ) : (
                <>
                  <button 
                    onClick={handleSubscribe}
                    className="w-full py-3 rounded-lg text-sm font-medium text-black bg-white hover:bg-zinc-200 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    Оформить подписку
                  </button>

                  {!trialActivated ? (
                    <button 
                      onClick={() => setShowTrialRules(true)}
                      className="w-full py-3 rounded-lg text-sm font-medium text-white/50 border border-white/10 hover:text-white hover:border-white/30 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/5"
                    >
                      <Clock size={14} />
                      <span>Free Trial (5 days)</span>
                    </button>
                  ) : (
                    <div className="w-full py-3 rounded-lg text-sm font-medium text-green-400 bg-green-500/5 border border-green-500/10 flex items-center justify-center gap-2">
                      <Check size={14} />
                      <span>Trial Activated</span>
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
                className={`py-3 rounded-lg border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                   paymentMethod === 'stripe' 
                   ? 'bg-white/10 text-white border-white/20' 
                   : 'bg-transparent border-white/10 text-white/40 hover:text-white/70'
                }`}
             >
                <CreditCard size={14} />
                <span className="text-xs font-medium">Stripe</span>
             </button>
             <button 
                onClick={() => setPaymentMethod('gmdonate')}
                className={`py-3 rounded-lg border flex items-center justify-center gap-2 transition-all active:scale-95 ${
                   paymentMethod === 'gmdonate' 
                   ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                   : 'bg-transparent border-white/10 text-white/40 hover:text-white/70'
                }`}
             >
                <div className="w-3 h-3 bg-current rounded-[1px] flex items-center justify-center text-[7px] font-bold text-black">G</div>
                <span className="text-xs font-medium">GM Donate</span>
             </button>
          </div>
        )}

        <div className="text-center px-4">
          <p className="text-[10px] text-white/30 font-light leading-relaxed">
            Automatic renewal. Cancel anytime.
            By subscribing, you agree to our <button onClick={() => setPage(Page.TERMS)} className="text-white/50 hover:text-white underline decoration-white/30">Terms of Service</button>.
          </p>
        </div>

        {/* Trial Rules Modal */}
        {showTrialRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
            <div className="cursor-card rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in bg-[#050505]">
              <div className="p-5 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-medium text-white flex items-center gap-2 text-sm">
                  <AlertTriangle size={14} className="text-yellow-500" />
                  Trial Rules
                </h3>
                <button onClick={() => setShowTrialRules(false)} className="text-white/40 hover:text-white transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6 space-y-4 text-xs text-white/60 leading-relaxed font-light">
                <div className="flex gap-3">
                  <span className="text-white/30 font-mono">01</span>
                  <p>Multi-accounting is strictly prohibited.</p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-white/30 font-mono">02</span>
                  <p>Abuse will result in a permanent ban across all connected accounts.</p>
                </div>
                
                <div className="flex gap-3">
                  <span className="text-white/30 font-mono">03</span>
                  <p>Access expires automatically after 5 days.</p>
                </div>
                
                <button 
                  onClick={() => {
                    setShowTrialRules(false);
                    setTrialActivated(true);
                    sessionState.isSubscribed = true;
                    setIsSubscribed(true);
                  }}
                  className="w-full bg-white text-black hover:bg-zinc-200 font-medium py-3 rounded-lg transition-all active:scale-95 mt-4"
                >
                  Accept & Activate
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
