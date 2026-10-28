import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { StarRating } from '../common/StarRating';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DataService } from '../../lib/dataService';
import confetti from 'canvas-confetti';

export function ReviewModal({ isOpen, onClose, exchange, targetUserId, targetUserName, onReviewSubmitted }) {
  const { currentProfile } = useAuth();
  const { showToast } = useNotifications();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentProfile) return;

    if (!comment.trim()) {
      setError('Please provide feedback about your exchange experience.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await DataService.createReview({
        exchangeId: exchange.id,
        reviewerId: currentProfile.id,
        reviewerName: currentProfile.fullName,
        reviewerAvatar: currentProfile.avatarUrl,
        revieweeId: targetUserId,
        rating,
        comment: comment.trim(),
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Thank you for rating your exchange partner!', 'success', 'Review Published');
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Leave Exchange Review">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-slate-600 mb-2">
            How was your exchange experience with <span className="font-semibold text-slate-900">{targetUserName}</span>?
          </p>
          <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <StarRating rating={rating} size="lg" interactive={true} onChange={setRating} />
          </div>
        </div>

        {error && <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg">{error}</p>}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Written Feedback:
          </label>
          <textarea
            rows="3"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details on their teaching style, punctuality, and overall value of the swap..."
            className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
