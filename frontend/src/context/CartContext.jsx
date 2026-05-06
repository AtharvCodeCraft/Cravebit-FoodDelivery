import { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [restaurantId, setRestaurantId] = useState(() => {
    return localStorage.getItem('cartRestaurantId') || null;
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    if (restaurantId) {
      localStorage.setItem('cartRestaurantId', restaurantId);
    } else {
      localStorage.removeItem('cartRestaurantId');
    }
  }, [cartItems, restaurantId]);

  const addToCart = (item, resId) => {
    // Check if adding from a different restaurant
    if (restaurantId && restaurantId !== resId && cartItems.length > 0) {
      toast.error('You can only order from one restaurant at a time. Clear cart first!');
      return false;
    }

    if (!restaurantId || cartItems.length === 0) {
      setRestaurantId(resId);
    }

    setCartItems((prev) => {
      const existingItem = prev.find((i) => i.foodItemId === item._id);
      if (existingItem) {
        toast.info(`Increased ${item.name} quantity`);
        return prev.map((i) =>
          i.foodItemId === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      toast.success(`Added ${item.name} to cart`);
      return [...prev, { foodItemId: item._id, name: item.name, price: item.price, quantity: 1 }];
    });
    return true;
  };

  const removeFromCart = (foodItemId) => {
    setCartItems((prev) => prev.filter((i) => i.foodItemId !== foodItemId));
    if (cartItems.length === 1) {
      setRestaurantId(null); // Reset if cart becomes empty
    }
  };

  const updateQuantity = (foodItemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(foodItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.foodItemId === foodItemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ cartItems, restaurantId, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
};
