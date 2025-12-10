import React, { useState, useEffect } from 'react';
import { MessageSquare, ChevronRight, Pin, Lock, Eye, Plus, ArrowLeft, Send, Heart, Trash2, Construction } from 'lucide-react';
import GoogleLoader from '../components/GoogleLoader';
import { useAuth } from '../context/AuthContext';
import { forumApi } from '../api';
import { UserRole } from '../types';

const FORUM_DISABLED = false;

type ViewMode = 'sections' | 'threads' | 'thread' | 'newThread';

const Forum: React.FC = () => {
  const { isAuthenticated, user, openLoginModal, hasPermission } = useAuth();
  
  if (FORUM_DISABLED) {
    return (
      <div className="w-full px-6 max-w-[1000px] mx-auto py-20 text-center animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-8 rounded bg-[#2f2f35] flex items-center justify-center">
          <Construction size={48} className="text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-[#efeff1] mb-4">Форум временно недоступен</h1>
        <p className="text-[#adadb8] text-lg mb-8 max-w-md mx-auto">
          Мы работаем над улучшением форума. Он станет доступен после открытия сервера.
        </p>
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
      moderator: 'bg-green-500/10 text-green-400',
      admin: 'bg-red-500/10 text-red-400',
      owner: 'bg-purple-500/10 text-purple-400',
    };
    const labels: Record<string, string> = {
      moderator: 'MOD',
      admin: 'ADMIN',
      owner: 'OWNER',
    };
    return (
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${styles[role] || 'bg-[#2f2f35] text-[#adadb8]'}`}>
        {labels[role]}
      </span>
    );
  };

  if (loading && viewMode === 'sections') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GoogleLoader size={48} className="text-primary" />
      </div>
    );
  }

  // === THREAD VIEW ===
  if (viewMode === 'thread' && currentThread) {
    return (
      <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-5 text-sm font-medium text-[#adadb8]">
          <button onClick={() => setViewMode('sections')} className="hover:text-primary transition-colors">Форум</button>
          <ChevronRight size={14} />
          <button onClick={() => setViewMode('threads')} className="hover:text-primary transition-colors">{currentSection?.name}</button>
          <ChevronRight size={14} />
          <span className="truncate max-w-[200px] text-white">{currentThread.title}</span>
        </div>

        {/* Thread Header */}
        <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {currentThread.is_pinned ? <Pin size={18} className="text-primary" /> : null}
                {currentThread.is_locked ? <Lock size={18} className="text-[#adadb8]" /> : null}
                <h1 className="text-2xl font-bold text-[#efeff1]">{currentThread.title}</h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#adadb8]">
                <span className="text-[#efeff1] font-medium">{currentThread.author_name}</span>
                <span>•</span>
                <span>{formatDate(currentThread.created_at)}</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1"><Eye size={14} /> {currentThread.views}</span>
              </div>
            </div>
            {isMod && (
              <div className="flex gap-2">
                <button onClick={handleTogglePin} className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${currentThread.is_pinned ? 'bg-primary text-black' : 'bg-[#2f2f35] text-[#adadb8] hover:text-white'}`}>
                  <Pin size={16} />
                </button>
                <button onClick={handleToggleLock} className={`w-9 h-9 rounded flex items-center justify-center transition-colors ${currentThread.is_locked ? 'bg-red-500/20 text-red-400' : 'bg-[#2f2f35] text-[#adadb8] hover:text-white'}`}>
                  <Lock size={16} />
                </button>
                <button onClick={handleDeleteThread} className="w-9 h-9 rounded flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex justify-center py-10"><GoogleLoader size={40} className="text-primary" /></div>
        ) : (
          <div className="space-y-4 mb-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-48 p-5 bg-[#0e0e10] flex md:flex-col items-center md:items-start gap-3 border-b md:border-b-0 md:border-r border-[#2f2f35]">
                    <img src={post.author_avatar} alt={post.author_name} className="w-12 h-12 rounded bg-[#2f2f35] object-cover" />
                    <div>
                      <div className="flex flex-col md:items-start items-center gap-1">
                        <span className="font-bold text-[#efeff1] text-sm">{post.author_name}</span>
                        {getRoleBadge(post.author_role)}
                      </div>
                      <div className="text-xs text-[#adadb8] mt-1">Сообщений: {post.author_posts}</div>
                    </div>
                  </div>
                  <div className="flex-1 p-5 md:p-6">
                    <div className="text-xs text-[#adadb8] mb-3 font-mono">{formatDate(post.created_at)}</div>
                    <div className="text-[#efeff1] text-base leading-relaxed mb-6 whitespace-pre-wrap">{post.content}</div>
                    <div className="flex items-center gap-3 pt-5 border-t border-[#2f2f35]">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${post.isLiked ? 'text-red-400 bg-red-500/10' : 'text-[#adadb8] hover:bg-[#2f2f35] hover:text-[#efeff1]'}`}
                      >
                        <Heart size={16} fill={post.isLiked ? 'currentColor' : 'none'} />
                        {post.likes}
                      </button>
                      {isMod && (
                        <button onClick={() => handleDeletePost(post.id)} className="p-1.5 rounded text-[#adadb8] hover:text-red-400 hover:bg-red-500/10 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Form */}
        {!currentThread.is_locked && (
          isAuthenticated ? (
            <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6">
              <h3 className="font-bold text-[#efeff1] mb-4">Ваш ответ</h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Напишите ваш ответ..."
                className="w-full h-32 bg-[#0e0e10] border border-[#2f2f35] rounded p-4 text-[#efeff1] placeholder-[#adadb8] resize-none focus:outline-none focus:border-primary transition-colors"
              />
              <div className="flex justify-end mt-4">
                <button 
                  onClick={handleReply}
                  disabled={submitting || !replyContent.trim()}
                  className="h-9 px-4 bg-primary text-black font-bold rounded text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitting ? <GoogleLoader size={16} /> : <Send size={16} />}
                  Отправить
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-8 text-center">
              <p className="text-[#adadb8] mb-5">Войдите, чтобы оставить ответ</p>
              <button onClick={openLoginModal} className="h-10 px-6 bg-primary text-black font-bold rounded text-sm">
                Войти через Steam
              </button>
            </div>
          )
        )}
      </div>
    );
  }

  // === NEW THREAD ===
  if (viewMode === 'newThread' && currentSection) {
    return (
      <div className="w-full px-6 max-w-3xl mx-auto pb-20 pt-8 animate-fade-in">
        <button onClick={() => setViewMode('threads')} className="inline-flex items-center gap-2 text-[#adadb8] hover:text-[#efeff1] text-sm font-medium py-5 transition-colors">
          <ArrowLeft size={18} />
          Назад
        </button>
        <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-6 md:p-8">
          <h1 className="text-2xl font-bold text-[#efeff1] mb-6">Новая тема</h1>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-bold text-[#adadb8] mb-2 block uppercase tracking-wider">Заголовок</label>
              <input
                type="text"
                value={newThreadTitle}
                onChange={(e) => setNewThreadTitle(e.target.value)}
                placeholder="О чем хотите поговорить?"
                className="w-full bg-[#0e0e10] border border-[#2f2f35] rounded px-4 py-3 text-[#efeff1] placeholder-[#adadb8] focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-[#adadb8] mb-2 block uppercase tracking-wider">Сообщение</label>
              <textarea
                value={newThreadContent}
                onChange={(e) => setNewThreadContent(e.target.value)}
                placeholder="Подробности..."
                className="w-full h-48 bg-[#0e0e10] border border-[#2f2f35] rounded p-4 text-[#efeff1] placeholder-[#adadb8] resize-none focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setViewMode('threads')} className="h-10 px-6 text-[#efeff1] hover:text-primary font-medium text-sm transition-colors">
              Отмена
            </button>
            <button 
              onClick={handleCreateThread}
              disabled={submitting || !newThreadTitle.trim() || !newThreadContent.trim()}
              className="h-10 px-6 bg-primary text-black font-bold rounded text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {submitting ? <GoogleLoader size={16} /> : <Send size={16} />}
              Создать тему
            </button>
          </div>
        </div>
      </div>
    );
  }

  // === THREADS LIST ===
  if (viewMode === 'threads' && currentSection) {
    return (
      <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 py-5 text-sm font-medium text-[#adadb8]">
          <button onClick={() => setViewMode('sections')} className="hover:text-primary transition-colors">Форум</button>
          <ChevronRight size={14} />
          <span className="text-white">{currentSection.name}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#efeff1] mb-1">{currentSection.name}</h1>
            <p className="text-[#adadb8]">{currentSection.description}</p>
          </div>
          {isAuthenticated && (!currentSection.modOnly || isMod) && (
            <button
              onClick={() => setViewMode('newThread')}
              className="h-10 px-5 bg-primary text-black font-bold rounded text-sm inline-flex items-center gap-2 hover:bg-primary/90 transition-colors shrink-0"
            >
              <Plus size={18} />
              Новая тема
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><GoogleLoader size={40} className="text-primary" /></div>
        ) : threads.length === 0 ? (
          <div className="p-16 text-center border border-dashed border-[#2f2f35] rounded-lg">
            <div className="w-16 h-16 mx-auto mb-5 rounded bg-[#2f2f35] flex items-center justify-center">
              <MessageSquare size={24} className="text-[#adadb8]" />
            </div>
            <p className="text-[#adadb8]">Пока нет тем. Будьте первым!</p>
          </div>
        ) : (
          <div className="bg-[#18181b] border border-[#2f2f35] rounded-md overflow-hidden">
            {threads.map((thread, idx) => (
              <div key={thread.id}>
                <div onClick={() => openThread(thread)} className="p-4 hover:bg-[#2f2f35] transition-colors cursor-pointer group">
                  <div className="flex items-start gap-4">
                    <img src={thread.author_avatar} alt={thread.author_name} className="w-10 h-10 rounded bg-[#2f2f35] object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.is_pinned ? <Pin size={14} className="text-primary" /> : null}
                        {thread.is_locked ? <Lock size={14} className="text-[#adadb8]" /> : null}
                        <h3 className="text-base font-bold text-[#efeff1] truncate group-hover:text-primary transition-colors">{thread.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#adadb8] font-medium">
                        <span className="text-[#efeff1]">{thread.author_name}</span>
                        {getRoleBadge(thread.author_role)}
                        <span>•</span>
                        <span>{formatDate(thread.created_at)}</span>
                      </div>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-xs text-[#adadb8]">
                      <div className="text-center w-16">
                        <div className="text-sm font-bold text-[#efeff1]">{thread.replies}</div>
                        <div>ответов</div>
                      </div>
                      <div className="text-center w-16">
                        <div className="text-sm font-bold text-[#efeff1]">{thread.views}</div>
                        <div>просм.</div>
                      </div>
                    </div>
                  </div>
                </div>
                {idx !== threads.length - 1 && <div className="h-px bg-[#2f2f35]" />}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // === SECTIONS LIST ===
  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <MessageSquare size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Форум</h1>
          <p className="text-[#adadb8]">Общение, идеи и поддержка</p>
        </div>
      </div>

      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => openSection(section)}
            className="bg-[#18181b] border border-[#2f2f35] rounded-md p-5 cursor-pointer hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
                <MessageSquare size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-[#efeff1] mb-1 group-hover:text-primary transition-colors">{section.name}</h3>
                <p className="text-sm text-[#adadb8]">{section.description}</p>
              </div>
              <div className="hidden md:flex items-center gap-8 text-xs text-[#adadb8] mr-4">
                <div className="text-center">
                  <div className="text-base font-bold text-[#efeff1]">{section.threads}</div>
                  <div>тем</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-[#efeff1]">{section.posts}</div>
                  <div>сообщений</div>
                </div>
              </div>
              <div className="w-8 h-8 flex items-center justify-center text-[#adadb8] group-hover:text-primary transition-colors">
                <ChevronRight size={20} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Forum;
