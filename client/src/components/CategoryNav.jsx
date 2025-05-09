import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';

const CategoryNav = () => {
  const { data: categories, isLoading, error } = useQuery({
    queryKey: ['/api/categories'],
  });

  // If no categories data yet, show placeholder
  if (isLoading || error || !categories) {
    return (
      <section className="py-8 bg-white" id="categories">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 group">
                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-200 mb-2 animate-pulse"></div>
                <div className="h-5 bg-gray-200 rounded w-20 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white" id="categories">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="flex overflow-x-auto pb-4 space-x-4 scrollbar-hide">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <div className="flex-shrink-0 group cursor-pointer">
                <div className="w-36 h-36 rounded-xl overflow-hidden bg-gray-200 mb-2">
                  <img 
                    src={category.image} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center font-medium">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
