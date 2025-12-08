import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Settings,
  LogOut,
  Server,
  Wifi,
  Map,
  Clock,
  Globe,
  Users,
  Trophy,
  User,
  MessageCircle,
  Copy,
  MicOff,
  MapPin,
  TrainFront,
  Briefcase,
  Lock,
  ChevronRight,
  Newspaper,
  Gamepad2
} from 'lucide-react';

interface GmodInterfaceProps {
  setPage?: () => void;
}

type InterfaceMode = 'menu' | 'loading' | 'queue' | 'connecting' | 'click_to_start' | 'spawn_selection' | 'ingame' | 'battlepass';
type SpawnFilter = 'all' | 'driver' | 'passenger';

// Battle Pass Data - каждый уровень имеет бесплатную (free) и премиум (premium) награду
interface BattlePassLevel {
  level: number;
  free: { name: string; icon: string };
  premium: { name: string; icon: string };
}

const BATTLEPASS_LEVELS: BattlePassLevel[] = [
  { level: 1, free: { name: '50 ₽', icon: '💰' }, premium: { name: '150 ₽', icon: '💎' } },
  { level: 2, free: { name: '75 ₽', icon: '💰' }, premium: { name: 'Скин "Стартер"', icon: '🎨' } },
  { level: 3, free: { name: '100 ₽', icon: '💰' }, premium: { name: 'Титул "VIP"', icon: '🏷️' } },
  { level: 4, free: { name: 'Эмоция "Привет"', icon: '👋' }, premium: { name: '300 ₽', icon: '💎' } },
  { level: 5, free: { name: '150 ₽', icon: '💰' }, premium: { name: 'Аватар "Метро"', icon: '🚇' } },
  { level: 6, free: { name: '200 ₽', icon: '💰' }, premium: { name: 'Скин "Машинист"', icon: '🎨' } },
  { level: 7, free: { name: 'Титул "Игрок"', icon: '🏷️' }, premium: { name: '500 ₽', icon: '💎' } },
  { level: 8, free: { name: '250 ₽', icon: '💰' }, premium: { name: 'Эмоция "Танец"', icon: '💃' } },
  { level: 9, free: { name: '300 ₽', icon: '💰' }, premium: { name: 'Аватар "Золото"', icon: '✨' } },
  { level: 10, free: { name: 'Эмоция "Салют"', icon: '🎉' }, premium: { name: 'Скин "Элита"', icon: '🎨' } },
  { level: 11, free: { name: '400 ₽', icon: '💰' }, premium: { name: '750 ₽', icon: '💎' } },
  { level: 12, free: { name: '500 ₽', icon: '💰' }, premium: { name: 'Титул "Ветеран"', icon: '🏷️' } },
  { level: 13, free: { name: 'Титул "Опытный"', icon: '🏷️' }, premium: { name: 'Аватар "Платина"', icon: '🌟' } },
  { level: 14, free: { name: '750 ₽', icon: '💰' }, premium: { name: 'Эмоция "Победа"', icon: '🏆' } },
  { level: 15, free: { name: '1000 ₽', icon: '💰' }, premium: { name: 'Скин "Легенда"', icon: '👑' } },
];

interface Player {
  id: number;
  name: string;
  rank: string;
  ping: number;
  avatar: 'red' | 'blue' | 'green' | 'orange' | 'purple' | 'gray';
  countryCode: string;
  geoInfo: string;
  statusText: string;
  steamId: string;
}

const SPAWN_POINTS = [
  { id: 1, title: "ТЧ-1 «Лихоборы»", desc: "Электродепо. Спавн составов.", type: 'driver', icon: <TrainFront size={22} /> },
  { id: 2, title: "Тупик ст. Физтех", desc: "Оборотный тупик. Смена кабины.", type: 'driver', icon: <TrainFront size={22} /> },
  { id: 3, title: "Ст. Лианозово", desc: "Пассажирская платформа", type: 'passenger', icon: <MapPin size={22} /> },
  { id: 4, title: "Ст. Физтех", desc: "Конечная станция", type: 'passenger', icon: <MapPin size={22} /> },
  { id: 5, title: "Ст. Яхромская", desc: "Пассажирская платформа", type: 'passenger', icon: <MapPin size={22} /> },
];

// Карты для голосования
interface MapVote {
  id: string;
  name: string;
  image: string;
  voters: { id: number; name: string; avatar: string }[];
}

const VOTE_MAPS: MapVote[] = [
  {
    id: 'mrl_v3',
    name: 'gm_metro_mrl_v3',
    image: 'https://files.facepunch.com/garry/1083f274/2012-07-06_14-41-43.jpg',
    voters: [
      { id: 1, name: 'sleepus', avatar: 'https://avatars.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg' },
      { id: 2, name: '//usonance\\\\', avatar: 'https://avatars.steamstatic.com/b5bd56c1aa4644a474a2e4a2e4e4e4e4e4e4e4e4_full.jpg' },
    ]
  },
  {
    id: 'uf_line',
    name: 'gm_uf_line_v2',
    image: 'https://steamuserimages-a.akamaihd.net/ugc/1644340994747088936/A8B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8B8/',
    voters: [
      { id: 3, name: 'Юрий Свириденко', avatar: 'https://avatars.steamstatic.com/c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5_full.jpg' },
    ]
  },
  {
    id: 'kalinin',
    name: 'gm_metro_kalinin',
    image: 'https://steamuserimages-a.akamaihd.net/ugc/1644340994747088937/B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9B9/',
    voters: []
  },
];

const NEWS_DATA = [
  {
    id: 1,
    date: '4 декабря 2025',
    title: 'Сервер в активной разработке',
    excerpt: 'Работа над проектом кипит. Мы готовимся к открытию.',
    tag: 'Разработка',
    tagColor: 'bg-green-500',
    imageUrl: 'https://i.ibb.co/Pz5YV78w/wmremove-transformed-3.png',
    content: `Мы продолжаем активную работу над сервером Project SY в Garry's Mod.

На данный момент мы занимаемся настройкой игровой сборки, переносом необходимых ассетов и тестированием основных механик Metrostroi.

Следите за новостями в нашем Telegram чате, чтобы не пропустить дату открытия!`
  },
  {
    id: 2,
    date: '3 декабря 2025',
    title: 'Глобальный переезд в Garry\'s Mod',
    excerpt: 'В связи с блокировкой Roblox мы сменили платформу.',
    tag: 'Важное',
    tagColor: 'bg-red-500',
    imageUrl: 'https://i.ibb.co/QvRv01bH/Gemini-Generated-Image-lowwn6lowwn6loww-1.png',
    content: `В связи блокировки Roblox в России (РКН), мы переходим в тематику Garrys Mod (Metrostroi).

Наша текущая карта в Roblox будет перенесена в Garrys Mod, и карта будет опубликована в Steam Workshop.

Мы не хотим закрывать проект полностью, и из за этого решили сменить тематику.`
  },
];

