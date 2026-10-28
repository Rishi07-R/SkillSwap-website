import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MemberCard } from '../components/marketplace/MemberCard';
import {
  ArrowLeftRight,
  Sparkles,
  Search,
  BookOpen,
  Users,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Globe
} from 'lucide-react';

export function LandingPage() {
  const { availableDemoAccounts, userSkills, currentProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
  };

  const featuredProfiles = availableDemoAccounts.slice(0, 3);

  const categories = [
    { name: 'Software & Tech', icon: Zap, count: '340+ members', color: 'from-blue-500/10 to-indigo-500/10 text-blue-700' },
    { name: 'Design & Creative', icon: Sparkles, count: '280+ members', color: 'from-purple-500/10 to-pink-500/10 text-purple-700' },
    { name: 'Languages', icon: Globe, count: '190+ members', color: 'from-emerald-500/10 to-teal-500/10 text-emerald-700' },
    { name: 'Business & Marketing', icon: Award, count: '210+ members', color: 'from-amber-500/10 to-orange-500/10 text-amber-700' },
  ];

  const faqs = [
    {
      q: 'How does SkillSwap work without money?',
      a: 'SkillSwap operates on a peer-to-peer reciprocity model. When you join, you list skills you can teach (e.g. React) and skills you want to learn (e.g. UI/UX design). Our matching engine connects you with members whose skills complement yours, allowing you to exchange equal sessions without financial transactions.'
    },
    {
      q: 'What is a "Reciprocal Match"?',
      a: 'A reciprocal match occurs when User A offers what User B wants to learn, AND User B offers what User A wants to learn. These mutual 2-way swaps receive our highest compatibility score (85–99%) because both participants immediately gain high-value knowledge from each other.'
    },
    {
      q: 'How do we schedule and conduct exchange sessions?',
      a: 'Once an exchange proposal is accepted, an Exchange Room is created with meeting links (Google Meet, Zoom, etc.), collaborative session notes, and scheduling details. Both participants verify completion once sessions wrap up.'
    },
    {
      q: 'How do you ensure member quality and accountability?',
      a: 'Only participants in confirmed exchanges can submit verified 1–5 star reviews. Community ratings and exchange counts are displayed transparently on every profile, and Row Level Security ensures strict data ownership.'
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20">
        {/* Glow gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-300/30 via-indigo-300/20 to-pink-300/30 blur-3xl -z-10 rounded-full" />

        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-purple-800 text-xs font-semibold mb-6 shadow-xs animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Smart Reciprocal Knowledge Exchange</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Exchange skills, <br />
            <span className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              not your hard-earned money.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Teach what you love, learn what you desire. SkillSwap matches developers, designers, language speakers, and creators for high-impact, peer-to-peer knowledge swaps.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg shadow-purple-500/5 border border-slate-200/90 p-2 focus-within:ring-2 focus-within:ring-purple-500">
              <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try 'React', 'Figma', 'Python', or 'Spanish'..."
                className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Find Swaps
              </button>
            </div>
          </form>

          {/* Value props badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" /> 100% Free Zero-Currency Swaps
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-purple-500" /> Smart Complementary Matching
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-indigo-500" /> Verified Participant Reviews
            </span>
          </div>
        </div>
      </section>

      {/* How It Works (3 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-2">Simplicity First</h2>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">How SkillSwap Works</h3>
          <p className="text-sm text-slate-500 mt-2">Start swapping knowledge in three intuitive steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-6">
              1
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">List Your Skills</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Define the skills you excel at and are excited to teach, along with the topics you are eager to master.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-6">
              2
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Get Smart Matches</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our algorithm identifies mutual reciprocal matches where both participants can teach what each other seeks.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs relative hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-extrabold text-lg mb-6">
              3
            </div>
            <h4 className="font-bold text-lg text-slate-900 mb-2">Swap & Rate</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Propose an exchange, hop onto live video sessions with structured notes, and build community reputation with verified reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Reciprocal Matching Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden shadow-xl">
          <div className="max-w-2xl space-y-5">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Algorithm Spotlight</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Why Reciprocal Matching Changes Everything
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              Traditional platforms force you into costly \$60/hr tutor fees. With SkillSwap, when Alex (Senior Full Stack Dev) teaches React to Maya (Principal UX Designer), Maya teaches Alex design tokens and Figma in return. Both walk away empowered, with 0 dollars spent.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/matches"
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                View Your Recommended Matches
              </Link>
              <Link
                to="/explore"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-sm transition-colors"
              >
                Browse All 8 Featured Members
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Categories</h2>
            <h3 className="text-2xl font-extrabold text-slate-900">Explore by Discipline</h3>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
            View All Categories →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <Link
                key={i}
                to={`/explore?category=${encodeURIComponent(c.name)}`}
                className="p-6 bg-white rounded-2xl border border-slate-200/80 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base group-hover:text-purple-600 transition-colors">
                  {c.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{c.count}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Members Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Top Rated</h2>
            <h3 className="text-2xl font-extrabold text-slate-900">Featured Community Members</h3>
          </div>
          <Link to="/explore" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
            See all members →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProfiles.map(p => {
            const userSkillsList = [
              // Synthetic skills from mock for quick preview
              { id: '1', skillName: 'React & Next.js', proficiency: 'Expert', type: 'offered' },
              { id: '2', skillName: 'TypeScript', proficiency: 'Advanced', type: 'offered' },
              { id: '3', skillName: 'UI/UX Design', proficiency: 'Beginner', type: 'wanted' }
            ];
            return (
              <MemberCard
                key={p.id}
                profile={p}
                userSkills={userSkillsList}
              />
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">Got Questions?</h2>
          <h3 className="text-2xl font-extrabold text-slate-900">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-slate-900 hover:text-purple-600"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="bg-purple-50 border border-purple-200/80 rounded-3xl p-10 sm:p-14">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-950 tracking-tight">
            Ready to upgrade your skills without paying a dime?
          </h3>
          <p className="text-sm text-purple-800/80 max-w-lg mx-auto mt-2 mb-6">
            Join hundreds of developers, designers, and creators who are sharing knowledge every week.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/explore"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              Browse Member Directory
            </Link>
            <Link
              to="/matches"
              className="px-6 py-3 bg-white hover:bg-purple-100/50 text-purple-900 text-xs font-bold rounded-xl border border-purple-200 shadow-xs transition-colors"
            >
              Check My Matches
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
