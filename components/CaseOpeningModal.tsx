import React, { useState, useEffect, useRef } from 'react';
import { X, Box, Gift, ChevronRight, Loader2 } from 'lucide-react';

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
  rare: 'border-blue-500',
  epic: 'border-purple-500',
  legendary: 'border-yellow-500',
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
      // Card width (96px) + gap (12px) = 108px
      const cardWidth = 96;
      const gap = 12;
      const itemWidth = cardWidth + gap;
      const targetIndex = 50;
      
      const randomOffset = Math.floor(Math.random() * 60) - 30;
      
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md bg-background border border-border rounded-lg shadow-2xl flex flex-col font-sans text-sm">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface">
           <div className="flex items-center gap-2">
              <Gift size={14} className="text-zinc-400" />
              <span className="font-medium text-white text-xs">daily_bonus_case.exe</span>
           </div>
           <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
              <X size={14} />
           </button>
        </div>

        {/* Content */}
        <div className="p-6 relative min-h-[300px] flex flex-col items-center justify-center">
          
          {showWinScreen && winner ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background animate-fade-in p-6">
              <div className="text-center w-full">
                <div className="text-green-400 text-xs font-mono mb-6 uppercase tracking-widest flex items-center justify-center gap-2">
                   <Check size={12} />
                   <span>Success</span>
                </div>
                
                <div className={`w-32 h-32 mx-auto mb-6 rounded border ${RARITY_COLORS[winner.rarity]} flex items-center justify-center relative bg-surface`}>
                  <Box size={48} className="text-white" strokeWidth={1} />
                </div>
                
                <h3 className="text-lg font-medium text-white mb-1">{winner.name}</h3>
                <p className={`text-[10px] font-mono uppercase mb-8 ${
                  winner.rarity === 'legendary' ? 'text-yellow-500' :
                  winner.rarity === 'epic' ? 'text-purple-500' :
                  winner.rarity === 'rare' ? 'text-blue-500' :
                  'text-zinc-500'
                }`}>
                  rarity: {winner.rarity}
                </p>
                
                <button 
                  onClick={onClose}
                  className="w-full cursor-button font-medium py-2.5 rounded text-xs"
                >
                  Принять и закрыть
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="text-base font-medium text-white mb-1">Выполнение кейса</h2>
                <p className="text-zinc-500 text-xs font-mono">./process_reward --random</p>
              </div>

              {/* Roulette Window */}
              <div className="relative h-28 w-full flex items-center overflow-hidden mb-8 border-y border-border bg-surface/30">
                {/* Center Indicator */}
                <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-accent z-20 transform -translate-x-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                <div 
                  ref={scrollRef}
                  className="flex gap-3 px-[50%] will-change-transform items-center h-full"
                >
                  {rouletteItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex-shrink-0 w-24 h-24 bg-surface border ${RARITY_COLORS[item.rarity]} rounded flex flex-col items-center justify-center relative overflow-hidden`}
                    >
                      <div className={`absolute inset-0 ${item.image} opacity-5`}></div>
                      <Box size={20} className="text-zinc-400 mb-2 relative z-10" strokeWidth={1.5} />
                      <span className="text-[9px] font-medium text-zinc-300 text-center px-1 relative z-10 leading-tight truncate w-full">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={startOpening}
                disabled={isOpening}
                className={`w-full py-2.5 rounded font-medium text-xs transition-all flex items-center justify-center gap-2 ${
                  isOpening 
                    ? 'bg-surface text-zinc-500 cursor-not-allowed border border-border' 
                    : 'cursor-button'
                }`}
              >
                {isOpening ? (
                   <>
                     <Loader2 size={12} className="animate-spin" />
                     <span>Обработка...</span>
                   </>
                ) : (
                   <>
                     <span>Запустить</span>
                     <ChevronRight size={12} />
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
