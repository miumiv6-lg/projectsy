import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import SteamStrategy from 'passport-steam';
import dotenv from 'dotenv';
import * as db from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Админы (владельцы)
const OWNER_IDS = ['76561199410968139'];
const ADMIN_IDS = [];
const MOD_IDS = [];

const getRole = (steamId) => {
  if (OWNER_IDS.includes(steamId)) return 'owner';
  if (ADMIN_IDS.includes(steamId)) return 'admin';
  if (MOD_IDS.includes(steamId)) return 'moderator';
  return 'user';
};

// Middleware
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(session({
  secret: 'projectsy-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new SteamStrategy({
    returnURL: `http://localhost:${PORT}/auth/steam/callback`,
    realm: `http://localhost:${PORT}/`,
    apiKey: process.env.STEAM_API_KEY
  },
  (identifier, profile, done) => {
    const steamId = profile.id;
    const role = getRole(steamId);
    
    const user = db.createOrUpdateUser({
      steamId,
      name: profile.displayName,
      avatar: profile.photos[2]?.value || profile.photos[0]?.value,
      role
    });

    return done(null, {
      steamId: user.steamId,
      personaname: user.name,
      avatarfull: user.avatar,
      profileurl: profile._json.profileurl,
      timecreated: profile._json.timecreated,
      loccountrycode: profile._json.loccountrycode,
      role: user.role
    });
  }
));

// Middleware для получения пользователя из заголовка или сессии
app.use((req, res, next) => {
  // Если есть сессия - используем её
  if (req.user) return next();
  
  // Иначе проверяем заголовок X-Steam-ID
  const steamId = req.headers['x-steam-id'];
  if (steamId) {
    const user = db.getUser(steamId);
    if (user) {
      req.user = {
        steamId: user.steamId,
        personaname: user.name,
        avatarfull: user.avatar,
        role: user.role || getRole(steamId),
      };
    }
  }
  next();
});

// Auth middleware
const requireAuth = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  next();
};

