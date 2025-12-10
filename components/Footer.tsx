import React from 'react';
import { Page } from '../types';
import { Package, Send, Github } from 'lucide-react';

interface FooterProps {
  setPage: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
  return (
    <footer className="w-full bg-[#0e0e10] border-t border-[#2f2f35] py-12">
      <div className="max-w-[1600px] mx-auto px-6">
        
        <div className="flex flex-col md:flex-row justify-between gap-12">
          
          {/* Logo & Info */}
          <div className="flex flex-col gap-4 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black font-bold text-sm">
                SY
              </div>
              <span className="text-xl font-bold text-[#efeff1]">Project SY</span>
            </div>
            <p className="text-sm text-[#adadb8] leading-relaxed">
              Современный сервер Metrostroi в Garry's Mod. 
              Реалистичная физика, отсутствие рангов и дружелюбное комьюнити.
            </p>
            <div className="text-xs text-[#adadb8]/60 mt-2">
              © 2025 Project SY. Not affiliated with Valve Corporation.
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#efeff1] uppercase tracking-wider">Навигация</h4>
              <button onClick={() => setPage(Page.HOME)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Главная</button>
              <button onClick={() => setPage(Page.PLAY)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Играть</button>
              <button onClick={() => setPage(Page.NEWS)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Новости</button>
              <button onClick={() => setPage(Page.ABOUT)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">О проекте</button>
            </div>

            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold text-[#efeff1] uppercase tracking-wider">Поддержка</h4>
              <button onClick={() => setPage(Page.FAQ)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">FAQ</button>
              <button onClick={() => setPage(Page.RULES)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Правила</button>
              <button onClick={() => setPage(Page.TEAM)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Команда</button>
              <button onClick={() => setPage(Page.CONTACTS)} className="text-sm text-[#adadb8] hover:text-primary text-left transition-colors">Контакты</button>
            </div>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-[#efeff1] uppercase tracking-wider">Социальные сети</h4>
            <div className="flex gap-3">
              <a 
                href="https://t.me/projectsy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded bg-[#1f1f23] hover:bg-[#2f2f35] flex items-center justify-center text-[#adadb8] hover:text-[#efeff1] transition-colors"
              >
                <Send size={18} />
              </a>
              <button 
                onClick={() => setPage(Page.WORKSHOP)}
                className="w-10 h-10 rounded bg-[#1f1f23] hover:bg-[#2f2f35] flex items-center justify-center text-[#adadb8] hover:text-[#efeff1] transition-colors"
              >
                <Package size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
