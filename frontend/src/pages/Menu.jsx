import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { Search, MapPin, Clock } from 'lucide-react';

const Menu = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(data);
        if (data.length > 0) {
          handleSelectRestaurant(data[0]);
        }
      } catch (error) {
        console.error('Error fetching restaurants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSelectRestaurant = async (restaurant) => {
    setSelectedRestaurant(restaurant);
    try {
      const { data } = await axios.get(`http://localhost:5000/api/food/restaurant/${restaurant._id}`);
      setFoodItems(data);
    } catch (error) {
      console.error('Error fetching food items', error);
    }
  };

  const filteredFood = foodItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-500"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Search Header */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Explore Restaurants</h1>
          <p className="text-gray-500 mt-1">Find the best food in your area</p>
        </div>
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-shadow shadow-sm hover:shadow-md"
            placeholder="Search food or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Restaurant Sidebar */}
        <div className="lg:w-1/4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Restaurants</h2>
          <div className="flex flex-col gap-3">
            {restaurants.map((restaurant) => (
              <div
                key={restaurant._id}
                onClick={() => handleSelectRestaurant(restaurant)}
                className={`cursor-pointer p-4 rounded-2xl transition-all duration-200 border ${
                  selectedRestaurant?._id === restaurant._id
                    ? 'border-orange-500 bg-orange-50 shadow-md transform scale-105'
                    : 'border-transparent bg-white hover:bg-gray-50 hover:shadow shadow-sm'
                }`}
              >
                <h3 className={`font-bold text-lg ${
                  selectedRestaurant?._id === restaurant._id ? 'text-orange-600' : 'text-gray-800'
                }`}>
                  {restaurant.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {restaurant.address}</span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {restaurant.deliveryTime}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium ml-auto">
                    ★ {restaurant.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Food Items Grid */}
        <div className="lg:w-3/4">
          {selectedRestaurant && (
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{selectedRestaurant.name} Menu</h2>
              <p className="text-gray-500">{selectedRestaurant.description}</p>
            </div>
          )}

          {filteredFood.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No food items found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFood.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={item._id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                   {/* Placeholder for food image */}
                  <div className="h-48 bg-slate-200 relative overflow-hidden flex items-center justify-center">
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🍽️</span>
                    {item.isVegetarian && (
                      <span className="absolute top-3 right-3 bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></span>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-bold text-gray-900 bg-orange-100 text-orange-800 px-2 py-1 rounded-lg text-sm">
                        ₹{item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{item.description}</p>
                    
                    <button
                      onClick={() => addToCart(item, selectedRestaurant._id)}
                      className="w-full bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white font-semibold py-2.5 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <span className="text-lg leading-none">+</span> Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Menu;
