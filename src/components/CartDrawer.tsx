import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Tag,
  Flame,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    totalCartItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    discount,
    settings,
    setIsCheckoutOpen,
  } = useRestaurant();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const handleProceedToBill = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div id="cart-drawer-container" className="fixed inset-0 z-50 overflow-hidden no-print">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer (Desktop right side, Mobile full screen) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-stone-950 border-l border-stone-800 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-stone-800/80 flex items-center justify-between bg-stone-900/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-stone-100 flex items-center gap-2">
                  <span>Dining Table Order</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-bold">
                    {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
                  </span>
                </h3>
                <p className="font-marathi text-xs text-amber-400/80">
                  १२ मावळ - चुलीवरची अस्सल चव
                </p>
              </div>
            </div>

            <button
              id="cart-drawer-close"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              /* Empty Cart State */
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <div className="w-20 h-20 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-600 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h4 className="font-heading text-xl font-bold text-stone-200 mb-2">
                  No Dishes Added Yet
                </h4>
                <p className="text-stone-400 text-sm max-w-xs mb-6">
                  Experience the rustic flavours of 12 Maval. Add delicious Chulha Thalis, Biryani, or Starters to your dining table order!
                </p>
                <button
                  id="browse-menu-empty-cart-btn"
                  onClick={() => {
                    setIsCartOpen(false);
                    const menuEl = document.getElementById('menu');
                    if (menuEl) menuEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 transition-all shadow-md active:scale-95"
                >
                  Explore Dining Menu
                </button>
              </div>
            ) : (
              /* Cart Items List */
              <>
                <div className="flex items-center justify-between pb-2 border-b border-stone-850">
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                    Items In Order
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs text-stone-400 hover:text-red-400 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((item) => {
                    const lineTotal = item.dish.price * item.quantity;

                    return (
                      <div
                        key={item.dish.id}
                        id={`cart-item-${item.dish.id}`}
                        className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800/90 flex gap-3.5 items-center"
                      >
                        {/* Food Image */}
                        <img
                          src={item.dish.image || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=200&q=80'}
                          alt={item.dish.name}
                          className="w-16 h-16 rounded-lg object-cover bg-stone-800 shrink-0"
                        />

                        {/* Info & Stepper */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-sm font-bold text-stone-100 truncate">
                              {item.dish.name}
                            </h5>
                            <button
                              onClick={() => removeFromCart(item.dish.id)}
                              className="text-stone-500 hover:text-red-400 transition-colors p-1"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-xs text-stone-400 font-mono mt-0.5">
                            ₹{item.dish.price} × {item.quantity}
                          </p>

                          <div className="flex items-center justify-between mt-2 pt-1">
                            {/* Quantity Stepper */}
                            <div className="flex items-center gap-1.5 bg-stone-950 border border-stone-800 rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.dish.id, -1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-stone-800 hover:bg-stone-700 text-stone-200"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold text-amber-400">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.dish.id, 1)}
                                className="w-6 h-6 flex items-center justify-center rounded bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Line Total */}
                            <span className="font-heading text-sm font-black text-amber-400">
                              ₹{lineTotal}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-4 border-t border-stone-800">
                  {appliedCoupon ? (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-xs font-bold text-emerald-300">
                            Coupon Applied: {appliedCoupon.couponCode}
                          </p>
                          <p className="text-[11px] text-emerald-400/80">
                            {appliedCoupon.discountPercentage}% discount saved ₹{discount}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-red-400 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Tag className="w-4 h-4 text-stone-500 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            placeholder="Enter coupon code (e.g. MAVAL15)"
                            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-stone-900 border border-stone-800 text-stone-100 uppercase tracking-wider focus:outline-hidden focus:border-amber-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-amber-400 border border-stone-700"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-[11px] text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          <span>{couponError}</span>
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Calculations and Proceed to Bill Button */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-stone-800/80 bg-stone-900/90 space-y-3">
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold text-stone-100">₹{subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-mono font-bold">- ₹{discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>GST / Taxes:</span>
                  <span>Calculated on next step</span>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-stone-400 block font-medium">Order Subtotal</span>
                  <span className="font-heading text-2xl font-black text-amber-400">
                    ₹{subtotal - discount}
                  </span>
                </div>

                <button
                  id="proceed-to-bill-btn"
                  onClick={handleProceedToBill}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-950/60 active:scale-95 transition-all"
                >
                  <span>Confirm Table & Bill</span>
                  <ArrowRight className="w-4 h-4 text-stone-950" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
