import React, { useState, useMemo } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  Printer,
  Download,
  Search,
  Plus,
  Minus,
  Trash2,
  Check,
  Flame,
  Clock,
  Sparkles,
  Filter,
} from 'lucide-react';
import { MenuItem } from '../types';
import { downloadMenuPdf } from '../utils/pdfGenerator';

export const MenuSection: React.FC = () => {
  const {
    categories,
    menuItems,
    settings,
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    setIsPrintMenuOpen,
    showToast,
  } = useRestaurant();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'All' | 'Veg' | 'NonVeg'>('All');

  // Filter items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // Category match
      if (selectedCategory !== 'All' && item.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter === 'Veg' && !item.isVegetarian) return false;
      if (dietaryFilter === 'NonVeg' && item.isVegetarian) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchMarathi = item.marathiName.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCat = item.category.toLowerCase().includes(q);
        if (!matchName && !matchMarathi && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, dietaryFilter, searchQuery]);

  const handleDownloadPdf = () => {
    showToast('Generating official branded Menu PDF...');
    downloadMenuPdf(categories, menuItems, settings);
  };

  return (
    <section id="menu" className="py-20 bg-stone-900/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Menu Print/Download Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Authentic 12 Maval Dining Menu</span>
            </div>
            <h2 className="font-marathi text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400 mb-1">
              आमचा संपूर्ण मेनू
            </h2>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-100">
              Heritage Dining Menu (टेबल मेनू)
            </h3>
            <p className="text-stone-400 text-sm mt-1 max-w-xl">
              Freshly cooked upon your order over fragrant wood-fired hearths. Add dishes directly to your Table Dining Order or view our printed menu.
            </p>
          </div>

          {/* Premium Menu Print & Download Buttons */}
          <div className="flex items-center gap-3">
            <button
              id="menu-print-btn"
              onClick={() => setIsPrintMenuOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-100 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-amber-500/50 transition-all shadow-md active:scale-95"
              title="Print menu in printer-friendly view"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>🖨 Print Menu</span>
            </button>

            <button
              id="menu-download-btn"
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 border border-amber-400 transition-all shadow-md active:scale-95"
              title="Download full menu as PDF"
            >
              <Download className="w-4 h-4" />
              <span>⬇ Download Menu PDF</span>
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-stone-950/80 p-4 sm:p-5 rounded-2xl border border-stone-800 shadow-xl mb-10 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="menu-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dish (e.g., Biryani, Thali, Bhakri, Mutton)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-stone-900 border border-stone-700/80 text-stone-100 placeholder:text-stone-500 focus:outline-hidden focus:border-amber-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-100"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Dietary Toggle (All / Veg / Non-Veg) */}
            <div className="flex items-center gap-1.5 p-1 bg-stone-900 rounded-xl border border-stone-800 w-full sm:w-auto shrink-0">
              <button
                id="filter-all"
                onClick={() => setDietaryFilter('All')}
                className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  dietaryFilter === 'All'
                    ? 'bg-amber-500 text-stone-950'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                All
              </button>
              <button
                id="filter-veg"
                onClick={() => setDietaryFilter('Veg')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  dietaryFilter === 'Veg'
                    ? 'bg-emerald-600 text-white'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Pure Veg
              </button>
              <button
                id="filter-nonveg"
                onClick={() => setDietaryFilter('NonVeg')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  dietaryFilter === 'NonVeg'
                    ? 'bg-red-600 text-white'
                    : 'text-stone-400 hover:text-stone-100'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scrolling Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
            <button
              id="cat-pill-all"
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'All'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md'
                  : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
              }`}
            >
              All Categories ({menuItems.length})
            </button>

            {categories.map((cat) => {
              const count = menuItems.filter(
                (m) =>
                  m.category.toLowerCase().trim() === cat.name.toLowerCase().trim() ||
                  m.category.toLowerCase().includes(cat.name.toLowerCase()) ||
                  cat.name.toLowerCase().includes(m.category.toLowerCase())
              ).length;

              const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  id={`cat-pill-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md'
                      : 'bg-stone-900 text-stone-300 hover:bg-stone-800 border border-stone-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  {count > 0 && <span className="ml-1.5 opacity-60 text-xs font-mono">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Food Items Cards Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-stone-950/50 rounded-2xl border border-stone-800">
            <Flame className="w-12 h-12 text-stone-600 mx-auto mb-3 animate-pulse" />
            <p className="text-stone-300 text-base font-semibold">No dishes match your criteria</p>
            <p className="text-stone-500 text-xs mt-1">Try changing category or clearing your search query.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setDietaryFilter('All');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 text-amber-400 hover:bg-stone-700"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredItems.map((dish) => {
              const cartItem = cart.find((item) => item.dish.id === dish.id);

              return (
                <div
                  key={dish.id}
                  id={`menu-card-${dish.id}`}
                  className="flex flex-col justify-between bg-stone-900/90 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/40 transition-all duration-300 shadow-xl group"
                >
                  <div>
                    {/* Food Image Container */}
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-800">
                      <img
                        src={dish.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80'}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />

                      {/* Veg / Non-Veg Indicator */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded bg-stone-950/90 border border-stone-700 backdrop-blur-xs">
                        <span
                          className={`w-2.5 h-2.5 rounded-full border ${
                            dish.isVegetarian
                              ? 'bg-emerald-500 border-emerald-300'
                              : 'bg-red-500 border-red-300'
                          }`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-200">
                          {dish.isVegetarian ? 'Veg' : 'Non-Veg'}
                        </span>
                      </div>

                      {/* Badge if present */}
                      {dish.badge && (
                        <span className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-md">
                          {dish.badge}
                        </span>
                      )}

                      {/* Prep time or Spice Level */}
                      <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-stone-300">
                        {dish.prepTime && (
                          <span className="flex items-center gap-1 bg-stone-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>{dish.prepTime}</span>
                          </span>
                        )}
                        {dish.spiceLevel && (
                          <span className="flex items-center gap-1 bg-stone-950/70 px-2 py-0.5 rounded backdrop-blur-xs text-amber-300">
                            <Flame className="w-3 h-3 text-amber-400" />
                            <span>{dish.spiceLevel}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dish Info */}
                    <div className="p-5">
                      <div className="mb-1">
                        <h4 className="font-heading text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                          {dish.name}
                        </h4>
                        {dish.marathiName && (
                          <p className="font-marathi text-sm font-semibold text-amber-400/90">
                            {dish.marathiName}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-stone-400 line-clamp-2 mt-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Price and Add-to-Cart Controls */}
                  <div className="p-5 pt-0 border-t border-stone-800/80 mt-auto">
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <span className="text-[11px] text-stone-400 block font-medium">Price</span>
                        <span className="font-heading text-xl font-black text-amber-400">
                          ₹{dish.price}
                        </span>
                      </div>

                      {/* Functional Ordering Controls */}
                      {cartItem ? (
                        <div className="flex items-center gap-1.5 bg-stone-950 border border-amber-500/40 rounded-xl p-1 shadow-inner">
                          <button
                            id={`cart-minus-${dish.id}`}
                            onClick={() => updateQuantity(dish.id, -1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                            title="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-amber-400">
                            {cartItem.quantity}
                          </span>
                          <button
                            id={`cart-plus-${dish.id}`}
                            onClick={() => updateQuantity(dish.id, 1)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors"
                            title="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                          <button
                            id={`cart-remove-${dish.id}`}
                            onClick={() => removeFromCart(dish.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-950 text-stone-500 hover:text-red-400 transition-colors ml-1"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          id={`add-to-cart-${dish.id}`}
                          onClick={() => addToCart(dish, 1)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-950/40"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Add to Table</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
