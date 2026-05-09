import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Utensils, Clock, ThumbsUp, Store, Star, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="relative w-full bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      {/* HERO SECTION */}
      <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center -mt-[80px]"> 
        
        {/* Dynamic Background Image */}
        <div className="absolute inset-0 w-full h-full bg-[var(--background)]">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            alt="Delicious Food"
            className="w-full h-full object-cover opacity-50 dark:opacity-40"
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-[var(--background)]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full pt-20 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium"
          >
            <span className="flex h-2 w-2 rounded-full bg-orange-500"></span>
            Now delivering in your city
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-white text-6xl md:text-8xl font-black tracking-tight mb-6 drop-shadow-2xl"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Craving something <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">extraordinary?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-gray-300 text-xl md:text-2xl font-medium mb-10 max-w-2xl drop-shadow-md"
          >
            Get the best local food delivered fast. From quick bites to gourmet meals, we bring it all right to your doorstep.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 w-full justify-center"
          >
            <Link to="/menu" className="group flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-1 sm:w-auto w-full">
              <Utensils className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Order Now
            </Link>
            <Link to="/restaurants" className="group flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:-translate-y-1 sm:w-auto w-full">
              <Store className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Explore Restaurants
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center text-white/70 hover:text-white transition-colors"
          onClick={handleScroll}
        >
          <span className="text-xs font-bold uppercase tracking-widest mb-2">Discover More</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* FEATURED CATEGORIES / CARDS */}
      <div className="w-full bg-[var(--background)] py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Popular Right Now
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
              Our most loved dishes that keep customers coming back for more.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="group bg-[var(--card)] rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1999&auto=format&fit=crop" alt="Burger" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-500 transition-colors">Cravebit Signature Burger</h3>
                <p className="text-[var(--muted-foreground)] mb-6 line-clamp-2">A masterpiece of flavor with our signature patty, melted cheese, and special sauce.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-orange-500">₹249</span>
                  <Link to="/menu" className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group bg-[var(--card)] rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" alt="Pizza" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.8
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-500 transition-colors">Woodfire Pepperoni</h3>
                <p className="text-[var(--muted-foreground)] mb-6 line-clamp-2">Authentic Italian style pizza with premium pepperoni and mozzarella.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-orange-500">₹499</span>
                  <Link to="/menu" className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="group bg-[var(--card)] rounded-[2rem] overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" alt="Healthy Bowl" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> 4.9
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 group-hover:text-orange-500 transition-colors">Fresh Quinoa Bowl</h3>
                <p className="text-[var(--muted-foreground)] mb-6 line-clamp-2">Healthy, refreshing, and packed with nutrients. The perfect guilt-free meal.</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-black text-orange-500">₹349</span>
                  <Link to="/menu" className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="w-full bg-[var(--muted)] py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-black mb-4 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Why Choose Us?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-[var(--muted-foreground)] text-lg max-w-2xl mx-auto">
              We're more than just a delivery service. We're your culinary partner.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <motion.div variants={fadeInUp} className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center mb-6 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">Our advanced routing technology ensures your food arrives hot and fresh, faster than anyone else.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-400 group-hover:scale-110 transition-transform duration-300">
                <Utensils className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Top Restaurants</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">We partner exclusively with top-rated local eateries and premium culinary brands.</p>
            </motion.div>

            <motion.div variants={fadeInUp} className="bg-[var(--card)] p-8 rounded-3xl border border-[var(--border)] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-300">
                <ThumbsUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Best Quality</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">Every order is backed by our quality guarantee. Not satisfied? We'll make it right.</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-[3rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center relative"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="lg:w-1/2 p-12 lg:p-20 relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Ready to satisfy your cravings?
              </h2>
              <p className="text-white/90 text-lg mb-10 max-w-md">
                Join thousands of happy customers who use CraveBite every day to discover amazing local food.
              </p>
              <Link to="/menu" className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:scale-105 hover:shadow-xl transition-all flex items-center gap-2">
                Order Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="lg:w-1/2 relative w-full min-h-[300px] lg:min-h-[500px]">
              <img 
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1974&auto=format&fit=crop" 
                alt="Food preparation" 
                className="absolute inset-0 w-full h-full object-cover rounded-tl-[3rem] lg:rounded-l-[3rem] opacity-90 mix-blend-overlay"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
