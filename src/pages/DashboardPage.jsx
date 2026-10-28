import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/dataService';
import { getRecommendedMatches } from '../lib/matchAlgorithm';
import { StatusBadge } from '../components/common/Badge';
import { StarRating } from '../components/common/StarRating';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Inbox,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  UserCheck
} from 'lucide-react';

export function DashboardPage() {
  const { currentProfile, userSkills, profileCompletion } = useAuth();
  const [exchanges, setExchanges] = useState([]);
  const [requests, setRequests] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [allUserSkills, setAllUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      if (!currentProfile) return;
      setLoading(true);
      try {
        const [exchData, reqData, profData, uSkillsData] = await Promise.all([
          DataService.getExchanges(currentProfile.id),
          DataService.getExchangeRequests(currentProfile.id),
          DataService.getProfiles(),
          DataService.getAllUserSkills()
        ]);
        setExchanges(exchData || []);
        setRequests(reqData || []);
        setProfiles(profData || []);
        setAllUserSkills(uSkillsData || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [currentProfile?.id]);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-slate-500 mt-2">Loading user dashboard...</p>
      </div>
    );
  }

  const activeExchanges = exchanges.filter(e => e.status === 'active');
  const completedExchanges = exchanges.filter(e => e.status === 'completed');
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const receivedPending = requests.filter(r => r.receiverId === currentProfile?.id && r.status === 'pending');

  const matches = currentProfile
    ? getRecommendedMatches(currentProfile.id, profiles, allUserSkills)
    : [];

  // Chart data: Monthly knowledge sessions activity
  const activityData = [
    { week: 'W1 Oct', sessions: 2, hours: 3 },
    { week: 'W2 Oct', sessions: 4, hours: 6 },
    { week: 'W3 Oct', sessions: 3, hours: 4.5 },
    { week: 'W4 Oct', sessions: 5, hours: 7.5 },
  ];

  // Chart data: Skills ratio (Offered vs Wanted)
  const skillsRatioData = [
    { name: 'Skills Offered', value: userSkills.filter(s => s.type === 'offered').length || 1, color: '#7c3aed' },
    { name: 'Skills Wanted', value: userSkills.filter(s => s.type === 'wanted').length || 1, color: '#10b981' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Personal Knowledge Hub
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentProfile?.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Track your skill exchange sessions, view incoming proposals, and discover new complementary members.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/matches"
              className="px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              Smart Matches ({matches.length})
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-sm transition-colors"
            >
              Browse Members
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Completeness Checklist if < 100 */}
      {profileCompletion < 100 && (
        <div className="bg-purple-50/80 border border-purple-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between max-w-xs text-xs font-bold text-purple-950">
              <span>Profile Completeness</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="w-full max-w-xs bg-purple-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-purple-800/80 pt-1">
              Complete your profile and add both offered & wanted skills to receive high-accuracy reciprocal matches.
            </p>
          </div>
          <Link
            to="/settings"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl whitespace-nowrap shadow-xs"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Swaps</span>
            <ArrowLeftRight className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{activeExchanges.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Ongoing learning sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Pending Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{receivedPending.length}</div>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting your response</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Completed Swaps</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{currentProfile?.exchangesCompleted || 0}</div>
          <p className="text-[11px] text-slate-400 mt-1">Total verified sessions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Peer Rating</span>
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 flex items-center gap-1.5">
            <span>{currentProfile?.rating?.toFixed(1) || '5.0'}</span>
            <span className="text-xs font-normal text-slate-400">({currentProfile?.reviewsCount || 0})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Based on peer reviews</p>
        </div>
      </div>

      {/* Active Exchanges and Session Activity Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Exchanges Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Active Exchanges ({activeExchanges.length})</h3>
              </div>
              <Link to="/requests" className="text-xs font-semibold text-purple-600 hover:text-purple-800">
                View Requests →
              </Link>
            </div>

            {activeExchanges.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p>You have no active exchanges right now.</p>
                <Link
                  to="/explore"
                  className="mt-3 inline-block px-4 py-2 bg-purple-600 text-white font-semibold rounded-xl text-xs"
                >
                  Find a Member to Swap
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeExchanges.map(ex => {
                  const isUserA = currentProfile?.id === ex.userAId;
                  const partnerName = isUserA ? ex.userBName : ex.userAName;
                  const partnerAvatar = isUserA ? ex.userBAvatar : ex.userAAvatar;
                  const teachSkill = isUserA ? ex.skillAName : ex.skillBName;
                  const learnSkill = isUserA ? ex.skillBName : ex.skillAName;

                  return (
                    <div
                      key={ex.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-purple-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={partnerAvatar}
                          alt={partnerName}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{partnerName}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            You teach: <strong className="text-purple-700">{teachSkill}</strong> · Learn: <strong className="text-emerald-700">{learnSkill}</strong>
                          </p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {ex.scheduleDetails || 'Schedule flexible'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/exchanges/${ex.id}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center space-x-1.5"
                        >
                          <span>Open Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recharts Analytics: Weekly Activity */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-900">Weekly Exchange Hours</h3>
              <span className="text-xs text-slate-400">Past 4 weeks</span>
            </div>
            <div className="h-60 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                    itemStyle={{ color: '#c4b5fd' }}
                  />
                  <Bar dataKey="hours" fill="#7c3aed" radius={[8, 8, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sidebar Column: Skills Ratio & Top Recommendations (1 col) */}
        <div className="space-y-6">
          {/* Skills Breakdown Chart */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">Your Skills Balance</h3>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillsRatioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {skillsRatioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e1b4b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around text-xs pt-1">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-purple-600" />
                <span className="text-slate-600">Offered ({skillsRatioData[0].value})</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Wanted ({skillsRatioData[1].value})</span>
              </div>
            </div>
          </div>

          {/* Quick Matches Widget */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Top Match</span>
              </h3>
              <Link to="/matches" className="text-xs font-semibold text-purple-600">
                All Matches →
              </Link>
            </div>

            {matches.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Add skills to see smart recommendations.</p>
            ) : (
              <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={matches[0].targetProfile.avatarUrl}
                    alt={matches[0].targetProfile.fullName}
                    className="w-11 h-11 rounded-xl object-cover border border-purple-200"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{matches[0].targetProfile.fullName}</h4>
                    <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      {matches[0].score}% Synergy
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {matches[0].explanation}
                </p>
                <Link
                  to={`/profile/${matches[0].targetProfile.id}`}
                  className="block text-center py-2 bg-purple-600 text-white rounded-xl text-xs font-bold"
                >
                  Propose Swap
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
