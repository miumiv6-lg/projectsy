import React from 'react';
import { Page } from '../types';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  setPage: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen bg-black pt-8 pb-24 px-6 animate-fade-in font-serif">
      <div className="max-w-2xl mx-auto">
        
        {/* Navigation */}
        <div className="mb-12">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors no-underline"
          >
            <div className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 group-hover:border-white/30 transition-colors font-sans">
               <ArrowLeft size={14} />
            </div>
            <span className="text-xs font-sans font-medium uppercase tracking-widest">Вернуться</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-12 border-b border-white/10 pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight tracking-tight font-sans">
            Условия использования
          </h1>
          <div className="flex items-center gap-4 text-sm text-zinc-500 font-sans">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-zinc-800"></div>
              <span>Metro Portal Team</span>
            </div>
            <span>•</span>
            <time>11 Декабря, 2025</time>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-invert prose-lg max-w-none text-zinc-300 font-serif leading-relaxed">
          <p className="text-xl text-white font-medium mb-8 leading-relaxed font-sans">
            Добро пожаловать в Metro Portal. Используя наши сервисы, вы соглашаетесь с нижеизложенными правилами. Пожалуйста, внимательно ознакомьтесь с ними перед совершением покупок.
          </p>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6 font-sans">1. Подписка SYSub Premium</h3>
          <p>
            Подписка предоставляет доступ к дополнительному контенту на сервере Metro. Мы гарантируем работоспособность заявленных функций на момент покупки. Администрация оставляет за собой право изменять состав бонусов с предварительным уведомлением в новостном канале.
          </p>
          <p>
            Автоматическое продление происходит каждые 30 дней. Отменить подписку можно в любой момент через настройки профиля или обратившись в поддержку.
          </p>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6 font-sans">2. Политика возврата</h3>
          <p>
            Все покупки внутри приложения являются окончательными. Возврат средств (refund) возможен только в случае технической ошибки со стороны сервиса (например, двойное списание).
          </p>
          <ul className="list-disc pl-5 space-y-2 marker:text-zinc-600">
            <li>Блокировка аккаунта за нарушение правил сервера не является основанием для возврата.</li>
            <li>Неиспользование привилегий не является основанием для возврата.</li>
          </ul>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6 font-sans">3. Пробный период (Trial)</h3>
          <p>
            Мы предоставляем 5-дневный пробный период для новых пользователей.
          </p>
          <blockquote className="border-l-2 border-white pl-6 italic text-zinc-400 my-8">
            "Создание мультиаккаунтов (твинков) для повторной активации пробного периода строго запрещено и карается перманентной блокировкой по железу."
          </blockquote>
          <p>
            По истечении пробного периода доступ к премиум-функциям будет автоматически ограничен до момента оплаты подписки.
          </p>

          <h3 className="text-2xl font-bold text-white mt-12 mb-6 font-sans">4. Ответственность</h3>
          <p>
            Наличие платной подписки не освобождает пользователя от соблюдения общих правил проекта. Модерация относится ко всем игрокам одинаково непредвзято.
          </p>

          <hr className="border-white/10 my-12" />

          <p className="text-sm text-zinc-600 font-sans text-center">
            Metro Portal © 2025. Все права защищены.<br/>
            Не является публичной офертой.
          </p>
        </article>

      </div>
    </div>
  );
};

export default Terms;
