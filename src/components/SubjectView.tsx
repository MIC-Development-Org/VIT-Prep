'use client';

import React, { useState } from 'react';
import { Subject, Resource, ResourceType } from '@/types';
import {
  FileTextIcon,
  CheckBadgeIcon,
  DownloadIcon,
  EyeIcon,
  FilterIcon,
  FlagIcon,
  SparklesIcon,
} from './icons';

interface SubjectViewProps {
  subject: Subject;
  resources: Resource[];
  onBack: () => void;
  onPreviewResource: (resource: Resource) => void;
  onReportResource: (resource: Resource) => void;
  onOpenUploadForSubject: (subject: Subject, moduleNumber: number) => void;
}

export function SubjectView({
  subject,
  resources,
  onBack,
  onPreviewResource,
  onReportResource,
  onOpenUploadForSubject,
}: SubjectViewProps) {
  const [selectedModule, setSelectedModule] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<ResourceType | 'all'>('all');
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Filter approved resources for this subject
  const subjectResources = resources.filter(
    (r) => r.subjectId === subject.id && r.status === 'APPROVED'
  );

  // Extract unique academic years for PYQ filter
  const pyqYears = Array.from(
    new Set(
      subjectResources
        .filter((r) => r.academicYear)
        .map((r) => r.academicYear as string)
    )
  );

  // Apply filters
  const filteredResources = subjectResources.filter((r) => {
    if (selectedModule !== 'all' && r.moduleNumber !== selectedModule) return false;
    if (selectedType !== 'all' && r.resourceType !== selectedType) return false;
    if (onlyVerified && !r.isVerified) return false;
    if (selectedYear !== 'all' && r.academicYear !== selectedYear) return false;
    return true;
  });

  const resourceTypes: (ResourceType | 'all')[] = ['all', 'Notes', 'PPT', 'Tutorial Sheet', 'PYQ'];

  const getTypeBadgeStyle = (type: ResourceType) => {
    switch (type) {
      case 'Notes':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PPT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Tutorial Sheet':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PYQ':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const currentModuleData =
    selectedModule === 'all'
      ? null
      : subject.modules.find((m) => m.moduleNumber === selectedModule);

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          &larr; Back to All Courses
        </button>

        <button
          onClick={() => onOpenUploadForSubject(subject, selectedModule === 'all' ? 1 : selectedModule)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all"
        >
          + Upload Note / PYQ for this Course
        </button>
      </div>

      {/* Subject Header Banner */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-lg bg-blue-600 px-3 py-1 font-mono text-xs font-bold text-white shadow-xs">
                {subject.code}
              </span>
              <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {subject.credits} Credits
              </span>
              <span className="text-xs text-slate-500">{subject.department}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {subject.name}
            </h1>
            <p className="max-w-3xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              {subject.description}
            </p>
          </div>

          {/* Quick stats box */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 sm:border-l border-slate-100 pt-4 sm:pt-0 sm:pl-6 text-right">
            <div>
              <div className="text-2xl font-black text-slate-900">{subjectResources.length}</div>
              <div className="text-xs text-slate-500 font-medium">Verified Resources</div>
            </div>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
              <CheckBadgeIcon className="w-4 h-4" />
              100% Moderator Vetted
            </div>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs (Module 1 to 5) */}
      <div className="border-b border-slate-200 bg-white px-2 rounded-2xl shadow-xs">
        <div className="flex overflow-x-auto no-scrollbar gap-1 py-1.5">
          <button
            onClick={() => setSelectedModule('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedModule === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Modules ({subjectResources.length})
          </button>

          {subject.modules.map((mod) => {
            const count = subjectResources.filter((r) => r.moduleNumber === mod.moduleNumber).length;
            const isSelected = selectedModule === mod.moduleNumber;
            return (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.moduleNumber)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Module {mod.moduleNumber}: {mod.title}
                <span
                  className={`ml-2 rounded-full px-1.5 py-0.2 text-[10px] ${
                    isSelected ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Module Topic Highlights */}
      {currentModuleData && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
            <SparklesIcon className="w-4 h-4 text-blue-600" />
            Module {currentModuleData.moduleNumber} Syllabus Topics:
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {currentModuleData.topics.map((t, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-slate-700 shadow-2xs border border-blue-100"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Filter Row: Type Tabs & Dropdowns */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200">
        {/* Resource Type Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <FilterIcon className="w-3.5 h-3.5" /> Type:
          </span>
          {resourceTypes.map((type) => {
            const count =
              type === 'all'
                ? subjectResources.length
                : subjectResources.filter((r) => r.resourceType === type).length;
            const isSelected = selectedType === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {type === 'all' ? 'All Types' : type} ({count})
              </button>
            );
          })}
        </div>

        {/* Extra Filters (PYQ Year, Verified Toggle) */}
        <div className="flex items-center gap-3">
          {pyqYears.length > 0 && selectedType === 'PYQ' && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700"
            >
              <option value="all">All Exam Years</option>
              {pyqYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          )}

          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Verified only</span>
          </label>
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-3">
        {filteredResources.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No resources match your filter</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Be the first to upload notes or past question papers for this module!
            </p>
            <button
              onClick={() => onOpenUploadForSubject(subject, selectedModule === 'all' ? 1 : selectedModule)}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Upload Material
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition-all hover:border-blue-300 hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`rounded-lg border px-2.5 py-0.5 text-xs font-bold ${getTypeBadgeStyle(
                          res.resourceType
                        )}`}
                      >
                        {res.resourceType}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                        Module {res.moduleNumber}
                      </span>
                      {res.academicYear && (
                        <span className="rounded-md bg-rose-50 border border-rose-200 px-2 py-0.5 text-[11px] font-bold text-rose-700">
                          {res.academicYear}
                        </span>
                      )}
                    </div>

                    {res.isVerified && (
                      <span
                        className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200"
                        title="Vetted and verified by MIC academic moderators"
                      >
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  {/* File Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span className="uppercase font-mono font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      {res.fileFormat}
                    </span>
                    <span>{res.fileSize}</span>
                    <span>•</span>
                    <span>Uploaded by {res.uploaderName} ({res.uploaderRegNo})</span>
                    <span>•</span>
                    <span>{new Date(res.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    {/* In-Browser Preview Button */}
                    <button
                      onClick={() => onPreviewResource(res)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 text-slate-500" />
                      Preview
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={() => {
                        if (res.fileUrl.startsWith('http')) {
                          window.open(res.fileUrl, '_blank');
                        } else {
                          alert(`Downloading "${res.title}" (${res.fileSize})`);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      <DownloadIcon className="w-4 h-4 text-blue-600" />
                      Download
                    </button>
                  </div>

                  {/* Report Flag Button */}
                  <button
                    onClick={() => onReportResource(res)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Report incorrect or inappropriate file"
                  >
                    <FlagIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
