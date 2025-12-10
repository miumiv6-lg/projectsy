import React, { useState } from 'react';
import { Page, FaqCategory } from '../types';
import { Search, HelpCircle, Wrench, Gamepad2, ChevronRight, MessageCircle, ChevronDown } from 'lucide-react';

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
      color: 'bg-primary-container text-on-primary-container',
      items: [
        { question: 'Что такое Project SY?', answer: 'Проект по метро-симуляторам. Начали в Roblox, теперь делаем качественный сервер в GMod.' },
        { question: 'Почему перешли в GMod?', answer: 'В первую очередь — из-за блокировки Roblox в России (РКН). Мы были вынуждены искать новую платформу, и Garry\'s Mod стал идеальным выбором.' },
      ],
    },
    {
      title: 'Технические вопросы',
      icon: Wrench,
      color: 'bg-tertiary-container text-on-tertiary-container',
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
      color: 'bg-secondary-container text-on-secondary-container',
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

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
            <HelpCircle size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#efeff1]">FAQ</h1>
            <p className="text-[#adadb8]">Часто задаваемые вопросы</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Поиск вопроса..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-[#18181b] border border-[#2f2f35] rounded pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {filteredCategories.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[#2f2f35] rounded-lg">
            <p className="text-[#adadb8]">Ничего не найдено</p>
          </div>
        ) : (
          filteredCategories.map((cat, catIdx) => {
            const Icon = cat.icon;
            return (
              <div key={catIdx} className="space-y-3">
                {/* Category Header */}
                <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Icon size={20} className="text-primary" />
                  {cat.title}
                </h2>

                {/* Questions */}
                <div className="space-y-2">
                  {cat.items.map((item, itemIdx) => {
                    const itemId = `${catIdx}-${itemIdx}`;
                    const isOpen = openItems.has(itemId);

                    return (
                      <div
                        key={itemIdx}
                        className={`bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden transition-all duration-200 ${isOpen ? 'border-primary/50' : 'hover:border-[#3f3f46]'}`}
                      >
                        <button
                          onClick={() => toggleItem(itemId)}
                          className="w-full px-5 py-4 text-left flex items-center justify-between gap-4"
                        >
                          <span className="font-semibold text-[#efeff1] text-sm md:text-base">{item.question}</span>
                          <ChevronDown size={18} className={`text-[#adadb8] transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                        </button>

                        <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                          <div className="px-5 pb-5 pt-0">
                            <p className="text-[#adadb8] text-sm leading-relaxed border-t border-[#2f2f35] pt-3">
                              {item.answer}
                            </p>
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

      {/* Support Box */}
      <div className="mt-12 bg-[#18181b] border border-[#2f2f35] rounded-md p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center shrink-0">
            <MessageCircle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Не нашли ответ?</h3>
            <p className="text-xs text-[#adadb8]">Свяжитесь с нашей поддержкой</p>
          </div>
        </div>
        <button
          onClick={() => setPage(Page.CONTACTS)}
          className="px-6 py-2 bg-[#2f2f35] hover:bg-[#3f3f46] text-white text-sm font-semibold rounded transition-colors whitespace-nowrap"
        >
          Написать нам
        </button>
      </div>

    </div>
  );
};

export default FAQ;
