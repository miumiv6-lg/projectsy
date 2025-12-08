import React from 'react';
import { BookOpen, TrafficCone, Gauge } from 'lucide-react';

const Theory: React.FC = () => {
  return (
    <div className="w-full px-4 max-w-3xl mx-auto">
      <div className="text-center py-10 animate-ios-slide-up">
        <h1 className="text-4xl font-bold text-white mb-2">Теория</h1>
        <p className="text-gray-400">База знаний машиниста</p>
      </div>

      <div className="space-y-8">
        
        {/* Card 1 */}
        <div className="bg-[#1C1C1E] rounded-[32px] overflow-hidden animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
           <div className="p-6 pb-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                 <Gauge size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Управление</h2>
           </div>
           <div className="p-6">
             <p className="text-gray-400 font-medium mb-6">
               Поезд имеет инерцию. Главное — контроль тормозной магистрали.
             </p>
             <div className="bg-[#2C2C2E] rounded-2xl overflow-hidden">
               {["Контроллер (КВ)", "Тормозной кран (№334/013)", "АРС-АЛС Система"].map((item, idx, arr) => (
                 <div key={idx} className="relative p-4 pl-6 text-white font-medium">
                   {item}
                   {idx !== arr.length - 1 && <div className="absolute bottom-0 left-6 right-0 h-[1px] bg-[#38383A]" />}
                 </div>
               ))}
             </div>
           </div>
        </div>

        {/* Card 2 */}
        <div className="bg-[#1C1C1E] rounded-[32px] overflow-hidden animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
           <div className="p-6 pb-0 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
                 <TrafficCone size={24} />
              </div>
              <h2 className="text-2xl font-bold text-white">Сигнализация</h2>
           </div>
           <div className="p-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#2C2C2E] p-4 rounded-2xl border-l-4 border-green-500">
                  <div className="font-bold text-white">Зеленый</div>
                  <div className="text-xs text-gray-400">Путь свободен</div>
                </div>
                <div className="bg-[#2C2C2E] p-4 rounded-2xl border-l-4 border-yellow-500">
                  <div className="font-bold text-white">Желтый</div>
                  <div className="text-xs text-gray-400">Внимание</div>
                </div>
                <div className="bg-[#2C2C2E] p-4 rounded-2xl border-l-4 border-red-500">
                  <div className="font-bold text-white">Красный</div>
                  <div className="text-xs text-gray-400">Стоп!</div>
                </div>
                <div className="bg-[#2C2C2E] p-4 rounded-2xl border-l-4 border-blue-500">
                  <div className="font-bold text-white">Синий</div>
                  <div className="text-xs text-gray-400">Маневровый</div>
                </div>
             </div>
           </div>
        </div>

        {/* Action Button */}
        <button className="w-full py-5 bg-[#1C1C1E] text-brand-blue font-bold text-lg rounded-[24px] active-scale hover:bg-[#2C2C2E] transition-colors animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards">
          Начать Экзамен
        </button>

      </div>
    </div>
  );
};

export default Theory;