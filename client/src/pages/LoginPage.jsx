import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const LoginPage = () => {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const mutation = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/auth/login', data),
    onSuccess: (data) => {
      login(data.token, data.user);
      toast.success('Login successful');
      
      // Redirect based on user role
      if (data.user.role === 'admin') {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/');
      }
    },
    onError: (error) => {
      toast.error(error.message || 'Login failed');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-8">Login</h1>
      
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
            id="email"
            name="email"
              type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
            id="password"
            name="password"
              type="password"
            value={formData.password}
            onChange={handleChange}
            required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Logging in...' : 'Login'}
          </Button>
        
          <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setLocation('/register')}
                className="text-blue-600 hover:underline"
              >
                Register
              </button>
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;