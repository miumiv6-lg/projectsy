import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SteamUser, UserRole } from '../types';

interface AuthContextType {
  user: SteamUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (userData: SteamUser) => void;
  logout: () => void;
  isAdmin: boolean;
  isModerator: boolean;
  hasPermission: (minRole: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'projectsy_steam_user';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Список Steam ID администраторов (можно вынести в env или получать с сервера)
const ADMIN_STEAM_IDS = [
  '76561199410968139', // sidorin - Owner
];

const MODERATOR_STEAM_IDS: string[] = [
  // Добавь Steam ID модераторов
];

// Определение роли по Steam ID
const getRoleBysteamId = (steamId: string): UserRole => {
  if (ADMIN_STEAM_IDS.includes(steamId)) return UserRole.OWNER;
  if (MODERATOR_STEAM_IDS.includes(steamId)) return UserRole.MODERATOR;
  return UserRole.USER;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Проверка авторизации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Сначала проверяем localStorage
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.role = getRoleBysteamId(parsed.steamId);
          setUser(parsed);
        }

        // Проверяем URL на callback от Steam
        const urlParams = new URLSearchParams(window.location.search);
        const steamData = urlParams.get('steam_user');
        
        if (steamData) {
          const userData = JSON.parse(decodeURIComponent(steamData));
          userData.role = getRoleBysteamId(userData.steamId);
          setUser(userData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
          // Очищаем URL
          window.history.replaceState({}, '', window.location.pathname);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const login = (userData: SteamUser) => {
    userData.role = getRoleBysteamId(userData.steamId);
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Проверка прав
  const roleHierarchy: Record<UserRole, number> = {
    [UserRole.USER]: 0,
    [UserRole.MODERATOR]: 1,
    [UserRole.ADMIN]: 2,
    [UserRole.OWNER]: 3,
  };

  const hasPermission = (minRole: UserRole): boolean => {
    if (!user?.role) return false;
    return roleHierarchy[user.role] >= roleHierarchy[minRole];
  };

  const isAdmin = hasPermission(UserRole.ADMIN);
  const isModerator = hasPermission(UserRole.MODERATOR);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isLoginModalOpen,
    openLoginModal,
    closeLoginModal,
    login,
    logout,
    isAdmin,
    isModerator,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Для демо-режима
export const DEMO_STEAM_USER: SteamUser = {
  steamId: '76561198000000000', // Этот ID в списке админов
  personaname: 'Admin Demo',
  avatarfull: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg',
  profileurl: 'https://steamcommunity.com/profiles/76561198000000000/',
  timecreated: 1609459200,
  loccountrycode: 'RU',
  role: UserRole.OWNER,
};

// Функция для реального входа через Steam
export const steamLogin = () => {
  window.location.href = `${API_URL}/auth/steam`;
};

export default AuthContext;
