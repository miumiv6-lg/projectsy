import React from 'react';
import { Crown, Code, Train, Users, ArrowUpRight } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  description: string;
  initials: string;
  color: string;
  icon?: any;
}

const Team: React.FC = () => {
  const leadership: TeamMember[] = [
    { 
      name: 'sleepus', 
      role: 'Основатель', 
      description: 'Создатель и руководитель проекта', 
      initials: 'S',
      color: 'text-red-400',
      icon: Crown,
    },
    { 
      name: '//usonance\\\\', 
      role: 'Зам. главы', 
      description: 'Заместитель руководителя', 
      initials: 'U',
      color: 'text-purple-400',
    },
    { 
      name: 'scxowo', 
      role: 'Зам. главы', 
      description: 'Заместитель руководителя', 
      initials: 'S',
      color: 'text-orange-400',
    },
  ];

  const team: TeamMember[] = [
    { 
      name: 'sidorin', 
      role: 'Разработчик', 
      description: 'Сайт, серверная часть', 
      initials: 'SI',
      color: 'text-blue-400',
      icon: Code,
    },
    { 
      name: 'Юрий Свириденко', 
      role: 'Метростроевец', 
      description: 'Строительство и карты', 
      initials: 'ЮС',
      color: 'text-green-400',
      icon: Train,
    },
    { 
      name: 'Тосол', 
      role: 'Главарь РЭКС', 
      description: 'Направление РЭКС', 
      initials: 'Т',
      color: 'text-yellow-400',
    },
  ];

  const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
    const Icon = member.icon;
    return (
      <div 
        className="bg-[#18181b] border border-[#2f2f35] rounded-md p-5 hover:border-primary/50 transition-colors group animate-fade-in"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded bg-[#2f2f35] flex items-center justify-center font-bold text-lg shrink-0 group-hover:scale-110 transition-transform duration-300">
            {Icon ? <Icon size={24} className={member.color} /> : <span className={member.color}>{member.initials}</span>}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-white text-base truncate">{member.name}</h3>
            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${member.color}`}>{member.role}</p>
            <p className="text-sm text-[#adadb8] truncate">{member.description}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full px-6 max-w-[1000px] mx-auto pb-20 pt-8 animate-fade-in">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Users size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Команда</h1>
          <p className="text-[#adadb8]">Люди, создающие Project SY</p>
        </div>
      </div>

      {/* Leadership */}
      <div className="mb-12">
        <h2 className="text-sm font-bold text-[#adadb8] uppercase tracking-wider mb-4 px-1">Руководство</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {leadership.map((member, idx) => (
            <MemberCard key={member.name} member={member} index={idx} />
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mb-12">
        <h2 className="text-sm font-bold text-[#adadb8] uppercase tracking-wider mb-4 px-1">Команда</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.map((member, idx) => (
            <MemberCard key={member.name} member={member} index={idx + leadership.length} />
          ))}
        </div>
      </div>

      {/* Join CTA */}
      <div className="bg-[#18181b] border border-[#2f2f35] rounded-md p-8 text-center animate-fade-in">
        <h3 className="text-lg font-bold text-white mb-2">Хочешь в команду?</h3>
        <p className="text-sm text-[#adadb8] mb-6 max-w-md mx-auto">
          Мы всегда ищем талантливых людей. Напиши нам в Telegram!
        </p>
        <button className="h-10 px-6 bg-[#2f2f35] hover:bg-[#3f3f46] text-white font-bold rounded text-sm inline-flex items-center gap-2 transition-colors">
          Написать
          <ArrowUpRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Team;
