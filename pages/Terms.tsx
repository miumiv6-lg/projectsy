import React from 'react';
import { Page } from '../types';
import { ArrowLeft, FileText } from 'lucide-react';

interface TermsProps {
  setPage: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen bg-background pt-safe-top pt-4 pb-24 px-4 font-sans text-sm animate-fade-in">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-surface-hover text-zinc-400 hover:text-white transition-colors"
          >
             <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2 text-zinc-400 text-xs">
             <FileText size={14} />
             <span>TERMS_OF_USE.md</span>
          </div>
        </div>

        {/* Content - Markdown Style */}
        <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
          <h1 className="text-xl font-medium text-white mb-2">Условия использования</h1>
          <p className="text-zinc-500 font-mono text-xs mb-8">Последнее обновление: 12 декабря 2025</p>

          <h3 className="text-white font-medium mt-6 mb-2">1. Подписка SYSub Premium</h3>
          <p className="mb-4">
            Подписка предоставляет доступ к дополнительному контенту на сервере Project SY. 
            Функционал предоставляется "как есть". Администрация имеет право изменять состав привилегий.
          </p>
          <ul className="list-disc pl-4 space-y-1 mb-4 text-zinc-400">
             <li>Автопродление каждые 30 дней</li>
             <li>Отмена в любое время через настройки</li>
          </ul>

          <h3 className="text-white font-medium mt-6 mb-2">2. Политика возврата</h3>
          <p className="mb-4">
            Все транзакции окончательны. Возврат средств (refund) не производится, за исключением случаев двойного списания по ошибке биллинга.
          </p>
          <blockquote className="border-l-2 border-accent pl-4 py-1 my-4 bg-surface/50 text-zinc-400 italic">
             Блокировка аккаунта не является основанием для возврата средств.
          </blockquote>

          <h3 className="text-white font-medium mt-6 mb-2">3. Пробный период (Trial)</h3>
          <p className="mb-4">
            Доступен 5-дневный триал. Создание мультиаккаунтов для абуза триала запрещено.
          </p>
          <pre className="bg-surface p-3 rounded border border-border text-xs font-mono text-zinc-400 overflow-x-auto">
{`// Нарушение правил триала
if (user.hasMultiAccount && user.isTrialing) {
  ban(user.id, "PERMANENT", "Trial Abuse");
}`}
          </pre>

          <hr className="border-border my-8" />
          
          <p className="text-center text-xs text-zinc-600 font-mono">
             Project SY © 2025. End of file.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Terms;
