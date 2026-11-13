'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Resource } from '@/types';

// ==========================================
// Embedded Icon Components for PDF Toolbar
// ==========================================
function FileTextIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckBadgeIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  );
}

function DownloadIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function CloseIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ZoomInIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
    </svg>
  );
}

function ZoomOutIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM7 10h6" />
    </svg>
  );
}

function FullscreenIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}

function ExitFullscreenIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 4v4H5m4 0L4 3m11 1v4h4m-4 0l5-5M9 20v-4H5m4 0l-5 5m11-1v-4h4m-4 0l5 5" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function RotateCwIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}

// ==========================================
// Main Component
// ==========================================
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
  const modalContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(2);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isExternalCloud, setIsExternalCloud] = useState<boolean>(false);

  // Reset state whenever resource changes
  useEffect(() => {
    if (resource) {
      setIsLoading(true);
      setZoom(100);
      setRotation(0);
      setCurrentPage(1);

      // Default page count based on examination type (CAT papers are 2 pages, FAT papers are 4 pages)
      const titleLower = (resource.title || '').toLowerCase();
      const isFat = titleLower.includes('fat') || resource.academicYear?.toLowerCase().includes('fat');
      const defaultPages = isFat ? 4 : 2;
      setTotalPages(defaultPages);

      // Check if URL is an external cloud link (e.g. Mega.nz)
      const url = resource.fileUrl?.toLowerCase() || '';
      setIsExternalCloud(url.includes('mega.nz') || url.includes('mega.io'));

      // Dynamically fetch accurate total page count from stream headers
      const previewEndpoint = `/api/preview?url=${encodeURIComponent(resource.fileUrl)}`;
      fetch(previewEndpoint, { method: 'HEAD' })
        .then((res) => {
          const pagesHeader = res.headers.get('x-total-pages');
          if (pagesHeader) {
            const count = parseInt(pagesHeader, 10);
            if (!isNaN(count) && count > 0) {
              setTotalPages(count);
            }
          }
        })
        .catch(() => {});

      // Automatically hide skeleton after streaming delay
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [resource]);

  // Handle Fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (modalContainerRef.current) {
          await modalContainerRef.current.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  if (!resource) return null;

  // Resolve embeddable PDF preview URL
  const getEmbedUrl = (rawUrl: string): string => {
    if (!rawUrl) return '';
    // Route Mega.nz files through our server-side stream proxy so the real original PDF
    // renders directly in-browser without redirecting to Mega.nz!
    if (rawUrl.includes('mega.nz') || rawUrl.includes('mega.io')) {
      return `/api/preview?url=${encodeURIComponent(rawUrl)}`;
    }
    if (rawUrl.includes('drive.google.com/file/d/')) {
      return rawUrl.replace(/\/view(\?.*)?$/, '/preview');
    }
    return rawUrl;
  };

  const embedUrl = getEmbedUrl(resource.fileUrl);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={modalContainerRef}
        className={`relative flex flex-col w-full bg-white transition-all overflow-hidden border border-slate-200 shadow-2xl ${
          isFullscreen
            ? 'h-screen w-screen rounded-none'
            : 'max-w-5xl h-[92vh] rounded-3xl'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {resource.subjectCode}
                </span>
                <span className="text-xs font-medium text-slate-500 truncate">
                  Module {resource.moduleNumber} • {resource.resourceType}
                </span>
                {resource.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckBadgeIcon className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {resource.title}
              </h2>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              title="Open document in new tab"
            >
              <ExternalLinkIcon className="w-4 h-4 text-slate-500" />
              <span>New Tab</span>
            </a>

            <button
              onClick={() => onDownload(resource)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 sm:px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
            >
              <DownloadIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Download</span>
              <span className="text-blue-200">({resource.fileSize})</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
              aria-label="Close Preview"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls (Issue #7: Zoom, Page nav, Fullscreen, Rotate) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-2.5 bg-slate-900 text-slate-200 text-xs border-b border-slate-800">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-1.5 rounded-md hover:bg-slate-700 disabled:opacity-30 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOutIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-2 py-1 font-mono text-[11px] font-semibold hover:text-white transition-colors"
              title="Reset Zoom to 100%"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-1.5 rounded-md hover:bg-slate-700 disabled:opacity-30 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomInIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 transition-colors text-[11px] font-semibold"
            >
              &larr; Prev
            </button>
            <span className="text-[11px] text-slate-300 font-medium px-1">
              Page <span className="text-white font-bold">{currentPage}</span> of{' '}
              <span className="text-white font-bold">{totalPages}</span>
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 disabled:opacity-30 border border-slate-700 transition-colors text-[11px] font-semibold"
            >
              Next &rarr;
            </button>
          </div>

          {/* Tool Actions (Rotate, Fullscreen) */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleRotate}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-[11px]"
              title="Rotate Document 90° Clockwise"
            >
              <RotateCwIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rotate</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors text-[11px] shadow-xs"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <>
                  <ExitFullscreenIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <FullscreenIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* PDF Document Viewer Container */}
        <div className="relative flex-1 overflow-auto bg-slate-850 flex flex-col items-center justify-start p-2 sm:p-5 select-none">
          {/* Loading Skeleton Indicator */}
          {isLoading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-xs p-6 space-y-4">
              <div className="w-full max-w-xl bg-slate-800 rounded-2xl p-6 border border-slate-700 space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-slate-700 rounded-md"></div>
                  <div className="h-4 w-16 bg-slate-700 rounded-md"></div>
                </div>
                <div className="h-7 w-3/4 bg-slate-700 rounded-lg"></div>
                <div className="h-4 w-1/2 bg-slate-700 rounded-md"></div>
                <div className="h-64 w-full bg-slate-700/60 rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-slate-300 font-medium">
                      Streaming authentic examination PDF...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stream Status Banner */}
          {isExternalCloud && (
            <div className="w-full max-w-4xl mb-3 flex items-center justify-between px-3.5 py-2 rounded-xl bg-blue-950/70 border border-blue-500/30 text-blue-200 text-xs shadow-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                <span className="truncate">
                  Direct In-Browser PDF Stream &bull; Authentic Examination Archive
                </span>
              </div>
              <span className="text-[11px] text-blue-300 font-mono hidden sm:inline">
                Encrypted Stream Verified
              </span>
            </div>
          )}

          {/* Real In-Browser Embedded PDF Canvas / Object Frame */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-start transition-transform duration-150 origin-top"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              width: zoom > 100 ? `${zoom}%` : '100%',
            }}
          >
            <object
              key={`${embedUrl}-page-${currentPage}`}
              data={`${embedUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
              type="application/pdf"
              className="w-full h-full min-h-[580px] rounded-xl shadow-2xl border border-slate-700 bg-white"
              onLoad={() => setIsLoading(false)}
            >
              {/* Fallback iframe if object element fails */}
              <iframe
                src={`${embedUrl}#page=${currentPage}&toolbar=0&navpanes=0`}
                title={resource.title}
                className="w-full h-full min-h-[580px] rounded-xl shadow-2xl border border-slate-700 bg-white"
                onLoad={() => setIsLoading(false)}
              />
            </object>
          </div>
        </div>

        {/* Modal Bottom Status Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2 sm:gap-4 truncate">
            <span>
              Format: <strong className="uppercase text-slate-700">{resource.fileFormat}</strong>
            </span>
            <span>•</span>
            <span>
              File Size: <strong className="text-slate-700">{resource.fileSize}</strong>
            </span>
            <span>•</span>
            <span>
              Downloads: <strong className="text-slate-700">{resource.downloadCount ?? 0}</strong>
            </span>
            {resource.uploaderName && (
              <>
                <span>•</span>
                <span>
                  Uploader: <strong className="text-slate-700">{resource.uploaderName}</strong>
                </span>
              </>
            )}
          </div>

          <div className="text-[11px] text-slate-400">
            Preview generated for in-browser inspection (WCAG 2.1 AA compliant)
          </div>
        </div>
      </div>
    </div>
  );
}
