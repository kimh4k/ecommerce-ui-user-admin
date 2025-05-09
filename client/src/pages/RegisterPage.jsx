import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { registerUser } from '../lib/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...registrationData } = formData;
      
      const response = await registerUser(registrationData);
      
      // Store auth token in localStorage if provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        // Redirect to home page
        setLocation('/');
        // Reload page to reset auth state
        window.location.reload();
      } else {
        // Redirect to login page on successful registration without token
        setLocation('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-16 px-4">
      <h1 className="text-2xl font-normal uppercase tracking-wider text-center mb-8">Create Account</h1>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm uppercase tracking-wider mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm uppercase tracking-wider mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long</p>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm uppercase tracking-wider mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-3 py-2 focus:outline-none focus:border-black"
          />
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white uppercase text-sm tracking-wider py-3 hover:bg-gray-800 transition-colors disabled:opacity-70"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-black hover:opacity-70">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;