import React, { useState, useEffect } from 'react';
import { Menu, X, Search, Bell, Inbox, HelpCircle } from 'lucide-react';
import { Page } from '../types';
import ProfileButton from './ProfileButton';

interface NavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close menu when pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const allNavLinks = [
    { label: 'Главная', page: Page.HOME, section: 'main' },
    { label: 'Играть', page: Page.PLAY, section: 'main' },
    { label: 'О нас', page: Page.ABOUT, section: 'main' },
    { label: 'Новости', page: Page.NEWS, section: 'main' },
    { label: 'Форум', page: Page.FORUM, section: 'community' },
    { label: 'Мастерская', page: Page.WORKSHOP, section: 'community' },
    { label: 'Команда', page: Page.TEAM, section: 'info' },
    { label: 'FAQ', page: Page.FAQ, section: 'info' },
    { label: 'Правила', page: Page.RULES, section: 'info' },
    { label: 'Контакты', page: Page.CONTACTS, section: 'info' },
  ];

  return (
    <>
      {/* Navigation Bar (Twitch Style) */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 h-[3.5rem] bg-[#18181b] border-b border-[#000] shadow-sm flex items-center px-4 justify-between"
      >
        {/* Left: Logo & Links */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setPage(Page.HOME)}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-black group-hover:opacity-90 transition-opacity">
               <span className="font-bold text-sm">SY</span>
            </div>
            <span className="font-semibold text-lg text-[#efeff1] tracking-tight hidden sm:block group-hover:text-primary transition-colors">
              Project SY
            </span>
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setPage(Page.HOME)}
              className={`text-sm font-semibold hover:text-primary transition-colors ${currentPage === Page.HOME ? 'text-primary' : 'text-[#efeff1]'}`}
            >
              Обзор
            </button>
            <button 
               onClick={() => window.open('https://store.steampowered.com', '_blank')}
               className="text-sm font-semibold text-[#efeff1] hover:text-primary transition-colors"
            >
              Контент
            </button>
             <button 
               onClick={() => setPage(Page.FAQ)}
               className="text-sm font-semibold text-[#efeff1] hover:text-primary transition-colors"
            >
              Помощь
            </button>
          </div>
        </div>

        {/* Center: Search (Visual - adapted for Wiki/Players search) */}
        <div className="hidden md:flex flex-1 max-w-[400px] mx-4">
          <div className="relative w-full group">
            <input 
              type="text" 
              placeholder="Поиск по вики или игрокам..." 
              className="w-full h-[36px] bg-[#0e0e10] border border-[#2f2f35] rounded-l-md pl-9 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-black transition-all"
            />
            <Search size={18} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white" />
            <button className="absolute right-[-32px] top-0 h-[36px] w-[32px] bg-[#2f2f35] flex items-center justify-center rounded-r-md hover:bg-[#3f3f46]">
               <Search size={18} className="text-[#efeff1]" />
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <button className="p-1.5 text-[#efeff1] hover:bg-[#2f2f35] rounded-md transition-colors relative" title="Уведомления сервера">
               <Inbox size={20} />
            </button>
          </div>

          <ProfileButton 
            setPage={setPage} 
            variant="desktop" 
            onOpenNavigation={() => setMobileMenuOpen(true)}
          />

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden w-8 h-8 flex items-center justify-center text-white hover:bg-[#2f2f35] rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          mobileMenuOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-[280px] bg-[#18181b] shadow-xl transform transition-transform duration-200 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          
          {/* Header */}
          <div className="h-[3.5rem] flex items-center justify-between px-4 border-b border-[#2f2f35]">
            <span className="font-semibold text-lg text-white">Меню</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-[#2f2f35] rounded-md text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {allNavLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setPage(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPage === link.page
                      ? 'bg-[#26262c] text-primary'
                      : 'text-[#adadb8] hover:bg-[#26262c] hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  {currentPage === link.page && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[#2f2f35] px-3">
               <p className="text-xs text-[#adadb8] uppercase font-bold tracking-wider mb-2">Аккаунт</p>
               {/* Additional account links could go here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
