import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';

const RestaurantProfile = ({ restaurant, setRestaurant, token }) => {
  const [form, setForm] = useState({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    address: restaurant?.address || '',
    deliveryTime: restaurant?.deliveryTime || '',
    estimatedCost: restaurant?.estimatedCost || '',
    isActive: restaurant?.isActive ?? true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      const { data } = await axios.put(
        `http://localhost:5000/api/restaurant-mgmt/${restaurant._id}/profile`,
        fd,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setRestaurant(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const field = (label, key, type = 'text') => (
    <div>
      <label className="block text-sm font-bold text-[var(--foreground)] mb-1">{label}</label>
      <input
        type={type}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        className="w-full px-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
      />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-black mb-6">Restaurant Profile</h2>

      {/* Current Banner */}
      <div className="h-48 rounded-2xl overflow-hidden bg-[var(--muted)] mb-6 relative">
        <img
          src={restaurant?.image?.startsWith('/uploads') ? `http://localhost:5000${restaurant.image}` : 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'}
          alt="Restaurant"
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-2xl font-black">{restaurant?.name}</h3>
          <p className="text-white/80 text-sm">{restaurant?.address}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] p-6 space-y-4">
        {field('Restaurant Name', 'name')}
        <div>
          <label className="block text-sm font-bold text-[var(--foreground)] mb-1">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            className="w-full px-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none transition-all"
          />
        </div>
        {field('Address', 'address')}
        <div className="grid grid-cols-2 gap-4">
          {field('Delivery Time (e.g. 30-40 min)', 'deliveryTime')}
          {field('Avg Cost (₹)', 'estimatedCost', 'number')}
        </div>

        <div>
          <label className="block text-sm font-bold mb-1">Restaurant Image</label>
          <input
            type="file" accept="image/*"
            onChange={e => setImageFile(e.target.files[0])}
            className="w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-500 file:text-white file:font-bold file:cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3 py-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} />
            <div className="w-11 h-6 bg-gray-300 peer-focus:ring-2 peer-focus:ring-orange-500 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          </label>
          <span className="font-bold text-sm">{form.isActive ? 'Restaurant is Open' : 'Restaurant is Closed'}</span>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 shadow-lg"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default RestaurantProfile;
