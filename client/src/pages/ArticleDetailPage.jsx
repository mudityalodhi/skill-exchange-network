import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiHeart, FiBookmark, FiShare2, FiArrowLeft, FiEye } from 'react-icons/fi';
import { articleService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const { isAuth } = useAuth();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    articleService.getBySlug(slug)
      .then(({ data }) => {
        setArticle(data.article);
        setRelated(data.related || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const handleLike = async () => {
    if (!isAuth) return toast.error('Please login to like.');
    try {
      const { data } = await articleService.like(article._id);
      setIsLiked(data.isLiked);
      setArticle((prev) => ({ ...prev, likesCount: data.likesCount }));
    } catch (err) { toast.error(err.message); }
  };

  const handleBookmark = async () => {
    if (!isAuth) return toast.error('Please login to bookmark.');
    try {
      const { data } = await articleService.bookmark(article._id);
      setIsBookmarked(data.isBookmarked);
      toast.success(data.message);
    } catch (err) { toast.error(err.message); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!article) return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center pt-20 text-center">
      <div>
        <p className="text-6xl mb-4">📭</p>
        <h2 className="text-white text-2xl font-heading font-bold mb-2">Article not found</h2>
        <Link to="/articles" className="btn-primary mt-4">Back to Articles</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sen-black pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Back button */}
        <Link to="/articles" className="inline-flex items-center gap-2 text-sen-muted hover:text-white text-sm font-body transition-colors mb-8">
          <FiArrowLeft size={16} /> Back to Articles
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="badge-red">{article.category}</span>
            <span className="text-sen-muted text-sm font-body flex items-center gap-1">
              <FiClock size={12} /> {article.readTime} min read
            </span>
            <span className="text-sen-muted text-sm font-body flex items-center gap-1">
              <FiEye size={12} /> {article.views} views
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Author & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-sen-border">
            <div className="flex items-center gap-3">
              <Avatar user={article.author} size="md" />
              <div>
                <p className="text-white font-semibold text-sm">{article.author?.name}</p>
                <p className="text-sen-muted text-xs font-body">
                  {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleLike} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-body transition-all ${isLiked ? 'border-primary-500/50 text-primary-400 bg-primary-500/10' : 'border-sen-border text-sen-muted hover:border-primary-500/30'}`}>
                <FiHeart size={15} fill={isLiked ? 'currentColor' : 'none'} />
                {article.likesCount || 0}
              </button>
              <button onClick={handleBookmark} className={`p-2 rounded-lg border text-sm transition-all ${isBookmarked ? 'border-primary-500/50 text-primary-400 bg-primary-500/10' : 'border-sen-border text-sen-muted hover:border-primary-500/30'}`}>
                <FiBookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <button onClick={handleShare} className="p-2 rounded-lg border border-sen-border text-sen-muted hover:text-white hover:border-primary-500/30 transition-all">
                <FiShare2 size={15} />
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          {article.thumbnail && (
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden mb-8">
              <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Tags */}
          {article.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span key={tag} className="badge-gray text-xs">#{tag}</span>
              ))}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-sm sm:prose-base max-w-none font-body
              prose-headings:font-heading prose-headings:text-white
              prose-p:text-sen-muted prose-p:leading-relaxed
              prose-strong:text-white prose-a:text-primary-400
              prose-code:text-primary-300 prose-code:bg-sen-card prose-code:px-1 prose-code:py-0.5 prose-code:rounded
              prose-pre:bg-sen-card prose-pre:border prose-pre:border-sen-border prose-pre:rounded-xl
              prose-blockquote:border-l-primary-500 prose-blockquote:text-sen-muted
              prose-li:text-sen-muted prose-hr:border-sen-border"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.article>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 pt-10 border-t border-sen-border">
            <h2 className="text-xl font-heading font-bold text-white mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r._id} to={`/articles/${r.slug}`}
                  className="card group hover:-translate-y-1 transition-all duration-300 block"
                >
                  <span className="badge-red text-xs mb-2">{r.category}</span>
                  <h3 className="text-white font-heading font-semibold text-sm mt-2 group-hover:text-primary-400 transition-colors line-clamp-2">
                    {r.title}
                  </h3>
                  <p className="text-sen-muted text-xs font-body mt-2">{r.readTime} min read</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleDetailPage;
