import React, { useEffect, useState } from 'react';
import useWatchStore from '../store/useWatchStore';
import WatchCard from '../components/WatchCard';
import { motion } from 'framer-motion';
import { Loader2, Search } from 'lucide-react';

const Home = () => {
  const { watches, isLoading, error, fetchWatches } = useWatchStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredWatches = watches.filter((watch) => 
    watch.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    watch.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  if (isLoading && watches.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-rose-500 font-medium">{error}</p>
        <button 
          onClick={fetchWatches}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-16">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 dark:bg-black w-full h-[360px] md:h-[480px] shadow-2xl flex items-center mb-12">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full px-8 md:px-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 font-serif">
              Timeless <span className="text-gradient-gold">Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light tracking-wide">
              Explore our curated collection of luxury watches, meticulously verified and updated in real-time.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative max-w-xl w-full"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-white/20 transition-all shadow-xl"
              placeholder="Search by brand or model..."
            />
          </motion.div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Featured Collection</h2>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow ml-8"></div>
        </div>

        {filteredWatches.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            {searchQuery ? (
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">No timepieces found matching "{searchQuery}"</p>
            ) : (
              <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">Our vault is currently empty.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredWatches.map((watch, index) => (
              <WatchCard key={watch._id} watch={watch} index={Math.min(index, 10)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
