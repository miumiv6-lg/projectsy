import React, { useState } from 'react';
import { Send, Bug, UserX, HelpCircle, Plus, CreditCard, MessageSquare, Check, X } from 'lucide-react';

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
    { id: 'tech', label: 'Bug Report', icon: Bug },
    { id: 'player', label: 'Report Player', icon: UserX },
    { id: 'donate', label: 'Billing Issue', icon: CreditCard },
    { id: 'other', label: 'Other', icon: HelpCircle },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;

    let finalSubject = subject;
    if (category === 'player') finalSubject = `Report: ${violatorName}`;
    if (category === 'donate') finalSubject = `Billing: ${amount}₽`;
    if (category === 'tech') finalSubject = `Bug: ${subject}`;

    const newTicket: Ticket = {
      id: Math.random().toString(36).substr(2, 9),
      subject: finalSubject || 'New Ticket',
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
              placeholder="Brief description of the bug..."
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Steps to reproduce..."
              rows={5}
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm resize-none"
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
              placeholder="Violator nickname"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <input
              type="text"
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="Rule broken"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <input
              type="text"
              value={proofLink}
              onChange={(e) => setProofLink(e.target.value)}
              placeholder="Proof link (Imgur/YouTube)"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional comments..."
              rows={3}
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm resize-none"
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
              placeholder="Transaction ID / Receipt #"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₽)"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue..."
              rows={4}
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm resize-none"
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
              placeholder="Subject"
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm mb-3"
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Details..."
              rows={5}
              className="cursor-input w-full rounded-lg px-4 py-3 text-sm resize-none"
            />
          </>
        );
    }
  };

  return (
    <div className="w-full min-h-screen pb-24 pt-8 px-6 bg-black">
      <div className="max-w-md mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-medium text-white tracking-tight">Support</h1>
          <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/10">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'new' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'
              }`}
            >
              New Ticket
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'list' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'
              }`}
            >
              History
            </button>
          </div>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            {showSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl flex items-center gap-3 text-sm">
                <Check size={16} />
                <span>Ticket created successfully.</span>
              </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-start gap-3 active:scale-[0.98] ${
                    category === cat.id 
                      ? 'bg-white text-black border-white' 
                      : 'bg-transparent border-white/10 hover:bg-white/5'
                  }`}
                >
                  <cat.icon size={18} className={category === cat.id ? 'text-black' : 'text-white/70'} />
                  <span className={`text-xs font-medium ${category === cat.id ? 'text-black' : 'text-white/70'}`}>
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
                  className="w-full bg-white hover:bg-zinc-200 text-black font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
                >
                  <Send size={14} />
                  <span>Submit Ticket</span>
                </button>
              </div>
            )}
            
            {!category && (
              <div className="text-center py-12 text-white/30 text-xs font-mono">
                SELECT_CATEGORY_TO_PROCEED_
              </div>
            )}

          </form>
        ) : (
          <div className="space-y-3 animate-fade-in">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="cursor-card rounded-xl p-4 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    ticket.category === 'tech' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
                    ticket.category === 'donate' ? 'bg-green-500/10 border-green-500/20 text-green-400' :
                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {ticket.category === 'tech' ? <Bug size={14} /> :
                     ticket.category === 'donate' ? <CreditCard size={14} /> :
                     ticket.category === 'player' ? <UserX size={14} /> :
                     <HelpCircle size={14} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white leading-tight max-w-[150px] truncate mb-0.5">{ticket.subject}</h3>
                    <span className="text-xs text-white/30 font-mono">{ticket.id} • {ticket.date}</span>
                  </div>
                </div>
                
                <div className={`px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider border ${
                  ticket.status === 'resolved' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 
                  ticket.status === 'rejected' ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                  'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                }`}>
                  {ticket.status}
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/10 text-white/20">
                   <MessageSquare size={20} />
                </div>
                <p className="text-white/30 text-xs font-mono">NO_TICKETS_FOUND</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tickets;
