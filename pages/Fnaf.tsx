import React, { useEffect, useRef } from 'react';
import { Page } from '../types';
import { ArrowLeft, Terminal, AlertTriangle, ShieldAlert } from 'lucide-react';

interface FnafProps {
  setPage: (page: Page) => void;
}

const Fnaf: React.FC<FnafProps> = ({ setPage }) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeText = async (element: HTMLElement, text: string, speed: number = 30) => {
      element.innerHTML = '';
      for (let i = 0; i < text.length; i++) {
        element.innerHTML += text.charAt(i);
        await new Promise(r => setTimeout(r, speed));
      }
    };

    if (terminalRef.current) {
      const lines = [
        "> INITIALIZING CONNECTION...",
        "> ACCESS GRANTED: FAZBEAR_CORP",
        "> DOWNLOADING ASSETS [||||||||||] 100%",
        "> WARNING: ANOMALOUS SIGNATURE DETECTED",
        "> SECURITY PROTOCOL BYPASSED",
        "> WELCOME TO THE MEGA PIZZAPLEX"
      ];

      const runTerminal = async () => {
        for (const line of lines) {
          const p = document.createElement('div');
          p.className = "mb-1 text-green-500 font-mono text-[10px] leading-tight opacity-80";
          if (line.includes("WARNING")) p.className = "mb-1 text-red-500 font-mono text-[10px] leading-tight font-bold";
          terminalRef.current?.appendChild(p);
          await typeText(p, line, 20);
          await new Promise(r => setTimeout(r, 200));
        }
      };

      runTerminal();
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-background text-white font-mono relative overflow-hidden animate-fade-in">

      <div className="relative z-10 p-6 pb-24 max-w-md mx-auto">
        <button 
          onClick={() => setPage(Page.SHOP)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 text-[10px] font-bold uppercase tracking-widest border border-[var(--color-border)] px-4 py-2 rounded-lg bg-[var(--color-surface)]"
        >
          <ArrowLeft size={12} />
          <span>BACK_TO_SHOP</span>
        </button>

        <div className="cursor-card rounded-xl p-1 mb-8 relative border-red-900/30 overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
             <ShieldAlert size={120} className="text-red-500" />
          </div>
          <div className="absolute -top-3 left-6 bg-black px-2 text-red-500 text-[9px] tracking-[0.2em] font-bold uppercase border border-red-900/30 rounded-full py-0.5 z-20">
            Security Breach
          </div>
          
          <div className="p-6 relative z-10">
             <h1 className="text-3xl font-black text-white mb-2 tracking-tighter text-red-500">
               FNAF_EVENT
             </h1>
             <p className="text-zinc-500 text-xs leading-relaxed max-w-[80%]">
               LIMITED TIME EVENT. EXCLUSIVE SKINS FROM FAZBEAR UNIVERSE.
             </p>
          </div>
        </div>

        <div className="grid gap-4 mb-8">
          <div className="cursor-card rounded-xl p-4 border-red-900/30 group">
            <div className="aspect-square bg-zinc-900 rounded-lg mb-4 relative overflow-hidden border border-[var(--color-border)]">
              <img src="/images/fnaf/freddy.webp" alt="Freddy" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" />
              <div className="absolute bottom-2 right-2 text-[8px] text-red-400 font-bold bg-black/90 px-2 py-1 rounded border border-red-900/30 backdrop-blur-md">
                UNIT_01: FREDDY
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-2">
               <h3 className="text-sm text-white font-bold tracking-tight">GLAMROCK_FREDDY</h3>
               <span className="text-xs text-red-500 font-bold">300 SY</span>
            </div>
            
            <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] transition-colors active:scale-95">
              INITIATE_PURCHASE
            </button>
          </div>

          <div className="cursor-card rounded-xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-green-500 border-b border-[var(--color-border)] pb-2">
              <Terminal size={12} />
              <span className="text-[9px] tracking-[0.2em] font-bold">SYSTEM_LOG</span>
            </div>
            <div 
              ref={terminalRef}
              className="flex-grow bg-[var(--color-surface-hover)] rounded-lg p-3 font-mono h-[120px] border border-[var(--color-border)] overflow-hidden"
            >
              {/* Terminal output */}
            </div>
          </div>
        </div>

        <div className="text-center text-[8px] text-zinc-800 uppercase tracking-[0.2em]">
          Fazbear Entertainment © 2025
        </div>

      </div>
    </div>
  );
};

export default Fnaf;
