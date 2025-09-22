import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigateToLogin = () => {
    navigate('/login', { state: { from: location } });
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  const navigateToDashboard = () => {
    navigate('/');
  };

  const navigateToDocumentFeed = () => {
    navigate('/document-feed');
  };

  const navigateToCommunication = () => {
    navigate('/communication');
  };

  const navigateToAudit = () => {
    navigate('/audit');
  };

  const handleLogout = () => {
    logout();
    navigateToLogin();
  };

  const canAccess = (path: string, requiredRole?: string) => {
    if (!user) return false;
    if (requiredRole && user.role !== requiredRole) return false;
    return true;
  };

  const getRedirectPath = () => {
    const from = location.state?.from?.pathname;
    if (from && from !== '/login' && from !== '/signup') {
      return from;
    }
    return '/';
  };

  return {
    navigate,
    location,
    user,
    navigateToLogin,
    navigateToProfile,
    navigateToDashboard,
    navigateToDocumentFeed,
    navigateToCommunication,
    navigateToAudit,
    handleLogout,
    canAccess,
    getRedirectPath,
  };
};
