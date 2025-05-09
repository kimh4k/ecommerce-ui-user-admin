import { Link } from 'wouter';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-black border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 py-16">
          <div>
            <h3 className="uppercase text-sm font-normal tracking-wider mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-gray-600 hover:text-black text-sm">All Products</Link></li>
              <li><Link href="/products?category=1" className="text-gray-600 hover:text-black text-sm">Tops</Link></li>
              <li><Link href="/products?category=2" className="text-gray-600 hover:text-black text-sm">Bottoms</Link></li>
              <li><Link href="/products?category=3" className="text-gray-600 hover:text-black text-sm">Accessories</Link></li>
              <li><Link href="/products?sale=true" className="text-gray-600 hover:text-black text-sm">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase text-sm font-normal tracking-wider mb-6">Help</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Shipping & Returns</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Store Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Payment Methods</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase text-sm font-normal tracking-wider mb-6">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Our Story</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Sustainability</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-black text-sm">Legal</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="uppercase text-sm font-normal tracking-wider mb-6">Follow Us</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-black hover:opacity-70 transition-opacity">
                <Youtube size={18} />
              </a>
            </div>
            <p className="text-sm text-gray-600 mb-2">Join our mailing list</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Email" 
                className="flex-1 border border-gray-300 border-r-0 py-2 px-3 text-sm focus:outline-none focus:border-black"
                required
              />
              <button 
                type="submit" 
                className="bg-black text-white text-sm py-2 px-4 uppercase tracking-wider hover:bg-gray-800"
              >
                Join
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-200 px-6 py-6 text-center md:text-left">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} SHOOT. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
