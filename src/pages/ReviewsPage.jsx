import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/dataService';
import { StarRating } from '../components/common/StarRating';
import { ReviewModal } from '../components/marketplace/ReviewModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Star, MessageSquare, Award, CheckCircle2, ChevronRight } from 'lucide-react';

export function ReviewsPage() {
  const { currentProfile } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review modal state
  const [selectedExchangeForReview, setSelectedExchangeForReview] = useState(null);

  const fetchReviewsData = async () => {
    if (!currentProfile) return;
    setLoading(true);
    try {
      const [allRevs, allExchs] = await Promise.all([
        DataService.getReviews(currentProfile.id),
        DataService.getExchanges(currentProfile.id)
      ]);
      setReviews(allRevs || []);
      setExchanges(allExchs || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewsData();
  }, [currentProfile?.id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500 mt-2">Loading member reviews...</p>
      </div>
    );
  }

  // Find completed exchanges where current user hasn't yet submitted a review
  const completedExchanges = exchanges.filter(e => e.status === 'completed');
  const pendingReviewExchanges = completedExchanges.filter(e => {
    const isUserA = e.userAId === currentProfile.id;
    const partnerId = isUserA ? e.userBId : e.userAId;
    // Check if we already reviewed this exchange
    const alreadyReviewed = reviews.some(r => r.exchangeId === e.id && r.reviewerId === currentProfile.id);
    return !alreadyReviewed;
  });

  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(r => {
    if (ratingCounts[r.rating] !== undefined) ratingCounts[r.rating]++;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Participant Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          Verified reputation scores and reviews from completed peer-to-peer skill exchanges.
        </p>
      </div>

      {/* Eligible Exchanges Awaiting Review Callout Banner */}
      {pendingReviewExchanges.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 space-y-4">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
            <span>You have {pendingReviewExchanges.length} completed exchange(s) awaiting your review!</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pendingReviewExchanges.map(ex => {
              const isUserA = ex.userAId === currentProfile.id;
              const partnerName = isUserA ? ex.userBName : ex.userAName;
              const partnerId = isUserA ? ex.userBId : ex.userAId;

              return (
                <div
                  key={ex.id}
                  className="bg-white p-4 rounded-2xl border border-amber-200/80 flex items-center justify-between shadow-xs"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Swap with {partnerName}</h4>
                    <p className="text-[11px] text-slate-500">{ex.skillAName} ↔ {ex.skillBName}</p>
                  </div>
                  <button
                    onClick={() => setSelectedExchangeForReview({ exchange: ex, partnerId, partnerName })}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Rate Experience
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Ratings Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-slate-900">{currentProfile?.rating?.toFixed(1) || '5.0'}</span>
          <div className="my-2">
            <StarRating rating={currentProfile?.rating || 5} size="md" />
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Based on {reviews.length} verified participant reviews
          </p>
        </div>

        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-2.5">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Rating Distribution</h3>
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingCounts[star] || 0;
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center space-x-3 text-xs">
                <span className="w-12 text-slate-600 font-semibold flex items-center gap-1">
                  <span>{star}</span> <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 text-right text-slate-400 font-medium">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-slate-900">All Received Reviews</h3>
        {reviews.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No reviews received yet"
            description="Complete skill exchanges with other members to receive authentic reviews and level up your rating."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{rev.reviewerName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <StarRating rating={rev.rating} size="sm" />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedExchangeForReview && (
        <ReviewModal
          isOpen={Boolean(selectedExchangeForReview)}
          onClose={() => setSelectedExchangeForReview(null)}
          exchange={selectedExchangeForReview.exchange}
          targetUserId={selectedExchangeForReview.partnerId}
          targetUserName={selectedExchangeForReview.partnerName}
          onReviewSubmitted={() => {
            fetchReviewsData();
          }}
        />
      )}
    </div>
  );
}
