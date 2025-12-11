import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Star, Zap, Crown, ChevronDown, ChevronUp, CreditCard, Clock, Info, AlertTriangle, X } from 'lucide-react';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>('premium');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'gmdonate'>('stripe');
  const [trialActivated, setTrialActivated] = useState(false);
  const [showTrialRules, setShowTrialRules] = useState(false);

  const plans = [
    {
      id: 'premium',
      name: 'SYSub Premium',
      price: 100,
      icon: Crown,
      color: 'blue',
      features: [
        'Поезда: Яуза, Яуза .1, Ока',
        'Спавн 6 вагонов (вместо 4)',
        'Доступ ко всем скинам'
      ]
    }
  ];

  const togglePlan = (id: string) => {
    setExpandedPlan(expandedPlan === id ? null : id);
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
          <h1 className="text-xl font-bold text-white">Подписка SYSub</h1>
        </div>

        <div className="space-y-3">
          {plans.map((plan) => {
            const isExpanded = expandedPlan === plan.id;
            const colorClasses = {
              blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
              purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
              yellow: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
            }[plan.color];

            const btnClasses = {
              blue: 'bg-blue-600 hover:bg-blue-500',
              purple: 'bg-purple-600 hover:bg-purple-500',
              yellow: 'bg-yellow-600 hover:bg-yellow-500'
            }[plan.color];

            return (
              <div 
                key={plan.id}
                className={`bg-[#181a20] border rounded-xl overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-gray-600 shadow-lg' : 'border-[#2d313a]'
                }`}
              >
                <div 
                  onClick={() => togglePlan(plan.id)}
                  className="p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                      <plan.icon size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                      <p className="text-xs text-gray-500">{plan.price} ₽ / мес</p>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                    <ChevronDown size={16} className="text-gray-500" />
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="px-4 pb-4 pt-0 border-t border-[#2d313a] mt-2">
                    <div className="grid grid-cols-1 gap-2 py-3">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-300">
                          <Check size={12} className={plan.color === 'blue' ? 'text-blue-400' : plan.color === 'purple' ? 'text-purple-400' : 'text-yellow-400'} />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.id === 'premium' && !trialActivated && (
                      <button 
                        onClick={() => setTrialActivated(true)}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition-colors mb-2 flex items-center justify-center gap-2"
                      >
                        <Clock size={14} />
                        <span>Попробовать бесплатно (5 дней)</span>
                      </button>
                    )}

                    {plan.id === 'premium' && trialActivated && (
                      <div className="w-full py-2.5 rounded-lg text-sm font-bold text-green-400 bg-green-500/10 border border-green-500/20 mb-2 flex items-center justify-center gap-2">
                        <Check size={14} />
                        <span>Пробный период активирован</span>
                      </div>
                    )}

                    {plan.id === 'premium' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); setShowTrialRules(true); }}
                        className="w-full text-center text-[10px] text-gray-500 hover:text-gray-300 mb-3 flex items-center justify-center gap-1 transition-colors"
                      >
                        <Info size={12} />
                        <span>Правила пробного периода</span>
                      </button>
                    )}

                    {!(plan.id === 'premium' && trialActivated) && (
                      <>
                        <button className={`w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors mb-3 ${btnClasses}`}>
                          Выбрать
                        </button>
                        
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Способ оплаты</div>
                          <div className="grid grid-cols-2 gap-2">
                            <button 
                              onClick={() => setPaymentMethod('stripe')}
                              className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                                paymentMethod === 'stripe' 
                                  ? 'bg-white text-black border-white' 
                                  : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <CreditCard size={14} />
                              <span className="text-[10px] font-bold">Stripe</span>
                            </button>
                            <button 
                              onClick={() => setPaymentMethod('gmdonate')}
                              className={`p-2 rounded-lg border flex items-center justify-center gap-1.5 transition-all ${
                                paymentMethod === 'gmdonate' 
                                  ? 'bg-blue-600 text-white border-blue-600' 
                                  : 'bg-[#181a20] border-[#2d313a] text-gray-400 hover:border-gray-600'
                              }`}
                            >
                              <div className="w-3.5 h-3.5 bg-white rounded-sm flex items-center justify-center text-[8px] font-bold text-blue-600">G</div>
                              <span className="text-[10px] font-bold">GM Donate</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <p className="text-[10px] text-gray-600">
            Подписка продлевается автоматически. Отменить можно в любой момент.
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
                  onClick={() => setShowTrialRules(false)}
                  className="w-full bg-[#2d313a] hover:bg-[#363a45] text-white font-bold py-3 rounded-xl transition-colors mt-2"
                >
                  Всё понятно
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
