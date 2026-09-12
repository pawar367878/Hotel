import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderType } from '../types';
import { api } from '../services/api';
import {
  X,
  User,
  Phone,
  MapPin,
  FileText,
  Utensils,
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

export const OrderSummaryModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    subtotal,
    discount,
    appliedCoupon,
    calculateTax,
    settings,
    clearCart,
    setConfirmedOrder,
    showToast,
  } = useRestaurant();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const orderType: OrderType = 'Dine-In';
  const [tableNumber, setTableNumber] = useState('Table 1');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isCheckoutOpen) return null;

  const tax = calculateTax(subtotal, discount);
  const grandTotal = Math.round((Math.max(0, subtotal - discount) + tax) * 100) / 100;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerName.trim()) {
      setFormError('Please enter your name.');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!tableNumber.trim()) {
      setFormError('Please specify your table number or dining area.');
      return;
    }
    if (cart.length === 0) {
      setFormError('Your order is empty. Please add food items to proceed.');
      return;
    }

    try {
      setIsSubmitting(true);
      const itemsPayload = cart.map((c) => ({
        dishId: c.dish.id,
        quantity: c.quantity,
      }));

      const res = await api.createOrder({
        customerName,
        phone,
        orderType: 'Dine-In',
        tableNumber,
        specialInstructions,
        couponCode: appliedCoupon?.couponCode,
        items: itemsPayload,
      });

      if (res.success && res.order) {
        clearCart();
        setIsCheckoutOpen(false);
        setConfirmedOrder(res.order);
        showToast('✓ Table order confirmed & dining bill generated successfully!');
      }
    } catch (err: any) {
      console.error('Order creation failed:', err);
      setFormError(err.message || 'Failed to confirm table order. Please call staff or waiter directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="order-summary-modal-container" className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 no-print">
      <div className="bg-stone-950 border border-stone-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-stone-800 bg-stone-900/60 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
              12 Maval Dining
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-black text-stone-100">
              Table Dining Order & Bill Confirmation
            </h3>
            <p className="font-marathi text-xs text-amber-400/90 mt-0.5">
              टेबल ऑर्डर आणि बिल पावती
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 space-y-6">
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/50 flex items-center gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{formError}</span>
            </div>
          )}

          {/* Customer Personal Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Diner Contact Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Guest Name <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-900 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                  Mobile Number <span className="text-amber-400">*</span>
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit phone (e.g. 9822012345)"
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-900 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Dining Table Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Select Your Dining Table <span className="text-amber-400">*</span></span>
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6'].map((tbl) => (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => setTableNumber(tbl)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all ${
                    tableNumber === tbl
                      ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md'
                      : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-850'
                  }`}
                >
                  {tbl}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                id="checkout-table"
                type="text"
                required
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Or type custom table (e.g. Chulha Courtyard Table 3, Lawn Baithak)"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-stone-900 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            {/* Special Cooking Instructions */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Kitchen / Preparation Instructions (Optional)
              </label>
              <input
                id="checkout-notes"
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Medium spicy rassa, extra soft Bajri bhakri, serve quickly"
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-stone-900 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Order Items Table Review */}
          <div className="pt-4 border-t border-stone-850">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Dining Order Items ({cart.length})
            </h4>

            <div className="bg-stone-900/60 rounded-xl border border-stone-800 p-3 space-y-2 max-h-48 overflow-y-auto">
              {cart.map((item) => (
                <div
                  key={item.dish.id}
                  className="flex items-center justify-between text-xs sm:text-sm py-1 border-b border-stone-800/50 last:border-0"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="font-bold text-amber-400">{item.quantity}×</span>
                    <span className="text-stone-200 truncate">{item.dish.name}</span>
                  </div>
                  <span className="font-mono text-stone-300 font-bold shrink-0">
                    ₹{item.dish.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="mt-4 p-4 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2 text-xs sm:text-sm text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-mono text-stone-100">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount ({appliedCoupon?.couponCode}):</span>
                  <span className="font-mono font-bold">- ₹{discount}</span>
                </div>
              )}

              {tax > 0 && (
                <div className="flex justify-between text-stone-400">
                  <span>GST / Tax ({settings.taxGstPercentage}%):</span>
                  <span className="font-mono">₹{tax}</span>
                </div>
              )}

              <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-base sm:text-lg font-bold">
                <span className="text-stone-100">Dining Total Bill:</span>
                <span className="font-heading text-xl sm:text-2xl font-black text-amber-400">
                  ₹{grandTotal}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
            <button
              type="button"
              onClick={() => setIsCheckoutOpen(false)}
              className="px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-stone-400 hover:text-stone-200 bg-stone-900 border border-stone-800 transition-colors"
            >
              Back to Table Order
            </button>

            <button
              id="confirm-order-btn"
              type="submit"
              disabled={isSubmitting}
              className="px-7 py-3 rounded-xl text-sm font-black text-stone-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 shadow-xl shadow-amber-950/60 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Confirming Table Order...' : 'Confirm Table Order & Generate Bill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
