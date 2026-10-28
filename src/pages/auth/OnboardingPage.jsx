import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { DataService } from '../../lib/dataService';
import { Sparkles, ArrowRight, Check, GraduationCap, BookOpen, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

export function OnboardingPage() {
  const { currentProfile, updateProfile, addSkill } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [skillsList, setSkillsList] = useState([]);

  // Step 1: Bio & Availability
  const [bio, setBio] = useState('Passionate about sharing knowledge and learning complementary skills.');
  const [location, setLocation] = useState('San Francisco, CA');
  const [availability, setAvailability] = useState('Evenings & Weekends');

  // Step 2: Skills Offered
  const [selectedOfferedSkills, setSelectedOfferedSkills] = useState([]);

  // Step 3: Skills Wanted
  const [selectedWantedSkills, setSelectedWantedSkills] = useState([]);

  useEffect(() => {
    async function loadSkills() {
      const data = await DataService.getSkills();
      setSkillsList(data || []);
      if (data && data.length > 2) {
        setSelectedOfferedSkills([data[0].id]);
        setSelectedWantedSkills([data[1].id]);
      }
    }
    loadSkills();
  }, []);

  const toggleOffered = (id) => {
    if (selectedOfferedSkills.includes(id)) {
      setSelectedOfferedSkills(selectedOfferedSkills.filter(i => i !== id));
    } else {
      setSelectedOfferedSkills([...selectedOfferedSkills, id]);
    }
  };

  const toggleWanted = (id) => {
    if (selectedWantedSkills.includes(id)) {
      setSelectedWantedSkills(selectedWantedSkills.filter(i => i !== id));
    } else {
      setSelectedWantedSkills([...selectedWantedSkills, id]);
    }
  };

  const handleFinish = async () => {
    try {
      // 1. Update Profile
      await updateProfile({
        bio,
        location,
        availability,
      });

      // 2. Add Offered skills
      for (const skillId of selectedOfferedSkills) {
        const s = skillsList.find(item => item.id === skillId);
        if (s) {
          await addSkill({
            skillId: s.id,
            skillName: s.name,
            category: s.category,
            type: 'offered',
            proficiency: 'Advanced',
            years: 3,
            notes: 'Mentoring in fundamentals and best practices.',
          });
        }
      }

      // 3. Add Wanted skills
      for (const skillId of selectedWantedSkills) {
        const s = skillsList.find(item => item.id === skillId);
        if (s) {
          await addSkill({
            skillId: s.id,
            skillName: s.name,
            category: s.category,
            type: 'wanted',
            proficiency: 'Beginner',
            years: 0,
            notes: 'Excited to learn from a mentor.',
          });
        }
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      showToast('Profile setup complete! Welcome to SkillSwap.', 'success', 'All Set! 🎉');
      navigate('/matches');
    } catch (err) {
      showToast(err.message || 'Error saving onboarding profile.', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Wizard Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Profile Setup Wizard</span>
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Let's set up your profile</h1>
        <p className="text-xs text-slate-500 mt-1">
          Tell the community what you can teach and what you are looking to learn.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center space-x-4 mt-6">
          <div className={`flex items-center space-x-1.5 text-xs font-bold ${step >= 1 ? 'text-purple-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>1</span>
            <span>About</span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center space-x-1.5 text-xs font-bold ${step >= 2 ? 'text-purple-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>2</span>
            <span>Teach</span>
          </div>
          <div className="w-8 h-px bg-slate-200" />
          <div className={`flex items-center space-x-1.5 text-xs font-bold ${step >= 3 ? 'text-purple-600' : 'text-slate-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>3</span>
            <span>Learn</span>
          </div>
        </div>
      </div>

      {/* STEP 1: ABOUT */}
      {step === 1 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5 animate-slide-up">
          <h3 className="font-bold text-base text-slate-900">Your Background & Availability</h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">About You (Bio)</label>
            <textarea
              rows="3"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Weekly Availability</label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs"
            >
              <span>Continue: Skills You Teach</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: SKILLS OFFERED */}
      {step === 2 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-base text-slate-900">Select Skills You Can Teach</h3>
          </div>
          <p className="text-xs text-slate-500">
            Pick at least one topic you have experience with and can coach a peer in:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-1">
            {skillsList.map(skill => {
              const selected = selectedOfferedSkills.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  onClick={() => toggleOffered(skill.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-purple-50 border-purple-300 text-purple-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className="font-bold">{skill.name}</p>
                    <span className="text-[10px] text-slate-400">{skill.category}</span>
                  </div>
                  {selected && <Check className="w-4 h-4 text-purple-600" />}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              type="button"
              disabled={selectedOfferedSkills.length === 0}
              onClick={() => setStep(3)}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
            >
              <span>Continue: Skills You Want</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SKILLS WANTED */}
      {step === 3 && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5 animate-slide-up">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-base text-slate-900">Select Skills You Want to Learn</h3>
          </div>
          <p className="text-xs text-slate-500">
            Pick topics you are excited to master. Our algorithm uses this for reciprocal matching!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-1">
            {skillsList.map(skill => {
              const selected = selectedWantedSkills.includes(skill.id);
              return (
                <div
                  key={skill.id}
                  onClick={() => toggleWanted(skill.id)}
                  className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    selected
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-semibold shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <p className="font-bold">{skill.name}</p>
                    <span className="text-[10px] text-slate-400">{skill.category}</span>
                  </div>
                  {selected && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Back
            </button>
            <button
              type="button"
              disabled={selectedWantedSkills.length === 0}
              onClick={handleFinish}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <span>Finish & Discover Matches</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
