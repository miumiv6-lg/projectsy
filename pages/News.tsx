import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Share, Loader2, Clock, ArrowRight, Eye, Heart, Copy, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { newsApi, NewsArticle } from '../api';

// Removed - using global background

const ProgressiveImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-white/[0.04] ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <Loader2 className="w-6 h-6 text-white/30 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`relative z-10 w-full h-full object-cover transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

// Liquid Glass Card
const GlassCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = "", onClick }) => (
  <div
    onClick={onClick}
    className={`
      relative overflow-hidden
      bg-white/[0.04] backdrop-blur-2xl
      border border-white/[0.08]
      hover:bg-white/[0.06] hover:border-white/[0.12]
      transition-all duration-300
      ${onClick ? 'cursor-pointer active:scale-[0.99]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
);

const News: React.FC = () => {
  const { isAuthenticated, openLoginModal } = useAuth();
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsApi.getAll();
      setArticles(data);
    } catch (err) {
      console.error('Failed to load news:', err);
    } finally {
      setLoading(false);
    }
  };

  const openArticle = async (article: NewsArticle) => {
    try {
      const data = await newsApi.get(article.id);
      setSelectedArticle(data);
      setArticles(prev => prev.map(a => a.id === data.id ? data : a));
      window.history.pushState({}, '', `/news/${article.id}`);
    } catch {
      setSelectedArticle(article);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
    window.history.pushState({}, '', '/news');
  };

  const handleLike = async () => {
    if (!selectedArticle) return;
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    setLiking(true);
    try {
      const { liked } = await newsApi.toggleLike(selectedArticle.id);
      const updated = {
        ...selectedArticle,
        isLiked: liked,
        likes: liked ? selectedArticle.likes + 1 : selectedArticle.likes - 1,
      };
      setSelectedArticle(updated);
      setArticles(prev => prev.map(a => a.id === updated.id ? updated : a));
    } catch (err) {
      console.error('Failed to like:', err);
    } finally {
      setLiking(false);
    }
  };

  const copyLink = () => {
    if (!selectedArticle) return;
    const url = `${window.location.origin}/news/${selectedArticle.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToTelegram = () => {
    if (!selectedArticle) return;
    const url = `${window.location.origin}/news/${selectedArticle.id}`;
    const text = encodeURIComponent(selectedArticle.title);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${text}`, '_blank');
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
      </div>
    );
  }

  // === VIEW ARTICLE ===
  if (selectedArticle) {
    return (
      <div className="relative min-h-screen w-full">

        <div className="relative z-10 w-full px-4 max-w-4xl mx-auto pb-20 pt-4 animate-ios-slide-up">
          <button
            onClick={closeArticle}
            className="group flex items-center gap-2 text-white/70 hover:text-white py-6 transition-colors"
          >
            <div className="p-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 group-hover:bg-white/10 transition-all">
              <ChevronLeft size={20} />
            </div>
            <span className="font-medium tracking-wide">Назад к новостям</span>
          </button>

          <GlassCard className="rounded-[40px]">
            {selectedArticle.imageUrl && (
              <div className="w-full aspect-[21/9] relative">
                <ProgressiveImage src={selectedArticle.imageUrl} alt={selectedArticle.title} />
                <div className="absolute inset-0 bg-black/60" />
                {selectedArticle.tag && (
                  <div className="absolute top-6 left-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold tracking-wider uppercase shadow-lg">
                      {selectedArticle.tag}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="p-8 md:p-12 relative -mt-20">
              <div className="flex items-center gap-6 text-white/60 text-sm mb-6 flex-wrap backdrop-blur-md bg-black/20 rounded-2xl px-6 py-3 w-fit border border-white/5">
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-blue-400" />
                  {formatDate(selectedArticle.createdAt)}
                </span>
                {selectedArticle.readTime && (
                  <span className="flex items-center gap-2">
                    <Clock size={14} className="text-purple-400" />
                    {selectedArticle.readTime}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Eye size={14} className="text-cyan-400" />
                  {selectedArticle.views}
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight drop-shadow-sm">
                {selectedArticle.title}
              </h1>

              <article className="text-white/80 text-lg md:text-xl leading-relaxed whitespace-pre-line font-light tracking-wide">
                {selectedArticle.content}
              </article>

              <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between flex-wrap gap-4">
                <button
                  onClick={handleLike}
                  disabled={liking}
                  className={`flex items-center gap-3 px-6 py-4 rounded-3xl transition-all duration-300 font-medium tracking-wide backdrop-blur-xl border ${selectedArticle.isLiked
                    ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]'
                    : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                >
                  {liking ? (
                    <Loader2 size={22} className="animate-spin" />
                  ) : (
                    <Heart size={22} fill={selectedArticle.isLiked ? 'currentColor' : 'none'} />
                  )}
                  <span className="text-lg">{selectedArticle.likes}</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={shareToTelegram}
                    className="w-14 h-14 rounded-full bg-[#0088cc]/20 backdrop-blur-xl border border-[#0088cc]/30 flex items-center justify-center transition-all hover:bg-[#0088cc]/30 hover:scale-110 hover:shadow-[0_0_20px_-5px_rgba(0,136,204,0.5)]"
                    title="Telegram"
                  >
                    <img src="https://img.icons8.com/?size=100&id=lUktdBVdL4Kb&format=png&color=FFFFFF" alt="TG" className="w-6 h-6" />
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all hover:bg-white/10 hover:scale-110 text-white/80 hover:text-white"
                    title="Copy Link"
                  >
                    {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  // === LIST VIEW ===
  const featuredArticle = articles[0];
  const otherArticles = articles.slice(1);

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-24">

      <div className="relative z-10 w-full px-4 max-w-7xl mx-auto pb-20 pt-8">
        <div className="text-center py-12 animate-ios-slide-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase mb-6 shadow-lg">
            Project SY News
          </span>
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 tracking-tighter">
            Новости
          </h1>
          <p className="text-white/40 text-xl font-light tracking-wide max-w-lg mx-auto">
            Последние обновления и события из мира метро
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-xl border border-white/10">
              <Calendar className="w-8 h-8 text-white/20" />
            </div>
            <p className="text-gray-400 text-lg">Новостей пока нет</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED */}
            {featuredArticle && (
              <GlassCard
                onClick={() => openArticle(featuredArticle)}
                className="rounded-[48px] group cursor-pointer animate-ios-slide-up delay-100"
              >
                <div className="flex flex-col lg:flex-row h-full min-h-[500px]">
                  <div className="lg:w-3/5 h-[400px] lg:h-auto relative overflow-hidden">
                    {featuredArticle.imageUrl && (
                      <ProgressiveImage
                        src={featuredArticle.imageUrl}
                        alt={featuredArticle.title}
                        className="group-hover:scale-105 transition-transform duration-1000" // Slow, smooth zoom
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50" />

                    {featuredArticle.tag && (
                      <div className="absolute top-8 left-8">
                        <span className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-2xl border border-white/20 text-white text-xs font-bold tracking-widest uppercase shadow-xl">
                          {featuredArticle.tag}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center relative">
                    <div className="flex items-center gap-4 text-white/40 text-sm mb-8 font-medium tracking-wide">
                      <span className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-400/80" />
                        {formatDate(featuredArticle.createdAt)}
                      </span>
                      {featuredArticle.readTime && (
                        <span className="flex items-center gap-2">
                          <Clock size={14} className="text-purple-400/80" />
                          {featuredArticle.readTime}
                        </span>
                      )}
                    </div>

                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-[1.1] tracking-tight group-hover:text-blue-400 transition-colors duration-500">
                      {featuredArticle.title}
                    </h2>

                    <p className="text-white/60 text-lg leading-relaxed mb-10 line-clamp-3 font-light">
                      {featuredArticle.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-3 text-white font-medium group-hover:gap-5 transition-all duration-300 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full border border-white/10">
                        <span className="tracking-wide">Читать</span>
                        <ArrowRight size={18} />
                      </div>

                      <div className="flex items-center gap-6 text-white/40 text-sm font-medium">
                        <span className="flex items-center gap-2">
                          <Eye size={16} />
                          {featuredArticle.views}
                        </span>
                        <span className="flex items-center gap-2">
                          <Heart size={16} />
                          {featuredArticle.likes}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            {/* MASONRY / GRID */}
            {otherArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherArticles.map((article, idx) => (
                  <GlassCard
                    key={article.id}
                    onClick={() => openArticle(article)}
                    className="rounded-[36px] group cursor-pointer flex flex-col h-full animate-ios-slide-up hover:-translate-y-2"
                  >
                    <div className="h-64 relative overflow-hidden shrink-0">
                      {article.imageUrl ? (
                        <ProgressiveImage
                          src={article.imageUrl}
                          alt={article.title}
                          className="group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                          <span className="text-white/20 font-bold text-4xl">SY</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50" />

                      {article.tag && (
                        <div className="absolute top-5 left-5">
                          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white text-[10px] font-bold tracking-wider uppercase">
                            {article.tag}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-8 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-white/40 text-xs mb-4 font-medium tracking-wide">
                        <span>{formatDate(article.createdAt)}</span>
                        {article.readTime && <span>• {article.readTime}</span>}
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-blue-400 transition-colors duration-300">
                        {article.title}
                      </h3>

                      <p className="text-white/60 text-sm line-clamp-3 mb-6 font-light leading-relaxed flex-grow">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                        <span className="text-blue-400/80 text-sm font-semibold tracking-wide flex items-center gap-1 group-hover:gap-2 transition-all">
                          Подробнее <ArrowRight size={14} />
                        </span>
                        <div className="flex items-center gap-4 text-white/30 text-xs font-medium">
                          <span className="flex items-center gap-1">
                            <Eye size={12} />
                            {article.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart size={12} />
                            {article.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;