const requireMod = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!['moderator', 'admin', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  if (!['admin', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};

// === AUTH ROUTES ===
app.get('/auth/steam', passport.authenticate('steam'));

app.get('/auth/steam/callback',
  passport.authenticate('steam', { failureRedirect: FRONTEND_URL }),
  (req, res) => {
    const userData = encodeURIComponent(JSON.stringify(req.user));
    res.redirect(`${FRONTEND_URL}?steam_user=${userData}`);
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(() => res.redirect(FRONTEND_URL));
});

app.get('/api/me', (req, res) => {
  res.json(req.user || null);
});

// === FORUM ROUTES ===
app.get('/api/forum/sections', (req, res) => {
  res.json(db.getForumSections());
});

app.get('/api/forum/sections/:id/threads', (req, res) => {
  res.json(db.getThreadsBySection(req.params.id));
});

app.get('/api/forum/threads/:id', (req, res) => {
  const thread = db.getThread(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  res.json(thread);
});

app.post('/api/forum/threads', requireAuth, (req, res) => {
  const { sectionId, title, content } = req.body;
  if (!sectionId || !title || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  
  // Проверка прав на раздел
  const section = db.getSection(sectionId);
  if (section?.modOnly && !['moderator', 'admin', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Only moderators can create threads in this section' });
  }
  
  // Сохраняем/обновляем пользователя в базе
  db.createOrUpdateUser({
    steamId: req.user.steamId,
    name: req.user.personaname,
    avatar: req.user.avatarfull,
    role: req.user.role,
  });
  
  const thread = db.createThread(sectionId, req.user.steamId, title, content);
  res.json(thread);
});

app.patch('/api/forum/threads/:id', requireMod, (req, res) => {
  const thread = db.updateThread(req.params.id, req.body);
  res.json(thread);
});

app.delete('/api/forum/threads/:id', requireMod, (req, res) => {
  db.deleteThread(req.params.id);
  res.json({ success: true });
});

app.get('/api/forum/threads/:id/posts', (req, res) => {
  const userId = req.user?.steamId || null;
  res.json(db.getPostsByThread(req.params.id, userId));
});

app.post('/api/forum/threads/:id/posts', requireAuth, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });
  
  const thread = db.getThread(req.params.id);
  if (!thread) return res.status(404).json({ error: 'Thread not found' });
  if (thread.is_locked) return res.status(403).json({ error: 'Thread is locked' });
  
  // Сохраняем/обновляем пользователя в базе
  db.createOrUpdateUser({
    steamId: req.user.steamId,
    name: req.user.personaname,
    avatar: req.user.avatarfull,
    role: req.user.role,
  });
  
  const post = db.createPost(req.params.id, req.user.steamId, content);
  res.json(post);
});

app.delete('/api/forum/posts/:id', requireMod, (req, res) => {
  db.deletePost(req.params.id);
  res.json({ success: true });
});

app.post('/api/forum/posts/:id/like', requireAuth, (req, res) => {
  const liked = db.toggleLike(req.params.id, req.user.steamId);
  res.json({ liked });
});

// === ADMIN ROUTES ===
app.get('/api/admin/stats', requireMod, (req, res) => {
  res.json(db.getStats());
});

app.get('/api/admin/users', requireMod, (req, res) => {
  res.json(db.getAllUsers());
});

app.patch('/api/admin/users/:steamId/role', requireAdmin, (req, res) => {
  const { role } = req.body;
  const user = db.updateUserRole(req.params.steamId, role);
  res.json(user);
});

// === COMPLAINTS ===
app.get('/api/complaints', requireMod, (req, res) => {
  const { status } = req.query;
  res.json(db.getComplaints(status || null));
});

app.get('/api/complaints/:id', requireAuth, (req, res) => {
  const complaint = db.getComplaint(req.params.id);
  if (!complaint) return res.status(404).json({ error: 'Not found' });
  
  // Только автор или модератор может видеть
  if (complaint.author_id !== req.user.steamId && !['moderator', 'admin', 'owner'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json(complaint);
});

app.post('/api/complaints', requireAuth, (req, res) => {
  const { type, targetId, title, content } = req.body;
  if (!type || !title || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const complaint = db.createComplaint(type, req.user.steamId, targetId, title, content);
  res.json(complaint);
});

app.patch('/api/complaints/:id/status', requireMod, (req, res) => {
  const { status } = req.body;
  const complaint = db.updateComplaintStatus(req.params.id, status);
  res.json(complaint);
});

app.post('/api/complaints/:id/respond', requireMod, (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content required' });
  const complaint = db.addComplaintResponse(req.params.id, req.user.steamId, content);
  res.json(complaint);
});

// === BANS ===
app.get('/api/bans', requireMod, (req, res) => {
  res.json(db.getBans());
});

app.post('/api/bans', requireMod, (req, res) => {
  const { steamId, reason, expiresAt } = req.body;
  if (!steamId || !reason) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const ban = db.createBan(steamId, reason, req.user.steamId, expiresAt);
  res.json(ban);
});

app.delete('/api/bans/:id', requireMod, (req, res) => {
  db.removeBan(req.params.id);
  res.json({ success: true });
});

// === NEWS ===
app.get('/api/news', (req, res) => {
  const userId = req.user?.steamId || null;
  res.json(db.getNews(userId));
});

app.get('/api/news/:id', (req, res) => {
  const userId = req.user?.steamId || null;
  const article = db.getNewsArticle(req.params.id, userId);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

app.post('/api/news', requireMod, (req, res) => {
  const { title, excerpt, content, imageUrl, tag, tagColor, readTime } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const article = db.createNews(title, excerpt, content, imageUrl, tag, tagColor, readTime);
  res.json(article);
});

app.patch('/api/news/:id', requireMod, (req, res) => {
  const article = db.updateNews(req.params.id, req.body);
  if (!article) return res.status(404).json({ error: 'Not found' });
  res.json(article);
});

app.delete('/api/news/:id', requireMod, (req, res) => {
  db.deleteNews(req.params.id);
  res.json({ success: true });
});

app.post('/api/news/:id/like', requireAuth, (req, res) => {
  console.log('Like request:', req.params.id, 'User:', req.user?.steamId);
  const liked = db.toggleNewsLike(req.params.id, req.user.steamId);
  console.log('Like result:', liked);
  res.json({ liked });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
