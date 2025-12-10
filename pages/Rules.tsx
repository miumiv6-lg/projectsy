import React, { useState } from 'react';
import { Page } from '../types';
import { Search, Gavel, Ban } from 'lucide-react';

interface RulesProps {
    setPage: (page: Page) => void;
}

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
        { id: '1.1', title: 'Адекватность', description: 'Запрещено оскорблять игроков, администрацию, переходить на личности и разжигать конфликты.', punishment: 'Мут 30м / Бан 2ч', type: 'general' },
        { id: '1.2', title: 'Реклама', description: 'Запрещена реклама сторонних проектов, серверов, сайтов без согласования.', punishment: 'Бан навсегда', type: 'general' },
        { id: '1.3', title: 'Багоюз', description: 'Использование ошибок игры/сервера для получения преимущества.', punishment: 'Бан 7д', type: 'general' },
        { id: '2.1', title: 'Спавн составов', description: 'Запрещено спавнить поезда на перегонах, занятых путях и в местах, где это мешает проезду.', punishment: 'Удаление / Кик', type: 'gameplay' },
        { id: '2.2', title: 'Таран и помехи', description: 'Намеренное столкновение с другими поездами, блокировка путей пропами или телом.', punishment: 'Бан 12ч', type: 'gameplay' },
        { id: '2.3', title: 'AFK', description: 'Запрещено стоять в AFK на линии более 5 минут, создавая пробку.', punishment: 'Кик', type: 'gameplay' },
        { id: '2.4', title: 'Соблюдение светофоров', description: 'Игрок обязан соблюдать сигналы светофоров. Проезд на красный запрещен (кроме манёвров по приказу).', punishment: 'Варн / Кик', type: 'gameplay' },
        { id: '3.1', title: 'Спам / Флуд', description: 'Запрещено отправлять бессмысленные сообщения, повторять одно и то же более 3 раз.', punishment: 'Мут 15м', type: 'chat' },
        { id: '3.2', title: 'Микрофон', description: 'Запрещено кричать в микрофон, включать музыку (Soundpad) в общественных местах.', punishment: 'Мут 1ч', type: 'chat' },
    ];

    const filteredRules = rules.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.id.includes(searchTerm)
    );

    return (
        <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
                        <Gavel size={24} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[#efeff1]">Правила</h1>
                        <p className="text-[#adadb8]">Свод законов сервера</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Поиск правил..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-10 bg-[#18181b] border border-[#2f2f35] rounded pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                    />
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
            </div>

            {/* Rules List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredRules.length > 0 ? (
                    filteredRules.map((rule) => (
                        <div key={rule.id} className="bg-[#18181b] rounded-md border border-[#2f2f35] p-5 hover:border-primary/50 transition-colors group">
                            <div className="flex items-start gap-4">
                                
                                {/* Badge */}
                                <div className="shrink-0">
                                    <span className="inline-flex items-center justify-center w-12 h-8 rounded bg-[#2f2f35] text-primary font-mono font-bold text-sm group-hover:bg-primary group-hover:text-black transition-colors">
                                        {rule.id}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-grow min-w-0 pt-0.5">
                                    <h3 className="font-bold text-white mb-1 text-base">{rule.title}</h3>
                                    <p className="text-sm text-[#adadb8] leading-relaxed mb-3">{rule.description}</p>
                                    
                                    {/* Punishment */}
                                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded">
                                        <Ban size={12} />
                                        <span>Наказание: {rule.punishment}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-16 text-center border border-dashed border-[#2f2f35] rounded-lg">
                        <p className="text-[#adadb8]">Ничего не найдено</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Rules;
