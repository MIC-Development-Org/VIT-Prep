'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheckIcon } from '@/components/icons';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md mb-3">
          <ShieldCheckIcon className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Access Restricted (403)
        </h2>
        <p className="mt-1 text-xs text-slate-500 font-medium">
          Privileged Route Protection &bull; AY 2026&ndash;27
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-slate-200 sm:px-10 text-center space-y-4">
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed text-left">
            <span className="font-bold block mb-1">Insufficient Permissions</span>
            This portal is restricted to authorized <strong className="font-semibold">Moderators</strong> and <strong className="font-semibold">Admins</strong>.
            Your account is currently signed in under standard student permissions.
          </div>

          <p className="text-xs text-slate-500">
            If you are a member of the MIC Course Moderation Committee, please contact the administrator to assign review privileges to your VIT account.
          </p>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Back to Course Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

