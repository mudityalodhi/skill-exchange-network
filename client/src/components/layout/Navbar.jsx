import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiX, FiSun, FiMoon, FiBell, FiMessageCircle,
  FiUser, FiLogOut, FiGrid, FiRepeat, FiChevronDown,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useSocket } from '../../context/SocketContext';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/explore', label: 'Explore' },
  { to: '/articles', label: 'Articles' },
  { to: '/about', label: 'About' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout, isAuth } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { unreadNotifications } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-sen-black/90 backdrop-blur-xl border-b border-sen-border shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center group-hover:shadow-glow-red transition-all duration-300">
                <span className="text-white font-heading font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-heading font-bold text-white">
                SEN<span className="text-primary-500">.</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-200 ${
                      isActive
                        ? 'text-primary-400 bg-primary-500/10'
                        : 'text-sen-muted hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-sen-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
              </button>

              {isAuth ? (
                <>
                  {/* Notifications */}
                  <Link
                    to="/notifications"
                    className="relative p-2 rounded-lg text-sen-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <FiBell size={18} />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-primary-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </Link>

                  {/* Messages */}
                  <Link
                    to="/messages"
                    className="p-2 rounded-lg text-sen-muted hover:text-white hover:bg-white/5 transition-all duration-200"
                  >
                    <FiMessageCircle size={18} />
                  </Link>

                  {/* User Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen((p) => !p)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sen-card border border-sen-border hover:border-primary-500/50 transition-all duration-200"
                    >
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-white hidden sm:block max-w-24 truncate">
                        {user?.name}
                      </span>
                      <FiChevronDown
                        size={14}
                        className={`text-sen-muted transition-transform duration-200 ${
                          dropdownOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 bg-sen-card border border-sen-border rounded-xl shadow-2xl overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-sen-border">
                            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                            <p className="text-sen-muted text-xs truncate">{user?.email}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-sen-green text-xs font-bold">{user?.credits}</span>
                              <span className="text-sen-muted text-xs">SEN Credits</span>
                            </div>
                          </div>

                          {[
                            { to: '/dashboard', icon: <FiGrid size={15} />, label: 'Dashboard' },
                            { to: '/my-profile', icon: <FiUser size={15} />, label: 'My Profile' },
                            { to: '/exchanges', icon: <FiRepeat size={15} />, label: 'Exchanges' },
                          ].map(({ to, icon, label }) => (
                            <Link
                              key={to}
                              to={to}
                              className="flex items-center gap-3 px-4 py-2.5 text-sen-muted hover:text-white hover:bg-white/5 text-sm transition-colors duration-150"
                            >
                              {icon}
                              {label}
                            </Link>
                          ))}

                          <div className="border-t border-sen-border">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 w-full px-4 py-2.5 text-primary-400 hover:bg-primary-500/10 text-sm transition-colors duration-150"
                            >
                              <FiLogOut size={15} />
                              Logout
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm py-2">
                    Log In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm py-2 px-4">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 rounded-lg text-sen-muted hover:text-white hover:bg-white/5"
                onClick={() => setIsOpen((p) => !p)}
              >
                {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-sen-black/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col h-full pt-20 px-6 pb-8">
              <nav className="flex flex-col gap-2 flex-1">
                {NAV_LINKS.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-3 rounded-xl text-lg font-medium font-body transition-colors duration-200 ${
                        isActive
                          ? 'text-primary-400 bg-primary-500/10'
                          : 'text-sen-muted hover:text-white hover:bg-white/5'
                      }`
                    }
                  >
                    {label}
                  </NavLink>
                ))}

                {isAuth && (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-lg font-medium text-sen-muted hover:text-white hover:bg-white/5 font-body">
                      Dashboard
                    </Link>
                    <Link to="/my-profile" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-lg font-medium text-sen-muted hover:text-white hover:bg-white/5 font-body">
                      My Profile
                    </Link>
                    <Link to="/exchanges" onClick={() => setIsOpen(false)} className="px-4 py-3 rounded-xl text-lg font-medium text-sen-muted hover:text-white hover:bg-white/5 font-body">
                      Exchanges
                    </Link>
                  </>
                )}
              </nav>

              <div className="flex flex-col gap-3 mt-auto">
                {isAuth ? (
                  <button onClick={handleLogout} className="btn-primary w-full justify-center">
                    <FiLogOut size={16} /> Logout
                  </button>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)} className="btn-secondary w-full justify-center">
                      Log In
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-primary w-full justify-center">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
