import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getOrderDetails } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function OrderSuccessPage() {
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(window.location.search);
  const orderId = params.get('orderId');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId
  });

  useEffect(() => {
    if (!orderId) {
      setLocation('/');
    }
  }, [orderId, setLocation]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Order Information</h3>
                <p>Order ID: {order.id}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p>Status: {order.status}</p>
                <p>Total: {formatPrice(order.totalAmount)}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Shipping Information</h3>
                <p>{order.address.street}</p>
                <p>
                  {order.address.city}, {order.address.state} {order.address.zipCode}
                </p>
                <p>{order.address.country}</p>
                <p>Phone: {order.address.phone}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Order Items</h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p>{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center space-x-4">
          <Button onClick={() => setLocation('/orders')}>
            View All Orders
          </Button>
          <Button variant="outline" onClick={() => setLocation('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
} 