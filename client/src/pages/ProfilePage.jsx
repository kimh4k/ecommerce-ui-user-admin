import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();
  const [addressForm, setAddressForm] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    isDefault: false
  });

  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['/api/users/profile'],
    queryFn: () => apiRequest('GET', '/api/users/profile')
  });

  // Fetch user addresses
  const { data: addresses, isLoading: addressesLoading } = useQuery({
    queryKey: ['/api/users/addresses'],
    queryFn: () => apiRequest('GET', '/api/users/addresses')
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data) => apiRequest('PUT', '/api/users/profile', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/users/profile']);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile');
    }
  });

  // Add address mutation
  const addAddressMutation = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/users/addresses', { data }),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/users/addresses']);
      setAddressForm({
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        isDefault: false
      });
      toast.success('Address added successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add address');
    }
  });

  // Delete address mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (addressId) => apiRequest('DELETE', `/api/users/addresses/${addressId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/users/addresses']);
      toast.success('Address deleted successfully');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete address');
    }
  });

  // Set default address mutation
  const setDefaultAddressMutation = useMutation({
    mutationFn: (addressId) => apiRequest('PUT', `/api/users/addresses/${addressId}/default`),
    onSuccess: () => {
      queryClient.invalidateQueries(['/api/users/addresses']);
      toast.success('Default address updated');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update default address');
    }
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      phone: formData.get('phone'),
      dateOfBirth: formData.get('dateOfBirth'),
      gender: formData.get('gender')
    };
    updateProfileMutation.mutate(data);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    addAddressMutation.mutate(addressForm);
  };

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (profileLoading || addressesLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const isNewUser = !profile?.profile?.firstName && !profile?.profile?.lastName;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>

      {isNewUser && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mb-8">
          <p className="font-medium">Welcome to your profile!</p>
          <p className="text-sm mt-1">Please complete your profile information to get started.</p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="profile">Personal Information</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="orders">Order History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="max-w-2xl">
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={profile?.profile?.firstName || ''}
                    required={isNewUser}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={profile?.profile?.lastName || ''}
                    required={isNewUser}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    defaultValue={profile?.profile?.phone || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    defaultValue={profile?.profile?.dateOfBirth || ''}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    name="gender"
                    defaultValue={profile?.profile?.gender || ''}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                disabled={updateProfileMutation.isLoading}
              >
                {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="addresses">
          <div className="max-w-2xl space-y-8">
            {/* Add New Address Form */}
            <form onSubmit={handleAddressSubmit} className="space-y-6">
              <h2 className="text-xl font-semibold">Add New Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={addressForm.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressChange}
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    name="isDefault"
                    checked={addressForm.isDefault}
                    onChange={handleAddressChange}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isDefault">Set as default address</Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={addAddressMutation.isLoading}
              >
                {addAddressMutation.isLoading ? 'Adding...' : 'Add Address'}
              </Button>
            </form>

            {/* Address List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Saved Addresses</h2>
              {addresses?.map(address => (
                <div
                  key={address.id}
                  className="border rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {address.street}
                        {address.isDefault && (
                          <span className="ml-2 text-sm text-blue-600">(Default)</span>
                        )}
                      </p>
                      <p className="text-gray-600">
                        {address.city}, {address.state} {address.postalCode}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                    </div>
                    <div className="flex gap-2">
                      {!address.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefaultAddressMutation.mutate(address.id)}
                        >
                          Set as Default
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteAddressMutation.mutate(address.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <div className="max-w-4xl">
            <h2 className="text-xl font-semibold mb-4">Order History</h2>
            {/* Order history will be implemented here */}
            <p className="text-gray-600">Your order history will appear here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage; 