import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';

const SteamIcon = () => (
  <img 
    src="https://img.icons8.com/?size=100&id=pOa8st0SGd5C&format=png&color=FFFFFF" 
    alt="Steam" 
    className="w-5 h-5" 
  />
);

interface ProfileButtonProps {
    setPage: (page: Page) => void;
    variant?: 'desktop' | 'mobile';
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ setPage, variant = 'desktop' }) => {
    const { user, isAuthenticated, openLoginModal, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className={`${variant === 'desktop' ? 'w-10 h-10' : 'w-12 h-12'} rounded-full bg-[#2C2C2E] animate-pulse`} />
        );
    }

    if (!isAuthenticated) {
        if (variant === 'mobile') {
            return (
                <button
                    onClick={openLoginModal}
                    className="w-full bg-[#1b2838] hover:bg-[#2a475e] text-white font-bold py-4 rounded-2xl text-lg shadow-lg active-scale flex items-center justify-center gap-3 border border-white/10"
                >
                    <SteamIcon />
                    Войти через Steam
                </button>
            );
        }

        return (
            <button
                onClick={openLoginModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1b2838] hover:bg-[#2a475e] text-white font-semibold text-sm transition-all active-scale border border-white/10"
            >
                <SteamIcon />
                <span className="hidden lg:inline">Войти</span>
            </button>
        );
    }

    // Authenticated state
    if (variant === 'mobile') {
        return (
            <button
                onClick={() => setPage(Page.PROFILE)}
                className="w-full bg-[#2C2C2E] text-white font-semibold py-4 rounded-2xl text-lg active-scale flex items-center justify-center gap-4"
            >
                <img
                    src={user?.avatarfull}
                    alt={user?.personaname}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-blue"
                />
                <span>{user?.personaname}</span>
            </button>
        );
    }

    return (
        <button
            onClick={() => setPage(Page.PROFILE)}
            className="group relative flex items-center gap-2 active-scale"
        >
            <img
                src={user?.avatarfull}
                alt={user?.personaname}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-brand-blue transition-all shadow-lg"
            />
            <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-semibold text-white truncate max-w-[100px]">
                    {user?.personaname}
                </span>
                <span className="text-xs text-gray-500">Профиль</span>
            </div>
        </button>
    );
};

export default ProfileButton;
