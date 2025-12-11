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
    <div className="w-full min-h-screen bg-black text-red-600 font-mono relative overflow-hidden">
      {/* CRT Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-[0.03] mix-blend-screen"></div>
      <div className="absolute inset-0 pointer-events-none z-50" style={{ background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>

      <div className="relative z-10 p-6 pb-24 max-w-[800px] mx-auto">
        <button 
          onClick={() => setPage(Page.SHOP)}
          className="flex items-center gap-2 text-red-800 hover:text-red-500 transition-colors mb-8 uppercase tracking-widest text-xs border border-red-900/30 px-4 py-2 bg-black/50"
        >
          <ArrowLeft size={16} />
          <span>Abort</span>
        </button>

        <div className="border-2 border-red-900/50 p-1 mb-8 relative group">
          <div className="absolute -top-3 left-4 bg-black px-2 text-red-500 text-xs tracking-[0.3em] font-bold">SECURITY BREACH</div>
          <div className="bg-red-900/10 p-6 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
                <AlertTriangle size={64} />
             </div>
             
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 tracking-tighter" style={{ textShadow: '4px 4px 0px #991b1b' }}>
               FNAF COLLECTION
             </h1>
             <p className="text-red-400 text-sm md:text-base max-w-md border-l-4 border-red-600 pl-4 py-1">
               LIMITED TIME EVENT. EXCLUSIVE SKINS AND ITEMS FROM THE FAZBEAR UNIVERSE.
             </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="border border-red-900/30 bg-black p-4">
            <div className="aspect-square bg-[#111] mb-4 relative overflow-hidden border border-red-900/20">
              <img src="/images/fnaf/freddy.webp" alt="Freddy" className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-500 grayscale hover:grayscale-0" />
              <div className="absolute bottom-2 right-2 text-xs text-red-500 font-bold bg-black/80 px-2 py-1 border border-red-900">GLAMROCK FREDDY</div>
            </div>
            <h3 className="text-xl text-white font-bold mb-1">FREDDY FAZBEAR</h3>
            <p className="text-xs text-gray-500 mb-4">The face of Fazbear Entertainment. Now available as a playable skin.</p>
            <button className="w-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-black py-2 text-xs font-bold uppercase tracking-widest transition-all">
              Purchase - 300 SY
            </button>
          </div>

          <div className="border border-red-900/30 bg-black p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-4 text-green-500 border-b border-green-900/30 pb-2">
              <Terminal size={16} />
              <span className="text-xs tracking-widest">SYSTEM LOG</span>
            </div>
            <div 
              ref={terminalRef}
              className="flex-grow bg-[#050505] p-4 font-mono text-xs overflow-y-auto h-[200px] border border-green-900/20 shadow-[inset_0_0_20px_rgba(0,255,0,0.05)]"
            >
              {/* Terminal output will appear here */}
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-red-900/50 uppercase tracking-[0.5em]">
          Fazbear Entertainment is not responsible for death or dismemberment.
        </div>

      </div>
    </div>
  );
};

export default Fnaf;
