import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_FILE = join(__dirname, 'data.json');

// Начальная структура БД
const defaultData = {
  users: {},
  forumSections: [
    { id: 'rules', name: 'Правила', description: 'Правила сервера и форума', sortOrder: 1, modOnly: true },
    { id: 'complaints', name: 'Жалобы', description: 'Жалобы на игроков и апелляции', sortOrder: 2, modOnly: false },
  ],
  threads: [],
  posts: [],
  likes: [],
  news: [],
  newsLikes: [],
  complaints: [],
  complaintResponses: [],
  bans: [],
};

// Загрузка/сохранение
const loadDb = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed to load DB:', err);
  }
  return { ...defaultData };
};

const saveDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

let db = loadDb();

// === USERS ===
export const getUser = (steamId) => db.users[steamId] || null;

export const createOrUpdateUser = (user) => {
  const existing = db.users[user.steamId];
  if (existing) {
    // Обновляем данные, но сохраняем роль если она была установлена вручную
    db.users[user.steamId] = { 
      ...existing, 
      name: user.name, 
      avatar: user.avatar, 
      role: user.role || existing.role || 'user',
      lastSeen: new Date().toISOString() 
    };
  } else {
    db.users[user.steamId] = {
      steamId: user.steamId,
      name: user.name,
      avatar: user.avatar,
      role: user.role || 'user',
      createdAt: new Date().toISOString(),
      lastSeen: new Date().toISOString(),
      isBanned: false,
    };
  }
  saveDb(db);
  return db.users[user.steamId];
};

export const getAllUsers = () => Object.values(db.users).sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

export const updateUserRole = (steamId, role) => {
  if (db.users[steamId]) {
    db.users[steamId].role = role;
    saveDb(db);
  }
  return db.users[steamId];
};

// === FORUM SECTIONS ===
export const getSection = (sectionId) => db.forumSections.find(s => s.id === sectionId);

export const getForumSections = () => {
  return db.forumSections.map(section => {
    const sectionThreads = db.threads.filter(t => t.sectionId === section.id);
    const sectionPosts = db.posts.filter(p => sectionThreads.some(t => t.id === p.threadId));
    
    const lastPost = sectionPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const lastThread = lastPost ? sectionThreads.find(t => t.id === lastPost.threadId) : null;
    const lastAuthor = lastPost ? db.users[lastPost.authorId] : null;

    return {
      ...section,
      modOnly: section.modOnly || false,
      threads: sectionThreads.length,
      posts: sectionPosts.length,
      lastPost: lastPost ? {
        author_name: lastAuthor?.name || 'Неизвестный',
        author_avatar: lastAuthor?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        thread_title: lastThread?.title || '',
        created_at: lastPost.createdAt,
      } : null,
    };
  });
};

// === THREADS ===
export const getThreadsBySection = (sectionId) => {
  const threads = db.threads.filter(t => t.sectionId === sectionId);
  return threads.map(thread => {
    const author = db.users[thread.authorId];
    const threadPosts = db.posts.filter(p => p.threadId === thread.id);
    const lastPost = threadPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const lastAuthor = lastPost ? db.users[lastPost.authorId] : null;

    return {
      ...thread,
      author_name: author?.name || 'Неизвестный',
      author_avatar: author?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      author_role: author?.role || 'user',
      replies: Math.max(0, threadPosts.length - 1),
      lastReply: lastPost && lastPost.id !== threadPosts[0]?.id ? {
        author_name: lastAuthor?.name || 'Неизвестный',
        author_avatar: lastAuthor?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
        created_at: lastPost.createdAt,
      } : null,
    };
  }).sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return b.is_pinned - a.is_pinned;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
};

export const getThread = (threadId) => {
  const thread = db.threads.find(t => t.id === threadId);
  if (!thread) return null;
  
  const author = db.users[thread.authorId];
  thread.views = (thread.views || 0) + 1;
  saveDb(db);

  return {
    ...thread,
    author_name: author?.name || 'Неизвестный',
    author_avatar: author?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
    author_role: author?.role || 'user',
  };
};

