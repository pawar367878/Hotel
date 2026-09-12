import React, { useState } from 'react';
import { useRestaurant } from '../context/RestaurantContext';
import { Star, MessageSquare, CheckCircle2, User, Quote, Plus } from 'lucide-react';
import { api } from '../services/api';

export const ReviewsSection: React.FC = () => {
  const { reviews, showToast, refreshPublicData } = useRestaurant();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      showToast('Please enter your name and comments', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.createReview({
        name,
        rating,
        comment,
      });
      showToast('Thank you! Your review was submitted successfully.');
      setName('');
      setComment('');
      setShowReviewForm(false);
      await refreshPublicData();
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-stone-950 border-t border-stone-850">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Customer Satisfaction</span>
            </div>
            <h2 className="font-marathi text-3xl sm:text-4xl font-extrabold text-amber-400 mb-1">
              ग्राहकांचे मनोगत
            </h2>
            <h3 className="font-heading text-2xl sm:text-3xl font-extrabold text-stone-100">
              Honest Patron Experiences & Reviews
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 flex items-center gap-3">
              <div className="text-3xl font-black font-heading text-amber-400">{averageRating}</div>
              <div>
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] text-stone-400 mt-0.5 block">
                  Based on {reviews.length} authentic reviews
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-4 py-3 rounded-xl text-xs sm:text-sm font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </div>

        {/* Review submission dropdown form */}
        {showReviewForm && (
          <form
            onSubmit={handleAddReview}
            className="mb-10 p-6 rounded-2xl bg-stone-900 border border-amber-500/40 max-w-xl mx-auto space-y-4 animate-in fade-in"
          >
            <h4 className="font-heading text-lg font-bold text-stone-100">Share Your Experience</h4>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anand Deshmukh"
                className="w-full px-3 py-2 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Star Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setRating(num)}
                    className="p-1.5 rounded-lg text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${num <= rating ? 'fill-amber-400' : 'text-stone-600'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Your Review / Comment
              </label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share how you enjoyed the Chulha Mutton, Bhakri, Biryani, or hospitality..."
                className="w-full px-3 py-2 rounded-xl text-sm bg-stone-950 border border-stone-800 text-stone-100 focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-stone-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-stone-950"
              >
                {isSubmitting ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((rev) => {
            const reviewerName = (rev.name || rev.customerName || 'Valued Guest').trim();
            const reviewText = rev.comment || rev.reviewText || '';
            const initialLetter = reviewerName ? reviewerName.charAt(0).toUpperCase() : 'G';
            const starCount = Math.max(1, Math.min(5, Number(rev.rating) || 5));

            return (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-stone-900/70 border border-stone-800 hover:border-amber-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(starCount)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] text-stone-500">{rev.date || 'Recently'}</span>
                  </div>

                  <p className="text-sm text-stone-300 leading-relaxed italic">
                    "{reviewText}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-stone-800/80">
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                    {initialLetter}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-stone-100">{reviewerName}</h5>
                    <span className="text-[10px] text-stone-400">{rev.visitType || 'Verified Diner'}</span>
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
