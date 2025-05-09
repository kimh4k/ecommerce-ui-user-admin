import { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, User, Menu, ChevronDown, LogOut } from 'lucide-react';
import CartSidebar from './CartSidebar';
import { CartContext } from '../context/CartContext';
import { getCurrentUser, logoutUser } from '../lib/api';
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { cart, toggleCart, isAuthenticated } = useContext(CartContext);
  const { user, logout } = useAuth();

  // Fetch current user on mount if authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetchCurrentUser();
    }
  }, [isAuthenticated]);

  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to fetch current user', error);
      // If token is invalid, clear it
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem('authToken');
      setCurrentUser(null);
      setUserMenuOpen(false);
      
      // Redirect to home page
      setLocation('/');
      
      // Reload page to reset all states
      window.location.reload();
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
    }
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (mobileSearchOpen) setMobileSearchOpen(false);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  // Toggle mobile search
  const toggleSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (userMenuOpen) setUserMenuOpen(false);
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
    if (mobileSearchOpen) setMobileSearchOpen(false);
  };

  // Close menus when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  // Calculate total cart items
  const totalItems = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <header className="bg-white sticky top-0 z-30 border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold uppercase tracking-wider">
              SHOOT
            </Link>
          </div>

          {/* Navigation - Center */}
          <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
            <ul className="flex space-x-10">
              <li>
                <Link 
                  href="/products" 
                  className={`uppercase text-sm font-normal tracking-wide hover:opacity-70 transition-opacity ${location === '/products' ? 'opacity-100' : 'opacity-80'}`}
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=1" 
                  className={`uppercase text-sm font-normal tracking-wide hover:opacity-70 transition-opacity ${location.includes('category=1') ? 'opacity-100' : 'opacity-80'}`}
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=2" 
                  className={`uppercase text-sm font-normal tracking-wide hover:opacity-70 transition-opacity ${location.includes('category=2') ? 'opacity-100' : 'opacity-80'}`}
                >
                  Bottoms
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=3" 
                  className={`uppercase text-sm font-normal tracking-wide hover:opacity-70 transition-opacity ${location.includes('category=3') ? 'opacity-100' : 'opacity-80'}`}
                >
                  Accessories
                </Link>
              </li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button onClick={toggleSearch} className="text-black hover:opacity-70 transition-opacity">
              <Search size={20} />
            </button>
            <button onClick={toggleCart} className="text-black hover:opacity-70 transition-opacity">
              <div className="relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
            
            {/* User account */}
            <div className="relative hidden md:block">
              <button 
                onClick={toggleUserMenu} 
                className="text-black hover:opacity-70 transition-opacity flex items-center"
              >
                <User size={20} />
                <ChevronDown size={16} className={`ml-1 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* User dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-gray-200 shadow-lg z-50">
                  {user ? (
                    <>
                      <div className="p-4 border-b border-gray-100">
                        <p className="text-sm font-medium">{user.name || user.username}</p>
                        {user.email && (
                          <p className="text-xs text-gray-500 mt-1">{user.email}</p>
                        )}
                      </div>
                      <div className="p-2">
                        <Link 
                          href="/profile" 
                          className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          My Profile
                        </Link>
                        <Link 
                          href="/orders" 
                          className="block px-4 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-4">
                      <Link 
                        href="/login" 
                        className="block w-full text-center bg-black text-white py-2 rounded mb-2"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link 
                        href="/register" 
                        className="block w-full text-center border border-black py-2 rounded"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Create Account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <button onClick={toggleMobileMenu} className="md:hidden text-black hover:opacity-70 transition-opacity">
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar (Hidden by default) */}
        {mobileSearchOpen && (
          <div className="py-4 border-t border-gray-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full py-2 px-4 border-b border-gray-300 focus:outline-none focus:border-black"
                value={searchQuery}
                onChange={handleSearch}
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-400">
                <Search size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Menu (Hidden by default) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-4 py-2">
              <li>
                <Link 
                  href="/products" 
                  className="block uppercase text-sm font-medium py-2 tracking-wide"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=1" 
                  className="block uppercase text-sm font-medium py-2 tracking-wide"
                >
                  Tops
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=2" 
                  className="block uppercase text-sm font-medium py-2 tracking-wide"
                >
                  Bottoms
                </Link>
              </li>
              <li>
                <Link 
                  href="/products?category=3" 
                  className="block uppercase text-sm font-medium py-2 tracking-wide"
                >
                  Accessories
                </Link>
              </li>
              <div className="border-t border-gray-100 my-2"></div>
              {user ? (
                <>
                  <li>
                    <Link 
                      href="/profile" 
                      className="block uppercase text-sm font-medium py-2 tracking-wide"
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/orders" 
                      className="block uppercase text-sm font-medium py-2 tracking-wide"
                    >
                      Orders
                    </Link>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left uppercase text-sm font-medium py-2 tracking-wide"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link 
                      href="/login" 
                      className="block uppercase text-sm font-medium py-2 tracking-wide"
                    >
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link 
                      href="/register" 
                      className="block uppercase text-sm font-medium py-2 tracking-wide"
                    >
                      Create Account
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      )}
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </header>
  );
};

export default Header;
