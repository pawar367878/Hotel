import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { api } from '../../services/api';
import { ReviewItem } from '../../types';
import { Star, Plus, Trash2, Edit2, MessageSquare, X } from 'lucide-react';

export const AdminReviewsManager: React.FC = () => {
  const { reviews, refreshPublicData, showToast } = useRestaurant();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [form, setForm] = useState<Partial<ReviewItem>>({
    name: '',
    rating: 5,
    comment: '',
    date: 'Recently',
  });

  const handleCreate = () => {
    setEditingReview(null);
    setForm({
      name: '',
      rating: 5,
      comment: '',
      date: 'Just now',
    });
    setIsModalOpen(true);
  };

  const handleEdit = (rev: ReviewItem) => {
    setEditingReview(rev);
    setForm({
      ...rev,
      name: rev.name || rev.customerName || '',
      comment: rev.comment || rev.reviewText || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const reviewerName = form.name?.trim() || form.customerName?.trim();
    const reviewerComment = form.comment?.trim() || form.reviewText?.trim();

    if (!reviewerName || !reviewerComment) {
      showToast('Name and comment are required', 'error');
      return;
    }

    const payload = {
      ...form,
      name: reviewerName,
      customerName: reviewerName,
      comment: reviewerComment,
      reviewText: reviewerComment,
    };

    try {
      setIsSaving(true);
      if (editingReview) {
        await api.updateReview(editingReview.id, payload);
        showToast('✓ Review updated');
      } else {
        await api.createReview(payload);
        showToast('✓ Review added');
      }
      setIsModalOpen(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to save review', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review from "${name}"?`)) return;
    try {
      await api.deleteReview(id);
      showToast('Review deleted');
      await refreshPublicData();
    } catch (err: any) {
      showToast('Failed to delete review', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-black text-stone-100 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" />
            <span>Customer Testimonials & Reviews CMS</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Manage authentic customer feedback and reviews displayed on the website
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Review</span>
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => {
          const displayName = rev.name || rev.customerName || 'Guest';
          const displayComment = rev.comment || rev.reviewText || '';
          const starCount = Math.max(1, Math.min(5, Number(rev.rating) || 5));

          return (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(starCount)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-500">{rev.date || 'Recently'}</span>
                </div>
                <h4 className="font-heading text-sm font-bold text-stone-100">{displayName}</h4>
                <p className="text-xs text-stone-300 italic mt-2">"{displayComment}"</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  onClick={() => handleEdit(rev)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-400"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(rev.id, displayName)}
                  className="p-1.5 rounded-lg bg-stone-800 hover:bg-red-950 text-stone-500 hover:text-red-400"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <h3 className="font-heading text-base font-bold text-stone-100">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajesh Patil"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  >
                    <option value={5}>5 Stars (Exceptional)</option>
                    <option value={4}>4 Stars (Very Good)</option>
                    <option value={3}>3 Stars (Average)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Date Tag
                  </label>
                  <input
                    type="text"
                    value={form.date || ''}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    placeholder="e.g. 2 days ago"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-stone-950 border border-stone-800 text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Comment *
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
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
                  {isSaving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
