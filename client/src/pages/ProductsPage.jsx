import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useRoute } from 'wouter';
import ProductCard from '@/components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Star } from 'lucide-react';
import Newsletter from '@/components/Newsletter';
import { fetchCategories, fetchProducts } from '@/lib/api';

const ProductsPage = () => {
  const [location] = useLocation();
  const [, params] = useRoute('/products/:category');
  
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000],
    rating: 0,
    search: '',
    sort: 'featured'
  });

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Parse URL search params for filtering
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    // Update filters from URL parameters
    const newFilters = { ...filters };
    
    if (searchParams.has('category')) {
      newFilters.category = searchParams.get('category');
    }
    
    if (searchParams.has('min') && searchParams.has('max')) {
      newFilters.priceRange = [
        parseInt(searchParams.get('min')), 
        parseInt(searchParams.get('max'))
      ];
    }
    
    if (searchParams.has('rating')) {
      newFilters.rating = parseInt(searchParams.get('rating'));
    }
    
    if (searchParams.has('search')) {
      newFilters.search = searchParams.get('search');
    }
    
    if (searchParams.has('sort')) {
      newFilters.sort = searchParams.get('sort');
    }
    
    if (searchParams.has('page')) {
      setCurrentPage(parseInt(searchParams.get('page')));
    }
    
    setFilters(newFilters);
  }, [location]);
  
  // Category from route parameter
  useEffect(() => {
    if (params?.category) {
      setFilters(prev => ({ ...prev, category: params.category }));
    }
  }, [params]);
  
  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: fetchCategories
  });
  
  // Fetch products with filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['/api/products', filters, currentPage],
    queryFn: fetchProducts
  });
  
  const products = productsData?.products || [];
  const totalPages = productsData?.pagination?.totalPages || 1;
  
  // Handler for filtering changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handler for price range changes
  const handlePriceChange = (value) => {
    setFilters(prev => ({ ...prev, priceRange: value }));
  };
  
  // Apply filters
  const applyFilters = () => {
    // Build query string
    const searchParams = new URLSearchParams();
    
    if (filters.category) {
      searchParams.append('category', filters.category);
    }
    
    searchParams.append('min', filters.priceRange[0]);
    searchParams.append('max', filters.priceRange[1]);
    
    if (filters.rating > 0) {
      searchParams.append('rating', filters.rating);
    }
    
    if (filters.search) {
      searchParams.append('search', filters.search);
    }
    
    if (filters.sort !== 'featured') {
      searchParams.append('sort', filters.sort);
    }
    
    if (currentPage > 1) {
      searchParams.append('page', currentPage);
    }
    
    const queryString = searchParams.toString();
    window.history.replaceState(
      null, 
      '', 
      queryString ? `?${queryString}` : window.location.pathname
    );
  };
  
  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [filters, currentPage]);
  
  return (
    <>
      <section className="py-12 bg-white" id="products">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Our Products</h2>
          
          <div className="flex flex-col md:flex-row md:space-x-6 mb-8">
            {/* Filters */}
            <div className="md:w-1/4 mb-6 md:mb-0">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-lg mb-4">Filters</h3>
                
                {/* Category Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Category</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="category-all" 
                        checked={!filters.category} 
                        onCheckedChange={() => handleFilterChange('category', '')}
                      />
                      <Label htmlFor="category-all">All</Label>
                    </div>
                    {categories?.map(category => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category.id}`} 
                          checked={filters.category === category.id.toString()} 
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleFilterChange('category', category.id.toString());
                            }
                          }}
                        />
                        <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Price Range</h4>
                  <div className="px-2">
                    <Slider 
                      defaultValue={[0, 1000]} 
                      max={1000} 
                      step={10} 
                      value={filters.priceRange}
                      onValueChange={handlePriceChange} 
                      className="my-4"
                    />
                    <div className="flex justify-between text-gray-600 text-sm mt-2">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div className="mb-6">
                  <h4 className="font-medium mb-2">Customer Rating</h4>
                  <RadioGroup value={filters.rating.toString()} onValueChange={(value) => handleFilterChange('rating', parseInt(value))}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="5" id="rating-5" />
                        <Label htmlFor="rating-5" className="flex items-center">
                          <div className="flex text-accent">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                          </div>
                          <span className="ml-1 text-gray-600 text-sm">& Up</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4" id="rating-4" />
                        <Label htmlFor="rating-4" className="flex items-center">
                          <div className="flex text-accent">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="ml-1 text-gray-600 text-sm">& Up</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="3" id="rating-3" />
                        <Label htmlFor="rating-3" className="flex items-center">
                          <div className="flex text-accent">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 text-gray-300" />
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="ml-1 text-gray-600 text-sm">& Up</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="0" id="rating-all" />
                        <Label htmlFor="rating-all">All Ratings</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            
            {/* Products Grid */}
            <div className="md:w-3/4">
              {/* Sort and Layout Options */}
              <div className="flex flex-wrap justify-between items-center mb-6">
                <div className="mb-4 w-full sm:mb-0 sm:w-auto">
                  <label className="text-gray-600 mr-2">Sort by:</label>
                  <Select
                    value={filters.sort}
                    onValueChange={(value) => handleFilterChange('sort', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Customer Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">View:</span>
                  <button 
                    className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'} mr-1.5`}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
              
              {/* Products */}
              {isLoading ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <Skeleton className="w-full h-64" />
                      <div className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-4" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-1/3" />
                          <Skeleton className="h-10 w-10 rounded-lg" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-600 mb-2">No Products Found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
                  <button 
                    className="bg-primary text-white px-6 py-2 rounded-lg"
                    onClick={() => {
                      setFilters({
                        category: '',
                        priceRange: [0, 1000],
                        rating: 0,
                        search: '',
                        sort: 'featured'
                      });
                      setCurrentPage(1);
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="inline-flex rounded-md shadow">
                    <button 
                      className={`px-4 py-2 rounded-l-md border border-gray-300 ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {/* Page numbers */}
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNumber = i + 1;
                      // Show 5 page numbers at most
                      if (
                        pageNumber === 1 || 
                        pageNumber === totalPages || 
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            className={`px-4 py-2 border-t border-b border-gray-300 ${
                              pageNumber === currentPage ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            onClick={() => setCurrentPage(pageNumber)}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        (pageNumber === 2 && currentPage > 3) ||
                        (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                      ) {
                        return (
                          <span key={pageNumber} className="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                    
                    <button 
                      className={`px-4 py-2 rounded-r-md border border-gray-300 ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default ProductsPage;
