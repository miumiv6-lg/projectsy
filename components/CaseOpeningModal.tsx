import React, { useState, useEffect, useRef } from 'react';
import { X, Box } from 'lucide-react';

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
  { id: '1', name: '10 SY', rarity: 'common', image: 'bg-gray-700', type: 'currency', amount: 10 },
  { id: '2', name: '50 SY', rarity: 'rare', image: 'bg-blue-700', type: 'currency', amount: 50 },
  { id: '3', name: 'Бандит', rarity: 'common', image: 'bg-yellow-900', type: 'skin' },
  { id: '4', name: 'Офицер', rarity: 'rare', image: 'bg-blue-800', type: 'skin' },
  { id: '5', name: 'Хантер', rarity: 'epic', image: 'bg-purple-900', type: 'skin' },
  { id: '6', name: 'Артем', rarity: 'legendary', image: 'bg-yellow-600', type: 'skin' },
  { id: '7', name: '100 SY', rarity: 'epic', image: 'bg-purple-700', type: 'currency', amount: 100 },
  { id: '8', name: '500 SY', rarity: 'legendary', image: 'bg-yellow-500', type: 'currency', amount: 500 },
];

const RARITY_COLORS = {
  common: 'border-gray-500 shadow-gray-500/20',
  rare: 'border-blue-500 shadow-blue-500/20',
  epic: 'border-purple-500 shadow-purple-500/20',
  legendary: 'border-yellow-500 shadow-yellow-500/20',
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
      // Card width (128px) + gap (16px) = 144px
      // Target index 50
      // We want index 50 to be in the center.
      // The container starts with padding-left: 50%.
      // So 0px translation means the start of the list is at the center.
      // To center item 50, we need to move left by (50 * 144) + (128/2)
      // But since we have padding-left 50%, the center line is at 0 relative to the scroll container's content start?
      // Actually, with padding-left: 50%, the first item starts at the center.
      // So to center item 50, we translate by 50 * 144px.
      
      const cardWidth = 128;
      const gap = 16;
      const itemWidth = cardWidth + gap;
      const targetIndex = 50;
      
      // Add random offset within the card (-60 to +60) to make it land randomly on the card
      const randomOffset = Math.floor(Math.random() * 100) - 50;
      
      const targetPosition = (targetIndex * itemWidth) + randomOffset;

      scrollRef.current.style.transition = 'transform 6s cubic-bezier(0.15, 0, 0.10, 1)'; // Ease-out for "spin" effect
      scrollRef.current.style.transform = `translateX(-${targetPosition}px)`;

      // Show win screen after animation
      setTimeout(() => {
        setShowWinScreen(true);
      }, 6500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-3xl bg-[#181a20] border border-[#2d313a] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white bg-black/50 rounded-full p-1"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="p-6 text-center border-b border-[#2d313a] bg-[#1c1f26]">
          <h2 className="text-2xl font-bold text-white mb-1">Ежедневный кейс</h2>
          <p className="text-gray-500 text-sm">Открывай раз в 24 часа и получай призы!</p>
        </div>

        {/* Main Content Area */}
        <div className="relative min-h-[300px] flex flex-col justify-center bg-[#0f1115]">
          
          {showWinScreen && winner ? (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0f1115]/95 animate-fade-in">
              <div className="text-center">
                <div className="text-yellow-500 font-bold text-xl mb-4 uppercase tracking-widest animate-pulse">Выпал предмет!</div>
                <div className={`w-40 h-40 mx-auto mb-6 rounded-2xl border-4 ${RARITY_COLORS[winner.rarity]} flex items-center justify-center relative shadow-[0_0_50px_rgba(0,0,0,0.5)]`}>
                  <div className={`absolute inset-0 ${winner.image} opacity-30`}></div>
                  <Box size={64} className="text-white relative z-10" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{winner.name}</h3>
                <p className={`text-sm font-bold uppercase tracking-wider mb-8 ${
                  winner.rarity === 'legendary' ? 'text-yellow-500' :
                  winner.rarity === 'epic' ? 'text-purple-500' :
                  winner.rarity === 'rare' ? 'text-blue-500' :
                  'text-gray-500'
                }`}>
                  {winner.rarity}
                </p>
                <button 
                  onClick={onClose}
                  className="bg-white text-black font-bold py-3 px-12 rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                >
                  Забрать
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Roulette Window */}
              <div className="relative h-48 w-full flex items-center overflow-hidden mb-8">
                {/* Center Indicator */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-yellow-500 z-20 transform -translate-x-1/2 shadow-[0_0_15px_rgba(234,179,8,0.8)]"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/50 z-20 transform -translate-x-1/2"></div>
                
                {/* Gradient Overlays for depth */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0f1115] to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0f1115] to-transparent z-10 pointer-events-none"></div>

                <div 
                  ref={scrollRef}
                  className="flex gap-4 px-[50%] will-change-transform items-center h-full"
                >
                  {rouletteItems.map((item, index) => (
                    <div 
                      key={index}
                      className={`flex-shrink-0 w-32 h-32 bg-[#181a20] border-b-4 ${RARITY_COLORS[item.rarity]} rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-lg`}
                    >
                      <div className={`absolute inset-0 ${item.image} opacity-10`}></div>
                      <Box size={32} className="text-gray-300 mb-2 relative z-10" />
                      <span className="text-[10px] font-bold text-gray-300 text-center px-1 relative z-10 leading-tight">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center pb-8">
                <button
                  onClick={startOpening}
                  disabled={isOpening}
                  className={`px-12 py-4 rounded-xl font-bold text-lg text-white transition-all transform active:scale-95 shadow-xl ${
                    isOpening 
                      ? 'bg-gray-700 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 shadow-yellow-900/20'
                  }`}
                >
                  {isOpening ? 'Крутим...' : 'ОТКРЫТЬ КЕЙС'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseOpeningModal;