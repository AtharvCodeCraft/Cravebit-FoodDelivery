import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Utensils, Clock, ThumbsUp, Store } from 'lucide-react';

const LandingPage = () => {
  const handleScroll = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-white w-full">
      {/* HERO SECTION */}
      <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center -mt-[80px]"> 
        
        {/* Static Background Image */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <img 
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
            alt="Delicious Food"
            className="w-full h-full object-cover opacity-60"
          />
          {/* Dark Overlay for Text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full pt-20">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-white text-5xl md:text-7xl font-extrabold italic tracking-tight mb-8"
          >
            cravebit
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white text-4xl md:text-6xl font-bold mb-6 max-w-3xl leading-snug drop-shadow-lg"
          >
            India's #1 <br className="md:hidden" />food delivery app
          </motion.h2>

          {/* Subtitle */}
          <div className="mb-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-200 text-xl font-medium tracking-wide drop-shadow-md"
            >
              Craving <span className="text-red-400 font-bold">delicious food</span>? We've got you covered.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/menu" className="group flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-red-600/40 min-w-[200px]">
              <Utensils className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Order Food
            </Link>
            <Link to="/restaurants" className="group flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all min-w-[200px]">
              <Store className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Browse Restaurants
            </Link>
          </motion.div>
        </div>

        {/* Scroll Down Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer z-10 flex flex-col items-center text-white/80 hover:text-white"
          onClick={handleScroll}
        >
          <span className="text-sm font-medium mb-2 uppercase tracking-widest">Scroll down</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* FEATURED ITEM SHOWCASE */}
      <div className="w-full bg-white relative overflow-hidden py-16 lg:py-24 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="flex flex-col lg:flex-row items-center relative z-10">
            {/* LEFT COL */}
            <div className="lg:w-1/2 flex flex-col pt-12 lg:pt-0 relative pr-0 lg:pr-10">
              {/* Swoosh background for title */}
              <div className="absolute top-0 left-0 -ml-[50%] -mt-10 w-[150%] h-32 bg-red-600 rounded-br-[8rem] lg:rounded-br-[12rem] -z-10" />
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white px-2 mt-1 mb-8 drop-shadow-md">
                Cravebit Signature
              </h2>
              
              <h3 className="text-2xl font-bold text-gray-500 mb-4 tracking-tight">
                A masterpiece that will leave you wide-eyed.
              </h3>
              
              <p className="text-gray-700 text-lg mb-6 leading-relaxed max-w-lg">
                A scrumptious signature patty topped with a delectable spicy herb sauce, fresh farm greens, and shredded onions placed between perfectly toasted sesame buns.
              </p>
              
              <div className="font-bold text-gray-900 mb-4 text-lg">
                Serving Size: <span className="font-normal text-gray-700">180g</span>
              </div>
              
              <div className="mb-10">
                <div className="font-bold text-red-600 text-lg mb-1">Allergen Warning! Contains:</div>
                <div className="text-gray-700">Cereal containing gluten, Milk, Soya, Mustard</div>
              </div>
              
              {/* Nutritional Info Pill */}
              <div className="bg-red-600 text-white rounded-[2rem] py-6 px-4 md:px-8 max-w-[600px] shadow-2xl flex flex-wrap justify-between text-center gap-y-6">
                <div className="flex flex-col border-r border-red-400/50 pr-2 md:pr-4 w-1/4">
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">Energy</span>
                  <span className="font-black text-sm md:text-xl">450 kCal</span>
                </div>
                <div className="flex flex-col border-r border-red-400/50 px-2 md:px-4 w-1/4">
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">Protein</span>
                  <span className="font-black text-sm md:text-xl">15g</span>
                </div>
                <div className="flex flex-col border-r border-red-400/50 px-2 md:px-4 w-1/4">
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">Total Fat</span>
                  <span className="font-black text-sm md:text-xl">20g</span>
                </div>
                <div className="flex flex-col pl-2 md:pl-4 w-1/4">
                  <span className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">Carbs</span>
                  <span className="font-black text-sm md:text-xl">55g</span>
                </div>
              </div>
            </div>

            {/* RIGHT COL */}
            <div className="lg:w-1/2 relative mt-20 lg:mt-0 flex justify-center perspective-1000">
              <motion.img 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, type: "spring" }}
                src="https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4114.png"
                alt="Signature Burger"
                className="w-full max-w-[500px] z-10 drop-shadow-2xl relative"
                style={{ filter: "drop-shadow(0 35px 35px rgba(0,0,0,0.5))" }}
              />
              
              {/* Floating Ingredients Card */}
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="absolute top-10 md:-top-5 right-0 md:-right-10 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-xl z-20 max-w-[220px] md:max-w-[280px] border border-gray-100"
              >
                <div className="font-black text-gray-900 mb-3 text-lg border-b border-gray-200 pb-2">Ingredients</div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Premium bun, spicy mayo, crisp farm lettuce, red onion, signature hot patty, melted cheddar, and our secret seasoning.
                </p>
              </motion.div>
            </div>
          </div>
          
          {/* Thumbnails Carousel Area */}
          <div className="mt-24 border-t pt-10 flex flex-col items-center">
            <div className="flex items-center gap-4 lg:gap-8 overflow-x-auto pb-4 w-full justify-center">
              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 bg-white shadow-sm">
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 rotate-90" />
              </button>
              
              <div className="flex gap-4 md:gap-8 overflow-hidden py-2 px-2">
                
                <div className="bg-white border rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 min-w-[220px] md:min-w-[280px] cursor-pointer hover:border-red-500 hover:shadow-lg transition-all active ring-2 ring-red-500">
                  <img src="https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4114.png" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <span className="font-bold text-gray-900 text-xs md:text-sm">Cravebit Signature Burger</span>
                </div>
                
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 min-w-[220px] md:min-w-[280px] cursor-pointer hover:border-red-500 hover:shadow-lg transition-all opacity-70 hover:opacity-100">
                  <img src="https://freepngimg.com/thumb/pizza/2-pizza-png-image-thumb.png" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <span className="font-bold text-gray-600 text-xs md:text-sm">Spicy Paneer Pizza</span>
                </div>
                
                <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 md:p-4 flex items-center gap-3 md:gap-4 min-w-[220px] md:min-w-[280px] cursor-pointer hover:border-red-500 hover:shadow-lg transition-all opacity-70 hover:opacity-100">
                  <img src="https://freepngimg.com/thumb/fast_food/11-2-fast-food-download-png-thumb.png" className="w-12 h-12 md:w-16 md:h-16 object-contain" />
                  <span className="font-bold text-gray-600 text-xs md:text-sm">Crispy Chicken Box</span>
                </div>
                
              </div>

              <button className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0 bg-white shadow-sm">
                <ChevronDown className="w-5 h-5 md:w-6 md:h-6 -rotate-90" />
              </button>
            </div>
          </div>
          
        </div>
      </div>

      {/* DISCOVER SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why choose Cravebit?</h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">We bring you the absolute best dining spots and fastest delivery in your area.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-red-50 border border-red-100 hover:shadow-xl transition-all"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 text-red-600">
              <Clock className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600">Our delivery partners are trained to get your food hot and fresh to your door in record time.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-green-50 border border-green-100 hover:shadow-xl transition-all"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <Utensils className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Top Restaurants</h3>
            <p className="text-gray-600">We partner with the highest-rated local restaurants and exclusive premium brands.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center text-center p-8 rounded-3xl bg-blue-50 border border-blue-100 hover:shadow-xl transition-all"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600">
              <ThumbsUp className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Best Offers</h3>
            <p className="text-gray-600">Enjoy exclusive discounts, buy-one-get-one deals, and free delivery on Cravebit.</p>
          </motion.div>
        </div>
      </div>

      {/* POPULAR LOCALITIES / CALL TO ACTION */}
      <div className="bg-gray-50 py-24 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            <div className="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Hungry?<br/> We're just a <span className="text-red-500">tap away</span>.
              </h2>
              <p className="text-gray-600 text-lg mb-8">
                Explore thousands of restaurants, track your delivery in real-time, and get exclusive rewards directly on our website.
              </p>
              <div className="flex gap-4">
                <Link to="/menu" className="bg-red-600 text-white px-8 py-4 rounded-xl flex items-center gap-3 hover:bg-red-700 transition-colors shadow-lg shadow-red-500/30">
                  <span className="text-lg font-bold">Start Ordering Now</span>
                  <Utensils className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 relative bg-red-500 min-h-[300px] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                  alt="Delicious Food Spread" 
                  className="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-multiply"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
