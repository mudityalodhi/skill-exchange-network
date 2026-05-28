import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMessageCircle, FiRepeat, FiBookmark, FiLink, FiGithub, FiLinkedin, FiTwitter, FiGlobe } from 'react-icons/fi';
import { userService, exchangeService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { Avatar, StarRating, CreditsBadge, OnlineDot } from '../components/common/index.jsx';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const ExchangeModal = ({ user, onClose, onSend }) => {
  const { user: me } = useAuth();
  const [form, setForm] = useState({ skillOffered: '', skillWanted: '', message: '', creditCost: 10 });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skillOffered || !form.skillWanted) return toast.error('Please fill all required fields.');
    setLoading(true);
    try {
      await exchangeService.send({ receiverId: user._id, ...form });
      toast.success('Exchange request sent!');
      onSend();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-sen-card border border-sen-border rounded-2xl p-6 w-full max-w-md"
      >
        <h3 className="text-xl font-heading font-bold text-white mb-1">Send Exchange Request</h3>
        <p className="text-sen-muted text-sm font-body mb-5">to {user.name}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Skill You'll Teach *</label>
            <input
              type="text" value={form.skillOffered}
              onChange={(e) => setForm((p) => ({ ...p, skillOffered: e.target.value }))}
              className="input" placeholder="e.g., React.js, Python..."
            />
            {me?.skillsOffered?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {me.skillsOffered.map((s) => (
                  <button key={s.skill} type="button"
                    onClick={() => setForm((p) => ({ ...p, skillOffered: s.skill }))}
                    className="badge-gray text-xs cursor-pointer hover:border-primary-500/40"
                  >
                    {s.skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label">Skill You Want to Learn *</label>
            <input
              type="text" value={form.skillWanted}
              onChange={(e) => setForm((p) => ({ ...p, skillWanted: e.target.value }))}
              className="input" placeholder="e.g., UI Design, Photography..."
            />
            {user?.skillsOffered?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {user.skillsOffered.map((s) => (
                  <button key={s.skill} type="button"
                    onClick={() => setForm((p) => ({ ...p, skillWanted: s.skill }))}
                    className="badge-red text-xs cursor-pointer"
                  >
                    {s.skill}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="label">Credit Offer</label>
            <select value={form.creditCost} onChange={(e) => setForm((p) => ({ ...p, creditCost: Number(e.target.value) }))} className="input">
              {[5, 10, 15, 20, 30].map((c) => <option key={c} value={c}>{c} credits</option>)}
            </select>
          </div>

          <div>
            <label className="label">Message (optional)</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              className="input resize-none" rows={3}
              placeholder="Introduce yourself or describe what you'd like to learn..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const ProfilePage = () => {
  const { id } = useParams();
  const { user: me, isAuth } = useAuth();
  const { isOnline } = useSocket();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExchange, setShowExchange] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    userService.getUserById(id)
      .then(({ data }) => {
        setProfile(data.user);
        setReviews(data.reviews || []);
        if (me?.bookmarkedUsers?.includes(id)) setIsBookmarked(true);
      })
      .catch(() => navigate('/explore'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBookmark = async () => {
    if (!isAuth) return navigate('/login');
    try {
      const { data } = await userService.toggleBookmark(id);
      setIsBookmarked(data.isBookmarked);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  if (!profile) return null;
  const isOwn = me?._id === profile._id;
  const online = isOnline(profile._id);

  const socialIcons = {
    linkedin: <FiLinkedin size={16} />,
    github: <FiGithub size={16} />,
    twitter: <FiTwitter size={16} />,
    website: <FiGlobe size={16} />,
  };

  return (
    <div className="min-h-screen bg-sen-black pt-20">
      {showExchange && isAuth && !isOwn && (
        <ExchangeModal user={profile} onClose={() => setShowExchange(false)} onSend={() => {}} />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-5">
            {/* Profile Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card text-center">
              <div className="relative inline-block mb-4">
                <Avatar user={profile} size="2xl" />
                {online && (
                  <span className="absolute bottom-1 right-1 w-4 h-4 bg-sen-green border-2 border-sen-card rounded-full" />
                )}
              </div>

              <h1 className="text-xl font-heading font-bold text-white mb-1">{profile.name}</h1>
              <p className="text-sen-muted text-sm font-body mb-3">{profile.location || 'SEN Member'}</p>

              <div className="flex items-center justify-center gap-2 mb-3">
                <StarRating rating={profile.averageRating} size="md" />
                <span className="text-white font-semibold text-sm">{profile.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-sen-muted text-sm">({profile.totalReviews || 0})</span>
              </div>

              <div className="flex items-center justify-center gap-2 mb-4">
                <OnlineDot isOnline={online} />
                <span className="text-sen-muted text-xs font-body">{online ? 'Online now' : 'Offline'}</span>
              </div>

              <div className="flex items-center justify-center mb-5">
                <CreditsBadge credits={profile.credits} />
              </div>

              {isOwn ? (
                <Link to="/my-profile" className="btn-secondary w-full justify-center text-sm">Edit Profile</Link>
              ) : (
                <div className="space-y-2">
                  {isAuth && (
                    <button onClick={() => setShowExchange(true)} className="btn-primary w-full justify-center text-sm">
                      <FiRepeat size={14} /> Request Exchange
                    </button>
                  )}
                  <div className="flex gap-2">
                    {isAuth && (
                      <Link to={`/messages?with=${profile._id}`} className="btn-secondary flex-1 justify-center text-sm">
                        <FiMessageCircle size={14} /> Message
                      </Link>
                    )}
                    <button onClick={handleBookmark} className={`btn-secondary px-3 ${isBookmarked ? 'border-primary-500/50 text-primary-400' : ''}`}>
                      <FiBookmark size={14} />
                    </button>
                  </div>
                  {!isAuth && (
                    <Link to="/login" className="btn-primary w-full justify-center text-sm">
                      Login to Connect
                    </Link>
                  )}
                </div>
              )}
            </motion.div>

            {/* Stats */}
            <div className="card">
              <h3 className="text-sm font-heading font-semibold text-white mb-4">Activity</h3>
              <div className="space-y-3">
                {[
                  { label: 'Sessions Taught', value: profile.totalTeachingSessions || 0, icon: '🎓' },
                  { label: 'Sessions Learned', value: profile.totalLearningSessions || 0, icon: '📚' },
                  { label: 'Reviews Received', value: profile.totalReviews || 0, icon: '⭐' },
                ].map(({ label, value, icon }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-sen-muted text-sm font-body">{icon} {label}</span>
                    <span className="text-white font-semibold text-sm">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            {Object.values(profile.socialLinks || {}).some(Boolean) && (
              <div className="card">
                <h3 className="text-sm font-heading font-semibold text-white mb-4">Links</h3>
                <div className="space-y-2">
                  {Object.entries(profile.socialLinks || {}).map(([key, url]) =>
                    url ? (
                      <a key={key} href={url.startsWith('http') ? url : `https://${url}`} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sen-muted hover:text-primary-400 text-sm font-body transition-colors">
                        {socialIcons[key]}
                        <span className="capitalize">{key}</span>
                        <FiLink size={12} className="ml-auto" />
                      </a>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
              <h2 className="text-lg font-heading font-semibold text-white mb-3">About</h2>
              <p className="text-sen-muted font-body leading-relaxed">
                {profile.bio || 'This user hasn\'t added a bio yet.'}
              </p>
              {profile.availability && (
                <p className="text-sen-muted text-sm mt-3 font-body">
                  ⏰ Available: <span className="text-white font-medium">{profile.availability}</span>
                </p>
              )}
            </motion.div>

            {/* Skills Offered */}
            {profile.skillsOffered?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
                <h2 className="text-lg font-heading font-semibold text-white mb-4">Skills I Can Teach 🎓</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.map((s) => (
                    <div key={s.skill} className="flex items-center gap-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full px-3 py-1.5">
                      <span className="text-primary-400 text-sm font-semibold">{s.skill}</span>
                      <span className="text-primary-400/50 text-xs">·</span>
                      <span className="text-primary-400/70 text-xs">{s.level}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skills Wanted */}
            {profile.skillsWanted?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
                <h2 className="text-lg font-heading font-semibold text-white mb-4">Skills I Want to Learn 📚</h2>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsWanted.map((s) => (
                    <span key={s} className="badge-green">{s}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
              <h2 className="text-lg font-heading font-semibold text-white mb-5">Reviews ({profile.totalReviews || 0})</h2>
              {reviews.length === 0 ? (
                <p className="text-sen-muted font-body text-sm">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="border-b border-sen-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar user={r.reviewer} size="sm" />
                        <div>
                          <p className="text-white text-sm font-semibold">{r.reviewer?.name}</p>
                          <StarRating rating={r.rating} />
                        </div>
                        <span className="ml-auto text-sen-muted text-xs">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {r.skillTaught && (
                        <p className="text-xs text-primary-400 mb-1">Taught: {r.skillTaught}</p>
                      )}
                      <p className="text-sen-muted text-sm font-body">{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
