import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DataService } from '../../lib/dataService';
import { ArrowLeftRight, Send, AlertCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ProposalModal({ isOpen, onClose, targetProfile, targetSkills = [], preselectedOfferedId = '', preselectedWantedId = '' }) {
  const { currentProfile, userSkills } = useAuth();
  const { showToast, refreshNotifications } = useNotifications();

  const myOfferedSkills = userSkills.filter(s => s.type === 'offered');
  const targetOfferedSkills = targetSkills.filter(s => s.type === 'offered');

  const [selectedMySkillId, setSelectedMySkillId] = useState(preselectedOfferedId || (myOfferedSkills[0]?.skillId || ''));
  const [selectedTargetSkillId, setSelectedTargetSkillId] = useState(preselectedWantedId || (targetOfferedSkills[0]?.skillId || ''));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update selected if props change
  React.useEffect(() => {
    if (preselectedOfferedId) setSelectedMySkillId(preselectedOfferedId);
    else if (myOfferedSkills[0]) setSelectedMySkillId(myOfferedSkills[0].skillId);

    if (preselectedWantedId) setSelectedTargetSkillId(preselectedWantedId);
    else if (targetOfferedSkills[0]) setSelectedTargetSkillId(targetOfferedSkills[0].skillId);
  }, [preselectedOfferedId, preselectedWantedId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentProfile) {
      setError('Please log in to propose a skill exchange.');
      return;
    }

    if (currentProfile.id === targetProfile?.id) {
      setError('You cannot propose a skill exchange to yourself.');
      return;
    }

    if (!selectedMySkillId) {
      setError('Please select a skill you will teach.');
      return;
    }

    if (!selectedTargetSkillId) {
      setError('Please select a skill you want to learn.');
      return;
    }

    const mySkill = myOfferedSkills.find(s => s.skillId === selectedMySkillId);
    const targetSkill = targetOfferedSkills.find(s => s.skillId === selectedTargetSkillId);

    setLoading(true);
    try {
      await DataService.createExchangeRequest({
        senderId: currentProfile.id,
        receiverId: targetProfile.id,
        senderName: currentProfile.fullName,
        senderAvatar: currentProfile.avatarUrl,
        receiverName: targetProfile.fullName,
        receiverAvatar: targetProfile.avatarUrl,
        offeredSkillId: selectedMySkillId,
        offeredSkillName: mySkill?.skillName || 'Skill',
        wantedSkillId: selectedTargetSkillId,
        wantedSkillName: targetSkill?.skillName || 'Skill',
        message: message.trim() || `Hi ${targetProfile.fullName}, I'd love to exchange skills with you!`,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      showToast(`Exchange proposal sent to ${targetProfile.fullName}!`, 'success', 'Proposal Sent');
      refreshNotifications();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to send exchange proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Propose Skill Exchange" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Target Profile Summary */}
        <div className="flex items-center space-x-3 p-3.5 bg-purple-50/60 rounded-xl border border-purple-100">
          <img
            src={targetProfile?.avatarUrl}
            alt={targetProfile?.fullName}
            className="w-12 h-12 rounded-full object-cover border border-purple-200"
          />
          <div>
            <h4 className="font-semibold text-slate-900 text-sm">{targetProfile?.fullName}</h4>
            <p className="text-xs text-slate-500 line-clamp-1">{targetProfile?.headline}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-start space-x-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Exchange Matchup Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center relative">
          {/* Skill You Will Teach */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-purple-900 mb-1.5">
              1. You will teach:
            </label>
            {myOfferedSkills.length === 0 ? (
              <p className="text-xs text-rose-600">
                You haven't listed any offered skills yet. Add them in Settings.
              </p>
            ) : (
              <select
                value={selectedMySkillId}
                onChange={(e) => setSelectedMySkillId(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {myOfferedSkills.map(s => (
                  <option key={s.id} value={s.skillId}>
                    {s.skillName} ({s.proficiency})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Skill You Want to Learn */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <label className="block text-xs font-semibold text-emerald-900 mb-1.5">
              2. You want to learn:
            </label>
            {targetOfferedSkills.length === 0 ? (
              <p className="text-xs text-slate-500">Member has no skills listed yet.</p>
            ) : (
              <select
                value={selectedTargetSkillId}
                onChange={(e) => setSelectedTargetSkillId(e.target.value)}
                className="w-full text-xs font-medium bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                {targetOfferedSkills.map(s => (
                  <option key={s.id} value={s.skillId}>
                    {s.skillName} ({s.proficiency})
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Personal Message or Proposed Schedule (Optional):
          </label>
          <textarea
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell them why you want to swap skills and what times work best for you..."
            className="w-full text-sm bg-white border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none resize-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || myOfferedSkills.length === 0 || targetOfferedSkills.length === 0}
            className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-sm transition-all disabled:opacity-50"
          >
            {loading ? (
              <span>Sending...</span>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Proposal</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
