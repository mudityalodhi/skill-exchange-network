import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiClock, FiHeart, FiBookmark, FiTrendingUp } from 'react-icons/fi';
import { articleService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { SkeletonCard, EmptyState, PageHeader } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'All', 'Communication Skills', 'Coding', 'Web Development', 'AI & Technology',
  'Career Guidance', 'Freelancing', 'Public Speaking', 'Productivity',
  'Self Improvement', 'Mental Health', 'Design', 'Marketing',
  'Entrepreneurship', 'Finance', 'Interview Preparation',
];

const CATEGORY_ICONS = {
  'All': '📚', 'Communication Skills': '💬', 'Coding': '💻',
  'Web Development': '🌐', 'AI & Technology': '🤖', 'Career Guidance': '🚀',
  'Freelancing': '💼', 'Public Speaking': '🎤', 'Productivity': '⚡',
  'Self Improvement': '🌟', 'Mental Health': '🧠', 'Design': '🎨',
  'Marketing': '📢', 'Entrepreneurship': '🏆', 'Finance': '💰',
  'Interview Preparation': '🎯',
};

const ArticleCard = ({ article, onLike, onBookmark, isAuth }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card group hover:-translate-y-1 transition-all duration-300 flex flex-col"
  >
    {/* Thumbnail */}
    <div className="relative w-full h-44 rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-primary-500/20 to-sen-green/10 flex items-center justify-center">
      {article.thumbnail ? (
        <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
      ) : (
        <span className="text-5xl">{CATEGORY_ICONS[article.category] || '📖'}</span>
      )}
      {article.isFeatured && (
        <span className="absolute top-2 left-2 badge bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-xs">
          ⭐ Featured
        </span>
      )}
      {article.isTrending && (
        <span className="absolute top-2 right-2 badge bg-primary-500/20 text-primary-400 border border-primary-500/20 text-xs">
          <FiTrendingUp size={10} /> Trending
        </span>
      )}
    </div>

    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <span className="badge-red text-xs">{article.category}</span>
        <span className="text-sen-muted text-xs font-body flex items-center gap-1">
          <FiClock size={10} /> {article.readTime} min
        </span>
      </div>

      <Link to={`/articles/${article.slug}`}>
        <h3 className="text-white font-heading font-semibold mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
      </Link>

      <p className="text-sen-muted text-sm font-body line-clamp-2 mb-4 flex-1">{article.excerpt}</p>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-sen-border">
        <div className="flex items-center gap-2">
          {article.author?.profileImage ? (
            <img src={article.author.profileImage} alt={article.author.name} className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">{article.author?.name?.charAt(0)}</span>
            </div>
          )}
          <span className="text-sen-muted text-xs font-body">{article.author?.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => isAuth ? onLike(article._id) : toast.error('Please login to like.')}
            className="flex items-center gap-1 text-sen-muted hover:text-primary-400 transition-colors"
          >
            <FiHeart size={14} />
            <span className="text-xs">{article.likesCount || 0}</span>
          </button>
          <button
            onClick={() => isAuth ? onBookmark(article._id) : toast.error('Please login to bookmark.')}
            className="text-sen-muted hover:text-primary-400 transition-colors"
          >
            <FiBookmark size={14} />
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const ArticlesPage = () => {
  const [searchParams] = useSearchParams();
  const { isAuth } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1 });

  const fetchArticles = useCallback(async (pg = 1) => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 9 };
      if (category !== 'All') params.category = category;
      if (search) params.search = search;
      const { data } = await articleService.getAll(params);
      setArticles(data.articles || []);
      setPagination(data.pagination || { pages: 1 });
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    setPage(1);
    fetchArticles(1);
  }, [category, fetchArticles]);

  const handleLike = async (id) => {
    try {
      await articleService.like(id);
      setArticles((prev) => prev.map((a) =>
        a._id === id ? { ...a, likesCount: (a.likesCount || 0) + 1 } : a
      ));
    } catch (err) { toast.error(err.message); }
  };

  const handleBookmark = async (id) => {
    try {
      const { data } = await articleService.bookmark(id);
      toast.success(data.message);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="min-h-screen bg-sen-black">
      <PageHeader title="Knowledge Hub" description="Explore articles across 15+ categories. Learn, grow, and share knowledge." />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="flex items-center gap-2 bg-sen-card border border-sen-border rounded-xl p-2 mb-6 max-w-lg focus-within:border-primary-500/50 transition-all">
          <FiSearch className="ml-2 text-sen-muted flex-shrink-0" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchArticles(1)}
            placeholder="Search articles..."
            className="flex-1 bg-transparent text-white placeholder:text-sen-muted text-sm font-body focus:outline-none"
          />
        </div>

        {/* Category tabs - horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium font-body transition-all duration-200 ${
                category === cat
                  ? 'bg-primary-500 text-white shadow-glow-red'
                  : 'bg-sen-card border border-sen-border text-sen-muted hover:border-primary-500/40 hover:text-white'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No articles found"
            description="Try a different category or search term."
            action={<button onClick={() => { setCategory('All'); setSearch(''); }} className="btn-primary">Browse All</button>}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onLike={handleLike}
                  onBookmark={handleBookmark}
                  isAuth={isAuth}
                />
              ))}
            </div>

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => { setPage(p); fetchArticles(p); }}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      p === page ? 'bg-primary-500 text-white' : 'bg-sen-card border border-sen-border text-sen-muted hover:border-primary-500/50'
                    }`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
