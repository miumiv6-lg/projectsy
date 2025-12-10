import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ShieldCheck, Gamepad2 } from 'lucide-react';
import GoogleLoader from './GoogleLoader';
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
      setAnimateOut(true);
      timeoutRef.current = setTimeout(() => {
        setShouldRender(false);
        setAnimateOut(false);
        setShowTerms(false);
      }, 300);
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

  // Terms View
  if (showTerms) {
    return (
      <div
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-sm transition-all duration-300 ${backdropClass}`}
        onClick={handleBackdropClick}
      >
        <div className={`relative w-full max-w-lg bg-surface-container rounded-[28px] shadow-2xl max-h-[85vh] flex flex-col transition-all duration-300 ${modalClass}`}>
          
          {/* Header */}
          <div className="flex items-center gap-3 p-5 border-b border-outline-variant/20">
            <button
              onClick={() => setShowTerms(false)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full hover:bg-surface-container-high text-primary label-large transition-colors"
            >
              <ChevronLeft size={20} />
              Назад
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="headline-small text-on-surface mb-6">Условия использования</h2>
            <div className="space-y-4">
              <section className="m3-card p-5">
                <h3 className="title-medium text-on-surface mb-2 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary"/>
                  1. Общие положения
                </h3>
                <p className="body-medium text-on-surface-variant">
                  Настоящие условия регулируют использование сервиса Project SY. 
                  Регистрируясь на сайте, вы соглашаетесь с данными условиями.
                </p>
              </section>
              <section className="m3-card p-5">
                <h3 className="title-medium text-on-surface mb-2">2. Учётная запись</h3>
                <p className="body-medium text-on-surface-variant">
                  Для доступа требуется авторизация через Steam. 
                  Мы получаем только публичную информацию профиля.
                </p>
              </section>
              <section className="m3-card p-5">
                <h3 className="title-medium text-on-surface mb-2">3. Правила поведения</h3>
                <ul className="list-disc list-inside space-y-1 body-medium text-on-surface-variant">
                  <li>Запрещено использование читов</li>
                  <li>Запрещены оскорбления</li>
                </ul>
              </section>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-5 border-t border-outline-variant/20">
            <button 
              onClick={() => setShowTerms(false)} 
              className="w-full h-12 bg-primary text-on-primary rounded-full title-small hover:shadow-lg transition-all active:scale-[0.98]"
            >
              Принимаю
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login View
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scrim/60 backdrop-blur-sm transition-all duration-300 ${backdropClass}`}
      onClick={handleBackdropClick}
    >
      <div className={`relative w-full max-w-sm bg-surface-container rounded-[28px] p-8 shadow-2xl transition-all duration-300 ${modalClass}`}>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="absolute top-4 right-4 w-10 h-10 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-surface-container-high rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-8 h-8 text-on-surface" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 3.12.597 6.035 1.636 8.636l2.97-4.16c-.053-.28-.088-.567-.088-.86 0-2.486 2.014-4.5 4.5-4.5.293 0 .58.035.86.088l4.16-2.97C13.565 2.87 12.805 0 12 0zm6.916 6.773c-.05.27-.083.546-.083.826 0 2.485-2.015 4.5-4.5 4.5-.28 0-.556-.032-.826-.083l-2.97 4.16c1.17 1.632 2.83 2.91 4.79 3.654L18.916 6.773zM12 24c6.627 0 12-5.373 12-12 0-3.12-.597-6.035-1.636-8.636l-2.97 4.16c.053.28.088.567.088.86 0 2.486-2.014 4.5-4.5 4.5-.293 0-.58-.035-.86-.088l-4.16 2.97c2.503 5.277 8.16 8.834 14.684 8.834z"/>
            </svg>
          </div>
          <h2 className="headline-small text-on-surface mb-1">Войти</h2>
          <p className="body-medium text-on-surface-variant">Используйте аккаунт Steam</p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {/* Steam Login */}
          <button
            onClick={handleSteamLogin}
            className="w-full h-12 rounded-full bg-primary text-on-primary title-small hover:shadow-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 3.12.597 6.035 1.636 8.636l2.97-4.16c-.053-.28-.088-.567-.088-.86 0-2.486 2.014-4.5 4.5-4.5.293 0 .58.035.86.088l4.16-2.97C13.565 2.87 12.805 0 12 0zm6.916 6.773c-.05.27-.083.546-.083.826 0 2.485-2.015 4.5-4.5 4.5-.28 0-.556-.032-.826-.083l-2.97 4.16c1.17 1.632 2.83 2.91 4.79 3.654L18.916 6.773zM12 24c6.627 0 12-5.373 12-12 0-3.12-.597-6.035-1.636-8.636l-2.97 4.16c.053.28.088.567.088.86 0 2.486-2.014 4.5-4.5 4.5-.293 0-.58-.035-.86-.088l-4.16 2.97c2.503 5.277 8.16 8.834 14.684 8.834z"/>
            </svg>
            Войти через Steam
          </button>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="w-full h-12 rounded-full border border-outline hover:bg-surface-container-high text-on-surface title-small transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <GoogleLoader size={20} />
                Входим...
              </>
            ) : (
              <>
                <Gamepad2 size={18} />
                Демо-режим
              </>
            )}
          </button>
        </div>
        
        {/* Terms Link */}
        <p className="text-center body-small text-on-surface-variant mt-6 px-4">
          Продолжая, вы соглашаетесь с{' '}
          <button onClick={() => setShowTerms(true)} className="text-primary hover:underline">
            условиями
          </button>
        </p>
      </div>
    </div>
  );
};

export default SteamLoginModal;
