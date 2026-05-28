import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('sen_token'));

  const loadUser = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const { data } = await api.get('/auth/me');
      setUser(data.user);
    } catch {
      localStorage.removeItem('sen_token');
      setToken(null);
      setUser(null);
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sen_token', data.token);
    setToken(data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    toast.success(`Welcome back, ${data.user.name}! 👋`);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('sen_token', data.token);
    setToken(data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    toast.success('Account created! Welcome to SEN 🎉');
    return data;
  };

  const logout = () => {
    localStorage.removeItem('sen_token');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    toast.success('Logged out successfully.');
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, updateUser, refreshUser, isAuth: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
