import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DataService } from '../lib/dataService';
import { StatusBadge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import {
  Inbox,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeftRight,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function RequestsPage() {
  const { currentProfile } = useAuth();
  const { showToast, refreshNotifications } = useNotifications();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'sent'
  const [filterStatus, setFilterStatus] = useState('all');
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    if (!currentProfile) return;
    setLoading(true);
    try {
      const data = await DataService.getExchangeRequests(currentProfile.id);
      setRequests(data || []);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentProfile?.id]);

  const handleAccept = async (req) => {
    setProcessingId(req.id);
    try {
      await DataService.updateRequestStatus(req.id, 'accepted', currentProfile.id);
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      showToast(`Exchange accepted! A collaborative exchange session is now active.`, 'success', 'Proposal Accepted');
      await fetchRequests();
      refreshNotifications();
    } catch (err) {
      showToast(err.message || 'Failed to accept request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (req) => {
    setProcessingId(req.id);
    try {
      await DataService.updateRequestStatus(req.id, 'rejected', currentProfile.id);
      showToast('Exchange proposal declined.', 'info');
      await fetchRequests();
      refreshNotifications();
    } catch (err) {
      showToast(err.message || 'Failed to decline request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (req) => {
    setProcessingId(req.id);
    try {
      await DataService.updateRequestStatus(req.id, 'cancelled', currentProfile.id);
      showToast('Proposal cancelled.', 'info');
      await fetchRequests();
    } catch (err) {
      showToast(err.message || 'Failed to cancel request.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  // Filter list
  const filteredRequests = requests.filter(r => {
    const isReceived = r.receiverId === currentProfile?.id;
    const isSent = r.senderId === currentProfile?.id;

    if (activeTab === 'received' && !isReceived) return false;
    if (activeTab === 'sent' && !isSent) return false;

    if (filterStatus !== 'all' && r.status !== filterStatus) return false;

    return true;
  });

  const receivedCount = requests.filter(r => r.receiverId === currentProfile?.id && r.status === 'pending').length;
  const sentCount = requests.filter(r => r.senderId === currentProfile?.id && r.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Exchange Requests</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage inbound proposals and track swap offers you've submitted to fellow members.
        </p>
      </div>

      {/* Tabs and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Main Tabs */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'received'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received Proposals</span>
            {receivedCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'received' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {receivedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('sent')}
            className={`inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sent'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Proposals</span>
            {sentCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'sent' ? 'bg-white text-purple-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {sentCount}
              </span>
            )}
          </button>
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="py-1.5 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Only</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Declined</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="py-24 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Loading exchange requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <EmptyState
          icon={activeTab === 'received' ? Inbox : Send}
          title={activeTab === 'received' ? 'No incoming proposals' : 'No outgoing proposals'}
          description={
            activeTab === 'received'
              ? 'When other members discover your skills and propose an exchange, they will appear here.'
              : 'Browse members in Explore or Smart Matches and propose your first swap!'
          }
          action={
            <Link
              to="/explore"
              className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              Browse Member Directory
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const isReceived = req.receiverId === currentProfile?.id;
            const otherUserName = isReceived ? req.senderName : req.receiverName;
            const otherUserAvatar = isReceived ? req.senderAvatar : req.receiverAvatar;
            const otherUserId = isReceived ? req.senderId : req.receiverId;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:border-purple-200 transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Participant and timestamp */}
                  <div className="flex items-center space-x-3.5">
                    <Link to={`/profile/${otherUserId}`}>
                      <img
                        src={otherUserAvatar}
                        alt={otherUserName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                    </Link>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/profile/${otherUserId}`}
                          className="font-bold text-slate-900 hover:text-purple-600 text-sm"
                        >
                          {otherUserName}
                        </Link>
                        <StatusBadge status={req.status} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Proposed on {new Date(req.createdAt).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    {/* If received and pending */}
                    {isReceived && req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleReject(req)}
                          disabled={processingId === req.id}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(req)}
                          disabled={processingId === req.id}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept & Start Swap</span>
                        </button>
                      </>
                    )}

                    {/* If sent and pending */}
                    {!isReceived && req.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(req)}
                        disabled={processingId === req.id}
                        className="px-3.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                      >
                        Cancel Proposal
                      </button>
                    )}

                    {/* If accepted, jump to exchange room */}
                    {req.status === 'accepted' && (
                      <Link
                        to="/dashboard"
                        className="px-4 py-1.5 text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl border border-purple-200/80 transition-colors flex items-center space-x-1"
                      >
                        <span>View Active Session</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Proposed skill trade banner */}
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-purple-900">
                      {isReceived ? `${otherUserName} teaches:` : 'You teach:'}
                    </span>
                    <span className="px-2.5 py-0.5 bg-purple-100 text-purple-800 rounded-lg font-bold">
                      {req.offeredSkillName}
                    </span>
                  </div>

                  <ArrowLeftRight className="w-4 h-4 text-slate-400 hidden sm:block" />

                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-emerald-900">
                      {isReceived ? 'You teach in return:' : `${otherUserName} teaches:`}
                    </span>
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                      {req.wantedSkillName}
                    </span>
                  </div>
                </div>

                {/* Personal Message */}
                {req.message && (
                  <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100 flex items-start space-x-2">
                    <MessageSquare className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                    <p className="italic">"{req.message}"</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
