import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Please fill all fields.');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Welcome back</h2>
      <p className="text-sen-muted text-sm font-body mb-8">Sign in to your SEN account</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input pl-10"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input
              name="password"
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              className="input pl-10 pr-10"
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sen-muted hover:text-white"
            >
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
              />
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sen-muted text-sm font-body mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-semibold">
          Sign up free
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
