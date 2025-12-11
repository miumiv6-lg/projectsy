import React from 'react';
import { Page } from '../types';
import { ArrowLeft, FileText, Shield, AlertCircle } from 'lucide-react';

interface TermsProps {
  setPage: (page: Page) => void;
}

const Terms: React.FC<TermsProps> = ({ setPage }) => {
  return (
    <div className="w-full min-h-screen pt-4 pb-24 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[600px] mx-auto">
        
        <div className="flex items-center gap-3 mb-6">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#181a20] border border-[#2d313a] text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="text-xl font-bold text-white">Условия использования</h1>
        </div>

        <div className="space-y-4">
          <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                <FileText size={18} />
              </div>
              <h2 className="font-bold text-white">1. Общие положения</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Оформляя подписку SYSub, вы соглашаетесь с правилами сервера и условиями предоставления услуг. Администрация оставляет за собой право изменять условия подписки с предварительным уведомлением пользователей.
            </p>
          </div>

          <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400">
                <Shield size={18} />
              </div>
              <h2 className="font-bold text-white">2. Возврат средств</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Средства за оформленную подписку не подлежат возврату, за исключением случаев технических ошибок со стороны сервиса. Если вы были заблокированы за нарушение правил сервера, подписка не компенсируется.
            </p>
          </div>

          <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                <AlertCircle size={18} />
              </div>
              <h2 className="font-bold text-white">3. Пробный период</h2>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Пробный период предоставляется единоразово. Попытка повторной активации через дополнительные аккаунты (твинки) приведет к перманентной блокировке всех связанных учетных записей.
            </p>
          </div>

          <div className="bg-[#181a20] border border-[#2d313a] rounded-xl p-5">
            <h2 className="font-bold text-white mb-2">4. Ответственность</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Подписка не дает иммунитета от наказаний за нарушение правил сервера. Владелец подписки обязан соблюдать все правила сообщества наравне с другими игроками.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button 
            onClick={() => setPage(Page.SUBSCRIPTION)}
            className="w-full bg-[#2d313a] hover:bg-[#363a45] text-white font-bold py-3 rounded-xl transition-colors"
          >
            Вернуться назад
          </button>
        </div>

      </div>
    </div>
  );
};

export default Terms;
