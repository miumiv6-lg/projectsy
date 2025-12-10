import React from 'react';
import { Page } from '../types';
import { Package, ExternalLink, Download, Check, AlertCircle } from 'lucide-react';

interface WorkshopProps {
  setPage: (page: Page) => void;
}

const Workshop: React.FC<WorkshopProps> = ({ setPage }) => {
  const collections = [
    {
      title: 'Metrostroi Core',
      description: 'Основной аддон Metrostroi с моделями поездов и системами',
      link: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1547330606',
      required: true,
    },
    {
      title: 'Project SY Content Pack',
      description: 'Дополнительный контент для сервера (текстуры, звуки)',
      link: '#',
      required: true,
      comingSoon: true,
    },
    {
      title: 'Metrostroi Maps',
      description: 'Коллекция карт метро для Metrostroi',
      link: 'https://steamcommunity.com/workshop/browse/?appid=4000&searchtext=metrostroi+map',
      required: false,
    },
  ];

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Package size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Мастерская</h1>
          <p className="text-[#adadb8]">Скачайте необходимый контент для игры</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-[#1b1b1f] border-l-4 border-primary p-6 mb-8 flex items-start gap-4 rounded-r-md">
        <div className="text-primary shrink-0 mt-1">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-[#efeff1] mb-1">Важно</h3>
          <p className="text-sm text-[#adadb8] leading-relaxed">
            После обновления Garry's Mod (Июль 2025), CSS и HL2 контент монтируется автоматически. 
            Вам нужно только подписаться на Metrostroi.
          </p>
        </div>
      </div>

      {/* Collections */}
      <div className="space-y-4 mb-12">
        {collections.map((item, idx) => (
          <div 
            key={idx} 
            className="bg-[#18181b] border border-[#2f2f35] rounded-md p-5 animate-fade-in hover:border-primary/50 transition-colors"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-[#efeff1] text-lg">{item.title}</h3>
                  {item.required && (
                    <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-wider">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#adadb8]">{item.description}</p>
              </div>
              
              {item.comingSoon ? (
                <button 
                  disabled 
                  className="h-9 px-4 rounded bg-[#2f2f35] text-[#adadb8] text-sm font-semibold cursor-not-allowed shrink-0"
                >
                  Скоро
                </button>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 px-4 rounded bg-[#2f2f35] hover:bg-[#3f3f46] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors shrink-0"
                >
                  <Download size={16} />
                  Скачать
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Checklist */}
      <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
        <h3 className="font-bold text-[#efeff1] mb-6 border-b border-[#2f2f35] pb-4">Чек-лист готовности</h3>
        <div className="space-y-3">
          {[
            'Установлен Garry\'s Mod (лицензия)',
            'Подписка на Metrostroi Core',
            'Подписка на карты (опционально)',
            'Знание IP сервера',
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                <Check size={12} strokeWidth={3} />
              </div>
              <span className="text-[#adadb8] text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Play CTA */}
      <button
        onClick={() => setPage(Page.PLAY)}
        className="w-full h-12 mt-8 bg-primary text-black font-bold rounded flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-[0.99]"
      >
        Перейти к игре
        <ExternalLink size={18} />
      </button>
    </div>
  );
};

export default Workshop;
