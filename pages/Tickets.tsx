import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CreditCard, Bug, UserX, HelpCircle, History } from 'lucide-react';

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

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'rejected';
  date: string;
  category: string;
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
            className="font-mono text-[12px] bg-surface px-1 py-0.5 rounded border border-[var(--color-border)]"
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
          <strong key={`strong-${i}`} className="font-semibold">
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
  const [activeTab, setActiveTab] = useState<'chat' | 'history'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Привет! Я помощник поддержки Project SY по серверу Metrostroi (Garry\'s Mod). Опиши проблему — помогу разобраться и, если нужно, оформить тикет администрации.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTicketReplyLoading, setIsTicketReplyLoading] = useState(false);
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
    if (!input.trim() || isLoading || isTicketReplyLoading) return;

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
      
      if (!aiContent) throw new Error('Неверный формат ответа от AI-провайдера');
      
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
        ticketData,
        ticketStatus: ticketData ? 'idle' : undefined
      }]);

    } catch (error: any) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Ошибка: ${error.message || 'Не удалось связаться с сервером.'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleCreateTicket = async (messageIndex: number, data: TicketData) => {
    setMessages((prev) =>
      prev.map((m, i) => {
        if (i !== messageIndex) return m;
        if (!m.isTicketPrompt || !m.ticketData) return m;
        if (m.ticketStatus && m.ticketStatus !== 'idle') return m;
        return { ...m, ticketStatus: 'submitting' };
      })
    );

    await sleep(3000);

    const ticketId = Math.random().toString(36).slice(2, 9);
    const newTicket: Ticket = {
      id: ticketId,
      subject: data.subject,
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
      category: data.category
    };

    setTickets((prev) => [newTicket, ...prev]);
    setMessages((prev) =>
      prev.map((m, i) => (i === messageIndex ? { ...m, ticketStatus: 'submitted' } : m))
    );

    setIsTicketReplyLoading(true);
    await sleep(1200);
    setIsTicketReplyLoading(false);

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: `✅ Тикет создан и отправлен администрации.\nНомер обращения: #${ticketId}.\nЕсли добавишь доказательства (ссылку/демку/скрин), я могу приложить их к тикету.`
      }
    ]);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'tech': return <Bug size={14} />;
      case 'player': return <UserX size={14} />;
      case 'donate': return <CreditCard size={14} />;
      default: return <HelpCircle size={14} />;
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'tech':
        return 'Техническая проблема';
      case 'player':
        return 'Жалоба на игрока';
      case 'donate':
        return 'Донат';
      default:
        return 'Другое';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'resolved':
        return 'решено';
      case 'rejected':
        return 'отклонено';
      default:
        return 'ожидает';
    }
  };

  return (
    <div className="w-full h-screen bg-background text-zinc-100 flex flex-col pt-safe-top font-sans selection:bg-white/15">
      
      {/* Minimal Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[var(--color-border)] glass-panel z-10 sticky top-0">
        <div className="flex items-center gap-2">
           <Bot size={18} className="text-zinc-400" />
           <span className="text-sm font-semibold tracking-wide text-zinc-200">Поддержка</span>
        </div>
        <div className="cursor-card flex rounded-xl p-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-medium transition-all ${
              activeTab === 'chat' ? 'bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Чат
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-[6px] text-[11px] font-medium transition-all ${
              activeTab === 'history' ? 'bg-[var(--color-surface-hover)] text-white border border-[var(--color-border)]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            История
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
                      ? 'bg-[var(--color-surface-hover)] border-[var(--color-border)] text-zinc-200'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] text-zinc-300'
                  }`}
                >
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-zinc-500 mb-1">
                    {msg.role === 'user' ? 'Вы' : 'Project SY • Поддержка'}
                  </div>
                  <div
                    className={`px-4 py-3 text-[13px] leading-6 whitespace-pre-wrap rounded-lg border ${
                      msg.role === 'user'
                        ? 'bg-[var(--color-surface-hover)] border-[var(--color-border)] text-zinc-100'
                        : 'bg-[var(--color-surface)] border-[var(--color-border)] text-zinc-200'
                    }`}
                  >
                    {renderMessageContent(msg.content)}
                  </div>

                  {/* Ticket Card */}
                  {msg.isTicketPrompt && msg.ticketData && (
                    <div className="mt-3 max-w-[360px] animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="cursor-card rounded-2xl overflow-hidden">
                        <div className="px-4 py-3 border-b border-[var(--color-border)] flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-zinc-300 tracking-wide">Тикет</span>
                          <span className="text-[10px] text-zinc-500">Проверка перед отправкой</span>
                        </div>
                        <div className="p-3 space-y-2">
                          <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">ТЕМА</div>
                            <div className="text-xs text-zinc-200 font-medium">{msg.ticketData.subject}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-[10px] text-zinc-500 uppercase tracking-wider">КАТЕГОРИЯ</div>
                            <div className="text-xs text-zinc-200 font-mono bg-white/5 px-1.5 py-0.5 rounded w-fit border border-[var(--color-border)]">{getCategoryLabel(msg.ticketData.category)}</div>
                          </div>
                          <button
                            onClick={() => handleCreateTicket(idx, msg.ticketData!)}
                            disabled={msg.ticketStatus !== 'idle'}
                            className="w-full mt-3 cursor-button disabled:opacity-40 text-xs font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                          >
                            {msg.ticketStatus === 'submitting' ? (
                              <>
                                <span className="w-4 h-4 rounded-full border-2 border-zinc-400/60 border-t-transparent animate-spin" />
                                <span>Отправляю...</span>
                              </>
                            ) : msg.ticketStatus === 'submitted' ? (
                              'Тикет создан'
                            ) : (
                              'Отправить тикет'
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {(isLoading || isTicketReplyLoading) && (
              <div className="flex gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-full flex items-center justify-center border bg-[var(--color-surface)] border-[var(--color-border)] text-zinc-300">
                  <Bot size={14} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-zinc-500 mb-1">Project SY • Поддержка</div>
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
            className="fixed left-0 right-0 p-4 glass-panel border-t border-[var(--color-border)] z-20"
            style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
          >
            <div className="max-w-2xl mx-auto">
              <form onSubmit={handleSend} className="relative group">
                <div className="relative cursor-card rounded-2xl overflow-hidden">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Сообщение в поддержку…"
                    className="w-full bg-transparent text-[13px] text-zinc-200 p-3 pr-10 outline-none placeholder:text-zinc-500 font-normal"
                    autoComplete="off"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <button 
                      type="submit" 
                      disabled={!input.trim() || isLoading || isTicketReplyLoading}
                      className="p-1.5 text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between px-1">
                   <div className="text-[10px] text-zinc-600 flex items-center gap-1.5">
                     <span className="px-1.5 py-0.5 bg-white/5 rounded border border-[var(--color-border)] text-zinc-300">Enter</span> — отправить
                   </div>
                   <div className="text-[10px] text-zinc-700">Project SY</div>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* History View - Minimalist List */
        <div className="flex-grow overflow-y-auto p-4 space-y-2 pb-24">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="cursor-card rounded-2xl p-4 cursor-pointer">
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
              <h3 className="text-[13px] font-semibold text-zinc-200 mb-1">{ticket.subject}</h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-zinc-300 border border-[var(--color-border)]">{getCategoryLabel(ticket.category)}</span>
                <span className="text-[10px] text-zinc-600">{getStatusLabel(ticket.status)}</span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-24 opacity-50">
              <History size={32} className="mx-auto mb-4 text-zinc-600" />
              <p className="text-zinc-500 text-sm">Обращений не найдено</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;
