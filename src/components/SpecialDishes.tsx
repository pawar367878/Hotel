import React from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Plus, Minus, Trash2, Sparkles, Flame, Check } from 'lucide-react';
import { MenuItem } from '../types';

export const SpecialDishes: React.FC = () => {
  const { specialDishes, menuItems, cart, addToCart, updateQuantity, removeFromCart } = useRestaurant();

  const activeSpecials = specialDishes.filter((s) => s.isActive);

  if (activeSpecials.length === 0) return null;

  return (
    <section id="specialties" className="py-20 bg-stone-950 border-b border-stone-850 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Chef's Masterpieces</span>
          </div>
          <h2 className="font-marathi text-3xl sm:text-4xl lg:text-5xl font-extrabold text-amber-400 mb-2">
            आमच्या खासियत
          </h2>
          <p className="font-heading text-xl sm:text-2xl font-bold text-stone-100 mb-3">
            Signature Wood-Fired Chulha Delicacies
          </p>
          <p className="text-stone-400 text-sm sm:text-base leading-relaxed">
            Crafted slowly on open earthen embers with secret family recipes preserved for over three decades.
          </p>
        </div>

        {/* Specials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
          {activeSpecials.map((special) => {
            // Check if special dish corresponds to a menu item or can be added to cart
            const matchedItem = menuItems.find(
              (m) => m.name.toLowerCase() === special.name.toLowerCase() || m.id === special.id
            ) || {
              id: special.id,
              name: special.name,
              marathiName: special.marathiName,
              description: special.description,
              price: special.price,
              category: 'Special Chulha Thalis',
              image: special.image,
              isAvailable: true,
              isVegetarian: special.name.toLowerCase().includes('pithla') || special.name.toLowerCase().includes('veg'),
            };

            const cartItem = cart.find((item) => item.dish.id === matchedItem.id);

            return (
              <div
                key={special.id}
                id={`special-card-${special.id}`}
                className="group flex flex-col justify-between bg-stone-900/80 rounded-2xl overflow-hidden border border-stone-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-950/30"
              >
                <div>
                  {/* Image & Badges */}
                  <div className="relative h-52 w-full overflow-hidden bg-stone-800">
                    <img
                      src={special.image}
                      alt={special.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />

                    {/* Badge */}
                    {special.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500 text-stone-950 shadow-md">
                        {special.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="font-marathi text-sm font-bold text-amber-300 drop-shadow">
                        {special.marathiName}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-heading text-lg font-bold text-stone-100 group-hover:text-amber-400 transition-colors">
                        {special.name}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-400 line-clamp-3 mb-4 leading-relaxed">
                      {special.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Price & Add to Cart Controls */}
                <div className="p-5 pt-0 border-t border-stone-800/80 mt-auto">
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-xs text-stone-400 block font-medium">Price</span>
                      <span className="font-heading text-xl font-black text-amber-400">
                        ₹{special.price}
                      </span>
                    </div>

                    {/* Cart Action */}
                    {cartItem ? (
                      <div className="flex items-center gap-1.5 bg-stone-950 border border-amber-500/40 rounded-xl p-1 shadow-inner">
                        <button
                          id={`special-qty-minus-${special.id}`}
                          onClick={() => updateQuantity(matchedItem.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-6 text-center text-sm font-bold text-amber-400">
                          {cartItem.quantity}
                        </span>
                        <button
                          id={`special-qty-plus-${special.id}`}
                          onClick={() => updateQuantity(matchedItem.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`special-remove-${special.id}`}
                          onClick={() => removeFromCart(matchedItem.id)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-950 text-stone-500 hover:text-red-400 transition-colors ml-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`special-add-btn-${special.id}`}
                        onClick={() => addToCart(matchedItem as MenuItem, 1)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-950/50"
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
      </div>
    </section>
  );
};
