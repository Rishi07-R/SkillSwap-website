import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../common/Card';
import { StarRating } from '../common/StarRating';
import { Badge } from '../common/Badge';
import { SkillTag } from './SkillTag';
import { ProposalModal } from './ProposalModal';
import { MapPin, Clock, ArrowLeftRight, Sparkles, CheckCircle2 } from 'lucide-react';

export function MemberCard({ profile, userSkills = [], matchInfo = null, onProposalSuccess = null }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const offered = userSkills.filter(s => s.type === 'offered');
  const wanted = userSkills.filter(s => s.type === 'wanted');

  return (
    <>
      <Card hover={true} className="flex flex-col justify-between h-full relative group border-slate-200">
        <div>
          {/* Header row with avatar, rating, and match badge */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <Link to={`/profile/${profile.id}`} className="flex items-center space-x-3 group-hover:opacity-95">
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.fullName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-100 shadow-sm"
                />
                {profile.isActive && (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-base leading-tight">
                  {profile.fullName}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{profile.headline}</p>
              </div>
            </Link>

            {matchInfo ? (
              <div className="flex flex-col items-end">
                <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-xs ${
                  matchInfo.isReciprocal
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  <Sparkles className="w-3 h-3" />
                  <span>{matchInfo.score}% Match</span>
                </span>
                {matchInfo.isReciprocal && (
                  <span className="text-[10px] font-semibold text-purple-700 uppercase tracking-wider mt-0.5">
                    Reciprocal
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/50">
                <StarRating rating={profile.rating} size="sm" />
                <span>{profile.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({profile.reviewsCount})</span>
              </div>
            )}
          </div>

          {/* Bio snippet */}
          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
            {profile.bio}
          </p>

          {/* Location and Availability pill */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {profile.location || 'Remote'}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {profile.availability || 'Flexible'}
            </span>
          </div>

          {/* Offered Skills */}
          <div className="mb-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900 mb-1.5 flex items-center justify-between">
              <span>Can Teach ({offered.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {offered.slice(0, 3).map(skill => (
                <SkillTag
                  key={skill.id}
                  skillName={skill.skillName}
                  proficiency={skill.proficiency}
                  type="offered"
                />
              ))}
              {offered.length > 3 && (
                <span className="text-xs text-purple-600 font-medium self-center pl-1">
                  +{offered.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Wanted Skills */}
          <div className="mb-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
              Wants to Learn ({wanted.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {wanted.slice(0, 3).map(skill => (
                <SkillTag
                  key={skill.id}
                  skillName={skill.skillName}
                  proficiency={skill.proficiency}
                  type="wanted"
                />
              ))}
              {wanted.length > 3 && (
                <span className="text-xs text-emerald-600 font-medium self-center pl-1">
                  +{wanted.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Match explanation note if present */}
          {matchInfo && (
            <div className="mb-4 p-2.5 bg-purple-50/80 rounded-xl border border-purple-100 text-xs text-purple-900">
              <p className="line-clamp-2">{matchInfo.explanation}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/profile/${profile.id}`}
            className="text-center py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-xl shadow-xs transition-all"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Propose Swap</span>
          </button>
        </div>
      </Card>

      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        targetProfile={profile}
        targetSkills={userSkills}
      />
    </>
  );
}
