'use client';

import React, { useState } from 'react';
import { Resource, UserReport } from '@/types';
import { CloseIcon, FlagIcon } from './icons';

interface ReportModalProps {
  resource: Resource | null;
  onClose: () => void;
  onSubmitReport: (report: UserReport) => void;
}

export function ReportModal({ resource, onClose, onSubmitReport }: ReportModalProps) {
  const [reason, setReason] = useState<UserReport['reason']>('INCORRECT_CONTENT');
  const [notes, setNotes] = useState('');
  const [reporterEmail, setReporterEmail] = useState('student@vitstudent.ac.in');

  if (!resource) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: UserReport = {
      id: `rep-${Date.now()}`,
      resourceId: resource.id,
      resourceTitle: resource.title,
      reason,
      notes: notes.trim() || 'No additional details specified.',
      reportedBy: reporterEmail,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    onSubmitReport(newReport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-100">
          <div className="flex items-center gap-2 text-rose-600 font-bold">
            <FlagIcon className="w-5 h-5" />
            <h3 className="text-base text-slate-900">Report Resource</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Reports are directly sent to the MIC Moderator Queue (FR-14) for swift review and takedown if incorrect or duplicate.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <span className="font-semibold text-slate-700">Flagged Resource:</span>
            <div className="mt-1 p-2 rounded-lg bg-slate-50 border text-slate-800 font-medium truncate">
              {resource.title} ({resource.subjectCode})
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as UserReport['reason'])}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white"
            >
              <option value="INCORRECT_CONTENT">Incorrect Syllabus or Outdated Info</option>
              <option value="DUPLICATE">Duplicate of Existing Resource</option>
              <option value="WRONG_TAGGING">Wrong Module / Course Code Tagged</option>
              <option value="INAPPROPRIATE">Inappropriate / Unrelated Content</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Detailed Notes</label>
            <textarea
              rows={3}
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain what is inaccurate or duplicate so moderators can verify..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Your Student Email</label>
            <input
              type="email"
              value={reporterEmail}
              onChange={(e) => setReporterEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-xs"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
