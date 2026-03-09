import { create } from 'zustand';
import api from '../api/axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5001');

const savedFavorites = JSON.parse(localStorage.getItem('watch_favorites') || '[]');

const useWatchStore = create((set, get) => ({
  watches: [],
  favorites: savedFavorites,
  isLoading: false,
  error: null,

  toggleFavorite: (id) => set((state) => {
    const isFav = state.favorites.includes(id);
    const newFavs = isFav ? state.favorites.filter(f => f !== id) : [...state.favorites, id];
    localStorage.setItem('watch_favorites', JSON.stringify(newFavs));
    return { favorites: newFavs };
  }),

  fetchWatches: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/watches');
      set({ watches: data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch watches',
        isLoading: false,
      });
    }
  },

  addWatch: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/watches', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // The socket event will update the list
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to add watch',
        isLoading: false,
      });
      return false;
    }
  },

  updateWatch: async (id, formData) => {
    set({ isLoading: true, error: null });
    try {
      await api.put(`/watches/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Socket handles the update
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to update watch',
        isLoading: false,
      });
      return false;
    }
  },

  deleteWatch: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/watches/${id}`);
      // Socket handles the update
      set({ isLoading: false });
      return true;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to delete watch',
        isLoading: false,
      });
      return false;
    }
  },

  // Initialize socket listeners
  initSocket: () => {
    socket.on('inventory_updated', (data) => {
      const { action, watch, id } = data;
      const { watches } = get();

      if (action === 'create') {
        set({ watches: [...watches, watch] });
      } else if (action === 'update') {
        set({
          watches: watches.map((w) => (w._id === watch._id ? watch : w)),
        });
      } else if (action === 'delete') {
        set({
          watches: watches.filter((w) => w._id !== id),
        });
      }
    });
  },

  // Cleanup socket listeners
  cleanupSocket: () => {
    socket.off('inventory_updated');
  },
}));

export default useWatchStore;
