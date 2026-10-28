import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, Heart, Sparkles, Shield, Compass, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                SkillSwap
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              The premier peer-to-peer knowledge and skill exchange marketplace. Teach what you love, learn what you desire, without exchanging money.
            </p>
            <div className="flex items-center space-x-3 text-slate-400">
              <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-md text-slate-600">
                100% Free Peer Swaps
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><Link to="/explore" className="hover:text-purple-600 transition-colors">Explore Directory</Link></li>
              <li><Link to="/matches" className="hover:text-purple-600 transition-colors">Reciprocal Matches</Link></li>
              <li><Link to="/requests" className="hover:text-purple-600 transition-colors">Swap Requests</Link></li>
              <li><Link to="/dashboard" className="hover:text-purple-600 transition-colors">User Dashboard</Link></li>
              <li><Link to="/reviews" className="hover:text-purple-600 transition-colors">Participant Reviews</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Popular Skills</h4>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li><Link to="/explore?category=Software+%26+Tech" className="hover:text-purple-600">React & Next.js</Link></li>
              <li><Link to="/explore?category=Design+%26+Creative" className="hover:text-purple-600">UI/UX & Figma</Link></li>
              <li><Link to="/explore?category=Software+%26+Tech" className="hover:text-purple-600">Python & AI Systems</Link></li>
              <li><Link to="/explore?category=Languages" className="hover:text-purple-600">Spanish & German</Link></li>
              <li><Link to="/explore?category=Music+%26+Arts" className="hover:text-purple-600">Music Production</Link></li>
            </ul>
          </div>

          {/* Security & Trust */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Architecture</h4>
            <div className="space-y-3 text-xs text-slate-500">
              <p className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Protected by PostgreSQL Row Level Security (RLS) policies.</span>
              </p>
              <p className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <span>Deterministic reciprocal matching scoring engine.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SkillSwap Inc. Built with React, Vite & Supabase.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Community Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
