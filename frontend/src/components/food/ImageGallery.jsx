import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, Heart } from 'lucide-react';

const ImageGallery = ({ images, name }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // If no images provided, use a placeholder or the single image string
  const galleryImages = Array.isArray(images) ? images : [images];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="relative group">
      {/* Main Image Container */}
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-xl border border-gray-100">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={galleryImages[currentIndex].startsWith('http') ? galleryImages[currentIndex] : `http://localhost:5000${galleryImages[currentIndex]}`}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </AnimatePresence>

        {/* Favorite Button */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-6 right-6 p-3 rounded-full bg-white/80 backdrop-blur-md shadow-lg hover:bg-white transition-all z-10"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} />
        </button>

        {/* Zoom Indicator */}
        <div className="absolute bottom-6 right-6 p-2 rounded-xl bg-black/20 backdrop-blur-sm text-white pointer-events-none">
          <Maximize2 className="w-5 h-5" />
        </div>

        {/* Navigation Buttons */}
        {galleryImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/50 backdrop-blur hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="flex gap-4 mt-6 overflow-x-auto pb-2 custom-scrollbar">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                currentIndex === idx ? 'border-red-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img 
                src={img.startsWith('http') ? img : `http://localhost:5000${img}`} 
                alt={`${name} thumbnail ${idx}`} 
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
