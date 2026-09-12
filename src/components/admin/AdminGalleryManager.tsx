import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { GalleryItem } from '../../types';
import { Plus, Trash2, Edit2, Image, X } from 'lucide-react';

export const AdminGalleryManager: React.FC = () => {
  const { gallery, refreshPublicData, showToast } = useRestaurant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'Chulha Hearth',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    caption: '',
  });

  const handleCreate = () => {
    setForm({
      title: '',
      category: 'Chulha Hearth',
      image: '',
      caption: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.image) {
      showToast('Title and Image URL are required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      await api.createGalleryItem(form);
      showToast('✓ Added photo to gallery');
      setIsModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to add image', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete photo "${title}"?`)) return;
    try {
      await api.deleteGalleryItem(id);
      showToast('Photo removed from gallery');
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to delete photo', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100">Photo Gallery CMS</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage food, hearth, ambiance and garden photography shown on website
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Photo</span>
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-lg"
          >
            <div className="relative h-44 bg-stone-800">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-950/80 text-amber-400 backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            <div className="p-3.5 space-y-1">
              <h4 className="font-heading text-xs font-bold text-stone-100 truncate">
                {item.title}
              </h4>
              {item.caption && <p className="text-[11px] text-stone-400 truncate">{item.caption}</p>}
            </div>

            <div className="p-3 border-t border-stone-800/80 flex justify-end">
              <button
                onClick={() => handleDelete(item.id, item.title)}
                className="p-1.5 rounded-lg bg-stone-950 hover:bg-red-950 text-stone-500 hover:text-red-400 transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-base font-bold text-stone-100">Add Photo to Gallery</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Clay Pots on Hearth"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Category</label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="Chulha Hearth, Dining, Ambience, Food..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Caption</label>
                <input
                  type="text"
                  value={form.caption || ''}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                  placeholder="Short description..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950"
                >
                  {isSaving ? 'Uploading...' : 'Save Photo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
