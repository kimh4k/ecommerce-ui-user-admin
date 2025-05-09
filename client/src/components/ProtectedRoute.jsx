import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading, validateToken } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading) {
        if (!user) {
          // Try to validate token before redirecting
          await validateToken();
          if (!user) {
            setLocation('/login');
          }
        } else if (requiredRole && user.role !== requiredRole) {
          setLocation('/');
        }
      }
    };

    checkAuth();
  }, [user, isLoading, requiredRole, setLocation, validateToken]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user || (requiredRole && user.role !== requiredRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute; 