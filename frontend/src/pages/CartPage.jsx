import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Your Cart is Empty</h2>
        <p className="text-[var(--muted-foreground)] mb-8">Looks like you haven't added any food yet.</p>
        <Link
          to="/menu"
          className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-md hover:shadow-lg inline-block"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cart Items List */}
        <div className="lg:w-2/3">
          <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] p-6">
            <div className="flex justify-between border-b border-[var(--border)] pb-4 mb-4">
              <span className="font-semibold text-[var(--muted-foreground)]">Item</span>
              <span className="font-semibold text-[var(--muted-foreground)]">Total</span>
            </div>

            {cartItems.map((item) => (
              <div key={item.foodItemId} className="flex items-center justify-between py-4 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-4 flex-1">
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">{item.name}</h3>
                    <p className="text-sm text-[var(--muted-foreground)]">₹{item.price}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[var(--muted)] rounded-full px-2">
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity - 1)}
                      className="p-1 hover:text-orange-500 transition-colors text-[var(--foreground)]"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold text-[var(--foreground)]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.foodItemId, item.quantity + 1)}
                      className="p-1 hover:text-orange-500 transition-colors text-[var(--foreground)]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="font-bold w-20 text-right text-[var(--foreground)]">₹{item.price * item.quantity}</span>

                  <button
                    onClick={() => removeFromCart(item.foodItemId)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-end">
              <button 
                onClick={clearCart}
                className="text-red-500 hover:text-red-600 font-medium text-sm transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-[var(--card)] rounded-3xl shadow-sm border border-[var(--border)] p-6 sticky top-24">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-[var(--muted-foreground)] mb-6 pb-6 border-b border-[var(--border)]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[var(--foreground)]">₹{total}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-semibold text-[var(--foreground)]">₹40</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges</span>
                <span className="font-semibold text-[var(--foreground)]">₹{Math.round(total * 0.05)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-bold text-[var(--foreground)]">Total</span>
              <span className="text-2xl font-bold text-orange-600">
                ₹{total + 40 + Math.round(total * 0.05)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartPage;
