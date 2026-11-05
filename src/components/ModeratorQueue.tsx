'use client';

import React, { useState } from 'react';
import { Resource, ModerationLog, UserReport } from '@/types';
import {
  ShieldCheckIcon,
  CheckBadgeIcon,
  FileTextIcon,
  EyeIcon,
  CloseIcon,
  FlagIcon,
} from './icons';

interface ModeratorQueueProps {
  resources: Resource[];
  moderationLogs: ModerationLog[];
  reports: UserReport[];
  onApprove: (resourceId: string, moderatorNotes?: string) => void;
  onReject: (resourceId: string, reason: string) => void;
  onRequestChanges: (resourceId: string, notes: string) => void;
  onPreviewResource: (resource: Resource) => void;
  onResolveReport: (reportId: string) => void;
}

export function ModeratorQueue({
  resources,
  moderationLogs,
  reports,
  onApprove,
  onReject,
  onRequestChanges,
  onPreviewResource,
  onResolveReport,
}: ModeratorQueueProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'logs' | 'reports'>('pending');
  const [rejectingResourceId, setRejectingResourceId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [requestingResourceId, setRequestingResourceId] = useState<string | null>(null);
  const [changeNotes, setChangeNotes] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const pendingResources = resources.filter((r) => r.status === 'PENDING');

  const uniqueSubjects = Array.from(
    new Set(pendingResources.map((r) => r.subjectCode))
  );

  const filteredPending =
    subjectFilter === 'all'
      ? pendingResources
      : pendingResources.filter((r) => r.subjectCode === subjectFilter);

  const handleConfirmReject = () => {
    if (!rejectingResourceId || !rejectionReason.trim()) return;
    onReject(rejectingResourceId, rejectionReason);
    setRejectingResourceId(null);
    setRejectionReason('');
  };

  const handleConfirmRequestChanges = () => {
    if (!requestingResourceId || !changeNotes.trim()) return;
    onRequestChanges(requestingResourceId, changeNotes);
    setRequestingResourceId(null);
    setChangeNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-purple-200 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200 ring-1 ring-purple-400/30">
              <ShieldCheckIcon className="w-4 h-4 text-purple-300" />
              MIC Moderator Workflow (PRD FR-11 to FR-15)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Moderation Review Queue
            </h1>
            <p className="text-xs sm:text-sm text-purple-200">
              Review student uploads, check syllabus alignment, issue Verified badges, and track audit history.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10">
            <div>
              <div className="text-2xl font-black text-amber-400">{pendingResources.length}</div>
              <div className="text-[11px] text-purple-200 font-medium">Pending Review</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <div className="text-2xl font-black text-rose-400">{reports.filter(r => !r.resolved).length}</div>
              <div className="text-[11px] text-purple-200 font-medium">Flagged Reports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'pending'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Pending Submissions ({pendingResources.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'reports'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Abuse & Flagged Reports ({reports.filter((r) => !r.resolved).length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-slate-800 text-slate-900 bg-slate-100 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Moderation Audit Log ({moderationLogs.length})
        </button>
      </div>

      {/* TAB 1: PENDING SUBMISSIONS */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          {uniqueSubjects.length > 0 && (
            <div className="flex items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-500">Filter by Course:</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-800 font-medium"
              >
                <option value="all">All Pending Courses</option>
                {uniqueSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filteredPending.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckBadgeIcon className="w-6 h-6" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900">Review Queue is Clear</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                No pending submissions waiting for review. Use the &ldquo;Upload Resource&rdquo; button to test adding new files.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPending.map((res) => (
                <div
                  key={res.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                        {res.subjectCode}
                      </span>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                        Module {res.moduleNumber}
                      </span>
                      <span className="rounded-md bg-purple-50 text-purple-700 px-2 py-0.5 text-xs font-bold border border-purple-200">
                        {res.resourceType}
                      </span>
                      {res.academicYear && (
                        <span className="rounded-md bg-rose-50 text-rose-700 px-2 py-0.5 text-xs font-bold border border-rose-200">
                          {res.academicYear}
                        </span>
                      )}
                      <span className="rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                        PENDING APPROVAL
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{res.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2">{res.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                      <span>Uploader: <strong>{res.uploaderName}</strong> ({res.uploaderRegNo})</span>
                      <span>•</span>
                      <span>{res.uploaderEmail}</span>
                      <span>•</span>
                      <span>Size: {res.fileSize} ({res.fileFormat.toUpperCase()})</span>
                      <span>•</span>
                      <span>Submitted {new Date(res.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Moderator Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-5">
                    {/* Preview Button */}
                    <button
                      onClick={() => onPreviewResource(res)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                    >
                      <EyeIcon className="w-4 h-4 text-slate-500" />
                      Inspect File
                    </button>

                    {/* Approve Button */}
                    <button
                      onClick={() => onApprove(res.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <CheckBadgeIcon className="w-4 h-4" />
                      Approve & Verify
                    </button>

                    {/* Request Changes */}
                    <button
                      onClick={() => setRequestingResourceId(res.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      Request Edits
                    </button>

                    {/* Reject Button (mandatory reason) */}
                    <button
                      onClick={() => setRejectingResourceId(res.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ABUSE REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500 text-xs">
              No reported resources in the queue.
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep.id}
                className="rounded-3xl border border-rose-200 bg-white p-5 shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-rose-100 text-rose-800 px-2 py-0.5 text-xs font-bold uppercase">
                      {rep.reason}
                    </span>
                    <span className="text-xs text-slate-500">
                      Reported by {rep.reportedBy} • {new Date(rep.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{rep.resourceTitle}</h4>
                  <p className="text-xs text-slate-600">&ldquo;{rep.notes}&rdquo;</p>
                </div>

                <div>
                  {rep.resolved ? (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                      Resolved
                    </span>
                  ) : (
                    <button
                      onClick={() => onResolveReport(rep.id)}
                      className="rounded-xl bg-slate-900 text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: MODERATION AUDIT LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-3">
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Resource Title</th>
                    <th className="px-4 py-3">Moderator</th>
                    <th className="px-4 py-3">Reason / Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moderationLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            log.action === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.action === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 max-w-xs truncate">
                        {log.resourceTitle}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-700">{log.moderatorName}</td>
                      <td className="px-4 py-3 text-slate-500 text-[11px]">{log.reason || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REJECTION REASON MODAL (PRD FR-12: Reject reason required) */}
      {rejectingResourceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Provide Rejection Reason</h3>
              <button
                onClick={() => setRejectingResourceId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              PRD FR-12 requires a mandatory feedback reason so the student contributor understands why the resource was declined.
            </p>
            <textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Outdated syllabus topics, blurry handwriting, or duplicate of existing Module 2 notes..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-rose-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectingResourceId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REQUEST CHANGES MODAL */}
      {requestingResourceId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Request Revisions</h3>
              <button
                onClick={() => setRequestingResourceId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Inform the contributor what needs clarification or fix before approval.
            </p>
            <textarea
              rows={3}
              value={changeNotes}
              onChange={(e) => setChangeNotes(e.target.value)}
              placeholder="e.g. Please specify whether this paper is CAT-1 or CAT-2, and add the exam slot..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-amber-500 focus:outline-hidden"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRequestingResourceId(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                disabled={!changeNotes.trim()}
                onClick={handleConfirmRequestChanges}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 rounded-xl hover:bg-amber-700 disabled:opacity-50"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
