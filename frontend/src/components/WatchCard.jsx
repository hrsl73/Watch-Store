import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import useWatchStore from '../store/useWatchStore';

const WatchCard = ({ watch, index }) => {
  const [showModal, setShowModal] = useState(false);
  const toggleFavorite = useWatchStore((state) => state.toggleFavorite);
  const isFavorite = useWatchStore((state) => state.favorites.includes(watch._id));

  // Try to use a static fallback if the image path is broken, or a placeholder
  const imageSrc = watch.img.startsWith('/') || watch.img.startsWith('http') || watch.img.startsWith('data:') 
    ? watch.img 
    : `/src/assets/${watch.img.split('/').pop()}`; // Fallback for local assets if any

  const getAvailabilityStatus = (quantity) => {
    const qty = quantity || 0;
    if (qty > 5) return { text: 'In Stock - Available', color: 'text-emerald-600 dark:text-emerald-400' };
    if (qty > 0) return { text: 'Only a few left', color: 'text-amber-600 dark:text-amber-400' };
    return { text: 'Out of Stock', color: 'text-rose-600 dark:text-rose-400' };
  };
  
  const availability = getAvailabilityStatus(watch.quantity);

  const handleToggleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite(watch._id);
    if (!isFavorite) {
      toast.success(`${watch.name} added to favorites!`, { icon: '❤️' });
    } else {
      toast.success(`${watch.name} removed from favorites.`, { icon: '💔' });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
        className="group relative glass-card rounded-2xl overflow-hidden flex flex-col h-full cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={imageSrc}
            alt={watch.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold text-slate-900 dark:text-white shadow-lg border border-white/20">
            ₹{watch.price.toLocaleString()}
          </div>
        </div>
        
        <div className="p-6 flex-grow flex flex-col justify-between z-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-2 tracking-widest uppercase">
              {watch.brand}
            </div>
            <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mb-2 leading-tight">
              {watch.name}
            </h3>
            <div className={`mt-2 text-xs font-bold tracking-wide uppercase ${availability.color}`}>
              {availability.text}
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-500 transition-colors uppercase tracking-wider"
            >
              Discover Details
            </button>
            
            <button 
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full shadow-lg transition-all hover:scale-110 ${
                isFavorite 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30' 
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white group-hover:shadow-indigo-500/30'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick View Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 dark:bg-slate-800/40 dark:hover:bg-slate-700/60 backdrop-blur-md rounded-full text-slate-900 dark:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-1/2 h-[40vh] md:h-auto relative bg-slate-100 dark:bg-slate-800">
                <img
                  src={imageSrc}
                  alt={watch.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800';
                  }}
                />
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white/80 dark:bg-slate-900/80">
                <div className="mb-2 inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 text-xs font-bold tracking-widest uppercase rounded-full">
                  {watch.brand}
                </div>
                
                <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-4">
                  {watch.name}
                </h2>
                
                <p className="text-4xl font-light text-slate-900 dark:text-white mb-6">
                  ${watch.price.toLocaleString()}
                </p>

                <div className="space-y-6 mb-8">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Experience the pinnacle of horological craftsmanship with this exquisite timepiece from {watch.brand}. Precision engineering meets timeless elegance in a design that speaks volumes about your refined taste.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Availability</span>
                      <span className={`font-medium ${availability.color}`}>{availability.text}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Shipping</span>
                      <span className="font-medium text-slate-900 dark:text-white">Free Express</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleToggleFavorite}
                  className={`w-full py-4 px-8 rounded-xl font-bold uppercase tracking-widest transition-all shadow-xl active:scale-[0.98] flex items-center justify-center gap-3 ${
                    isFavorite
                      ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30'
                      : 'bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white hover:shadow-indigo-500/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default WatchCard;
