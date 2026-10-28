import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/dataService';
import { getRecommendedMatches } from '../lib/matchAlgorithm';
import { MemberCard } from '../components/marketplace/MemberCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { ProposalModal } from '../components/marketplace/ProposalModal';
import { Sparkles, ArrowLeftRight, CheckCircle2, BookOpen, GraduationCap, ChevronRight } from 'lucide-react';

export function MatchesPage() {
  const { currentProfile, userSkills } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [allUserSkills, setAllUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Proposal modal state
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [profData, uSkillsData] = await Promise.all([
          DataService.getProfiles(),
          DataService.getAllUserSkills()
        ]);
        setProfiles(profData || []);
        setAllUserSkills(uSkillsData || []);
      } catch (err) {
        console.error('Error loading matches data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const matches = currentProfile
    ? getRecommendedMatches(currentProfile.id, profiles, allUserSkills)
    : [];

  const reciprocalMatches = matches.filter(m => m.isReciprocal);
  const oneWayMatches = matches.filter(m => !m.isReciprocal);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Algorithmic Matching Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Smart Skill Matches</h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculated in real-time based on your offered and wanted skills. Reciprocal 2-way swaps receive top priority.
          </p>
        </div>

        {/* User skills summary pill */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex items-center space-x-4 shadow-xs text-xs">
          <div>
            <span className="text-slate-400 block font-medium">You Teach:</span>
            <span className="font-bold text-purple-700">
              {userSkills.filter(s => s.type === 'offered').length} skills
            </span>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-slate-400 block font-medium">You Seek:</span>
            <span className="font-bold text-emerald-700">
              {userSkills.filter(s => s.type === 'wanted').length} skills
            </span>
          </div>
          <Link
            to="/settings"
            className="text-purple-600 hover:text-purple-800 font-semibold pl-2"
          >
            Edit →
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Computing optimal skill synergies...</p>
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No skill matches found yet"
          description="Make sure you have listed at least one skill you can teach and one skill you want to learn in your settings!"
          action={
            <Link
              to="/settings"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Add Your Skills in Settings
            </Link>
          }
        />
      ) : (
        <div className="space-y-12">
          {/* SECTION 1: RECIPROCAL MATCHES */}
          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <ArrowLeftRight className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Reciprocal Matches (Mutual Swaps)</span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full font-bold">
                    {reciprocalMatches.length} High Synergy
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Both of you have skills the other is looking to learn! Highest compatibility rating.
                </p>
              </div>
            </div>

            {reciprocalMatches.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                No reciprocal matches right now. Check the one-way opportunities below or add more wanted skills!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reciprocalMatches.map(match => (
                  <div
                    key={match.targetProfile.id}
                    className="bg-white rounded-2xl border-2 border-purple-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top profile banner */}
                      <div className="flex items-start justify-between mb-4">
                        <Link to={`/profile/${match.targetProfile.id}`} className="flex items-center space-x-3 group">
                          <img
                            src={match.targetProfile.avatarUrl}
                            alt={match.targetProfile.fullName}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-purple-200"
                          />
                          <div>
                            <h3 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors text-base">
                              {match.targetProfile.fullName}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-1">{match.targetProfile.headline}</p>
                            <span className="text-[11px] text-slate-400">{match.targetProfile.location}</span>
                          </div>
                        </Link>

                        <div className="text-right">
                          <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{match.score}% Score</span>
                          </span>
                        </div>
                      </div>

                      {/* Reciprocal Trade Breakdown Card */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 p-3.5 bg-purple-50/50 rounded-xl border border-purple-100">
                        {/* You teach them */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                            <span>You Teach Them:</span>
                          </span>
                          <div className="space-y-1">
                            {match.youTeach.map((t, idx) => (
                              <div key={idx} className="text-xs font-semibold text-purple-950 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                                <span>{t.skillName}</span>
                                <span className="text-[10px] text-purple-600 font-normal">({t.myProficiency})</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* They teach you */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                            <span>They Teach You:</span>
                          </span>
                          <div className="space-y-1">
                            {match.theyTeach.map((t, idx) => (
                              <div key={idx} className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                <span>{t.skillName}</span>
                                <span className="text-[10px] text-emerald-600 font-normal">({t.theirProficiency})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Algorithm match explanation */}
                      <p className="text-xs text-slate-600 italic mb-4">
                        "{match.explanation}"
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                      <Link
                        to={`/profile/${match.targetProfile.id}`}
                        className="py-2.5 px-3 text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        View Full Profile
                      </Link>
                      <button
                        onClick={() => setSelectedMatch(match)}
                        className="py-2.5 px-3 text-center text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5"
                      >
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Propose Swap Now</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: ONE-WAY COMPLEMENTARY MATCHES */}
          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  One-Way Complementary Matches ({oneWayMatches.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Members who teach skills you want, or are looking for skills you offer.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {oneWayMatches.map(match => (
                <MemberCard
                  key={match.targetProfile.id}
                  profile={match.targetProfile}
                  userSkills={allUserSkills.filter(s => s.userId === match.targetProfile.id)}
                  matchInfo={match}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected match proposal modal */}
      {selectedMatch && (
        <ProposalModal
          isOpen={Boolean(selectedMatch)}
          onClose={() => setSelectedMatch(null)}
          targetProfile={selectedMatch.targetProfile}
          targetSkills={allUserSkills.filter(s => s.userId === selectedMatch.targetProfile.id)}
          preselectedOfferedId={selectedMatch.youTeach[0]?.skillId}
          preselectedWantedId={selectedMatch.theyTeach[0]?.skillId}
        />
      )}
    </div>
  );
}
