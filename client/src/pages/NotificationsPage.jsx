import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBell, FiCheck, FiTrash2 } from 'react-icons/fi';
import { notificationService } from '../services/index.js';
import { PageHeader, EmptyState } from '../components/common/index.jsx';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

const NOTIF_ICONS = {
  exchange_request: '🔄',
  exchange_accepted: '✅',
  exchange_rejected: '❌',
  exchange_completed: '🎉',
  new_review: '⭐',
  new_message: '💬',
  credit_earned: '💰',
  credit_spent: '💸',
  system: '📢',
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { resetNotifications } = useSocket();

  useEffect(() => {
    notificationService.getAll()
      .then(({ data }) => {
        setNotifications(data.notifications || []);
        resetNotifications();
        // Mark all as read
        notificationService.markRead([]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setNotifications((p) => p.filter((n) => n._id !== id));
    } catch (err) { toast.error(err.message); }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markRead([]);
      setNotifications((p) => p.map((n) => ({ ...n, isRead: true })));
      toast.success('All marked as read.');
    } catch (err) { toast.error(err.message); }
  };

  const unread = notifications.filter((n) => !n.isRead);

  return (
    <div className="min-h-screen bg-sen-black">
      <PageHeader title="Notifications" description={`${unread.length} unread notification${unread.length !== 1 ? 's' : ''}`}>
        {unread.length > 0 && (
          <button onClick={handleMarkAllRead} className="btn-ghost text-sm mt-3 flex items-center gap-2">
            <FiCheck size={14} /> Mark all read
          </button>
        )}
      </PageHeader>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-sen-border border-t-primary-500 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" title="No notifications" description="You're all caught up! Notifications will appear here." />
        ) : (
          <div className="space-y-2">
            {notifications.map((n, i) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  !n.isRead ? 'bg-primary-500/5 border-primary-500/20' : 'bg-sen-card border-sen-border'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-sen-dark flex items-center justify-center flex-shrink-0 text-xl">
                  {NOTIF_ICONS[n.type] || '📢'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold font-heading">{n.title}</p>
                  <p className="text-sen-muted text-sm font-body mt-0.5">{n.message}</p>
                  <p className="text-sen-muted text-xs mt-1.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                  {n.link && (
                    <Link to={n.link} className="text-primary-400 text-xs hover:underline mt-1 inline-block">
                      View details →
                    </Link>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary-500 mt-1" />}
                  <button
                    onClick={() => handleDelete(n._id)}
                    className="text-sen-muted hover:text-red-400 transition-colors p-1"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
