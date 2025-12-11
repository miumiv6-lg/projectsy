import React, { useState, useEffect, useRef } from 'react';
import { X, Box, Gift, ChevronRight } from 'lucide-react';

interface CaseItem {
  id: string;
  name: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  image: string; // Tailwind class for bg color
  type: 'skin' | 'currency';
  amount?: number;
}

interface CaseOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ITEMS: CaseItem[] = [
  { id: '1', name: '10 SY', rarity: 'common', image: 'bg-zinc-800', type: 'currency', amount: 10 },
  { id: '2', name: '50 SY', rarity: 'rare', image: 'bg-zinc-800', type: 'currency', amount: 50 },
  { id: '3', name: 'Бандит', rarity: 'common', image: 'bg-zinc-900', type: 'skin' },
  { id: '4', name: 'Офицер', rarity: 'rare', image: 'bg-zinc-900', type: 'skin' },
  { id: '5', name: 'Хантер', rarity: 'epic', image: 'bg-zinc-800', type: 'skin' },
  { id: '6', name: 'Артем', rarity: 'legendary', image: 'bg-zinc-700', type: 'skin' },
  { id: '7', name: '100 SY', rarity: 'epic', image: 'bg-zinc-700', type: 'currency', amount: 100 },
  { id: '8', name: '500 SY', rarity: 'legendary', image: 'bg-zinc-600', type: 'currency', amount: 500 },
];

const RARITY_COLORS = {
  common: 'border-zinc-700',
  rare: 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
  epic: 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
  legendary: 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.4)]',
};

const CaseOpeningModal: React.FC<CaseOpeningModalProps> = ({ isOpen, onClose }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [rouletteItems, setRouletteItems] = useState<CaseItem[]>([]);
  const [winner, setWinner] = useState<CaseItem | null>(null);
  const [showWinScreen, setShowWinScreen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const items = [];
      // Generate 60 items for the scroll
      for (let i = 0; i < 60; i++) {
        items.push(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
      }
      
      // Pre-determine winner at index 50
      const winItem = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      items[50] = winItem;
      
      setWinner(winItem);
      setRouletteItems(items);
      setIsOpening(false);
      setShowWinScreen(false);
      
      if (scrollRef.current) {
        scrollRef.current.style.transform = 'translateX(0px)';
        scrollRef.current.style.transition = 'none';
      }
    }
  }, [isOpen]);

  const startOpening = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (scrollRef.current) {
      // Card width (112px) + gap (12px) = 124px
      const cardWidth = 112;
      const gap = 12;
      const itemWidth = cardWidth + gap;
      const targetIndex = 50;
      
      const randomOffset = Math.floor(Math.random() * 80) - 40;
      
      const targetPosition = (targetIndex * itemWidth) + randomOffset;

      scrollRef.current.style.transition = 'transform 6s cubic-bezier(0.15, 0, 0.10, 1)';
      scrollRef.current.style.transform = `translateX(-${targetPosition}px)`;

      setTimeout(() => {
        setShowWinScreen(true);
      }, 6500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 animate-fade-in">
      <div className="w-full max-w-lg bg-[#050505] border border-white/10 rounded-3xl overflow-hidden flex flex-col relative shadow-2xl animate-scale-in">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-full p-2"
        >
          <X size={16} />
        </button>

        {/* Main Content Area */}
        <div className="relative min-h-[400px] flex flex-col justify-center items-center p-6">
          
          {showWinScreen && winner ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]/90 backdrop-blur-sm animate-fade-in p-6">
              <div className="text-center w-full">
                <div className="text-zinc-500 text-xs font-mono mb-6 uppercase tracking-widest">Новый предмет</div>
                
                <div className={`w-48 h-48 mx-auto mb-8 rounded-2xl border ${RARITY_COLORS[winner.rarity]} flex items-center justify-center relative bg-zinc-900 group`}>
                  <div className={`absolute inset-0 ${winner.image} opacity-20 blur-xl group-hover:opacity-30 transition-opacity`}></div>
                  <Gift size={64} className="text-white relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" strokeWidth={1} />
                  
                  {/* Particles/Glow effect based on rarity */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"></div>
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">{winner.name}</h3>
                <p className={`text-[10px] font-bold uppercase tracking-[0.2em] mb-10 ${
                  winner.rarity === 'legendary' ? 'text-yellow-500' :
                  winner.rarity === 'epic' ? 'text-purple-500' :
                  winner.rarity === 'rare' ? 'text-blue-500' :
                  'text-zinc-500'
                }`}>
                  {winner.rarity}
                </p>
                
                <button 
                  onClick={onClose}
                  className="w-full bg-white text-black font-medium py-4 rounded-xl hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)] text-sm tracking-wide"
                >
                  Забрать награду
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-xl font-medium text-white mb-2 tracking-tight">Ежедневный кейс</h2>
                <p className="text-zinc-500 text-sm font-light">Испытай удачу и получи эксклюзивные скины</p>
              </div>

              {/* Roulette Window */}
              <div className="relative h-32 w-full flex items-center overflow-hidden mb-10 mask-linear-fade">
                {/* Center Indicator */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white z-20 transform -translate-x-1/2 shadow-[0_0_10px_white]"></div>
                
                {/* Gradient Overlays for depth */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none"></div>

                <div 
                  ref={scrollRef}
                  className="flex gap-3 px-[50%] will-change-transform items-center h-full"
                >
                  {rouletteItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex-shrink-0 w-28 h-28 bg-[#0a0a0a] border ${RARITY_COLORS[item.rarity]} rounded-xl flex flex-col items-center justify-center relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 ${item.image} opacity-10`}></div>
                      <Box size={24} className="text-zinc-400 mb-3 relative z-10" strokeWidth={1.5} />
                      <span className="text-[10px] font-medium text-zinc-300 text-center px-1 relative z-10 leading-tight tracking-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={startOpening}
                disabled={isOpening}
                className={`w-full py-4 rounded-xl font-medium text-sm transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                  isOpening 
                    ? 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-white/5' 
                    : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                }`}
              >
                {isOpening ? (
                   <span className="animate-pulse">Открываем...</span>
                ) : (
                   <>
                     <span>Открыть бесплатно</span>
                     <ChevronRight size={14} />
                   </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseOpeningModal;
