import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import LoadingScreen from '../components/common/LoadingScreen';

const AuthLayout = () => {
  const { isAuth, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (isAuth) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-sen-black flex items-center justify-center relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Animated blobs */}
      <motion.div
        className="absolute top-1/4 -left-32 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 w-96 h-96 bg-sen-green/8 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <a href="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">S</span>
            </div>
            <span className="text-2xl font-heading font-bold text-white">
              SEN<span className="text-primary-500">.</span>
            </span>
          </a>
          <p className="text-sen-muted text-sm mt-2 font-body">Skill Exchange Network</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card-glass p-8 rounded-2xl border border-white/10"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
