import React, { useState, useEffect } from 'react';
import { Shield, Users, MessageSquare, Ban, Search, ChevronRight, AlertTriangle, Trash2 } from 'lucide-react';
import GoogleLoader from '../components/GoogleLoader';
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
        <div className="w-20 h-20 mx-auto mb-6 rounded bg-[#2f2f35] flex items-center justify-center">
          <Shield size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#efeff1] mb-4">Доступ запрещён</h1>
        <p className="text-[#adadb8] mb-8">У вас нет прав для просмотра этой страницы</p>
        <button onClick={() => setPage(Page.HOME)} className="px-6 py-2 bg-primary text-black font-bold rounded">
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
      user: 'bg-[#2f2f35] text-[#adadb8]',
      moderator: 'bg-green-500/10 text-green-400',
      admin: 'bg-red-500/10 text-red-400',
      owner: 'bg-purple-500/10 text-purple-400',
    };
    return <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[role]}`}>{role}</span>;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-500',
      accepted: 'bg-green-500/10 text-green-500',
      rejected: 'bg-red-500/10 text-red-500',
    };
    const labels: Record<string, string> = {
      pending: 'На рассмотрении',
      accepted: 'Принято',
      rejected: 'Отклонено',
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-bold ${styles[status]}`}>{labels[status]}</span>;
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
      <div className="w-full px-6 max-w-[1200px] mx-auto pb-20 pt-8 animate-fade-in">
        <button onClick={() => setSelectedComplaint(null)} className="flex items-center gap-2 text-[#adadb8] hover:text-[#efeff1] font-medium py-6 text-sm">
          ← Назад к жалобам
        </button>

        <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-[#efeff1]">{selectedComplaint.title}</h1>
                {getStatusBadge(selectedComplaint.status)}
              </div>
              <div className="text-sm text-[#adadb8]">
                От: <span className="text-[#efeff1] font-medium">{selectedComplaint.author_name}</span>
                {selectedComplaint.target_name && <span> • На: <span className="text-[#efeff1] font-medium">{selectedComplaint.target_name}</span></span>}
                {' • '}{formatDate(selectedComplaint.created_at)}
              </div>
            </div>
            {selectedComplaint.status === 'pending' && (
              <div className="flex gap-2">
                <button onClick={() => handleComplaintStatus(selectedComplaint.id, 'accepted')} className="px-4 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded font-bold text-xs hover:bg-green-500/20 transition-colors">
                  Принять
                </button>
                <button onClick={() => handleComplaintStatus(selectedComplaint.id, 'rejected')} className="px-4 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded font-bold text-xs hover:bg-red-500/20 transition-colors">
                  Отклонить
                </button>
              </div>
            )}
          </div>
          <div className="bg-[#0e0e10] border border-[#2f2f35] rounded p-4 text-[#efeff1] whitespace-pre-wrap text-sm leading-relaxed">
            {selectedComplaint.content}
          </div>
        </div>

        {/* Ответы */}
        {selectedComplaint.responses?.length > 0 && (
          <div className="space-y-4 mb-6">
            {selectedComplaint.responses.map((resp: any) => (
              <div key={resp.id} className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
                <div className="flex items-center gap-3 mb-3">
                  <img src={resp.author_avatar} alt="" className="w-8 h-8 rounded bg-[#2f2f35]" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#efeff1] text-sm">{resp.author_name}</span>
                      {getRoleBadge(resp.author_role)}
                    </div>
                    <div className="text-xs text-[#adadb8]">{formatDate(resp.created_at)}</div>
                  </div>
                </div>
                <div className="text-[#efeff1] whitespace-pre-wrap text-sm ml-11">{resp.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* Форма ответа */}
        <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
          <h3 className="font-bold text-[#efeff1] mb-4 text-sm uppercase tracking-wider">Ответить</h3>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder="Напишите ответ..."
            className="w-full h-24 bg-[#0e0e10] border border-[#2f2f35] rounded p-4 text-[#efeff1] placeholder-[#adadb8] resize-none focus:outline-none focus:border-primary text-sm mb-4"
          />
          <div className="flex justify-end">
            <button onClick={handleComplaintResponse} disabled={!responseText.trim()} className="px-6 py-2 bg-primary text-black font-bold rounded text-sm disabled:opacity-50 hover:bg-primary/90 transition-all">
              Отправить
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-6 max-w-[1400px] mx-auto pb-20 pt-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Shield size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Панель управления</h1>
          <p className="text-[#adadb8]">Администрирование сервера</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 border-b border-[#2f2f35]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-sm transition-all border-b-2 ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-[#adadb8] hover:text-[#efeff1]'
              }`}
            >
              <Icon size={16} />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded bg-red-500 text-white text-[10px]">{tab.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><GoogleLoader size={40} className="text-primary" /></div>
      ) : (
        <div>
          {/* Overview */}
          {activeTab === 'overview' && stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
                <div className="text-3xl font-bold text-[#efeff1] mb-1">{stats.users}</div>
                <div className="text-[#adadb8] text-xs font-bold uppercase tracking-wider">Пользователей</div>
              </div>
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
                <div className="text-3xl font-bold text-[#efeff1] mb-1">{stats.threads}</div>
                <div className="text-[#adadb8] text-xs font-bold uppercase tracking-wider">Тем на форуме</div>
              </div>
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
                <div className="text-3xl font-bold text-primary mb-1">{stats.pendingComplaints}</div>
                <div className="text-[#adadb8] text-xs font-bold uppercase tracking-wider">Новых жалоб</div>
              </div>
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
                <div className="text-3xl font-bold text-red-500 mb-1">{stats.bans}</div>
                <div className="text-[#adadb8] text-xs font-bold uppercase tracking-wider">Активных банов</div>
              </div>
            </div>
          )}

          {/* Users */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="relative max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#adadb8]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск игрока..."
                  className="w-full bg-[#18181b] border border-[#2f2f35] rounded pl-10 pr-4 py-2 text-sm text-[#efeff1] focus:outline-none focus:border-primary"
                />
              </div>
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0e0e10] border-b border-[#2f2f35] text-[#adadb8]">
                    <tr>
                      <th className="px-6 py-3 font-bold uppercase tracking-wider">Игрок</th>
                      <th className="px-6 py-3 font-bold uppercase tracking-wider">Роль</th>
                      <th className="px-6 py-3 font-bold uppercase tracking-wider">SteamID</th>
                      <th className="px-6 py-3 font-bold uppercase tracking-wider text-right">Был в сети</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2f2f35]">
                    {users.filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase())).map((u) => (
                      <tr key={u.steam_id} className="hover:bg-[#2f2f35] transition-colors group">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <img src={u.avatar} alt="" className="w-8 h-8 rounded" />
                            <span className="font-bold text-[#efeff1]">{u.name}</span>
                            {u.is_banned ? <span className="px-1.5 py-0.5 bg-red-500/10 text-red-500 text-[10px] font-bold uppercase rounded">Banned</span> : null}
                          </div>
                        </td>
                        <td className="px-6 py-3">{getRoleBadge(u.role)}</td>
                        <td className="px-6 py-3 font-mono text-[#adadb8]">{u.steam_id}</td>
                        <td className="px-6 py-3 text-right text-[#adadb8]">{formatDate(u.last_seen)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Complaints */}
          {activeTab === 'complaints' && (
            <div className="space-y-4">
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden">
              {complaints.length === 0 ? (
                <div className="p-10 text-center text-[#adadb8]">Нет жалоб</div>
              ) : (
                <div className="divide-y divide-[#2f2f35]">
                  {complaints.filter(c => 
                    searchQuery === '' ||
                    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.author_name.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((c) => (
                    <div key={c.id} onClick={() => setSelectedComplaint(c)} className="p-4 hover:bg-[#2f2f35] transition-colors cursor-pointer flex items-center gap-4">
                      <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${c.type === 'appeal' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {c.type === 'appeal' ? <AlertTriangle size={16} /> : <MessageSquare size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-[#efeff1] truncate">{c.title}</span>
                          {getStatusBadge(c.status)}
                        </div>
                        <div className="text-xs text-[#adadb8] truncate">
                          От: {c.author_name} • {formatDate(c.created_at)}
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-[#adadb8]" />
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          )}

          {/* Bans */}
          {activeTab === 'bans' && (
            <div className="space-y-4">
              <div className="bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden">
              {bans.length === 0 ? (
                <div className="p-10 text-center text-[#adadb8]">Нет активных банов</div>
              ) : (
                <div className="divide-y divide-[#2f2f35]">
                  {bans.map((b) => (
                    <div key={b.id} className="p-4 hover:bg-[#2f2f35] transition-colors flex items-center gap-4">
                      <img src={b.player_avatar} alt="" className="w-8 h-8 rounded bg-[#2f2f35]" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#efeff1]">{b.player_name}</div>
                        <div className="text-xs text-red-400">{b.reason}</div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-[#efeff1] font-bold">{b.expires_at ? formatDate(b.expires_at) : 'Навсегда'}</div>
                        <div className="text-[#adadb8]">Выдал: {b.banned_by_name}</div>
                      </div>
                      <button onClick={() => handleRemoveBan(b.id)} className="p-2 text-[#adadb8] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
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
