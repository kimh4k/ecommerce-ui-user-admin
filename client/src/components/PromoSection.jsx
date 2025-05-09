import { useState, useEffect } from 'react';
import { Link } from 'wouter';

const PromoSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 23,
    minutes: 59,
    seconds: 42
  });
  
  useEffect(() => {
    // Set end date to 5 days from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    
    const timer = setInterval(() => {
      const now = new Date();
      const diff = endDate - now;
      
      if (diff <= 0) {
        clearInterval(timer);
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Summer Sale</h2>
        <p className="text-xl mb-8">Get up to 40% off on selected items</p>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <div className="bg-white bg-opacity-20 px-6 py-4 rounded-lg">
            <span className="block text-2xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
            <span className="text-sm">Days</span>
          </div>
          <div className="bg-white bg-opacity-20 px-6 py-4 rounded-lg">
            <span className="block text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="text-sm">Hours</span>
          </div>
          <div className="bg-white bg-opacity-20 px-6 py-4 rounded-lg">
            <span className="block text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="text-sm">Minutes</span>
          </div>
          <div className="bg-white bg-opacity-20 px-6 py-4 rounded-lg">
            <span className="block text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="text-sm">Seconds</span>
          </div>
        </div>
        <Link href="/products?sale=true" className="inline-block bg-white text-primary font-medium py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors">
          Shop the Sale
        </Link>
      </div>
    </section>
  );
};

export default PromoSection;
