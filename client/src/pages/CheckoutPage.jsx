import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { formatPrice } from '../lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const { cart, isLoading: cartLoading, loadCartFromAPI } = useContext(CartContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    address2: '',
    notes: ''
  });

  // Load cart when component mounts
  useEffect(() => {
    loadCartFromAPI();
  }, [loadCartFromAPI]);

  // Fetch user's addresses
  const { data: addresses = [], isLoading: addressesLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiRequest('GET', '/api/addresses')
  });

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setFormData(prev => ({
      ...prev,
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      email: address.email || '',
      phone: address.phone || '',
      address: address.addressLine1 || '',
      city: address.city || '',
      state: address.state || '',
      zipCode: address.postalCode || '',
      country: address.country || ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step === 1) {
      // Validate shipping information
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.zipCode || !formData.country) {
        toast.error('Please fill in all shipping information');
        return;
      }
    }
    if (step === 2) {
      // Validate payment information
      if (paymentMethod === 'credit_card') {
        if (!formData.cardNumber || !formData.cardName || 
            !formData.expiryDate || !formData.cvv) {
          toast.error('Please fill in all payment information');
          return;
        }
      }
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to place an order');
        setLocation('/login');
        return;
      }

      // Validate shipping information
      if (!formData.firstName || !formData.lastName || !formData.email || 
          !formData.phone || !formData.address || !formData.city || 
          !formData.state || !formData.zipCode || !formData.country) {
        toast.error('Please fill in all shipping information');
        return;
      }

      // Validate payment information
      if (paymentMethod === 'credit_card') {
        if (!formData.cardNumber || !formData.cardName || 
            !formData.expiryDate || !formData.cvv) {
          toast.error('Please fill in all payment information');
          return;
        }
      }

      const orderData = {
        shippingInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          addressLine1: formData.address,
          addressLine2: formData.address2 || '',
          city: formData.city,
          state: formData.state,
          postalCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone,
          notes: formData.notes || ''
        },
        paymentMethod,
        paymentInfo: paymentMethod === 'credit_card' ? {
          cardNumber: formData.cardNumber,
          cardName: formData.cardName,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        } : null
      };

      // First validate the token
      try {
        await apiRequest('GET', '/api/users/profile');
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error('Your session has expired. Please log in again.');
          localStorage.removeItem('token');
          setLocation('/login');
          return;
        }
      }

      // If token is valid, proceed with order creation
      const response = await apiRequest('POST', '/api/orders', orderData);
      
      if (response) {
        toast.success('Order placed successfully!');
        // Clear cart after successful order
        await apiRequest('DELETE', '/api/cart');
        setLocation(`/order/success?orderId=${response.id}`);
      }
    } catch (error) {
      console.error('Order creation error:', error);
      if (error.response?.status === 401) {
        toast.error('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        setLocation('/login');
      } else {
        toast.error(error.message || 'Failed to place order. Please try again.');
      }
    }
  };

  if (cartLoading || addressesLoading) {
    return <div>Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Button onClick={() => setLocation('/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Checkout Steps */}
        <div className="md:col-span-2">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className={`flex items-center ${step >= 1 ? 'text-black' : 'text-gray-400'}`} key="step-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="ml-2">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 mx-4 bg-gray-200" key="progress-1">
                <div className={`h-full ${step >= 2 ? 'bg-black' : 'bg-gray-200'}`}></div>
              </div>
              <div className={`flex items-center ${step >= 2 ? 'text-black' : 'text-gray-400'}`} key="step-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="ml-2">Payment</span>
              </div>
              <div className="flex-1 h-0.5 mx-4 bg-gray-200" key="progress-2">
                <div className={`h-full ${step >= 3 ? 'bg-black' : 'bg-gray-200'}`}></div>
              </div>
              <div className={`flex items-center ${step >= 3 ? 'text-black' : 'text-gray-400'}`} key="step-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-black text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="ml-2">Review</span>
              </div>
            </div>
          </div>

          {/* Step 1: Shipping Information */}
          {step === 1 && (
            <div className="space-y-6" key="shipping-step">
              <h2 className="text-xl font-semibold">Shipping Information</h2>
              
              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-4">Saved Addresses</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((address) => (
                      <Card 
                        key={address.id}
                        className={`cursor-pointer transition-colors ${
                          selectedAddress?.id === address.id ? 'border-black' : ''
                        }`}
                        onClick={() => handleAddressSelect(address)}
                      >
                        <CardContent className="p-4">
                          <p className="font-medium">{address.name}</p>
                          <p>{address.addressLine1}</p>
                          {address.addressLine2 && <p>{address.addressLine2}</p>}
                          <p>{address.city}, {address.state} {address.postalCode}</p>
                          <p>{address.country}</p>
                          <p>{address.phone}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div key="firstName-input">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div key="lastName-input">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div key="email-input">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div key="phone-input">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div key="address-input">
                <Label htmlFor="address">Address Line 1</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div key="address2-input">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={formData.address2}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div key="city-input">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div key="state-input">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div key="zipCode-input">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div key="country-input">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div key="notes-input">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Input
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Any special instructions for your order"
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="space-y-6" key="payment-step">
              <h2 className="text-xl font-semibold">Payment Method</h2>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2" key="credit-card-option">
                  <RadioGroupItem value="credit_card" id="credit_card" />
                  <Label htmlFor="credit_card">Credit Card</Label>
                </div>
                <div className="flex items-center space-x-2" key="paypal-option">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'credit_card' && (
                <div key="credit-card-form">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Review Order */}
          {step === 3 && (
            <div className="space-y-6" key="review-step">
              <h2 className="text-xl font-semibold">Review Order</h2>
              <div className="space-y-4">
                <div key="shipping-info">
                  <h3 className="font-medium">Shipping Information</h3>
                  <p>{formData.firstName} {formData.lastName}</p>
                  <p>{formData.address}</p>
                  <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                  <p>{formData.country}</p>
                  <p>{formData.email}</p>
                  <p>{formData.phone}</p>
                </div>
                <div key="payment-info">
                  <h3 className="font-medium">Payment Method</h3>
                  <p>{paymentMethod === 'credit_card' ? 'Credit Card' : 'PayPal'}</p>
                  {paymentMethod === 'credit_card' && (
                    <p>Card ending in {formData.cardNumber.slice(-4)}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="ml-auto">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="ml-auto">
                Place Order
              </Button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <img 
                        src={item.product.imageUrl} 
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Price: {formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                    <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                  </div>
                ))}
                <div className="border-t pt-4">
                  <div className="flex justify-between mb-2">
                    <p>Subtotal</p>
                    <p>{formatPrice(cart.subtotal || 0)}</p>
                  </div>
                  <div className="flex justify-between mb-2">
                    <p>Shipping</p>
                    <p>{formatPrice(cart.shipping || 0)}</p>
                  </div>
                  <div className="flex justify-between font-bold">
                    <p>Total</p>
                    <p>{formatPrice(cart.total || 0)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 