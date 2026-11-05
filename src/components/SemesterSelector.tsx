'use client';

import React, { useState } from 'react';
import { Subject, Resource } from '@/types';
import { BookOpenIcon, CheckBadgeIcon, SparklesIcon, FilterIcon } from './icons';

interface CourseCatalogProps {
  subjects: Subject[];
  resources: Resource[];
  onSelectSubject: (subject: Subject) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function SemesterSelector({
  subjects,
  resources,
  onSelectSubject,
  searchQuery,
  onSearchChange,
}: CourseCatalogProps) {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'papers' | 'code' | 'name'>('papers');

  const schools = [
    { id: 'all', label: 'All Schools' },
    { id: 'SCOPE', label: 'SCOPE (Computer Science)' },
    { id: 'SENSE', label: 'SENSE (Electronics)' },
    { id: 'SELECT', label: 'SELECT (Electrical)' },
    { id: 'SAS', label: 'SAS (Math, Physics, Chem)' },
    { id: 'SMEC', label: 'SMEC (Mechanical)' },
    { id: 'SCE', label: 'SCE (Civil)' },
  ];

  // Filter subjects based on search query and school filter
  const filteredSubjects = subjects.filter((subject) => {
    const matchesQuery =
      searchQuery.trim() === '' ||
      subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.department.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesQuery) return false;

    if (selectedSchool === 'all') return true;
    if (selectedSchool === 'SCOPE') return subject.department.includes('SCOPE');
    if (selectedSchool === 'SENSE') return subject.department.includes('SENSE');
    if (selectedSchool === 'SELECT') return subject.department.includes('SELECT');
    if (selectedSchool === 'SAS') return subject.department.includes('SAS') || subject.department.includes('Mathematics') || subject.department.includes('Physics') || subject.department.includes('Chemistry');
    if (selectedSchool === 'SMEC') return subject.department.includes('SMEC');
    if (selectedSchool === 'SCE') return subject.department.includes('SCE');

    return true;
  });

  // Sorting
  const sortedSubjects = [...filteredSubjects].sort((a, b) => {
    if (sortBy === 'papers') {
      const countA = resources.filter((r) => r.subjectId === a.id).length;
      const countB = resources.filter((r) => r.subjectId === b.id).length;
      return countB - countA;
    }
    if (sortBy === 'code') {
      return a.code.localeCompare(b.code);
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 px-6 py-10 text-white shadow-xl sm:px-12 sm:py-12">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/30">
            <SparklesIcon className="w-4 h-4 text-blue-300" />
            Centralized Study Resource Hub • MIC AY 2026-27
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Choose any course from <span className="text-blue-400">{subjects.length} subjects</span>.
          </h1>

          <p className="text-sm text-slate-300 sm:text-base leading-relaxed">
            Fully flexible credit access. Search by course code, title, or school to instantly view and download authentic CAT-1, CAT-2, and FAT examination papers.
          </p>

          {/* Search Box on Hero */}
          <div className="pt-2">
            <div className="relative max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by course code (e.g. BCSE202L, BECE204L) or name..."
                className="w-full rounded-2xl bg-white/10 px-5 py-3.5 pl-11 text-sm text-white placeholder-slate-400 backdrop-blur-md border border-white/20 focus:border-blue-400 focus:bg-white/15 focus:outline-hidden transition-all shadow-inner"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Decorative Grid BG */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* School / Department Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <FilterIcon className="w-3.5 h-3.5" /> School:
          </span>
          {schools.map((s) => {
            const isSelected = selectedSchool === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSchool(s.id)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-slate-500">
          <span>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'papers' | 'code' | 'name')}
            className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700"
          >
            <option value="papers">Most Question Papers</option>
            <option value="code">Course Code (A-Z)</option>
            <option value="name">Subject Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Subject Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {searchQuery
              ? `Search Results (${sortedSubjects.length})`
              : `Courses (${sortedSubjects.length} of ${subjects.length})`}
          </h2>
          <span className="text-xs text-slate-500">Click any subject to view question papers</span>
        </div>

        {sortedSubjects.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <BookOpenIcon className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No courses found</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Try searching with another course code or switch schools.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedSubjects.map((subject) => {
              const subjectResources = resources.filter(
                (r) => r.subjectId === subject.id && r.status === 'APPROVED'
              );
              const cat1Count = subjectResources.filter((r) => r.academicYear?.includes('CAT 1')).length;
              const cat2Count = subjectResources.filter((r) => r.academicYear?.includes('CAT 2')).length;
              const fatCount = subjectResources.filter((r) => r.academicYear?.includes('FAT')).length;

              return (
                <div
                  key={subject.id}
                  onClick={() => onSelectSubject(subject)}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-mono font-bold text-blue-700 border border-blue-200">
                        {subject.code}
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 truncate max-w-[150px]">
                        {subject.department.split('(')[0].trim()}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {subject.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {subject.description}
                      </p>
                    </div>

                    {/* Exam Tags breakdown */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cat1Count > 0 && (
                        <span className="rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold">
                          {cat1Count} CAT-1
                        </span>
                      )}
                      {cat2Count > 0 && (
                        <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold">
                          {cat2Count} CAT-2
                        </span>
                      )}
                      {fatCount > 0 && (
                        <span className="rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[11px] font-semibold">
                          {fatCount} FAT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <CheckBadgeIcon className="w-4 h-4 text-emerald-600" />
                      {subjectResources.length} papers
                    </span>

                    <span className="font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      View Papers &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
