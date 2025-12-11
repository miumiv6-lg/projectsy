import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Check, CreditCard, Bug, UserX, HelpCircle, History } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isTicketPrompt?: boolean;
  ticketData?: TicketData;
}

interface TicketData {
  category: string;
  subject: string;
  description: string;
}

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'rejected';
  date: string;
  category: string;
}

const Tickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Привет! Я виртуальный помощник Project SY. Опишите вашу проблему, и я помогу создать обращение к администрации.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', subject: 'Не пришел донат', status: 'resolved', date: '10.12.2025', category: 'donate' },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeTab]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: messages.concat(userMessage).map(m => ({ role: m.role, content: m.content })) 
        })
      });

      const data = await response.json();
      let aiContent = data.choices?.[0]?.message?.content || 'Ошибка сети.';
      
      // Parse for Ticket Data
      let ticketData: TicketData | undefined;
      const ticketMatch = aiContent.match(/\[TICKET_DATA\]([\s\S]*?)\[\/TICKET_DATA\]/);
      
      if (ticketMatch) {
        try {
          ticketData = JSON.parse(ticketMatch[1]);
          aiContent = aiContent.replace(ticketMatch[0], '').trim(); // Remove JSON from visible text
        } catch (e) {
          console.error("Failed to parse ticket data", e);
        }
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: aiContent,
        isTicketPrompt: !!ticketData,
        ticketData
      }]);

    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Не удалось связаться с сервером.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = (data: TicketData) => {
    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject: data.subject,
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
      category: data.category
    };
    
    setTickets(prev => [newTicket, ...prev]);
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '✅ Тикет успешно создан! Администратор рассмотрит его в ближайшее время.' 
    }]);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'tech': return <Bug size={14} />;
      case 'player': return <UserX size={14} />;
      case 'donate': return <CreditCard size={14} />;
      default: return <HelpCircle size={14} />;
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col pt-safe-top overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#050505] z-10">
        <h1 className="text-lg font-medium text-white tracking-tight">Поддержка</h1>
        <div className="flex bg-zinc-900/50 rounded-lg p-1 border border-white/5">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'chat' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Чат
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === 'history' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'
            }`}
          >
            Тикеты
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 pb-32"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 text-zinc-400' 
                      : 'bg-blue-600/20 text-blue-500 border border-blue-600/30'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  
                  <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-white text-black rounded-tr-none'
                      : 'bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>

                {/* Ticket Creation Confirmation Card */}
                {msg.isTicketPrompt && msg.ticketData && (
                  <div className="ml-11 max-w-[85%] animate-scale-in">
                    <div className="bg-[#0A0A0A] border border-green-500/20 rounded-xl p-4 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
                      <div className="flex items-center gap-2 mb-3 text-green-500">
                        <Check size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Подтверждение</span>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="text-xs text-zinc-500">Тема: <span className="text-white">{msg.ticketData.subject}</span></div>
                        <div className="text-xs text-zinc-500">Категория: <span className="text-white capitalize">{msg.ticketData.category}</span></div>
                      </div>
                      <button 
                        onClick={() => handleCreateTicket(msg.ticketData!)}
                        className="w-full bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-3 rounded-lg transition-all active:scale-95"
                      >
                        Создать тикет
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-500 border border-blue-600/30 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="bg-zinc-900 border border-white/5 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin text-zinc-500" />
                  <span className="text-xs text-zinc-500">Печатает...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="fixed bottom-[80px] left-0 right-0 p-4 bg-gradient-to-t from-black via-black to-transparent z-20">
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSend} className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Опишите проблему..."
                  className="w-full bg-[#121212] border border-white/10 rounded-2xl pl-5 pr-12 py-4 text-sm text-white focus:border-white/20 outline-none transition-all shadow-xl placeholder:text-zinc-600"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-white text-black rounded-xl hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-90"
                >
                  <Send size={16} strokeWidth={2.5} />
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* History View */
        <div className="flex-grow overflow-y-auto p-4 space-y-3 pb-24">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="cursor-card rounded-xl p-4 flex items-center justify-between group hover:border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-400">
                  {getCategoryIcon(ticket.category)}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white leading-tight max-w-[180px] truncate mb-1">{ticket.subject}</h3>
                  <span className="text-[10px] text-zinc-600 font-mono tracking-tight bg-zinc-900 px-1.5 py-0.5 rounded border border-white/5">#{ticket.id} • {ticket.date}</span>
                </div>
              </div>
              
              <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                ticket.status === 'resolved' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                ticket.status === 'rejected' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 
                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                {ticket.status === 'resolved' ? 'Решено' : 
                 ticket.status === 'rejected' ? 'Закрыто' : 'В работе'}
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-24 opacity-50">
              <History size={32} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-500 text-sm">История пуста</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;