// Треки для рандомного воспроизведения (без повторов пока все не проиграют)
const MUSIC_TRACKS = [
  "/MXZI, Deno - FAVELA [NCS Release].mp3",
  "/SpotiDownloader.com - NO BATIDÃO - Slowed - ZXKAI.flac",
  "/sumu - apart [NCS Release].mp3",
  "/Novulent - Scars (Official Instrumental).mp3",
  "/Katy Perry - Hot N Cold (Official Instrumental).mp3",
  "/Five Nights at Freddys 1 Song [ Instrumental ]  - The Living Tombstone.mp3",
];

const MouseLeftClick = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="7" stroke="currentColor" strokeWidth="2" />
    <path d="M12 2V10" stroke="currentColor" strokeWidth="2" />
    <path d="M5 10H19" stroke="currentColor" strokeWidth="2" />
    <path d="M5 9C5 5.13401 8.13401 2 12 2V10H5V9Z" fill="#007AFF" />
  </svg>
);

const GmodInterface: React.FC<GmodInterfaceProps> = ({ setPage }) => {
  const [mode, setMode] = useState<InterfaceMode>('menu');
  const [spawnFilter, setSpawnFilter] = useState<SpawnFilter>('all');
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [fps, setFps] = useState<number>(0);
  const [ping, setPing] = useState<number>(0);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [menuSelectedNews, setMenuSelectedNews] = useState<typeof NEWS_DATA[0] | null>(null);
  const [hoveredNews, setHoveredNews] = useState<number | null>(null); // 0 = первая новость, 1 = вторая

  // Map Vote State
  const [showMapVote, setShowMapVote] = useState(false);
  const [mapVoteTime, setMapVoteTime] = useState(300); // 5 минут в секундах
  const [selectedMap, setSelectedMap] = useState<string | null>(null); // Выбранная карта (до голосования)
  const [hasVoted, setHasVoted] = useState(false); // Проголосовал ли игрок
  const [hoveredVoter, setHoveredVoter] = useState<{ name: string; x: number; y: number } | null>(null);

  // Battle Pass State
  const [battlePassLevel, setBattlePassLevel] = useState(7);
  const [battlePassXP, setBattlePassXP] = useState(650);
  const [hasPremium, setHasPremium] = useState(false);
  const XP_PER_LEVEL = 1000;

  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: 'sleepus', rank: 'Главарь SY', ping: 5, avatar: 'red', countryCode: 'ru', geoInfo: 'Москва, Россия', statusText: 'Перегон: Физтех - Лианозово', steamId: 'STEAM_0:1:12345678' },
    { id: 2, name: '//usonance\\\\', rank: 'ЗамГлав SY', ping: 12, avatar: 'gray', countryCode: 'ru', geoInfo: 'Санкт-Петербург, Россия', statusText: 'На станции: Селигерская', steamId: 'STEAM_0:0:87654321' },
    { id: 3, name: 'Юрий Свириденко', rank: 'Метростроевец', ping: 34, avatar: 'blue', countryCode: 'by', geoInfo: 'Минск, Беларусь', statusText: 'Оборот: Тупик Физтеха', steamId: 'STEAM_0:1:11122233' },
    { id: 4, name: 'Гость', rank: 'Игрок', ping: 45, avatar: 'purple', countryCode: 'ua', geoInfo: 'Киев, Украина', statusText: 'Пассажир (Поезд: sleepus)', steamId: 'STEAM_0:0:99988877' },
  ]);

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, player: Player } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const playedTracksRef = useRef<string[]>([]); // Уже проигранные треки
  const currentTrackRef = useRef<string>("");
  const TARGET_VOLUME = 0.15;
  const FADE_IN_DURATION = 3000; // 3 секунды fade in

  // Получить рандомный трек (без повторов пока все не проиграют)
  const getRandomTrack = useCallback(() => {
    // Если все треки проиграны - сбрасываем список
    if (playedTracksRef.current.length >= MUSIC_TRACKS.length) {
      playedTracksRef.current = [];
    }

    // Доступные треки = все минус уже проигранные
    const available = MUSIC_TRACKS.filter(t => !playedTracksRef.current.includes(t));
    const randomIndex = Math.floor(Math.random() * available.length);
    const track = available[randomIndex] || MUSIC_TRACKS[0];

    // Добавляем в список проигранных
    playedTracksRef.current.push(track);

    return track;
  }, []);

  const playMusic = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Выбираем рандомный трек (без повторов)
    const track = getRandomTrack();
    currentTrackRef.current = track;
    audio.src = track;
    audio.volume = 0;
    audio.play().catch(() => { });

    // Fade in за 3 секунды
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    const step = TARGET_VOLUME / (FADE_IN_DURATION / 50);
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < TARGET_VOLUME) {
        audio.volume = Math.min(TARGET_VOLUME, audio.volume + step);
      } else {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
    }, 50);
  }, [getRandomTrack]);

  // Fade out перед концом трека и переключение на следующий рандомный
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const checkForFadeOut = () => {
      if (audio.duration && audio.currentTime > 0) {
        const timeLeft = audio.duration - audio.currentTime;
        // Начинаем fade out за 10 секунд до конца
        if (timeLeft <= 10 && timeLeft > 0 && audio.volume > 0) {
          const step = audio.volume / (timeLeft * 20);
          audio.volume = Math.max(0, audio.volume - step);
        }
      }
    };

    const handleEnded = () => {
      // Если все треки проиграны - сбрасываем список
      if (playedTracksRef.current.length >= MUSIC_TRACKS.length) {
        playedTracksRef.current = [];
      }

      // Выбираем следующий рандомный трек (без повторов)
      const available = MUSIC_TRACKS.filter(t => !playedTracksRef.current.includes(t));
      const nextTrack = available[Math.floor(Math.random() * available.length)] || MUSIC_TRACKS[0];
      playedTracksRef.current.push(nextTrack);
      currentTrackRef.current = nextTrack;

      audio.src = nextTrack;
      audio.volume = 0;
      audio.play().catch(() => { });

      // Fade in
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      const step = TARGET_VOLUME / (FADE_IN_DURATION / 50);
      fadeIntervalRef.current = setInterval(() => {
        if (audio.volume < TARGET_VOLUME) {
          audio.volume = Math.min(TARGET_VOLUME, audio.volume + step);
        } else {
          if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        }
      }, 50);
    };

    const timeUpdateInterval = setInterval(checkForFadeOut, 50);
    audio.addEventListener('ended', handleEnded);

    return () => {
      clearInterval(timeUpdateInterval);
      audio.removeEventListener('ended', handleEnded);
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    // @ts-ignore
    const isGMod = typeof window.DownloadingFile !== 'undefined' || typeof window.gmod !== 'undefined';
    const params = new URLSearchParams(window.location.search);
    const paramMode = params.get('gamemode');

    if (paramMode === 'loading') setMode('loading');
    else if (paramMode === 'connecting') setMode('connecting');
    else if (paramMode === 'ingame' || isGMod) {
      // В GMod сразу показываем connecting (спиннер → нажмите ЛКМ)
      setMode('connecting');
    }
    else setMode('menu');

    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [playMusic]);

  // Управление музыкой по режимам
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Играем музыку на экранах click_to_start, spawn_selection, battlepass
    if (mode === 'click_to_start' || mode === 'spawn_selection' || mode === 'battlepass') {
      if (audio.paused) {
        playMusic();
      }
    }
    // Останавливаем на других экранах
    else if (mode === 'ingame' || mode === 'menu' || mode === 'loading' || mode === 'queue') {
      if (!audio.paused) {
        // Быстрый fade out
        let vol = audio.volume;
        const fadeOut = setInterval(() => {
          vol -= 0.01;
          if (vol <= 0) {
            audio.volume = 0;
            audio.pause();
            clearInterval(fadeOut);
          } else {
            audio.volume = vol;
          }
        }, 50);
      }
    }
  }, [mode, playMusic]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow' }));
      setDate(now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Moscow' }));
    };
    const updateStats = () => {
      setFps(prev => prev === 0 ? Math.floor(Math.random() * 60 + 60) : prev);
      setPing(prev => prev === 0 ? Math.floor(Math.random() * 25 + 15) : prev);
    };
    updateTime(); updateStats();
    const t1 = setInterval(updateTime, 1000);
    const t2 = setInterval(updateStats, 2000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  // Map Vote Timer
  useEffect(() => {
    if (!showMapVote) return;
    const timer = setInterval(() => {
      setMapVoteTime(prev => {
        if (prev <= 0) {
          setShowMapVote(false);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showMapVote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') { e.preventDefault(); if (['menu', 'ingame', 'spawn_selection', 'click_to_start'].includes(mode)) setShowScoreboard(true); }
      if (e.key === 'Escape') { e.preventDefault(); if (mode === 'ingame') setMode('menu'); else if (mode === 'menu') setMode('ingame'); }
    };
    const handleKeyUp = (e: KeyboardEvent) => { if (e.key === 'Tab') { e.preventDefault(); setShowScoreboard(false); } };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => { window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); };
  }, [mode]);

  const onLoadingComplete = () => { setMode('connecting'); };
  const onConnectingComplete = () => { setMode('click_to_start'); };
  const onClickToStart = () => { playMusic(); setSpawnFilter('all'); setMode('spawn_selection'); };
  const onSpawnSelected = () => { setMode('ingame'); };

  return (
    <div className="fixed inset-0 w-full h-full font-sans select-none text-white bg-black overflow-hidden">
      <audio ref={audioRef} preload="auto" />

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${mode === 'menu' ? 'opacity-30' : 'opacity-0'}`} style={{ backgroundImage: `url('https://files.facepunch.com/garry/1083f274/2012-07-06_14-41-43.jpg')` }} />
        <video autoPlay muted loop playsInline className={`w-full h-full object-cover transition-all duration-1000 absolute inset-0 ${mode === 'menu' || mode === 'queue' || mode === 'connecting' ? 'opacity-0' : mode === 'loading' ? 'blur-xl scale-110 opacity-20' : mode === 'click_to_start' ? 'opacity-60' : mode === 'spawn_selection' ? 'blur-md scale-105 opacity-40' : 'opacity-100'}`} src="https://cdn.pixabay.com/video/2019/04/23/23011-332483109_large.mp4" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* === MENU === */}
      {mode === 'menu' && (
        <div className="absolute inset-0 z-10 animate-ios-slide-up overflow-hidden">
          <div className="h-full flex flex-col p-4 lg:p-6 max-w-[1400px] mx-auto w-full">

            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4 shrink-0">
              <div className="flex items-center gap-2">
                <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <div className="text-base font-bold text-white">Project SY</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider">Metrostroi NoRank</div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="bg-[#1C1C1E] rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-sm">
                  <Wifi size={14} className="text-green-500" />
                  <span className="text-white">{ping} ms</span>
                </div>
                <div className="bg-[#1C1C1E] rounded-lg px-3 py-1.5 flex items-center gap-1.5 text-sm">
                  <span className="text-brand-blue text-[10px] font-bold">FPS</span>
                  <span className="text-white">{fps}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex gap-4 min-h-0">

              {/* Left - Menu Buttons */}
              <div className="w-72 shrink-0 flex flex-col gap-2">
                <MenuButton icon={<Play size={20} fill="currentColor" />} label="Вернуться в игру" subLabel="ESC" active onClick={() => setMode('ingame')} />
                <MenuButton icon={<Settings size={20} />} label="Загрузка" subLabel="Демо" onClick={() => setMode('loading')} />
                <MenuButton icon={<Server size={20} />} label="Очередь" subLabel="Демо" onClick={() => setMode('queue')} />
                <MenuButton icon={<Trophy size={20} />} label="Боевой Пропуск" subLabel="Сезон 1" onClick={() => setMode('battlepass')} />
                <div className="flex-1" />
                <MenuButton icon={<LogOut size={20} />} label="Отключиться" subLabel="Выход" danger onClick={() => window.close()} />
              </div>

              {/* Center - News */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* Featured News */}
                {NEWS_DATA[0] && (
                  <div
                    onMouseEnter={() => setHoveredNews(0)}
                    onMouseLeave={() => setHoveredNews(null)}
                    style={{ flex: hoveredNews === 1 ? '0 0 100px' : '1 1 auto' }}
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-out"
                  >
                    <img src={NEWS_DATA[0].imageUrl} alt={NEWS_DATA[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-black/70" />
                    <div className="absolute inset-0 p-5 flex flex-col justify-end overflow-hidden">
                      {/* Tag + Date row */}
                      <div className="flex items-center gap-3 mb-2 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${NEWS_DATA[0].tagColor} text-white`}>{NEWS_DATA[0].tag}</span>
                        <span className="text-sm text-gray-400">{NEWS_DATA[0].date}</span>
                      </div>
                      {/* Title */}
                      <h3 className="font-bold text-white text-xl mb-3 group-hover:text-brand-blue transition-colors shrink-0 leading-tight">{NEWS_DATA[0].title}</h3>
                      {/* Blue separator line */}
                      {hoveredNews === 0 && <div className="w-12 h-1 bg-brand-blue rounded-full mb-3 shrink-0" />}
                      {/* Article content */}
                      <article className={`text-base text-gray-300 leading-relaxed whitespace-pre-line transition-all duration-300 overflow-hidden ${hoveredNews === 0 ? 'max-h-32' : 'max-h-10 line-clamp-2'}`}>
                        {hoveredNews === 0 ? NEWS_DATA[0].content : NEWS_DATA[0].excerpt}
                      </article>
                    </div>
                  </div>
                )}

                {/* Second News */}
                {NEWS_DATA[1] && (
                  <div
                    onMouseEnter={() => setHoveredNews(1)}
                    onMouseLeave={() => setHoveredNews(null)}
                    style={{ flex: hoveredNews === 1 ? '1 1 auto' : '0 0 100px' }}
                    className="bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer group relative transition-all duration-300 ease-out"
                  >
                    {/* Background Image */}
                    <img
                      src={NEWS_DATA[1].imageUrl}
                      alt={NEWS_DATA[1].title}
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-300"
                      style={{ opacity: hoveredNews === 1 ? 0.3 : 0 }}
                    />
                    <div className="absolute inset-0 bg-[#1C1C1E]/90 transition-opacity duration-300" style={{ opacity: hoveredNews === 1 ? 1 : 0 }} />

                    {/* Content */}
                    <div className="relative z-10 h-full flex">
                      {/* Thumbnail */}
                      <div
                        className="shrink-0 relative overflow-hidden transition-all duration-300"
                        style={{ width: hoveredNews === 1 ? 0 : 140, opacity: hoveredNews === 1 ? 0 : 1 }}
                      >
                        <img src={NEWS_DATA[1].imageUrl} alt={NEWS_DATA[1].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>

                      {/* Text Content */}
                      <div className={`flex-1 p-5 flex flex-col overflow-hidden transition-all duration-300 ${hoveredNews === 1 ? 'justify-start' : 'justify-center'}`}>
                        {/* Tag + Date row */}
                        <div className="flex items-center gap-3 mb-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${NEWS_DATA[1].tagColor} text-white`}>{NEWS_DATA[1].tag}</span>
                          <span className={`text-gray-400 ${hoveredNews === 1 ? 'text-sm' : 'text-[10px]'}`}>{NEWS_DATA[1].date}</span>
                        </div>
                        {/* Title */}
                        <h3 className={`font-bold text-white group-hover:text-brand-blue transition-colors shrink-0 leading-tight ${hoveredNews === 1 ? 'text-xl mb-3' : 'text-sm line-clamp-1'}`}>
                          {NEWS_DATA[1].title}
                        </h3>
                        {/* Blue separator line */}
                        {hoveredNews === 1 && <div className="w-12 h-1 bg-brand-blue rounded-full mb-3 shrink-0" />}
                        {/* Article content */}
                        <article className={`text-gray-300 leading-relaxed whitespace-pre-line transition-all duration-300 overflow-hidden ${hoveredNews === 1 ? 'text-base max-h-32' : 'text-xs max-h-4 line-clamp-1 mt-1 text-gray-500'}`}>
                          {hoveredNews === 1 ? NEWS_DATA[1].content : NEWS_DATA[1].excerpt}
                        </article>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Profile & Map */}
              <div className="w-56 shrink-0 flex flex-col gap-3">
                {/* Profile */}
                <div className="bg-[#1C1C1E] rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2C2C2E] flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm">Гость</div>
                      <div className="text-[10px] text-brand-blue">Игрок</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between"><span className="text-gray-500">Ранг</span><span className="text-white">Новичок</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Баланс</span><span className="text-white">0 ₽</span></div>
                    <div className="flex justify-between"><span className="text-gray-500">Время</span><span className="text-white">0.0 ч</span></div>
                  </div>
                </div>

                {/* Map */}
                <div className="flex-1 bg-[#1C1C1E] rounded-2xl p-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://files.facepunch.com/garry/1083f274/2012-07-06_14-41-43.jpg')] bg-cover bg-center opacity-20" />
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-8 h-8 rounded-lg bg-brand-blue/20 flex items-center justify-center">
                        <Map size={14} className="text-brand-blue" />
                      </div>
                      <span className="px-2 py-0.5 bg-green-500 rounded text-[9px] font-bold text-black">Активно</span>
                    </div>
                    <div className="font-bold text-white text-sm">gm_metro_mrl_v3</div>
                    <div className="text-[10px] text-gray-500">Карта Метростроя</div>
                    <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 text-[10px]">
                      <Users size={10} className="text-gray-500" />
                      <span className="text-gray-400">Онлайн:</span>
                      <span className="text-white font-medium">24/60</span>
                    </div>
                    <div className="mt-auto pt-2">
                      <button
                        onClick={() => setShowMapVote(true)}
                        className="w-full py-2 rounded-lg bg-brand-blue/20 hover:bg-brand-blue text-brand-blue hover:text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                      >
                        <Clock size={12} />
                        Голосование за карту
                      </button>
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="bg-[#1C1C1E] rounded-2xl p-4 text-center">
                  <div className="text-gray-500 text-[10px] uppercase tracking-wider">{date}</div>
                  <div className="text-2xl font-light text-white">{time}</div>
                </div>
              </div>
            </div>
          </div>

          {/* News Modal */}
          {menuSelectedNews && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setMenuSelectedNews(null)}>
              <div className="w-full max-w-xl bg-[#1C1C1E] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="h-48 relative">
                  <img src={menuSelectedNews.imageUrl} alt={menuSelectedNews.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50" />
                  <button onClick={() => setMenuSelectedNews(null)} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/50 flex items-center justify-center text-white hover:bg-white/20 transition-colors">✕</button>
                </div>
                <div className="p-6">
                  <div className="text-gray-500 text-sm mb-2">{menuSelectedNews.date}</div>
                  <h2 className="text-xl font-bold text-white mb-3">{menuSelectedNews.title}</h2>
                  <p className="text-gray-400 leading-relaxed">{menuSelectedNews.content}</p>
                </div>
              </div>
            </div>
          )}

          {/* Map Vote Modal */}
          {showMapVote && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowMapVote(false)}>
              <div className="w-full max-w-2xl bg-[#1C1C1E] rounded-[28px] overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="p-6 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center">
                        <Map size={20} className="text-brand-blue" />
                      </div>
                      <h2 className="text-2xl font-bold text-white">Голосование</h2>
                    </div>
                    <p className="text-gray-500 text-sm ml-[52px]">Выберите следующую карту</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-500/10 rounded-xl px-4 py-2.5 flex items-center gap-2">
                      <Clock size={18} className="text-yellow-500" />
                      <span className="text-yellow-500 font-bold tabular-nums">{Math.floor(mapVoteTime / 60)}:{(mapVoteTime % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <button onClick={() => setShowMapVote(false)} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors">✕</button>
                  </div>
                </div>

                {/* Maps */}
                <div className="px-6 pb-6 space-y-3">
                  {VOTE_MAPS.map((map) => {
                    const isSelected = selectedMap === map.id;
                    return (
                      <div
                        key={map.id}
                        onClick={() => !hasVoted && setSelectedMap(map.id)}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${hasVoted ? 'cursor-default opacity-70' : 'cursor-pointer'} ${isSelected ? 'bg-brand-blue' : 'bg-[#2C2C2E]'} ${!hasVoted && !isSelected ? 'hover:bg-[#3C3C3E]' : ''}`}
                      >
                        {/* Map Preview */}
                        <div className="w-24 h-16 rounded-xl overflow-hidden bg-[#1C1C1E] shrink-0 relative">
                          <img src={map.image} alt={map.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>

                        {/* Map Info */}
                        <div className="flex-1 min-w-0">
                          <div className={`font-bold truncate ${isSelected ? 'text-white' : 'text-white'}`}>{map.name}</div>
                          <div className={`text-sm ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>{map.voters.length} голосов</div>
                        </div>

                        {/* Voters Avatars */}
                        <div className="flex items-center -space-x-2">
                          {map.voters.slice(0, 5).map((voter) => (
                            <div
                              key={voter.id}
                              onMouseMove={(e) => setHoveredVoter({ name: voter.name, x: e.clientX, y: e.clientY })}
                              onMouseLeave={() => setHoveredVoter(null)}
                            >
                              <img
                                src={voter.avatar}
                                alt={voter.name}
                                className={`w-8 h-8 rounded-full border-2 hover:scale-110 hover:z-10 transition-transform ${isSelected ? 'border-brand-blue' : 'border-[#2C2C2E]'}`}
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(voter.name)}&background=2C2C2E&color=fff&size=64`; }}
                              />
                            </div>
                          ))}
                          {map.voters.length > 5 && (
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isSelected ? 'border-brand-blue bg-white/20 text-white' : 'border-[#2C2C2E] bg-[#1C1C1E] text-gray-400'}`}>
                              +{map.voters.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex justify-between items-center">
                  <div className="text-gray-500 text-sm">
                    {hasVoted ? '' : (selectedMap ? 'Карта выбрана' : 'Выберите карту')}
                  </div>
                  <button
                    onClick={() => {
                      if (hasVoted) {
                        setShowMapVote(false);
                      } else if (selectedMap) {
                        setHasVoted(true);
                      }
                    }}
                    disabled={!selectedMap && !hasVoted}
                    className={`h-11 px-6 rounded-xl font-semibold transition-colors ${hasVoted
                        ? 'bg-gray-600 text-gray-300 cursor-default'
                        : selectedMap
                          ? 'bg-brand-blue hover:bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    {hasVoted ? 'Голос отдан' : 'Голосовать'}
                  </button>
                </div>
              </div>

              {/* Floating Tooltip for Voter Name */}
              {hoveredVoter && (
                <div
                  className="fixed z-[100] bg-black/90 text-white text-sm px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap"
                  style={{ left: hoveredVoter.x + 15, top: hoveredVoter.y - 10 }}
                >
                  {hoveredVoter.name}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* === CLICK TO START === */}
      {mode === 'click_to_start' && (
        <div onClick={onClickToStart} className="absolute inset-0 z-50 cursor-pointer flex items-center justify-center animate-ios-slide-up">
          {/* Top Right Logo */}
          <div className="absolute top-8 right-8 flex items-center gap-4 bg-[#1C1C1E] rounded-2xl px-5 py-3">
            <div className="text-right">
              <div className="text-xl font-bold text-white">Project SY</div>
              <div className="text-xs text-brand-blue font-medium uppercase tracking-wider">Metrostroi NoRank</div>
            </div>
            <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-12 h-12 rounded-xl object-cover" />
          </div>

          {/* Center Content */}
          <div className="text-center group">
            <div className="w-24 h-24 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#2C2C2E] transition-colors">
              <MouseLeftClick size={48} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-3">Нажмите ЛКМ</h1>
            <p className="text-brand-blue font-medium uppercase tracking-widest">Чтобы начать игру</p>
          </div>
        </div>
      )}

      {/* === SPAWN SELECTION === */}
      {mode === 'spawn_selection' && (
        <div className="absolute inset-0 z-40 animate-ios-slide-up flex items-center justify-center p-6">
          {/* Top Bar */}
          <div className="absolute top-6 left-6 flex items-center gap-3">
            <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-10 h-10 rounded-xl object-cover" />
            <div>
              <div className="font-bold text-white">Project SY</div>
              <div className="text-xs text-gray-500">Metrostroi</div>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex gap-3">
            <div className="bg-[#1C1C1E] rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
              <Wifi size={14} className="text-green-500" /><span className="text-white">{ping} ms</span>
            </div>
            <div className="bg-[#1C1C1E] rounded-xl px-4 py-2 text-sm text-white">FPS {fps}</div>
          </div>

          <div className="absolute bottom-6 right-6 text-right">
            <div className="text-gray-500 text-sm">{date}</div>
            <div className="text-3xl font-light text-white">{time}</div>
          </div>

          {/* Spawn Modal */}
          <div className="w-full max-w-lg bg-[#1C1C1E] rounded-2xl p-6 max-h-[80vh] flex flex-col">
            <div className="text-center mb-5">
              <h2 className="text-2xl font-bold text-white mb-1">Выберите спавн</h2>
              <p className="text-gray-500 text-sm">Выберите место для появления на карте</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-4 bg-[#2C2C2E] rounded-xl p-1">
              {[
                { key: 'all', label: 'Все', icon: null },
                { key: 'driver', label: 'Машинист', icon: <Briefcase size={14} /> },
                { key: 'passenger', label: 'Пассажир', icon: <User size={14} /> },
              ].map(f => (
                <button key={f.key} onClick={() => setSpawnFilter(f.key as SpawnFilter)} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${spawnFilter === f.key ? (f.key === 'passenger' ? 'bg-green-500 text-white' : 'bg-brand-blue text-white') : 'text-gray-400 hover:text-white'}`}>
                  {f.icon}{f.label}
                </button>
              ))}
            </div>

            {/* Spawn List */}
            <div className="flex-1 overflow-y-auto space-y-2">
              {SPAWN_POINTS.filter(sp => spawnFilter === 'all' || sp.type === spawnFilter).map(sp => (
                <button key={sp.id} onClick={onSpawnSelected} className="w-full flex items-center gap-4 p-4 bg-[#2C2C2E] hover:bg-brand-blue rounded-xl transition-all group text-left">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${sp.type === 'driver' ? 'bg-brand-blue/20 text-brand-blue' : 'bg-green-500/20 text-green-500'} group-hover:bg-white/20 group-hover:text-white transition-colors`}>{sp.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-white">{sp.title}</div>
                    <div className="text-sm text-gray-500 group-hover:text-white/70">{sp.desc}</div>
                  </div>
                  <ChevronRight size={18} className="text-gray-600 group-hover:text-white" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === BATTLE PASS === */}
      {mode === 'battlepass' && (
        <div className="absolute inset-0 z-40 bg-black animate-ios-slide-up flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center p-6 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setMode('menu')} className="w-10 h-10 rounded-xl bg-[#1C1C1E] hover:bg-[#2C2C2E] flex items-center justify-center text-white transition-colors">
                <ChevronRight size={20} className="rotate-180" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Trophy size={24} className="text-yellow-500" />
                  Боевой Пропуск
                </h1>
                <p className="text-gray-500 text-sm">Сезон 1 • Заканчивается через 28 дней</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!hasPremium ? (
                <button onClick={() => setHasPremium(true)} className="px-5 py-2.5 rounded-xl bg-yellow-500 text-black font-bold text-sm hover:bg-yellow-400 transition-colors">
                  Купить Premium — 299 ₽
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-yellow-500/20 text-yellow-500 font-bold text-sm flex items-center gap-2">
                  <Trophy size={16} /> Premium активен
                </div>
              )}
            </div>
          </div>

          {/* Level Progress Bar */}
          <div className="px-6 pb-4 shrink-0">
            <div className="bg-[#1C1C1E] rounded-2xl p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-bold">{battlePassLevel}</div>
                  <div>
                    <div className="text-white font-bold text-sm">Уровень {battlePassLevel}</div>
                    <div className="text-gray-500 text-xs">{battlePassXP} / {XP_PER_LEVEL} XP</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setBattlePassXP(prev => Math.min(prev + 100, XP_PER_LEVEL))} className="px-3 py-1.5 rounded-lg bg-[#2C2C2E] hover:bg-[#3C3C3E] text-white text-xs transition-colors">+100 XP</button>
                  <button onClick={() => { setBattlePassLevel(prev => Math.min(prev + 1, 15)); setBattlePassXP(0); }} className="px-3 py-1.5 rounded-lg bg-brand-blue hover:bg-blue-600 text-white text-xs transition-colors">+1 LVL</button>
                </div>
              </div>
              <div className="h-2 bg-[#2C2C2E] rounded-full overflow-hidden">
                <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${(battlePassXP / XP_PER_LEVEL) * 100}%` }} />
              </div>
            </div>
          </div>

          {/* Rewards Track - Horizontal Scroll with Mouse Wheel */}
          <div className="flex-1 px-6 pb-6 overflow-hidden">
            <div
              className="h-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-[#2C2C2E] scrollbar-track-transparent"
              onWheel={(e) => {
                e.currentTarget.scrollLeft += e.deltaY;
              }}
            >
              <div className="flex gap-4 h-full py-2" style={{ minWidth: 'max-content' }}>
                {BATTLEPASS_LEVELS.map((lvl, idx) => {
                  const isUnlocked = battlePassLevel >= lvl.level;
                  const isCurrent = battlePassLevel === lvl.level;

                  return (
                    <div key={lvl.level} className="flex flex-col items-center gap-2 relative">
                      {/* Level Number */}
                      <div className={`text-sm font-bold ${isCurrent ? 'text-brand-blue' : isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                        {lvl.level}
                      </div>

                      {/* FREE Reward (Top) */}
                      <div className={`w-24 h-28 rounded-xl p-3 flex flex-col items-center justify-center transition-all ${isCurrent ? 'bg-brand-blue ring-2 ring-brand-blue ring-offset-2 ring-offset-black' :
                          isUnlocked ? 'bg-[#1C1C1E]' : 'bg-[#1C1C1E]/50'
                        }`}>
                        <div className="text-[10px] text-gray-400 font-medium mb-1 uppercase">Free</div>
                        <div className={`text-2xl mb-1 ${!isUnlocked && 'grayscale opacity-50'}`}>{lvl.free.icon}</div>
                        <div className={`text-[10px] text-center leading-tight ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{lvl.free.name}</div>
                        {isUnlocked && <div className="text-[8px] text-green-500 font-bold mt-1">✓</div>}
                        {!isUnlocked && <Lock size={10} className="text-gray-600 mt-1" />}
                      </div>

                      {/* Progress Line */}
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${isUnlocked ? 'bg-brand-blue' : 'bg-[#2C2C2E]'}`} />
                        {idx < BATTLEPASS_LEVELS.length - 1 && (
                          <div className={`w-[76px] h-1 ${battlePassLevel > lvl.level ? 'bg-brand-blue' : 'bg-[#2C2C2E]'}`} />
                        )}
                      </div>

                      {/* PREMIUM Reward (Bottom) */}
                      <div className={`w-24 h-28 rounded-xl p-3 flex flex-col items-center justify-center transition-all relative ${isCurrent && hasPremium ? 'bg-yellow-500/30 ring-2 ring-yellow-500 ring-offset-2 ring-offset-black' :
                          isUnlocked && hasPremium ? 'bg-yellow-500/20' :
                            'bg-[#1C1C1E]/50'
                        }`}>
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center">
                          <Trophy size={10} className="text-black" />
                        </div>
                        <div className="text-[10px] text-yellow-500 font-medium mb-1 uppercase">Premium</div>
                        <div className={`text-2xl mb-1 ${(!isUnlocked || !hasPremium) && 'grayscale opacity-50'}`}>{lvl.premium.icon}</div>
                        <div className={`text-[10px] text-center leading-tight ${isUnlocked && hasPremium ? 'text-white' : 'text-gray-500'}`}>{lvl.premium.name}</div>
                        {isUnlocked && hasPremium && <div className="text-[8px] text-green-500 font-bold mt-1">✓</div>}
                        {(!isUnlocked || !hasPremium) && <Lock size={10} className="text-gray-600 mt-1" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Hint */}
          <div className="px-6 pb-4 text-center text-gray-600 text-xs shrink-0">
            Используйте колёсико мыши для прокрутки • Играйте на сервере чтобы получать XP
          </div>
        </div>
      )}

      {/* === LOADING === */}
      {mode === 'loading' && <LoadingScreen onComplete={onLoadingComplete} />}

      {/* === CONNECTING (после загрузки, перед click_to_start) === */}
      {mode === 'connecting' && <ConnectingScreen onComplete={onConnectingComplete} />}

      {/* === QUEUE === */}
      {mode === 'queue' && <QueueScreen onComplete={() => setMode('loading')} />}

      {/* === SCOREBOARD === */}
      {(showScoreboard || mode === 'ingame') && !['loading', 'queue', 'menu', 'click_to_start', 'spawn_selection'].includes(mode) && (
        <Scoreboard visible={true} players={players} onOpenContextMenu={(e, p) => setContextMenu({ x: e.clientX, y: e.clientY, player: p })} />
      )}
      {showScoreboard && ['menu', 'click_to_start', 'spawn_selection'].includes(mode) && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-md animate-fade-in">
          <Scoreboard visible={true} players={players} onOpenContextMenu={(e, p) => setContextMenu({ x: e.clientX, y: e.clientY, player: p })} />
        </div>
      )}

      {/* === CONTEXT MENU === */}
      {contextMenu && (
        <div className="fixed z-[100] bg-[#1C1C1E] border border-white/10 rounded-xl shadow-2xl p-1 w-56" style={{ top: contextMenu.y, left: contextMenu.x }} onClick={e => e.stopPropagation()}>
          <div className="px-3 py-2 border-b border-white/5 mb-1">
            <div className="font-bold text-white">{contextMenu.player.name}</div>
            <div className="text-xs text-gray-500 font-mono">{contextMenu.player.steamId}</div>
          </div>
          <ContextMenuItem icon={<User size={16} />} label="Профиль Steam" />
          <ContextMenuItem icon={<Copy size={16} />} label="Копировать SteamID" />
          <ContextMenuItem icon={<MessageCircle size={16} />} label="Отправить сообщение" />
          <div className="h-px bg-white/5 my-1" />
          <ContextMenuItem icon={<MicOff size={16} />} label="Заглушить" danger />
        </div>
      )}
    </div>
  );
};

const ContextMenuItem: React.FC<{ icon: React.ReactNode; label: string; danger?: boolean }> = ({ icon, label, danger }) => (
  <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${danger ? 'text-gray-400 hover:bg-red-500/10 hover:text-red-500' : 'text-white hover:bg-white/10'}`}>
    {icon}{label}
  </button>
);


const MenuButton: React.FC<{ icon: React.ReactNode; label: string; subLabel: string; active?: boolean; danger?: boolean; disabled?: boolean; onClick: () => void }> = ({ icon, label, subLabel, active, danger, disabled, onClick }) => (
  <button
    onClick={disabled ? undefined : onClick}
    disabled={disabled}
    className={`w-full p-4 rounded-2xl flex items-center gap-4 transition-all text-left ${disabled ? 'bg-[#1C1C1E]/50 text-gray-600 cursor-not-allowed' :
        active ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' :
          danger ? 'bg-[#1C1C1E] text-red-500 hover:bg-red-500 hover:text-white' :
            'bg-[#1C1C1E] text-gray-400 hover:bg-[#2C2C2E] hover:text-white'
      }`}
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${disabled ? 'bg-white/5' : active ? 'bg-white/20' : danger ? 'bg-red-500/20' : 'bg-white/5'}`}>{icon}</div>
    <div className="flex-1">
      <div className="font-bold text-lg">{label}</div>
      <div className={`text-xs ${active ? 'text-blue-200' : 'text-gray-500'}`}>{subLabel}</div>
    </div>
    {disabled && <Lock size={18} className="text-gray-600" />}
  </button>
);

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Подключение к серверу");
  const [selectedNews, setSelectedNews] = useState<typeof NEWS_DATA[0] | null>(null);

  useEffect(() => {
    // @ts-ignore
    window.DownloadingFile = () => { setStatus("Загрузка игры"); };
    // @ts-ignore
    window.SetStatus = (s: string) => { setStatus(s.includes("Sending") || s.includes("Getting") ? "Подключение к серверу" : "Загрузка игры"); };

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); setTimeout(onComplete, 500); return 100; }
        const next = prev + 0.5;
        setStatus(next < 20 ? "Подключение к серверу" : "Загрузка игры");
        return next;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl animate-ios-slide-up">
      <style>{`@keyframes slide-bar { 0% { left: -40%; width: 30%; } 50% { width: 50%; } 100% { left: 100%; width: 30%; } }`}</style>
      <div className="h-full flex items-center justify-center gap-8 px-8">
        {/* Left News */}
        <NewsCard news={NEWS_DATA[0]} onClick={() => setSelectedNews(NEWS_DATA[0])} className="hidden lg:flex" />

        {/* Center */}
        <div className="flex flex-col items-center">
          <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-20 h-20 rounded-2xl mb-4" />
          <h1 className="text-2xl font-bold text-white mb-1">Project SY</h1>
          <p className="text-brand-blue text-sm font-medium uppercase tracking-widest mb-8">Metrostroi NoRank</p>

          <div className="w-80">
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">{progress < 20 ? "Подключение..." : "Загрузка..."}</span>
              <span className="text-gray-500">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-[#2C2C2E] rounded-full overflow-hidden relative">
              {progress < 20 ? (
                <div className="absolute inset-y-0 bg-brand-blue rounded-full" style={{ animation: 'slide-bar 1.5s infinite linear' }} />
              ) : (
                <div className="h-full bg-brand-blue rounded-full transition-all" style={{ width: `${progress}%` }} />
              )}
            </div>
            <div className="text-center text-gray-500 text-sm mt-2">{status}</div>
          </div>
        </div>

        {/* Right News */}
        <NewsCard news={NEWS_DATA[1]} onClick={() => setSelectedNews(NEWS_DATA[1])} className="hidden lg:flex" />
      </div>

      {/* News Modal */}
      {selectedNews && <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </div>
  );
};

const ConnectingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [showClickPrompt, setShowClickPrompt] = useState(false);

  useEffect(() => {
    // Показываем спиннер 3 секунды, потом плавно появляется "Нажмите ЛКМ"
    const timer = setTimeout(() => {
      setShowClickPrompt(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (showClickPrompt) {
      onComplete();
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
      onClick={handleClick}
    >
      {/* Спиннер справа внизу */}
      <div className={`absolute bottom-8 right-8 transition-opacity duration-500 ${showClickPrompt ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-white/30 border-t-brand-blue rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Загрузка...</span>
        </div>
      </div>

      {/* Нажмите ЛКМ - появляется плавно */}
      <div className={`text-center transition-all duration-700 ${showClickPrompt ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="w-20 h-20 rounded-2xl bg-[#1C1C1E] flex items-center justify-center mx-auto mb-6">
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="2" width="14" height="20" rx="7" stroke="white" strokeWidth="2" />
            <path d="M12 2V10" stroke="white" strokeWidth="2" />
            <path d="M5 10H19" stroke="white" strokeWidth="2" />
            <path d="M5 9C5 5.13401 8.13401 2 12 2V10H5V9Z" fill="#007AFF" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">Нажмите ЛКМ</h1>
        <p className="text-brand-blue font-medium uppercase tracking-widest">Чтобы начать игру</p>
      </div>
    </div>
  );
};

const QueueScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [selectedNews, setSelectedNews] = useState<typeof NEWS_DATA[0] | null>(null);
  const [queuePosition, setQueuePosition] = useState(3);

  useEffect(() => {
    // Таймер на 1 минуту (внутренний, не показываем)
    const timer = setTimeout(() => {
      onComplete();
    }, 60000);

    // Уменьшаем позицию в очереди каждые 20 секунд
    const positionTimer = setInterval(() => {
      setQueuePosition(prev => Math.max(1, prev - 1));
    }, 20000);

    return () => {
      clearTimeout(timer);
      clearInterval(positionTimer);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-black animate-ios-slide-up">
      <style>{`@keyframes slide-bar { 0% { left: -40%; width: 30%; } 50% { width: 50%; } 100% { left: 100%; width: 30%; } }`}</style>
      <div className="h-full flex items-center justify-center gap-8 px-8">
        <NewsCard news={NEWS_DATA[0]} onClick={() => setSelectedNews(NEWS_DATA[0])} className="hidden lg:flex" />

        <div className="flex flex-col items-center">
          <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-20 h-20 rounded-2xl mb-4" />
          <h1 className="text-2xl font-bold text-white mb-1">Project SY</h1>
          <p className="text-brand-blue text-sm font-medium uppercase tracking-widest mb-8">Metrostroi NoRank</p>

          <div className="w-80">
            <div className="flex justify-between mb-2">
              <span className="text-white font-medium">Сервер переполнен</span>
              <span className="text-brand-blue font-bold">Очередь: {queuePosition}</span>
            </div>
            <div className="h-2 bg-[#2C2C2E] rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 bg-brand-blue rounded-full" style={{ animation: 'slide-bar 1.5s infinite linear' }} />
            </div>
            <div className="text-center text-gray-500 text-sm mt-2">Пожалуйста, подождите...</div>
          </div>
        </div>

        <NewsCard news={NEWS_DATA[1]} onClick={() => setSelectedNews(NEWS_DATA[1])} className="hidden lg:flex" />
      </div>

      {selectedNews && <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />}
    </div>
  );
};

const NewsCard: React.FC<{ news: typeof NEWS_DATA[0]; onClick: () => void; className?: string }> = ({ news, onClick, className = "" }) => (
  <div onClick={onClick} className={`w-72 bg-[#1C1C1E] rounded-2xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all flex-col ${className}`}>
    <div className="h-40 relative overflow-hidden">
      <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute inset-0 bg-black/50" />
      <span className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-xs font-bold ${news.tagColor} text-white`}>{news.tag}</span>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-white mb-1 group-hover:text-brand-blue transition-colors">{news.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-2">{news.excerpt}</p>
      <div className="text-gray-600 text-xs">{news.date}</div>
    </div>
  </div>
);

const NewsModal: React.FC<{ news: typeof NEWS_DATA[0]; onClose: () => void }> = ({ news, onClose }) => (
  <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={onClose}>
    <div className="w-full max-w-xl bg-[#1C1C1E] rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
      <div className="h-48 relative">
        <img src={news.imageUrl} alt={news.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
        <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-xl bg-black/50 flex items-center justify-center text-white hover:bg-white/20">✕</button>
      </div>
      <div className="p-6">
        <div className="text-gray-500 text-sm mb-2">{news.date}</div>
        <h2 className="text-xl font-bold text-white mb-3">{news.title}</h2>
        <p className="text-gray-400 leading-relaxed">{news.content}</p>
      </div>
    </div>
  </div>
);


const Scoreboard: React.FC<{ visible: boolean; players: Player[]; onOpenContextMenu?: (e: React.MouseEvent, p: Player) => void }> = ({ visible, players, onOpenContextMenu }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-40 p-8 pointer-events-none">
      <div className="w-full max-w-5xl bg-[#1C1C1E]/95 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden flex flex-col max-h-[85vh] pointer-events-auto animate-ios-slide-up">
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-[#2C2C2E]/50">
          <div className="flex items-center gap-4">
            <img src="https://i.ibb.co/Xf2nNn4H/photo-2025-12-03-19-30-54.jpg" alt="Logo" className="w-14 h-14 rounded-xl" />
            <div>
              <h1 className="text-2xl font-bold text-white">Project SY</h1>
              <div className="flex items-center gap-3 text-gray-500 text-sm">
                <span className="flex items-center gap-1"><Map size={14} /> gm_metro_mrl_v3</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Users size={14} /> {players.length} / 60</span>
              </div>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-xl font-bold text-white">ProjectSY: Metrostroi</div>
            <div className="text-brand-blue text-sm font-medium">NoRank Server</div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 px-6 py-3 bg-[#2C2C2E]/30 text-xs font-medium text-gray-500 uppercase tracking-wider gap-4">
          <div className="col-span-1 text-center">Флаг</div>
          <div className="col-span-4">Игрок</div>
          <div className="col-span-2">Ранг</div>
          <div className="col-span-4">Статус</div>
          <div className="col-span-1 text-right">Ping</div>
        </div>

        {/* Players List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {players.map(p => (
            <div key={p.id} onContextMenu={e => { e.preventDefault(); onOpenContextMenu?.(e, p); }} className="grid grid-cols-12 items-center px-4 py-3 bg-[#2C2C2E]/40 rounded-xl hover:bg-white/5 transition-colors gap-4 cursor-context-menu">
              <div className="col-span-1 flex justify-center relative group">
                <img src={`https://flagcdn.com/w40/${p.countryCode}.png`} alt={p.countryCode} className="w-6 h-auto rounded-sm" />
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black px-3 py-1 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">{p.geoInfo}</div>
              </div>
              <div className="col-span-4 flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${p.avatar === 'red' ? 'bg-red-500' : p.avatar === 'blue' ? 'bg-blue-500' : p.avatar === 'green' ? 'bg-green-500' : 'bg-zinc-500'}`} />
                <span className="font-medium text-white truncate">{p.name}</span>
              </div>
              <div className="col-span-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${p.rank.includes('Главарь') ? 'bg-red-500/20 text-red-500' : p.rank.includes('Метро') ? 'bg-blue-500/20 text-blue-500' : 'bg-gray-500/20 text-gray-400'}`}>{p.rank}</span>
              </div>
              <div className="col-span-4 text-gray-400 text-sm truncate">{p.statusText}</div>
              <div className="col-span-1 text-right">
                <span className={`font-medium ${p.ping < 50 ? 'text-green-500' : 'text-yellow-500'}`}>{p.ping}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 text-center text-gray-600 text-xs uppercase tracking-wider">ПКМ - Меню игрока • Удерживайте TAB для просмотра</div>
      </div>
    </div>
  );
};

export default GmodInterface;
