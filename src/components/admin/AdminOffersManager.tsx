import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { OfferItem } from '../../types';
import { Tag, Plus, Edit2, Trash2, CheckCircle2, X } from 'lucide-react';

export const AdminOffersManager: React.FC = () => {
  const { offers, refreshPublicData, showToast } = useRestaurant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<OfferItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<Partial<OfferItem>>({
    title: '',
    couponCode: '',
    discountPercentage: 10,
    minOrderAmount: 500,
    description: '',
    isActive: true,
  });

  const handleCreate = () => {
    setEditingOffer(null);
    setForm({
      title: 'Family Feast Offer',
      couponCode: 'MAVAL10',
      discountPercentage: 10,
      minOrderAmount: 500,
      description: 'Get 10% instant discount on orders above ₹500',
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (offer: OfferItem) => {
    setEditingOffer(offer);
    setForm({ ...offer });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.couponCode || !form.discountPercentage) {
      showToast('Coupon code and discount % are required', 'error');
      return;
    }

    try {
      setIsSaving(true);
      if (editingOffer) {
        await api.updateOffer(editingOffer.id, form);
        showToast(`✓ Updated coupon ${form.couponCode}`);
      } else {
        await api.createOffer(form);
        showToast(`✓ Created coupon ${form.couponCode}`);
      }
      setIsModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save coupon', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, code: string) => {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    try {
      await api.deleteOffer(id);
      showToast(`Deleted coupon ${code}`);
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to delete coupon', 'error');
    }
  };

  const handleToggle = async (offer: OfferItem) => {
    try {
      await api.updateOffer(offer.id, { isActive: !offer.isActive });
      showToast(`Coupon ${offer.couponCode} is now ${!offer.isActive ? 'Active' : 'Paused'}`);
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to toggle status', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-400" />
            <span>Offers & Discount Coupons</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Configure promotional discount codes for your customers to apply at checkout
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create Coupon</span>
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className={`p-6 rounded-3xl border flex flex-col justify-between space-y-4 shadow-xl transition-all ${
              offer.isActive
                ? 'bg-stone-900/90 border-amber-500/40'
                : 'bg-stone-900/50 border-stone-800 opacity-70'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-base font-black px-3 py-1 rounded-lg bg-amber-500 text-stone-950 shadow-sm uppercase tracking-wider">
                  {offer.couponCode}
                </span>

                <button
                  onClick={() => handleToggle(offer)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase transition-colors ${
                    offer.isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-stone-800 text-stone-400'
                  }`}
                >
                  {offer.isActive ? 'Active' : 'Disabled'}
                </button>
              </div>

              <h4 className="font-heading text-lg font-bold text-stone-100">{offer.title}</h4>
              <p className="text-xs text-amber-400 font-bold mt-0.5">
                {offer.discountPercentage}% Instant Discount
              </p>
              {offer.minOrderAmount && (
                <p className="text-[11px] text-stone-400 mt-1">
                  Min order: ₹{offer.minOrderAmount}
                </p>
              )}
              {offer.description && (
                <p className="text-xs text-stone-400 mt-2 leading-relaxed">{offer.description}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
              <button
                onClick={() => handleEdit(offer)}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDelete(offer.id, offer.couponCode)}
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
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-base font-bold text-stone-100">
                {editingOffer ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Coupon Code (uppercase) *
                </label>
                <input
                  type="text"
                  required
                  value={form.couponCode}
                  onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                  placeholder="e.g. MAVAL15"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. Weekend Special 15% Off"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Discount % *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={100}
                    value={form.discountPercentage}
                    onChange={(e) => setForm({ ...form, discountPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Min Order (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.minOrderAmount || 0}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100 font-mono"
                  />
                </div>
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
                  id="coupon-active"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="rounded text-amber-500 bg-stone-950"
                />
                <label htmlFor="coupon-active" className="text-xs text-stone-300">
                  Coupon is active and ready to use
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
                  {isSaving ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
