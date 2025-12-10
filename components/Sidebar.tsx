import React, { useState } from 'react';
import { 
  Home, Gamepad2, Newspaper, BookOpen, Users, HelpCircle, 
  Shield, MessageSquare, Mail, ChevronLeft, ChevronRight, Settings
} from 'lucide-react';
import { Page, UserRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, isCollapsed, toggleCollapse }) => {
  const { hasPermission } = useAuth();
  const isModerator = hasPermission(UserRole.MODERATOR);

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
    ...(isModerator ? [{ label: 'Админка', value: Page.ADMIN, icon: Settings }] : []),
  ];

  return (
    <aside 
      className={`fixed left-0 top-[3.5rem] bottom-0 z-40 flex flex-col bg-[#1f1f23] border-r border-white/5 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-[50px]' : 'w-[240px]'
      }`}
    >
      <div className="flex items-center justify-between p-3 mb-2">
        {!isCollapsed && (
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-white/80">
            Навигация
          </h2>
        )}
        <button 
          onClick={toggleCollapse}
          className="p-1 rounded hover:bg-white/10 text-white/70 hover:text-white ml-auto"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.value;
          
          return (
          <button 
            key={item.value}
            onClick={() => setPage(item.value)}
            className={`
              w-full flex items-center gap-3 px-2 py-2 rounded-md transition-colors group relative cursor-pointer
              ${isActive 
                ? 'bg-[#26262c] text-white' 
                : 'text-[#adadb8] hover:bg-[#26262c] hover:text-white'
              }
            `}
            title={isCollapsed ? item.label : undefined}
          >
              <div className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>
                <Icon size={20} />
              </div>
              
              {!isCollapsed && (
                <span className="text-[14px] font-medium truncate">
                  {item.label}
                </span>
              )}

              {/* Active Indicator Strip */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 bg-primary rounded-r-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Area (Optional) */}
      {!isCollapsed && (
        <div className="p-4 border-t border-white/5">
          <div className="text-xs text-[#adadb8]">
            <p>© 2025 Project SY</p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
