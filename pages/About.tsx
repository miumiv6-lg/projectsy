import React from 'react';
import { Info, Calendar, MapPin, Gamepad2, Train, Users, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  setPage?: (page: Page) => void;
}

const About: React.FC<AboutProps> = ({ setPage }) => {
  const timeline = [
    { year: '2022', title: 'Начало', description: 'Создание проекта в Roblox', color: 'bg-red-500/80' },
    { year: '2023', title: 'Рост', description: 'Развитие комьюнити, новые карты', color: 'bg-orange-500/80' },
    { year: '2024', title: 'Пик', description: '400K+ визитов, активное сообщество', color: 'bg-yellow-500/80' },
    { year: '2025', title: 'Переезд', description: 'Переход в Garry\'s Mod', color: 'bg-brand-blue' },
  ];

  const features = [
    { icon: Train, title: 'Metrostroi', description: 'Реалистичный симулятор метро' },
    { icon: Gamepad2, title: 'NoRank', description: 'Свободная езда без экзаменов' },
    { icon: Users, title: 'Комьюнити', description: 'Дружелюбное сообщество' },
    { icon: MapPin, title: 'Карты', description: 'Атмосферные локации' },
  ];

  return (
    <div className="w-full px-4 max-w-4xl mx-auto pb-20 pt-24">
      {/* Header */}
      <div className="text-center py-10 animate-ios-slide-up">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
          <Info size={28} className="text-brand-blue" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">О проекте</h1>
        <p className="text-white/40 text-lg">История Project SY</p>
      </div>

      {/* Main Story - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 md:p-8 mb-6 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
        <h2 className="text-xl font-bold text-white mb-4">Кто мы?</h2>
        <div className="space-y-4 text-white/50 leading-relaxed">
          <p>
            <span className="text-white font-medium">Project SY</span> — это проект про метро, 
            который начался в 2022 году в Roblox. За три года мы создали атмосферные карты, 
            собрали комьюнити из сотен игроков и набрали более 400 тысяч визитов.
          </p>
          <p>
            В 2025 году, после блокировки Roblox в России, мы приняли решение о переезде 
            в <span className="text-brand-blue font-medium">Garry's Mod</span> с аддоном Metrostroi. 
            Это открыло нам возможности для создания качественной симуляции с реалистичной физикой.
          </p>
        </div>
      </div>

      {/* Timeline - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 md:p-8 mb-6 animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
        <div className="flex items-center gap-2 mb-6">
          <Calendar size={18} className="text-white/40" />
          <h2 className="text-xl font-bold text-white">История</h2>
        </div>
        <div className="relative">
          {/* Line */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-white/[0.08]" />
          
          <div className="space-y-6">
            {timeline.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 z-10`}>
                  {item.year.slice(2)}
                </div>
                <div className="pt-1">
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-white/40 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features - Liquid Glass */}
      <div className="grid grid-cols-2 gap-3 mb-6 animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards">
        {features.map((feature, idx) => (
          <div key={idx} className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-5 hover:bg-white/[0.06] transition-colors">
            <feature.icon size={22} className="text-brand-blue mb-3" />
            <h3 className="font-bold text-white mb-1">{feature.title}</h3>
            <p className="text-white/40 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA - Liquid Glass Button */}
      {setPage && (
        <button
          onClick={() => setPage(Page.PLAY)}
          className="w-full bg-brand-blue hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors animate-ios-slide-up delay-400 opacity-0 fill-mode-forwards"
        >
          Начать играть
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
};

export default About;
