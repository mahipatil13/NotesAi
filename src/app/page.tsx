'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard,
  FileText,
} from 'lucide-react';
import { useSmartStudyStore } from '@/lib/store';

export default function HomePage() {
  const { user, isLoaded, departments, notes } = useSmartStudyStore();
  const router = useRouter();
  const [activePreviewTab, setActivePreviewTab] = useState<'1mark' | '2mark' | '10mark'>('1mark');

  useEffect(() => {
    if (isLoaded && user.isLoggedIn) {
      router.replace('/dashboard');
    }
  }, [isLoaded, user.isLoggedIn, router]);

  const getDeptNoteCount = (deptId: string) => {
    return notes.filter(
      (n) => n.departmentId.toLowerCase() === deptId.toLowerCase() && n.status === 'APPROVED'
    ).length;
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a1628]">
        <div className="w-9 h-9 rounded-md bg-[#3b6fd4] flex items-center justify-center text-white">
          <GraduationCap className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="landing-theme min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 pb-14 border-b border-white/8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">

          <h1 className="text-3xl sm:text-[2.6rem] font-bold text-slate-100 leading-[1.18] mb-5 tracking-tight">
            Upload your lecture notes.<br />
            Get a ready-to-revise exam pack.
          </h1>

          <p className="text-base text-slate-400 max-w-xl mb-8 leading-relaxed">
            Paste or upload a PDF from your semester syllabus. Smart Study generates 1-mark definitions, 2-mark differentiations, and 10-mark model answers — each one cited to the exact page in your document.
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-3 mb-12">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#3b6fd4] hover:bg-[#4a7fe8] text-white font-medium text-sm transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Open workspace
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-white/12 text-slate-300 hover:text-slate-100 hover:border-white/22 font-medium text-sm transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Browse public library
            </Link>
          </div>

          {/* Exam Pack Preview — the most characteristic thing about this product */}
          <div className="bg-[#111f35] border border-white/8 rounded-lg overflow-hidden">
            <div className="bg-[#0d1c30] border-b border-white/8 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4f8ef7]" />
                <span className="text-xs font-semibold text-slate-200">
                  Data Structures — CS302, Unit 3: Trees
                </span>
              </div>
              <div className="flex items-center gap-1">
                {(['1mark', '2mark', '10mark'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActivePreviewTab(tab)}
                    className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                      activePreviewTab === tab
                        ? 'bg-[#3b6fd4] text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/6'
                    }`}
                  >
                    {tab === '1mark' ? '1-mark' : tab === '2mark' ? '2-mark' : '10-mark'}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5 text-xs text-slate-300 space-y-3">
              {activePreviewTab === '1mark' && (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4 pb-3 border-b border-white/6">
                    <div>
                      <p className="font-semibold text-slate-100 mb-1">Q1 — State the balance factor condition of an AVL tree.</p>
                      <p className="text-slate-400 leading-relaxed">
                        The balance factor BF(T) = h(T_L) − h(T_R) for every node must equal −1, 0, or +1.
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[#4f8ef7] bg-[#1a2e4a] px-2 py-0.5 rounded">
                      p. 12
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-100 mb-1">Q2 — Worst-case search complexity: unbalanced BST vs AVL.</p>
                      <p className="text-slate-400 leading-relaxed">
                        Unbalanced BST degrades to O(n) for skewed insertions; AVL guarantees O(log n) through rotations.
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-[#4f8ef7] bg-[#1a2e4a] px-2 py-0.5 rounded">
                      p. 15
                    </span>
                  </div>
                </div>
              )}

              {activePreviewTab === '2mark' && (
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="font-semibold text-slate-100">
                      Q — Differentiate between B-Tree and B+ Tree internal node structures.
                    </p>
                    <span className="shrink-0 text-[11px] font-medium text-[#4f8ef7] bg-[#1a2e4a] px-2 py-0.5 rounded">
                      p. 19
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400">
                    <div className="p-3 border-l-2 border-[#3b6fd4] bg-[#0d1c30]">
                      <span className="font-semibold text-slate-200 block mb-1">B-Tree</span>
                      Stores search keys with record data pointers in all internal and leaf nodes.
                    </div>
                    <div className="p-3 border-l-2 border-[#3b6fd4] bg-[#0d1c30]">
                      <span className="font-semibold text-slate-200 block mb-1">B+ Tree</span>
                      Internal nodes hold only guide keys; all record data lives in linked sequential leaves.
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === '10mark' && (
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="font-semibold text-slate-100">
                      Q — Explain the four AVL rotation algorithms with balance factor criteria and step-by-step transformations.
                    </p>
                    <span className="shrink-0 text-[11px] font-medium text-[#4f8ef7] bg-[#1a2e4a] px-2 py-0.5 rounded">
                      pp. 13–16
                    </span>
                  </div>
                  <p className="font-medium text-slate-200 mb-2">Model answer outline:</p>
                  <ul className="text-slate-400 space-y-1.5 pl-3">
                    <li className="flex gap-2"><span className="text-slate-600 shrink-0">1.</span> Identify the violation type: LL, RR, LR, or RL.</li>
                    <li className="flex gap-2"><span className="text-slate-600 shrink-0">2.</span> Single rotations — clockwise for LL, counter-clockwise for RR.</li>
                    <li className="flex gap-2"><span className="text-slate-600 shrink-0">3.</span> Double rotations for zig-zag patterns (LR and RL).</li>
                    <li className="flex gap-2"><span className="text-slate-600 shrink-0">4.</span> Before-and-after topology with recalculated balance factors.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Department Library */}
      <section className="py-14 border-b border-white/8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-7">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">
                Notes by department
              </h2>
              <p className="text-slate-500 text-sm mt-0.5">
                Student-contributed, verified lecture materials.
              </p>
            </div>
            <Link
              href="/library"
              className="text-xs font-medium text-[#4f8ef7] hover:text-[#7db0fa] transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {departments.map((dept) => {
              const count = getDeptNoteCount(dept.id);
              return (
                <Link
                  key={dept.id}
                  href={`/library?dept=${dept.id}`}
                  className="p-4 border border-white/7 bg-[#111f35] hover:border-[#3b6fd4]/40 transition-colors rounded-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#4f8ef7]">
                      {dept.code}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {count === 1 ? '1 note' : `${count} notes`}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-slate-200 mb-1 leading-snug">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {dept.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it fits university marking */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-1">
          Structured for university marking schemes
        </h2>
        <p className="text-slate-500 text-sm mb-8">
          Answers are generated to match how professors allocate marks in semester papers.
        </p>

        {/* Table-row layout instead of identical card grid */}
        <div className="border border-white/7 rounded-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr] border-b border-white/7">
            <div className="p-4 border-r border-white/7 bg-[#111f35]">
              <p className="text-sm font-semibold text-slate-100">1-mark and 2-mark questions</p>
            </div>
            <div className="p-4 bg-[#0d1c30]">
              <p className="text-sm text-slate-400 leading-relaxed">
                Definitions, single-line answers, and paired differentiations — formatted for short-answer sections where every word is marked.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] border-b border-white/7">
            <div className="p-4 border-r border-white/7 bg-[#111f35]">
              <p className="text-sm font-semibold text-slate-100">10-mark model answers</p>
            </div>
            <div className="p-4 bg-[#0d1c30]">
              <p className="text-sm text-slate-400 leading-relaxed">
                Structured outlines with numbered points, covering every sub-topic a university blueprint expects.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr] border-b border-white/7">
            <div className="p-4 border-r border-white/7 bg-[#111f35]">
              <p className="text-sm font-semibold text-slate-100">Page citations</p>
            </div>
            <div className="p-4 bg-[#0d1c30]">
              <p className="text-sm text-slate-400 leading-relaxed">
                Every answer traces back to the exact page in your uploaded document, so you can verify and cross-reference.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-[1fr_2fr]">
            <div className="p-4 border-r border-white/7 bg-[#111f35]">
              <p className="text-sm font-semibold text-slate-100">Syllabus-indexed library</p>
            </div>
            <div className="p-4 bg-[#0d1c30]">
              <p className="text-sm text-slate-400 leading-relaxed">
                Browse and contribute notes sorted by Department, Semester, and Subject code — the same structure your college uses.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
