import React from 'react';
import { Page } from '../types';
import { ArrowLeft } from 'lucide-react';

interface TermsProps {
  setPage: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen bg-background pt-safe-top pt-6 pb-24 px-4 animate-fade-in">
      <div className="max-w-md mx-auto">
        
        {/* Navigation */}
        <div className="mb-6">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
          >
            <div className="w-9 h-9 flex items-center justify-center rounded-full border border-border group-hover:border-border-hover transition-colors">
               <ArrowLeft size={14} />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest">Вернуться</span>
          </button>
        </div>

        {/* Article Header */}
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white leading-tight tracking-tight">
            Условия использования
          </h1>
          <p className="text-xs text-zinc-500 mt-2">
            Обновлено: 11 декабря 2025 • Project SY
          </p>
        </header>

        {/* Content */}
        <div className="cursor-card rounded-2xl p-5 text-zinc-300">
          <p className="text-sm leading-relaxed mb-5 text-zinc-200">
            Добро пожаловать в Project SY. Используя наши сервисы, вы соглашаетесь с нижеизложенными правилами. Пожалуйста, внимательно ознакомьтесь с ними перед совершением покупок.
          </p>

          <div className="space-y-5">
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white">1. Подписка SYSub Premium</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                Подписка предоставляет доступ к дополнительному контенту на сервере Project SY. Мы гарантируем работоспособность заявленных функций на момент покупки. Администрация оставляет за собой право изменять состав бонусов с предварительным уведомлением в новостном канале.
              </p>
              <p className="text-sm leading-relaxed text-zinc-300">
                Автоматическое продление происходит каждые 30 дней. Отменить подписку можно в любой момент через настройки профиля или обратившись в поддержку.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white">2. Политика возврата</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                Все покупки внутри приложения являются окончательными. Возврат средств (refund) возможен только в случае технической ошибки со стороны сервиса (например, двойное списание).
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-zinc-600 text-sm">
                <li>Блокировка аккаунта за нарушение правил сервера не является основанием для возврата.</li>
                <li>Неиспользование привилегий не является основанием для возврата.</li>
              </ul>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white">3. Пробный период (Trial)</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                Мы предоставляем 5-дневный пробный период для новых пользователей.
              </p>
              <div className="border border-[var(--color-border)] bg-white/5 rounded-xl p-4 text-sm text-zinc-300">
                <p className="leading-relaxed">
                  «Создание мультиаккаунтов (твинков) для повторной активации пробного периода строго запрещено и карается перманентной блокировкой по железу.»
                </p>
              </div>
              <p className="text-sm leading-relaxed text-zinc-300">
                По истечении пробного периода доступ к премиум-функциям будет автоматически ограничен до момента оплаты подписки.
              </p>
            </section>

            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-white">4. Ответственность</h3>
              <p className="text-sm leading-relaxed text-zinc-300">
                Наличие платной подписки не освобождает пользователя от соблюдения общих правил проекта. Модерация относится ко всем игрокам одинаково непредвзято.
              </p>
            </section>
          </div>
        </div>

        <p className="text-[10px] text-zinc-600 text-center mt-6">
          Project SY © 2025. Все права защищены. Не является публичной офертой.
        </p>

      </div>
    </div>
  );
};

export default Terms;
