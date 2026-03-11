import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useWatchStore from '../store/useWatchStore';
import { Watch, LogOut, Settings, User, Menu, X, Moon, Sun, AlertTriangle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const { favorites } = useWatchStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const confirmLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setShowLogoutConfirm(false);
  };

  return (
    <>
    <nav className="sticky top-0 z-50 w-full glass-panel transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-2 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-indigo-500/30">
                <Watch className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-serif leading-none">
                  Chrono<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 font-sans font-light">Vault</span>
                </span>
                <span className="text-[0.65rem] uppercase tracking-[0.2em] text-slate-500 font-semibold mt-0.5 ml-0.5">
                  Luxury Timepieces
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/favorites" className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
              <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </Link>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === 'admin' ? '/admin' : '/profile'} className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  <div className="p-1 bg-white dark:bg-slate-700 rounded-full shadow-sm">
                    <User className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  </div>
                  <span className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">{user.username}</span>
                  {user.role === 'admin' && (
                    <span className="px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 rounded-full">Admin</span>
                  )}
                </Link>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-rose-500 rounded-lg hover:bg-rose-600 shadow-sm shadow-rose-500/20 transition-all hover:shadow-rose-500/40"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login"
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all hover:shadow-indigo-600/40 hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-2">
            <Link to="/favorites" className="relative p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
              <Heart className="w-5 h-5 text-slate-600 dark:text-slate-300 group-hover:text-rose-500 transition-colors" />
              {favorites.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              )}
            </Link>
            
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-4">
            {user ? (
              <>
                <div className="py-3 border-b border-slate-100 dark:border-slate-800">
                  <Link to={user.role === 'admin' ? '/admin' : '/profile'} onClick={() => setIsOpen(false)} className="block group">
                    <p className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Signed in as</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user.username}</p>
                  </Link>
                </div>
                
                {user.role === 'admin' && (
                  <Link 
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-slate-700 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 rounded-md"
                  >
                    <Settings className="w-5 h-5" />
                    Dashboard
                  </Link>
                )}
                
                <button 
                  onClick={() => setShowLogoutConfirm(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-base font-medium text-rose-600 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-400 rounded-md"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <div className="pt-2">
                <Link 
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-indigo-600 rounded-md shadow-sm"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>

    {/* Logout Confirmation Modal */}
    <AnimatePresence>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-rose-600 dark:text-rose-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="text-slate-500 dark:text-slate-400 mb-8">
                Are you sure you want to sign out of your account? You will need to sign in again to access the vault.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-rose-600/20"
                >
                  Yes, Logout
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default Navbar;
