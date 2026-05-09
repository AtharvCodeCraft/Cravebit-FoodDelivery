import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
  const { cartItems } = useContext(CartContext);
  const location = useLocation();
  
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Don't show floating cart on cart page or checkout page
  if (location.pathname === '/cart' || location.pathname === '/checkout' || cartCount === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {cartCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-50 md:hidden"
        >
          <Link 
            to="/cart" 
            className="flex items-center justify-center w-14 h-14 bg-orange-500 text-white rounded-full shadow-2xl shadow-orange-500/40 hover:scale-105 transition-transform"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
              {cartCount}
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCart;
