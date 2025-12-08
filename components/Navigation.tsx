import React, { useState, useEffect } from 'react';
import { Menu, X, Home, Gamepad2, Users, BookOpen, HelpCircle, Newspaper, Mail, MessageSquare, Shield } from 'lucide-react';
import { Page, UserRole } from '../types';
import ProfileButton from './ProfileButton';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentPage, setPage }) => {
  const { hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isModerator = hasPermission(UserRole.MODERATOR);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  const menuItems = [
    { label: 'Главная', value: Page.HOME, icon: Home },
    { label: 'Играть', value: Page.PLAY, icon: Gamepad2 },
    { label: 'Новости', value: Page.NEWS, icon: Newspaper },
    { label: 'О Проекте', value: Page.ABOUT, icon: BookOpen },
    { label: 'Команда', value: Page.TEAM, icon: Users },
    { label: 'FAQ', value: Page.FAQ, icon: HelpCircle },
    { label: 'Правила', value: Page.RULES, icon: Shield },
    { label: 'Форум', value: Page.FORUM, icon: MessageSquare },
    { label: 'Контакты', value: Page.CONTACTS, icon: Mail },
    ...(isModerator ? [{ label: 'Админка', value: Page.ADMIN, icon: Shield }] : []),
  ];

  const handleNavClick = (page: Page) => {
    setPage(page);
    setIsOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ${
          scrolled || isOpen
            ? 'w-[95%] max-w-[900px]'
            : 'w-[90%] max-w-[800px]'
        }`}
      >
        {/* Liquid Glass Container */}
        <div className={`
          relative rounded-[24px] transition-all duration-300
          bg-white/[0.06] backdrop-blur-2xl
          border border-white/[0.1]
          ${scrolled ? 'bg-white/[0.08]' : ''}
        `}>

          <div className="relative px-4 sm:px-6">
            <div className="flex items-center justify-between h-14">
              {/* Logo */}
              <button
                className="flex items-center gap-2.5 group"
                onClick={() => handleNavClick(Page.HOME)}
              >
                <img
                  src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg"
                  alt="Project SY"
                    className="w-8 h-8 rounded-xl object-cover border border-white/10"
                />
                <span className="text-sm font-semibold text-white/90">Project SY</span>
              </button>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center gap-0.5">
                {menuItems.slice(0, 5).map((item) => (
                  <button
                    key={item.value}
                    onClick={() => handleNavClick(item.value)}
                    className={`
                      relative px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300
                      ${currentPage === item.value
                        ? 'text-white'
                        : 'text-white/60 hover:text-white/90'
                      }
                    `}
                  >
                    {currentPage === item.value && (
                      <div className="absolute inset-0 rounded-xl bg-white/[0.1] border border-white/[0.08]" />
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                ))}

                <button
                  onClick={() => setIsOpen(true)}
                  className="ml-1 w-9 h-9 rounded-xl text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <Menu size={18} />
                </button>

                <div className="ml-2">
                  <ProfileButton setPage={setPage} variant="desktop" />
                </div>
              </div>

              {/* Mobile */}
              <div className="md:hidden flex items-center gap-2">
                <ProfileButton setPage={setPage} variant="desktop" />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-9 h-9 rounded-xl bg-white/10 text-white/80 hover:text-white flex items-center justify-center transition-colors"
                >
                  {isOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Full Screen Menu - Liquid Glass Style */}
      {isOpen && (
        <div className="fixed inset-0 z-40 animate-fade-in" data-lenis-prevent>
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" onClick={() => setIsOpen(false)} />
          
          {/* Menu Panel */}
          <div className="absolute inset-4 sm:inset-8 flex flex-col rounded-[32px] overflow-hidden
            bg-white/[0.08] backdrop-blur-2xl border border-white/[0.12]
            shadow-[0_32px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
            animate-ios-slide-up
          ">


            {/* Header */}
            <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <img
                  src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg"
                  alt="Logo"
                  className="w-10 h-10 rounded-2xl ring-2 ring-white/20"
                />
                <div>
                  <span className="text-lg font-bold text-white">Project SY</span>
                  <p className="text-xs text-white/40">Metrostroi Server</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu Content */}
            <div className="relative flex-1 overflow-y-auto px-6 py-6">
              <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
                {menuItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.value;
                  return (
                    <button
                      key={item.value}
                      onClick={() => handleNavClick(item.value)}
                      className={`
                        relative flex flex-col items-center gap-3 p-5 rounded-3xl transition-all duration-300
                        ${isActive
                          ? 'bg-brand-blue/30 border-brand-blue/50'
                          : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/[0.08]'
                        }
                        border backdrop-blur-sm
                        shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]
                        hover:scale-[1.02] hover:shadow-lg
                      `}
                      style={{ animationDelay: `${idx * 40}ms` }}
                    >
                      <div className={`
                        w-12 h-12 rounded-2xl flex items-center justify-center
                        ${isActive 
                          ? 'bg-brand-blue text-white shadow-[0_4px_20px_rgba(0,122,255,0.4)]' 
                          : 'bg-white/10 text-white/70'
                        }
                        transition-all
                      `}>
                        <Icon size={24} />
                      </div>
                      <span className={`font-medium text-sm ${isActive ? 'text-white' : 'text-white/70'}`}>
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Profile */}
              <div className="max-w-md mx-auto mt-6">
                <ProfileButton
                  setPage={(page) => {
                    setPage(page);
                    setIsOpen(false);
                  }}
                  variant="mobile"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="relative px-6 py-4 border-t border-white/[0.08] text-center">
              <p className="text-white/30 text-sm">© 2022-2025 Project SY</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
