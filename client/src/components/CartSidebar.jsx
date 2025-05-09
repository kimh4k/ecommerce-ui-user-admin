import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/utils';
import { X, Trash2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';

const CartSidebar = () => {
  const { 
    cart,
    isCartOpen, 
    toggleCart, 
    removeCartItem, 
    updateCartItem
  } = useContext(CartContext);
  const { user, validateToken } = useAuth();
  const [, setLocation] = useLocation();

  const handleCheckout = async () => {
    await validateToken();
    if (!user) {
      toggleCart();
      setLocation('/login');
      return;
    }
    toggleCart();
    setLocation('/checkout');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(itemId, newQuantity);
  };

  return (
    <>
      <div 
        className={`cart-sidebar fixed right-0 top-0 h-full w-full md:w-[400px] bg-white shadow-xl z-40 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}
      >
        <div className="flex flex-col h-full">
          <div className="py-6 px-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="uppercase text-base font-normal tracking-wide">Your Cart</h2>
            <button className="text-black hover:opacity-70" onClick={toggleCart}>
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-6">
            {cart?.items?.length > 0 ? (
              cart.items.map((item) => (
                <div className="flex py-4 border-b border-gray-100" key={item.id}>
                  <div className="w-24 h-32 bg-gray-50 flex-shrink-0">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm">{item.product.name}</h3>
                        <p className="text-xs text-gray-500 uppercase mt-1">{item.product.brand}</p>
                      </div>
                      <button 
                        className="text-black hover:opacity-70" 
                        onClick={() => removeCartItem(item.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border border-gray-200">
                        <button 
                          className="w-7 h-7 flex items-center justify-center" 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          key={`decrease-${item.id}`}
                        >-</button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 flex items-center justify-center" 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          key={`increase-${item.id}`}
                        >+</button>
                      </div>
                      <span className="text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center" key="empty-cart">
                <p className="text-gray-500 mb-8">Your cart is empty</p>
                <Link 
                  href="/products" 
                  className="inline-block bg-black text-white uppercase text-xs tracking-wider py-3 px-6 hover:bg-gray-800 transition-colors"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </Link>
              </div>
            )}
          </div>
          
          {cart?.items?.length > 0 && (
            <div className="py-6 px-6 border-t border-gray-200" key="cart-summary">
              <div className="flex justify-between mb-2" key="subtotal">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm">{formatPrice(cart.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between mb-4" key="shipping">
                <span className="text-sm">Shipping</span>
                <span className="text-sm">{formatPrice(cart.shipping || 0)}</span>
              </div>
              <div className="flex justify-between text-base mb-6" key="total">
                <span className="font-medium">Total</span>
                <span className="font-medium">{formatPrice(cart.total || 0)}</span>
              </div>
              <div className="space-y-3">
                <button 
                  key="checkout"
                  className="w-full bg-black text-white py-3 uppercase text-xs tracking-wider hover:bg-gray-800 transition-colors"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
                <button 
                  key="continue-shopping"
                  className="w-full border border-black py-3 uppercase text-xs tracking-wider hover:bg-gray-100 transition-colors"
                  onClick={toggleCart}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay for cart sidebar */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-30" 
          onClick={toggleCart}
        ></div>
      )}
    </>
  );
};

export default CartSidebar;
