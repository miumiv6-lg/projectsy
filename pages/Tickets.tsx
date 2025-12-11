import React, { useState } from 'react';
import { Send, Clock, CheckCircle, AlertCircle, MessageSquare, Bug, UserX, HelpCircle, ChevronRight, Plus } from 'lucide-react';

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
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', subject: 'Не пришел донат', status: 'resolved', date: '10.12.2025', category: 'donation' },
    { id: '2', subject: 'Баг с текстурами', status: 'pending', date: '11.12.2025', category: 'bug' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const categories = [
    { id: 'bug', label: 'Баг', icon: Bug, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
    { id: 'player', label: 'Жалоба', icon: UserX, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
    { id: 'donation', label: 'Донат', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { id: 'other', label: 'Другое', icon: HelpCircle, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !category) return;

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
      category
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setDescription('');
    setCategory('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setActiveTab('list');
  };

  return (
    <div className="w-full min-h-screen pb-24 pt-4 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[600px] mx-auto">
        
        {/* Header & Tabs */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Поддержка</h1>
          <div className="flex bg-[#181a20] rounded-lg p-1 border border-[#2d313a]">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'new' ? 'bg-[#2d313a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Plus size={14} />
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                activeTab === 'list' ? 'bg-[#2d313a] text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <MessageSquare size={14} />
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {showSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-3 rounded-xl flex items-center gap-3 text-sm">
                <CheckCircle size={16} />
                <span>Обращение отправлено!</span>
              </div>
            )}

            {/* Compact Category Grid */}
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center gap-3 ${
                    category === cat.id 
                      ? `${cat.bg} ${cat.border} ring-1 ring-offset-1 ring-offset-[#0f1115] ring-${cat.color.split('-')[1]}-500` 
                      : 'bg-[#181a20] border-[#2d313a] hover:bg-[#22252b]'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${cat.bg} ${cat.color}`}>
                    <cat.icon size={16} />
                  </div>
                  <span className={`text-xs font-bold ${category === cat.id ? 'text-white' : 'text-gray-400'}`}>
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Тема обращения"
                className="w-full bg-[#181a20] border border-[#2d313a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите проблему..."
                rows={5}
                className="w-full bg-[#181a20] border border-[#2d313a] rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!category || !subject || !description}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <Send size={16} />
              <span>Отправить</span>
            </button>
          </form>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#181a20] border border-[#2d313a] rounded-xl p-3 flex items-center justify-between group hover:border-gray-600 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    ticket.category === 'bug' ? 'bg-red-500/10 text-red-400' :
                    ticket.category === 'donation' ? 'bg-green-500/10 text-green-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {ticket.category === 'bug' ? <Bug size={16} /> :
                     ticket.category === 'donation' ? <CheckCircle size={16} /> :
                     <HelpCircle size={16} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{ticket.subject}</h3>
                    <span className="text-[10px] text-gray-500">{ticket.date}</span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                  ticket.status === 'resolved' ? 'bg-green-500/10 text-green-400' : 
                  ticket.status === 'rejected' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400'
                }`}>
                  {ticket.status === 'resolved' ? 'Решено' : 
                   ticket.status === 'rejected' ? 'Отклонено' : 'В работе'}
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare size={24} className="text-gray-700 mx-auto mb-2" />
                <p className="text-gray-600 text-xs">История пуста</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
