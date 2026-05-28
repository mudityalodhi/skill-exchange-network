import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/common/LoadingScreen';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading, isAuth } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
