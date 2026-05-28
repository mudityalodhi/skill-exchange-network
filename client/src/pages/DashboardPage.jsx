import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiRepeat, FiStar, FiTrendingUp, FiClock, FiArrowRight, FiPlus } from 'react-icons/fi';
import { userService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { Avatar, StarRating, CreditsBadge } from '../components/common/index.jsx';

const StatCard = ({ icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="card"
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 text-white`}>
      {icon}
    </div>
    <p className="text-3xl font-heading font-bold text-white mb-1">{value}</p>
    <p className="text-sen-muted text-sm font-body">{label}</p>
  </motion.div>
);

const STATUS_COLORS = {
  pending: 'badge-gray',
  accepted: 'badge-green',
  completed: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  rejected: 'bg-red-500/10 text-red-400 border border-red-500/20',
  cancelled: 'badge-gray',
};

const ExchangeRow = ({ exchange, currentUserId }) => {
  const isSender = exchange.sender?._id === currentUserId;
  const other = isSender ? exchange.receiver : exchange.sender;
  const role = isSender ? 'Sent' : 'Received';

  return (
    <Link to={`/exchanges/${exchange._id}`} className="flex items-center gap-4 py-3 border-b border-sen-border last:border-0 hover:bg-white/2 transition-colors rounded-lg px-2 -mx-2">
      <Avatar user={other} size="sm" />
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{other?.name}</p>
        <p className="text-sen-muted text-xs font-body truncate">
          {role}: {isSender ? exchange.skillOffered : exchange.skillWanted}
        </p>
      </div>
      <span className={`badge text-xs ${STATUS_COLORS[exchange.status] || 'badge-gray'}`}>
        {exchange.status}
      </span>
    </Link>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getDashboard()
      .then(({ data }) => setData(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
    </div>
  );

  const stats = data?.stats || {};

  return (
    <div className="min-h-screen bg-sen-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Avatar user={user} size="lg" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-white">
                Welcome back, {user?.name?.split(' ')[0]}! 👋
              </h1>
              <p className="text-sen-muted text-sm font-body">Here's what's happening with your exchanges.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreditsBadge credits={user?.credits || 0} />
            <Link to="/explore" className="btn-primary text-sm py-2">
              <FiPlus size={14} /> New Exchange
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard icon={<FiRepeat size={20} />} label="Completed Exchanges" value={stats.totalExchanges || 0} color="bg-primary-500" delay={0} />
          <StatCard icon={<FiClock size={20} />} label="Pending Requests" value={stats.pendingRequests || 0} color="bg-yellow-500" delay={0.1} />
          <StatCard icon={<FiStar size={20} />} label="Avg. Rating" value={`${stats.averageRating?.toFixed(1) || '0.0'} ⭐`} color="bg-purple-500" delay={0.2} />
          <StatCard icon={<FiTrendingUp size={20} />} label="Total Reviews" value={stats.totalReviews || 0} color="bg-sen-green" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sent Exchanges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-heading font-semibold text-white">Sent Requests</h2>
              <Link to="/exchanges?type=sent" className="text-primary-400 text-sm hover:underline flex items-center gap-1">
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            {(data?.sentExchanges || []).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🔄</p>
                <p className="text-sen-muted text-sm font-body">No sent requests yet.</p>
                <Link to="/explore" className="btn-primary text-sm mt-3 inline-flex">Find Someone</Link>
              </div>
            ) : (
              data.sentExchanges.map((ex) => (
                <ExchangeRow key={ex._id} exchange={ex} currentUserId={user?._id} />
              ))
            )}
          </motion.div>

          {/* Received Exchanges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-heading font-semibold text-white">Received Requests</h2>
              <Link to="/exchanges?type=received" className="text-primary-400 text-sm hover:underline flex items-center gap-1">
                View All <FiArrowRight size={12} />
              </Link>
            </div>
            {(data?.receivedExchanges || []).length === 0 ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">📬</p>
                <p className="text-sen-muted text-sm font-body">No incoming requests yet.</p>
                <Link to="/my-profile" className="btn-secondary text-sm mt-3 inline-flex">Complete Profile</Link>
              </div>
            ) : (
              data.receivedExchanges.map((ex) => (
                <ExchangeRow key={ex._id} exchange={ex} currentUserId={user?._id} />
              ))
            )}
          </motion.div>

          {/* Recent Reviews */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="card lg:col-span-2">
            <h2 className="text-lg font-heading font-semibold text-white mb-5">Recent Reviews</h2>
            {(data?.reviews || []).length === 0 ? (
              <p className="text-sen-muted text-sm font-body text-center py-6">No reviews yet. Complete exchanges to receive reviews!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.reviews.map((r) => (
                  <div key={r._id} className="bg-sen-dark rounded-xl p-4 border border-sen-border">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar user={r.reviewer} size="sm" />
                      <div>
                        <p className="text-white text-sm font-semibold">{r.reviewer?.name}</p>
                        <StarRating rating={r.rating} />
                      </div>
                    </div>
                    <p className="text-sen-muted text-sm font-body italic">"{r.comment}"</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { to: '/explore', label: 'Find Partners', icon: '🔍' },
            { to: '/exchanges', label: 'All Exchanges', icon: '🔄' },
            { to: '/articles', label: 'Knowledge Hub', icon: '📚' },
            { to: '/my-profile', label: 'Edit Profile', icon: '👤' },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} className="card text-center hover:-translate-y-1 transition-all duration-300 group">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-white text-sm font-semibold group-hover:text-primary-400 transition-colors">{label}</p>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
