import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { SpecialDish } from '../../types';
import { Plus, Edit2, Trash2, Sparkles, Check, X } from 'lucide-react';

export const AdminSpecialsManager: React.FC = () => {
  const { specialDishes, refreshPublicData, showToast } = useRestaurant();
  const [editingSpecial, setEditingSpecial] = useState<SpecialDish | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<Partial<SpecialDish>>({
    name: '',
    marathiName: '',
    description: '',
    price: 350,
    image: '',
    badge: 'Bestseller',
    isActive: true,
  });

  const handleCreate = () => {
    setEditingSpecial(null);
    setForm({
      name: '',
      marathiName: '',
      description: '',
      price: 350,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      badge: 'Bestseller',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (dish: SpecialDish) => {
    setEditingSpecial(dish);
    setForm({ ...dish });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      showToast('Name and price are required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingSpecial) {
        await api.updateSpecialDish(editingSpecial.id, form);
        showToast(`✓ Updated special dish "${form.name}"`);
      } else {
        await api.createSpecialDish(form);
        showToast(`✓ Created special dish "${form.name}"`);
      }
      setIsModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save special dish', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}" from signature specials?`)) return;
    try {
      await api.deleteSpecialDish(id);
      showToast(`Removed "${name}"`);
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100 flex items-center gap-2">
            <span>Special Dishes ("आमच्या खासियत")</span>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Feature signature delicacies right on the website showcase section
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Signature Special</span>
        </button>
      </div>

      {/* Specials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {specialDishes.map((dish) => (
          <div
            key={dish.id}
            className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 flex flex-col justify-between space-y-4 shadow-lg"
          >
            <div>
              <div className="relative h-44 rounded-2xl overflow-hidden bg-stone-800 mb-3">
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                {dish.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500 text-stone-950">
                    {dish.badge}
                  </span>
                )}
                <span
                  className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    dish.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-950 text-stone-400'
                  }`}
                >
                  {dish.isActive ? 'Active on Home' : 'Hidden'}
                </span>
              </div>

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-heading text-base font-bold text-stone-100">{dish.name}</h4>
                  <p className="font-marathi text-xs text-amber-400 font-semibold">
                    {dish.marathiName}
                  </p>
                </div>
                <span className="font-mono font-black text-amber-400 text-lg">₹{dish.price}</span>
              </div>

              <p className="text-xs text-stone-400 mt-2 line-clamp-2 leading-relaxed">
                {dish.description}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => handleEdit(dish)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(dish.id, dish.name)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-base font-bold text-stone-100">
                {editingSpecial ? 'Edit Special Dish' : 'New Signature Special'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Marathi Name
                  </label>
                  <input
                    type="text"
                    value={form.marathiName}
                    onChange={(e) => setForm({ ...form, marathiName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Badge</label>
                  <select
                    value={form.badge || ''}
                    onChange={(e) => setForm({ ...form, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  >
                    <option value="Bestseller">Bestseller</option>
                    <option value="Chef Special">Chef Special</option>
                    <option value="Popular">Popular</option>
                    <option value="Fresh Chulha">Fresh Chulha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="special-active"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded text-amber-500 bg-stone-950"
                />
                <label htmlFor="special-active" className="text-xs text-stone-300">
                  Display in "आमच्या खासियत" showcase section
                </label>
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
                  {isSaving ? 'Saving...' : 'Save Special'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
