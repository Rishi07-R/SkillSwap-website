import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { ArrowLeftRight, Lock, Mail, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { login, switchDemoAccount, availableDemoAccounts } = useAuth();
  const { showToast } = useNotifications();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      showToast('Signed in successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Try a 1-click demo account below.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (userId) => {
    setLoading(true);
    try {
      await switchDemoAccount(userId);
      showToast('Switched to demo member profile!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to switch demo account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-slate-900 tracking-tight">SkillSwap</span>
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Exchange skills with thousands of passionate members worldwide.
          </p>
        </div>

        {/* 1-Click Demo Profiles Box */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Instant 1-Click Demo Sign-in:</span>
          </div>
          <p className="text-[11px] text-purple-800/80 mb-3">
            Select a fictional member to test reciprocal matching and exchanges right away:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {availableDemoAccounts.slice(0, 4).map(account => (
              <button
                key={account.id}
                type="button"
                onClick={() => handleQuickDemo(account.id)}
                className="flex items-center space-x-2 p-2 bg-white rounded-xl border border-purple-100 hover:border-purple-300 hover:shadow-xs text-left transition-all group"
              >
                <img
                  src={account.avatarUrl}
                  alt={account.fullName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-purple-600 truncate">{account.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{account.headline?.split('&')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Traditional Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs space-y-5">
          {error && (
            <div className="flex items-start space-x-2 p-3 bg-rose-50 text-rose-700 rounded-xl text-xs border border-rose-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <Link to="/reset-password" className="text-[11px] text-purple-600 hover:text-purple-700 font-semibold">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-1.5 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-purple-600 hover:text-purple-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
