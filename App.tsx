import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
// @ts-ignore
import Lenis from 'lenis';
import { Page } from './types';
import BottomNavigation from './components/BottomNavigation';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './context/AuthContext';

// Pages
import Shop from './pages/Shop';
import Tickets from './pages/Tickets';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SHOP);
  const lenisRef = useRef<any>(null);

  // Initialize Telegram Web App
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      
      // Set header color to match app background
      tg.setHeaderColor('#0f1115');
      tg.setBackgroundColor('#0f1115');
    }
  }, []);

  // SYNCHRONOUS scroll reset
  useLayoutEffect(() => {
    // Only init Lenis if in browser
    if (typeof window !== 'undefined') {
      try {
        if (lenisRef.current) {
          lenisRef.current.stop();
          lenisRef.current.destroy();
          lenisRef.current = null;
        }
      } catch (e) {
        console.error("Lenis cleanup error:", e);
      }

      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.SHOP: return <Shop />;
      case Page.TICKETS: return <Tickets />;
      default: return <Shop />;
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col antialiased overflow-x-hidden"
      style={{ backgroundColor: '#0f1115' }} 
      onContextMenu={(e) => e.preventDefault()}
    >
      <main className="flex-grow flex flex-col w-full max-w-[100vw] overflow-x-hidden">
        <PageTransition key={currentPage}>
          {renderPage()}
        </PageTransition>
      </main>

      <BottomNavigation currentPage={currentPage} setPage={setCurrentPage} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
