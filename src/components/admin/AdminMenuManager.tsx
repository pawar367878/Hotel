import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { MenuItem, MenuCategory } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Search,
  Flame,
  Clock,
  FolderPlus,
  Upload,
} from 'lucide-react';

export const AdminMenuManager: React.FC = () => {
  const { categories, menuItems, refreshPublicData, showToast } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'dishes' | 'categories'>('dishes');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Dish Modal
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [dishForm, setDishForm] = useState<Partial<MenuItem>>({
    name: '',
    marathiName: '',
    description: '',
    category: categories[0]?.name || 'Special Chulha Thalis',
    price: 250,
    image: '',
    isVegetarian: false,
    isAvailable: true,
    badge: '',
    prepTime: '20 mins',
    spiceLevel: 'Medium',
  });

  // Category Modal
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [catForm, setCatForm] = useState<Partial<MenuCategory>>({
    name: '',
    marathiName: '',
    description: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  // Open Dish modal for create
  const handleCreateDish = () => {
    setEditingDish(null);
    setDishForm({
      name: '',
      marathiName: '',
      description: '',
      category: categories[0]?.name || 'Special Chulha Thalis',
      price: 250,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
      isVegetarian: false,
      isAvailable: true,
      badge: '',
      prepTime: '20 mins',
      spiceLevel: 'Medium',
    });
    setIsDishModalOpen(true);
  };

  // Open Dish modal for edit
  const handleEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setDishForm({ ...dish });
    setIsDishModalOpen(true);
  };

  // Save Dish
  const handleSaveDish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name || !dishForm.price || !dishForm.category) {
      showToast('Please fill all required dish details', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingDish) {
        await api.updateMenuItem(editingDish.id, dishForm);
        showToast(`✓ Updated "${dishForm.name}"`);
      } else {
        await api.createMenuItem(dishForm);
        showToast(`✓ Added "${dishForm.name}" to menu`);
      }
      setIsDishModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save dish', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Dish
  const handleDeleteDish = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;
    try {
      await api.deleteMenuItem(id);
      showToast(`Deleted "${name}"`);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete dish', 'error');
    }
  };

  // Quick toggle availability
  const handleToggleAvailable = async (dish: MenuItem) => {
    try {
      await api.updateMenuItem(dish.id, { isAvailable: !dish.isAvailable });
      showToast(`Marked ${dish.name} as ${!dish.isAvailable ? 'Available' : 'Unavailable'}`);
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to update status', 'error');
    }
  };

  // Save Category
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) {
      showToast('Category name is required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, catForm);
        showToast(`✓ Updated category "${catForm.name}"`);
      } else {
        await api.createCategory(catForm);
        showToast(`✓ Created category "${catForm.name}"`);
      }
      setIsCatModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Dishes in this category may need reassigning.`))
      return;
    try {
      await api.deleteCategory(id);
      showToast(`Deleted category "${name}"`);
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to delete category', 'error');
    }
  };

  // Filter items
  const filteredDishes = menuItems.filter((dish) => {
    if (categoryFilter !== 'All' && dish.category.toLowerCase() !== categoryFilter.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        dish.name.toLowerCase().includes(q) ||
        dish.marathiName.toLowerCase().includes(q) ||
        dish.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100">Menu & Recipe CMS</h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Full dynamic control over food items, pricing (₹), descriptions, and categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-stone-900 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setActiveTab('dishes')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'dishes' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
              }`}
            >
              Food Dishes ({menuItems.length})
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'categories' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'
              }`}
            >
              Categories ({categories.length})
            </button>
          </div>

          {activeTab === 'dishes' ? (
            <button
              id="admin-add-dish-btn"
              onClick={handleCreateDish}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Dish</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setEditingCategory(null);
                setCatForm({ name: '', marathiName: '', description: '' });
                setIsCatModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
            >
              <FolderPlus className="w-4 h-4" />
              <span>+ Add Category</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'dishes' ? (
        /* DISHES LIST */
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-5 sm:p-6 space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish by English or Marathi name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-300 focus:outline-hidden focus:border-amber-500"
            >
              <option value="All">All Categories ({menuItems.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dishes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-950/60 text-stone-400 uppercase border-b border-stone-800">
                <tr>
                  <th className="py-3 px-3">Image & Dish</th>
                  <th className="py-3 px-3">Marathi Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60 text-stone-300">
                {filteredDishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-stone-850/40 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-11 h-11 rounded-lg object-cover bg-stone-800 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-stone-100 block">{dish.name}</span>
                          {dish.badge && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-500 text-stone-950">
                              {dish.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-marathi text-amber-400/90 font-semibold">
                      {dish.marathiName}
                    </td>
                    <td className="py-3 px-3 text-stone-400">{dish.category}</td>
                    <td className="py-3 px-3 font-mono font-black text-amber-400">₹{dish.price}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          dish.isVegetarian
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-red-950 text-red-300 border border-red-800'
                        }`}
                      >
                        {dish.isVegetarian ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleAvailable(dish)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-colors ${
                          dish.isAvailable
                            ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                            : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
                        }`}
                      >
                        {dish.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => handleEditDish(dish)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400 transition-colors"
                        title="Edit Dish"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDish(dish.id, dish.name)}
                        className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-400 hover:text-red-400 transition-colors"
                        title="Delete Dish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CATEGORIES LIST */
        <div className="bg-stone-900/80 rounded-3xl border border-stone-800 p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
              const dishCount = menuItems.filter(
                (m) => m.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <div
                  key={cat.id}
                  className="p-4 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-heading text-sm font-bold text-stone-100">{cat.name}</h4>
                    <p className="font-marathi text-xs text-amber-400">{cat.marathiName}</p>
                    <p className="text-[11px] text-stone-500 mt-1">{dishCount} dishes</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingCategory(cat);
                        setCatForm({ ...cat });
                        setIsCatModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-400"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-stone-900 hover:bg-red-950 text-stone-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Dish Add/Edit Modal */}
      {isDishModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in my-8">
            <div className="p-5 border-b border-stone-800 flex items-center justify-between">
              <h3 className="font-heading text-base font-bold text-stone-100">
                {editingDish ? 'Edit Food Item' : 'Add New Dish to Menu'}
              </h3>
              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDish} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Dish Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    placeholder="e.g. Special Chulha Mutton Thali"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Marathi Name
                  </label>
                  <input
                    type="text"
                    value={dishForm.marathiName}
                    onChange={(e) => setDishForm({ ...dishForm, marathiName: e.target.value })}
                    placeholder="e.g. खास चुलीवरची मटण थाळी"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  placeholder="Ingredients, accompaniments (bhakri, indrayani bhat, rassa)..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={dishForm.image}
                  onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Type</label>
                  <select
                    value={dishForm.isVegetarian ? 'veg' : 'nonveg'}
                    onChange={(e) =>
                      setDishForm({ ...dishForm, isVegetarian: e.target.value === 'veg' })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  >
                    <option value="nonveg">Non-Veg</option>
                    <option value="veg">Pure Veg</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">Badge</label>
                  <input
                    type="text"
                    value={dishForm.badge || ''}
                    onChange={(e) => setDishForm({ ...dishForm, badge: e.target.value })}
                    placeholder="e.g. Bestseller"
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Prep Time
                  </label>
                  <input
                    type="text"
                    value={dishForm.prepTime || ''}
                    onChange={(e) => setDishForm({ ...dishForm, prepTime: e.target.value })}
                    placeholder="25 mins"
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Spice Level
                  </label>
                  <select
                    value={dishForm.spiceLevel || 'Medium'}
                    onChange={(e) => setDishForm({ ...dishForm, spiceLevel: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy (Zanzanit)">Zanzanit (Spicy)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="dish-available"
                  checked={dishForm.isAvailable}
                  onChange={(e) => setDishForm({ ...dishForm, isAvailable: e.target.checked })}
                  className="rounded text-amber-500 bg-stone-950 border-stone-800"
                />
                <label htmlFor="dish-available" className="text-xs text-stone-300 font-semibold">
                  Dish is currently active & available for customer ordering
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950"
                >
                  {isSaving ? 'Saving...' : 'Save Dish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-base font-bold text-stone-100">
                {editingCategory ? 'Edit Category' : 'New Menu Category'}
              </h3>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="e.g. Special Chulha Thalis"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Marathi Name
                </label>
                <input
                  type="text"
                  value={catForm.marathiName}
                  onChange={(e) => setCatForm({ ...catForm, marathiName: e.target.value })}
                  placeholder="e.g. खास चुलीवरच्या थाळ्या"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="e.g. Served with hot bhakri and limitless rassa"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950"
                >
                  {isSaving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
