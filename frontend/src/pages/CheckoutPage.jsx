import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const CheckoutPage = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, restaurantId, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  useEffect(() => {
    if (!user) {
      toast.info('Please login to checkout');
      navigate('/login');
    }
  }, [user, navigate]);

  const subtotal = getCartTotal();
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = 40;
  const totalAmount = subtotal + tax + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.zipCode) {
      toast.error('Please fill in all address fields');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // The 'data' variable was not used after destructuring, so we can remove the destructuring
      // or assign the full response if needed later. For now, we just call the API.
      await axios.post(
        'http://localhost:5000/api/orders',
        {
          restaurantId,
          items: cartItems,
          deliveryAddress: address,
          paymentMethod,
          totalAmount,
        },
        config
      );

      toast.success('Order placed successfully!');
      clearCart();
      // Navigate to order tracking/history (implementing dashboard route for now)
      navigate('/dashboard'); 
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error placing order');
    }
  };

  if (!user || cartItems.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Delivery Details */}
        <div className="space-y-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-orange-500 focus:border-orange-500"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="Cash"
                  checked={paymentMethod === 'Cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 font-medium text-gray-900">Cash on Delivery</span>
              </label>
              <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors opacity-50">
                <input
                  type="radio"
                  name="payment"
                  value="Card"
                  disabled
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500"
                />
                <span className="ml-3 font-medium text-gray-900">Online Payment (Mocked)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Total</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map(item => (
                <div key={item.foodItemId} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-gray-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 py-4 border-t border-b border-gray-100 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="font-medium">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">₹{tax}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-gray-900">Total to Pay</span>
              <span className="text-2xl font-bold text-orange-600">₹{totalAmount}</span>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
