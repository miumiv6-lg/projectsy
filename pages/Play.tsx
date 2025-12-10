import React, { useState } from 'react';
import { Page } from '../types';
import { Copy, Server, Wifi, Play as PlayIcon, Package, ExternalLink, Users, Clock, Check, HelpCircle } from 'lucide-react';

interface PlayProps {
  setPage: (page: Page) => void;
}

const Play: React.FC<PlayProps> = ({ setPage }) => {
  const [copied, setCopied] = useState(false);
  const SERVER_IP = 'Скоро...';
  const isServerOnline = false;

  const handleCopy = () => {
    if (SERVER_IP === 'Скоро...') return;
    navigator.clipboard.writeText(SERVER_IP);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Server size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Играть</h1>
          <p className="text-[#adadb8]">Подключение к серверу</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Server Card */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Status Panel */}
          <div className="bg-[#18181b] rounded-md border border-[#2f2f35] overflow-hidden">
            <div className="p-6 border-b border-[#2f2f35]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isServerOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                  <span className={`text-sm font-bold uppercase tracking-wider ${isServerOnline ? 'text-green-500' : 'text-red-500'}`}>
                    {isServerOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div className="text-xs font-mono text-[#adadb8]">GM: Metrostroi</div>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-1">ProjectSY: Metrostroi</h2>
              <p className="text-[#adadb8] text-sm">Free Rank • No Whitelist • RU</p>
            </div>

            <div className="grid grid-cols-2 divide-x divide-[#2f2f35] border-b border-[#2f2f35]">
              <div className="p-4 text-center">
                <div className="text-xs font-bold text-[#adadb8] uppercase tracking-wider mb-1">Игроки</div>
                <div className="text-xl font-mono text-white">—</div>
              </div>
              <div className="p-4 text-center">
                <div className="text-xs font-bold text-[#adadb8] uppercase tracking-wider mb-1">Uptime</div>
                <div className="text-xl font-mono text-white">—</div>
              </div>
            </div>

            <div className="p-6 bg-[#0e0e10]">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 bg-[#18181b] border border-[#2f2f35] rounded px-3 py-2 flex items-center">
                  <code className="text-primary font-mono text-sm">{SERVER_IP}</code>
                </div>
                <button
                  onClick={handleCopy}
                  disabled={SERVER_IP === 'Скоро...'}
                  className="px-4 py-2 bg-[#2f2f35] hover:bg-[#3f3f46] text-white rounded font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </button>
              </div>

              <button
                disabled={!isServerOnline}
                className={`w-full h-12 rounded font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isServerOnline
                    ? 'bg-primary text-black hover:bg-primary/90'
                    : 'bg-[#2f2f35] text-[#adadb8] cursor-not-allowed'
                }`}
              >
                <PlayIcon size={18} fill={isServerOnline ? "currentColor" : "none"} />
                {isServerOnline ? 'ПОДКЛЮЧИТЬСЯ' : 'СЕРВЕР НЕДОСТУПЕН'}
              </button>
            </div>
          </div>

          {/* Guide */}
          <div className="bg-[#18181b] rounded-md border border-[#2f2f35] p-6">
            <h3 className="text-lg font-bold text-white mb-4">Инструкция по входу</h3>
            <div className="space-y-4">
              {[
                'Запустите лицензионную версию Garry\'s Mod',
                'Откройте консоль разработчика (клавиша ~)',
                'Введите скопированный IP адрес: connect ...',
                'Дождитесь загрузки контента и ресурсов'
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="w-6 h-6 rounded bg-[#2f2f35] flex items-center justify-center text-[#adadb8] font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-[#efeff1] text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-4">
          
          {/* Workshop Card */}
          <div 
            onClick={() => setPage(Page.WORKSHOP)}
            className="bg-[#18181b] rounded-md border border-[#2f2f35] p-5 cursor-pointer hover:border-primary transition-colors group"
          >
            <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center mb-4 group-hover:text-primary transition-colors">
              <Package size={20} />
            </div>
            <h3 className="font-bold text-white mb-1">Контент сервера</h3>
            <p className="text-sm text-[#adadb8] mb-4">Скачайте необходимые аддоны через Steam Workshop</p>
            <div className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              Открыть <ExternalLink size={12} />
            </div>
          </div>

          {/* Help Card */}
          <div 
            onClick={() => setPage(Page.FAQ)}
            className="bg-[#18181b] rounded-md border border-[#2f2f35] p-5 cursor-pointer hover:border-primary transition-colors group"
          >
            <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center mb-4 group-hover:text-primary transition-colors">
              <HelpCircle size={20} />
            </div>
            <h3 className="font-bold text-white mb-1">Проблемы?</h3>
            <p className="text-sm text-[#adadb8] mb-4">Если не получается зайти, прочитайте наш FAQ</p>
            <div className="text-primary text-xs font-bold uppercase tracking-wider flex items-center gap-1">
              Читать <ExternalLink size={12} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Play;
