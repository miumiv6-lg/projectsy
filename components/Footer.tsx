import React from 'react';
import { Page } from '../types';
import { Package, Sparkles } from 'lucide-react';

interface FooterProps {
  setPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  const navLinks = [
    { label: 'Главная', page: Page.HOME },
    { label: 'Играть', page: Page.PLAY },
    { label: 'Новости', page: Page.NEWS },
    { label: 'О Проекте', page: Page.ABOUT },
  ];

  const supportLinks = [
    { label: 'FAQ', page: Page.FAQ },
    { label: 'Правила', page: Page.RULES },
    { label: 'Команда', page: Page.TEAM },
    { label: 'Контакты', page: Page.CONTACTS },
    { label: 'Мастерская', page: Page.WORKSHOP },
  ];

  return (
    <footer className="relative z-10 w-full px-4 pb-10">
      <div className="max-w-[1400px] mx-auto">
        {/* Liquid Glass Footer */}
        <div className="
          relative overflow-hidden
          bg-white/[0.03] backdrop-blur-2xl
          border border-white/[0.08]
          shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]
          rounded-[36px] p-8 md:p-12
        ">


          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">

            {/* Brand */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <img
                  src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg"
                  alt="Project SY"
                  className="w-12 h-12 rounded-2xl object-cover border border-white/10"
                />
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight">Project SY</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Sparkles size={12} className="text-blue-400" />
                    <span className="text-xs text-white/40 font-medium">Metrostroi Server</span>
                  </div>
                </div>
              </div>
              <p className="text-white/40 leading-relaxed max-w-sm font-light">
                Метрострой в Garry's Mod. Свободная езда, реалистичная физика, атмосфера настоящего метро.
              </p>

              {/* Social - Liquid Glass Buttons */}
              <div className="flex gap-3 pt-2">
                <a
                  href="#"
                  className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center transition-all duration-300"
                  title="Telegram"
                >
                  <img
                    src="https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF"
                    alt="Telegram"
                    className="w-5 h-5 opacity-60"
                  />
                </a>
                <button
                  onClick={() => setPage(Page.WORKSHOP)}
                  className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] flex items-center justify-center transition-all duration-300"
                  title="Steam Workshop"
                >
                  <Package size={18} className="text-white/60" />
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="md:col-span-3">
              <h4 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-6">Навигация</h4>
              <ul className="space-y-3">
                {navLinks.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => setPage(item.page)}
                      className="text-white/40 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 scale-0 group-hover:scale-100 transition-transform" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="md:col-span-3">
              <h4 className="text-white/80 font-semibold text-sm uppercase tracking-wider mb-6">Поддержка</h4>
              <ul className="space-y-3">
                {supportLinks.map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={() => setPage(item.page)}
                      className="text-white/40 hover:text-white transition-all duration-300 text-sm font-medium flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 scale-0 group-hover:scale-100 transition-transform" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom - Liquid Glass Divider */}
          <div className="relative z-10 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-white/25 text-sm font-medium">
              © 2022-2025 Project SY
            </span>
            <span className="text-white/15 text-xs font-medium px-4 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full">
              Not affiliated with Valve Corporation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
