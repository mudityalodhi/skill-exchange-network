import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';

import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Public Pages
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import AboutPage from './pages/AboutPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ProfilePage from './pages/ProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Private Pages
import DashboardPage from './pages/DashboardPage';
import MyProfilePage from './pages/MyProfilePage';
import ExchangesPage from './pages/ExchangesPage';
import ExchangeDetailPage from './pages/ExchangeDetailPage';
import MessagesPage from './pages/MessagesPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Routes>
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Main Layout Routes */}
            <Route element={<MainLayout />}>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:slug" element={<ArticleDetailPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />

              {/* Protected */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/my-profile" element={<MyProfilePage />} />
                <Route path="/exchanges" element={<ExchangesPage />} />
                <Route path="/exchanges/:id" element={<ExchangeDetailPage />} />
                <Route path="/messages" element={<MessagesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
