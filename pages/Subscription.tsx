import React from 'react';
import { Page } from '../types';
import { ArrowLeft, Check, Star, Zap, Shield, Gift } from 'lucide-react';

interface SubscriptionProps {
  setPage: (page: Page) => void;
}

const Subscription: React.FC<SubscriptionProps> = ({ setPage }) => {
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

        <div className="bg-[#0f1115] border border-[#2d313a] rounded-xl overflow-hidden relative">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-blue-900/20 to-purple-900/20 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
          </div>

          <div className="px-6 pb-8 -mt-12 relative z-10">
            <div className="w-24 h-24 bg-[#0f1115] rounded-2xl border-4 border-[#2d313a] flex items-center justify-center mb-4 shadow-xl">
              <Star size={48} className="text-yellow-500 fill-yellow-500" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">SYSub Plus</h1>
            <p className="text-gray-400 mb-6">
              Максимальные возможности для комфортной игры. Подписка действует 30 дней.
            </p>

            <div className="grid gap-4 mb-8">
              <div className="flex items-start gap-4 p-4 bg-[#181a20] rounded-lg border border-[#2d313a]">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                  <Zap size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Увеличенные лимиты</h3>
                  <p className="text-sm text-gray-400">Спавните больше объектов и поездов без ограничений.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#181a20] rounded-lg border border-[#2d313a]">
                <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                  <Shield size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Приоритетный вход</h3>
                  <p className="text-sm text-gray-400">Заходите на переполненный сервер без очереди.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-[#181a20] rounded-lg border border-[#2d313a]">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-400">
                  <Gift size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Ежемесячные бонусы</h3>
                  <p className="text-sm text-gray-400">Получайте 500 SY каждый месяц продления подписки.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#181a20] rounded-lg border border-[#2d313a] mb-6">
              <div>
                <div className="text-sm text-gray-400">Стоимость</div>
                <div className="text-2xl font-bold text-white font-mono">150 SY <span className="text-sm text-gray-500 font-normal">/ месяц</span></div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-colors">
                Оформить
              </button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Подписка продлевается автоматически. Отменить можно в любой момент в настройках профиля.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Subscription;
