import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Crown, CreditCard, Clock, Info, AlertTriangle, X } from 'lucide-react';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'gmdonate'>('stripe');
  const [trialActivated, setTrialActivated] = useState(false);
  const [showTrialRules, setShowTrialRules] = useState(false);

  const plan = {
    name: 'SYSub',
    price: 100,
    features: [
      'Поезда: Яуза, Яуза .1, Ока',
      'Спавн 6 вагонов (вместо 4)',
      'Доступ ко всем скинам'
    ]
  };

  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[600px] mx-auto">
        
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setPage(Page.SHOP)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181a20] border border-[#2d313a] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-white">Подписка</h1>
        </div>

        <div className="bg-[#181a20] border border-[#2d313a] rounded-2xl overflow-hidden shadow-xl">
          {/* Header */}
          <div className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-[#2d313a] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Crown size={120} />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                <Crown size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-blue-400">{plan.price} ₽</span>
                <span className="text-sm text-gray-400">/ месяц</span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="p-6 space-y-6">
            <div className="space-y-3">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-blue-400" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#2d313a]" />

            {/* Actions */}
            <div className="space-y-3">
              {!trialActivated ? (
                <button 
                  onClick={() => setShowTrialRules(true)}
                  className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#1c1f26] border border-green-500/30 hover:border-green-500/60 hover:bg-green-500/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <Clock size={16} className="text-green-500 group-hover:scale-110 transition-transform" />
                  <span className="text-green-400">Попробовать бесплатно (5 дней)</span>
                </button>
              ) : (
                <div className="w-full py-3 rounded-xl text-sm font-bold text-green-400 bg-green-500/10 border border-green-500/20 flex items-center justify-center gap-2">
                  <Check size={16} />
                  <span>Пробный период активирован</span>
                </div>
              )}

              {!trialActivated && (
                <div className="pt-2 space-y-3">
                  <button className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg shadow-blue-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                    Оформить подписку
                  </button>
                  
                  <div className="bg-[#1c1f26] rounded-xl p-3 border border-[#2d313a]">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 text-center">Способ оплаты</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => setPaymentMethod('stripe')}
                        className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'stripe' 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <CreditCard size={14} />
                        <span className="text-xs font-bold">Stripe</span>
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('gmdonate')}
                        className={`p-2.5 rounded-lg border flex items-center justify-center gap-2 transition-all ${
                          paymentMethod === 'gmdonate' 
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                            : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        <div className="w-4 h-4 bg-white rounded flex items-center justify-center text-[9px] font-bold text-blue-600">G</div>
                        <span className="text-xs font-bold">GM Donate</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center px-4">
          <p className="text-[10px] text-gray-600 leading-relaxed">
            Подписка продлевается автоматически каждый месяц. Вы можете отменить её в любой момент в настройках профиля.
            Нажимая кнопку "Оформить подписку", вы соглашаетесь с условиями использования.
          </p>
        </div>

        {/* Trial Rules Modal */}
        {showTrialRules && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-[#181a20] border border-[#2d313a] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-[#2d313a] flex items-center justify-between bg-[#1c1f26]">
                <h3 className="font-bold text-white flex items-center gap-2 text-sm">
                  <AlertTriangle size={16} className="text-yellow-500" />
                  Правила Trial
                </h3>
                <button onClick={() => setShowTrialRules(false)} className="text-gray-500 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 space-y-4 text-xs text-gray-300 leading-relaxed">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <strong className="text-red-400 block mb-1">1. Мультиаккаунты запрещены</strong>
                  Использование твинков (alt-аккаунтов) для повторной активации пробного периода строго запрещено.
                </div>
                
                <div>
                  <strong className="text-white block mb-1">2. Блокировка за абуз</strong>
                  Разработчики отслеживают все активации. При обнаружении злоупотребления, <span className="text-red-400 font-bold">все связанные аккаунты будут заблокированы</span>, а доступ к серверу закрыт навсегда.
                </div>
                
                <div>
                  <strong className="text-white block mb-1">3. Окончание периода</strong>
                  После истечения 5 дней доступ к бонусам подписки будет автоматически отключен.
                </div>
                
                <button 
                  onClick={() => {
                    setShowTrialRules(false);
                    setTrialActivated(true);
                  }}
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-colors mt-2"
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
