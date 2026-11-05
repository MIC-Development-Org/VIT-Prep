'use client';

import React from 'react';
import { SparklesIcon } from './icons';

interface PYQAnalysisPreviewProps {
  subjectCode: string;
}

export function PYQAnalysisPreview({ subjectCode }: PYQAnalysisPreviewProps) {
  // Realistic mock analysis data to demonstrate the Phase 2/3 AI capability
  const analysisData: Record<
    string,
    {
      topTopics: { topic: string; frequency: string; marksWeight: string }[];
      repeatedQuestions: string[];
      highYieldModule: string;
    }
  > = {
    BCSE202L: {
      highYieldModule: 'Module 2 & 3 (AVL Rotations & Dijkstra Algorithm)',
      topTopics: [
        { topic: 'AVL Tree Double Rotations (LR/RL cases)', frequency: 'Appeared in 4 of last 4 FATs', marksWeight: '12 Marks' },
        { topic: 'Dijkstra Single-Source Shortest Path Trace', frequency: 'Appeared in 3 of last 4 FATs', marksWeight: '10 Marks' },
        { topic: 'Collision Resolution via Quadratic Probing', frequency: 'Appeared in 3 of last 4 CAT-2s', marksWeight: '8 Marks' },
      ],
      repeatedQuestions: [
        '“Construct an AVL tree for elements [45, 23, 78, 12, 34, 67, 89] showing balance factors after each step.”',
        '“Compare time and space complexities of BFS and DFS using adjacency list vs matrix.”',
      ],
    },
    BCSE301L: {
      highYieldModule: 'Module 3 (Banker’s Algorithm & Semaphores)',
      topTopics: [
        { topic: "Banker's Algorithm Safety & Request Matrices", frequency: '100% frequency in CAT-2 & FAT', marksWeight: '12 Marks' },
        { topic: 'Page Replacement (Optimal vs LRU vs FIFO)', frequency: 'Appeared in 5 of last 5 FATs', marksWeight: '10 Marks' },
        { topic: 'Producer-Consumer Synchronization using Semaphores', frequency: 'Appeared in 4 of last 5 CAT-2s', marksWeight: '10 Marks' },
      ],
      repeatedQuestions: [
        '“Given Allocation, Max, and Available matrices, determine if the system is in a safe state using Banker’s Algorithm.”',
        '“Illustrate Belady’s anomaly with a reference string for FIFO page replacement.”',
      ],
    },
  };

  const current = analysisData[subjectCode] || analysisData['BCSE202L'];

  return (
    <div className="rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white p-6 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-100 pb-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-indigo-600 text-white">
            <SparklesIcon className="w-4 h-4" />
          </div>
          <span>AI PYQ Trend &amp; Frequency Analysis (PRD FR-23 Preview)</span>
        </div>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wide">
          Phase 2/3 Intelligence
        </span>
      </div>

      <div className="text-xs text-slate-600">
        Extracted from 4 semesters of verified CAT-1, CAT-2, and FAT question papers:
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {current.topTopics.map((item, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-indigo-100 bg-white p-3.5 shadow-2xs space-y-1.5"
          >
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {item.marksWeight}
              </span>
              <span className="text-emerald-700 font-mono text-[10px]">{item.frequency}</span>
            </div>
            <div className="font-bold text-slate-900 text-xs">{item.topic}</div>
          </div>
        ))}
      </div>

      {/* Repeated questions */}
      <div className="rounded-2xl bg-white/80 border border-indigo-100 p-4 space-y-2">
        <span className="text-xs font-bold text-indigo-950 block">
          Most Frequently Repeated Exam Patterns:
        </span>
        <ul className="space-y-1.5 text-xs text-slate-700 italic">
          {current.repeatedQuestions.map((q, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-indigo-500 font-bold font-sans">&bull;</span>
              <span>{q}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
