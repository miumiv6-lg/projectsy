import React from 'react';
import { Crown, Code, Train, Users } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  initials: string;
  color: string;
  roleColor: string;
  icon?: any;
}

const Team: React.FC = () => {
  const leadership: TeamMember[] = [
    { 
      name: 'sleepus', 
      role: 'Основатель', 
      description: 'Создатель и руководитель проекта', 
      initials: 'S',
      color: 'bg-red-500/80',
      roleColor: 'text-red-400',
      icon: Crown,
    },
    { 
      name: '//usonance\\\\', 
      role: 'Зам. главы', 
      description: 'Заместитель руководителя', 
      initials: 'U',
      color: 'bg-purple-500/80',
      roleColor: 'text-purple-400',
    },
    { 
      name: 'scxowo', 
      role: 'Зам. главы', 
      description: 'Заместитель руководителя', 
      initials: 'S',
      color: 'bg-orange-500/80',
      roleColor: 'text-orange-400',
    },
  ];

  const team: TeamMember[] = [
    { 
      name: 'sidorin', 
      role: 'Разработчик', 
      description: 'Сайт, серверная часть', 
      initials: 'SI',
      color: 'bg-brand-blue',
      roleColor: 'text-brand-blue',
      icon: Code,
    },
    { 
      name: 'Юрий Свириденко', 
      role: 'Метростроевец', 
      description: 'Строительство и карты', 
      initials: 'ЮС',
      color: 'bg-cyan-500/80',
      roleColor: 'text-cyan-400',
      icon: Train,
    },
    { 
      name: 'Тосол', 
      role: 'Главарь РЭКС', 
      description: 'Направление РЭКС', 
      initials: 'Т',
      color: 'bg-amber-500/80',
      roleColor: 'text-amber-400',
    },
  ];

  const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
    const Icon = member.icon;
    return (
      <div 
        className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-5 hover:bg-white/[0.06] transition-colors animate-ios-slide-up opacity-0 fill-mode-forwards"
        style={{ animationDelay: `${(index + 1) * 80}ms` }}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${member.color} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
            {Icon ? <Icon size={22} /> : member.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{member.name}</h3>
            <p className={`text-sm font-medium ${member.roleColor}`}>{member.role}</p>
            <p className="text-xs text-white/40 mt-0.5">{member.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-4 max-w-4xl mx-auto pb-20 pt-24">
      {/* Header */}
      <div className="text-center py-10 animate-ios-slide-up">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Users size={28} className="text-purple-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Команда</h1>
        <p className="text-white/40 text-lg">Люди, создающие Project SY</p>
      </div>

      {/* Leadership */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4 px-1">Руководство</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {leadership.map((member, idx) => (
            <div key={member.name}>
              <MemberCard member={member} index={idx} />
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-8">
        <h2 className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4 px-1">Команда</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {team.map((member, idx) => (
            <div key={member.name}>
              <MemberCard member={member} index={idx + leadership.length} />
            </div>
          ))}
        </div>
      </div>

      {/* Join - Liquid Glass */}
      <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/[0.08] rounded-[24px] p-6 text-center animate-ios-slide-up delay-500 opacity-0 fill-mode-forwards">
        <h3 className="text-lg font-bold text-white mb-2">Хочешь в команду?</h3>
        <p className="text-white/40 text-sm">Мы всегда ищем талантливых людей. Напиши нам в Telegram!</p>
      </div>
    </div>
  );
};

export default Team;
