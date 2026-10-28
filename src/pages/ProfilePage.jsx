import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/dataService';
import { calculateMatch } from '../lib/matchAlgorithm';
import { StarRating } from '../components/common/StarRating';
import { ProficiencyBadge, Badge } from '../components/common/Badge';
import { ProposalModal } from '../components/marketplace/ProposalModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  ArrowLeftRight,
  Sparkles,
  Settings,
  BookOpen,
  GraduationCap,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

export function ProfilePage() {
  const { id } = useParams();
  const { currentProfile, userSkills: mySkills } = useAuth();

  const [profile, setProfile] = useState(null);
  const [memberSkills, setMemberSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfileData() {
      setLoading(true);
      try {
        const [p, skills, revs] = await Promise.all([
          DataService.getProfileById(id),
          DataService.getUserSkills(id),
          DataService.getReviews(id)
        ]);
        setProfile(p);
        setMemberSkills(skills || []);
        setReviews(revs || []);
      } catch (err) {
        console.error('Error loading member profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500 mt-2">Loading member profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">Member Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">The requested profile does not exist or has been deactivated.</p>
        <Link to="/explore" className="px-4 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl">
          Back to Explore
        </Link>
      </div>
    );
  }

  const isOwnProfile = currentProfile?.id === profile.id;
  const offered = memberSkills.filter(s => s.type === 'offered');
  const wanted = memberSkills.filter(s => s.type === 'wanted');

  const matchInfo = currentProfile && !isOwnProfile
    ? calculateMatch(currentProfile.id, mySkills, profile, memberSkills)
    : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-r from-purple-100 via-indigo-50 to-pink-50 border-b border-purple-100/60" />

        <div className="relative pt-6 sm:pt-4 flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6">
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-md shadow-purple-500/10"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {profile.fullName}
                </h1>
                {profile.isActive && (
                  <Badge variant="success" size="sm" className="font-semibold">
                    Active Member
                  </Badge>
                )}
              </div>
              <p className="text-sm font-medium text-slate-600">{profile.headline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {profile.location || 'Remote'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {profile.availability || 'Flexible'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Joined {profile.joinedDate ? new Date(profile.joinedDate).toLocaleDateString() : 'Recent'}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-3 pt-2">
            {isOwnProfile ? (
              <Link
                to="/settings"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span>Edit Profile & Skills</span>
              </Link>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                <ArrowLeftRight className="w-4 h-4" />
                <span>Propose Skill Swap</span>
              </button>
            )}

            {/* Match explanation tag if applicable */}
            {matchInfo && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-purple-50 text-purple-800 border border-purple-200 rounded-full text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>{matchInfo.score}% Compatibility Score</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">About {profile.fullName.split(' ')[0]}</h3>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            {profile.bio}
          </p>
        </div>

        {/* Exchange stats strip */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
            <span className="block text-2xl font-black text-purple-700">{profile.rating?.toFixed(1) || '5.0'}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Average Rating</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
            <span className="block text-2xl font-black text-slate-900">{profile.reviewsCount || 0}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reviews Received</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
            <span className="block text-2xl font-black text-slate-900">{profile.exchangesCompleted || 0}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Swaps Completed</span>
          </div>
          <div className="bg-slate-50 p-3.5 rounded-2xl text-center">
            <span className="block text-2xl font-black text-emerald-600">{offered.length}</span>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Skills Offered</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Skills Offered & Wanted */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SKILLS OFFERED */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Skills Can Teach ({offered.length})</h3>
            </div>
            <span className="text-xs text-purple-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">
              Mentor Mode
            </span>
          </div>

          <div className="space-y-4">
            {offered.map(skill => (
              <div key={skill.id} className="p-4 rounded-2xl border border-purple-100 bg-purple-50/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{skill.skillName}</h4>
                  <ProficiencyBadge level={skill.proficiency} />
                </div>
                {skill.years > 0 && (
                  <p className="text-xs text-slate-500 font-medium">
                    {skill.years} {skill.years === 1 ? 'year' : 'years'} practical experience
                  </p>
                )}
                {skill.notes && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {skill.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS WANTED */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Wants to Learn ({wanted.length})</h3>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
              Learner Mode
            </span>
          </div>

          <div className="space-y-4">
            {wanted.map(skill => (
              <div key={skill.id} className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">{skill.skillName}</h4>
                  <Badge variant="success" size="sm">Desired</Badge>
                </div>
                {skill.notes && (
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">
                    {skill.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">Member Reviews ({reviews.length})</h3>
              <p className="text-xs text-slate-500">Verified reviews from completed skill exchange sessions</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/60">
            <StarRating rating={profile.rating} size="sm" />
            <span className="text-xs font-bold text-slate-900">{profile.rating?.toFixed(1)}</span>
          </div>
        </div>

        {reviews.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No reviews yet for this member.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map(rev => (
              <div key={rev.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.reviewerAvatar}
                      alt={rev.reviewerName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-semibold text-xs text-slate-900">{rev.reviewerName}</h4>
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

      {/* Proposal Modal */}
      {!isOwnProfile && (
        <ProposalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetProfile={profile}
          targetSkills={memberSkills}
        />
      )}
    </div>
  );
}
