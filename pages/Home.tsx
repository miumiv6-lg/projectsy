import React, { useState } from 'react';
import { Page } from '../types';
import { ChevronRight, Play, Newspaper, Users, Train, Gamepad2, Calendar, ArrowRight, Activity, Globe } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
}

// iOS 26 Liquid Glass Background - Clean minimal style
const LiquidGlassBackground = () => (
  <div className="fixed inset-0 z-0 bg-black pointer-events-none overflow-hidden" />
);

// Liquid Glass Card Component - Clean iOS style without glow
interface LiquidCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const LiquidCard: React.FC<LiquidCardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-white/[0.04] backdrop-blur-2xl
        border border-white/[0.08]
        hover:bg-white/[0.07] hover:border-white/[0.12]
        transition-all duration-300 ease-out
        ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

const Home: React.FC<HomeProps> = ({ setPage }) => {
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  return (
    <div className="relative w-full min-h-screen">
      <LiquidGlassBackground />

      <div className="relative z-10 w-full px-4 max-w-[1400px] mx-auto pb-20 pt-24">

        {/* HERO SECTION - Liquid Glass Style */}
        <section
          className="relative w-full min-h-[70vh] rounded-[48px] overflow-hidden flex flex-col items-center justify-center text-center p-8 mb-8 animate-ios-slide-up group"
          onMouseEnter={() => setIsHeroHovered(true)}
          onMouseLeave={() => setIsHeroHovered(false)}
        >
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-white/[0.02] backdrop-blur-3xl" />
            <img
              src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg"
              className={`w-full h-full object-cover opacity-10 transition-all duration-[2s] ease-out ${isHeroHovered ? 'scale-110 opacity-15' : 'scale-105'}`}
              alt="Background"
            />
            <div className="absolute inset-0 bg-black/70" />
          </div>

          {/* Glass border effect */}
          <div className="absolute inset-0 rounded-[48px] border border-white/[0.08] pointer-events-none" />
          <div className="absolute inset-[1px] rounded-[47px] border border-white/[0.03] pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            {/* Logo with glass effect */}
            <div className="relative mb-10 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
              <div className="w-28 h-28 rounded-[32px] overflow-hidden border border-white/[0.1]">
                <img
                  src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg"
                  alt="Project SY"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6 animate-ios-slide-up delay-150 opacity-0 fill-mode-forwards">
              <span className="text-sm font-medium text-white/50 uppercase tracking-[0.3em]">Metrostroi Server</span>
            </div>

            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-6 animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
              Project <span className="text-brand-blue">SY</span>
            </h1>

            <p className="text-lg md:text-xl text-white/40 font-light mb-12 max-w-xl leading-relaxed animate-ios-slide-up delay-250 opacity-0 fill-mode-forwards">
              Погрузитесь в мир метрополитена. <br className="hidden md:block" />
              <span className="text-white/70">Свобода. Реализм. Атмосфера.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards">
              <button
                onClick={() => setPage(Page.PLAY)}
                className="group/btn relative h-14 px-8 rounded-2xl font-semibold text-base overflow-hidden transition-all duration-300 hover:scale-105"
              >
                {/* Button glass background */}
                <div className="absolute inset-0 bg-blue-500 opacity-90" />
                <div className="absolute inset-0 bg-blue-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  <Play size={18} fill="currentColor" />
                  Начать Играть
                </span>
              </button>
              
              <button
                onClick={() => setPage(Page.ABOUT)}
                className="h-14 px-8 rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/[0.1] hover:bg-white/[0.1] hover:border-white/[0.2] text-white/80 hover:text-white font-semibold text-base transition-all duration-300 hover:scale-105 flex items-center justify-center"
              >
                О Проекте
              </button>
            </div>
          </div>
        </section>

        {/* FEATURES GRID - Liquid Glass */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-ios-slide-up delay-400 opacity-0 fill-mode-forwards">
          {[
            { icon: Train, label: 'Симулятор', value: 'Metrostroi', color: 'blue' },
            { icon: Gamepad2, label: 'Режим', value: 'NoRank', color: 'purple' },
            { icon: Users, label: 'Слоты', value: '32', color: 'green' },
            { icon: Calendar, label: 'Основан', value: '2022', color: 'orange' },
          ].map((item, idx) => (
            <LiquidCard key={idx} className="rounded-[28px] p-6 text-center group">
              <div className={`
                mb-4 inline-flex p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110
                ${item.color === 'blue' ? 'bg-blue-500/10 text-blue-400' : ''}
                ${item.color === 'purple' ? 'bg-purple-500/10 text-purple-400' : ''}
                ${item.color === 'green' ? 'bg-green-500/10 text-green-400' : ''}
                ${item.color === 'orange' ? 'bg-orange-500/10 text-orange-400' : ''}
              `}>
                <item.icon size={26} />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
              <div className="text-[11px] text-white/30 uppercase tracking-[0.2em] font-semibold">{item.label}</div>
            </LiquidCard>
          ))}
        </div>

        {/* MAIN CONTENT - Liquid Glass */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8">

          {/* About Card */}
          <LiquidCard className="lg:col-span-3 rounded-[36px] p-10 animate-ios-slide-up delay-500 opacity-0 fill-mode-forwards flex flex-col justify-between min-h-[380px] group">
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] border border-white/[0.08] text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-8">
                История
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                От Roblox к вершинам <br /> 
                <span className="text-blue-400">Garry's Mod</span>
              </h2>
              <p className="text-white/40 text-lg leading-relaxed font-light max-w-xl">
                Project SY зародился в 2022 году. Мы прошли путь от простых карт в Roblox до создания одного из самых атмосферных серверов Metrostroi.
              </p>
            </div>

            <button
              onClick={() => setPage(Page.ABOUT)}
              className="mt-8 self-start flex items-center gap-3 text-white/70 font-medium group/btn hover:text-white transition-colors"
            >
              <span>Читать историю</span>
              <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center group-hover/btn:bg-blue-500/20 group-hover/btn:border-blue-500/30 group-hover/btn:scale-110 transition-all">
                <ArrowRight size={16} />
              </div>
            </button>
          </LiquidCard>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-4 animate-ios-slide-up delay-600 opacity-0 fill-mode-forwards">
            {[
              { page: Page.NEWS, icon: Newspaper, title: 'Новости', desc: 'Последние обновления', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
              { page: Page.TEAM, icon: Users, title: 'Команда', desc: 'Создатели проекта', iconBg: 'bg-purple-500/10', iconColor: 'text-purple-400' },
              { page: Page.FAQ, icon: () => <span className="text-2xl font-bold">?</span>, title: 'FAQ', desc: 'Помощь и ответы', iconBg: 'bg-yellow-500/10', iconColor: 'text-yellow-400' },
            ].map((item, idx) => (
              <LiquidCard
                key={idx}
                onClick={() => setPage(item.page)}
                className="flex-1 rounded-[28px] p-5 flex items-center gap-5 group"
              >
                <div className={`w-14 h-14 rounded-2xl ${item.iconBg} flex items-center justify-center border border-white/[0.05] group-hover:scale-105 transition-transform duration-300 ${item.iconColor}`}>
                  <item.icon size={26} />
                </div>
                <div className="flex-1">
                  <div className="text-lg font-semibold text-white mb-0.5">{item.title}</div>
                  <div className="text-sm text-white/30">{item.desc}</div>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center group-hover:bg-white/[0.08] transition-colors">
                  <ChevronRight size={18} className="text-white/40" />
                </div>
              </LiquidCard>
            ))}
          </div>
        </div>

        {/* STATS - Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-ios-slide-up delay-700 opacity-0 fill-mode-forwards">
          {[
            { val: '200+', label: 'В Telegram', icon: Globe, color: 'blue' },
            { val: '416K+', label: 'Визитов в Roblox', icon: Activity, color: 'purple' },
            { val: '3 года', label: 'Развития', icon: Calendar, color: 'green' }
          ].map((item, idx) => (
            <LiquidCard key={idx} className="p-8 rounded-[28px] text-center group">
              <div className="text-4xl font-bold text-white mb-3 group-hover:scale-110 transition-transform duration-300 inline-block">
                {item.val}
              </div>
              <div className="flex items-center justify-center gap-2 text-white/30 font-medium uppercase tracking-wider text-xs">
                <item.icon size={14} className={`
                  ${item.color === 'blue' ? 'text-blue-400' : ''}
                  ${item.color === 'purple' ? 'text-purple-400' : ''}
                  ${item.color === 'green' ? 'text-green-400' : ''}
                `} />
                {item.label}
              </div>
            </LiquidCard>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
