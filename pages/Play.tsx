import React, { useState } from 'react';
import { Page } from '../types';
import { Copy, Server, Wifi, Play as PlayIcon, Package, ExternalLink, Users, Clock, Check } from 'lucide-react';

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
    <div className="w-full px-4 max-w-4xl mx-auto pb-20 pt-24">
      {/* Header */}
      <div className="text-center py-10 animate-ios-slide-up">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
          <Server size={28} className="text-brand-blue" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Играть</h1>
        <p className="text-white/40 text-lg">Подключение к серверу Project SY</p>
      </div>

      {/* Workshop Banner - Liquid Glass */}
      <button
        onClick={() => setPage(Page.WORKSHOP)}
        className="w-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] hover:bg-white/[0.06] rounded-[20px] p-4 mb-6 flex items-center gap-4 transition-colors animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards group"
      >
        <div className="w-11 h-11 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
          <Package className="text-yellow-400" size={22} />
        </div>
        <div className="flex-1 text-left">
          <div className="text-white font-semibold text-sm">Скачать контент</div>
          <div className="text-white/40 text-xs">Обязательно перед первой игрой</div>
        </div>
        <ExternalLink size={18} className="text-white/30 group-hover:text-brand-blue transition-colors" />
      </button>

      {/* Server Card - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] overflow-hidden mb-6 animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
        {/* Server Header */}
        <div className="p-6 border-b border-white/[0.05]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${isServerOnline ? 'bg-green-500' : 'bg-white/20'}`} />
              <span className={`text-xs font-medium ${isServerOnline ? 'text-green-400' : 'text-white/40'}`}>
                {isServerOnline ? 'Онлайн' : 'Скоро открытие'}
              </span>
            </div>
            <Wifi size={16} className="text-white/20" />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1">ProjectSY: Metrostroi</h2>
          <p className="text-white/40 text-sm">NoRank • Free Drive • Garry's Mod</p>
        </div>

        {/* Server Stats */}
        <div className="grid grid-cols-2 border-b border-white/[0.05]">
          <div className="p-5 border-r border-white/[0.05]">
            <div className="flex items-center gap-2 text-white/30 text-xs mb-1">
              <Users size={12} />
              <span>Игроков</span>
            </div>
            <div className="text-xl font-bold text-white">—</div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 text-white/30 text-xs mb-1">
              <Clock size={12} />
              <span>Аптайм</span>
            </div>
            <div className="text-xl font-bold text-white">—</div>
          </div>
        </div>

        {/* Connect Section */}
        <div className="p-6">
          <div className="text-xs text-white/40 mb-2">IP адрес сервера</div>
          <div className="bg-black/30 rounded-xl p-3 flex items-center justify-between gap-3 mb-4">
            <code className="text-brand-blue font-mono font-semibold">{SERVER_IP}</code>
            <button
              onClick={handleCopy}
              disabled={SERVER_IP === 'Скоро...'}
              className={`px-3 py-1.5 rounded-lg font-medium text-xs transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-green-500 text-white'
                  : SERVER_IP === 'Скоро...'
                  ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {copied ? <><Check size={14} /> Скопировано</> : <><Copy size={14} /> Копировать</>}
            </button>
          </div>

          <button
            disabled={!isServerOnline}
            className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors ${
              isServerOnline
                ? 'bg-brand-blue hover:bg-blue-600 text-white'
                : 'bg-white/[0.05] text-white/30 cursor-not-allowed'
            }`}
          >
            <PlayIcon size={18} fill="currentColor" />
            {isServerOnline ? 'Подключиться' : 'Скоро'}
          </button>
        </div>
      </div>

      {/* Quick Guide - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 mb-6 animate-ios-slide-up delay-300 opacity-0 fill-mode-forwards">
        <h3 className="text-base font-bold text-white mb-4">Как подключиться</h3>
        <div className="space-y-3">
          {[
            'Запусти Garry\'s Mod',
            'Открой консоль (~) и введи: connect [IP]',
            'Или найди сервер через браузер серверов',
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-lg bg-brand-blue/10 flex items-center justify-center text-brand-blue text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <span className="text-white/60 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Link - Liquid Glass */}
      <button
        onClick={() => setPage(Page.FAQ)}
        className="w-full bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] hover:bg-white/[0.06] text-white/50 hover:text-white font-medium py-3.5 rounded-xl transition-colors text-sm animate-ios-slide-up delay-400 opacity-0 fill-mode-forwards"
      >
        Проблемы с подключением? Открыть FAQ
      </button>
    </div>
  );
};

export default Play;
