import React, { useState } from 'react';
import { LogOut, Clock, Trophy, Star, Shield, ExternalLink, Copy, Check, Settings, MessageSquare, ChevronRight, Activity, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Page, UserRole } from '../types';

interface ProfileProps {
  setPage: (page: Page) => void;
}

const Profile: React.FC<ProfileProps> = ({ setPage }) => {
  const { user, isAuthenticated, logout, openLoginModal, hasPermission } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'settings'>('overview');

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 pt-8">
        <div className="w-24 h-24 rounded-3xl bg-surface-container-high flex items-center justify-center mb-8 animate-scale-in">
          <User size={48} className="text-on-surface-variant" />
        </div>
        <h1 className="headline-large text-on-surface mb-3">Войдите в аккаунт</h1>
        <p className="body-large text-on-surface-variant text-center mb-10 max-w-md">
          Авторизуйтесь через Steam, чтобы получить доступ к профилю, статистике и настройкам.
        </p>
        <button
          onClick={openLoginModal}
          className="h-14 px-8 rounded-full bg-[#1b2838] hover:bg-[#2a475e] text-white title-medium flex items-center gap-3 transition-all shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12c0 3.12.597 6.035 1.636 8.636l2.97-4.16c-.053-.28-.088-.567-.088-.86 0-2.486 2.014-4.5 4.5-4.5.293 0 .58.035.86.088l4.16-2.97C13.565 2.87 12.805 0 12 0zm6.916 6.773c-.05.27-.083.546-.083.826 0 2.485-2.015 4.5-4.5 4.5-.28 0-.556-.032-.826-.083l-2.97 4.16c1.17 1.632 2.83 2.91 4.79 3.654L18.916 6.773zM12 24c6.627 0 12-5.373 12-12 0-3.12-.597-6.035-1.636-8.636l-2.97 4.16c.053.28.088.567.088.86 0 2.486-2.014 4.5-4.5 4.5-.293 0-.58-.035-.86-.088l-4.16 2.97c2.503 5.277 8.16 8.834 14.684 8.834z"/>
          </svg>
          Войти через Steam
        </button>
      </div>
    );
  }

  const handleCopySteamId = () => {
    navigator.clipboard.writeText(user.steamId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    logout();
    setPage(Page.HOME);
  };

  const getRoleBadge = () => {
    if (!user.role) return null;
    const styles: Record<UserRole, { bg: string; text: string; label: string }> = {
      [UserRole.USER]: { bg: 'bg-surface-container-highest', text: 'text-on-surface', label: 'Игрок' },
      [UserRole.MODERATOR]: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'Модератор' },
      [UserRole.ADMIN]: { bg: 'bg-secondary-container', text: 'text-on-secondary-container', label: 'Администратор' },
      [UserRole.OWNER]: { bg: 'bg-error-container', text: 'text-on-error-container', label: 'Владелец' },
    };
    const style = styles[user.role];
    return (
      <span className={`px-3 py-1 rounded-full ${style.bg} ${style.text} label-medium`}>
        {style.label}
      </span>
    );
  };

  const stats = {
    hoursPlayed: 0,
    forumPosts: 0,
    achievements: { current: 0, total: 0 },
    joinDate: user.timecreated
      ? new Date(user.timecreated * 1000).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })
      : 'Неизвестно',
  };

  return (
    <div className="w-full px-6 max-w-5xl mx-auto pb-20 pt-8">
      
      {/* Profile Header */}
      <div className="relative mb-20 animate-fade-in">
        
        {/* Banner */}
        <div className="h-48 md:h-56 rounded-3xl bg-gradient-to-br from-primary-container via-surface-container to-tertiary-container/50 w-full" />
        
        {/* Avatar & Info */}
        <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
          <div className="relative">
            <div className="p-1 bg-background rounded-3xl">
              <img 
                src={user.avatarfull} 
                alt={user.personaname} 
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-5 h-5 bg-success rounded-full border-4 border-background" />
          </div>
          
          <div className="mb-4 hidden md:block">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="headline-large text-on-surface">{user.personaname}</h1>
              {getRoleBadge()}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCopySteamId}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors body-medium text-on-surface-variant"
              >
                <span className="font-mono">{user.steamId}</span>
                {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
              </button>
              <a
                href={user.profileurl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Admin Button */}
        {hasPermission(UserRole.MODERATOR) && (
          <button
            onClick={() => setPage(Page.ADMIN)}
            className="absolute top-6 right-6 px-5 py-2.5 bg-error-container text-on-error-container rounded-full label-large hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Shield size={18} />
            <span>Админ-панель</span>
          </button>
        )}
      </div>

      {/* Mobile Info */}
      <div className="md:hidden mb-8 px-2">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="headline-medium text-on-surface">{user.personaname}</h1>
          {getRoleBadge()}
        </div>
        <button
          onClick={handleCopySteamId}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container body-small text-on-surface-variant"
        >
          <span className="font-mono">{user.steamId}</span>
          {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {[
          { id: 'overview', label: 'Обзор' },
          { id: 'activity', label: 'Активность' },
          { id: 'settings', label: 'Настройки' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-6 py-3 rounded-full label-large whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-secondary-container text-on-secondary-container' 
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-slide-up">
        
        {activeTab === 'overview' && (
          <div className="space-y-5">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Clock, color: 'text-primary', value: stats.hoursPlayed, label: 'Часов в игре' },
                { icon: MessageSquare, color: 'text-tertiary', value: stats.forumPosts, label: 'Постов' },
                { icon: Trophy, color: 'text-secondary', value: stats.achievements.current, label: 'Достижений' },
                { icon: Star, color: 'text-error', value: '—', label: 'Ранг' },
              ].map((stat, idx) => (
                <div key={idx} className="m3-card p-6 hover:bg-surface-container-high transition-colors">
                  <stat.icon className={`w-7 h-7 ${stat.color} mb-4`} />
                  <div className="headline-medium text-on-surface mb-1">{stat.value}</div>
                  <div className="body-medium text-on-surface-variant">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Details Card */}
            <div className="m3-card overflow-hidden">
              <div className="p-6 border-b border-outline-variant/20">
                <h3 className="title-large text-on-surface">Подробности</h3>
              </div>
              <div>
                <div className="px-6 py-4 flex justify-between items-center hover:bg-surface-container-high transition-colors">
                  <span className="body-large text-on-surface-variant">Дата регистрации</span>
                  <span className="title-medium text-on-surface">{stats.joinDate}</span>
                </div>
                <div className="h-px bg-outline-variant/10 mx-6" />
                <div className="px-6 py-4 flex justify-between items-center hover:bg-surface-container-high transition-colors">
                  <span className="body-large text-on-surface-variant">Статус аккаунта</span>
                  <span className="px-3 py-1 rounded-full bg-success/10 text-success label-medium">Активен</span>
                </div>
                <div className="h-px bg-outline-variant/10 mx-6" />
                <div className="px-6 py-4 flex justify-between items-center hover:bg-surface-container-high transition-colors">
                  <span className="body-large text-on-surface-variant">Блокировки</span>
                  <span className="body-large text-on-surface-variant">Отсутствуют</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="m3-card overflow-hidden min-h-[300px]">
            <div className="p-6 border-b border-outline-variant/20">
              <h3 className="title-large text-on-surface">История действий</h3>
            </div>
            <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
              <Activity size={48} className="mb-4 opacity-30" />
              <p className="body-large">Активности пока нет</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-4">
            <div className="m3-card overflow-hidden">
              <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-container-high transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <Settings size={20} />
                  </div>
                  <div className="text-left">
                    <div className="title-medium text-on-surface">Уведомления</div>
                    <div className="body-medium text-on-surface-variant">Настройка оповещений</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant" />
              </button>
              <div className="h-px bg-outline-variant/10 mx-6" />
              <button className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-container-high transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-surface-container-high flex items-center justify-center group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                    <Shield size={20} />
                  </div>
                  <div className="text-left">
                    <div className="title-medium text-on-surface">Безопасность</div>
                    <div className="body-medium text-on-surface-variant">Приватность профиля</div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-on-surface-variant" />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full h-14 rounded-2xl bg-error-container hover:bg-error/20 text-on-error-container title-medium flex items-center justify-center gap-3 transition-colors"
            >
              <LogOut size={20} />
              Выйти из аккаунта
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
