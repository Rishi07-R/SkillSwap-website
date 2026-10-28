import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  ArrowLeftRight,
  Compass,
  Sparkles,
  Inbox,
  LayoutDashboard,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Check,
  RefreshCw,
  Star
} from 'lucide-react';

export function Navbar() {
  const {
    currentUser,
    currentProfile,
    logout,
    switchDemoAccount,
    availableDemoAccounts,
    resetAllData,
    profileCompletion,
    isSupabaseConfigured
  } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoSwitcherOpen, setIsDemoSwitcherOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
      isActive
        ? 'bg-purple-50 text-purple-700 font-semibold shadow-xs'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <ArrowLeftRight className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                  SkillSwap
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1 tracking-wide">
                  Knowledge Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink to="/explore" className={navItemClass}>
                <Compass className="w-4 h-4" />
                <span>Explore</span>
              </NavLink>

              <NavLink to="/matches" className={navItemClass}>
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Smart Matches</span>
              </NavLink>

              <NavLink to="/requests" className={navItemClass}>
                <Inbox className="w-4 h-4" />
                <span>Requests</span>
              </NavLink>

              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </NavLink>

              <NavLink to="/reviews" className={navItemClass}>
                <Star className="w-4 h-4" />
                <span>Reviews</span>
              </NavLink>
            </nav>
          </div>

          {/* Right Section: Demo Switcher + Notifications + User Menu */}
          <div className="flex items-center space-x-3">
            {/* Demo Perspective Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setIsDemoSwitcherOpen(!isDemoSwitcherOpen)}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-purple-50 border border-purple-200 text-purple-800 hover:bg-purple-100 transition-colors shadow-xs"
                title="Switch active user to test multi-party skill exchanges"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Acting as: <strong className="font-bold">{currentProfile?.fullName?.split(' ')[0] || 'User'}</strong></span>
              </button>

              {isDemoSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 z-50 animate-slide-up">
                  <div className="px-4 pb-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Switch Demo Account</p>
                    <p className="text-[11px] text-slate-500">Test reciprocal matching & swaps between accounts</p>
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {availableDemoAccounts.map(account => (
                      <button
                        key={account.id}
                        onClick={() => {
                          switchDemoAccount(account.id);
                          setIsDemoSwitcherOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs hover:bg-purple-50/70 transition-colors ${
                          currentProfile?.id === account.id ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <img src={account.avatarUrl} alt={account.fullName} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold">{account.fullName}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{account.headline}</p>
                          </div>
                        </div>
                        {currentProfile?.id === account.id && <Check className="w-4 h-4 text-purple-600" />}
                      </button>
                    ))}
                  </div>
                  <div className="px-4 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        resetAllData();
                        setIsDemoSwitcherOpen(false);
                      }}
                      className="w-full inline-flex items-center justify-center space-x-1.5 py-1.5 text-[11px] text-slate-600 hover:text-purple-700 font-medium bg-slate-50 hover:bg-slate-100 rounded-lg"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Seed State</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-purple-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-slide-up">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/60">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-xs text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 6).map(n => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markAsRead(n.id);
                            if (n.link) {
                              setIsNotifOpen(false);
                              navigate(n.link);
                            }
                          }}
                          className={`p-3.5 text-xs hover:bg-slate-50 transition-colors cursor-pointer ${
                            !n.isRead ? 'bg-purple-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <h5 className="font-semibold text-slate-900 text-xs">{n.title}</h5>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1 text-xs">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar / User Dropdown */}
            {currentProfile ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 hover:ring-purple-200 transition-all"
                >
                  <img
                    src={currentProfile.avatarUrl}
                    alt={currentProfile.fullName}
                    className="w-9 h-9 rounded-full object-cover border border-purple-200"
                  />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-up">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="font-bold text-sm text-slate-900">{currentProfile.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{currentProfile.email}</p>
                      {/* Completion bar */}
                      <div className="mt-2.5">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
                          <span>Profile completeness</span>
                          <span className="text-purple-600 font-bold">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-indigo-600 h-1.5 rounded-full"
                            style={{ width: `${profileCompletion}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={`/profile/${currentProfile.id}`}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Public Profile</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Settings & Skills</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-purple-600"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                >
                  Join Free
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-1 animate-slide-up">
            <NavLink
              to="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Explore Members
            </NavLink>
            <NavLink
              to="/matches"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Smart Matches
            </NavLink>
            <NavLink
              to="/requests"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Exchange Requests
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/reviews"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Reviews
            </NavLink>
            <NavLink
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              Profile & Skill Settings
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
