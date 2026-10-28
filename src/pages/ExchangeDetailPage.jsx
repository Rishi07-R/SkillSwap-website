import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DataService } from '../lib/dataService';
import { StatusBadge } from '../components/common/Badge';
import { ReviewModal } from '../components/marketplace/ReviewModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  ArrowLeftRight,
  Video,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Save,
  Star,
  ExternalLink,
  ChevronLeft,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function ExchangeDetailPage() {
  const { id } = useParams();
  const { currentProfile } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [exchange, setExchange] = useState(null);
  const [loading, setLoading] = useState(true);
  const [meetingLink, setMeetingLink] = useState('');
  const [scheduleDetails, setScheduleDetails] = useState('');
  const [sharedNotes, setSharedNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchExchange = async () => {
    setLoading(true);
    try {
      const data = await DataService.getExchangeById(id);
      if (data) {
        setExchange(data);
        setMeetingLink(data.meetingLink || '');
        setScheduleDetails(data.scheduleDetails || '');
        setSharedNotes(data.sharedNotes || '');
      }
    } catch (err) {
      console.error('Error fetching exchange detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchange();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500 mt-2">Loading exchange session...</p>
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">Exchange Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested exchange session could not be located.</p>
        <Link to="/dashboard" className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isUserA = currentProfile?.id === exchange.userAId;
  const isUserB = currentProfile?.id === exchange.userBId;
  const partnerName = isUserA ? exchange.userBName : exchange.userAName;
  const partnerAvatar = isUserA ? exchange.userBAvatar : exchange.userAAvatar;
  const partnerId = isUserA ? exchange.userBId : exchange.userAId;

  const myConfirmed = isUserA ? exchange.userACompleted : exchange.userBCompleted;
  const partnerConfirmed = isUserA ? exchange.userBCompleted : exchange.userACompleted;

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSavingNotes(true);
    try {
      const updated = await DataService.updateExchange(exchange.id, {
        meetingLink,
        scheduleDetails,
        sharedNotes
      });
      setExchange(updated);
      showToast('Exchange workspace details updated!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save exchange notes.', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleConfirmCompletion = async () => {
    try {
      const updated = await DataService.confirmExchangeCompletion(exchange.id, currentProfile.id);
      setExchange(updated);

      if (updated.status === 'completed') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
        showToast('Both participants confirmed completion! Exchange completed.', 'success', 'Congratulations! 🎉');
        setIsReviewModalOpen(true);
      } else {
        showToast('You confirmed completion. Waiting for your partner to confirm.', 'info');
      }
    } catch (err) {
      showToast(err.message || 'Error updating completion status', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-purple-600 hover:text-purple-800 mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Exchange Workspace
            </h1>
            <StatusBadge status={exchange.status} />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Collaborative session room for your skill trade with <strong className="text-slate-800">{partnerName}</strong>
          </p>
        </div>

        {/* Action Button for Completed / Review */}
        {exchange.status === 'completed' && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Review Partner</span>
          </button>
        )}
      </div>

      {/* Agreed Trade Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Agreed Knowledge Exchange</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* User A Trade */}
          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center space-x-4">
            <img
              src={exchange.userAAvatar}
              alt={exchange.userAName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                {exchange.userAName} Teaches:
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{exchange.skillAName}</p>
            </div>
          </div>

          {/* User B Trade */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center space-x-4">
            <img
              src={exchange.userBAvatar}
              alt={exchange.userBName}
              className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-xs"
            />
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                {exchange.userBName} Teaches:
              </span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">{exchange.skillBName}</p>
            </div>
          </div>
        </div>

        {/* Live Video Meeting Callout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block">Live Video Session Room</span>
              <span className="text-[11px] text-slate-500 truncate max-w-sm block">
                {exchange.meetingLink || 'No video link set yet'}
              </span>
            </div>
          </div>

          {exchange.meetingLink && (
            <a
              href={exchange.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <span>Join Video Call</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Two-Party Completion Sign-Off Module */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">Exchange Completion Sign-off</h3>
            <p className="text-xs text-slate-500">
              Both participants must confirm their completion to mark the exchange officially complete.
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-purple-600" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Your status */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">Your Confirmation:</span>
              <span className="text-xs text-slate-500">
                {myConfirmed ? 'You confirmed all sessions completed' : 'Awaiting your sign-off'}
              </span>
            </div>
            {myConfirmed ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Confirmed
              </span>
            ) : (
              <button
                onClick={handleConfirmCompletion}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Confirm Completion
              </button>
            )}
          </div>

          {/* Partner status */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-700 block">{partnerName}'s Confirmation:</span>
              <span className="text-xs text-slate-500">
                {partnerConfirmed ? `${partnerName} signed off` : 'Pending partner confirmation'}
              </span>
            </div>
            {partnerConfirmed ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Confirmed
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> In Progress
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Collaborative Session Notes & Settings Form */}
      <form onSubmit={handleSaveDetails} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base text-slate-900">Session Coordination & Shared Notes</h3>
            <p className="text-xs text-slate-500">Coordinate schedules, add notes, and list milestone goals.</p>
          </div>
          <button
            type="submit"
            disabled={savingNotes}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savingNotes ? 'Saving...' : 'Save Workspace'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Video Call URL (Google Meet, Zoom, etc.):
            </label>
            <input
              type="url"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Agreed Schedule Details:
            </label>
            <input
              type="text"
              value={scheduleDetails}
              onChange={(e) => setScheduleDetails(e.target.value)}
              placeholder="e.g. Saturdays at 11am EST for 4 weeks"
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Shared Learning Goals, Agenda & Code Links:
          </label>
          <textarea
            rows="6"
            value={sharedNotes}
            onChange={(e) => setSharedNotes(e.target.value)}
            placeholder="Document shared repos, Figma links, session 1 milestones, and practice exercises here..."
            className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-4 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>
      </form>

      {/* Review partner modal */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          exchange={exchange}
          targetUserId={partnerId}
          targetUserName={partnerName}
          onReviewSubmitted={() => {
            fetchExchange();
          }}
        />
      )}
    </div>
  );
}
