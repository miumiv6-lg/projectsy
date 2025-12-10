import React from 'react';
import { Page } from '../types';
import { Play, ArrowRight, Train, Users, Shield, Zap, Info, ChevronRight } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
}

const Home: React.FC<HomeProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen px-4 py-6 md:px-8">
      
      {/* ===== HERO SECTION (Twitch "Featured" Carousel Style) ===== */}
      <div className="w-full max-w-[1600px] mx-auto mb-12">
        <div className="relative w-full h-[400px] md:h-[450px] bg-[#18181b] rounded-lg overflow-hidden shadow-lg flex flex-col md:flex-row group transition-all hover:shadow-xl hover:shadow-primary/10">
          
          {/* Main Content Area */}
          <div className="relative flex-1 h-full overflow-hidden bg-[#000]">
             {/* Background Image / Video Placeholder */}
             <div className="absolute inset-0 bg-gradient-to-r from-[#000] via-transparent to-transparent z-10" />
             <div className="absolute inset-0 bg-[url('https://steamuserimages-a.akamaihd.net/ugc/2056508932644266184/0B293153545163D520D8F7B596F3D3C126838D64/')] bg-cover bg-center opacity-60 group-hover:opacity-80 transition-opacity duration-500 scale-105 group-hover:scale-100" />
             
             <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-12 max-w-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2 py-0.5 rounded bg-primary text-black font-bold text-xs uppercase tracking-wider">
                    Обновление 2.0
                  </span>
                  <span className="text-[#adadb8] text-sm font-semibold">
                    Уже доступно
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
                  Project <span className="text-primary">SY</span>
                </h1>
                
                <p className="text-[#efeff1] text-lg mb-8 font-medium line-clamp-3">
                  Реалистичный симулятор метрополитена в Garry's Mod. 
                  Управляйте поездами, общайтесь с игроками и стройте карьеру машиниста прямо сейчас.
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setPage(Page.PLAY)}
                    className="btn-primary h-12 px-6 text-base rounded-md flex items-center gap-2 hover:bg-primary/90"
                  >
                    <Play size={20} fill="currentColor" />
                    Начать игру
                  </button>
                  <button 
                    onClick={() => setPage(Page.ABOUT)}
                    className="btn-secondary h-12 px-6 text-base rounded-md flex items-center gap-2 bg-[#2f2f35] hover:bg-[#3f3f46]"
                  >
                    <Info size={20} />
                    Подробнее
                  </button>
                </div>
             </div>
          </div>

          {/* Sidebar Info (Twitch "Stream Info" Style) */}
          <div className="hidden lg:flex w-[320px] bg-[#18181b] flex-col border-l border-[#000]/20 p-6">
            <h3 className="text-[#efeff1] font-bold text-lg mb-4">Статистика сервера</h3>
            
            <div className="space-y-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center text-primary">
                    <Users size={20} />
                 </div>
                 <div>
                   <p className="text-sm text-[#adadb8] font-medium">Посещений</p>
                   <p className="text-white font-bold">400K+</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center text-primary">
                    <Zap size={20} />
                 </div>
                 <div>
                   <p className="text-sm text-[#adadb8] font-medium">Uptime</p>
                   <p className="text-white font-bold">24/7</p>
                 </div>
               </div>

               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center text-primary">
                    <Shield size={20} />
                 </div>
                 <div>
                   <p className="text-sm text-[#adadb8] font-medium">Ранги</p>
                   <p className="text-white font-bold">Отсутствуют</p>
                 </div>
               </div>
            </div>

            <div className="mt-auto pt-6 border-t border-[#2f2f35]">
               <p className="text-xs text-[#adadb8] leading-relaxed">
                 Сервер работает стабильно. Последняя перезагрузка была 2 часа назад.
               </p>
            </div>
          </div>

        </div>
      </div>

      {/* ===== FEATURES GRID (Twitch "Categories" Style) ===== */}
      <div className="w-full max-w-[1600px] mx-auto mb-16">
        <h2 className="text-xl font-bold text-[#efeff1] mb-4 hover:text-primary cursor-pointer transition-colors inline-flex items-center gap-1">
          <span className="text-primary">Рекомендуемые</span> разделы
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div 
            onClick={() => setPage(Page.NEWS)}
            className="group cursor-pointer relative"
          >
            <div className="aspect-video bg-[#1f1f23] rounded-md overflow-hidden mb-2 relative transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#a8c7fa]">
              <div className="absolute inset-0 flex items-center justify-center bg-[#2f2f35]">
                 <Train size={48} className="text-[#53535f] group-hover:text-primary transition-colors" />
              </div>
              <div className="absolute top-2 left-2 bg-[#eb0400] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm">
                LIVE
              </div>
            </div>
            <h3 className="font-bold text-[#efeff1] text-base leading-tight truncate group-hover:text-primary transition-colors">
              Новости проекта
            </h3>
            <p className="text-[#adadb8] text-sm truncate">Последние обновления и патчноуты</p>
            <div className="mt-1 flex gap-1">
              <span className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-0.5 rounded-full font-semibold">News</span>
              <span className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-0.5 rounded-full font-semibold">Updates</span>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setPage(Page.WORKSHOP)}
            className="group cursor-pointer relative"
          >
            <div className="aspect-video bg-[#1f1f23] rounded-md overflow-hidden mb-2 relative transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#a8c7fa]">
              <div className="absolute inset-0 flex items-center justify-center bg-[#2f2f35]">
                 <Train size={48} className="text-[#53535f] group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className="font-bold text-[#efeff1] text-base leading-tight truncate group-hover:text-primary transition-colors">
              Мастерская Steam
            </h3>
            <p className="text-[#adadb8] text-sm truncate">Коллекция аддонов для игры</p>
            <div className="mt-1 flex gap-1">
              <span className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-0.5 rounded-full font-semibold">Addons</span>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setPage(Page.RULES)}
            className="group cursor-pointer relative"
          >
             <div className="aspect-video bg-[#1f1f23] rounded-md overflow-hidden mb-2 relative transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#a8c7fa]">
              <div className="absolute inset-0 flex items-center justify-center bg-[#2f2f35]">
                 <Shield size={48} className="text-[#53535f] group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className="font-bold text-[#efeff1] text-base leading-tight truncate group-hover:text-primary transition-colors">
              Правила сервера
            </h3>
            <p className="text-[#adadb8] text-sm truncate">Ознакомьтесь перед игрой</p>
             <div className="mt-1 flex gap-1">
              <span className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-0.5 rounded-full font-semibold">Important</span>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => setPage(Page.FORUM)}
            className="group cursor-pointer relative"
          >
             <div className="aspect-video bg-[#1f1f23] rounded-md overflow-hidden mb-2 relative transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_#a8c7fa]">
              <div className="absolute inset-0 flex items-center justify-center bg-[#2f2f35]">
                 <Users size={48} className="text-[#53535f] group-hover:text-primary transition-colors" />
              </div>
            </div>
            <h3 className="font-bold text-[#efeff1] text-base leading-tight truncate group-hover:text-primary transition-colors">
              Форум сообщества
            </h3>
            <p className="text-[#adadb8] text-sm truncate">Общение, жалобы и предложения</p>
             <div className="mt-1 flex gap-1">
              <span className="bg-[#2f2f35] text-[#adadb8] text-xs px-2 py-0.5 rounded-full font-semibold">Chat</span>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative separator */}
      <div className="w-full max-w-[1600px] mx-auto h-[1px] bg-[#2f2f35] mb-12" />

    </div>
  );
};

export default Home;
