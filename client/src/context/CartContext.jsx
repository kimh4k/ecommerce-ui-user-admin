import { createContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchCart, 
  addToCart as apiAddToCart, 
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart
} from '../lib/api';
import { useAuth } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Load cart from API
  const loadCartFromAPI = useCallback(async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const response = await fetchCart();
      if (response) {
        console.log('Cart loaded:', response);
        setCart(response);
      }
    } catch (error) {
      console.error('Failed to load cart from API', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);
  
  // Load cart when user changes
  useEffect(() => {
    if (user) {
      loadCartFromAPI();
    } else {
      setCart(null);
    }
  }, [user, loadCartFromAPI]);
  
  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };
  
  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      setIsLoading(true);
      setLastAddedItem(product);
      
      if (user) {
        const response = await apiAddToCart(product.id, quantity);
        await loadCartFromAPI(); // Reload cart after adding item
      } else {
        // Handle local cart for non-authenticated users
        const existingItem = cart?.items?.find(item => item.product.id === product.id);
        let newCart = { ...cart };
        
        if (existingItem) {
          newCart.items = cart.items.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newCart.items = [
            ...(cart?.items || []),
            { product, quantity }
          ];
        }
        setCart(newCart);
      }
    } catch (error) {
      console.error('Failed to add item to cart', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      setIsLoading(true);
      if (user) {
        await apiUpdateCartItem(itemId, quantity);
        await loadCartFromAPI();
      } else {
        const newCart = {
          ...cart,
          items: cart.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        };
        setCart(newCart);
      }
    } catch (error) {
      console.error('Failed to update cart item', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeCartItem = async (itemId) => {
    try {
      setIsLoading(true);
      if (user) {
        await apiRemoveCartItem(itemId);
        await loadCartFromAPI();
      } else {
        const newCart = {
          ...cart,
          items: cart.items.filter(item => item.id !== itemId)
        };
        setCart(newCart);
      }
    } catch (error) {
      console.error('Failed to remove cart item', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      setIsLoading(true);
      if (user) {
        await apiClearCart();
        await loadCartFromAPI();
      } else {
        setCart({ items: [] });
      }
    } catch (error) {
      console.error('Failed to clear cart', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    cart,
    setCart,
    isCartOpen,
    toggleCart,
    lastAddedItem,
    setLastAddedItem,
    isLoading,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    loadCartFromAPI
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
