const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001';
const STORAGE_KEY = 'projectsy_steam_user';

function getStoredUser() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = getStoredUser();
  
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(user?.steamId ? { 'X-Steam-ID': user.steamId } : {}),
      ...options.headers,
    },
  });
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }
  
  return res.json();
}

// === FORUM ===
export const forumApi = {
  getSections: () => request<ForumSection[]>('/api/forum/sections'),
  
  getThreads: (sectionId: string) => 
    request<ForumThread[]>(`/api/forum/sections/${sectionId}/threads`),
  
  getThread: (threadId: string) => 
    request<ForumThread>(`/api/forum/threads/${threadId}`),
  
  createThread: (sectionId: string, title: string, content: string) =>
    request<ForumThread>('/api/forum/threads', {
      method: 'POST',
      body: JSON.stringify({ sectionId, title, content }),
    }),
  
  updateThread: (threadId: string, updates: { isPinned?: boolean; isLocked?: boolean }) =>
    request<ForumThread>(`/api/forum/threads/${threadId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    }),
  
  deleteThread: (threadId: string) =>
    request(`/api/forum/threads/${threadId}`, { method: 'DELETE' }),
  
  getPosts: (threadId: string) =>
    request<ForumPost[]>(`/api/forum/threads/${threadId}/posts`),
  
  createPost: (threadId: string, content: string) =>
    request<ForumPost>(`/api/forum/threads/${threadId}/posts`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
  
  deletePost: (postId: string) =>
    request(`/api/forum/posts/${postId}`, { method: 'DELETE' }),
  
  toggleLike: (postId: string) =>
    request<{ liked: boolean }>(`/api/forum/posts/${postId}/like`, { method: 'POST' }),
};

// === ADMIN ===
export const adminApi = {
  getStats: () => request<AdminStats>('/api/admin/stats'),
  
  getUsers: () => request<User[]>('/api/admin/users'),
  
  updateUserRole: (steamId: string, role: string) =>
    request<User>(`/api/admin/users/${steamId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
};

// === COMPLAINTS ===
export const complaintsApi = {
  getAll: (status?: string) => 
    request<Complaint[]>(`/api/complaints${status ? `?status=${status}` : ''}`),
  
  get: (id: string) => request<Complaint>(`/api/complaints/${id}`),
  
  create: (type: string, title: string, content: string, targetId?: string) =>
    request<Complaint>('/api/complaints', {
      method: 'POST',
      body: JSON.stringify({ type, title, content, targetId }),
    }),
  
  updateStatus: (id: string, status: string) =>
    request<Complaint>(`/api/complaints/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  respond: (id: string, content: string) =>
    request<Complaint>(`/api/complaints/${id}/respond`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),
};

// === BANS ===
export const bansApi = {
  getAll: () => request<Ban[]>('/api/bans'),
  
  create: (steamId: string, reason: string, expiresAt?: string) =>
    request<Ban>('/api/bans', {
      method: 'POST',
      body: JSON.stringify({ steamId, reason, expiresAt }),
    }),
  
  remove: (id: string) =>
    request(`/api/bans/${id}`, { method: 'DELETE' }),
};

// === NEWS ===
export const newsApi = {
  getAll: () => request<NewsArticle[]>('/api/news'),
  
  get: (id: string) => request<NewsArticle>(`/api/news/${id}`),
  
  create: (data: { title: string; excerpt: string; content: string; imageUrl?: string; tag?: string; tagColor?: string; readTime?: string }) =>
    request<NewsArticle>('/api/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: Partial<NewsArticle>) =>
    request<NewsArticle>(`/api/news/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    request(`/api/news/${id}`, { method: 'DELETE' }),
  
  toggleLike: (id: string) =>
    request<{ liked: boolean }>(`/api/news/${id}/like`, { method: 'POST' }),
};

// Types
interface ForumSection {
  id: string;
  name: string;
  description: string;
  threads: number;
  posts: number;
  lastPost?: {
    author_name: string;
    author_avatar: string;
    thread_title: string;
    created_at: string;
  };
}

interface ForumThread {
  id: string;
  section_id: string;
  title: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role?: string;
  created_at: string;
  updated_at: string;
  is_pinned: number;
  is_locked: number;
  views: number;
  replies: number;
  lastReply?: {
    author_name: string;
    author_avatar: string;
    created_at: string;
  };
}

interface ForumPost {
  id: string;
  thread_id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role?: string;
  author_posts: number;
  author_joined: string;
  content: string;
  created_at: string;
  likes: number;
  isLiked?: boolean;
}

interface AdminStats {
  users: number;
  threads: number;
  posts: number;
  bans: number;
  pendingComplaints: number;
}

interface User {
  steam_id: string;
  name: string;
  avatar: string;
  role: string;
  created_at: string;
  last_seen: string;
  is_banned: number;
}

interface Complaint {
  id: string;
  type: string;
  status: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  target_id?: string;
  target_name?: string;
  title: string;
  content: string;
  created_at: string;
  responses?: ComplaintResponse[];
}

interface ComplaintResponse {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  content: string;
  created_at: string;
}

interface Ban {
  id: string;
  steam_id: string;
  player_name: string;
  player_avatar: string;
  reason: string;
  banned_by: string;
  banned_by_name: string;
  created_at: string;
  expires_at?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  tag?: string;
  tagColor?: string;
  readTime?: string;
  views: number;
  likes: number;
  isLiked?: boolean;
  createdAt: string;
}
