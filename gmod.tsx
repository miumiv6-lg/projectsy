import React from 'react';
import ReactDOM from 'react-dom/client';
import GmodInterface from './pages/GmodInterface';
import './index.css';

// Standalone GMod Interface - отдельная точка входа
const GmodApp: React.FC = () => {
  return (
    <div className="fixed inset-0 w-full h-full bg-black text-white font-sans selection:bg-brand-blue selection:text-white antialiased overflow-hidden">
      <GmodInterface setPage={() => { }} />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GmodApp />
  </React.StrictMode>
);
