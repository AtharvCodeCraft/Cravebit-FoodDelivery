import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Store, Star, MapPin, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminRestaurants = ({ user }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:5000/api/admin/restaurants', config);
      setRestaurants(data);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-10">Loading restaurants...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by name or city..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            <Filter className="w-5 h-5" />
            Filters
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-100">
            <Plus className="w-5 h-5" />
            Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredRestaurants.map((r) => (
          <div key={r._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
            <div className="relative h-40">
              <img 
                src={r.image.startsWith('http') ? r.image : `http://localhost:5000${r.image}`} 
                alt={r.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 flex items-center gap-1 shadow-sm">
                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                {r.rating || 'N/A'}
              </div>
              <div className="absolute top-4 right-4 bg-red-600 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                {r.cuisineType || 'Cuisine'}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{r.name}</h3>
                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {r.address}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-400" />
                  Delivery Time: <span className="text-gray-900 font-medium">{r.deliveryTime || '30-40 min'}</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="text-xs text-gray-400">
                  Joined {new Date(r.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <button className="text-xs font-bold text-gray-600 hover:text-red-600">Edit</button>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredRestaurants.length === 0 && (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No restaurants found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRestaurants;
