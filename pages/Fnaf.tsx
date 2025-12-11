import React, { useEffect, useRef } from 'react';
import { Page } from '../types';
import { ArrowLeft, Terminal, AlertTriangle } from 'lucide-react';

interface FnafProps {
  setPage: (page: Page) => void;
}

const Fnaf: React.FC<FnafProps> = ({ setPage }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeText = async (element: HTMLElement, text: string, speed: number = 50) => {
      element.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        await new Promise(r => setTimeout(r, speed));
      }
    };

    if (terminalRef.current) {
      const lines = [
        "CONNECTING TO FAZBEAR ENTERTAINMENT SERVERS...",
        "ACCESS GRANTED.",
        "DOWNLOADING ASSETS...",
        "WARNING: ANOMALOUS SIGNATURE DETECTED.",
        "PROCEEDING ANYWAY...",
        "WELCOME TO THE MEGA PIZZAPLEX."
      ];

      const runTerminal = async () => {
        for (const line of lines) {
          const p = document.createElement('p');
          p.className = "mb-1 text-green-500 font-mono text-xs";
          terminalRef.current?.appendChild(p);
          await typeText(p, line, 30);
          await new Promise(r => setTimeout(r, 300));
        }
      };

      runTerminal();
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white font-mono relative overflow-hidden">
      
      <div className="relative z-10 p-6 pb-24 max-w-md mx-auto">
        <button 
          onClick={() => setPage(Page.SHOP)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8 text-xs font-bold uppercase tracking-widest border border-white/10 px-4 py-2 rounded-lg bg-black hover:bg-white/5"
        >
          <ArrowLeft size={14} />
          <span>Abort</span>
        </button>

        <div className="cursor-card rounded-2xl p-1 mb-8 relative group border-red-900/50">
          <div className="absolute -top-3 left-6 bg-black px-2 text-red-500 text-[10px] tracking-[0.3em] font-bold uppercase">Security Breach</div>
          <div className="p-6 relative overflow-hidden rounded-xl">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <AlertTriangle size={64} className="text-red-600" />
             </div>
             
             <h1 className="text-4xl font-black text-white mb-2 tracking-tighter text-red-600">
               FNAF
             </h1>
             <p className="text-white/40 text-sm leading-relaxed max-w-[80%] font-sans">
               Limited time event. Exclusive skins from the Fazbear Universe.
             </p>
          </div>
        </div>

        <div className="grid gap-6 mb-8">
          <div className="cursor-card rounded-2xl p-5">
            <div className="aspect-square bg-zinc-900 rounded-xl mb-4 relative overflow-hidden border border-white/5 group">
              <img src="/images/fnaf/freddy.webp" alt="Freddy" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
              <div className="absolute bottom-3 right-3 text-[10px] text-red-400 font-bold bg-black/90 px-3 py-1.5 rounded-full border border-red-900/30">GLAMROCK FREDDY</div>
            </div>
            <h3 className="text-xl text-white font-medium mb-1 tracking-tight">Freddy Fazbear</h3>
            <p className="text-xs text-white/40 mb-5 leading-relaxed font-sans">The face of Fazbear Entertainment. Now available as a playable skin.</p>
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-red-900/20 active:scale-95">
              Purchase - 300 SY
            </button>
          </div>

          <div className="cursor-card rounded-2xl p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-green-500 border-b border-white/5 pb-3">
              <Terminal size={14} />
              <span className="text-[10px] tracking-widest font-bold">SYSTEM LOG</span>
            </div>
            <div 
              ref={terminalRef}
              className="flex-grow bg-black rounded-xl p-4 font-mono text-[10px] overflow-y-auto h-[150px] border border-white/5 text-green-500/80"
            >
              {/* Terminal output will appear here */}
            </div>
          </div>
        </div>

        <div className="text-center text-[8px] text-white/20 uppercase tracking-[0.2em] font-sans">
          Fazbear Entertainment © 2025
        </div>

      </div>
    </div>
  );
};

export default Fnaf;
