import React from 'react';
import { Page } from '../types';
import { Mail, Send, MessageCircle, ExternalLink } from 'lucide-react';

interface ContactsProps {
  setPage: (page: Page) => void;
}

const Contacts: React.FC<ContactsProps> = ({ setPage }) => {
  const contacts = [
    {
      title: 'Telegram',
      description: 'Основной канал связи и новости',
      link: 'https://t.me/projectsy',
      icon: Send,
      color: 'text-blue-400',
      buttonText: 'Открыть Telegram',
    },
    {
      title: 'Discord',
      description: 'Голосовой чат и обсуждения',
      link: '#',
      icon: MessageCircle,
      color: 'text-indigo-400',
      buttonText: 'Присоединиться',
      disabled: true,
    },
    {
      title: 'Email',
      description: 'Для деловых предложений',
      link: 'mailto:contact@projectsy.ru',
      icon: Mail,
      color: 'text-orange-400',
      buttonText: 'Написать письмо',
    },
  ];

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Mail size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Контакты</h1>
          <p className="text-[#adadb8]">Связь с администрацией</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contacts.map((contact, idx) => {
          const Icon = contact.icon;
          return (
            <div 
              key={idx} 
              className="bg-[#18181b] rounded-md border border-[#2f2f35] p-6 hover:border-primary/50 transition-colors flex flex-col group h-full"
            >
              <div className="w-10 h-10 rounded bg-[#2f2f35] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                <Icon size={20} className={contact.color} />
              </div>
              
              <h3 className="font-bold text-white text-lg mb-1">{contact.title}</h3>
              <p className="text-sm text-[#adadb8] mb-6 flex-grow leading-relaxed">{contact.description}</p>
              
              {contact.disabled ? (
                <button 
                  disabled 
                  className="w-full h-10 rounded bg-[#2f2f35] text-[#adadb8] text-sm font-semibold cursor-not-allowed opacity-50"
                >
                  Скоро
                </button>
              ) : (
                <a
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 rounded bg-[#2f2f35] hover:bg-[#3f3f46] text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  {contact.buttonText}
                  <ExternalLink size={14} />
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Banner */}
      <div className="mt-8 bg-[#18181b] rounded-md border border-[#2f2f35] p-8 text-center">
        <h3 className="text-lg font-bold text-white mb-2">Часто задаваемые вопросы</h3>
        <p className="text-[#adadb8] text-sm mb-6 max-w-md mx-auto">
          Прежде чем писать в поддержку, рекомендуем ознакомиться с нашим FAQ. Возможно, ответ на ваш вопрос уже там.
        </p>
        <button
          onClick={() => setPage(Page.FAQ)}
          className="px-6 py-2 bg-primary text-black font-bold text-sm rounded hover:bg-primary/90 transition-colors"
        >
          Открыть FAQ
        </button>
      </div>

    </div>
  );
};

export default Contacts;
