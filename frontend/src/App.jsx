import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import Favorites from './pages/Favorites';
import useAuthStore from './store/useAuthStore';
import useWatchStore from './store/useWatchStore';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  const { user } = useAuthStore();
  const { initSocket, cleanupSocket, fetchFavorites, clearFavorites } = useWatchStore();

  useEffect(() => {
    initSocket();
    return () => {
      cleanupSocket();
    };
  }, [initSocket, cleanupSocket]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      clearFavorites();
    }
  }, [user, fetchFavorites, clearFavorites]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans transition-colors duration-300">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
};

export default App;
