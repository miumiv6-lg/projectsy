import React, { useState, useEffect } from 'react';
import { User, Copy, Check, Info, Save } from 'lucide-react';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [steamId, setSteamId] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fake user data for preview
    setUser({
      first_name: 'Stalker',
      last_name: 'Demo',
      username: 'stalker_demo',
      id: 123456789,
      photo_url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Felix'
    });
  }, []);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id.toString());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-background pt-safe-top pb-24 font-sans text-sm">
       {/* Settings Header - Tab Style */}
       <div className="border-b border-border bg-background sticky top-0 z-10 px-4 pt-4 pb-0">
          <h1 className="text-lg font-medium text-white mb-4">Настройки</h1>
          <div className="flex gap-6 text-[13px] overflow-x-auto no-scrollbar">
             <button className="pb-2 border-b-2 border-accent text-white font-medium whitespace-nowrap">Общие</button>
             <button className="pb-2 border-b-2 border-transparent text-muted hover:text-zinc-300 transition-colors whitespace-nowrap">Аккаунт</button>
             <button className="pb-2 border-b-2 border-transparent text-muted hover:text-zinc-300 transition-colors whitespace-nowrap">Биллинг</button>
          </div>
       </div>

       <div className="p-6 max-w-2xl mx-auto space-y-8">
          
          {/* Section: Profile */}
          <section>
             <h2 className="text-[13px] font-medium text-white mb-4 border-b border-border pb-2">Профиль пользователя</h2>
             <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-full bg-surface border border-border overflow-hidden shrink-0">
                   {user?.photo_url && <img src={user.photo_url} alt="Avatar" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 space-y-4 min-w-0">
                   <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-xs text-zinc-500">Отображаемое имя</label>
                         <input 
                           disabled 
                           value={`${user?.first_name || ''} ${user?.last_name || ''}`}
                           className="cursor-input w-full px-3 py-1.5 opacity-60 cursor-not-allowed" 
                         />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-xs text-zinc-500">Telegram ID</label>
                         <div className="flex gap-2">
                            <input 
                              disabled 
                              value={user?.id || ''}
                              className="cursor-input w-full px-3 py-1.5 font-mono opacity-60 cursor-not-allowed" 
                            />
                            <button onClick={handleCopyId} className="cursor-button-secondary px-3 shrink-0">
                               {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </section>

          {/* Section: Integrations */}
          <section>
             <h2 className="text-[13px] font-medium text-white mb-4 border-b border-border pb-2">Интеграции</h2>
             <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                   <div className="space-y-1">
                      <div className="text-sm text-zinc-200">Steam Подключение</div>
                      <div className="text-xs text-zinc-500 max-w-xs">
                         Привяжите аккаунт Steam для автоматического получения покупок на сервере.
                      </div>
                   </div>
                   <div className="w-full sm:w-64">
                      <input 
                        placeholder="STEAM_0:1:..." 
                        value={steamId}
                        onChange={(e) => {
                           setSteamId(e.target.value);
                           setIsDirty(true);
                        }}
                        className="cursor-input w-full px-3 py-1.5 font-mono text-xs" 
                      />
                   </div>
                </div>
             </div>
          </section>

          {/* Section: Application */}
          <section>
             <h2 className="text-[13px] font-medium text-white mb-4 border-b border-border pb-2">Приложение</h2>
             <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-300">Тема</span>
                <select className="bg-surface border border-border text-xs text-white rounded px-2 py-1 outline-none">
                   <option>Cursor Dark</option>
                </select>
             </div>
             <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-300">Язык</span>
                <select className="bg-surface border border-border text-xs text-white rounded px-2 py-1 outline-none">
                   <option>Русский</option>
                </select>
             </div>
             <div className="flex items-center justify-between py-2">
                <span className="text-sm text-zinc-300">Версия</span>
                <span className="text-xs font-mono text-zinc-500">0.4.2-beta</span>
             </div>
          </section>

          {/* Save Action */}
          {isDirty && (
             <div className="fixed bottom-14 right-6 animate-slide-up z-20">
                <button className="cursor-button px-4 py-2 shadow-lg flex items-center gap-2">
                   <Save size={14} />
                   <span>Сохранить</span>
                </button>
             </div>
          )}

       </div>
    </div>
  );
};

export default Profile;
