import { Link } from 'wouter';

const HeroBanner = () => {
  return (
    <section className="bg-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Summer Collection 2023</h1>
            <p className="text-lg text-gray-600 mb-8">Discover our latest arrivals with up to 40% off</p>
            <div className="flex flex-wrap gap-4">
              <Link href="/products" className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors">
                Shop Now
              </Link>
              <a href="#featured" className="bg-white border border-gray-300 hover:border-primary text-gray-700 hover:text-primary font-medium py-3 px-6 rounded-lg transition-colors">
                Featured Products
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Summer collection fashion model with shopping bags" 
              className="w-full h-auto object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
