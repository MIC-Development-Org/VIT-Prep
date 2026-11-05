'use client';

import React from 'react';
import { Resource } from '@/types';
import {
  CheckBadgeIcon,
  UploadCloudIcon,
  FileTextIcon,
  EyeIcon,
} from './icons';

interface ContributorDashboardProps {
  resources: Resource[];
  currentUploaderEmail: string;
  onOpenUpload: () => void;
  onPreviewResource: (resource: Resource) => void;
}

export function ContributorDashboard({
  resources,
  currentUploaderEmail,
  onOpenUpload,
  onPreviewResource,
}: ContributorDashboardProps) {
  // Filter resources uploaded by current simulated user or mock uploader
  const myResources = resources.filter(
    (r) =>
      r.uploaderEmail === currentUploaderEmail ||
      r.uploaderName.includes('Rohan') ||
      r.uploaderRegNo === '22BCE1042'
  );

  const approvedCount = myResources.filter((r) => r.status === 'APPROVED').length;
  const pendingCount = myResources.filter((r) => r.status === 'PENDING').length;
  const changesCount = myResources.filter((r) => r.status === 'CHANGES_REQUESTED').length;
  const rejectedCount = myResources.filter((r) => r.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-400/30">
              <CheckBadgeIcon className="w-4 h-4 text-emerald-300" />
              Contributor Dashboard (PRD FR-10)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              My Submissions & Status
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200">
              Track real-time review status, read moderator feedback, and monitor your verified contributions.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md hover:bg-emerald-400 transition-all active:scale-95 self-start sm:self-auto"
          >
            <UploadCloudIcon className="w-4 h-4" />
            Upload New Resource
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="text-2xl font-black text-slate-900">{myResources.length}</div>
          <div className="text-xs font-semibold text-slate-500">Total Uploads</div>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 shadow-xs">
          <div className="text-2xl font-black text-emerald-700">{approvedCount}</div>
          <div className="text-xs font-semibold text-emerald-800">Approved & Verified</div>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-xs">
          <div className="text-2xl font-black text-amber-700">{pendingCount}</div>
          <div className="text-xs font-semibold text-amber-800">In Review Queue</div>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4 shadow-xs">
          <div className="text-2xl font-black text-rose-700">{rejectedCount + changesCount}</div>
          <div className="text-xs font-semibold text-rose-800">Feedback / Action Required</div>
        </div>
      </div>

      {/* Submissions List */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900">Submitted Resources</h2>

        {myResources.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-900">No uploads yet</h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
              Share your high quality handwritten notes, slides, or previous year papers with the VIT community.
            </p>
            <button
              onClick={onOpenUpload}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
            >
              Start Contributing
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {myResources.map((res) => {
              const getStatusBadge = () => {
                switch (res.status) {
                  case 'APPROVED':
                    return (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                        <CheckBadgeIcon className="w-3.5 h-3.5 text-emerald-600" />
                        Approved &amp; Live
                      </span>
                    );
                  case 'PENDING':
                    return (
                      <span className="inline-flex items-center rounded-full bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-bold">
                        Under Moderator Review
                      </span>
                    );
                  case 'CHANGES_REQUESTED':
                    return (
                      <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 text-xs font-bold">
                        Changes Requested
                      </span>
                    );
                  case 'REJECTED':
                    return (
                      <span className="inline-flex items-center rounded-full bg-rose-100 text-rose-800 px-2.5 py-0.5 text-xs font-bold">
                        Rejected
                      </span>
                    );
                }
              };

              return (
                <div
                  key={res.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {res.subjectCode}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        Module {res.moduleNumber}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        {res.resourceType}
                      </span>
                      {getStatusBadge()}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{res.description}</p>

                    {/* Moderator Feedback Notice */}
                    {res.moderatorNotes && (
                      <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-2.5 text-xs">
                        <strong className="text-slate-800">Moderator Feedback: </strong>
                        <span className="text-slate-600">{res.moderatorNotes}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4">
                    <button
                      onClick={() => onPreviewResource(res)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 text-slate-500" />
                      View Upload
                    </button>
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
