import React, { useState } from 'react';
import { Send, Bug, UserX, HelpCircle, CreditCard, MessageSquare, Check, Plus, ChevronRight, Bot, Sparkles } from 'lucide-react';
import AiChat from '../components/AiChat';

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved' | 'rejected';
  date: string;
  category: string;
}

const Tickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [category, setCategory] = useState<string>('');
  const [showAiChat, setShowAiChat] = useState(false);
  
  // Form States
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  
  // Specific Fields
  const [violatorName, setViolatorName] = useState('');
  const [rule, setRule] = useState('');
  const [proofLink, setProofLink] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [amount, setAmount] = useState('');

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', subject: 'Не пришел донат', status: 'resolved', date: '10.12.2025', category: 'donate' },
    { id: '2', subject: 'Баг с текстурами', status: 'pending', date: '11.12.2025', category: 'tech' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: 'tech', label: 'Баг / Ошибка', icon: Bug },
    { id: 'player', label: 'Жалоба', icon: UserX },
    { id: 'donate', label: 'Донат', icon: CreditCard },
    { id: 'other', label: 'Другое', icon: HelpCircle },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    let finalSubject = subject;
    if (category === 'player') finalSubject = `Жалоба: ${violatorName}`;
    if (category === 'donate') finalSubject = `Донат: ${amount}₽`;
    if (category === 'tech') finalSubject = `Баг: ${subject}`;

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject: finalSubject || 'Новое обращение',
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
      category
    };

    setTickets([newTicket, ...tickets]);
    
    // Reset form
    setSubject('');
    setDescription('');
    setViolatorName('');
    setRule('');
    setProofLink('');
    setTransactionId('');
    setAmount('');
    setCategory('');
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setActiveTab('list');
  };

  const renderFormFields = () => {
    switch (category) {
      case 'tech':
        return (
          <>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Краткое описание"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Шаги воспроизведения..."
              rows={5}
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm resize-none"
            />
          </>
        );
      case 'player':
        return (
          <>
            <input
              type="text"
              value={violatorName}
              onChange={(e) => setViolatorName(e.target.value)}
              placeholder="Ник нарушителя"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <input
              type="text"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Нарушенное правило"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <input
              type="text"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              placeholder="Ссылка на доказательства"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Комментарий..."
              rows={3}
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm resize-none"
            />
          </>
        );
      case 'donate':
        return (
          <>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="ID транзакции / Чек"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма (₽)"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание проблемы..."
              rows={4}
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm resize-none"
            />
          </>
        );
      default:
        return (
          <>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Тема обращения"
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание..."
              rows={5}
              className="cursor-input w-full rounded-xl px-4 py-3.5 text-sm resize-none"
            />
          </>
        );
    }
  };

  return (
    <div className="w-full min-h-screen pb-24 pt-8 px-6 bg-black animate-fade-in">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-white tracking-tight">Поддержка</h1>
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-white/5">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'new' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Новое
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'list' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'
              }`}
            >
              История
            </button>
          </div>
        </div>

        {/* AI Assistant Banner */}
        <div 
          onClick={() => setShowAiChat(true)}
          className="cursor-card p-4 rounded-xl mb-6 flex items-center justify-between group cursor-pointer bg-gradient-to-r from-blue-900/20 to-transparent border-blue-500/20 hover:border-blue-500/40"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-900/30">
              <Sparkles size={20} fill="currentColor" className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">AI Помощник</h3>
              <p className="text-xs text-blue-200/60">Мгновенные ответы на вопросы</p>
            </div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-medium text-white hover:bg-white/20 transition-colors">
            Спросить
          </button>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {showSuccess && (
              <div className="bg-white text-black p-4 rounded-xl flex items-center gap-3 text-sm font-medium animate-scale-in">
                <Check size={16} />
                <span>Отправлено успешно</span>
              </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-start gap-3 active:scale-[0.98] group ${
                    category === cat.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent border-white/10 hover:bg-white/5 text-zinc-500'
                  }`}
                >
                  <cat.icon size={18} className={category === cat.id ? 'text-black' : 'text-zinc-500 group-hover:text-white'} />
                  <span className={`text-xs font-medium ${category === cat.id ? 'text-black' : 'text-zinc-500 group-hover:text-white'}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Dynamic Inputs */}
            {category && (
              <div className="animate-fade-in">
                {renderFormFields()}
                
                <button
                  type="submit"
                  className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <Send size={14} />
                  <span>Отправить обращение</span>
                </button>
              </div>
            )}
            
            {!category && (
              <div className="text-center py-12">
                <p className="text-zinc-600 text-xs font-mono">ВЫБЕРИТЕ КАТЕГОРИЮ</p>
              </div>
            )}

          </form>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="cursor-card rounded-xl p-4 flex items-center justify-between group hover:border-white/20">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-white/5 text-zinc-400">
                    {ticket.category === 'tech' ? <Bug size={14} /> :
                     ticket.category === 'donate' ? <CreditCard size={14} /> :
                     ticket.category === 'player' ? <UserX size={14} /> :
                     <HelpCircle size={14} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white leading-tight max-w-[150px] truncate mb-0.5">{ticket.subject}</h3>
                    <span className="text-xs text-zinc-600 font-mono tracking-tight">{ticket.id} • {ticket.date}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                      ticket.status === 'resolved' ? 'bg-white shadow-[0_0_5px_white]' : 
                      ticket.status === 'rejected' ? 'bg-red-500' : 
                      'bg-zinc-600'
                   }`}></div>
                   <span className={`text-[10px] font-medium uppercase tracking-wider ${
                      ticket.status === 'resolved' ? 'text-white' : 
                      ticket.status === 'rejected' ? 'text-zinc-500' : 
                      'text-zinc-500'
                   }`}>
                      {ticket.status === 'resolved' ? 'Решено' : 
                       ticket.status === 'rejected' ? 'Закрыто' : 'В работе'}
                   </span>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-24">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 text-white/10">
                   <MessageSquare size={20} />
                </div>
                <p className="text-zinc-700 text-xs font-mono">НЕТ ОБРАЩЕНИЙ</p>
              </div>
            )}
          </div>
        )}
      </div>
      {showAiChat && <AiChat onClose={() => setShowAiChat(false)} />}
    </div>
  );
};

export default Tickets;
