import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../lib/queryClient';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const validateToken = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const userData = await apiRequest('GET', '/api/users/profile');
      setUser(userData);
    } catch (error) {
      console.error('Token validation failed:', error);
      // Only clear token if it's an authentication error
      if (error.status === 401 || error.message?.includes('unauthorized')) {
        localStorage.removeItem('token');
        setUser(null);
        setLocation('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  const login = async (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of server response
      localStorage.removeItem('token');
      setUser(null);
      queryClient.clear();
      setLocation('/login');
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    validateToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 