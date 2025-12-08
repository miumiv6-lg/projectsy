import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Pin, Lock, Eye, Plus, ArrowLeft, Send, Heart, Trash2, Loader2, Construction } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { forumApi } from '../api';
import { UserRole } from '../types';

const FORUM_DISABLED = false;

type ViewMode = 'sections' | 'threads' | 'thread' | 'newThread';

// Liquid Glass Card
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden
      bg-white/[0.04] backdrop-blur-2xl
      border border-white/[0.08]
      hover:bg-white/[0.06] hover:border-white/[0.12]
      transition-all duration-300
      ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const Forum: React.FC = () => {
  const { isAuthenticated, user, openLoginModal, hasPermission } = useAuth();
  
  if (FORUM_DISABLED) {
    return (
      <div className="w-full px-4 max-w-3xl mx-auto py-20 text-center animate-ios-slide-up">
        <div className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-yellow-500/20 backdrop-blur-xl border border-yellow-500/20 flex items-center justify-center">
          <Construction size={48} className="text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Форум временно недоступен</h1>
        <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
          Мы работаем над улучшением форума. Он станет доступен после открытия сервера.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl text-white/60">
          <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
          <span>В разработке</span>
        </div>
      </div>
    );
  }

  const [viewMode, setViewMode] = useState<ViewMode>('sections');
  const [sections, setSections] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [currentSection, setCurrentSection] = useState<any>(null);
  const [currentThread, setCurrentThread] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isMod = hasPermission(UserRole.MODERATOR);

  useEffect(() => {
    loadSections();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [viewMode]);

  const loadSections = async () => {
    try {
      setLoading(true);
      const data = await forumApi.getSections();
      setSections(data);
    } catch (err) {
      console.error('Failed to load sections:', err);
    } finally {
      setLoading(false);
    }
  };

  const openSection = async (section: any) => {
    setCurrentSection(section);
    setLoading(true);
    try {
      const data = await forumApi.getThreads(section.id);
      setThreads(data);
      setViewMode('threads');
    } catch (err) {
      console.error('Failed to load threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const openThread = async (thread: any) => {
    setCurrentThread(thread);
    setLoading(true);
    try {
      const data = await forumApi.getPosts(thread.id);
      setPosts(data);
      setViewMode('thread');
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    setSubmitting(true);
    try {
      await forumApi.createThread(currentSection.id, newThreadTitle, newThreadContent);
      setNewThreadTitle('');
      setNewThreadContent('');
      const data = await forumApi.getThreads(currentSection.id);
      setThreads(data);
      setViewMode('threads');
    } catch (err) {
      console.error('Failed to create thread:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setSubmitting(true);
    try {
      await forumApi.createPost(currentThread.id, replyContent);
      setReplyContent('');
      const data = await forumApi.getPosts(currentThread.id);
      setPosts(data);
    } catch (err) {
      console.error('Failed to create post:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!isAuthenticated) return openLoginModal();
    try {
      await forumApi.toggleLike(postId);
      const data = await forumApi.getPosts(currentThread.id);
      setPosts(data);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Удалить этот пост?')) return;
    try {
      await forumApi.deletePost(postId);
      const data = await forumApi.getPosts(currentThread.id);
      setPosts(data);
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const handleTogglePin = async () => {
    try {
      await forumApi.updateThread(currentThread.id, { isPinned: !currentThread.is_pinned });
      setCurrentThread({ ...currentThread, is_pinned: currentThread.is_pinned ? 0 : 1 });
    } catch (err) {
      console.error('Failed to toggle pin:', err);
    }
  };

  const handleToggleLock = async () => {
    try {
      await forumApi.updateThread(currentThread.id, { isLocked: !currentThread.is_locked });
      setCurrentThread({ ...currentThread, is_locked: currentThread.is_locked ? 0 : 1 });
    } catch (err) {
      console.error('Failed to toggle lock:', err);
    }
  };

  const handleDeleteThread = async () => {
    if (!confirm('Удалить эту тему?')) return;
    try {
      await forumApi.deleteThread(currentThread.id);
      const data = await forumApi.getThreads(currentSection.id);
      setThreads(data);
      setViewMode('threads');
    } catch (err) {
      console.error('Failed to delete thread:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (mins < 1) return 'только что';
    if (mins < 60) return `${mins} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const getRoleBadge = (role?: string) => {
    if (!role || role === 'user') return null;
    const styles: Record<string, string> = {
      moderator: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
      admin: 'bg-purple-500/20 text-purple-400 border border-purple-500/20',
      owner: 'bg-red-500/20 text-red-400 border border-red-500/20',
    };
    const labels: Record<string, string> = {
      moderator: 'Модератор',
      admin: 'Админ',
      owner: 'Владелец',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-xl ${styles[role]}`}>{labels[role]}</span>;
  };

  if (loading && viewMode === 'sections') {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  // === ПРОСМОТР ТЕМЫ ===
  if (viewMode === 'thread' && currentThread) {
    return (
      <div className="w-full px-4 max-w-5xl mx-auto pb-20 pt-24 animate-ios-slide-up">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-6 text-sm">
          <button onClick={() => setViewMode('sections')} className="text-blue-400 hover:text-blue-300 transition-colors">Форум</button>
          <ChevronRight size={14} className="text-white/30" />
          <button onClick={() => setViewMode('threads')} className="text-blue-400 hover:text-blue-300 transition-colors">{currentSection?.name}</button>
          <ChevronRight size={14} className="text-white/30" />
          <span className="text-white/50 truncate max-w-[200px]">{currentThread.title}</span>
        </div>

        {/* Thread Header */}
        <GlassCard className="rounded-[32px] p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {currentThread.is_pinned ? <Pin size={16} className="text-blue-400" /> : null}
                {currentThread.is_locked ? <Lock size={16} className="text-white/40" /> : null}
                <h1 className="text-2xl font-bold text-white">{currentThread.title}</h1>
              </div>
              <div className="flex items-center gap-4 text-sm text-white/40">
                <span>Автор: <span className="text-white/70">{currentThread.author_name}</span></span>
                <span>•</span>
                <span>{formatDate(currentThread.created_at)}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Eye size={14} /> {currentThread.views}</span>
              </div>
            </div>
            {isMod && (
              <div className="flex gap-2">
                <button onClick={handleTogglePin} className={`p-3 rounded-xl backdrop-blur-xl border transition-all ${currentThread.is_pinned ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:bg-white/[0.08]'}`}>
                  <Pin size={16} />
                </button>
                <button onClick={handleToggleLock} className={`p-3 rounded-xl backdrop-blur-xl border transition-all ${currentThread.is_locked ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 'bg-white/[0.04] border-white/[0.08] text-white/40 hover:bg-white/[0.08]'}`}>
                  <Lock size={16} />
                </button>
                <button onClick={handleDeleteThread} className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-white/50 animate-spin" /></div>
        ) : (
          <div className="space-y-4 mb-6">
            {posts.map((post) => (
              <GlassCard key={post.id} className="rounded-[28px] overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 p-6 bg-white/[0.02] flex md:flex-col items-center md:items-start gap-4 md:gap-2 border-b md:border-b-0 md:border-r border-white/[0.06]">
                    <img src={post.author_avatar} alt={post.author_name} className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{post.author_name}</span>
                        {getRoleBadge(post.author_role)}
                      </div>
                      <div className="text-xs text-white/40 mt-1">Сообщений: {post.author_posts}</div>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <div className="text-xs text-white/40 mb-4">{formatDate(post.created_at)}</div>
                    <div className="text-white/70 leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</div>
                    <div className="flex items-center gap-4 pt-4 border-t border-white/[0.06]">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-400' : 'text-white/40 hover:text-red-400'}`}
                      >
                        <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                        {post.likes}
                      </button>
                      {isMod && (
                        <button onClick={() => handleDeletePost(post.id)} className="text-sm text-white/40 hover:text-red-400 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Reply Form */}
        {!currentThread.is_locked && (
          isAuthenticated ? (
            <GlassCard className="rounded-[28px] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Ответить</h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Напишите ваш ответ..."
                className="w-full h-32 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-white/20 transition-colors"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleReply}
                  disabled={submitting || !replyContent.trim()}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 font-semibold rounded-2xl hover:bg-blue-500/30 transition-all disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={18} />}
                  Отправить
                </button>
              </div>
            </GlassCard>
          ) : (
            <GlassCard className="rounded-[28px] p-6 text-center">
              <p className="text-white/50 mb-4">Войдите, чтобы оставить ответ</p>
              <button onClick={openLoginModal} className="px-6 py-3 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 font-semibold rounded-2xl hover:bg-blue-500/30 transition-all">
                Войти через Steam
              </button>
            </GlassCard>
          )
        )}
      </div>
    );
  }

  // === СОЗДАНИЕ ТЕМЫ ===
  if (viewMode === 'newThread' && currentSection) {
    return (
      <div className="w-full px-4 max-w-3xl mx-auto pb-20 pt-24 animate-ios-slide-up">
        <button onClick={() => setViewMode('threads')} className="flex items-center gap-2 text-blue-400 font-medium py-6 hover:text-blue-300 transition-colors">
          <ArrowLeft size={20} />
          Назад
        </button>
        <GlassCard className="rounded-[32px] p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Новая тема в "{currentSection.name}"</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-white/50 mb-2">Заголовок</label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="Введите заголовок темы"
                className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-white/50 mb-2">Сообщение</label>
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Напишите ваше сообщение..."
                className="w-full h-48 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 text-white placeholder-white/30 resize-none focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setViewMode('threads')} className="px-6 py-3 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white font-semibold rounded-2xl hover:bg-white/[0.08] transition-all">
              Отмена
            </button>
            <button 
              onClick={handleCreateThread}
              disabled={submitting || !newThreadTitle.trim() || !newThreadContent.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 font-semibold rounded-2xl hover:bg-blue-500/30 transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={18} />}
              Создать тему
            </button>
          </div>
        </GlassCard>
      </div>
    );
  }

  // === СПИСОК ТЕМ ===
  if (viewMode === 'threads' && currentSection) {
    return (
      <div className="w-full px-4 max-w-5xl mx-auto pb-20 pt-24 animate-ios-slide-up">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-6 text-sm">
          <button onClick={() => setViewMode('sections')} className="text-blue-400 hover:text-blue-300 transition-colors">Форум</button>
          <ChevronRight size={14} className="text-white/30" />
          <span className="text-white/50">{currentSection.name}</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{currentSection.name}</h1>
            <p className="text-white/50 mt-1">{currentSection.description}</p>
          </div>
          {isAuthenticated && (!currentSection.modOnly || isMod) && (
            <button
              onClick={() => setViewMode('newThread')}
              className="flex items-center gap-2 px-5 py-3 bg-blue-500/20 backdrop-blur-xl border border-blue-500/30 text-blue-400 font-semibold rounded-2xl hover:bg-blue-500/30 transition-all"
            >
              <Plus size={18} />
              Новая тема
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 text-white/50 animate-spin" /></div>
        ) : threads.length === 0 ? (
          <GlassCard className="rounded-[28px] p-10 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.04] flex items-center justify-center">
              <MessageSquare size={28} className="text-white/20" />
            </div>
            <p className="text-white/50">Пока нет тем. Будьте первым!</p>
          </GlassCard>
        ) : (
          <GlassCard className="rounded-[28px] overflow-hidden">
            {threads.map((thread, idx) => (
              <div key={thread.id}>
                <div onClick={() => openThread(thread)} className="p-5 hover:bg-white/[0.04] transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <img src={thread.author_avatar} alt={thread.author_name} className="w-12 h-12 rounded-xl object-cover border border-white/[0.08]" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.is_pinned ? <Pin size={14} className="text-blue-400" /> : null}
                        {thread.is_locked ? <Lock size={14} className="text-white/40" /> : null}
                        <h3 className="font-semibold text-white truncate">{thread.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/40">
                        <span>{thread.author_name}</span>
                        {getRoleBadge(thread.author_role)}
                        <span>•</span>
                        <span>{formatDate(thread.created_at)}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
                      <div className="text-center">
                        <div className="text-white font-semibold">{thread.replies}</div>
                        <div className="text-xs">ответов</div>
                      </div>
                      <div className="text-center">
                        <div className="text-white font-semibold">{thread.views}</div>
                        <div className="text-xs">просмотров</div>
                      </div>
                    </div>
                  </div>
                </div>
                {idx !== threads.length - 1 && <div className="h-px bg-white/[0.06] mx-5" />}
              </div>
            ))}
          </GlassCard>
        )}
      </div>
    );
  }

  // === ГЛАВНАЯ - РАЗДЕЛЫ ===
  return (
    <div className="w-full px-4 max-w-5xl mx-auto pb-20 pt-24">
      <div className="text-center py-12 animate-ios-slide-up">
        <span className="inline-block px-4 py-1.5 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
          Project SY Community
        </span>
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
          Форум
        </h1>
        <p className="text-white/40 text-xl font-light tracking-wide max-w-lg mx-auto">
          Правила и жалобы
        </p>
      </div>

      <div className="space-y-4 animate-ios-slide-up">
        {sections.map((section) => (
          <GlassCard
            key={section.id}
            onClick={() => openSection(section)}
            className="rounded-[28px] p-5 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 backdrop-blur-xl border border-blue-500/20 flex items-center justify-center">
                <MessageSquare size={24} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white mb-1">{section.name}</h3>
                <p className="text-sm text-white/50">{section.description}</p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
                <div className="text-center">
                  <div className="text-white font-semibold">{section.threads}</div>
                  <div className="text-xs">тем</div>
                </div>
                <div className="text-center">
                  <div className="text-white font-semibold">{section.posts}</div>
                  <div className="text-xs">сообщений</div>
                </div>
              </div>
              <ChevronRight size={20} className="text-white/30" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default Forum;
