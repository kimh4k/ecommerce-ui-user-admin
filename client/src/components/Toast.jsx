import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { CheckCircle } from 'lucide-react';

const Toast = () => {
  const { lastAddedItem, clearLastAddedItem } = useContext(CartContext);
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (lastAddedItem) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
        // Clear the last added item after animation finishes
        setTimeout(clearLastAddedItem, 300);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, clearLastAddedItem]);
  
  if (!lastAddedItem) return null;
  
  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 ${visible ? 'fade-in' : 'opacity-0'} transition-opacity duration-300`}>
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <CheckCircle className="text-secondary text-xl" />
        </div>
        <div>
          <p className="font-medium">Item added to cart</p>
          <p className="text-sm text-gray-600">{lastAddedItem.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
