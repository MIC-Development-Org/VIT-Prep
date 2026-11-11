'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Subject } from '@/types';
import { INITIAL_SUBJECTS } from '@/data/mockData';
import { AdminCatalog } from '@/components/AdminCatalog';
import { AcademicCapIcon } from '@/components/icons';

export default function AdminPage() {
  const { data: session } = useSession();
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);

  const handleAddSubject = (newSubject: Subject) => {
    setSubjects((prev) => [...prev, newSubject]);
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white shadow-xs">
                <AcademicCapIcon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-bold tracking-tight text-slate-900">VITPrep</span>
                  <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-800">
                    Admin Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  Signed in as: {session?.user?.name || 'Administrator'} ({session?.user?.email})
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
        <AdminCatalog
          subjects={subjects}
          onAddSubject={handleAddSubject}
          onDeleteSubject={handleDeleteSubject}
        />
      </main>
    </div>
  );
}

