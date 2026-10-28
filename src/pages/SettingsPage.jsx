import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { DataService } from '../lib/dataService';
import { ProficiencyBadge, Badge } from '../components/common/Badge';
import {
  User,
  GraduationCap,
  BookOpen,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  AlertCircle,
  Database,
  RefreshCw,
  Camera
} from 'lucide-react';

export function SettingsPage() {
  const {
    currentProfile,
    userSkills,
    updateProfile,
    addSkill,
    removeSkill,
    resetAllData,
    isSupabaseConfigured
  } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'skills', 'account'
  const [skillsDirectory, setSkillsDirectory] = useState([]);

  // Profile form state
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState('');
  const [availability, setAvailability] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Add skill form state
  const [newSkillType, setNewSkillType] = useState('offered'); // 'offered' or 'wanted'
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Software & Tech');
  const [proficiency, setProficiency] = useState('Intermediate');
  const [years, setYears] = useState(2);
  const [notes, setNotes] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);

  // Sync profile state when loaded
  useEffect(() => {
    if (currentProfile) {
      setFullName(currentProfile.fullName || '');
      setHeadline(currentProfile.headline || '');
      setBio(currentProfile.bio || '');
      setAvatarUrl(currentProfile.avatarUrl || '');
      setLocation(currentProfile.location || 'Remote');
      setTimezone(currentProfile.timezone || 'UTC');
      setAvailability(currentProfile.availability || 'Flexible');
    }
  }, [currentProfile]);

  // Load skills directory
  useEffect(() => {
    async function loadSkills() {
      const data = await DataService.getSkills();
      setSkillsDirectory(data || []);
      if (data && data[0]) {
        setSelectedSkillId(data[0].id);
        setSelectedCategory(data[0].category);
      }
    }
    loadSkills();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile({
        fullName,
        headline,
        bio,
        avatarUrl,
        location,
        timezone,
        availability,
      });
      showToast('Profile updated successfully!', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    setAddingSkill(true);
    try {
      let finalName = '';
      let finalCat = selectedCategory;

      if (selectedSkillId === 'custom') {
        if (!customSkillName.trim()) {
          showToast('Please enter a custom skill name.', 'error');
          setAddingSkill(false);
          return;
        }
        finalName = customSkillName.trim();
      } else {
        const found = skillsDirectory.find(s => s.id === selectedSkillId);
        finalName = found ? found.name : 'Custom Skill';
        finalCat = found ? found.category : selectedCategory;
      }

      await addSkill({
        skillId: selectedSkillId === 'custom' ? 'custom-' + Date.now() : selectedSkillId,
        skillName: finalName,
        category: finalCat,
        type: newSkillType,
        proficiency,
        years: newSkillType === 'offered' ? Number(years) : 0,
        notes: notes.trim(),
      });

      showToast(`Added "${finalName}" to skills ${newSkillType}!`, 'success');
      setNotes('');
      setCustomSkillName('');
    } catch (err) {
      showToast(err.message || 'Failed to add skill.', 'error');
    } finally {
      setAddingSkill(false);
    }
  };

  const handleRemoveSkill = async (id, name) => {
    try {
      await removeSkill(id);
      showToast(`Removed "${name}" from skills.`, 'info');
    } catch (err) {
      showToast(err.message || 'Failed to remove skill.', 'error');
    }
  };

  const offeredSkills = userSkills.filter(s => s.type === 'offered');
  const wantedSkills = userSkills.filter(s => s.type === 'wanted');

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & Skill Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Customize your public presence, manage offered & wanted skills, and review platform preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('profile')}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'profile'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Information</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'skills'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Skills Management ({userSkills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('account')}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'account'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <SettingsIcon className="w-4 h-4" />
          <span>Account & Demo Sync</span>
        </button>
      </div>

      {/* TAB 1: PROFILE INFO */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-sm"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{fullName}</h3>
              <p className="text-xs text-slate-400">{currentProfile?.email}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-500">Preset Avatars:</span>
                {presetAvatars.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 hover:ring-2 hover:ring-purple-500"
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Avatar Image URL</label>
              <input
                type="url"
                required
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Professional Headline</label>
            <input
              type="text"
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Senior Frontend Architect & Open Source Contributor"
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Bio</label>
            <textarea
              rows="4"
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your background, what skills you are excited to teach, and your learning goals..."
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Timezone</label>
              <input
                type="text"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Availability Schedule</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                placeholder="e.g. Weeknights & Weekends"
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: SKILLS MANAGEMENT */}
      {activeTab === 'skills' && (
        <div className="space-y-8">
          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Plus className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-base text-slate-900">Add a New Skill</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">I want to:</label>
                <select
                  value={newSkillType}
                  onChange={(e) => setNewSkillType(e.target.value)}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="offered">Teach this skill (Offered)</option>
                  <option value="wanted">Learn this skill (Wanted)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Skill:</label>
                <select
                  value={selectedSkillId}
                  onChange={(e) => {
                    setSelectedSkillId(e.target.value);
                    const match = skillsDirectory.find(s => s.id === e.target.value);
                    if (match) setSelectedCategory(match.category);
                  }}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                >
                  {skillsDirectory.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                  <option value="custom">+ Add Custom Skill...</option>
                </select>
              </div>

              {selectedSkillId === 'custom' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Custom Skill Name:</label>
                  <input
                    type="text"
                    value={customSkillName}
                    onChange={(e) => setCustomSkillName(e.target.value)}
                    placeholder="e.g. Rust, Watercolor, French..."
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proficiency:</label>
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {newSkillType === 'offered' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Years Experience:</label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Notes / Teaching Focus:</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Specialize in hooks, component libraries, or beginner fundamentals..."
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={addingSkill}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                {addingSkill ? 'Adding...' : 'Add to My Skills'}
              </button>
            </div>
          </form>

          {/* Current Offered Skills List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-purple-900 uppercase tracking-wider">
              Skills You Can Teach ({offeredSkills.length})
            </h3>
            {offeredSkills.length === 0 ? (
              <p className="text-xs text-slate-400">No offered skills listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {offeredSkills.map(s => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs">{s.skillName}</span>
                        <ProficiencyBadge level={s.proficiency} />
                      </div>
                      <span className="text-[10px] text-slate-500">{s.years} yrs exp · {s.category}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.id, s.skillName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Current Wanted Skills List */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-emerald-900 uppercase tracking-wider">
              Skills You Want to Learn ({wantedSkills.length})
            </h3>
            {wantedSkills.length === 0 ? (
              <p className="text-xs text-slate-400">No wanted skills listed yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wantedSkills.map(s => (
                  <div
                    key={s.id}
                    className="p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 text-xs">{s.skillName}</span>
                      <span className="text-[10px] text-slate-500 block">{s.category}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s.id, s.skillName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                      title="Remove skill"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNT & SYNC */}
      {activeTab === 'account' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 pb-4 border-b border-slate-100">
            <Database className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900">Database & Environment Status</h3>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Supabase Connection:</span>
              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                isSupabaseConfigured ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'
              }`}>
                {isSupabaseConfigured ? 'Connected to Supabase PostgreSQL' : 'Seamless In-Browser State Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              {isSupabaseConfigured
                ? 'Your application is connected to live Supabase backend with Row Level Security enabled.'
                : 'Running with rich local persistence. Any changes, proposals, or new skills persist across reloads. You can connect your live Supabase project by providing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.'}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-900 mb-1">Reset Seed State</h4>
            <p className="text-xs text-slate-500 mb-4">
              Restore the initial 8 members, seed exchanges, and proposals if you wish to reset your testing environment.
            </p>
            <button
              type="button"
              onClick={() => {
                resetAllData();
                showToast('Reset to original sample seed state!', 'success');
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
