import { create } from 'zustand';
import api from '../api/axios';

const getInitialUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && !user.username) {
      localStorage.removeItem('user');
      return null;
    }
    return user;
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: getInitialUser(),
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Login failed',
        isLoading: false,
      });
      return false;
    }
  },

  register: async (username, password, role) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { username, password, role });
      localStorage.setItem('user', JSON.stringify(data));
      set({ user: data, isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Registration failed',
        isLoading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },
  
  clearError: () => set({ error: null })
}));

export default useAuthStore;
