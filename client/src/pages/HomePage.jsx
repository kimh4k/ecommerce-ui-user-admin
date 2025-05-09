import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '../components/ui/skeleton';

const HeroSection = () => (
  <section className="relative h-screen bg-black text-white flex items-center justify-center">
    <div className="absolute inset-0 bg-black">
      <img 
        src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80" 
        alt="Fashion model wearing minimalist clothing" 
        className="w-full h-full object-cover opacity-70"
      />
    </div>
    <div className="relative z-10 text-center px-4 max-w-3xl">
      <h1 className="text-5xl md:text-7xl font-light mb-4 uppercase tracking-wider">Spring/Summer 2025</h1>
      <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto">Minimalist designs for the modern lifestyle.</p>
      <Link href="/products" className="inline-block border border-white px-8 py-3 uppercase text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300">
        Shop Now
      </Link>
    </div>
  </section>
);

const FeaturedCollection = ({ title, products, isLoading }) => (
  <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-lg font-normal uppercase tracking-wider">{title}</h2>
      <Link href="/products" className="text-sm uppercase tracking-wider hover:opacity-70 transition-opacity">
        View All
      </Link>
    </div>
    
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
      {isLoading ? (
        // Loading skeletons
        [...Array(4)].map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[3/4] w-full mb-3" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))
      ) : products?.length > 0 ? (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-500">No products available at the moment.</p>
        </div>
      )}
    </div>
  </section>
);

const CategorySection = () => {
  const categories = [
    { id: 1, name: "Tops", image: "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" },
    { id: 2, name: "Bottoms", image: "https://images.unsplash.com/photo-1560243563-062bfc001d68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" },
    { id: 3, name: "Accessories", image: "https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=1000" }
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h2 className="text-lg font-normal uppercase tracking-wider mb-8 text-center">Shop By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {categories.map(category => (
            <div key={category.id} className="group relative aspect-[4/5] overflow-hidden">
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Link 
                  href={`/products?category=${category.id}`} 
                  className="bg-white text-black py-3 px-6 uppercase text-sm tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
                >
                  {category.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Newsletter = () => (
  <section className="py-16 bg-white border-t border-gray-200">
    <div className="max-w-lg mx-auto px-4 text-center">
      <h3 className="uppercase text-lg font-normal tracking-wider mb-3">Stay Connected</h3>
      <p className="text-gray-600 mb-6">Sign up for our newsletter to receive updates on new collections and exclusive offers.</p>
      <form className="flex">
        <input 
          type="email" 
          placeholder="Your email address" 
          className="flex-1 border border-gray-300 border-r-0 py-3 px-4 focus:outline-none focus:border-black"
          required
        />
        <button 
          type="submit" 
          className="bg-black text-white px-6 py-3 uppercase text-sm tracking-wider hover:bg-gray-800"
        >
          Subscribe
        </button>
      </form>
    </div>
  </section>
);

const HomePage = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch(`${API_URL}/products?limit=4`).then(res => res.json())
  });

  return (
    <>
      <HeroSection />
      
      <FeaturedCollection 
        title="New Arrivals" 
        products={products?.data || []} 
        isLoading={isLoading} 
      />
      
      <CategorySection />
      
      <Newsletter />
    </>
  );
};

export default HomePage;
