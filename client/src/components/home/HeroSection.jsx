import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiPlay } from 'react-icons/fi';

const FLOATING_SKILLS = [
  { label: 'React.js', color: 'text-blue-400', x: '10%', y: '20%', delay: 0 },
  { label: 'UI/UX Design', color: 'text-purple-400', x: '80%', y: '15%', delay: 0.5 },
  { label: 'Public Speaking', color: 'text-yellow-400', x: '75%', y: '65%', delay: 1 },
  { label: 'Python', color: 'text-green-400', x: '8%', y: '70%', delay: 1.5 },
  { label: 'Photoshop', color: 'text-pink-400', x: '50%', y: '80%', delay: 0.8 },
  { label: 'Video Editing', color: 'text-orange-400', x: '88%', y: '40%', delay: 0.3 },
];

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/explore?search=${encodeURIComponent(query)}`);
    else navigate('/explore');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sen-black">
      {/* Gradient background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-mesh" />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Floating skill badges (desktop only) */}
      {FLOATING_SKILLS.map(({ label, color, x, y, delay }) => (
        <motion.div
          key={label}
          className="absolute hidden lg:block pointer-events-none"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.7, y: [0, -12, 0] }}
          transition={{
            opacity: { delay: delay + 0.5, duration: 0.6 },
            y: { delay, duration: 4 + delay, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <div className="bg-sen-card border border-sen-border rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className={`text-xs font-semibold font-body ${color}`}>{label}</span>
          </div>
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-semibold font-body mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          🔥 Exchange Skills. Earn Credits. Grow Together.
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight mb-6"
        >
          Learn Skills.{' '}
          <span className="relative inline-block">
            <span className="gradient-text">Teach Skills.</span>
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-sen-green"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </span>
          <br />
          No Money Needed.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-sen-muted font-body max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          SEN connects people who want to learn with those who can teach — using a credit-based barter system. No fees, just pure knowledge exchange.
        </motion.p>

        {/* Search Bar */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-2 max-w-xl mx-auto mb-10 bg-sen-card border border-sen-border rounded-2xl p-2 shadow-card focus-within:border-primary-500/50 transition-all duration-300"
        >
          <FiSearch className="ml-2 text-sen-muted flex-shrink-0" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills (e.g., React, Photoshop, Guitar...)"
            className="flex-1 bg-transparent text-white placeholder:text-sen-muted text-sm font-body focus:outline-none py-2"
          />
          <button type="submit" className="btn-primary text-sm py-2 px-4 flex-shrink-0">
            Search
          </button>
        </motion.form>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/register" className="btn-primary text-base px-8 py-3.5">
            Start Exchanging Free
            <FiArrowRight />
          </Link>
          <Link to="/explore" className="btn-secondary text-base px-8 py-3.5 flex items-center gap-2">
            <FiPlay size={16} />
            Explore Skills
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-sen-muted font-body"
        >
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {['🧑', '👩', '👨', '🧕'].map((emoji, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-sen-card border-2 border-sen-black flex items-center justify-center text-sm"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <span>5,000+ members</span>
          </div>
          <span className="hidden sm:block text-sen-border">•</span>
          <span>⭐ 4.9/5 average rating</span>
          <span className="hidden sm:block text-sen-border">•</span>
          <span>🔄 10,000+ exchanges done</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-sen-border flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 bg-primary-500 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
