import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/dataService';
import { calculateMatch } from '../lib/matchAlgorithm';
import { MemberCard } from '../components/marketplace/MemberCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { Search, Filter, Sparkles, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';

export function ExplorePage() {
  const { currentProfile, userSkills } = useAuth();
  const location = useLocation();

  const [profiles, setProfiles] = useState([]);
  const [allUserSkills, setAllUserSkills] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [onlyComplementary, setOnlyComplementary] = useState(false);
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'exchanges', 'name'

  // Read URL query params (e.g. ?category=... or ?search=...)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    const q = params.get('search');
    if (cat) setSelectedCategory(cat);
    if (q) setSearch(q);
  }, [location.search]);

  // Load data
  useEffect(() => {
    async function loadDirectory() {
      setLoading(true);
      try {
        const [profData, uSkillsData, sData] = await Promise.all([
          DataService.getProfiles(),
          DataService.getAllUserSkills(),
          DataService.getSkills()
        ]);
        setProfiles(profData || []);
        setAllUserSkills(uSkillsData || []);
        setSkillsList(sData || []);
      } catch (err) {
        console.error('Error loading explore data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, []);

  const categories = ['All', 'Software & Tech', 'Design & Creative', 'Languages', 'Business & Marketing', 'Music & Arts'];

  // Filter & Sort members
  const filteredProfiles = useMemo(() => {
    return profiles.filter(profile => {
      // Exclude current logged in user from directory cards
      if (currentProfile && profile.id === currentProfile.id) return false;

      const profileSkills = allUserSkills.filter(s => s.userId === profile.id);
      const offered = profileSkills.filter(s => s.type === 'offered');
      const wanted = profileSkills.filter(s => s.type === 'wanted');

      // 1. Text Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = profile.fullName.toLowerCase().includes(q);
        const matchesHeadline = profile.headline?.toLowerCase().includes(q);
        const matchesBio = profile.bio?.toLowerCase().includes(q);
        const matchesSkill = profileSkills.some(s => s.skillName?.toLowerCase().includes(q));

        if (!matchesName && !matchesHeadline && !matchesBio && !matchesSkill) {
          return false;
        }
      }

      // 2. Category filter
      if (selectedCategory !== 'All') {
        const hasSkillInCat = profileSkills.some(s => s.category === selectedCategory);
        if (!hasSkillInCat) return false;
      }

      // 3. Specific Skill filter
      if (selectedSkill !== 'All') {
        const hasSkill = profileSkills.some(s => s.skillId === selectedSkill || s.skillName === selectedSkill);
        if (!hasSkill) return false;
      }

      // 4. Complementary match filter
      if (onlyComplementary && currentProfile) {
        const myWanted = userSkills.filter(s => s.type === 'wanted');
        const teachesWhatIWant = offered.some(o =>
          myWanted.some(w => w.skillId === o.skillId || w.skillName?.toLowerCase() === o.skillName?.toLowerCase())
        );
        if (!teachesWhatIWant) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'exchanges') return (b.exchangesCompleted || 0) - (a.exchangesCompleted || 0);
      if (sortBy === 'name') return a.fullName.localeCompare(b.fullName);
      return 0;
    });
  }, [profiles, allUserSkills, search, selectedCategory, selectedSkill, onlyComplementary, sortBy, currentProfile, userSkills]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedSkill('All');
    setOnlyComplementary(false);
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Skill Members</h1>
        <p className="text-sm text-slate-500 mt-1">
          Discover mentors and peers ready to exchange knowledge. Filter by category, skills offered, or reciprocal matches.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, skill, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Skill Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            >
              <option value="All">All Specific Skills</option>
              {skillsList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="exchanges">Sort: Most Swaps Completed</option>
                <option value="name">Sort: Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Categories Pills & Complementary Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Toggle "Teaches what I want" */}
          {currentProfile && (
            <label className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200/80">
              <input
                type="checkbox"
                checked={onlyComplementary}
                onChange={(e) => setOnlyComplementary(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="flex items-center gap-1 text-purple-900">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Teaches skills I want to learn</span>
              </span>
            </label>
          )}
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-slate-500 mt-2">Loading marketplace members...</p>
        </div>
      ) : filteredProfiles.length === 0 ? (
        <EmptyState
          title="No members match your criteria"
          description="Try broadening your search keyword or clearing selected skill filters to see more members."
          action={
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 text-xs font-semibold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors"
            >
              Reset All Filters
            </button>
          }
        />
      ) : (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
            <span>Showing <strong className="font-semibold text-slate-800">{filteredProfiles.length}</strong> active members</span>
            {(search || selectedCategory !== 'All' || selectedSkill !== 'All' || onlyComplementary) && (
              <button
                onClick={handleResetFilters}
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map(profile => {
              const profileSkills = allUserSkills.filter(s => s.userId === profile.id);
              const matchResult = currentProfile
                ? calculateMatch(currentProfile.id, userSkills, profile, profileSkills)
                : null;

              return (
                <MemberCard
                  key={profile.id}
                  profile={profile}
                  userSkills={profileSkills}
                  matchInfo={matchResult}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
