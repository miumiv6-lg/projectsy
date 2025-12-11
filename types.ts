declare global {
  interface Window {
    Telegram: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
  }
}

export enum Page {
  SHOP = 'shop',
  TICKETS = 'tickets',
  SUBSCRIPTION = 'subscription',
  FNAF = 'fnaf',
  TERMS = 'terms',
  SKINS = 'skins',
  PROFILE = 'profile',
}

// Роли пользователей
export enum UserRole {
  USER = 'user',
  MODERATOR = 'moderator',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export interface SteamUser {
  steamId: string;
  personaname: string;
  avatarfull: string;
  profileurl: string;
  timecreated?: number;
  loccountrycode?: string;
  role?: UserRole;
}

// Форум
export interface ForumThread {
  id: string;
  forumId: string;
  title: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: UserRole;
  createdAt: string;
  updatedAt: string;
  replies: number;
  views: number;
  isPinned?: boolean;
  isLocked?: boolean;
  tags?: string[];
  lastReply?: {
    authorId: string;
    authorName: string;
    authorAvatar: string;
    date: string;
  };
}

export interface ForumPost {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole?: UserRole;
  authorPosts: number;
  authorJoined: string;
  createdAt: string;
  content: string;
  likes: number;
  likedBy: string[];
}

// Админ панель - игроки на сервере
export interface ServerPlayer {
  steamId: string;
  name: string;
  avatar: string;
  role: UserRole;
  joinedAt: string;
  playtime: number; // в минутах
  isBanned?: boolean;
  banReason?: string;
  banExpires?: string;
}

// Жалобы
export interface Complaint {
  id: string;
  type: 'player' | 'appeal';
  status: 'pending' | 'accepted' | 'rejected';
  authorId: string;
  authorName: string;
  targetId?: string;
  targetName?: string;
  title: string;
  content: string;
  createdAt: string;
  responses: ComplaintResponse[];
}

export interface ComplaintResponse {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface NewsItem {
  id: number;
  date: string;
  title: string;
  description: string;
  tags: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqCategory {
  title: string;
  items: FaqItem[];
}
