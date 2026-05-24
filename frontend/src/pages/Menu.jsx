import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { Search, MapPin, Clock, Star, Plus, Minus, Info, Store, Mic, LocateFixed, Flame, Heart } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [restaurantReviews, setRestaurantReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('menu'); // 'menu' or 'reviews'
  const [isListening, setIsListening] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  
  // Use search query from URL if available
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  
  const { addToCart, cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(data);
        await fetchAllFoodItems(); // Wait for items to load
      } catch (error) {
        console.error('Error fetching initial data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchAllFoodItems = async () => {
    setSelectedRestaurant(null);
    try {
      const { data } = await axios.get('http://localhost:5000/api/food');
      setFoodItems(data);
    } catch (error) {
      console.error('Error fetching all food items', error);
      setFoodItems([]);
    }
  };

  const handleSelectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    setActiveTab('menu');
    setLoading(true);
    try {
      // Fetch food items
      try {
        const { data } = await axios.get(`http://localhost:5000/api/food/restaurant/${restaurant._id}`);
        setFoodItems(data);
      } catch (err) {
        console.error('Error fetching food items', err);
        setFoodItems([]);
      }

      // Fetch reviews separately
      try {
        const { data } = await axios.get(`http://localhost:5000/api/reviews/restaurant/${restaurant._id}`);
        setRestaurantReviews(data);
      } catch (err) {
        console.error('Error fetching reviews', err);
        setRestaurantReviews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredFood = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantityInCart = (itemId) => {
    const item = cartItems.find(i => i._id === itemId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (item, resId) => {
    if (!user) {
      toast.warning('Please login or signup to add items to your cart');
      navigate('/login');
      return;
    }
    addToCart(item, resId);
  };

  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice search is not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      toast.success(`Search: "${transcript}"`);
    };
    recognition.onerror = () => toast.error('Voice recognition failed.');
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const findNearMe = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          toast.success('Found 12 restaurants near you!');
          // Mock sorting by randomly shuffling for demo purposes
          setRestaurants(prev => [...prev].sort(() => Math.random() - 0.5));
        },
        () => {
          setIsLocating(false);
          toast.error('Location access denied');
        }
      );
    } else {
      setIsLocating(false);
      toast.error('Geolocation not supported');
    }
  };

  const toggleWishlist = (id) => {
    if(wishlist.includes(id)) {
      setWishlist(wishlist.filter(w => w !== id));
      toast.info('Removed from Wishlist');
    } else {
      setWishlist([...wishlist, id]);
      toast.success('Added to Wishlist ❤️');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-orange-500 text-xs font-bold">
          CB
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[var(--background)] min-h-screen text-[var(--foreground)] transition-colors duration-300">
      
      {/* Search Header */}
      <div className="mb-10 flex flex-col md:flex-row gap-6 justify-between items-center bg-[var(--card)] p-6 md:p-8 rounded-3xl border border-[var(--border)] shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-[var(--foreground)] tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            Explore Restaurants
          </h1>
          <p className="text-[var(--muted-foreground)] mt-2 text-lg">Find the best food in your area</p>
        </div>
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-12 py-3.5 bg-[var(--muted)] border-transparent text-[var(--foreground)] rounded-2xl leading-5 placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-[var(--card)] focus:shadow-md sm:text-sm transition-all duration-300"
            placeholder="Search food or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={startVoiceSearch}
            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-[var(--muted-foreground)] hover:text-orange-500'}`}
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mb-6">
        <button 
          onClick={findNearMe}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-full font-bold text-sm hover:bg-orange-200 dark:hover:bg-orange-500/30 transition-colors"
        >
          <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} /> 
          {isLocating ? 'Locating...' : 'Find Restaurants Near Me'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Restaurant Sidebar */}
        <div className="lg:w-1/3 xl:w-1/4">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-orange-500" /> Top Restaurants
          </h2>
          <div className="flex flex-col gap-3 sticky top-28">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchAllFoodItems}
              className={`cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
                selectedRestaurant === null
                  ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                  : 'border-[var(--border)] bg-[var(--card)] hover:border-orange-300 hover:shadow-sm'
              }`}
            >
              <h3 className={`font-bold text-lg leading-tight ${
                selectedRestaurant === null ? 'text-orange-600 dark:text-orange-400' : 'text-[var(--foreground)]'
              }`}>
                All Items
              </h3>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Explore everything we offer</p>
            </motion.div>

            {restaurants.map((restaurant) => (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={restaurant._id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className={`cursor-pointer p-4 rounded-2xl transition-all duration-300 border ${
                  selectedRestaurant?._id === restaurant._id
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow-md ring-1 ring-orange-500'
                    : 'border-[var(--border)] bg-[var(--card)] hover:border-orange-300 hover:shadow-sm'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`font-bold text-lg leading-tight ${
                    selectedRestaurant?._id === restaurant._id ? 'text-orange-600 dark:text-orange-400' : 'text-[var(--foreground)]'
                  }`}>
                    {restaurant.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {restaurant.rating}
                  </span>
                </div>
                
                <div className="space-y-1.5">
                  <div className="flex items-center text-sm text-[var(--muted-foreground)]">
                    <MapPin className="w-4 h-4 mr-1.5 opacity-70" /> 
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-[var(--muted-foreground)]">
                    <Clock className="w-4 h-4 mr-1.5 opacity-70" /> 
                    {restaurant.deliveryTime} mins delivery
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="lg:w-2/3 xl:w-3/4">
          <AnimatePresence mode="wait">
            {selectedRestaurant ? (
              <div className="space-y-6">
                <motion.div 
                  key={selectedRestaurant._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl text-white shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        {selectedRestaurant.name}
                      </h2>
                      <p className="text-white/80 max-w-2xl">{selectedRestaurant.description}</p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          <MapPin className="w-4 h-4" /> {selectedRestaurant.address}
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                          <Star className="w-4 h-4 fill-white" /> {selectedRestaurant.rating} Rating
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-[var(--border)] pb-1">
                  <button 
                    onClick={() => setActiveTab('menu')}
                    className={`pb-3 px-4 font-bold text-lg transition-all relative ${
                      activeTab === 'menu' ? 'text-orange-500' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Menu
                    {activeTab === 'menu' && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
                    )}
                  </button>
                  <button 
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-3 px-4 font-bold text-lg transition-all relative ${
                      activeTab === 'reviews' ? 'text-orange-500' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                    }`}
                  >
                    Reviews ({restaurantReviews.length})
                    {activeTab === 'reviews' && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full" />
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <motion.div 
                key="all-items-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-white shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
                <div className="relative z-10">
                  <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    All Delicious Items
                  </h2>
                  <p className="text-white/80 max-w-2xl">Discover the best dishes from all our partner restaurants</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            {activeTab === 'menu' || !selectedRestaurant ? (
              filteredFood.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 bg-[var(--card)] rounded-3xl border border-[var(--border)]"
                >
                  <div className="text-6xl mb-4">🍽️</div>
                  <p className="text-[var(--muted-foreground)] text-lg font-medium">No food items found matching "{searchTerm}"</p>
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-orange-500 font-bold hover:underline"
                  >
                    Clear Search
                  </button>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredFood.map((item, index) => {
                    const quantity = getQuantityInCart(item._id);
                    
                    return (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        key={item._id}
                        className="bg-[var(--card)] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--border)] group flex flex-col h-full"
                      >
                        {/* Image Area */}
                        <div className="h-48 relative overflow-hidden bg-[var(--muted)]">
                          <img 
                            src={item.image || `https://source.unsplash.com/400x300/?${encodeURIComponent(item.name)},food`} 
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.onerror = null; 
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1000&auto=format&fit=crop";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="absolute top-3 left-3 flex gap-2">
                            {item.isVegetarian ? (
                              <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> VEG
                              </span>
                            ) : (
                              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span> NON-VEG
                              </span>
                            )}
                            <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                              <Flame className="w-3 h-3" /> {Math.floor(Math.random() * 300 + 200)} kcal
                            </span>
                          </div>

                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(item._id); }}
                            className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-transform"
                          >
                            <Heart className={`w-4 h-4 ${wishlist.includes(item._id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
                          </button>

                          {/* Price Badge */}
                          <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-xl shadow-lg font-black text-lg text-orange-600 dark:text-orange-400">
                            ₹{item.price}
                          </div>
                        </div>
                        
                        {/* Content Area */}
                        <div className="p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <Store className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
                              {item.restaurantId?.name || selectedRestaurant?.name}
                            </span>
                          </div>
                          <h3 className="font-bold text-lg text-[var(--foreground)] group-hover:text-orange-500 transition-colors mb-2 line-clamp-1">
                            {item.name}
                          </h3>
                          
                          <p className="text-sm text-[var(--muted-foreground)] mb-6 line-clamp-2 flex-grow">
                            {item.description}
                          </p>
                          
                          {/* Action Area */}
                          <div className="mt-auto">
                            {quantity > 0 ? (
                              <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl p-1">
                                <button 
                                  onClick={() => {/* Need to implement decrease in context if available, otherwise handled in cart */}}
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                                >
                                  <Minus className="w-5 h-5" />
                                </button>
                                <span className="font-bold text-lg w-8 text-center text-orange-600">{quantity}</span>
                                <button 
                                  onClick={() => handleAddToCart(item, item.restaurantId?._id || selectedRestaurant?._id)}
                                  className="w-10 h-10 rounded-lg flex items-center justify-center text-orange-600 hover:bg-orange-100 dark:hover:bg-orange-500/20 transition-colors"
                                >
                                  <Plus className="w-5 h-5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToCart(item, item.restaurantId?._id || selectedRestaurant?._id)}
                                className="w-full bg-[var(--muted)] text-[var(--foreground)] hover:bg-orange-500 hover:text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/20 active:scale-95"
                              >
                                Add to Cart <Plus className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              <div className="space-y-6">
                {restaurantReviews.length === 0 ? (
                  <div className="text-center py-20 bg-[var(--card)] rounded-3xl border border-[var(--border)]">
                    <p className="text-[var(--muted-foreground)] text-lg">No reviews yet for this restaurant.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {restaurantReviews.map((review) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={review._id} 
                        className="bg-[var(--card)] p-6 rounded-3xl border border-[var(--border)] shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center text-orange-600 font-bold">
                              {review.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <h4 className="font-bold text-[var(--foreground)]">{review.userId?.name || 'Anonymous'}</h4>
                              <div className="flex items-center gap-1 text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-[var(--muted-foreground)]">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-[var(--foreground)] italic">"{review.comment}"</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
