import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

const CATEGORIES = ['Starter', 'Main Course', 'Dessert', 'Beverage', 'Snack', 'Other'];
const BLANK = { name: '', description: '', price: '', category: 'Starter', isVegetarian: false, isAvailable: true };

const RestaurantMenu = ({ restaurant, menu, setMenu, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const openAdd = () => { setEditing(null); setForm(BLANK); setImageFile(null); setShowModal(true); };
  const openEdit = (item) => { setEditing(item); setForm({ ...item }); setImageFile(null); setShowModal(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);
      const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' };

      if (editing) {
        const { data } = await axios.put(`http://localhost:5000/api/restaurant-mgmt/menu/${editing._id}`, fd, { headers });
        setMenu(prev => prev.map(i => i._id === editing._id ? data : i));
        toast.success('Item updated');
      } else {
        const { data } = await axios.post(`http://localhost:5000/api/restaurant-mgmt/${restaurant._id}/menu`, fd, { headers });
        setMenu(prev => [data, ...prev]);
        toast.success('Item added');
      }
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save item');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/restaurant-mgmt/menu/${id}`, config);
      setMenu(prev => prev.filter(i => i._id !== id));
      toast.success('Item deleted');
    } catch { toast.error('Delete failed'); }
  };

  const handleToggle = async (item) => {
    try {
      const fd = new FormData();
      fd.append('isAvailable', !item.isAvailable);
      const { data } = await axios.put(`http://localhost:5000/api/restaurant-mgmt/menu/${item._id}`, fd, { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } });
      setMenu(prev => prev.map(i => i._id === item._id ? data : i));
    } catch { toast.error('Toggle failed'); }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black">Menu Items <span className="text-[var(--muted-foreground)] font-normal text-base">({menu.length})</span></h2>
        <button onClick={openAdd} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all active:scale-95">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {menu.map(item => (
          <div key={item._id} className={`bg-[var(--card)] rounded-2xl border overflow-hidden transition-all ${item.isAvailable ? 'border-[var(--border)]' : 'border-red-300 dark:border-red-800 opacity-60'}`}>
            <div className="h-40 bg-[var(--muted)] relative overflow-hidden">
              <img
                src={item.image?.startsWith('/uploads') ? `http://localhost:5000${item.image}` : `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop`}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'; }}
              />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-1 rounded-full ${item.isVegetarian ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                {item.isVegetarian ? 'VEG' : 'NON-VEG'}
              </span>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-bold text-[var(--foreground)] line-clamp-1">{item.name}</h3>
                <span className="font-black text-orange-500 ml-2">₹{item.price}</span>
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mb-3 line-clamp-2">{item.description}</p>
              <span className="text-xs bg-[var(--muted)] px-2 py-1 rounded-lg text-[var(--muted-foreground)]">{item.category}</span>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--border)]">
                <button onClick={() => handleToggle(item)} className="flex items-center gap-1 text-sm font-medium">
                  {item.isAvailable
                    ? <><ToggleRight className="w-5 h-5 text-green-500" /> <span className="text-green-500">Available</span></>
                    : <><ToggleLeft className="w-5 h-5 text-red-400" /> <span className="text-red-400">Hidden</span></>}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-[var(--muted)] text-[var(--foreground)] transition-colors"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--card)] rounded-3xl w-full max-w-lg border border-[var(--border)] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h3 className="text-xl font-black">{editing ? 'Edit Item' : 'Add New Item'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-full hover:bg-[var(--muted)]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {[
                { label: 'Name', key: 'name', type: 'text', required: true },
                { label: 'Price (₹)', key: 'price', type: 'number', required: true },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-bold mb-1">{f.label}</label>
                  <input type={f.type} required={f.required} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" required />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full px-4 py-3 bg-[var(--muted)] text-[var(--foreground)] rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isVegetarian} onChange={e => setForm(p => ({ ...p, isVegetarian: e.target.checked }))} className="w-4 h-4 accent-green-500" />
                  <span className="font-medium text-sm">Vegetarian</span>
                </label>
                {editing && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isAvailable} onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="w-4 h-4 accent-orange-500" />
                    <span className="font-medium text-sm">Available</span>
                  </label>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Food Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-[var(--muted-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-500 file:text-white file:font-bold file:cursor-pointer" />
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-60">
                {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
