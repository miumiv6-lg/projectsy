import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { User, Copy, Check, ExternalLink, Settings, Shield, Gamepad2, Info } from 'lucide-react';
import { sessionState } from '../utils/sessionState';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [steamLinked, setSteamLinked] = useState(false);
  const [steamId, setSteamId] = useState('');
  const [showSteamInput, setShowSteamInput] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Fake subscription state for profile display
  const isSubscribed = sessionState.isSubscribed;

  useEffect(() => {
    // Get user data from Telegram WebApp
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      setUser(window.Telegram.WebApp.initDataUnsafe.user);
    } else {
      // Fallback for browser testing
      setUser({
        first_name: 'Stalker',
        username: 'stalker_demo',
        photo_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix'
      });
    }
  }, []);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLinkSteam = (e: React.FormEvent) => {
    e.preventDefault();
    if (steamId.length > 5) {
      // Simulate API call
      setTimeout(() => {
        setSteamLinked(true);
        setShowSteamInput(false);
      }, 500);
    }
  };

  return (
    <div className="w-full min-h-screen pt-safe-top pt-6 pb-24 px-4 bg-background">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-semibold text-white tracking-tight">Профиль</h1>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:text-white hover:border-border-hover transition-colors bg-[var(--color-surface)]">
            <Settings size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* User Card */}
        <div className="cursor-card p-6 rounded-3xl mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full p-1 border border-border bg-[var(--color-surface-hover)]">
                {user?.photo_url ? (
                  <img src={user.photo_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[var(--color-surface)] flex items-center justify-center text-zinc-500">
                    <User size={32} />
                  </div>
                )}
              </div>
              {isSubscribed && (
                <div className="absolute bottom-0 right-0 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-black/20">
                  PREMIUM
                </div>
              )}
            </div>

            <h2 className="text-xl font-medium text-white mb-1">
              {user?.first_name} {user?.last_name}
            </h2>
            <p className="text-sm text-muted mb-4">@{user?.username || 'username'}</p>

            <button 
              onClick={handleCopyId}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-transparent hover:bg-white/5 text-xs text-muted hover:text-white transition-colors border border-border active:scale-95"
            >
              <span className="font-mono tracking-wide">ID: {user?.id || '123456789'}</span>
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="cursor-card p-4 rounded-2xl">
             <div className="text-muted text-xs font-medium mb-1">Баланс</div>
             <div className="text-xl font-medium text-white">1,250 <span className="text-muted text-sm">SY</span></div>
          </div>
          <div className="cursor-card p-4 rounded-2xl">
             <div className="text-muted text-xs font-medium mb-1">Статус</div>
             <div className={`text-sm font-medium ${isSubscribed ? 'text-white' : 'text-muted'}`}>
                {isSubscribed ? 'Premium' : 'Игрок'}
             </div>
          </div>
        </div>

        {/* Settings / Connections */}
        <div className="space-y-4">
          <h3 className="text-xs font-medium text-muted uppercase tracking-widest pl-2">Интеграции</h3>
          
          <div className="cursor-card p-5 rounded-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-white border border-border">
                    <Gamepad2 size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">Steam</h3>
                    <p className="text-xs text-muted">
                       {steamLinked ? 'Аккаунт привязан' : 'Не привязан'}
                    </p>
                  </div>
               </div>
               {steamLinked ? (
                 <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                    <Check size={14} />
                 </div>
               ) : (
                 <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
               )}
            </div>

            {steamLinked ? (
              <div className="mt-2 pt-4 border-t border-border flex items-center gap-3">
                 <div className="w-8 h-8 rounded bg-zinc-800"></div>
                 <div className="flex-grow">
                    <div className="text-xs text-white font-medium">Player_One</div>
                    <div className="text-[10px] text-muted font-mono">STEAM_0:1:123456</div>
                 </div>
                 <button 
                   onClick={() => setSteamLinked(false)}
                   className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 transition-colors"
                 >
                   Отвязать
                 </button>
              </div>
            ) : (
               !showSteamInput ? (
                  <button 
                    onClick={() => setShowSteamInput(true)}
                    className="w-full cursor-button py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Привязать аккаунт
                  </button>
               ) : (
                  <form onSubmit={handleLinkSteam} className="space-y-3">
                     <div className="space-y-2">
                        <label className="text-[10px] text-muted uppercase tracking-wide">Steam ID / Ссылка на профиль</label>
                        <input 
                           type="text" 
                           value={steamId}
                           onChange={(e) => setSteamId(e.target.value)}
                           className="w-full cursor-input rounded-xl px-4 py-3 text-sm"
                           placeholder="https://steamcommunity.com/id/..."
                           autoFocus
                        />
                     </div>
                     <div className="flex gap-2">
                        <button 
                          type="button"
                          onClick={() => setShowSteamInput(false)}
                          className="flex-1 cursor-button-secondary py-3 rounded-xl text-xs font-semibold"
                        >
                          Отмена
                        </button>
                        <button 
                          type="submit"
                          className="flex-1 cursor-button py-3 rounded-xl text-xs font-bold uppercase tracking-wider"
                        >
                          Подтвердить
                        </button>
                     </div>
                     <p className="text-[10px] text-muted leading-relaxed flex items-start gap-1.5 bg-[var(--color-surface-hover)] p-3 rounded-lg border border-border">
                        <Info size={12} className="mt-0.5 flex-shrink-0" />
                        Для автоматической выдачи покупок необходимо указать верный Steam ID.
                     </p>
                  </form>
               )
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
