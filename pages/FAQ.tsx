import React, { useState } from 'react';
import { Page, FaqCategory } from '../types';
import { ChevronDown, Search, HelpCircle, Shield, Wrench, Gamepad2, ChevronRight, MessageCircle } from 'lucide-react';

interface FaqProps {
  setPage: (page: Page) => void;
}

const FAQ: React.FC<FaqProps> = ({ setPage }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const categories: (FaqCategory & { icon: any; color: string })[] = [
    {
      title: 'О Проекте',
      icon: HelpCircle,
      color: 'text-brand-blue',
      items: [
        { question: 'Что такое Project SY?', answer: 'Проект по метро-симуляторам. Начали в Roblox, теперь делаем качественный сервер в GMod.' },
        { question: 'Почему перешли в GMod?', answer: 'В первую очередь — из-за блокировки Roblox в России (РКН). Мы были вынуждены искать новую платформу, и Garry\'s Mod стал идеальным выбором.' },
      ],
    },
    {
      title: 'Технические вопросы',
      icon: Wrench,
      color: 'text-yellow-400',
      items: [
        { question: 'Как зайти на сервер?', answer: 'Раздел "Играть" в меню содержит IP и кнопку автоматического входа.' },
        { question: 'Нужен ли CSS контент?', answer: 'Больше нет. Обновление Garry\'s Mod (Июль 2025) сделало ручное скачивание ненужным. Игра теперь сама монтирует контент CSS и HL2.' },
        { question: 'Лагает?', answer: 'Метрострой требователен к ресурсам. Попробуйте снизить настройки графики или дальность прорисовки.' },
        { question: 'Вижу ERROR текстуры', answer: 'Скачайте контент из раздела "Мастерская". Подпишитесь на Metrostroi в Steam Workshop.' },
      ],
    },
    {
      title: 'Игровой процесс',
      icon: Gamepad2,
      color: 'text-green-400',
      items: [
        { question: 'Как управлять поездом?', answer: 'Используйте клавиши W/S для контроллера, пробел для тормоза. Подробные гайды будут на сервере.' },
        { question: 'Где взять состав?', answer: 'На станциях есть депо, где можно заспавнить поезд через меню Q.' },
        { question: 'Можно ли играть с друзьями?', answer: 'Конечно! Сервер публичный, просто подключитесь вместе по IP.' },
      ],
    },
  ];

  const toggleItem = (id: string) => {
    const newOpen = new Set(openItems);
    if (newOpen.has(id)) {
      newOpen.delete(id);
    } else {
      newOpen.add(id);
    }
    setOpenItems(newOpen);
  };

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        searchTerm === '' ||
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const totalQuestions = categories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="relative w-full min-h-screen">
      <div className="relative z-10 w-full px-4 max-w-4xl mx-auto pb-20 pt-24">

        {/* Header */}
        <div className="text-center py-10 animate-ios-slide-up">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
            <HelpCircle size={28} className="text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">FAQ</h1>
          <p className="text-white/40 text-lg">{totalQuestions} ответов на популярные вопросы</p>
        </div>

        {/* Search - Liquid Glass */}
        <div className="relative mb-10 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
          <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-2xl flex items-center p-1.5 focus-within:border-white/[0.15] transition-colors">
            <div className="w-10 h-10 flex items-center justify-center">
              <Search size={18} className="text-white/30" />
            </div>
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-white px-3 py-2.5 focus:outline-none placeholder-white/30 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-8">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16 animate-ios-slide-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center">
                <Search size={24} className="text-white/20" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-white/40 text-sm">Попробуйте изменить запрос</p>
            </div>
          ) : (
            filteredCategories.map((cat, catIdx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={catIdx}
                  className="animate-ios-slide-up opacity-0 fill-mode-forwards"
                  style={{ animationDelay: `${(catIdx + 2) * 80}ms` }}
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4 px-1">
                    <div className={`w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center ${cat.color}`}>
                      <Icon size={16} />
                    </div>
                    <h2 className="text-lg font-bold text-white">{cat.title}</h2>
                  </div>

                  {/* Questions */}
                  <div className="space-y-3">
                    {cat.items.map((item, itemIdx) => {
                      const itemId = `${catIdx}-${itemIdx}`;
                      const isOpen = openItems.has(itemId);

                      return (
                        <div
                          key={itemIdx}
                          className={`bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[20px] overflow-hidden transition-colors ${isOpen ? 'bg-white/[0.06]' : 'hover:bg-white/[0.05]'}`}
                        >
                          <button
                            onClick={() => toggleItem(itemId)}
                            className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                          >
                            <span className="text-sm font-medium text-white/80">{item.question}</span>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-white/10 rotate-90' : 'bg-white/[0.04]'}`}>
                              <ChevronRight size={14} className="text-white/50" />
                            </div>
                          </button>

                          <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                            <div className="px-5 pb-5 pt-0 text-white/50 text-sm leading-relaxed">
                              <div className="h-px w-full bg-white/[0.05] mb-4" />
                              {item.answer}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support - Liquid Glass */}
        <div className="mt-12 bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[28px] p-8 text-center animate-ios-slide-up delay-500 opacity-0 fill-mode-forwards">
          <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
            <MessageCircle size={24} className="text-brand-blue" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Остались вопросы?</h3>
          <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">
            Наша команда поддержки всегда готова помочь
          </p>
          <button
            onClick={() => setPage(Page.CONTACTS)}
            className="px-6 py-3 bg-brand-blue hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition-colors"
          >
            Связаться с нами
          </button>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
