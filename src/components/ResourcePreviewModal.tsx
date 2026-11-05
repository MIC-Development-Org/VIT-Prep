'use client';

import React, { useState } from 'react';
import { Resource } from '@/types';
import { CloseIcon, DownloadIcon, CheckBadgeIcon, FileTextIcon } from './icons';

interface ResourcePreviewModalProps {
  resource: Resource | null;
  onClose: () => void;
  onDownload: (resource: Resource) => void;
}

export function ResourcePreviewModal({
  resource,
  onClose,
  onDownload,
}: ResourcePreviewModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const totalPages = 8;

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {resource.subjectCode}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Module {resource.moduleNumber} • {resource.resourceType}
                </span>
                {resource.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckBadgeIcon className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-900 line-clamp-1">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(resource)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <DownloadIcon className="w-4 h-4" />
              Download ({resource.fileSize})
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex flex-col items-center">
          {/* Simulated In-Browser Document Viewer */}
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl border border-slate-200 p-8 sm:p-12 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-6">
              {/* Document Header Page */}
              <div className="border-b border-slate-200 pb-6 text-center space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  VIT Vellore / Chennai • Academic Study Material
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {resource.title}
                </h1>
                <p className="text-xs text-slate-500">
                  {resource.subjectName} ({resource.subjectCode}) • Module {resource.moduleNumber}
                </p>
                {resource.academicYear && (
                  <div className="inline-block mt-1 text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                    Examination Slot: {resource.academicYear} {resource.slot ? `(${resource.slot})` : ''}
                  </div>
                )}
              </div>

              {/* Sample Document Body Content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-serif">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-sans text-xs">
                  <span className="font-bold text-slate-900">Uploader Summary: </span>
                  {resource.description}
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900 font-sans text-sm">
                    Section {currentPage}.1: Core Concepts & Formulae
                  </h4>
                  <p>
                    In this section of Module {resource.moduleNumber}, we analyze the fundamental
                    algorithmic guarantees, time complexity bounds (O(V+E) and
                    O(N log N)), and practical implementation nuances required for
                    CAT and FAT examinations.
                  </p>
                  <div className="p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-500 text-xs font-mono text-blue-950">
                    Algorithm invariant: For all nodes u in S, d[u] equals the shortest distance from the source.
                  </div>
                  <p>
                    Refer to practice questions from standard textbooks and previous year FAT
                    papers to ensure all edge cases are addressed.
                  </p>
                </div>
              </div>
            </div>

            {/* Document Footer Controls */}
            <div className="mt-8 pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-sans">
              <span>Uploader: {resource.uploaderName} ({resource.uploaderRegNo})</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Details */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span>Format: <strong className="uppercase text-slate-700">{resource.fileFormat}</strong></span>
            <span>•</span>
            <span>File Size: <strong className="text-slate-700">{resource.fileSize}</strong></span>
            <span>•</span>
            <span>Downloads: <strong className="text-slate-700">{resource.downloadCount}</strong></span>
          </div>

          <div className="text-[11px] text-slate-400">
            Preview generated for in-browser inspection (WCAG 2.1 AA compliant)
          </div>
        </div>
      </div>
    </div>
  );
}
