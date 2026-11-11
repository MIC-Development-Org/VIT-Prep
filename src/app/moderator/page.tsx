'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Resource, ModerationLog, UserReport } from '@/types';
import { INITIAL_RESOURCES, INITIAL_MODERATION_LOGS } from '@/data/mockData';
import { ModeratorQueue } from '@/components/ModeratorQueue';
import { ResourcePreviewModal } from '@/components/ResourcePreviewModal';
import { downloadResourceFile } from '@/lib/download-resource';
import { ShieldCheckIcon } from '@/components/icons';

export default function ModeratorPage() {
  const { data: session } = useSession();
  const [resources, setResources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [moderationLogs, setModerationLogs] = useState<ModerationLog[]>(INITIAL_MODERATION_LOGS);
  const [reports, setReports] = useState<UserReport[]>([
    {
      id: 'rep-01',
      resourceId: 'res-os-03',
      resourceTitle: 'Winter 2023-24 CAT-2 Question Paper',
      reason: 'WRONG_TAGGING',
      notes: 'Question 3 covers Virtual Memory which is technically Module 4 not Module 3.',
      reportedBy: 'student.feedback@vitstudent.ac.in',
      timestamp: '2026-10-28T10:00:00Z',
      resolved: false,
    },
  ]);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);

  const moderatorName = session?.user?.name || 'Authorized Moderator';

  const handleApprove = (resourceId: string, moderatorNotes?: string) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              status: 'APPROVED',
              isVerified: true,
              verifiedBy: moderatorName,
              verifiedAt: new Date().toISOString(),
              moderatorNotes,
            }
          : r
      )
    );

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      resourceId,
      resourceTitle: res.title,
      action: 'APPROVED',
      moderatorName,
      timestamp: new Date().toISOString(),
      reason: moderatorNotes || 'Content vetted, verified accurate for AY 2026-27.',
    };

    setModerationLogs((prev) => [log, ...prev]);
  };

  const handleReject = (resourceId: string, reason: string) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              status: 'REJECTED',
              isVerified: false,
              moderatorNotes: reason,
            }
          : r
      )
    );

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      resourceId,
      resourceTitle: res.title,
      action: 'REJECTED',
      moderatorName,
      timestamp: new Date().toISOString(),
      reason,
    };

    setModerationLogs((prev) => [log, ...prev]);
  };

  const handleRequestChanges = (resourceId: string, notes: string) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    setResources((prev) =>
      prev.map((r) =>
        r.id === resourceId
          ? {
              ...r,
              status: 'CHANGES_REQUESTED',
              moderatorNotes: notes,
            }
          : r
      )
    );

    const log: ModerationLog = {
      id: `log-${Date.now()}`,
      resourceId,
      resourceTitle: res.title,
      action: 'CHANGES_REQUESTED',
      moderatorName,
      timestamp: new Date().toISOString(),
      reason: notes,
    };

    setModerationLogs((prev) => [log, ...prev]);
  };

  const handleResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, resolved: true } : r))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-xs">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900">VITPrep</span>
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                    Moderator Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Signed in as: {session?.user?.name || 'Moderator'} ({session?.user?.email})
                </p>
              </div>
            </Link>
          </div>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            &larr; Back to Main Catalog
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        <ModeratorQueue
          resources={resources}
          moderationLogs={moderationLogs}
          reports={reports}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestChanges={handleRequestChanges}
          onPreviewResource={setPreviewResource}
          onResolveReport={handleResolveReport}
        />
      </main>

      <ResourcePreviewModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
        onDownload={(res) => {
          void downloadResourceFile(res.fileUrl, res.title).catch((error: unknown) => {
            alert(error instanceof Error ? error.message : 'File download failed.');
          });
        }}
      />
    </div>
  );
}

