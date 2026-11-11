'use client';

import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { UserRole } from '@/types';
import { AcademicCapIcon, UploadCloudIcon, ShieldCheckIcon, SearchIcon } from './icons';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: 'browse' | 'my-uploads' | 'moderator' | 'admin';
  onTabChange: (tab: 'browse' | 'my-uploads' | 'moderator' | 'admin') => void;
  onOpenUpload: () => void;
  pendingReviewCount: number;
  myUploadsCount: number;
  onOpenSearch: () => void;
}

export function Navbar({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenUpload,
  pendingReviewCount,
  myUploadsCount,
  onOpenSearch,
}: NavbarProps) {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  const roles: { role: UserRole; label: string; badge: string; color: string }[] = [
    { role: 'student', label: 'Student', badge: 'Browse & Prep', color: 'bg-blue-600 text-white' },
    { role: 'contributor', label: 'Contributor', badge: 'Uploads', color: 'bg-emerald-600 text-white' },
    { role: 'moderator', label: 'Moderator', badge: 'Verify Queue', color: 'bg-purple-600 text-white' },
    { role: 'admin', label: 'Admin', badge: 'Manage Catalog', color: 'bg-slate-800 text-white' },
  ];

  // When not signed in, only student and contributor are visible.
  // Once signed in, all views (Student, Contributor, Moderator, Admin) are accessible.
  const availableRoles = roles.filter((r) => {
    if (!session?.user) {
      return r.role === 'student' || r.role === 'contributor';
    }
    return true;
  });

  const userRole = session?.user?.role || 'student';
  const userName = session?.user?.name || 'VITian';
  const userEmail = session?.user?.email;
  const userImage = session?.user?.image;

  // Generate initials for avatar fallback
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner: Institutional Verification & Role Switcher Toolbar */}
      <div className="border-b border-slate-100 bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-300 ring-1 ring-blue-500/40">
              MIC AY 2026-27
            </span>
            <span className="hidden sm:inline text-slate-400">Team 3 Centralized Study Resource Hub</span>
          </div>

          {/* Persona Switcher Toolbar */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Role View:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {availableRoles.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    onRoleChange(r.role);
                    if (r.role === 'moderator') onTabChange('moderator');
                    else if (r.role === 'admin') onTabChange('admin');
                    else if (r.role === 'contributor') onTabChange('my-uploads');
                    else onTabChange('browse');
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    currentRole === r.role
                      ? `${r.color} shadow-xs font-semibold`
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title={`Switch to ${r.label} View`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div
            onClick={() => onTabChange('browse')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md group-hover:scale-105 transition-transform">
              <AcademicCapIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900">VITPrep</span>
                <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  v0.1
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Curated &amp; Verified Course Hub</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onTabChange('browse')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              Course Catalog
            </button>

            <button
              onClick={() => onTabChange('my-uploads')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                activeTab === 'my-uploads'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              My Uploads
              {myUploadsCount > 0 && (
                <span className="ml-1.5 rounded-full bg-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {myUploadsCount}
                </span>
              )}
            </button>

            {session?.user && (
              <button
                onClick={() => {
                  onRoleChange('moderator');
                  onTabChange('moderator');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  activeTab === 'moderator'
                    ? 'bg-purple-50 text-purple-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheckIcon className="w-4 h-4 text-purple-600" />
                  Moderator Queue
                </span>
                {pendingReviewCount > 0 && (
                  <span className="ml-1.5 rounded-full bg-amber-500 text-white px-2 py-0.5 text-xs font-bold animate-pulse">
                    {pendingReviewCount}
                  </span>
                )}
              </button>
            )}

            {session?.user && (
              <button
                onClick={() => {
                  onRoleChange('admin');
                  onTabChange('admin');
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                Admin Catalog
              </button>
            )}
          </nav>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-3">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-all sm:w-52"
          >
            <SearchIcon className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Search subject or code...</span>
            <span className="sm:hidden">Search</span>
            <kbd className="ml-auto hidden rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200 sm:inline">
              Ctrl+K
            </kbd>
          </button>

          {/* Upload CTA */}
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all active:scale-95"
          >
            <UploadCloudIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Upload Resource</span>
            <span className="sm:hidden">Upload</span>
          </button>

          {/* Authentication & User Profile */}
          {isLoading ? (
            <div className="h-9 w-24 animate-pulse rounded-xl bg-slate-100 border border-slate-200" />
          ) : session?.user ? (
            <div className="flex items-center pl-2 border-l border-slate-200">
              {/* Profile Pill */}
              <div className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-1.5 border border-slate-200 shadow-2xs">
                {userImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={userImage}
                    alt={userName}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs ring-1 ring-blue-700 shrink-0">
                    {initials || 'U'}
                  </div>
                )}

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 leading-tight">
                      {userName.split('\n')[0]}
                    </span>
                    <span className="rounded-md bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide shrink-0">
                      {userRole}
                    </span>
                  </div>
                  {userName.split('\n')[1] && (
                    <span className="text-[11px] font-semibold text-slate-700 font-mono leading-tight">
                      {userName.split('\n')[1]}
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500 font-mono leading-tight">
                    {userEmail}
                  </span>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  title="Sign Out"
                  className="ml-1 rounded-xl p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className="inline-flex items-center gap-2 rounded-xl border border-blue-600 bg-blue-50/50 px-3.5 py-2 text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>VIT Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
