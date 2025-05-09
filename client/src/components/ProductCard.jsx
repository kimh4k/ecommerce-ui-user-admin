import { useContext, useState } from 'react';
import { Link } from 'wouter';
import { ShoppingCart, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '';
    // If it's already a full URL, return it as is
    if (imageUrl.startsWith('http')) return imageUrl;
    // If it's a relative path starting with /images, add the base URL
    if (imageUrl.startsWith('/images')) return `http://localhost:5000${imageUrl}`;
    // If it's just the filename, construct the full path
    return `http://localhost:5000/images/products/${imageUrl}`;
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      ...product,
      quantity: 1
    });
  };

  const handleImageError = () => {
    console.error('Image failed to load:', getImageUrl(product.imageUrl));
    setImageError(true);
  };

  return (
    <div 
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`}>
        <div className="aspect-[3/4] overflow-hidden bg-gray-100 mb-2">
          <img 
            src={imageError ? '/placeholder-image.jpg' : getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            onError={handleImageError}
            crossOrigin="anonymous"
          />
          {isHovered && (
            <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center transition-opacity duration-300">
              <button 
                className="bg-white text-black py-2 px-4 uppercase text-xs tracking-wider font-medium"
                onClick={handleAddToCart}
              >
                Quick Add
              </button>
            </div>
          )}
          {product.badge && (
            <div className="absolute top-0 left-0">
              <span className="inline-block bg-black text-white text-xs uppercase tracking-wider py-1 px-2">
                {product.badge}
              </span>
            </div>
          )}
        </div>
        <div className="text-left">
          <p className="text-xs text-gray-500 uppercase mb-1">{product.brand}</p>
          <h3 className="text-sm font-normal mb-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-sm font-normal">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through ml-2">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2 flex gap-1">
              {product.colors.map(color => (
                <div 
                  key={color.value}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                  title={color.value}
                ></div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
