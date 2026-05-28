import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

// ==================== LOADING SCREEN ====================
export const LoadingScreen = () => (
  <div className="fixed inset-0 bg-sen-black flex items-center justify-center z-50">
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-10 h-10 rounded-full border-2 border-sen-border border-t-primary-500"
      />
      <span className="text-sen-muted text-sm font-body">Loading SEN...</span>
    </div>
  </div>
);

export default LoadingScreen;

// ==================== SCROLL TO TOP ====================
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// ==================== SKELETON LOADER ====================
export const SkeletonCard = () => (
  <div className="card animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 rounded-full skeleton" />
      <div className="flex-1">
        <div className="h-4 skeleton rounded w-3/4 mb-2" />
        <div className="h-3 skeleton rounded w-1/2" />
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 skeleton rounded" />
      <div className="h-3 skeleton rounded w-5/6" />
      <div className="h-3 skeleton rounded w-4/6" />
    </div>
  </div>
);

// ==================== EMPTY STATE ====================
export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="text-6xl mb-4">{icon || '🎯'}</div>
    <h3 className="text-xl font-heading font-semibold text-white mb-2">{title}</h3>
    <p className="text-sen-muted font-body max-w-sm mb-6">{description}</p>
    {action}
  </div>
);

// ==================== STAR RATING ====================
export const StarRating = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg';
  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? 'text-yellow-400' : 'text-sen-border'}>
          ★
        </span>
      ))}
    </div>
  );
};

// ==================== AVATAR ====================
export const Avatar = ({ user, size = 'md' }) => {
  const sizeMap = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-2xl',
    '2xl': 'w-28 h-28 text-4xl',
  };

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user?.name || 'User'}
        className={`${sizeMap[size]} rounded-full object-cover ring-2 ring-sen-border`}
      />
    );
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-sen-border`}
    >
      <span className="text-white font-bold font-heading">
        {user?.name?.charAt(0).toUpperCase() || '?'}
      </span>
    </div>
  );
};

// ==================== SECTION HEADER ====================
export const SectionHeader = ({ tag, title, description, center = true }) => (
  <div className={`mb-12 ${center ? 'text-center' : ''}`}>
    {tag && <div className="section-tag">{tag}</div>}
    <h2 className="section-title">{title}</h2>
    {description && (
      <p className={`section-desc ${center ? 'mx-auto' : ''}`}>{description}</p>
    )}
  </div>
);

// ==================== CREDITS BADGE ====================
export const CreditsBadge = ({ credits }) => (
  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sen-green/10 border border-sen-green/20">
    <span className="text-sen-green text-xs">💰</span>
    <span className="text-sen-green font-bold text-sm">{credits}</span>
    <span className="text-sen-green/60 text-xs">credits</span>
  </div>
);

// ==================== ONLINE DOT ====================
export const OnlineDot = ({ isOnline }) => (
  <span
    className={`inline-block w-2.5 h-2.5 rounded-full ${
      isOnline ? 'bg-sen-green shadow-glow-green' : 'bg-sen-muted'
    }`}
  />
);

// ==================== PAGE HEADER ====================
export const PageHeader = ({ title, description, children }) => (
  <div className="pt-24 pb-10 px-4 sm:px-6 lg:px-8 border-b border-sen-border bg-sen-black">
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">{title}</h1>
      {description && <p className="text-sen-muted font-body">{description}</p>}
      {children}
    </div>
  </div>
);
