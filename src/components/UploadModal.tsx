'use client';

import React, { useState } from 'react';
import { Subject, ResourceType, Resource, FileFormat } from '@/types';
import { CloseIcon, UploadCloudIcon, CheckBadgeIcon } from './icons';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjects: Subject[];
  initialSubjectId?: string;
  initialModuleNumber?: number;
  onUploadSuccess: (newResource: Resource) => void;
}

export function UploadModal({
  isOpen,
  onClose,
  subjects,
  initialSubjectId,
  initialModuleNumber,
  onUploadSuccess,
}: UploadModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    initialSubjectId || subjects[0]?.id || ''
  );
  const [moduleNumber, setModuleNumber] = useState<number>(initialModuleNumber || 1);
  const [resourceType, setResourceType] = useState<ResourceType>('Notes');
  const [academicYear, setAcademicYear] = useState<string>('Fall 2024-25 FAT');
  const [slot, setSlot] = useState<string>('A1 + TA1');
  const [uploaderName, setUploaderName] = useState<string>('Rohan Sharma');
  const [uploaderRegNo, setUploaderRegNo] = useState<string>('22BCE1042');
  const [uploaderEmail, setUploaderEmail] = useState<string>('rohan.sharma2022@vitstudent.ac.in');
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    format: FileFormat;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (25MB limit)
    const maxSizeBytes = 25 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError('File exceeds 25 MB limit. Please compress your PDF or choose a smaller file.');
      return;
    }

    // Determine format
    const ext = file.name.split('.').pop()?.toLowerCase();
    let format: FileFormat = 'pdf';
    if (ext === 'pptx' || ext === 'ppt') format = 'pptx';
    else if (ext === 'docx' || ext === 'doc') format = 'docx';
    else if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) format = 'image';

    const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setSelectedFile({
      name: file.name,
      size: sizeMB,
      format,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a descriptive resource title.');
      return;
    }

    if (!selectedFile) {
      setError('Please attach a study resource file (PDF, PPT, DOC, or Image).');
      return;
    }

    // Email domain check (PRD FR-16)
    if (!uploaderEmail.endsWith('@vitstudent.ac.in') && !uploaderEmail.endsWith('@vit.ac.in')) {
      setError('Upload is restricted to verified VIT accounts (@vitstudent.ac.in or @vit.ac.in).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const subject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];

      const newResource: Resource = {
        id: `res-upload-${Date.now()}`,
        title,
        description,
        subjectId: subject.id,
        subjectCode: subject.code,
        subjectName: subject.name,
        moduleNumber,
        resourceType,
        academicYear: resourceType === 'PYQ' ? academicYear : undefined,
        slot: resourceType === 'PYQ' ? slot : undefined,
        uploaderName,
        uploaderRegNo,
        uploaderEmail,
        createdAt: new Date().toISOString(),
        fileFormat: selectedFile.format,
        fileSize: selectedFile.size,
        fileUrl: `/uploads/${selectedFile.name}`,
        downloadCount: 0,
        status: 'PENDING', // PRD FR-9: Submissions enter Pending state
        isVerified: false,
      };

      onUploadSuccess(newResource);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-2xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs">
              <UploadCloudIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Upload Study Resource</h2>
              <p className="text-xs text-slate-500">
                Contributions go to Moderator Queue before publishing
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {error && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-rose-700 font-medium">
              {error}
            </div>
          )}

          {/* File Upload Zone */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Resource File (Max 25 MB: PDF, PPTX, DOCX, Images) <span className="text-rose-500">*</span>
            </label>
            <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-5 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.ppt,.pptx,.doc,.docx,.png,.jpg,.jpeg"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-emerald-700 font-semibold">
                  <CheckBadgeIcon className="w-5 h-5 text-emerald-600" />
                  <span>
                    {selectedFile.name} ({selectedFile.size})
                  </span>
                  <span className="text-xs text-blue-600 underline cursor-pointer">Change</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <UploadCloudIcon className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-700">Click to upload or drag and drop</p>
                  <p className="text-[11px] text-slate-400">PDF, PPTX, DOCX, or scanned notes images</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Resource Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Module 3 Graph Algorithms & Shortest Path Handout"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Subject Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">Subject / Course</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Module & Resource Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Module (1 to 5)</label>
              <select
                value={moduleNumber}
                onChange={(e) => setModuleNumber(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
              >
                {[1, 2, 3, 4, 5].map((m) => {
                  const modData = currentSubject?.modules.find((mod) => mod.moduleNumber === m);
                  return (
                    <option key={m} value={m}>
                      Module {m}: {modData ? modData.title : `Topic Block ${m}`}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 block">Resource Type</label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="Notes">Notes (Handwritten / Digital)</option>
                <option value="PPT">PPT / Faculty Slides</option>
                <option value="Tutorial Sheet">Tutorial Sheet</option>
                <option value="PYQ">Previous-Year Question Paper (PYQ)</option>
              </select>
            </div>
          </div>

          {/* PYQ-specific Fields */}
          {resourceType === 'PYQ' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
              <div className="space-y-1.5">
                <label className="font-semibold text-rose-900 block">Exam Term & Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="e.g. Fall 2024-25 FAT or Winter 2023-24 CAT-1"
                  className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs text-slate-900"
                />
              </div>
              <div className="space-y-1.5">
                <label className="font-semibold text-rose-900 block">Slot (Optional)</label>
                <input
                  type="text"
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  placeholder="e.g. A1 + TA1"
                  className="w-full rounded-xl border border-rose-200 bg-white p-2.5 text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 block">
              Description & Topics Covered
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly state key topics, professors covered, or solved questions included..."
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Contributor Metadata (Auth simulation) */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">Contributor Credentials</span>
              <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded font-mono">
                VIT Verified Account
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="text"
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Full Name"
                className="rounded-lg border border-slate-200 p-2 text-xs bg-white"
              />
              <input
                type="text"
                value={uploaderRegNo}
                onChange={(e) => setUploaderRegNo(e.target.value)}
                placeholder="Reg No (e.g. 22BCE1042)"
                className="rounded-lg border border-slate-200 p-2 text-xs bg-white font-mono uppercase"
              />
              <input
                type="email"
                value={uploaderEmail}
                onChange={(e) => setUploaderEmail(e.target.value)}
                placeholder="@vitstudent.ac.in"
                className="rounded-lg border border-slate-200 p-2 text-xs bg-white"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Uploading...' : 'Submit to Moderation Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
