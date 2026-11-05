'use client';

import React from 'react';
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
  const roles: { role: UserRole; label: string; badge: string; color: string }[] = [
    { role: 'student', label: 'Student', badge: 'Browse & Prep', color: 'bg-blue-600 text-white' },
    { role: 'contributor', label: 'Contributor', badge: 'Uploads', color: 'bg-emerald-600 text-white' },
    { role: 'moderator', label: 'Moderator', badge: 'Verify Queue', color: 'bg-purple-600 text-white' },
    { role: 'admin', label: 'Admin', badge: 'Manage Catalog', color: 'bg-slate-800 text-white' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner: Team & Role Switcher Toolbar */}
      <div className="border-b border-slate-100 bg-slate-900 px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 font-semibold text-blue-300 ring-1 ring-blue-500/40">
              MIC AY 2026-27
            </span>
            <span className="hidden sm:inline text-slate-400">Team 3 Centralized Study Resource Hub</span>
          </div>

          {/* Persona Switcher Toolbar */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium mr-1 hidden sm:inline">Active Role:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              {roles.map((r) => (
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
              <p className="text-[11px] text-slate-500 font-medium">Curated & Verified Course Hub</p>
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

            {(currentRole === 'moderator' || currentRole === 'admin') && (
              <button
                onClick={() => onTabChange('moderator')}
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

            {currentRole === 'admin' && (
              <button
                onClick={() => onTabChange('admin')}
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
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-all sm:w-56"
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
        </div>
      </div>
    </header>
  );
}
