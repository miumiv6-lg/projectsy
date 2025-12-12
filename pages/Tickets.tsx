import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CreditCard, Bug, UserX, HelpCircle, Terminal, Sparkles, Plus, Eraser } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTicketPrompt?: boolean;
  ticketData?: TicketData;
  ticketStatus?: 'idle' | 'submitting' | 'submitted';
}

interface TicketData {
  category: string;
  subject: string;
  description: string;
}

const renderInline = (text: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let buf = '';

  const flush = () => {
    if (buf) {
      nodes.push(buf);
      buf = '';
    }
  };

  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1);
      if (end !== -1) {
        flush();
        const code = text.slice(i + 1, end);
        nodes.push(
          <code
            key={`code-${i}`}
            className="font-mono text-[11px] bg-white/10 px-1 py-0.5 rounded text-accent-foreground"
          >
            {code}
          </code>
        );
        i = end + 1;
        continue;
      }
    }

    if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2);
      if (end !== -1) {
        flush();
        const strong = text.slice(i + 2, end);
        nodes.push(
          <strong key={`strong-${i}`} className="font-semibold text-white">
            {strong}
          </strong>
        );
        i = end + 2;
        continue;
      }
    }

    buf += text[i];
    i += 1;
  }

  flush();
  return nodes;
};

const renderMessageContent = (text: string) => {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {renderInline(line)}
          {idx < lines.length - 1 ? <br /> : null}
        </React.Fragment>
      ))}
    </>
  );
};

const Tickets: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Привет. Я ассистент поддержки Project SY. Опиши свою проблему, и я помогу создать тикет для администрации.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
        setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'Понял. Я могу помочь оформить официальный тикет для администрации по этому вопросу.'
        }]);
        setIsLoading(false);
    }, 1000);
  };

  const handleClear = () => {
    setMessages([{
      role: 'assistant',
      content: 'Чат очищен. Чем могу помочь?'
    }]);
  };

  return (
    <div className="w-full h-screen bg-background flex flex-col pt-safe-top font-sans text-sm selection:bg-accent selection:text-white">
      
      {/* Support Header */}
      <div className="h-10 border-b border-border flex items-center justify-between px-3 bg-background sticky top-0 z-10">
         <div className="flex items-center gap-2 text-zinc-400">
            <Bot size={14} className="text-accent" />
            <span className="text-xs font-medium text-zinc-300">Поддержка</span>
         </div>
         <div className="flex items-center gap-2">
            <button onClick={handleClear} className="p-1 hover:bg-surface-hover rounded text-zinc-500 hover:text-white transition-colors" title="Очистить чат">
               <Eraser size={14} />
            </button>
            <button className="p-1 hover:bg-surface-hover rounded text-zinc-500 hover:text-white transition-colors">
               <Terminal size={14} />
            </button>
         </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-4 space-y-6 pb-40 no-scrollbar"
      >
        {messages.map((msg, idx) => (
          <div key={idx} className="flex gap-3 group">
            <div className="mt-0.5 w-6 h-6 flex-shrink-0 flex items-center justify-center">
              {msg.role === 'user' ? (
                 <div className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-white text-[10px] font-bold">U</div>
              ) : (
                 <Bot size={16} className="text-accent" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                 <span className="text-xs font-semibold text-zinc-300">
                    {msg.role === 'user' ? 'Вы' : 'Ассистент'}
                 </span>
              </div>
              <div className="text-zinc-300 leading-relaxed text-[13px]">
                {renderMessageContent(msg.content)}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
           <div className="flex gap-3 animate-pulse">
              <div className="w-6 flex justify-center"><Bot size={16} className="text-zinc-600" /></div>
              <div className="text-zinc-500 text-xs mt-1">Печатает...</div>
           </div>
        )}
      </div>

      {/* Input Area (Cursor Command L Style) */}
      <div
        className="fixed left-0 right-0 p-3 bg-background border-t border-border z-20"
        style={{ bottom: 'calc(40px + env(safe-area-inset-bottom))' }} // 40px for bottom nav height
      >
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSend} className="relative group">
            <div className="relative bg-surface border border-border rounded-md overflow-hidden transition-colors focus-within:border-zinc-600">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Спроси что-нибудь..."
                className="w-full bg-transparent text-[13px] text-zinc-200 p-3 pr-10 outline-none placeholder:text-zinc-600 font-normal"
                autoComplete="off"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="p-1.5 bg-white text-black rounded-sm disabled:opacity-30 hover:opacity-90 transition-opacity"
                >
                  <Send size={12} strokeWidth={2.5} />
                </button>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-3">
                   <div className="text-[10px] text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                      Контекст <span className="text-zinc-700">Нет</span>
                   </div>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
