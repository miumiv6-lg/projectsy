import React, { useState } from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Star, Zap, Shield, Gift, Crown } from 'lucide-react';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
  const [selectedPlan, setSelectedPlan] = useState<'regular' | 'improved' | 'powerful'>('improved');

  const plans = {
    regular: {
      id: 'regular',
      name: 'Обычная',
      price: 150,
      color: 'blue',
      features: [
        'Увеличенный лимит пропов (x1.5)',
        'Доступ к базовым командам',
        'Префикс [SYSub] в чате',
        'Ежемесячный бонус 100 SY'
      ]
    },
    improved: {
      id: 'improved',
      name: 'Улучшенная',
      price: 300,
      color: 'purple',
      features: [
        'Увеличенный лимит пропов (x2.0)',
        'Приоритетный вход на сервер',
        'Доступ к расширенным командам',
        'Уникальный цвет ника',
        'Ежемесячный бонус 300 SY'
      ]
    },
    powerful: {
      id: 'powerful',
      name: 'Мощная',
      price: 600,
      color: 'yellow',
      features: [
        'Безлимитный спавн пропов',
        'Максимальный приоритет входа',
        'Доступ ко всем командам',
        'Персональный скин (по запросу)',
        'Ежемесячный бонус 1000 SY',
        'Личный канал в Discord'
      ]
    }
  };

  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 animate-fade-in">
      <div className="max-w-[800px] mx-auto">
        
        <button 
          onClick={() => setPage(Page.SHOP)}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Назад в магазин</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Выберите свой уровень</h1>
          <p className="text-gray-400 text-sm">Подписка SYSub открывает новые горизонты игры</p>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-3 gap-2 mb-8 bg-[#181a20] p-1 rounded-xl border border-[#2d313a]">
          {(Object.keys(plans) as Array<keyof typeof plans>).map((key) => {
            const plan = plans[key];
            const isSelected = selectedPlan === key;
            return (
              <button
                key={key}
                onClick={() => setSelectedPlan(key)}
                className={`py-3 rounded-lg text-sm font-bold transition-all ${
                  isSelected 
                    ? 'bg-[#2d313a] text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {plan.name}
              </button>
            );
          })}
        </div>

        {/* Active Plan Details */}
        <div className="bg-[#0f1115] border border-[#2d313a] rounded-2xl overflow-hidden relative transition-all duration-300">
          {/* Header Background */}
          <div className={`h-32 bg-gradient-to-r relative transition-colors duration-500 ${
            selectedPlan === 'regular' ? 'from-blue-900/20 to-blue-800/10' :
            selectedPlan === 'improved' ? 'from-purple-900/20 to-purple-800/10' :
            'from-yellow-900/20 to-yellow-800/10'
          }`}>
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          </div>

          <div className="px-6 pb-8 -mt-12 relative z-10">
            <div className={`w-24 h-24 bg-[#0f1115] rounded-2xl border-4 flex items-center justify-center mb-4 shadow-xl transition-colors duration-300 ${
               selectedPlan === 'regular' ? 'border-blue-500/30' :
               selectedPlan === 'improved' ? 'border-purple-500/30' :
               'border-yellow-500/30'
            }`}>
              {selectedPlan === 'regular' && <Zap size={40} className="text-blue-500" />}
              {selectedPlan === 'improved' && <Star size={40} className="text-purple-500" />}
              {selectedPlan === 'powerful' && <Crown size={40} className="text-yellow-500" />}
            </div>

            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{plans[selectedPlan].name}</h2>
                <p className="text-gray-400 text-sm">Идеальный выбор для начала</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-white font-mono">{plans[selectedPlan].price} SY</div>
                <div className="text-xs text-gray-500">в месяц</div>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              {plans[selectedPlan].features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-[#181a20] rounded-lg border border-[#2d313a]">
                  <div className={`p-1 rounded-full ${
                    selectedPlan === 'regular' ? 'bg-blue-500/20 text-blue-400' :
                    selectedPlan === 'improved' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <Check size={14} />
                  </div>
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-4 rounded-xl font-bold text-white transition-colors ${
               selectedPlan === 'regular' ? 'bg-blue-600 hover:bg-blue-500' :
               selectedPlan === 'improved' ? 'bg-purple-600 hover:bg-purple-500' :
               'bg-yellow-600 hover:bg-yellow-500'
            }`}>
              Оформить подписку
            </button>

            <div className="text-center mt-4">
              <p className="text-[10px] text-gray-500">
                Нажимая кнопку, вы соглашаетесь с правилами сервера. Подписка продлевается автоматически.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
