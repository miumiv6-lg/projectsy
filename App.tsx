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
import Subscription from './pages/Subscription';
import Fnaf from './pages/Fnaf';
import Terms from './pages/Terms';
import SkinsCollection from './pages/SkinsCollection';

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
      tg.setHeaderColor('#000000');
      tg.setBackgroundColor('#000000');
      // Set bottom bar color if supported (for full immersion)
      if (tg.setBottomBarColor) {
        tg.setBottomBarColor('#000000');
      }
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
    }
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.SHOP: return <Shop setPage={setCurrentPage} />;
      case Page.TICKETS: return <Tickets />;
      case Page.SUBSCRIPTION: return <Subscription setPage={setCurrentPage} />;
      case Page.TERMS: return <Terms setPage={setCurrentPage} />;
      case Page.SKINS: return <SkinsCollection setPage={setCurrentPage} />;
      case Page.FNAF: return <Fnaf setPage={setCurrentPage} />;
      default: return <Shop setPage={setCurrentPage} />;
    }
  };

  return (
    <div
      className="min-h-screen text-white flex flex-col antialiased overflow-x-hidden selection:bg-white/20"
      style={{ backgroundColor: '#000000' }} 
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
