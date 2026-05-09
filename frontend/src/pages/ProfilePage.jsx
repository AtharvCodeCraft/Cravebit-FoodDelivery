import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <div className="text-center mt-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 bg-[var(--background)] min-h-[70vh] text-[var(--foreground)] transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[var(--card)] rounded-3xl shadow-md border border-[var(--border)] overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-orange-500 to-red-600 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-[var(--card)] rounded-full flex items-center justify-center border-4 border-[var(--background)] shadow-lg">
            <span className="text-4xl font-bold text-orange-500">{user.name?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h1 className="text-3xl font-black mb-1">{user.name}</h1>
          <p className="text-[var(--muted-foreground)] flex items-center gap-1 mb-8">
            <Shield className="w-4 h-4" /> {user.role === 'admin' ? 'Administrator' : 'Customer'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--muted)] p-6 rounded-2xl">
              <p className="text-sm font-bold text-[var(--muted-foreground)] mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>
            
            <div className="bg-[var(--muted)] p-6 rounded-2xl">
              <p className="text-sm font-bold text-[var(--muted-foreground)] mb-1 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Phone Number
              </p>
              <p className="text-lg font-medium">{user.phone || 'Not provided'}</p>
            </div>
            
            <div className="bg-[var(--muted)] p-6 rounded-2xl md:col-span-2">
              <p className="text-sm font-bold text-[var(--muted-foreground)] mb-1 flex items-center gap-2">
                <User className="w-4 h-4" /> Account Status
              </p>
              <p className="text-lg font-medium text-green-600 dark:text-green-400">Active</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
