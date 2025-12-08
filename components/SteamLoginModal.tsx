import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, ChevronLeft } from 'lucide-react';
import { useAuth, DEMO_STEAM_USER, steamLogin } from '../context/AuthContext';

const SteamLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal, login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isLoginModalOpen) {
      setShouldRender(true);
      setAnimateOut(false);
    } else if (shouldRender) {
      // Начинаем анимацию закрытия
      setAnimateOut(true);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimateOut(false);
        setShowTerms(false);
      }, 200);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isLoginModalOpen]);

  if (!shouldRender) return null;

  const handleClose = () => {
    if (!isLoading) {
      closeLoginModal();
    }
  };

  const handleSteamLogin = () => {
    // Реальный вход через Steam
    steamLogin();
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    login(DEMO_STEAM_USER);
    setIsLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const backdropClass = animateOut ? 'opacity-0' : 'opacity-100';
  const modalClass = animateOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100';

  if (showTerms) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl transition-opacity duration-200 ${backdropClass}`}
        onClick={handleBackdropClick}
      >
        <div className={`relative w-full max-w-lg bg-[#1C1C1E] rounded-[28px] shadow-2xl max-h-[80vh] flex flex-col transition-all duration-200 ${modalClass}`}>
          <div className="flex items-center gap-3 p-6 border-b border-white/5">
            <button
              onClick={() => setShowTerms(false)}
              className="flex items-center gap-1 text-brand-blue font-medium hover:opacity-70 transition-opacity"
            >
              <ChevronLeft size={20} />
              Назад
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Условия использования</h2>
            <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
              <section>
                <h3 className="text-white font-semibold mb-2">1. Общие положения</h3>
                <p>Настоящие условия регулируют использование сервиса Project SY. Регистрируясь на сайте, вы соглашаетесь с данными условиями.</p>
              </section>
              <section>
                <h3 className="text-white font-semibold mb-2">2. Учётная запись</h3>
                <p>Для доступа требуется авторизация через Steam. Мы получаем только публичную информацию профиля: имя, аватар и Steam ID.</p>
              </section>
              <section>
                <h3 className="text-white font-semibold mb-2">3. Правила поведения</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                  <li>Запрещено использование читов и эксплойтов</li>
                  <li>Запрещены оскорбления и токсичное поведение</li>
                  <li>Запрещён спам и реклама сторонних ресурсов</li>
                  <li>Запрещено мешать другим игрокам</li>
                </ul>
              </section>
              <section>
                <h3 className="text-white font-semibold mb-2">4. Конфиденциальность</h3>
                <p>Мы не передаём ваши данные третьим лицам. Информация используется только для работы сервиса.</p>
              </section>
              <section>
                <h3 className="text-white font-semibold mb-2">5. Ответственность</h3>
                <p>Администрация оставляет за собой право заблокировать доступ за нарушение правил без предварительного уведомления.</p>
              </section>
            </div>
          </div>
          <div className="p-6 border-t border-white/5">
            <button onClick={() => setShowTerms(false)} className="w-full py-3 bg-brand-blue text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors">
              Понятно
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl transition-opacity duration-200 ${backdropClass}`}
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full max-w-md bg-[#1C1C1E] rounded-[28px] p-8 shadow-2xl transition-all duration-200 ${modalClass}`}>
        {!isLoading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X size={18} />
          </button>
        )}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#1b2838] flex items-center justify-center">
            <img src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF" alt="Steam" className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Войти через Steam</h2>
          <p className="text-gray-400 text-sm">Авторизуйтесь для доступа к профилю и статистике</p>
        </div>
        {/* Реальный вход */}
        <button
          onClick={handleSteamLogin}
          className="w-full h-14 rounded-2xl bg-[#1b2838] hover:bg-[#2a475e] text-white font-bold text-lg transition-all flex items-center justify-center gap-3 mb-3"
        >
          <img src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF" alt="Steam" className="w-6 h-6" />
          Войти через Steam
        </button>

        {/* Демо вход */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoading}
          className="w-full h-12 rounded-xl bg-[#2C2C2E] hover:bg-[#3C3C3E] text-gray-300 font-medium transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Входим...
            </>
          ) : (
            'Демо-вход (для тестов)'
          )}
        </button>
        <p className="text-center text-gray-500 text-xs mt-6">
          Нажимая кнопку, вы соглашаетесь с{' '}
          <button onClick={() => setShowTerms(true)} className="text-brand-blue hover:underline">
            условиями использования
          </button>
        </p>
      </div>
    </div>
  );
};

export default SteamLoginModal;
