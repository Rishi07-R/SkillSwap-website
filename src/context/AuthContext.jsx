import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { DataService, initLocalStore, resetLocalStore } from '../lib/dataService';
import { INITIAL_PROFILES } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(!isSupabaseConfigured);

  // Initialize store and session
  useEffect(() => {
    initLocalStore();

    async function checkSession() {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setCurrentUser(session.user);
            await loadProfile(session.user.id);
          } else {
            // Default to first demo account if not logged into Supabase
            loadDemoUser('user-alex');
          }

          // Listen for Supabase auth changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
              setCurrentUser(session.user);
              await loadProfile(session.user.id);
            } else {
              loadDemoUser('user-alex');
            }
          });

          return () => subscription.unsubscribe();
        } else {
          // In standalone demo mode, load initial active profile
          const savedActiveId = localStorage.getItem('skillswap_active_user_id') || 'user-alex';
          loadDemoUser(savedActiveId);
        }
      } catch (err) {
        console.error('Session load error:', err);
        loadDemoUser('user-alex');
      } finally {
        setLoading(false);
      }
    }

    checkSession();
  }, []);

  // Load demo profile by ID
  const loadDemoUser = async (userId) => {
    try {
      const profile = await DataService.getProfileById(userId);
      if (profile) {
        setCurrentProfile(profile);
        setCurrentUser({
          id: profile.id,
          email: profile.email,
          user_metadata: { full_name: profile.fullName, avatar_url: profile.avatarUrl }
        });
        localStorage.setItem('skillswap_active_user_id', profile.id);
        const skills = await DataService.getUserSkills(profile.id);
        setUserSkills(skills);
      }
    } catch (e) {
      console.error('Error loading demo user:', e);
    }
  };

  // Switch demo account for multi-perspective testing
  const switchDemoAccount = async (userId) => {
    setLoading(true);
    await loadDemoUser(userId);
    setLoading(false);
  };

  // Reload current user profile & skills
  const refreshProfile = async () => {
    if (currentProfile?.id) {
      const p = await DataService.getProfileById(currentProfile.id);
      setCurrentProfile(p);
      const skills = await DataService.getUserSkills(currentProfile.id);
      setUserSkills(skills);
    }
  };

  // Real or demo login
  const login = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      return data;
    } else {
      // Demo match by email
      const profiles = await DataService.getProfiles();
      const match = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (match) {
        await switchDemoAccount(match.id);
        return { user: { id: match.id, email: match.email } };
      }
      throw new Error('User not found. Use one of the 1-click demo accounts or register a new one.');
    }
  };

  // Register
  const register = async (email, password, fullName, headline = '') => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, headline }
        }
      });
      if (error) throw error;
      return data;
    } else {
      const newId = 'user-' + Date.now();
      const newProfile = {
        id: newId,
        email,
        fullName,
        avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80`,
        headline: headline || 'Knowledge Seeker & Creator',
        bio: 'Excited to join SkillSwap to exchange skills and connect with mentors.',
        location: 'Remote',
        timezone: 'UTC',
        availability: 'Flexible',
        rating: 5.0,
        reviewsCount: 0,
        exchangesCompleted: 0,
        isActive: true,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      const profiles = await DataService.getProfiles();
      profiles.push(newProfile);
      localStorage.setItem('skillswap_profiles', JSON.stringify(profiles));
      await switchDemoAccount(newId);
      return { user: { id: newId, email } };
    }
  };

  // Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    // Switch to Alex or prompt
    setCurrentUser(null);
    setCurrentProfile(null);
    setUserSkills([]);
  };

  // Profile update
  const updateProfile = async (updates) => {
    if (!currentProfile) return null;
    const updated = await DataService.updateProfile(currentProfile.id, updates);
    setCurrentProfile(updated);
    return updated;
  };

  // Add a skill (offered or wanted)
  const addSkill = async ({ skillId, skillName, category, type, proficiency, years, notes }) => {
    if (!currentProfile) return;
    const newSkill = await DataService.addUserSkill({
      userId: currentProfile.id,
      skillId,
      skillName,
      category,
      type,
      proficiency,
      years: Number(years) || 0,
      notes: notes || ''
    });
    await refreshProfile();
    return newSkill;
  };

  // Remove a skill
  const removeSkill = async (userSkillId) => {
    await DataService.removeUserSkill(userSkillId);
    await refreshProfile();
  };

  // Reset to original seed state
  const resetAllData = () => {
    resetLocalStore();
    loadDemoUser('user-alex');
  };

  // Profile completion calculation (0 - 100%)
  const calculateProfileCompletion = () => {
    if (!currentProfile) return 0;
    let score = 0;
    if (currentProfile.fullName) score += 15;
    if (currentProfile.avatarUrl) score += 15;
    if (currentProfile.headline) score += 15;
    if (currentProfile.bio && currentProfile.bio.length > 30) score += 20;
    if (currentProfile.availability) score += 10;
    const hasOffered = userSkills.some(s => s.type === 'offered');
    const hasWanted = userSkills.some(s => s.type === 'wanted');
    if (hasOffered) score += 15;
    if (hasWanted) score += 10;
    return Math.min(score, 100);
  };

  const value = {
    currentUser,
    currentProfile,
    userSkills,
    loading,
    demoMode,
    isSupabaseConfigured,
    login,
    register,
    logout,
    updateProfile,
    addSkill,
    removeSkill,
    refreshProfile,
    switchDemoAccount,
    resetAllData,
    profileCompletion: calculateProfileCompletion(),
    availableDemoAccounts: INITIAL_PROFILES,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
