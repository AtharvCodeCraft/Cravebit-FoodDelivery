import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChefHat, Bike, MapPin, Star, Phone, Clock } from 'lucide-react';

const statuses = [
  { id: 'Placed', label: 'Order Confirmed', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/20', desc: 'Your order has been received' },
  { id: 'Preparing', label: 'Preparing Food', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-500/20', desc: 'Restaurant is preparing your food' },
  { id: 'Out for Delivery', label: 'Out for Delivery', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-500/20', desc: 'Your food is on the way' },
  { id: 'Delivered', label: 'Delivered', icon: Star, color: 'text-green-500', bg: 'bg-green-500/20', desc: 'Enjoy your meal!' },
];

const pathCoordinates = [
  { x: '10%', y: '20%' }, // Placed
  { x: '40%', y: '50%' }, // Preparing
  { x: '70%', y: '50%' }, // Out for delivery
  { x: '90%', y: '80%' }, // Delivered
];

const ActiveOrderTracker = ({ order }) => {
  const currentIndex = statuses.findIndex(s => s.id === order.orderStatus) !== -1 
    ? statuses.findIndex(s => s.id === order.orderStatus) 
    : 0;

  const progress = (currentIndex / (statuses.length - 1)) * 100;
  const currentCoord = pathCoordinates[currentIndex];

  return (
    <div className="mt-8 border-t border-gray-100 pt-8 w-full bg-[var(--background)] relative overflow-hidden rounded-2xl">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Tracking Timeline */}
        <div className="xl:col-span-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 relative">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
            <Clock className="w-5 h-5 text-orange-500" /> Live Status
          </h3>
          
          <div className="relative pl-6 space-y-8">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-gray-100 dark:bg-slate-800" />
            
            <motion.div 
              className="absolute left-[15px] top-4 w-0.5 bg-gradient-to-b from-orange-500 to-red-500"
              initial={{ height: 0 }}
              animate={{ height: `${progress}%` }}
              transition={{ duration: 0.8 }}
            />

            {statuses.map((status, index) => {
              const isActive = index === currentIndex;
              const isPassed = index < currentIndex;
              const Icon = status.icon;

              return (
                <div key={status.id} className="relative z-10 flex gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center -ml-[31px] shrink-0 border-4 border-white dark:border-slate-900 transition-colors duration-500 ${isActive || isPassed ? status.bg : 'bg-gray-100 dark:bg-slate-800'} ${isActive ? 'ring-2 ring-orange-500/50 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}>
                    <Icon className={`w-4 h-4 ${isActive || isPassed ? status.color : 'text-gray-400 dark:text-slate-500'}`} />
                  </div>
                  
                  <div className={`flex-1 pt-1 ${isActive ? 'opacity-100' : isPassed ? 'opacity-70' : 'opacity-40'}`}>
                    <h4 className={`font-bold ${isActive ? 'text-lg text-gray-900 dark:text-white' : 'text-gray-500 dark:text-slate-400'} transition-all`}>
                      {status.label}
                    </h4>
                    {isActive && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="text-sm text-gray-500 dark:text-slate-400 mt-1"
                      >
                        {status.desc}
                      </motion.p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Section */}
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden relative min-h-[280px] flex flex-col">
          
          <div className="bg-gray-50 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 p-4 flex justify-between items-center z-20">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                 {order.items.length}
               </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">Order #{order._id.substring(18)}</h4>
                <p className="text-xs text-gray-500">₹{order.totalAmount} • {order.items[0]?.name} {order.items.length > 1 ? `+${order.items.length - 1} more` : ''}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">ETA</p>
              <p className="text-xl font-black text-orange-500">
                {order.orderStatus === 'Delivered' ? 'Arrived' : '15-20 min'}
              </p>
            </div>
          </div>

          <div className="relative flex-1 bg-[#e5e5f7] dark:bg-[#0f172a] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#f97316 2px, transparent 2px), linear-gradient(90deg, #f97316 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <path 
                d="M 10% 20% L 40% 50% L 70% 50% L 90% 80%" 
                fill="none" 
                stroke="rgba(249, 115, 22, 0.3)" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <motion.path 
                d="M 10% 20% L 40% 50% L 70% 50% L 90% 80%" 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="6" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>

            {/* Restaurant Marker */}
            <div className="absolute w-10 h-10 -ml-5 -mt-5 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-orange-500 z-10" style={{ left: '10%', top: '20%' }}>
              <ChefHat className="w-5 h-5 text-orange-500" />
            </div>

            {/* Destination Marker */}
            <div className="absolute w-10 h-10 -ml-5 -mt-5 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-green-500 z-10" style={{ left: '90%', top: '80%' }}>
              <MapPin className="w-5 h-5 text-green-500" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>

            {/* Moving Bike Marker */}
            <AnimatePresence>
              {order.orderStatus !== 'Cancelled' && (
                <motion.div 
                  initial={false}
                  animate={{ 
                    left: currentCoord.x,
                    top: currentCoord.y
                  }}
                  transition={{ 
                    left: { duration: 1, ease: "easeInOut" },
                    top: { duration: 1, ease: "easeInOut" }
                  }}
                  className="absolute w-12 h-12 -ml-6 -mt-6 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-orange-500 z-30"
                >
                  <Bike className={`w-5 h-5 text-orange-500 ${order.orderStatus !== 'Delivered' ? 'animate-bounce' : ''}`} />
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>

          {/* Floating Partner Info (Shows only on Out for Delivery) */}
          <AnimatePresence>
            {order.orderStatus === 'Out for Delivery' && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="absolute bottom-4 right-4 left-4 sm:left-auto sm:w-72 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-gray-100 dark:border-slate-700 p-3 rounded-xl shadow-xl z-40"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                    <img src="https://ui-avatars.com/api/?name=Delivery+Partner&background=f97316&color=fff" alt="Driver" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">Delivery Partner</h4>
                    <p className="text-xs text-green-600 font-medium">On the way</p>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <Phone className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
        </div>
      </div>
    </div>
  );
};

export default ActiveOrderTracker;
