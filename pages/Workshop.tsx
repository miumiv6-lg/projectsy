import React from 'react';
import { ExternalLink, AlertTriangle, Package, CheckCircle2 } from 'lucide-react';

const LiquidBackground = () => (
  <div className="fixed inset-0 z-0 bg-black pointer-events-none" />
);

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden
      bg-white/5 backdrop-blur-3xl 
      border border-white/10 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
      hover:bg-white/10 hover:border-white/20 hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.5)]
      transition-all duration-300 ease-out
      ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const Workshop: React.FC = () => {
  return (
    <div className="relative w-full min-h-screen">
      <LiquidBackground />

      <div className="relative z-10 w-full px-4 max-w-5xl mx-auto pb-20 pt-6">

        {/* Header */}
        <div className="text-center py-12 animate-ios-slide-up">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Мастерская
          </h1>
          <p className="text-xl text-white/50 font-light tracking-wide max-w-2xl mx-auto">
            Контент для комфортной и правильной игры на сервере Project SY
          </p>
        </div>

        {/* Warning Banner */}
        <div className="mb-10 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
          <div className="
              relative overflow-hidden
              bg-yellow-500/10 backdrop-blur-xl 
              border border-yellow-500/20 
              rounded-[32px] p-6 md:p-8
              flex flex-col md:flex-row items-start gap-6
          ">
            <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center flex-shrink-0 border border-yellow-500/10">
              <AlertTriangle className="text-yellow-400" size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-yellow-500 mb-2">Проблемы с текстурами?</h3>
              <p className="text-white/70 text-base leading-relaxed">
                Если вы видите <span className="text-red-400 font-bold">ERROR</span> или фиолетово-чёрную сетку, подпишитесь на нашу коллекцию.
                Все необходимые ассеты и аддоны скачаются автоматически.
              </p>
            </div>
          </div>
        </div>

        {/* Metrostroi */}
        <GlassCard className="rounded-[40px] p-8 mb-8 animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards group">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="w-24 h-24 rounded-[32px] bg-blue-500/20 flex items-center justify-center flex-shrink-0 border border-white/5 group-hover:scale-105 transition-transform duration-500">
              <Package className="text-blue-400" size={48} />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <h3 className="text-3xl font-bold text-white">Metrostroi</h3>
                <span className="px-4 py-1.5 bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wider rounded-full">
                  Обязательно
                </span>
              </div>
              <p className="text-white/60 text-lg mb-2 font-light">
                Базовый аддон симулятора метро. Без него сервер не будет работать корректно.
              </p>
              <div className="flex items-center gap-4 text-sm text-white/30 font-medium">
                <span>Размер: ~2 GB</span>
                <span>•</span>
                <span>Версия: Latest</span>
              </div>
            </div>

            <a
              href="https://steamcommunity.com/sharedfiles/filedetails/?id=1098503782"
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 px-8 bg-white text-black hover:bg-white/90 font-bold rounded-2xl transition-all shadow-lg shadow-white/10 flex items-center justify-center gap-3 active:scale-95"
            >
              <span>Открыть</span>
              <ExternalLink size={18} />
            </a>
          </div>
        </GlassCard>

        {/* Collection Link */}
        <GlassCard className="rounded-[40px] p-10 text-center animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards relative z-0">


          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
              <img
                src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF"
                alt="Steam"
                className="w-10 h-10 opacity-80"
              />
            </div>

            <h3 className="text-3xl font-bold text-white mb-3">Коллекция сервера</h3>
            <p className="text-white/50 text-lg mb-8 max-w-lg mx-auto">
              Мы готовим полный список аддонов. Коллекция появится здесь в ближайшее время.
            </p>

            <div className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/5 text-white/30 font-bold rounded-2xl cursor-not-allowed">
              <ExternalLink size={20} />
              Скоро будет доступно
            </div>
          </div>
        </GlassCard>

        {/* Instructions */}
        <div className="mt-12 animate-ios-slide-up delay-400 opacity-0 fill-mode-forwards">
          <h3 className="text-2xl font-bold text-white mb-8 pl-4">Инструкция по установке</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              "Войдите в свой аккаунт Steam",
              "Перейдите на страницу коллекции или аддона",
              "Нажмите кнопку «Подписаться на все»",
              "Запустите Garry's Mod для загрузки"
            ].map((step, idx) => (
              <GlassCard key={idx} className="p-6 rounded-[28px] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 font-bold text-lg flex items-center justify-center border border-blue-500/10">
                  {idx + 1}
                </div>
                <span className="text-white/80 font-medium">{step}</span>
              </GlassCard>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Workshop;
