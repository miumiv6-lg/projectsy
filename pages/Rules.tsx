import React, { useState } from 'react';
import { Page } from '../types';
import { Search, Gavel, AlertCircle, Info, Ban, CheckCircle2 } from 'lucide-react';

interface RulesProps {
    setPage: (page: Page) => void;
}

const LiquidBackground = () => (
    <div className="fixed inset-0 z-0 bg-black pointer-events-none" />
);

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = "" }) => (
    <div
        className={`
      bg-white/5 backdrop-blur-3xl 
      border border-white/10 
      shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
      ${className}
    `}
    >
        {children}
    </div>
);

interface RuleItem {
    id: string;
    title: string;
    description: string;
    punishment: string;
    type: 'general' | 'gameplay' | 'chat';
}

const Rules: React.FC<RulesProps> = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const rules: RuleItem[] = [
        // General
        { id: '1.1', title: 'Адекватность', description: 'Запрещено оскорблять игроков, администрацию, переходить на личности и разжигать конфликты.', punishment: 'Мут 30м / Бан 2ч', type: 'general' },
        { id: '1.2', title: 'Реклама', description: 'Запрещена реклама сторонних проектов, серверов, сайтов без согласования.', punishment: 'Бан навсегда', type: 'general' },
        { id: '1.3', title: 'Багоюз', description: 'Использование ошибок игры/сервера для получения преимущества.', punishment: 'Бан 7д', type: 'general' },

        // Gameplay
        { id: '2.1', title: 'Спавн составов', description: 'Запрещено спавнить поезда на перегонах, занятых путях и в местах, где это мешает проезду.', punishment: 'Удаление / Кик', type: 'gameplay' },
        { id: '2.2', title: 'Таран и помехи', description: 'Намеренное столкновение с другими поездами, блокировка путей пропами или телом.', punishment: 'Бан 12ч', type: 'gameplay' },
        { id: '2.3', title: 'AFK', description: 'Запрещено стоять в AFK на линии более 5 минут, создавая пробку.', punishment: 'Кик', type: 'gameplay' },
        { id: '2.4', title: 'Соблюдение светофоров', description: 'Игрок обязан соблюдать сигналы светофоров. Проезд на красный запрещен (кроме манёвров по приказу).', punishment: 'Варн / Кик', type: 'gameplay' },

        // Chat
        { id: '3.1', title: 'Спам / Флуд', description: 'Запрещено отправлять бессмысленные сообщения, повторять одно и то же более 3 раз.', punishment: 'Мут 15м', type: 'chat' },
        { id: '3.2', title: 'Микрофон', description: 'Запрещено кричать в микрофон, включать музыку (Soundpad) в общественных местах.', punishment: 'Мут 1ч', type: 'chat' },
    ];

    const filteredRules = rules.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    );

    return (
        <div className="relative w-full min-h-screen">
            <LiquidBackground />

            <div className="relative z-10 w-full px-4 max-w-6xl mx-auto pb-20 pt-6">

                {/* Header */}
                <div className="text-center py-12 animate-ios-slide-up">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Правила
                    </h1>
                    <p className="text-xl text-white/50 font-light tracking-wide max-w-2xl mx-auto">
                        Соблюдение правил делает игру комфортной для всех
                    </p>
                </div>

                {/* Search */}
                <div className="relative mb-12 animate-ios-slide-up delay-100 opacity-0 fill-mode-forwards max-w-xl mx-auto">
                    <GlassCard className="rounded-[24px] flex items-center p-2 focus-within:bg-white/10 transition-colors">
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 ml-1">
                            <Search size={20} className="text-white/40" />
                        </div>
                        <input
                            type="text"
                            placeholder="Поиск правил..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-transparent text-white text-lg px-4 py-3 focus:outline-none placeholder-white/20 font-light"
                        />
                    </GlassCard>
                </div>

                {/* Rules Table */}
                <div className="animate-ios-slide-up delay-200 opacity-0 fill-mode-forwards">
                    <GlassCard className="rounded-[40px] overflow-hidden">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-white/5 text-white/40 text-sm font-bold uppercase tracking-wider hidden md:grid">
                            <div className="col-span-1 text-center">#</div>
                            <div className="col-span-3">Название</div>
                            <div className="col-span-6">Описание</div>
                            <div className="col-span-2 text-right">Наказание</div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-white/5">
                            {filteredRules.length > 0 ? (
                                filteredRules.map((rule) => (
                                    <div key={rule.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-6 hover:bg-white/5 transition-colors group">
                                        {/* ID */}
                                        <div className="col-span-12 md:col-span-1 flex items-center md:justify-center">
                                            <span className="inline-block px-3 py-1 rounded-lg bg-white/5 text-white/50 font-mono text-sm border border-white/5 group-hover:border-white/20 transition-colors">
                                                {rule.id}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <div className="col-span-12 md:col-span-3 flex items-center">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{rule.title}</h3>
                                        </div>

                                        {/* Description */}
                                        <div className="col-span-12 md:col-span-6 flex items-center">
                                            <p className="text-white/70 leading-relaxed font-light">{rule.description}</p>
                                        </div>

                                        {/* Punishment */}
                                        <div className="col-span-12 md:col-span-2 flex items-center md:justify-end mt-4 md:mt-0">
                                            <div className="flex items-center gap-2 text-red-300 bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/10">
                                                <Gavel size={14} />
                                                <span className="text-sm font-medium">{rule.punishment}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <p className="text-white/30 text-lg">Правила не найдена.</p>
                                </div>
                            )}
                        </div>
                    </GlassCard>
                </div>

            </div>
        </div>
    );
};

export default Rules;
