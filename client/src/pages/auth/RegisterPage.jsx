import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) return toast.error('All fields are required.');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return toast.error('Passwords do not match.');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0
    : form.password.length < 6 ? 1
    : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div>
      <h2 className="text-2xl font-heading font-bold text-white mb-1">Create your account</h2>
      <p className="text-sen-muted text-sm font-body mb-8">
        Join free and get <span className="text-sen-green font-semibold">50 starter credits</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input name="name" type="text" value={form.name} onChange={handleChange} className="input pl-10" placeholder="Your full name" />
          </div>
        </div>

        <div>
          <label className="label">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input pl-10" placeholder="you@example.com" />
          </div>
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input
              name="password" type={showPass ? 'text' : 'password'}
              value={form.password} onChange={handleChange}
              className="input pl-10 pr-10" placeholder="Min. 6 characters"
            />
            <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sen-muted hover:text-white">
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength ? strengthColor[strength] : 'bg-sen-border'}`} />
                ))}
              </div>
              <p className={`text-xs mt-1 font-body ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-yellow-400' : 'text-green-400'}`}>
                {strengthLabel[strength]} password
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-sen-muted" size={16} />
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="input pl-10" placeholder="Repeat your password" />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3.5 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
              Creating account...
            </span>
          ) : 'Create Free Account'}
        </button>

        <p className="text-center text-sen-muted text-xs font-body">
          By signing up, you agree to our{' '}
          <span className="text-primary-400 cursor-pointer">Terms of Service</span> and{' '}
          <span className="text-primary-400 cursor-pointer">Privacy Policy</span>
        </p>
      </form>

      <p className="text-center text-sen-muted text-sm font-body mt-5">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-semibold">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
