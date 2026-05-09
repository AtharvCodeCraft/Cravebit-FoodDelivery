import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const RelatedFood = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="py-12 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Related Items You'll Love</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => (
          <motion.div
            key={item._id}
            className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link to={`/food/${item._id}`} className="block relative h-48 overflow-hidden">
              <img
                src={item.image.startsWith('http') ? item.image : `http://localhost:5000${item.image}`}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                4.2
              </div>
            </Link>
            
            <div className="p-6">
              <div className="mb-4">
                <h4 className="font-bold text-gray-900 text-lg line-clamp-1 mb-1">{item.name}</h4>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{item.category}</p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-red-600">₹{item.price}</span>
                </div>
                <button className="p-2.5 rounded-2xl bg-gray-50 text-gray-900 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-gray-100">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RelatedFood;
