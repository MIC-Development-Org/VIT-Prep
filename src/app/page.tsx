'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  UserRole,
  Subject,
  Resource,
  ModerationLog,
  UserReport,
} from '@/types';
import {
  INITIAL_SUBJECTS,
  INITIAL_RESOURCES,
  INITIAL_MODERATION_LOGS,
} from '@/data/mockData';
import { Navbar } from '@/components/Navbar';
import { SemesterSelector } from '@/components/SemesterSelector';
import { SubjectView } from '@/components/SubjectView';
import { ResourcePreviewModal } from '@/components/ResourcePreviewModal';
import { UploadModal } from '@/components/UploadModal';
import { ModeratorQueue } from '@/components/ModeratorQueue';
import { ContributorDashboard } from '@/components/ContributorDashboard';
import { AdminCatalog } from '@/components/AdminCatalog';
import { ReportModal } from '@/components/ReportModal';
import { PYQAnalysisPreview } from '@/components/PYQAnalysisPreview';
import { downloadResourceFile } from '@/lib/download-resource';

export default function Home() {
  const { data: session } = useSession();

  // Roles and Navigation (defaults to session user role if authenticated, otherwise student)
  const [selectedRoleOverride, setSelectedRoleOverride] = useState<UserRole | null>(null);
  const currentRole: UserRole = selectedRoleOverride ?? session?.user?.role ?? 'student';
  const [activeTab, setActiveTab] = useState<'browse' | 'my-uploads' | 'moderator' | 'admin'>('browse');

  // Core Data State
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
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

  // Browsing State
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadSubjectId, setUploadSubjectId] = useState<string | undefined>(undefined);
  const [uploadModuleNumber, setUploadModuleNumber] = useState<number | undefined>(undefined);
  const [previewResource, setPreviewResource] = useState<Resource | null>(null);
  const [reportingResource, setReportingResource] = useState<Resource | null>(null);

  // Authenticated Contributor email (from session or mock fallback)
  const contributorEmail = session?.user?.email || 'rohan.sharma2022@vitstudent.ac.in';

  // Computed counts
  const pendingReviewCount = resources.filter((r) => r.status === 'PENDING').length;
  const myUploadsCount = resources.filter(
    (r) =>
      r.uploaderEmail === contributorEmail ||
      (session?.user?.email && r.uploaderEmail === session.user.email) ||
      (session?.user?.regNo && r.uploaderRegNo === session.user.regNo) ||
      (!session?.user && (r.uploaderRegNo === '22BCE1042' || r.uploaderName.includes('Rohan')))
  ).length;

  // Handlers for Upload
  const handleUploadSuccess = (newResource: Resource) => {
    setResources((prev) => [newResource, ...prev]);
    alert(`Success! "${newResource.title}" has been submitted to the Moderator Review Queue (PRD FR-9).`);
  };

  const handleOpenUploadForSubject = (subject: Subject, moduleNumber: number) => {
    setUploadSubjectId(subject.id);
    setUploadModuleNumber(moduleNumber);
    setIsUploadOpen(true);
  };

  // Handlers for Moderation
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
              verifiedBy: 'MIC Moderator Lead',
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
      moderatorName: 'MIC Moderator Lead',
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
      moderatorName: 'MIC Moderator Lead',
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
      moderatorName: 'MIC Moderator Lead',
      timestamp: new Date().toISOString(),
      reason: notes,
    };

    setModerationLogs((prev) => [log, ...prev]);
  };

  // Handlers for Admin
  const handleAddSubject = (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject]);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  // Handlers for Reports
  const handleSubmitReport = (report: UserReport) => {
    setReports((prev) => [report, ...prev]);
    alert('Thank you for reporting. This item has been routed to the Moderator Queue for verification.');
  };

  const handleResolveReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, resolved: true } : r))
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Navbar with Role Switcher */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setSelectedRoleOverride}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'browse') {
            setSelectedSubject(null);
          }
        }}
        onOpenUpload={() => {
          setUploadSubjectId(undefined);
          setUploadModuleNumber(undefined);
          setIsUploadOpen(true);
        }}
        pendingReviewCount={pendingReviewCount}
        myUploadsCount={myUploadsCount}
        onOpenSearch={() => {
          setActiveTab('browse');
          setSelectedSubject(null);
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
          if (searchInput) searchInput.focus();
        }}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
        {/* VIEW 1: BROWSE / COURSE EXPLORER */}
        {activeTab === 'browse' && (
          <>
            {selectedSubject ? (
              <div className="space-y-6">
                <SubjectView
                  subject={selectedSubject}
                  resources={resources}
                  onBack={() => setSelectedSubject(null)}
                  onPreviewResource={setPreviewResource}
                  onReportResource={setReportingResource}
                  onOpenUploadForSubject={handleOpenUploadForSubject}
                />

                {/* AI PYQ Analysis Preview Component (Phase 2/3) */}
                <PYQAnalysisPreview subjectCode={selectedSubject.code} />
              </div>
            ) : (
              <SemesterSelector
                subjects={subjects}
                resources={resources}
                onSelectSubject={(subj) => setSelectedSubject(subj)}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
            )}
          </>
        )}

        {/* VIEW 2: CONTRIBUTOR DASHBOARD */}
        {activeTab === 'my-uploads' && (
          <ContributorDashboard
            resources={resources}
            currentUploaderEmail={contributorEmail}
            onOpenUpload={() => setIsUploadOpen(true)}
            onPreviewResource={setPreviewResource}
          />
        )}

        {/* VIEW 3: MODERATOR REVIEW QUEUE */}
        {activeTab === 'moderator' && (
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
        )}

        {/* VIEW 4: ADMIN CATALOG & ROLES */}
        {activeTab === 'admin' && (
          <AdminCatalog
            subjects={subjects}
            onAddSubject={handleAddSubject}
            onDeleteSubject={handleDeleteSubject}
          />
        )}
      </main>

      {/* MODALS */}
      {/* 1. Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        subjects={subjects}
        initialSubjectId={uploadSubjectId}
        initialModuleNumber={uploadModuleNumber}
        onUploadSuccess={handleUploadSuccess}
      />

      {/* 2. Resource In-Browser Preview Modal */}
      <ResourcePreviewModal
        resource={previewResource}
        onClose={() => setPreviewResource(null)}
        onDownload={(res) => {
          void downloadResourceFile(res.fileUrl, res.title).catch((error: unknown) => {
            alert(error instanceof Error ? error.message : 'File download failed.');
          });
        }}
      />

      {/* 3. Report Resource Modal */}
      <ReportModal
        resource={reportingResource}
        onClose={() => setReportingResource(null)}
        onSubmitReport={handleSubmitReport}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">VITPrep</span>
            <span>&bull;</span>
            <span>Built by MIC Development Department &bull; Team 3</span>
            <span>&bull;</span>
            <span>AY 2026&ndash;27</span>
          </div>
          <div className="flex items-center gap-4">
            {session?.user && (
              <button
                onClick={() => {
                  setSelectedRoleOverride('moderator');
                  setActiveTab('moderator');
                }}
                className="hover:text-blue-600 transition-colors"
              >
                Moderator Portal
              </button>
            )}
            {session?.user && (
              <button
                onClick={() => {
                  setSelectedRoleOverride('admin');
                  setActiveTab('admin');
                }}
                className="hover:text-blue-600 transition-colors"
              >
                Admin Catalog
              </button>
            )}
            <span>WCAG 2.1 AA Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
