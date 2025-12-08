import React, { useState, useEffect } from 'react';
import { Shield, Users, MessageSquare, Ban, Search, ChevronRight, AlertTriangle, CheckCircle, XCircle, Loader2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole, Page } from '../types';
import { adminApi, complaintsApi, bansApi } from '../api';

interface AdminProps {
  setPage: (page: Page) => void;
}

type AdminTab = 'overview' | 'users' | 'complaints' | 'bans';

const Admin: React.FC<AdminProps> = ({ setPage }) => {
  const { user, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [bans, setBans] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [responseText, setResponseText] = useState('');

  const isMod = hasPermission(UserRole.MODERATOR);
  const isAdmin = hasPermission(UserRole.ADMIN);

  useEffect(() => {
    if (isMod) loadData();
  }, [isMod]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, complaintsData, bansData] = await Promise.all([
        adminApi.getStats(),
        complaintsApi.getAll(),
        bansApi.getAll(),
      ]);
      setStats(statsData);
      setComplaints(complaintsData);
      setBans(bansData);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) {
      loadUsers();
    }
  }, [activeTab]);

  if (!isMod) {
    return (
      <div className="w-full px-4 max-w-3xl mx-auto py-20 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <Shield size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Доступ запрещён</h1>
        <p className="text-gray-400 mb-8">У вас нет прав для просмотра этой страницы</p>
        <button onClick={() => setPage(Page.HOME)} className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-xl">
          На главную
        </button>
      </div>
    );
  }

  const handleComplaintStatus = async (id: string, status: string) => {
    try {
      await complaintsApi.updateStatus(id, status);
      const data = await complaintsApi.getAll();
      setComplaints(data);
      if (selectedComplaint?.id === id) {
        setSelectedComplaint({ ...selectedComplaint, status });
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleComplaintResponse = async () => {
    if (!responseText.trim() || !selectedComplaint) return;
    try {
      const updated = await complaintsApi.respond(selectedComplaint.id, responseText);
      setSelectedComplaint(updated);
      setResponseText('');
      const data = await complaintsApi.getAll();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to respond:', err);
    }
  };

  const handleRemoveBan = async (id: string) => {
    if (!confirm('Снять бан?')) return;
    try {
      await bansApi.remove(id);
      const data = await bansApi.getAll();
      setBans(data);
    } catch (err) {
      console.error('Failed to remove ban:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      user: 'bg-gray-500/20 text-gray-400',
      moderator: 'bg-blue-500/20 text-blue-400',
      admin: 'bg-purple-500/20 text-purple-400',
      owner: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      user: 'Игрок',
      moderator: 'Модератор',
      admin: 'Админ',
      owner: 'Владелец',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[role]}`}>{labels[role]}</span>;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      accepted: 'bg-green-500/20 text-green-400',
      rejected: 'bg-red-500/20 text-red-400',
    };
    const labels: Record<string, string> = {
      pending: 'На рассмотрении',
      accepted: 'Принято',
      rejected: 'Отклонено',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: Shield },
    { id: 'users', label: 'Игроки', icon: Users },
    { id: 'complaints', label: 'Жалобы', icon: MessageSquare, badge: complaints.filter(c => c.status === 'pending').length },
    { id: 'bans', label: 'Баны', icon: Ban },
  ];

  // Просмотр жалобы
  if (selectedComplaint) {
    return (
      <div className="w-full px-4 max-w-4xl mx-auto pb-20 animate-ios-slide-up">
        <button onClick={() => setSelectedComplaint(null)} className="flex items-center gap-2 text-brand-blue font-medium py-6">
          ← Назад к жалобам
        </button>

        <div className="bg-[#1C1C1E] rounded-[24px] p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{selectedComplaint.title}</h1>
                {getStatusBadge(selectedComplaint.status)}
              </div>
              <div className="text-sm text-gray-400">
                От: {selectedComplaint.author_name}
                {selectedComplaint.target_name && ` • На: ${selectedComplaint.target_name}`}
                {' • '}{formatDate(selectedComplaint.created_at)}
              </div>
            </div>
            {selectedComplaint.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => handleComplaintStatus(selectedComplaint.id, 'accepted')} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium">
                  Принять
                </button>
                <button onClick={() => handleComplaintStatus(selectedComplaint.id, 'rejected')} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium">
                  Отклонить
                </button>
              </div>
            )}
          </div>
          <div className="bg-[#2C2C2E] rounded-xl p-4 text-gray-300 whitespace-pre-wrap">
            {selectedComplaint.content}
          </div>
        </div>

        {/* Ответы */}
        {selectedComplaint.responses?.length > 0 && (
          <div className="space-y-4 mb-6">
            {selectedComplaint.responses.map((resp: any) => (
              <div key={resp.id} className="bg-[#1C1C1E] rounded-[24px] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src={resp.author_avatar} alt="" className="w-10 h-10 rounded-xl" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{resp.author_name}</span>
                      {getRoleBadge(resp.author_role)}
                    </div>
                    <div className="text-xs text-gray-500">{formatDate(resp.created_at)}</div>
                  </div>
                </div>
                <div className="text-gray-300 whitespace-pre-wrap">{resp.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Форма ответа */}
        <div className="bg-[#1C1C1E] rounded-[24px] p-6">
          <h3 className="font-bold text-white mb-4">Ответить</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Напишите ответ..."
            className="w-full h-24 bg-[#2C2C2E] rounded-xl p-4 text-white placeholder-gray-500 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue"
          />
          <div className="flex justify-end mt-4">
            <button onClick={handleComplaintResponse} disabled={!responseText.trim()} className="px-6 py-3 bg-brand-blue text-white font-semibold rounded-xl disabled:opacity-50">
              Отправить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 max-w-6xl mx-auto pb-20">
      <div className="py-10 animate-ios-slide-up">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center">
            <Shield size={24} className="text-brand-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
            <p className="text-gray-400">Управление сервером</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id ? 'bg-brand-blue text-white' : 'bg-[#1C1C1E] text-gray-400 hover:bg-[#2C2C2E]'
              }`}
            >
              <Icon size={18} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-brand-blue animate-spin" /></div>
      ) : (
        <div className="animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
          {/* Overview */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#1C1C1E] rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-1">{stats.users}</div>
                <div className="text-gray-400 text-sm">Пользователей</div>
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl p-6">
                <div className="text-3xl font-bold text-white mb-1">{stats.threads}</div>
                <div className="text-gray-400 text-sm">Тем на форуме</div>
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl p-6">
                <div className="text-3xl font-bold text-yellow-400 mb-1">{stats.pendingComplaints}</div>
                <div className="text-gray-400 text-sm">Жалоб</div>
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl p-6">
                <div className="text-3xl font-bold text-red-400 mb-1">{stats.bans}</div>
                <div className="text-gray-400 text-sm">Банов</div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск..."
                  className="w-full bg-[#1C1C1E] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
                {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u, idx) => (
                  <div key={u.steam_id}>
                    <div className="p-4 hover:bg-[#2C2C2E] transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-xl" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{u.name}</span>
                            {getRoleBadge(u.role)}
                            {u.is_banned ? <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs">Забанен</span> : null}
                          </div>
                          <div className="text-sm text-gray-500">{u.steam_id}</div>
                        </div>
                        <div className="text-sm text-gray-500">{formatDate(u.last_seen)}</div>
                      </div>
                    </div>
                    {idx !== users.length - 1 && <div className="h-px bg-white/5 mx-4" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complaints */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по жалобам..."
                  className="w-full bg-[#1C1C1E] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
              {complaints.filter(c => 
                searchQuery === '' ||
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (c.target_name && c.target_name.toLowerCase().includes(searchQuery.toLowerCase()))
              ).length === 0 ? (
                <div className="p-10 text-center text-gray-500">{searchQuery ? 'Ничего не найдено' : 'Нет жалоб'}</div>
              ) : (
                complaints.filter(c => 
                  searchQuery === '' ||
                  c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.author_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (c.target_name && c.target_name.toLowerCase().includes(searchQuery.toLowerCase()))
                ).map((c, idx, arr) => (
                  <div key={c.id}>
                    <div onClick={() => setSelectedComplaint(c)} className="p-4 hover:bg-[#2C2C2E] transition-colors cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.type === 'appeal' ? 'bg-purple-500/20' : 'bg-orange-500/20'}`}>
                          {c.type === 'appeal' ? <AlertTriangle size={20} className="text-purple-500" /> : <MessageSquare size={20} className="text-orange-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-white">{c.title}</span>
                            {getStatusBadge(c.status)}
                          </div>
                          <div className="text-sm text-gray-500">
                            От: {c.author_name} {c.target_name && `• На: ${c.target_name}`} • {formatDate(c.created_at)}
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-500" />
                      </div>
                    </div>
                    {idx !== arr.length - 1 && <div className="h-px bg-white/5 mx-4" />}
                  </div>
                ))
              )}
              </div>
            </div>
          )}

          {/* Bans */}
          {activeTab === 'bans' && (
            <div className="space-y-4">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по банам..."
                  className="w-full bg-[#1C1C1E] rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                />
              </div>
              <div className="bg-[#1C1C1E] rounded-2xl overflow-hidden">
              {bans.filter(b => 
                searchQuery === '' ||
                b.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.banned_by_name.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <div className="p-10 text-center text-gray-500">{searchQuery ? 'Ничего не найдено' : 'Нет активных банов'}</div>
              ) : (
                bans.filter(b => 
                  searchQuery === '' ||
                  b.player_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  b.banned_by_name.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((b, idx, arr) => (
                  <div key={b.id}>
                    <div className="p-4 hover:bg-[#2C2C2E] transition-colors">
                      <div className="flex items-center gap-4">
                        <img src={b.player_avatar} alt="" className="w-10 h-10 rounded-xl" />
                        <div className="flex-1">
                          <div className="font-semibold text-white">{b.player_name}</div>
                          <div className="text-sm text-gray-500">{b.reason}</div>
                        </div>
                        <div className="text-right text-sm">
                          <div className="text-white">{b.expires_at ? formatDate(b.expires_at) : 'Навсегда'}</div>
                          <div className="text-gray-500">Выдал: {b.banned_by_name}</div>
                        </div>
                        <button onClick={() => handleRemoveBan(b.id)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    {idx !== arr.length - 1 && <div className="h-px bg-white/5 mx-4" />}
                  </div>
                ))
              )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
