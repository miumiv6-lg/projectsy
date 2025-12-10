import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
// @ts-ignore
import Lenis from 'lenis';
import { Page } from './types';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import { AuthProvider } from './context/AuthContext';
import SteamLoginModal from './components/SteamLoginModal';

// Pages
import Home from './pages/Home';
import Play from './pages/Play';
import About from './pages/About';
import Team from './pages/Team';
import Theory from './pages/Theory';
import FAQ from './pages/FAQ';
import News from './pages/News';
import Contacts from './pages/Contacts';
import Profile from './pages/Profile';
import Forum from './pages/Forum';
import Admin from './pages/Admin';
import Workshop from './pages/Workshop';
import Rules from './pages/Rules';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const lenisRef = useRef<any>(null);

  // SYNCHRONOUS scroll reset - runs before browser paints
  useLayoutEffect(() => {
    // Destroy Lenis immediately
    if (lenisRef.current) {
      lenisRef.current.stop();
      lenisRef.current.destroy();
      lenisRef.current = null;
    }

    // Force scroll to top synchronously
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Дополнительный сброс после микротаска
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
  }, [currentPage]);

  // Initialize Smooth Scrolling (Lenis) - DISABLED per user request
  /* 
  useEffect(() => {
    // Create Lenis after a small delay
    const timer = setTimeout(() => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    }, 50);

    return () => {
      clearTimeout(timer);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [currentPage]); 
  */

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME: return <Home setPage={setCurrentPage} />;
      case Page.PLAY: return <Play setPage={setCurrentPage} />;
      case Page.ABOUT: return <About setPage={setCurrentPage} />;
      case Page.TEAM: return <Team />;
      case Page.THEORY: return <Theory />;
      case Page.FAQ: return <FAQ setPage={setCurrentPage} />;
      case Page.NEWS: return <News />;
      case Page.CONTACTS: return <Contacts />;
      case Page.FORUM: return <Forum />;
      case Page.ADMIN: return <Admin setPage={setCurrentPage} />;
      case Page.PROFILE: return <Profile setPage={setCurrentPage} />;
      case Page.WORKSHOP: return <Workshop />;
      case Page.RULES: return <Rules setPage={setCurrentPage} />;
      default: return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div
      className="bg-background min-h-screen text-white font-sans selection:bg-brand selection:text-white flex flex-col antialiased"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Navigation currentPage={currentPage} setPage={setCurrentPage} />
      
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        isCollapsed={isSidebarCollapsed} 
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />

      <main 
        className={`flex-grow flex flex-col pt-16 pb-10 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-[50px]' : 'ml-[240px]'
        }`}
      >
        {/* We use a Key here so React remounts the transition wrapper every time the page changes */}
        <PageTransition key={currentPage}>
          {renderPage()}
        </PageTransition>
      </main>

      {/* Footer should probably be inside Main or pushed by Sidebar too */}
      <div className={`transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'ml-[50px]' : 'ml-[240px]'
        }`}>
        <Footer setPage={setCurrentPage} />
      </div>

      {/* Global Steam Login Modal */}
      <SteamLoginModal />
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
