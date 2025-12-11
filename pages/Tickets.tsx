import React, { useState } from 'react';
import { Send, Clock, CheckCircle, AlertCircle, MessageSquare, Bug, UserX, HelpCircle, ChevronRight, ArrowLeft } from 'lucide-react';

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
    { id: 'bug', label: 'Баг / Ошибка', icon: Bug, desc: 'Сообщить о технической проблеме' },
    { id: 'player', label: 'Жалоба на игрока', icon: UserX, desc: 'Нарушение правил сервера' },
    { id: 'donation', label: 'Проблема с донатом', icon: CheckCircle, desc: 'Не пришли средства или услуги' },
    { id: 'other', label: 'Другое', icon: HelpCircle, desc: 'Вопросы и предложения' },
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
    <div className="w-full min-h-screen pb-24 pt-6 px-4 animate-fade-in bg-[#0f1115]">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Поддержка</h1>
        <p className="text-gray-400 text-sm mb-6">Мы поможем решить любую проблему</p>

        {/* Tabs */}
        <div className="flex p-1 bg-[#181a20] rounded-xl mb-8 border border-[#2d313a]">
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'new' ? 'bg-[#2d313a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Создать обращение
          </button>
          <button
            onClick={() => setActiveTab('list')}
            className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${
              activeTab === 'list' ? 'bg-[#2d313a] text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Мои тикеты
          </button>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {showSuccess && (
              <div className="bg-green-900/20 border border-green-900/50 text-green-400 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
                <CheckCircle size={24} />
                <div>
                  <div className="font-bold">Успешно отправлено</div>
                  <div className="text-xs opacity-80">Мы ответим вам в ближайшее время.</div>
                </div>
              </div>
            )}

            {!category ? (
              <div className="grid grid-cols-1 gap-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Выберите категорию</label>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className="flex items-center gap-4 p-4 bg-[#181a20] border border-[#2d313a] rounded-xl hover:border-blue-500/50 hover:bg-[#1c1f26] transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#22252b] flex items-center justify-center group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                      <cat.icon size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="font-bold text-white text-sm">{cat.label}</div>
                      <div className="text-xs text-gray-500">{cat.desc}</div>
                    </div>
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="animate-fade-in">
                <button 
                  type="button" 
                  onClick={() => setCategory('')}
                  className="text-xs text-blue-400 hover:text-blue-300 mb-4 flex items-center gap-1"
                >
                  <ArrowLeft size={12} />
                  Выбрать другую категорию
                </button>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Тема обращения</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Например: Застрял в текстурах на станции..."
                      className="w-full bg-[#181a20] border border-[#2d313a] rounded-xl p-4 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Подробное описание</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Опишите проблему максимально подробно. Прикрепите ссылки на скриншоты если есть..."
                      rows={6}
                      className="w-full bg-[#181a20] border border-[#2d313a] rounded-xl p-4 text-white placeholder-gray-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
                  >
                    <Send size={18} />
                    Отправить обращение
                  </button>
                </div>
              </div>
            )}
          </form>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#181a20] border border-[#2d313a] rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer group">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${
                      ticket.category === 'bug' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      ticket.category === 'donation' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {categories.find(c => c.id === ticket.category)?.label || ticket.category}
                    </span>
                    <span className="text-xs text-gray-600">#{ticket.id}</span>
                  </div>
                  <span className="text-xs text-gray-500">{ticket.date}</span>
                </div>
                
                <h3 className="font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{ticket.subject}</h3>
                
                <div className="flex items-center justify-between pt-3 border-t border-[#2d313a]">
                  <div className={`flex items-center gap-1.5 text-xs font-bold ${
                    ticket.status === 'resolved' ? 'text-green-400' : 
                    ticket.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {ticket.status === 'resolved' ? <CheckCircle size={14} /> : 
                     ticket.status === 'rejected' ? <AlertCircle size={14} /> : <Clock size={14} />}
                    {ticket.status === 'resolved' ? 'Решено' : 
                     ticket.status === 'rejected' ? 'Отклонено' : 'В обработке'}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Подробнее <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-[#181a20] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#2d313a]">
                  <MessageSquare size={32} className="text-gray-600" />
                </div>
                <h3 className="text-white font-bold mb-1">Нет обращений</h3>
                <p className="text-gray-500 text-xs">У вас пока нет активных тикетов</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
