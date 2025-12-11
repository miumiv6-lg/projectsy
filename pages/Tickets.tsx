import React, { useState } from 'react';
import { Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Ticket {
  id: string;
  subject: string;
  status: 'pending' | 'resolved';
  date: string;
}

const Tickets: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'new' | 'list'>('new');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [tickets, setTickets] = useState<Ticket[]>([
    { id: '1', subject: 'Не пришел донат', status: 'resolved', date: '10.12.2025' },
    { id: '2', subject: 'Баг с текстурами', status: 'pending', date: '11.12.2025' },
  ]);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) return;

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject,
      status: 'pending',
      date: new Date().toLocaleDateString('ru-RU'),
    };

    setTickets([newTicket, ...tickets]);
    setSubject('');
    setDescription('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-screen pb-24 pt-6 px-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Поддержка</h1>

      {/* Tabs */}
      <div className="flex p-1 bg-[#181a20] rounded-lg mb-6 border border-[#2d313a]">
        <button
          onClick={() => setActiveTab('new')}
          className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
            activeTab === 'new' ? 'bg-[#22252b] text-white shadow-sm' : 'text-gray-400'
          }`}
        >
          Новая жалоба
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2 text-sm font-medium rounded transition-all ${
            activeTab === 'list' ? 'bg-[#22252b] text-white shadow-sm' : 'text-gray-400'
          }`}
        >
          Мои обращения
        </button>
      </div>

      {activeTab === 'new' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {showSuccess && (
            <div className="bg-green-900/20 border border-green-900/50 text-green-400 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
              <CheckCircle size={20} />
              <div>
                <div className="font-bold text-sm">Успешно отправлено</div>
                <div className="text-xs opacity-80">Администраторы рассмотрят вашу жалобу.</div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Тема</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Кратко опишите проблему"
              className="w-full bg-[#181a20] border border-[#2d313a] rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Подробности ситуации..."
              rows={6}
              className="w-full bg-[#181a20] border border-[#2d313a] rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          >
            <Send size={18} />
            Отправить жалобу
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-[#181a20] border border-[#2d313a] rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-bold text-white mb-1">{ticket.subject}</div>
                <div className="text-xs text-gray-500">{ticket.date} • ID: {ticket.id}</div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                ticket.status === 'resolved' 
                  ? 'bg-green-900/20 text-green-400 border border-green-900/30' 
                  : 'bg-yellow-900/20 text-yellow-400 border border-yellow-900/30'
              }`}>
                {ticket.status === 'resolved' ? <CheckCircle size={12} /> : <Clock size={12} />}
                {ticket.status === 'resolved' ? 'Решено' : 'В обработке'}
              </div>
            </div>
          ))}
          
          {tickets.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <AlertCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>У вас пока нет обращений</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Tickets;
