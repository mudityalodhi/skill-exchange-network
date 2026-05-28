import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiRepeat, FiCheck, FiX, FiEye } from 'react-icons/fi';
import { exchangeService } from '../services/index.js';
import { useAuth } from '../context/AuthContext';
import { Avatar, PageHeader, EmptyState } from '../components/common/index.jsx';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'badge-gray', icon: '⏳' },
  accepted: { label: 'Accepted', color: 'badge-green', icon: '✅' },
  completed: { label: 'Completed', color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20', icon: '🎉' },
  rejected: { label: 'Declined', color: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: '❌' },
  cancelled: { label: 'Cancelled', color: 'badge-gray', icon: '🚫' },
};

const ExchangeCard = ({ exchange, currentUserId, onRespond, onComplete }) => {
  const isSender = exchange.sender?._id === currentUserId;
  const other = isSender ? exchange.receiver : exchange.sender;
  const cfg = STATUS_CONFIG[exchange.status] || STATUS_CONFIG.pending;
  const [loading, setLoading] = useState(false);

  const handleAction = async (action) => {
    setLoading(true);
    try {
      await onRespond(exchange._id, action);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:border-primary-500/30 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Avatar user={other} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-white font-heading font-semibold">{other?.name}</h3>
              <span className={`badge text-xs ${cfg.color}`}>{cfg.icon} {cfg.label}</span>
              {!isSender && exchange.status === 'pending' && (
                <span className="badge bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs">New Request!</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-2 text-sm font-body">
              <div className="flex items-center gap-2">
                <span className="text-sen-muted">Offers:</span>
                <span className="badge-red text-xs">{exchange.skillOffered}</span>
              </div>
              <span className="text-sen-border hidden sm:block">→</span>
              <div className="flex items-center gap-2">
                <span className="text-sen-muted">Wants:</span>
                <span className="badge-green text-xs">{exchange.skillWanted}</span>
              </div>
            </div>

            {exchange.message && (
              <p className="text-sen-muted text-sm mt-2 italic font-body">"{exchange.message}"</p>
            )}

            <div className="flex items-center gap-3 mt-2 text-xs text-sen-muted font-body">
              <span>💰 {exchange.creditCost} credits</span>
              <span>•</span>
              <span>{new Date(exchange.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-row sm:flex-col gap-2 justify-end sm:justify-start">
          <Link
            to={`/exchanges/${exchange._id}`}
            className="btn-ghost text-xs px-3 py-2 flex items-center gap-1"
          >
            <FiEye size={13} /> View
          </Link>

          {!isSender && exchange.status === 'pending' && (
            <>
              <button
                onClick={() => handleAction('accept')}
                disabled={loading}
                className="btn-green text-xs px-3 py-2 flex items-center gap-1"
              >
                <FiCheck size={13} /> Accept
              </button>
              <button
                onClick={() => handleAction('reject')}
                disabled={loading}
                className="btn-secondary text-xs px-3 py-2 flex items-center gap-1 hover:border-red-500/50 hover:text-red-400"
              >
                <FiX size={13} /> Decline
              </button>
            </>
          )}

          {exchange.status === 'accepted' && (
            <button
              onClick={() => onComplete(exchange._id)}
              disabled={loading}
              className="btn-primary text-xs px-3 py-2 flex items-center gap-1"
            >
              <FiCheck size={13} /> Mark Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ExchangesPage = () => {
  const { user } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState('all');
  const [status, setStatus] = useState('');

  const fetchExchanges = useCallback(async () => {
    setLoading(true);
    try {
      const params = { type };
      if (status) params.status = status;
      const { data } = await exchangeService.getAll(params);
      setExchanges(data.exchanges || []);
    } catch {
      setExchanges([]);
    } finally {
      setLoading(false);
    }
  }, [type, status]);

  useEffect(() => { fetchExchanges(); }, [fetchExchanges]);

  const handleRespond = async (id, action) => {
    try {
      await exchangeService.respond(id, action);
      toast.success(`Exchange ${action}ed!`);
      fetchExchanges();
    } catch (err) { toast.error(err.message); }
  };

  const handleComplete = async (id) => {
    try {
      await exchangeService.complete(id);
      toast.success('Exchange marked as completed! Credits earned 🎉');
      fetchExchanges();
    } catch (err) { toast.error(err.message); }
  };

  const TABS = [
    { value: 'all', label: 'All' },
    { value: 'sent', label: 'Sent' },
    { value: 'received', label: 'Received' },
  ];

  const STATUS_TABS = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Declined' },
  ];

  return (
    <div className="min-h-screen bg-sen-black">
      <PageHeader title="My Exchanges" description="Manage all your skill exchange requests and sessions.">
        <div className="flex flex-col sm:flex-row gap-3 mt-5">
          <div className="flex gap-2 bg-sen-card border border-sen-border rounded-xl p-1">
            {TABS.map((tab) => (
              <button key={tab.value} onClick={() => setType(tab.value)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium font-body transition-all ${
                  type === tab.value ? 'bg-primary-500 text-white' : 'text-sen-muted hover:text-white'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input text-sm py-2 max-w-xs"
          >
            {STATUS_TABS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>

          <Link to="/explore" className="btn-primary text-sm py-2 ml-auto flex items-center gap-2">
            <FiRepeat size={14} /> New Exchange
          </Link>
        </div>
      </PageHeader>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : exchanges.length === 0 ? (
          <EmptyState
            icon="🔄"
            title="No exchanges found"
            description="Start exchanging skills with other members!"
            action={<Link to="/explore" className="btn-primary">Find Partners</Link>}
          />
        ) : (
          <div className="space-y-4">
            {exchanges.map((ex) => (
              <ExchangeCard
                key={ex._id}
                exchange={ex}
                currentUserId={user?._id}
                onRespond={handleRespond}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExchangesPage;
