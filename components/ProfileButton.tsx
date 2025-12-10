import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Page } from '../types';
import { LogIn, ChevronDown, Menu, User } from 'lucide-react';

interface ProfileButtonProps {
    setPage: (page: Page) => void;
    onOpenNavigation?: () => void;
    variant?: 'desktop' | 'mobile';
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ setPage, onOpenNavigation, variant = 'desktop' }) => {
    const { user, isAuthenticated, openLoginModal, isLoading } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    if (isLoading) {
        return (
            <div className="w-8 h-8 rounded bg-[#2f2f35] animate-pulse" />
        );
    }

    if (!isAuthenticated) {
        return (
            <button
                onClick={openLoginModal}
                className="btn-secondary h-8 px-3 text-xs"
            >
                <LogIn size={14} className="mr-2" />
                Войти
            </button>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:bg-[#2f2f35] p-1 pr-2 rounded transition-colors"
            >
                <img
                    src={user?.avatarfull}
                    alt={user?.personaname}
                    className="w-7 h-7 rounded object-cover"
                />
                <span className="hidden md:block text-sm font-semibold text-[#efeff1] max-w-[100px] truncate">
                    {user?.personaname}
                </span>
                <ChevronDown 
                    size={14} 
                    className={`text-[#adadb8] hidden md:block transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#18181b] border border-[#2f2f35] rounded-md shadow-xl overflow-hidden z-50 animate-scale-in origin-top-right">
                    <div className="p-2 border-b border-[#2f2f35] mb-1">
                        <div className="flex items-center gap-3 px-2 py-1">
                            <img src={user?.avatarfull} alt="" className="w-10 h-10 rounded" />
                            <div className="overflow-hidden">
                                <div className="font-bold text-[#efeff1] truncate">{user?.personaname}</div>
                                <div className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                    В сети
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-1 space-y-0.5">
                        <button
                            onClick={() => {
                                setPage(Page.PROFILE);
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-[#adadb8] hover:text-[#efeff1] hover:bg-[#2f2f35] transition-colors text-left"
                        >
                            <User size={16} />
                            <span>Профиль</span>
                        </button>
                        
                        <button
                            onClick={() => {
                                if (onOpenNavigation) onOpenNavigation();
                                setIsOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-[#adadb8] hover:text-[#efeff1] hover:bg-[#2f2f35] transition-colors text-left md:hidden"
                        >
                            <Menu size={16} />
                            <span>Меню</span>
                        </button>
                        
                        {/* Example logout or other actions */}
                        <div className="h-px bg-[#2f2f35] my-1" />
                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded text-sm text-[#adadb8] hover:text-[#efeff1] hover:bg-[#2f2f35] transition-colors text-left">
                            <LogIn size={16} className="rotate-180" />
                            <span>Выйти</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileButton;
