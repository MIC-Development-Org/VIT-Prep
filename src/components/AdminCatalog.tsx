'use client';

import React, { useState } from 'react';
import { Subject } from '@/types';
import { AcademicCapIcon, CloseIcon } from './icons';

interface AdminCatalogProps {
  subjects: Subject[];
  onAddSubject: (newSubject: Subject) => void;
  onDeleteSubject: (subjectId: string) => void;
}

export function AdminCatalog({
  subjects,
  onAddSubject,
  onDeleteSubject,
}: AdminCatalogProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'roles'>('catalog');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New subject state
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [semester, setSemester] = useState<number>(3);
  const [credits, setCredits] = useState<number>(4);
  const [department, setDepartment] = useState('Scope (Computer Science)');
  const [description, setDescription] = useState('');

  // Sample assigned moderators state (PRD FR-20)
  const [moderators, setModerators] = useState([
    { id: 'mod-1', name: 'Tanmay Kulkarni', regNo: '22BCSE0892', assignedSubject: 'Operating Systems (BCSE301L)' },
    { id: 'mod-2', name: 'Priya Sundaram', regNo: '21BCE0451', assignedSubject: 'Data Structures (BCSE202L)' },
    { id: 'mod-3', name: 'Kavya Raman', regNo: '22BCE2410', assignedSubject: 'DBMS (BCSE302L)' },
  ]);

  const [newModName, setNewModName] = useState('');
  const [newModRegNo, setNewModRegNo] = useState('');
  const [newModSubject, setNewModSubject] = useState(subjects[0]?.name || '');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    const newSubj: Subject = {
      id: code.toLowerCase().replace(/\s+/g, '-'),
      code: code.toUpperCase().trim(),
      name: name.trim(),
      semester,
      credits,
      department,
      description: description.trim() || 'Curriculum subject covering theory and applications.',
      modules: [
        { id: `${code}-m1`, moduleNumber: 1, title: 'Foundations & Principles', topics: ['Overview', 'Key Theorems', 'Definitions'] },
        { id: `${code}-m2`, moduleNumber: 2, title: 'Intermediate Analysis', topics: ['Algorithms', 'Models', 'Techniques'] },
        { id: `${code}-m3`, moduleNumber: 3, title: 'Core Implementations', topics: ['Core Design', 'Case Studies', 'Proofs'] },
        { id: `${code}-m4`, moduleNumber: 4, title: 'Advanced Systems', topics: ['Optimization', 'System Nuances', 'Performance'] },
        { id: `${code}-m5`, moduleNumber: 5, title: 'Applications & Emerging Trends', topics: ['Modern Standards', 'Project Scope', 'Future Topics'] },
      ],
    };

    onAddSubject(newSubj);
    setIsAddModalOpen(false);
    setCode('');
    setName('');
    setDescription('');
  };

  const handleAddModerator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModName.trim() || !newModRegNo.trim()) return;

    setModerators((prev) => [
      ...prev,
      {
        id: `mod-${Date.now()}`,
        name: newModName.trim(),
        regNo: newModRegNo.toUpperCase().trim(),
        assignedSubject: newModSubject,
      },
    ]);
    setNewModName('');
    setNewModRegNo('');
  };

  const handleRemoveModerator = (id: string) => {
    setModerators((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-700 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-700 px-3 py-1 text-xs font-semibold text-slate-300 ring-1 ring-slate-600">
              <AcademicCapIcon className="w-4 h-4 text-blue-400" />
              MIC Admin & Catalog Management (PRD FR-19 to FR-21)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Curriculum Catalog & Roles
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Create semesters, subjects, module syllabi, and assign moderator review permissions.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-all self-start sm:self-auto"
          >
            + Add New Course to Catalog
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Subject Catalog ({subjects.length})
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeTab === 'roles'
              ? 'border-purple-600 text-purple-700 bg-purple-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Moderator Role Assignments ({moderators.length})
        </button>
      </div>

      {/* TAB 1: SUBJECT CATALOG */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Course Code</th>
                    <th className="px-4 py-3">Subject Name</th>
                    <th className="px-4 py-3">Semester</th>
                    <th className="px-4 py-3">Credits</th>
                    <th className="px-4 py-3">Modules</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-blue-700">
                        {sub.code}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{sub.name}</td>
                      <td className="px-4 py-3">Semester {sub.semester}</td>
                      <td className="px-4 py-3">{sub.credits}</td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                          {sub.modules.length} modules
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onDeleteSubject(sub.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ROLES */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          {/* Add Moderator Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Assign New Moderator (PRD FR-20)</h3>
            <form onSubmit={handleAddModerator} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <input
                type="text"
                required
                placeholder="Student Name"
                value={newModName}
                onChange={(e) => setNewModName(e.target.value)}
                className="rounded-xl border border-slate-200 p-2.5"
              />
              <input
                type="text"
                required
                placeholder="Reg No (e.g. 22BCE1280)"
                value={newModRegNo}
                onChange={(e) => setNewModRegNo(e.target.value)}
                className="rounded-xl border border-slate-200 p-2.5 font-mono uppercase"
              />
              <select
                value={newModSubject}
                onChange={(e) => setNewModSubject(e.target.value)}
                className="rounded-xl border border-slate-200 p-2.5"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={`${s.name} (${s.code})`}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-purple-600 font-bold text-white px-4 py-2.5 hover:bg-purple-700 shadow-xs"
              >
                Assign Moderator Role
              </button>
            </form>
          </div>

          {/* Assigned Moderators List */}
          <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Moderator Name</th>
                    <th className="px-4 py-3">Registration No</th>
                    <th className="px-4 py-3">Assigned Domain / Subject</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {moderators.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{m.name}</td>
                      <td className="px-4 py-3 font-mono text-slate-600">{m.regNo}</td>
                      <td className="px-4 py-3 font-medium text-purple-700">{m.assignedSubject}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleRemoveModerator(m.id)}
                          className="text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Revoke Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUBJECT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Subject to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400">
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Course Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCSE304L"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full rounded-xl border p-2.5 font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={credits}
                    onChange={(e) => setCredits(Number(e.target.value))}
                    className="w-full rounded-xl border p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design and Analysis of Algorithms"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full rounded-xl border p-2.5"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={s}>
                        Semester {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border p-2.5"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief course objectives..."
                  className="w-full rounded-xl border p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
