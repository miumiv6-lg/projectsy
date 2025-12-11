import React, { useState } from 'react';
import { Send, Clock, CheckCircle, AlertCircle, MessageSquare, Bug, UserX, HelpCircle, ChevronRight, Plus, CreditCard } from 'lucide-react';

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
    { id: 'tech', label: 'Тех. проблема', icon: Bug, color: 'text-red-400' },
    { id: 'player', label: 'Жалоба', icon: UserX, color: 'text-orange-400' },
    { id: 'donate', label: 'Донат', icon: CreditCard, color: 'text-green-400' },
    { id: 'other', label: 'Другое', icon: HelpCircle, color: 'text-blue-400' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    let finalSubject = subject;
    if (category === 'player') finalSubject = `Жалоба на ${violatorName}`;
    if (category === 'donate') finalSubject = `Проблема с донатом (${amount}₽)`;
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
              placeholder="Краткое описание бага"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Как повторить баг? Опишите шаги..."
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors resize-none"
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
              placeholder="Никнейм нарушителя"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <input
              type="text"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Нарушенное правило"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <input
              type="text"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              placeholder="Ссылка на доказательства"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Дополнительные комментарии..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors resize-none"
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
              placeholder="Номер чека / ID транзакции"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Сумма пополнения (₽)"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите проблему..."
              rows={4}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors resize-none"
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
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробное описание..."
              rows={5}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:border-zinc-600 focus:outline-none transition-colors resize-none"
            />
          </>
        );
    }
  };

  return (
    <div className="w-full min-h-screen pb-24 pt-6 px-4 bg-zinc-950">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Поддержка</h1>
          <div className="flex bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'new' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Новое
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'list' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              История
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {showSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
                <CheckCircle size={18} />
                <span>Обращение отправлено!</span>
              </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 active:scale-95 ${
                    category === cat.id 
                      ? 'bg-white border-white' 
                      : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
                  }`}
                >
                  <div className={`${category === cat.id ? 'text-black' : cat.color}`}>
                    <cat.icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className={`text-xs font-semibold ${category === cat.id ? 'text-black' : 'text-zinc-400'}`}>
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
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4 shadow-lg shadow-blue-900/20"
                >
                  <Send size={18} strokeWidth={1.5} />
                  <span>Отправить</span>
                </button>
              </div>
            )}
            
            {!category && (
              <div className="text-center py-12 text-zinc-500 text-sm">
                Выберите категорию выше, чтобы начать
              </div>
            )}

          </form>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group active:scale-[0.99] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    ticket.category === 'tech' ? 'bg-red-500/10 text-red-400' :
                    ticket.category === 'donate' ? 'bg-green-500/10 text-green-400' :
                    ticket.category === 'player' ? 'bg-orange-500/10 text-orange-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {ticket.category === 'tech' ? <Bug size={18} strokeWidth={1.5} /> :
                     ticket.category === 'donate' ? <CreditCard size={18} strokeWidth={1.5} /> :
                     ticket.category === 'player' ? <UserX size={18} strokeWidth={1.5} /> :
                     <HelpCircle size={18} strokeWidth={1.5} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white leading-tight max-w-[180px] truncate mb-1">{ticket.subject}</h3>
                    <span className="text-xs text-zinc-500">{ticket.date}</span>
                  </div>
                </div>
                
                <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                  ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 
                  ticket.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {ticket.status === 'resolved' ? 'Решено' : 
                   ticket.status === 'rejected' ? 'Закрыто' : 'В работе'}
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-800">
                   <MessageSquare size={24} className="text-zinc-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-white font-medium mb-1">История пуста</h3>
                <p className="text-zinc-500 text-xs">У вас пока нет обращений</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
