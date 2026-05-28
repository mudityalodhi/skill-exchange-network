import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const NotFoundPage = () => (
  <div className="min-h-screen bg-sen-black flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="text-8xl mb-6"
      >
        🔍
      </motion.div>
      <h1 className="text-8xl font-heading font-bold gradient-text mb-4">404</h1>
      <h2 className="text-2xl font-heading font-semibold text-white mb-3">Page Not Found</h2>
      <p className="text-sen-muted font-body max-w-sm mx-auto mb-8">
        Looks like this page went on a skill exchange and never came back. Let's get you home.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/" className="btn-primary px-8">
          <FiArrowLeft size={16} /> Go Home
        </Link>
        <Link to="/explore" className="btn-secondary px-8">
          Explore Skills
        </Link>
      </div>
    </motion.div>
  </div>
);

export default NotFoundPage;
