'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AcademicCapIcon } from '@/components/icons';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const isAccessDenied = error === 'AccessDenied';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md mb-3">
          <AcademicCapIcon className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          VITPrep Authentication
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Curated &amp; Verified Course Hub &bull; AY 2026&ndash;27
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10">
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-4 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-xl">⛔</span>
              <div>
                <h3 className="text-sm font-bold text-rose-900">
                  {isAccessDenied ? 'Institutional Access Restricted' : 'Authentication Error'}
                </h3>
                <p className="mt-1 text-xs text-rose-700 leading-relaxed">
                  {isAccessDenied ? (
                    <>
                      Personal accounts (such as <strong className="font-semibold">@gmail.com</strong>) are strictly blocked per PRD FR-16.
                      You must sign in using your official VIT institutional account:
                    </>
                  ) : (
                    'An error occurred during authentication. Please try signing in again.'
                  )}
                </p>
              </div>
            </div>

            {isAccessDenied && (
              <div className="mt-3 pl-8 text-xs font-mono text-rose-800 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>@vitstudent.ac.in (Students)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>@vit.ac.in (Faculty &amp; Staff)</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Sign In with VIT Google Account
            </button>

            <Link
              href="/"
              className="w-full flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}

