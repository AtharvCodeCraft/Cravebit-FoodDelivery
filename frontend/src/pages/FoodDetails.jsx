import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Star, 
  Clock, 
  Leaf, 
  ShieldCheck, 
  Truck, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Zap,
  Info,
  ChevronRight,
  MapPin,
  Flame
} from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Components
import ImageGallery from '../components/food/ImageGallery';
import ReviewSection from '../components/food/ReviewSection';
import RelatedFood from '../components/food/RelatedFood';

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Description');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchFood = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:5000/api/food/${id}`);
        setFood(data);
      } catch (error) {
        toast.error('Failed to load food details');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-red-100 border-t-red-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!food) return <div className="text-center py-20 text-gray-500">Food item not found</div>;

  const handleAddToCart = () => {
    if (!user) {
      toast.warning('Please login or signup to add items to your cart');
      navigate('/login');
      return;
    }
    addToCart(food, quantity);
    toast.success(`${quantity} x ${food.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.warning('Please login or signup to place an order');
      navigate('/login');
      return;
    }
    addToCart(food, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <span className="hover:text-red-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-red-600 cursor-pointer" onClick={() => navigate('/menu')}>Menu</span>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-red-600 cursor-pointer capitalize">{food.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-bold truncate">{food.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 xl:col-span-7">
            <ImageGallery images={food.image} name={food.name} />
            
            {/* Desktop Tabs Section */}
            <div className="mt-12 hidden lg:block">
              <div className="flex gap-8 border-b border-gray-100 mb-8">
                {['Description', 'Ingredients', 'Nutrition'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 text-lg font-bold transition-all relative ${
                      activeTab === tab ? 'text-red-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-red-600 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
              <div className="animate-in fade-in slide-in-from-bottom-4">
                {activeTab === 'Description' && (
                  <div className="prose prose-red max-w-none text-gray-600 leading-relaxed">
                    <p>{food.description}</p>
                    <div className="grid grid-cols-2 gap-6 mt-8">
                      <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100/50">
                        <Flame className="w-6 h-6 text-red-600 mb-2" />
                        <h4 className="font-bold text-gray-900">Spicy Level</h4>
                        <p className="text-sm text-gray-500">Medium (Default)</p>
                      </div>
                      <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100/50">
                        <Leaf className="w-6 h-6 text-orange-600 mb-2" />
                        <h4 className="font-bold text-gray-900">Dietary</h4>
                        <p className="text-sm text-gray-500">{food.isVegetarian ? 'Vegetarian' : 'Non-Vegetarian'}</p>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'Ingredients' && (
                  <ul className="grid grid-cols-2 gap-4">
                    {['Fresh Vegetables', 'Special Spices', 'Organic Oil', 'Artisanal Flour', 'Natural Herbs'].map(item => (
                      <li key={item} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span className="font-medium text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {activeTab === 'Nutrition' && (
                  <div className="bg-gray-50 p-8 rounded-[2rem]">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div><p className="text-2xl font-black text-gray-900">320</p><p className="text-[10px] uppercase font-bold text-gray-400">Calories</p></div>
                      <div><p className="text-2xl font-black text-gray-900">12g</p><p className="text-[10px] uppercase font-bold text-gray-400">Protein</p></div>
                      <div><p className="text-2xl font-black text-gray-900">45g</p><p className="text-[10px] uppercase font-bold text-gray-400">Carbs</p></div>
                      <div><p className="text-2xl font-black text-gray-900">8g</p><p className="text-[10px] uppercase font-bold text-gray-400">Fats</p></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
            <header className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  food.isVegetarian ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {food.isVegetarian ? 'Pure Veg' : 'Non-Veg'}
                </span>
                <span className="px-4 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-black uppercase tracking-widest">
                  Best Seller
                </span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-black text-gray-900 mb-3 tracking-tight">{food.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">4.9</span>
                  <span className="text-gray-400 text-sm">(120+ Reviews)</span>
                </div>
              </div>
            </header>

            <div className="bg-red-50 p-8 rounded-[2.5rem] mb-8 border border-red-100/50">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-5xl font-black text-red-600 tracking-tighter">₹{food.price}</span>
                <span className="text-xl text-gray-400 line-through mb-1 font-bold">₹{food.price + 50}</span>
                <span className="mb-2 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Save 15%</span>
              </div>
              <p className="text-xs text-red-600/60 font-bold uppercase tracking-wider">Inclusive of all taxes</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Truck className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Fast Delivery</p>
                  <p className="text-xs text-gray-500">Delivered in {food.restaurantId?.deliveryTime || '30-40 mins'}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Hygienically Packed</p>
                  <p className="text-xs text-gray-500">100% Quality & Safety Assured</p>
                </div>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="mt-auto space-y-4">
              <div className="flex items-center justify-between p-2 bg-gray-100 rounded-3xl w-40">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-lg font-black text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-red-50 transition-colors shadow-sm"
                >
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleAddToCart}
                  className="group relative h-16 bg-white border-2 border-red-600 text-red-600 rounded-3xl font-black text-lg overflow-hidden transition-all hover:bg-red-50 flex items-center justify-center gap-3 shadow-lg shadow-red-50"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="group relative h-16 bg-red-600 text-white rounded-3xl font-black text-lg overflow-hidden transition-all hover:bg-red-700 flex items-center justify-center gap-3 shadow-xl shadow-red-100"
                >
                  <Zap className="w-6 h-6 fill-white" />
                  Order Now
                </button>
              </div>
            </div>

            {/* Restaurant Brief */}
            <div className="mt-12 pt-12 border-t border-gray-100">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">From the kitchen of</h4>
              <div className="flex items-center gap-4 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/restaurant/${food.restaurantId?._id}`)}>
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                   <img 
                    src={food.restaurantId?.image?.startsWith('http') ? food.restaurantId.image : `http://localhost:5000${food.restaurantId?.image || ''}`} 
                    className="w-full h-full object-cover" 
                    alt={food.restaurantId?.name} 
                   />
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-xl text-gray-900">{food.restaurantId?.name || 'Local Kitchen'}</h5>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {food.restaurantId?.address || 'City Center'}
                  </p>
                </div>
                <div className="bg-red-50 p-3 rounded-2xl">
                  <ChevronRight className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Description Tabs (Visible only on mobile) */}
        <div className="mt-12 lg:hidden space-y-6">
           <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold mb-3">Product Description</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{food.description}</p>
           </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20">
          <ReviewSection reviews={food.reviews} rating={food.rating} />
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <RelatedFood items={food.relatedItems} />
        </div>
      </div>
      
      {/* Bottom Sticky Bar for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400 font-bold uppercase">Total</p>
          <p className="text-2xl font-black text-gray-900">₹{food.price * quantity}</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handleAddToCart} className="p-4 bg-gray-100 rounded-2xl"><ShoppingCart className="w-6 h-6 text-gray-900" /></button>
           <button onClick={handleBuyNow} className="px-8 py-4 bg-red-600 text-white rounded-2xl font-bold">Buy Now</button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
