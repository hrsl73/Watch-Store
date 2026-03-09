import React from 'react';
import useAuthStore from '../store/useAuthStore';
import { User, Shield, Clock, Settings, Mail, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const UserProfile = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-1"
        >
          <div className="glass-panel rounded-3xl p-8 text-center border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 z-0 rounded-t-3xl"></div>
            
            <div className="relative z-10">
              <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 flex items-center justify-center mb-4 transform rotate-3 hover:rotate-6 transition-transform">
                <User className="w-10 h-10 text-indigo-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-serif">{user.username}</h2>
              
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {user.role === 'admin' ? (
                  <>
                    <Shield className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Administrator</span>
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Member</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 space-y-6"
        >
          <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-indigo-500" />
              Account Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Username</label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50">
                  {user.username}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Account Role</label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50 capitalize">
                  {user.role}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Member Since</label>
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Just now'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="glass-panel rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Preferences</h3>
             <p className="text-slate-500 dark:text-slate-400 text-sm">
                Additional profile settings and order history will be available here in a future update.
             </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;
