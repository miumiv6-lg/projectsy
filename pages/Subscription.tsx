import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Star, Zap, Crown, ChevronDown, ChevronUp, CreditCard, Clock } from 'lucide-react';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [expandedPlan, setExpandedPlan] = useState<string | null>('improved');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'gmdonate'>('stripe');
  const [trialActivated, setTrialActivated] = useState(false);

  const plans = [
    {
      id: 'regular',
      name: 'Обычная',
      price: 29,
      icon: Zap,
      color: 'blue',
      features: ['Лимит пропов x1.5', 'Базовые команды', 'Префикс [SYSub]', 'Бонус 100 SY']
    },
    {
      id: 'improved',
      name: 'Улучшенная',
      price: 99,
      icon: Star,
      color: 'purple',
      features: ['Лимит пропов x2.0', 'Приоритетный вход', 'Расширенные команды', 'Цветной ник', 'Бонус 300 SY']
    },
    {
      id: 'powerful',
      name: 'Мощная',
      price: 199,
      icon: Crown,
      color: 'yellow',
      features: ['Безлимит пропов', 'Макс. приоритет', 'Все команды', 'Личный скин', 'Бонус 1000 SY']
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

                    {plan.id === 'regular' && !trialActivated && (
                      <button 
                        onClick={() => setTrialActivated(true)}
                        className="w-full py-2.5 rounded-lg text-sm font-bold text-white bg-green-600 hover:bg-green-500 transition-colors mb-2 flex items-center justify-center gap-2"
                      >
                        <Clock size={14} />
                        <span>Попробовать бесплатно (5 дней)</span>
                      </button>
                    )}

                    {plan.id === 'regular' && trialActivated && (
                      <div className="w-full py-2.5 rounded-lg text-sm font-bold text-green-400 bg-green-500/10 border border-green-500/20 mb-2 flex items-center justify-center gap-2">
                        <Check size={14} />
                        <span>Пробный период активирован</span>
                      </div>
                    )}

                    {!(plan.id === 'regular' && trialActivated) && (
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

      </div>
    </div>
  );
};

export default Subscription;
