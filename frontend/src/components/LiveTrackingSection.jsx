import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChefHat, Bike, MapPin, PackageCheck, Star, Phone, Clock } from 'lucide-react';

const orderStatuses = [
  { id: 'confirmed', label: 'Order Confirmed', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/20', desc: 'Your order has been received' },
  { id: 'preparing', label: 'Preparing Food', icon: ChefHat, color: 'text-orange-500', bg: 'bg-orange-500/20', desc: 'Restaurant is preparing your food' },
  { id: 'picked_up', label: 'Picked Up', icon: PackageCheck, color: 'text-yellow-500', bg: 'bg-yellow-500/20', desc: 'Delivery partner has picked up' },
  { id: 'on_the_way', label: 'On The Way', icon: Bike, color: 'text-purple-500', bg: 'bg-purple-500/20', desc: 'Your food is on the way' },
  { id: 'arriving', label: 'Arriving Soon', icon: MapPin, color: 'text-red-500', bg: 'bg-red-500/20', desc: 'Partner is near your location' },
  { id: 'delivered', label: 'Delivered', icon: Star, color: 'text-green-500', bg: 'bg-green-500/20', desc: 'Enjoy your meal!' },
];

const LiveTrackingSection = () => {
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Simulate Socket.io real-time updates
  useEffect(() => {
    // Reset loop
    if (currentStatusIndex >= orderStatuses.length) {
      setTimeout(() => {
        setCurrentStatusIndex(0);
        setProgress(0);
      }, 5000);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStatusIndex((prev) => prev + 1);
    }, 4000); // Change status every 4 seconds

    return () => clearTimeout(timer);
  }, [currentStatusIndex]);

  // Smooth progress bar calculation based on current status
  useEffect(() => {
    if (currentStatusIndex < orderStatuses.length) {
      const targetProgress = (currentStatusIndex / (orderStatuses.length - 1)) * 100;
      setProgress(targetProgress);
    }
  }, [currentStatusIndex]);

  const currentStatus = orderStatuses[Math.min(currentStatusIndex, orderStatuses.length - 1)];

  // Map Path Coordinates for the Bike to follow
  const pathCoordinates = [
    { x: '10%', y: '20%' }, // confirmed
    { x: '20%', y: '20%' }, // preparing
    { x: '35%', y: '50%' }, // picked up
    { x: '60%', y: '50%' }, // on the way
    { x: '75%', y: '80%' }, // arriving
    { x: '90%', y: '80%' }, // delivered
  ];

  const currentCoord = pathCoordinates[Math.min(currentStatusIndex, pathCoordinates.length - 1)];

  return (
    <div className="w-full bg-[var(--background)] py-24 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold mb-4"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            Live Order Tracking
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}
          >
            Watch Your Food Arrive
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto"
          >
            Powered by our real-time tracking engine. Know exactly where your order is, every step of the way.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Tracking Timeline Card */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-xl p-8 relative overflow-hidden"
          >
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-orange-500" /> Order Status
            </h3>
            
            <div className="relative pl-6 space-y-8">
              {/* Vertical Line */}
              <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-[var(--muted)]" />
              
              {/* Progress Line */}
              <motion.div 
                className="absolute left-[15px] top-4 w-0.5 bg-gradient-to-b from-orange-500 to-red-500"
                initial={{ height: 0 }}
                animate={{ height: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />

              {orderStatuses.map((status, index) => {
                const isActive = index === currentStatusIndex;
                const isPassed = index < currentStatusIndex;
                const Icon = status.icon;

                return (
                  <div key={status.id} className="relative z-10 flex gap-4">
                    {/* Status Node */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center -ml-[31px] shrink-0 border-4 border-[var(--card)] transition-colors duration-500 ${isActive || isPassed ? status.bg : 'bg-[var(--muted)]'} ${isActive ? 'ring-2 ring-orange-500/50 ring-offset-2 ring-offset-[var(--card)]' : ''}`}>
                      <Icon className={`w-4 h-4 ${isActive || isPassed ? status.color : 'text-[var(--muted-foreground)]'}`} />
                    </div>
                    
                    {/* Status Content */}
                    <div className={`flex-1 pt-1 ${isActive ? 'opacity-100' : isPassed ? 'opacity-70' : 'opacity-40'}`}>
                      <h4 className={`font-bold ${isActive ? 'text-lg text-[var(--foreground)]' : 'text-[var(--muted-foreground)]'} transition-all`}>
                        {status.label}
                      </h4>
                      {isActive && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          className="text-sm text-[var(--muted-foreground)] mt-1"
                        >
                          {status.desc}
                        </motion.p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Interactive Map Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 bg-[var(--card)] rounded-3xl border border-[var(--border)] shadow-xl overflow-hidden relative min-h-[500px] flex flex-col"
          >
            {/* Map Top Bar */}
            <div className="bg-white/5 backdrop-blur-sm border-b border-[var(--border)] p-4 flex justify-between items-center z-20">
              <div className="flex items-center gap-3">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&h=200&auto=format&fit=crop" alt="Food" className="w-12 h-12 rounded-full object-cover border-2 border-orange-500" />
                <div>
                  <h4 className="font-bold">Cravebit Signature Burger</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">Order #CRV-8492</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--muted-foreground)] font-medium uppercase tracking-wider">Estimated Arrival</p>
                <p className="text-2xl font-black text-orange-500">
                  {currentStatusIndex === 5 ? 'Arrived!' : '15-20 min'}
                </p>
              </div>
            </div>

            {/* Map Area Mockup */}
            <div className="relative flex-1 bg-[#e5e5f7] dark:bg-[#0f172a] overflow-hidden">
              {/* Map Grid Pattern to simulate roads */}
              <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.1]" style={{ backgroundImage: 'linear-gradient(#f97316 2px, transparent 2px), linear-gradient(90deg, #f97316 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
              
              {/* Abstract City Elements */}
              <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-white dark:bg-slate-800 rounded-2xl shadow-sm rotate-12 opacity-50" />
              <div className="absolute bottom-[20%] right-[10%] w-48 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-sm -rotate-6 opacity-50" />
              <div className="absolute top-[40%] right-[30%] w-20 h-40 bg-white dark:bg-slate-800 rounded-2xl shadow-sm rotate-3 opacity-50" />

              {/* The Route Path Line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <path 
                  d="M 10% 20% L 20% 20% L 35% 50% L 60% 50% L 75% 80% L 90% 80%" 
                  fill="none" 
                  stroke="rgba(249, 115, 22, 0.3)" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                <motion.path 
                  d="M 10% 20% L 20% 20% L 35% 50% L 60% 50% L 75% 80% L 90% 80%" 
                  fill="none" 
                  stroke="#f97316" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]"
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
                {currentStatusIndex > 0 && currentStatusIndex < 5 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: 1,
                      left: currentCoord.x,
                      top: currentCoord.y
                    }}
                    transition={{ 
                      left: { duration: 1, ease: "easeInOut" },
                      top: { duration: 1, ease: "easeInOut" },
                      scale: { duration: 0.3 }
                    }}
                    className="absolute w-14 h-14 -ml-7 -mt-7 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-2xl border-4 border-orange-500 z-30"
                  >
                    <Bike className="w-6 h-6 text-orange-500 animate-bounce" />
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>

            {/* Floating Delivery Partner Card */}
            <AnimatePresence>
              {currentStatusIndex >= 2 && currentStatusIndex < 5 && (
                <motion.div 
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-700 p-4 rounded-2xl shadow-2xl z-40"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&h=200&auto=format&fit=crop" alt="Driver" className="w-14 h-14 rounded-full object-cover border-2 border-orange-500" />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">Alex Johnson</h4>
                      <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 4.9 (2k+ deliveries)
                      </div>
                    </div>
                    <button className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center text-xs">
                    <span className="text-[var(--muted-foreground)] font-medium">Vehicle: Honda Activa</span>
                    <span className="font-bold uppercase bg-[var(--muted)] px-2 py-1 rounded-md">MH 12 AB 1234</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingSection;
