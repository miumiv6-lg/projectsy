import React, { useState } from 'react';
import { LogOut, Clock, Trophy, Star, Shield, ExternalLink, Copy, Check, Settings, MessageSquare, ChevronRight } from 'lucide-react';
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-24">
        <div className="w-20 h-20 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
          <Shield size={36} className="text-white/30" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-3">Войдите в аккаунт</h1>
        <p className="text-white/40 text-center mb-8 max-w-md text-sm">
          Авторизуйтесь через Steam, чтобы просматривать профиль и статистику
        </p>
        <button
          onClick={openLoginModal}
          className="h-12 px-6 rounded-xl bg-[#1b2838] hover:bg-[#2a475e] text-white font-semibold flex items-center gap-3 transition-colors"
        >
          <img src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF" alt="Steam" className="w-5 h-5" />
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
      [UserRole.USER]: { bg: 'bg-white/[0.06]', text: 'text-white/50', label: 'Игрок' },
      [UserRole.MODERATOR]: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Модератор' },
      [UserRole.ADMIN]: { bg: 'bg-purple-500/10', text: 'text-purple-400', label: 'Администратор' },
      [UserRole.OWNER]: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Владелец' },
    };
    const style = styles[user.role];
    return (
      <span className={`px-3 py-1 rounded-full ${style.bg} ${style.text} font-medium text-xs`}>
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

  const recentActivity: { type: string; text: string; date: string }[] = [];

  return (
    <div className="w-full px-4 max-w-4xl mx-auto pb-20 pt-24 animate-ios-slide-up">
      {/* Header Card - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatarfull}
              alt={user.personaname}
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border border-white/[0.1]"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-black" />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{user.personaname}</h1>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
              {getRoleBadge()}
              {user.loccountrycode && (
                <span className="px-3 py-1 rounded-full bg-white/[0.04] text-white/40 text-xs">
                  🌍 {user.loccountrycode}
                </span>
              )}
            </div>

            {/* Steam ID */}
            <button
              onClick={handleCopySteamId}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors text-xs text-white/40"
            >
              <span className="font-mono">{user.steamId}</span>
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <a
              href={user.profileurl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-white/40 hover:text-white transition-colors"
            >
              <ExternalLink size={18} />
            </a>
            {hasPermission(UserRole.MODERATOR) && (
              <button
                onClick={() => setPage(Page.ADMIN)}
                className="w-10 h-10 rounded-xl bg-brand-blue/10 hover:bg-brand-blue/20 flex items-center justify-center text-brand-blue transition-colors"
              >
                <Shield size={18} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs - Liquid Glass */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'overview', label: 'Обзор' },
          { id: 'activity', label: 'Активность' },
          { id: 'settings', label: 'Настройки' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-blue text-white' 
                : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/70'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Stats Grid - Liquid Glass */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Clock, color: 'text-purple-400', value: stats.hoursPlayed, label: 'Часов в игре' },
              { icon: MessageSquare, color: 'text-blue-400', value: stats.forumPosts, label: 'Сообщений' },
              { icon: Trophy, color: 'text-yellow-400', value: stats.achievements.current, label: 'Достижений' },
              { icon: Star, color: 'text-brand-blue', value: '—', label: 'Ранг' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[20px] p-5 text-center">
                <stat.icon size={20} className={`${stat.color} mx-auto mb-3`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Account Info - Liquid Glass */}
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[20px] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.05]">
              <h3 className="font-semibold text-white text-sm">Информация</h3>
            </div>
            <div className="divide-y divide-white/[0.05]">
              <div className="px-5 py-3.5 flex justify-between">
                <span className="text-white/40 text-sm">Steam создан</span>
                <span className="text-white text-sm">{stats.joinDate}</span>
              </div>
              <div className="px-5 py-3.5 flex justify-between">
                <span className="text-white/40 text-sm">Статус</span>
                <span className="text-green-400 flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Онлайн
                </span>
              </div>
              <div className="px-5 py-3.5 flex justify-between">
                <span className="text-white/40 text-sm">Баны</span>
                <span className="text-white/40 text-sm">Нет</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[20px] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.05]">
            <h3 className="font-semibold text-white text-sm">Последняя активность</h3>
          </div>
          {recentActivity.length > 0 ? (
            <div className="divide-y divide-white/[0.05]">
              {recentActivity.map((item, idx) => (
                <div key={idx} className="px-5 py-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    item.type === 'forum' ? 'bg-blue-500/10' : item.type === 'achievement' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                  }`}>
                    {item.type === 'forum' && <MessageSquare size={16} className="text-blue-400" />}
                    {item.type === 'achievement' && <Trophy size={16} className="text-yellow-400" />}
                    {item.type === 'game' && <Star size={16} className="text-green-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">{item.text}</div>
                    <div className="text-white/30 text-xs">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-white/30 text-sm">Нет активности</div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-4">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[20px] overflow-hidden">
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-white/40" />
                <span className="text-white text-sm">Уведомления</span>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </button>
            <div className="h-px bg-white/[0.05]" />
            <button className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-white/40" />
                <span className="text-white text-sm">Приватность</span>
              </div>
              <ChevronRight size={18} className="text-white/20" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full h-12 rounded-xl bg-red-500/10 hover:bg-red-500/15 text-red-400 font-medium flex items-center justify-center gap-2 transition-colors text-sm"
          >
            <LogOut size={18} />
            Выйти из аккаунта
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