export const createThread = (sectionId, authorId, title, content) => {
  const threadId = uuidv4();
  const postId = uuidv4();
  const now = new Date().toISOString();

  const thread = {
    id: threadId,
    sectionId,
    title,
    authorId,
    createdAt: now,
    updatedAt: now,
    is_pinned: 0,
    is_locked: 0,
    views: 0,
  };

  const post = {
    id: postId,
    threadId,
    authorId,
    content,
    createdAt: now,
  };

  db.threads.push(thread);
  db.posts.push(post);
  saveDb(db);

  return getThread(threadId);
};

export const updateThread = (threadId, updates) => {
  const thread = db.threads.find(t => t.id === threadId);
  if (!thread) return null;

  if (updates.isPinned !== undefined) thread.is_pinned = updates.isPinned ? 1 : 0;
  if (updates.isLocked !== undefined) thread.is_locked = updates.isLocked ? 1 : 0;
  saveDb(db);

  return getThread(threadId);
};

export const deleteThread = (threadId) => {
  db.posts = db.posts.filter(p => p.threadId !== threadId);
  db.threads = db.threads.filter(t => t.id !== threadId);
  db.likes = db.likes.filter(l => !db.posts.some(p => p.id === l.postId && p.threadId === threadId));
  saveDb(db);
};

