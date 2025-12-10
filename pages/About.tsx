import React from 'react';
import { Info, Calendar, MapPin, Gamepad2, Train, Users, ArrowRight, Sparkles } from 'lucide-react';
import { Page } from '../types';

interface AboutProps {
  setPage?: (page: Page) => void;
}

const About: React.FC<AboutProps> = ({ setPage }) => {
  const timeline = [
    { year: '2022', title: 'Начало', description: 'Создание проекта в Roblox' },
    { year: '2023', title: 'Рост', description: 'Развитие комьюнити, новые карты' },
    { year: '2024', title: 'Пик', description: '400K+ визитов, активное сообщество' },
    { year: '2025', title: 'Переезд', description: 'Переход в Garry\'s Mod' },
  ];

  const features = [
    { icon: Train, title: 'Metrostroi', description: 'Реалистичный симулятор метро с детальной физикой' },
    { icon: Gamepad2, title: 'NoRank', description: 'Свободная езда без экзаменов и рангов' },
    { icon: Users, title: 'Комьюнити', description: 'Дружелюбное сообщество единомышленников' },
    { icon: MapPin, title: 'Карты', description: 'Уникальные атмосферные локации' },
  ];

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-12 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Info size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">О проекте</h1>
          <p className="text-[#adadb8]">История и ценности Project SY</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Story Section */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles size={20} className="text-primary" />
              Наша история
            </h2>
            <div className="bg-[#18181b] rounded-md border border-[#2f2f35] p-6 text-[#efeff1] leading-relaxed space-y-4">
              <p>
                <strong className="text-primary">Project SY</strong> — это проект про метро, 
                который начался в 2022 году в Roblox. За три года мы создали атмосферные карты, 
                собрали комьюнити из сотен игроков и набрали более 400 тысяч визитов.
              </p>
              <p>
                В 2025 году, после блокировки Roblox в России, мы приняли решение о переезде 
                в <strong className="text-primary">Garry's Mod</strong> с аддоном Metrostroi. 
                Это открыло нам возможности для создания качественной симуляции с реалистичной физикой.
              </p>
            </div>
          </section>

          {/* Timeline Section */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Хронология
            </h2>
            <div className="bg-[#18181b] rounded-md border border-[#2f2f35] p-6">
              <div className="relative border-l border-[#2f2f35] ml-3 space-y-8">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8">
                    <div className="absolute left-[-5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-[#18181b]" />
                    <div>
                      <span className="text-xs font-mono text-primary font-bold mb-1 block">{item.year}</span>
                      <h3 className="text-white font-bold mb-1">{item.title}</h3>
                      <p className="text-sm text-[#adadb8]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* Sidebar Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">Особенности</h2>
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="bg-[#18181b] rounded-md border border-[#2f2f35] p-4 hover:border-primary transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm mb-1">{feature.title}</h3>
                  <p className="text-xs text-[#adadb8] leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}

          {setPage && (
            <button
              onClick={() => setPage(Page.PLAY)}
              className="w-full mt-6 h-12 bg-primary text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Начать играть
              <ArrowRight size={18} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default About;
