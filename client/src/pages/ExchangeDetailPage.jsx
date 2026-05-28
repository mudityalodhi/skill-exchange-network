import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiArrowLeft, FiCalendar, FiLink, FiMessageCircle, FiStar } from 'react-icons/fi';
import { exchangeService, reviewService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { Avatar, StarRating } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-gray', icon: '⏳', desc: 'Waiting for response' },
  accepted: { label: 'Accepted', color: 'badge-green', icon: '✅', desc: 'Exchange is confirmed' },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: '🎉', desc: 'Exchange done!' },
  rejected: { label: 'Declined', color: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: '❌', desc: 'Request was declined' },
  cancelled: { label: 'Cancelled', color: 'badge-gray', icon: '🚫', desc: 'Exchange was cancelled' },
};

const ReviewForm = ({ exchange, revieweeId, onSubmit }) => {
  const [form, setForm] = useState({ rating: 5, comment: '', skillTaught: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return toast.error('Please write a comment.');
    setLoading(true);
    try {
      await reviewService.create({ revieweeId, exchangeId: exchange._id, ...form });
      toast.success('Review submitted! ⭐');
      onSubmit();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="card mt-6">
      <h3 className="text-lg font-heading font-semibold text-white mb-4">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, rating: s }))}
                className={`text-2xl transition-transform hover:scale-110 ${s <= form.rating ? 'text-yellow-400' : 'text-sen-border'}`}>
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="label">Skill Taught</label>
          <input value={form.skillTaught} onChange={(e) => setForm((p) => ({ ...p, skillTaught: e.target.value }))}
            className="input" placeholder="Which skill did they teach you?" />
        </div>
        <div>
          <label className="label">Your Review *</label>
          <textarea value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))}
            className="input resize-none" rows={3} placeholder="Share your experience..." />
        </div>
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Submitting...' : <><FiStar size={14} /> Submit Review</>}
        </button>
      </form>
    </div>
  );
};

const ExchangeDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    exchangeService.getById(id)
      .then(({ data }) => setExchange(data.exchange))
      .catch(() => navigate('/exchanges'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRespond = async (action) => {
    setActionLoading(true);
    try {
      const { data } = await exchangeService.respond(id, action);
      setExchange(data.exchange);
      toast.success(`Exchange ${action}ed!`);
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  const handleComplete = async () => {
    setActionLoading(true);
    try {
      const { data } = await exchangeService.complete(id);
      setExchange(data.exchange);
      toast.success('Exchange completed! Credits earned 🎉');
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center pt-20">
      <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
    </div>
  );
  if (!exchange) return null;

  const isSender = exchange.sender?._id === user?._id;
  const other = isSender ? exchange.receiver : exchange.sender;
  const cfg = STATUS_CONFIG[exchange.status] || STATUS_CONFIG.pending;
  const canReview = exchange.status === 'completed' && (
    (isSender && !exchange.senderReviewed) ||
    (!isSender && !exchange.receiverReviewed)
  );

  return (
    <div className="min-h-screen bg-sen-black pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/exchanges" className="inline-flex items-center gap-2 text-sen-muted hover:text-white text-sm font-body mb-6">
          <FiArrowLeft size={16} /> Back to Exchanges
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-heading font-bold text-white mb-2">Skill Exchange</h1>
              <span className={`badge ${cfg.color}`}>{cfg.icon} {cfg.label} — {cfg.desc}</span>
            </div>
            <div className="text-right">
              <p className="text-sen-muted text-xs font-body">Created</p>
              <p className="text-white text-sm">{new Date(exchange.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-6 p-5 bg-sen-dark rounded-xl border border-sen-border">
            <div className="text-center">
              <p className="text-sen-muted text-xs font-body mb-2">{isSender ? 'You Offer' : `${exchange.sender?.name} Offers`}</p>
              <span className="badge-red text-sm px-4 py-2">{exchange.skillOffered}</span>
            </div>
            <div className="text-2xl">⇄</div>
            <div className="text-center">
              <p className="text-sen-muted text-xs font-body mb-2">{isSender ? 'You Want' : `${exchange.sender?.name} Wants`}</p>
              <span className="badge-green text-sm px-4 py-2">{exchange.skillWanted}</span>
            </div>
          </div>

          {exchange.message && (
            <div className="mt-4 p-4 bg-sen-dark rounded-xl border border-sen-border">
              <p className="text-xs text-sen-muted mb-1 font-body">Message</p>
              <p className="text-white text-sm font-body italic">"{exchange.message}"</p>
            </div>
          )}

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-sen-border text-sm font-body">
            <span className="text-sen-muted">💰 Credits: <span className="text-sen-green font-bold">{exchange.creditCost}</span></span>
            {exchange.completedAt && (
              <span className="text-sen-muted">🎉 Completed: {new Date(exchange.completedAt).toLocaleDateString()}</span>
            )}
          </div>
        </motion.div>

        {/* Participants */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {[exchange.sender, exchange.receiver].map((p, i) => p && (
            <Link key={p._id} to={`/profile/${p._id}`} className="card hover:border-primary-500/30 transition-all block">
              <p className="text-xs text-sen-muted font-body mb-3">{i === 0 ? '📤 Sender' : '📥 Receiver'}</p>
              <div className="flex items-center gap-3">
                <Avatar user={p} size="md" />
                <div>
                  <p className="text-white font-semibold text-sm">{p.name}</p>
                  <StarRating rating={p.averageRating || 0} />
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Action buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="flex flex-wrap gap-3 mb-6">
          {!isSender && exchange.status === 'pending' && (
            <>
              <button onClick={() => handleRespond('accept')} disabled={actionLoading} className="btn-green flex items-center gap-2">
                <FiCheck size={15} /> Accept Exchange
              </button>
              <button onClick={() => handleRespond('reject')} disabled={actionLoading} className="btn-secondary flex items-center gap-2 hover:border-red-500/50 hover:text-red-400">
                <FiX size={15} /> Decline
              </button>
            </>
          )}

          {exchange.status === 'accepted' && (
            <button onClick={handleComplete} disabled={actionLoading} className="btn-primary flex items-center gap-2">
              <FiCheck size={15} /> Mark as Completed
            </button>
          )}

          <Link to={`/messages?with=${other?._id}`} className="btn-secondary flex items-center gap-2">
            <FiMessageCircle size={15} /> Message {other?.name?.split(' ')[0]}
          </Link>
        </motion.div>

        {/* Session Details (if accepted) */}
        {exchange.status === 'accepted' && exchange.sessionDetails && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mb-6">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">Session Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-body">
              {exchange.sessionDetails.scheduledDate && (
                <div>
                  <p className="text-sen-muted mb-1 flex items-center gap-1"><FiCalendar size={12} /> Scheduled</p>
                  <p className="text-white">{new Date(exchange.sessionDetails.scheduledDate).toLocaleString()}</p>
                </div>
              )}
              <div>
                <p className="text-sen-muted mb-1">Platform</p>
                <p className="text-white">{exchange.sessionDetails.platform || 'Google Meet'}</p>
              </div>
              {exchange.sessionDetails.meetingLink && (
                <div>
                  <p className="text-sen-muted mb-1 flex items-center gap-1"><FiLink size={12} /> Meeting Link</p>
                  <a href={exchange.sessionDetails.meetingLink} target="_blank" rel="noopener noreferrer"
                    className="text-primary-400 hover:underline truncate block">
                    {exchange.sessionDetails.meetingLink}
                  </a>
                </div>
              )}
              <div>
                <p className="text-sen-muted mb-1">Duration</p>
                <p className="text-white">{exchange.sessionDetails.duration || 60} minutes</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Review form */}
        {canReview && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            {!showReviewForm ? (
              <button onClick={() => setShowReviewForm(true)} className="btn-primary w-full justify-center">
                <FiStar size={15} /> Leave a Review for {other?.name?.split(' ')[0]}
              </button>
            ) : (
              <ReviewForm exchange={exchange} revieweeId={other?._id} onSubmit={() => setShowReviewForm(false)} />
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ExchangeDetailPage;
