import { apiRequest } from './queryClient';

const API_URL = process.env.NODE_ENV === 'production' 
  ? process.env.VITE_API_URL || 'https://api.shoot-xyz.com' 
  : 'http://localhost:5000';

// Auth API
export const registerUser = async (userData) => {
  const { username, email, password } = userData;
  return await apiRequest('POST', `${API_URL}/api/auth/register`, {
    data: {
      username,
      email,
      password,
      role: 'user' // Default role for new users
    }
  });
};

export const loginUser = async (credentials) => {
  console.log('Attempting login with credentials:', { ...credentials, password: '[REDACTED]' });
  const response = await apiRequest('POST', `${API_URL}/api/auth/login`, credentials);
  console.log('Login response data:', response);
  return response;
};

export const logoutUser = async () => {
  return await apiRequest('POST', `${API_URL}/api/auth/logout`);
};

// User API
export const getCurrentUser = async () => {
  return await apiRequest('GET', `${API_URL}/api/users/me`);
};

export const updateUserProfile = async (userData) => {
  return await apiRequest('PUT', `${API_URL}/api/users/me`, userData);
};

// Products API
export const fetchProducts = async ({ queryKey }) => {
  const [_, filters, page] = queryKey;
  const queryParams = new URLSearchParams();
  
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  
  queryParams.append('min', filters.priceRange[0]);
  queryParams.append('max', filters.priceRange[1]);
  
  if (filters.rating > 0) {
    queryParams.append('rating', filters.rating);
  }
  
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  
  if (filters.sort !== 'featured') {
    queryParams.append('sort', filters.sort);
  }
  
  queryParams.append('page', page);
  
  const response = await apiRequest('GET', `${API_URL}/api/products?${queryParams.toString()}`);
  return response;
};

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_URL}/api/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching product: ${response.statusText}`);
  }
  
  return await response.json();
};

// Categories API
export const fetchCategories = async () => {
  const response = await apiRequest('GET', `${API_URL}/api/categories`);
  return response;
};

// Cart API
export const fetchCart = async () => {
  try {
    const response = await apiRequest('GET', '/api/cart');
    console.log('Fetch cart response:', response);
    return response;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

export const addToCart = async (productId, quantity) => {
  try {
    const response = await apiRequest('POST', '/api/cart/items', {
      productId,
      quantity
    });
    console.log('Add to cart response:', response);
    return response;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await apiRequest('PUT', `/api/cart/items/${itemId}`, {
      quantity
    });
    console.log('Update cart item response:', response);
    return response;
  } catch (error) {
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await apiRequest('DELETE', `/api/cart/items/${itemId}`);
    console.log('Remove cart item response:', response);
    return response;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await apiRequest('DELETE', '/api/cart');
    console.log('Clear cart response:', response);
    return response;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Address API
export const fetchAddresses = async () => {
  return await apiRequest('GET', `${API_URL}/api/addresses`);
};

export const addAddress = async (addressData) => {
  return await apiRequest('POST', `${API_URL}/api/addresses`, addressData);
};

export const updateAddress = async (addressId, addressData) => {
  return await apiRequest('PUT', `${API_URL}/api/addresses/${addressId}`, addressData);
};

export const deleteAddress = async (addressId) => {
  return await apiRequest('DELETE', `${API_URL}/api/addresses/${addressId}`);
};

// Order API
export const createOrder = async (orderData) => {
  return await apiRequest('POST', `${API_URL}/api/orders`, orderData);
};

export const fetchOrders = async () => {
  return await apiRequest('GET', `${API_URL}/api/orders`);
};

export const fetchOrderById = async (orderId) => {
  return await apiRequest('GET', `${API_URL}/api/orders/${orderId}`);
};

// Order API functions
export const getUserOrders = () => {
  return apiRequest('GET', '/orders');
};

export const getOrderDetails = (orderId) => {
  return apiRequest('GET', `/orders/${orderId}`);
};
