import React from 'react';
import { Page } from '../types';
import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react';

interface TermsProps {
  setPage: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen pt-6 pb-24 px-4 bg-zinc-950">
      <div className="max-w-md mx-auto">
        
        <div className="flex items-center gap-3 mb-8">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={1.5} />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-tight">Условия</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <FileText size={18} strokeWidth={1.5} />
              </div>
              <h2 className="font-semibold text-white">1. Общие положения</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Оформляя подписку SYSub, вы соглашаетесь с правилами сервера и условиями предоставления услуг. Администрация оставляет за собой право изменять условия подписки с предварительным уведомлением пользователей.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Shield size={18} strokeWidth={1.5} />
              </div>
              <h2 className="font-semibold text-white">2. Возврат средств</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Средства за оформленную подписку не подлежат возврату, за исключением случаев технических ошибок со стороны сервиса. Если вы были заблокированы за нарушение правил сервера, подписка не компенсируется.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
                <AlertCircle size={18} strokeWidth={1.5} />
              </div>
              <h2 className="font-semibold text-white">3. Пробный период</h2>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Пробный период предоставляется единоразово. Попытка повторной активации через дополнительные аккаунты (твинки) приведет к перманентной блокировке всех связанных учетных записей.
            </p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="font-semibold text-white mb-2">4. Ответственность</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Подписка не дает иммунитета от наказаний за нарушение правил сервера. Владелец подписки обязан соблюдать все правила сообщества наравне с другими игроками.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3.5 rounded-2xl transition-colors border border-zinc-800"
          >
            Вернуться назад
          </button>
        </div>

      </div>
    </div>
  );
};

export default Terms;
