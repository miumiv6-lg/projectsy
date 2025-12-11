import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CreditCard, Bug, UserX, HelpCircle, History } from 'lucide-react';

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
      
      if (data.error) {
        throw new Error(data.error.message || JSON.stringify(data.error));
      }

      let aiContent = data.choices?.[0]?.message?.content;
      
      if (!aiContent) {
        throw new Error('Invalid response format from AI provider');
      }
      
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

    } catch (error: any) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${error.message || 'Не удалось связаться с сервером.'}` }]);
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
    <div className="w-full h-screen bg-[#09090b] text-zinc-100 flex flex-col pt-safe-top font-sans selection:bg-blue-500/30">
      
      {/* Minimal Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md z-10 sticky top-0">
        <div className="flex items-center gap-2">
           <Bot size={18} className="text-zinc-400" />
           <span className="text-sm font-medium tracking-wide text-zinc-200">Support Assistant</span>
        </div>
        <div className="flex bg-zinc-900/80 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-medium transition-all ${
              activeTab === 'chat' ? 'bg-[#27272a] text-white shadow-sm ring-1 ring-white/5' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Chat
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-medium transition-all ${
              activeTab === 'history' ? 'bg-[#27272a] text-white shadow-sm ring-1 ring-white/5' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'chat' ? (
        <>
          {/* Chat Area */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-5 pb-56 no-scrollbar"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className="flex gap-3">
                <div
                  className={`mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border ${
                    msg.role === 'user'
                      ? 'bg-[#18181b] border-white/10 text-zinc-300'
                      : 'bg-[#0f0f10] border-white/5 text-zinc-400'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-zinc-500 mb-1">
                    {msg.role === 'user' ? 'You' : 'Project SY AI'}
                  </div>
                  <div
                    className={`px-4 py-3 text-[13px] leading-6 whitespace-pre-wrap rounded-lg border ${
                      msg.role === 'user'
                        ? 'bg-[#18181b] border-white/10 text-zinc-100'
                        : 'bg-[#0f0f10] border-white/5 text-zinc-200'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Ticket Card (Cursor-style Widget) */}
                  {msg.isTicketPrompt && msg.ticketData && (
                    <div className="mt-3 max-w-[360px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-[#0f0f10] border border-white/10 rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/5">
                        <div className="bg-[#09090b] px-3 py-2 border-b border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-zinc-400">Confirm ticket</span>
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                            <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                            <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                          </div>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Subject</div>
                            <div className="text-xs text-zinc-200 font-medium">{msg.ticketData.subject}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Category</div>
                            <div className="text-xs text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded w-fit">{msg.ticketData.category}</div>
                          </div>
                          <button
                            onClick={() => handleCreateTicket(msg.ticketData!)}
                            className="w-full mt-2 bg-[#ededed] hover:bg-white text-black text-xs font-semibold py-2 rounded-[6px] transition-colors"
                          >
                            Submit ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border bg-[#0f0f10] border-white/5 text-zinc-400">
                  <Bot size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-zinc-500 mb-1">Project SY AI</div>
                  <div className="text-zinc-500 text-sm flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-zinc-500/60 border-t-transparent animate-spin" />
                    <span>Думаю...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area - Cursor Style */}
          <div
            className="fixed left-0 right-0 p-4 bg-[#09090b]/90 backdrop-blur-xl border-t border-white/5 z-20"
            style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSend} className="relative group">
                <div className="absolute inset-0 bg-blue-500/5 rounded-lg blur-xl group-focus-within:bg-blue-500/10 transition-all"></div>
                <div className="relative bg-[#18181b] border border-[#27272a] rounded-lg shadow-lg overflow-hidden group-focus-within:border-zinc-600 transition-colors">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Message support…"
                    className="w-full bg-transparent text-[13px] text-zinc-200 p-3 pr-10 outline-none placeholder:text-zinc-600 font-normal"
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading}
                      className="p-1.5 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between px-1">
                   <div className="text-[10px] text-zinc-600 flex items-center gap-1.5">
                     <span className="px-1.5 py-0.5 bg-[#27272a] rounded border border-white/5">Enter</span> to send
                   </div>
                   <div className="text-[10px] text-zinc-700">Powered by Mistral</div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* History View - Minimalist List */
        <div className="flex-grow overflow-y-auto p-4 space-y-2 pb-24">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-[#121212] border border-[#27272a] rounded-lg p-3 hover:bg-[#18181b] transition-colors cursor-pointer group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                     ticket.status === 'resolved' ? 'bg-green-500' : 
                     ticket.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <span className="text-[11px] font-mono text-zinc-500">#{ticket.id}</span>
                </div>
                <span className="text-[10px] text-zinc-600">{ticket.date}</span>
              </div>
              <h3 className="text-[13px] font-medium text-zinc-200 mb-1 group-hover:text-blue-400 transition-colors">{ticket.subject}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#27272a] text-zinc-400 border border-white/5 capitalize">{ticket.category}</span>
                <span className="text-[10px] text-zinc-600 capitalize">{ticket.status}</span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-24 opacity-50">
              <History size={32} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-500 text-sm">No tickets found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;