// === POSTS ===
export const getPostsByThread = (threadId, userId = null) => {
  const posts = db.posts.filter(p => p.threadId === threadId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  return posts.map(post => {
    const author = db.users[post.authorId];
    const authorPosts = db.posts.filter(p => p.authorId === post.authorId).length;
    const likesCount = db.likes.filter(l => l.postId === post.id).length;
    const userLiked = userId ? db.likes.some(l => l.postId === post.id && l.userId === userId) : false;

    return {
      ...post,
      author_name: author?.name || 'Неизвестный',
      author_avatar: author?.avatar || 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
      author_role: author?.role || 'user',
      author_posts: authorPosts,
      author_joined: author?.createdAt || '',
      likes: likesCount,
      isLiked: userLiked,
    };
  });
};

export const createPost = (threadId, authorId, content) => {
  const post = {
    id: uuidv4(),
    threadId,
    authorId,
    content,
    createdAt: new Date().toISOString(),
  };

  db.posts.push(post);
  
  const thread = db.threads.find(t => t.id === threadId);
  if (thread) thread.updatedAt = post.createdAt;
  
  saveDb(db);
  return post;
};

export const deletePost = (postId) => {
  db.likes = db.likes.filter(l => l.postId !== postId);
  db.posts = db.posts.filter(p => p.id !== postId);
  saveDb(db);
};

export const toggleLike = (postId, userId) => {
  const existing = db.likes.find(l => l.postId === postId && l.userId === userId);
  if (existing) {
    db.likes = db.likes.filter(l => !(l.postId === postId && l.userId === userId));
    saveDb(db);
    return false;
  } else {
    db.likes.push({ postId, userId, createdAt: new Date().toISOString() });
    saveDb(db);
    return true;
  }
};

// === COMPLAINTS ===
export const getComplaints = (status = null) => {
  let complaints = [...db.complaints];
  if (status) complaints = complaints.filter(c => c.status === status);
  
  return complaints.map(c => {
    const author = db.users[c.authorId];
    const target = c.targetId ? db.users[c.targetId] : null;
    return {
      ...c,
      author_name: author?.name || 'Unknown',
      author_avatar: author?.avatar || '',
      target_name: target?.name || null,
      target_avatar: target?.avatar || null,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getComplaint = (id) => {
  const complaint = db.complaints.find(c => c.id === id);
  if (!complaint) return null;

  const author = db.users[complaint.authorId];
  const target = complaint.targetId ? db.users[complaint.targetId] : null;
  const responses = db.complaintResponses.filter(r => r.complaintId === id).map(r => {
    const respAuthor = db.users[r.authorId];
    return {
      ...r,
      author_name: respAuthor?.name || 'Unknown',
      author_avatar: respAuthor?.avatar || '',
      author_role: respAuthor?.role,
    };
  });

  return {
    ...complaint,
    author_name: author?.name || 'Unknown',
    author_avatar: author?.avatar || '',
    target_name: target?.name || null,
    responses,
  };
};

export const createComplaint = (type, authorId, targetId, title, content) => {
  const complaint = {
    id: uuidv4(),
    type,
    status: 'pending',
    authorId,
    targetId,
    title,
    content,
    createdAt: new Date().toISOString(),
  };
  db.complaints.push(complaint);
  saveDb(db);
  return getComplaint(complaint.id);
};

export const updateComplaintStatus = (id, status) => {
  const complaint = db.complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = status;
    saveDb(db);
  }
  return getComplaint(id);
};

export const addComplaintResponse = (complaintId, authorId, content) => {
  const response = {
    id: uuidv4(),
    complaintId,
    authorId,
    content,
    createdAt: new Date().toISOString(),
  };
  db.complaintResponses.push(response);
  saveDb(db);
  return getComplaint(complaintId);
};

// === BANS ===
export const getBans = () => {
  return db.bans.filter(b => b.isActive).map(b => {
    const player = db.users[b.steamId];
    const admin = db.users[b.bannedBy];
    return {
      ...b,
      player_name: player?.name || 'Unknown',
      player_avatar: player?.avatar || '',
      banned_by_name: admin?.name || 'Unknown',
    };
  });
};

export const createBan = (steamId, reason, bannedBy, expiresAt = null) => {
  const ban = {
    id: uuidv4(),
    steamId,
    reason,
    bannedBy,
    createdAt: new Date().toISOString(),
    expiresAt,
    isActive: true,
  };
  db.bans.push(ban);
  
  if (db.users[steamId]) {
    db.users[steamId].isBanned = true;
    db.users[steamId].banReason = reason;
  }
  
  saveDb(db);
  return ban;
};

export const removeBan = (banId) => {
  const ban = db.bans.find(b => b.id === banId);
  if (ban) {
    ban.isActive = false;
    if (db.users[ban.steamId]) {
      db.users[ban.steamId].isBanned = false;
      db.users[ban.steamId].banReason = null;
    }
    saveDb(db);
  }
};

// === STATS ===
export const getStats = () => ({
  users: Object.keys(db.users).length,
  threads: db.threads.length,
  posts: db.posts.length,
  bans: db.bans.filter(b => b.isActive).length,
  pendingComplaints: db.complaints.filter(c => c.status === 'pending').length,
});

// === NEWS ===
export const getNews = (userId = null) => {
  if (!db.news) db.news = [];
  if (!db.newsLikes) db.newsLikes = [];
  
  return db.news.map(article => {
    const likes = db.newsLikes.filter(l => l.newsId === article.id).length;
    const isLiked = userId ? db.newsLikes.some(l => l.newsId === article.id && l.userId === userId) : false;
    return {
      ...article,
      likes,
      isLiked,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getNewsArticle = (id, userId = null) => {
  if (!db.news) db.news = [];
  if (!db.newsLikes) db.newsLikes = [];
  
  const article = db.news.find(a => a.id === id);
  if (!article) return null;
  
  // Увеличиваем просмотры
  article.views = (article.views || 0) + 1;
  saveDb(db);
  
  const likes = db.newsLikes.filter(l => l.newsId === id).length;
  const isLiked = userId ? db.newsLikes.some(l => l.newsId === id && l.userId === userId) : false;
  
  return {
    ...article,
    likes,
    isLiked,
  };
};

export const createNews = (title, excerpt, content, imageUrl, tag, tagColor, readTime) => {
  if (!db.news) db.news = [];
  
  const article = {
    id: uuidv4(),
    title,
    excerpt,
    content,
    imageUrl,
    tag,
    tagColor,
    readTime,
    views: 0,
    createdAt: new Date().toISOString(),
  };
  
  db.news.push(article);
  saveDb(db);
  return article;
};

export const updateNews = (id, updates) => {
  if (!db.news) return null;
  
  const article = db.news.find(a => a.id === id);
  if (!article) return null;
  
  Object.assign(article, updates);
  saveDb(db);
  return article;
};

export const deleteNews = (id) => {
  if (!db.news) return;
  db.news = db.news.filter(a => a.id !== id);
  db.newsLikes = db.newsLikes.filter(l => l.newsId !== id);
  saveDb(db);
};

export const toggleNewsLike = (newsId, userId) => {
  if (!db.newsLikes) db.newsLikes = [];
  
  const existing = db.newsLikes.find(l => l.newsId === newsId && l.userId === userId);
  if (existing) {
    db.newsLikes = db.newsLikes.filter(l => !(l.newsId === newsId && l.userId === userId));
    saveDb(db);
    return false;
  } else {
    db.newsLikes.push({ newsId, userId, createdAt: new Date().toISOString() });
    saveDb(db);
    return true;
  }
};

export default db;
