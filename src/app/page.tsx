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
  ArrowRight,
  FileText,
  CheckCircle2,
  FileCode2
} from 'lucide-react';
import { useSmartStudyStore } from '@/lib/store';

export default function HomePage() {
  const { user, isLoaded, departments, notes } = useSmartStudyStore();
  const router = useRouter();
  const [activePreviewTab, setActivePreviewTab] = useState<'1mark' | '2mark' | '10mark'>('1mark');

  // Redirect logged-in users straight to dashboard
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

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc]">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-14 pb-12 md:pt-18 md:pb-16 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-6">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span>
              {user.name && user.name !== 'Student' && user.name !== 'Guest User'
                ? `Welcome, ${user.name.split(' ')[0]} | Academic Workspace`
                : 'Syllabus-Aligned University Exam Preparation'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
            Master your syllabus.{' '}
            <span className="text-indigo-600">
              Turn lecture notes into university exam study packs.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Upload lecture notes and get structured <strong>1-mark definitions, 2-mark conceptual differentiations</strong>, and complete <strong>10-mark long answers</strong>, cited directly with original document page numbers.
          </p>

          {/* Action Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-10">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-xs transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Workspace</span>
            </Link>
            <Link
              href="/library"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Browse Public Library</span>
            </Link>
          </div>

          {/* Live Academic Exam Pack Preview (Tangible demonstration instead of generic AI boxes) */}
          <div className="max-w-3xl mx-auto text-left bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900">
                  Sample Exam Pack: Data Structures (CS302) &bull; Unit 3 Trees
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActivePreviewTab('1mark')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    activePreviewTab === '1mark'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  1-Mark Format
                </button>
                <button
                  onClick={() => setActivePreviewTab('2mark')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    activePreviewTab === '2mark'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  2-Mark Format
                </button>
                <button
                  onClick={() => setActivePreviewTab('10mark')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                    activePreviewTab === '10mark'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  10-Mark Model Answer
                </button>
              </div>
            </div>

            <div className="p-5 text-xs text-slate-800 space-y-3">
              {activePreviewTab === '1mark' && (
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Q1: State the balance factor condition of an AVL tree.</p>
                      <p className="text-slate-600 leading-relaxed">
                        Answer: The balance factor $BF(T) = h(T_L) - h(T_R)$ for every node in the tree must strictly equal -1, 0, or +1.
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Page 12
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Q2: What is the worst-case search complexity in an unbalanced BST vs AVL?</p>
                      <p className="text-slate-600 leading-relaxed">
                        Answer: Unbalanced BST degrades to $O(n)$ for skewed insertions, while AVL tree guarantees $O(\log n)$ through rotations.
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      Page 15
                    </span>
                  </div>
                </div>
              )}

              {activePreviewTab === '2mark' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-slate-900">
                        Q: Differentiate between B-Tree and B+ Tree internal node structures.
                      </p>
                      <span className="shrink-0 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Page 19
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700 pt-1">
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="font-bold block text-slate-900 mb-0.5">B-Tree:</span>
                        Stores search keys along with actual record data pointers in all internal and leaf nodes.
                      </div>
                      <div className="p-2 rounded bg-white border border-slate-200">
                        <span className="font-bold block text-slate-900 mb-0.5">B+ Tree:</span>
                        Internal nodes only contain indexing guide keys; all actual records are stored in linked sequential leaves.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activePreviewTab === '10mark' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          Q: Explain the four AVL rotation algorithms with balance factor criteria and step-by-step tree transformations.
                        </p>
                      </div>
                      <span className="shrink-0 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        Pages 13–16
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-1.5 pt-1">
                      <p className="font-semibold text-slate-800">University Model Answer Blueprint:</p>
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>1. Identification Criteria:</strong> Left-Left (LL), Right-Right (RR), Left-Right (LR), Right-Left (RL) violations.</li>
                        <li><strong>2. Single Rotations:</strong> Clockwise rotation around pivot for LL; Counter-clockwise for RR.</li>
                        <li><strong>3. Double Rotations:</strong> Two-phase rotation strategy for zig-zag imbalances (LR and RL).</li>
                        <li><strong>4. Evaluation Diagram:</strong> Before-and-after tree topology with recalculated balance factors.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Community Library Section */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold text-indigo-600 mb-1">
                Open Community Notes
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Browse by Department & Semester
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Access verified notes uploaded by students across engineering branches.
              </p>
            </div>
            <Link
              href="/library"
              className="mt-3 sm:mt-0 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View full library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {departments.map((dept) => {
              const count = getDeptNoteCount(dept.id);
              return (
                <Link
                  key={dept.id}
                  href={`/library?dept=${dept.id}`}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all bg-white shadow-2xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {count === 1 ? '1 note' : `${count} notes`}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-900 mb-1">
                    {dept.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {dept.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Academic Alignment Section */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Structured for University Marking Schemes
          </h2>
          <p className="text-slate-500 text-sm">
            Designed to match how university professors grade semester examination papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Mark-Tiered Questions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides concise 1-mark definitions, 2-mark differences, and comprehensive 10-mark step-by-step long answers.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Syllabus-Indexed Library</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Find and contribute lecture materials structured strictly by Department, Semester, and Subject code.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
            <FileCode2 className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Verifiable Page Citations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every summary point, formula, and question maps to the exact page number in your original lecture document.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
