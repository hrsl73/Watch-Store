import React, { useState, useEffect } from 'react';
import useWatchStore from '../store/useWatchStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { watches, fetchWatches, addWatch, updateWatch, deleteWatch, isLoading } = useWatchStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWatch, setEditingWatch] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    quantity: '1',
    imgSource: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchWatches();
  }, [fetchWatches]);

  const openModal = (watch = null) => {
    if (watch) {
      setEditingWatch(watch);
      setFormData({
        name: watch.name,
        brand: watch.brand,
        price: watch.price.toString(),
        quantity: watch.quantity !== undefined ? watch.quantity.toString() : '1',
        imgSource: watch.img.startsWith('/') ? '' : watch.img,
      });
      setImagePreview(watch.img.startsWith('/') ? `http://localhost:5001${watch.img}` : watch.img);
    } else {
      setEditingWatch(null);
      setFormData({ name: '', brand: '', price: '', quantity: '1', imgSource: '' });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingWatch(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData({ ...formData, imgSource: '' }); // Clear manual URL if file uploaded
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this watch?')) {
      const success = await deleteWatch(id);
      if (success) {
        toast.success('Watch deleted successfully');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('brand', formData.brand);
    data.append('price', formData.price);
    data.append('quantity', formData.quantity);
    
    if (imageFile) {
      data.append('image', imageFile);
    } else if (formData.imgSource) {
      data.append('imgSource', formData.imgSource);
    } else if (!editingWatch) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    let success;
    if (editingWatch) {
      success = await updateWatch(editingWatch._id, data);
    } else {
      success = await addWatch(data);
    }

    if (success) {
      toast.success(editingWatch ? 'Watch updated successfully' : 'Watch added successfully');
      closeModal();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 gap-4 border-b border-slate-200/60 dark:border-slate-800/60 relative">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-4xl font-bold font-serif text-slate-900 dark:text-white mb-2">Inventory Control</h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium tracking-wide">Manage global storefront listings</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl shadow-lg border border-transparent hover:border-indigo-500/50 transition-all hover:scale-105 active:scale-95 group mt-4 sm:mt-0"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span className="font-semibold tracking-wide uppercase text-sm">New Watch</span>
          </button>
        </div>
      </div>

      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/50 dark:border-slate-700/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Product</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Brand</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Stock</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {watches.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">
                    <p className="text-lg font-medium">No watches found in inventory.</p>
                  </td>
                </tr>
              ) : (
                watches.map((watch) => (
                  <tr key={watch._id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-5">
                        <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden flex-shrink-0 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
                          <img 
                            src={watch.img.startsWith('/') ? `http://localhost:5001${watch.img}` : watch.img.startsWith('http') || watch.img.startsWith('data:') ? watch.img : `/src/assets/${watch.img.split('/').pop()}`}
                            alt={watch.name} 
                            className="h-full w-full object-cover"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=150'; }}
                          />
                        </div>
                        <div>
                          <p className="font-bold font-serif text-lg text-slate-900 dark:text-white line-clamp-1">{watch.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 opacity-70">ID: {watch._id.substring(watch._id.length - 8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
                        {watch.brand}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-[1.1rem] text-slate-900 dark:text-white">
                      ₹{watch.price.toLocaleString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm border ${
                        (watch.quantity || 0) > 5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700/50' : 
                        (watch.quantity || 0) > 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-700/50' : 
                        'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-700/50'
                      }`}>
                        {watch.quantity || 0} Units
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-end gap-3 whitespace-nowrap">
                        <button
                          onClick={() => openModal(watch)}
                          className="p-2 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-400 dark:hover:bg-indigo-900/40 rounded-lg transition-colors shadow-sm opacity-50 group-hover:opacity-100"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(watch._id)}
                          className="p-2 text-rose-600 hover:bg-rose-100 dark:text-rose-400 dark:hover:bg-rose-900/40 rounded-lg transition-colors shadow-sm opacity-50 group-hover:opacity-100"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingWatch ? 'Edit Watch' : 'Add New Watch'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Submariner Date"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                      <input
                        name="brand"
                        type="text"
                        required
                        value={formData.brand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="e.g. Rolex"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price (₹)</label>
                      <input
                        name="price"
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="10000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                      <input
                        name="quantity"
                        type="number"
                        required
                        min="0"
                        step="1"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Image</label>
                    <div className="flex items-start gap-4">
                      <div 
                        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg flex-1 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative"
                      >
                        <div className="space-y-1 text-center">
                          <ImageIcon className="mx-auto h-12 w-12 text-slate-400" />
                          <div className="flex text-sm text-slate-600 dark:text-slate-400">
                            <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                              <span>Upload a file</span>
                              <input 
                                type="file" 
                                name="image" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="sr-only" 
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-slate-500">PNG, JPG up to 5MB</p>
                        </div>
                      </div>

                      {imagePreview && (
                        <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex-shrink-0 mt-1 relative group">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setImageFile(null);
                            }}
                            className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">OR</span>
                    </div>
                    
                    <div className="mt-2">
                      <input
                        name="imgSource"
                        type="text"
                        value={formData.imgSource}
                        onChange={handleInputChange}
                        disabled={!!imageFile}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors disabled:opacity-50"
                        placeholder="Image URL (e.g. https://...)"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex justify-center items-center gap-2 px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-colors min-w-[120px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>{editingWatch ? 'Save Changes' : 'Add Watch'}</>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
