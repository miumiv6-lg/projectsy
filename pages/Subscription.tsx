import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Crown, CreditCard, Clock, Info, AlertTriangle, X, Star, Zap } from 'lucide-react';
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

  return (
    <div className="w-full min-h-screen pt-safe-top pt-6 pb-24 px-4 bg-background font-sans text-sm animate-fade-in">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex flex-col">
             <h1 className="text-lg font-medium text-white tracking-tight">Обновление до Pro</h1>
             <p className="text-xs text-zinc-500">Разблокируйте все возможности сервера</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           
           {/* Plan Card */}
           <div className="cursor-panel p-6 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                 <Crown size={120} />
              </div>

              <div className="mb-6">
                 <div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase tracking-wider mb-3">
                    Рекомендуемый
                 </div>
                 <h2 className="text-2xl font-semibold text-white mb-1">SYSub Premium</h2>
                 <p className="text-zinc-400 text-xs">Максимальный набор возможностей.</p>
              </div>

              <div className="mb-8">
                 <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">100 ₽</span>
                    <span className="text-zinc-500">/ месяц</span>
                 </div>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                 {[
                    'Доступ к поездам: Яуза, Ока',
                    'Спавн до 6 вагонов',
                    'Все премиум скины',
                    'Приоритет в очереди (Queue Skip)',
                    'Золотой ник в чате'
                 ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-zinc-300 text-xs">
                       <Check size={14} className="text-accent mt-0.5 shrink-0" />
                       <span>{feature}</span>
                    </div>
                 ))}
              </div>

              <div className="space-y-3">
                 <button 
                   onClick={handleSubscribe}
                   disabled={isSubscribed}
                   className={`w-full py-2.5 rounded font-medium text-xs transition-all active:scale-[0.98] ${
                      isSubscribed 
                      ? 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-default'
                      : 'cursor-button'
                   }`}
                 >
                   {isSubscribed ? 'План активен' : 'Подписаться на Pro'}
                 </button>
                 
                 {!isSubscribed && !trialActivated && (
                    <button 
                      onClick={() => setShowTrialRules(true)}
                      className="w-full cursor-button-secondary py-2.5 rounded font-medium text-xs"
                    >
                      Попробовать бесплатно (Trial)
                    </button>
                 )}
              </div>
           </div>

           {/* Payment Details */}
           <div className="space-y-6">
              <div className="cursor-panel p-5">
                 <h3 className="text-xs font-medium text-white mb-4 uppercase tracking-wider">Способ оплаты</h3>
                 <div className="space-y-2">
                    <button
                      onClick={() => setPaymentMethod('stripe')}
                      className={`w-full flex items-center justify-between p-3 rounded border transition-colors ${
                         paymentMethod === 'stripe' 
                         ? 'bg-surface border-accent' 
                         : 'bg-transparent border-border hover:bg-surface-hover'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <CreditCard size={16} className="text-zinc-400" />
                          <span className="text-xs text-white">Банковская карта</span>
                       </div>
                       {paymentMethod === 'stripe' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                    </button>
                    <button
                      onClick={() => setPaymentMethod('gmdonate')}
                      className={`w-full flex items-center justify-between p-3 rounded border transition-colors ${
                         paymentMethod === 'gmdonate' 
                         ? 'bg-surface border-accent' 
                         : 'bg-transparent border-border hover:bg-surface-hover'
                      }`}
                    >
                       <div className="flex items-center gap-3">
                          <span className="font-bold text-[10px] bg-zinc-200 text-black px-1 rounded-sm">G</span>
                          <span className="text-xs text-white">GM Donate</span>
                       </div>
                       {paymentMethod === 'gmdonate' && <div className="w-2 h-2 rounded-full bg-accent"></div>}
                    </button>
                 </div>
              </div>

              <div className="px-2">
                 <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Нажимая кнопку «Подписаться», вы соглашаетесь с <button onClick={() => setPage(Page.TERMS)} className="text-accent hover:underline">Условиями использования</button>. Подписка продлевается автоматически. Отмена возможна в любой момент в настройках профиля.
                 </p>
              </div>
           </div>

        </div>

        {/* Trial Rules Modal */}
        {showTrialRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="cursor-panel w-full max-w-sm overflow-hidden shadow-2xl animate-scale-in bg-background">
              <div className="p-4 border-b border-border flex items-center justify-between bg-surface/50">
                <h3 className="font-medium text-white flex items-center gap-2 text-sm">
                  Активация Trial
                </h3>
                <button onClick={() => setShowTrialRules(false)} className="text-zinc-500 hover:text-white transition-colors">
                  <X size={14} />
                </button>
              </div>
              <div className="p-5 space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded">
                   <p className="text-[11px] text-blue-300 leading-relaxed flex gap-2">
                      <Info size={14} className="shrink-0 mt-0.5" />
                      Вы получаете полный доступ к функциям SYSub Premium на 5 дней.
                   </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Правила использования</h4>
                  <div className="space-y-2">
                     <div className="flex gap-3 text-xs text-zinc-300">
                        <span className="text-zinc-600 font-mono">01</span>
                        <span>Запрещено создание мультиаккаунтов для повторного получения Trial.</span>
                     </div>
                     <div className="flex gap-3 text-xs text-zinc-300">
                        <span className="text-zinc-600 font-mono">02</span>
                        <span>Нарушение правил приведет к блокировке по Hardware ID.</span>
                     </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setShowTrialRules(false);
                    setTrialActivated(true);
                    sessionState.isSubscribed = true;
                    setIsSubscribed(true);
                  }}
                  className="w-full cursor-button font-medium py-2 rounded text-xs"
                >
                  Я согласен, активировать
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
