import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, Clock, ArrowRight, Eye, Heart, Copy, Check, Newspaper } from 'lucide-react';
import GoogleLoader from '../components/GoogleLoader';
import { useAuth } from '../context/AuthContext';
import { newsApi, NewsArticle } from '../api';

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
    } catch {
      setSelectedArticle(article);
    }
  };

  const closeArticle = () => {
    setSelectedArticle(null);
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <GoogleLoader size={48} className="text-primary" />
      </div>
    );
  }

  // === VIEW ARTICLE ===
  if (selectedArticle) {
    return (
      <div className="w-full px-6 max-w-4xl mx-auto pb-20 pt-8 animate-fade-in">
        
        {/* Back Button */}
        <button
          onClick={closeArticle}
          className="btn-secondary h-10 px-4 mb-8 flex items-center gap-2"
        >
          <ChevronLeft size={18} />
          Назад к новостям
        </button>

        {/* Article Card */}
        <article className="bg-[#18181b] rounded-md overflow-hidden shadow-sm border border-[#2f2f35]">
          
          {/* Image */}
          {selectedArticle.imageUrl && (
            <div className="relative aspect-video">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#18181b] to-transparent" />
              {selectedArticle.tag && (
                <div className="absolute top-6 left-6">
                  <span className="px-2 py-1 rounded bg-primary text-black font-bold text-xs uppercase tracking-wider">
                    {selectedArticle.tag}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className="p-8 md:p-10">
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6 text-[#adadb8] text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar size={16} className="text-primary" />
                {formatDate(selectedArticle.createdAt)}
              </span>
              {selectedArticle.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {selectedArticle.readTime}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#efeff1] mb-8 leading-tight">
              {selectedArticle.title}
            </h1>

            {/* Body */}
            <div className="text-[#efeff1] text-lg leading-relaxed whitespace-pre-line mb-10">
              {selectedArticle.content}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-8 border-t border-[#2f2f35]">
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-colors ${
                  selectedArticle.isLiked
                    ? 'bg-primary/10 text-primary'
                    : 'bg-[#2f2f35] text-[#efeff1] hover:bg-[#3f3f46]'
                }`}
              >
                {liking ? (
                  <GoogleLoader size={16} />
                ) : (
                  <Heart size={18} fill={selectedArticle.isLiked ? 'currentColor' : 'none'} />
                )}
                <span>{selectedArticle.likes}</span>
              </button>

              <button
                onClick={copyLink}
                className="p-2 rounded bg-[#2f2f35] text-[#efeff1] hover:bg-[#3f3f46] transition-colors"
                title="Копировать ссылку"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // === LIST VIEW ===
  return (
    <div className="w-full px-6 max-w-[1600px] mx-auto pb-20 pt-8">
      
      {/* Header */}
      <div className="mb-10 flex items-center gap-4 animate-fade-in">
        <div className="w-12 h-12 rounded bg-[#2f2f35] flex items-center justify-center">
          <Newspaper size={24} className="text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#efeff1]">Новости</h1>
          <p className="text-[#adadb8]">Последние события и обновления</p>
        </div>
      </div>

      {/* Articles Grid */}
      {articles.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-[#2f2f35] rounded-lg">
          <p className="text-[#adadb8]">Новостей пока нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article, idx) => (
            <article
              key={article.id}
              onClick={() => openArticle(article)}
              className="group cursor-pointer bg-[#18181b] rounded-md overflow-hidden hover:shadow-lg transition-all animate-fade-in border border-transparent hover:border-[#2f2f35]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Image */}
              <div className="aspect-video bg-[#0e0e10] relative overflow-hidden">
                {article.imageUrl && (
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  {article.tag && (
                    <span className="px-1.5 py-0.5 rounded bg-[#000]/60 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider">
                      {article.tag}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-[#000]/80 text-[#adadb8] text-xs font-mono">
                  {formatDate(article.createdAt)}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-[#efeff1] text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                
                <p className="text-[#adadb8] text-sm line-clamp-2 mb-4 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-1 text-xs text-[#adadb8] font-semibold uppercase tracking-wider group-hover:text-primary transition-colors">
                  <span>Читать далее</span>
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
