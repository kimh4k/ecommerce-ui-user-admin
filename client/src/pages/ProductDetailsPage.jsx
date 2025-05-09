import { useContext, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { ArrowLeft, Minus, Plus, Heart, ShoppingCart, CheckCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from '@/components/ProductCard';
import { apiRequest } from '../lib/queryClient';

const ProductDetailsPage = () => {
  const [, params] = useRoute('/product/:id');
  const productId = params?.id;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const { addToCart } = useContext(CartContext);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['/api/products', productId],
    queryFn: () => apiRequest('GET', `/api/products/${productId}`),
    enabled: !!productId,
  });
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/products" className="text-primary hover:underline flex items-center">
            <ArrowLeft size={16} className="mr-1" /> Back to products
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <Skeleton className="w-full h-96 md:h-[500px] rounded-xl" />
          </div>
          
          <div className="md:w-1/2">
            <Skeleton className="h-10 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-6" />
            
            <Skeleton className="h-24 w-full mb-6" />
            
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-10 w-full mb-4" />
            
            <div className="flex gap-4 mt-8">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Product</h2>
        <p className="mb-6">We couldn't find the product you're looking for.</p>
        <Link href="/products" className="bg-primary text-white px-6 py-2 rounded-lg">
          Browse Products
        </Link>
      </div>
    );
  }
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: getImageUrl(product.imageUrl),
      brand: product.brand,
      quantity,
      color: selectedColor
    });
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/products" className="text-primary hover:underline flex items-center">
          <ArrowLeft size={16} className="mr-1" /> Back to products
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img 
            src={getImageUrl(product.imageUrl)} 
            alt={product.name} 
            className="w-full h-auto rounded-xl shadow-md object-cover"
          />
        </div>
        
        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-2">{product.brand}</p>
          
          {/* Rating */}
          {product.rating && (
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-accent">
                  {i < Math.floor(product.rating) ? 
                    <span>★</span> : 
                    i < product.rating ? 
                      <span>⭐</span> : 
                      <span className="text-gray-300">☆</span>
                  }
                </span>
              ))}
              {product.reviews && (
                <span className="text-sm text-gray-500 ml-2">({product.reviews} reviews)</span>
              )}
            </div>
          )}
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold mr-2">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
            )}
            {product.discount && (
              <span className="ml-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                {product.discount}% OFF
              </span>
            )}
          </div>
          
          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map(color => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedColor === color.value ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.value)}
                    aria-label={color.value}
                  >
                    {selectedColor === color.value && <CheckCircle className="h-4 w-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Quantity */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-md inline-flex">
              <button 
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                onClick={decrementQuantity}
              >
                <Minus size={16} />
              </button>
              <span className="px-4 py-2 border-l border-r border-gray-300">{quantity}</span>
              <button 
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                onClick={incrementQuantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <div className="flex gap-4">
            <button
              className="flex-1 bg-primary hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2" size={20} />
              Add to Cart
            </button>
            <button
              className={`h-12 w-12 border rounded-lg flex items-center justify-center ${
                isFavorite ? 'text-red-500 border-red-500' : 'text-gray-500 border-gray-300 hover:border-gray-500'
              }`}
              onClick={toggleFavorite}
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>
          
          {/* Additional Info */}
          <div className="mt-8 border-t pt-6">
            {product.inStock ? (
              <p className="flex items-center text-green-600">
                <CheckCircle size={16} className="mr-2" /> In Stock
              </p>
            ) : (
              <p className="text-red-500">Out of Stock</p>
            )}
            {product.shipping && (
              <p className="text-gray-700 mt-2">{product.shipping}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mb-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start border-b">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="py-4">
            <div className="prose max-w-none">
              <p>{product.fullDescription || product.description}</p>
            </div>
          </TabsContent>
          <TabsContent value="specifications" className="py-4">
            {product.specifications ? (
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="py-3 font-medium">{key}</td>
                      <td className="py-3">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No specifications available for this product.</p>
            )}
          </TabsContent>
          <TabsContent value="reviews" className="py-4">
            {product.reviewsList && product.reviewsList.length > 0 ? (
              <div className="space-y-6">
                {product.reviewsList.map((review, index) => (
                  <div key={index} className="border-b pb-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{review.name}</h4>
                      <span className="text-gray-500 text-sm">{review.date}</span>
                    </div>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-accent" : "text-gray-300"}>★</span>
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet for this product.</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
