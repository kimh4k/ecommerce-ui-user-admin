import { QueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Create a new QueryClient instance
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorData = error.response?.data || error;
    
    // Only handle specific auth errors
    if (error.response?.status === 401) {
      const errorCode = errorData.code;
      
      // Only redirect for specific auth errors
      if (['TOKEN_EXPIRED', 'TOKEN_INVALID', 'NO_TOKEN'].includes(errorCode)) {
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(errorData);
  }
);

// API request helper function
export const apiRequest = async (method, url, data = null) => {
  try {
    const token = localStorage.getItem('token');
    if (!token && !url.includes('/auth/')) {
      throw new Error('Authentication required');
    }

    const response = await axiosInstance({
      method,
      url,
      data,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    });
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}; 