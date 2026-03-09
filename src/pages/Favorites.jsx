import React from 'react';
import { motion } from 'framer-motion';
import { HeartCrack } from 'lucide-react';
import { Link } from 'react-router-dom';
import WatchCard from '../components/WatchCard';
import useWatchStore from '../store/useWatchStore';

const Favorites = () => {
  const { watches, favorites } = useWatchStore();
  const favoritedWatches = watches.filter(w => favorites.includes(w._id));

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">My Favorites</h1>
        <div className="px-3 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 font-bold rounded-full text-sm">
          {favorites.length}
        </div>
      </div>

      {favoritedWatches.length === 0 ? (
        <div className="text-center py-24 glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartCrack className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-4">No Favorites Yet</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            You haven't saved any watches to your collection yet. Explore our vault and favorite the pieces you love!
          </p>
          <Link 
            to="/"
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/30"
          >
            Explore Watches
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {favoritedWatches.map((watch, index) => (
            <WatchCard key={watch._id} watch={watch} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
