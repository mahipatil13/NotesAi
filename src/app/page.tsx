'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Sparkles, 
  BookOpen, 
  Upload, 
  FileText, 
  ArrowRight, 
  Award
} from 'lucide-react';
import { INITIAL_DEPARTMENTS } from '@/lib/mockData';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-16 md:pt-20 md:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Exam Preparation for College Students</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mb-5">
            Upload your notes.{' '}
            <span className="text-indigo-600">
              Turn them into an exam-ready study pack.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Instantly convert lecture PDFs into concise unit summaries, <strong>1, 2, and 10-mark university exam questions</strong>, and key formulas—all cited with source page numbers.
          </p>

          {/* Clean CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-sm mx-auto mb-14">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-sm transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Notes</span>
            </Link>
            <Link
              href="/library"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Browse Public Library</span>
            </Link>
          </div>

          {/* Crisp Example Preview */}
          <div className="border border-slate-200 bg-slate-50 rounded-xl p-4 sm:p-6 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 text-xs text-slate-500">
              <div className="flex items-center gap-2 font-mono text-slate-700 font-semibold">
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Unit 3 — PN Junction Diodes.pdf</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium text-[11px]">
                Exam Pack Generated
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-indigo-600 mb-1">Summary (Page 1-28)</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Barrier Potential & Biasing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Depletion region forms via carrier diffusion, establishing a 0.7V barrier for Silicon. Forward bias narrows this layer.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-700 mb-1">10-Mark Question</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Explain V-I characteristics</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  1. Depletion formation • 2. Forward Shockley exponential equation • 3. Reverse breakdown mechanisms.
                </p>
              </div>

              <div className="bg-white p-4 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-indigo-600 mb-1">2-Mark Definition & Formula</div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Dynamic Resistance (rd)</h4>
                <p className="text-xs text-slate-700 font-mono bg-slate-50 p-2 rounded border border-slate-200 mb-1">
                  rd = η · VT / ID = 26mV / ID
                </p>
                <p className="text-[11px] text-slate-500">
                  Reciprocal of the slope of the forward V-I characteristic curve.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Community Library Section */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1 block">
                Open Community Notes
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Browse by Department & Semester
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Access verified notes uploaded by students across all branches.
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
            {INITIAL_DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                href={`/library?dept=${dept.id}`}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 transition-all bg-white shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-slate-400">{dept.totalNotes} notes</span>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 mb-1">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {dept.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Built for Semester Exam Formats
          </h2>
          <p className="text-slate-500 text-sm">
            Everything structured to match how professors grade university answer sheets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">1, 2, and 10-Mark Questions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides short definitions for quick marks, and complete step-by-step long answers with derivations and conclusions.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Organized Community Library</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse shared notes filtered strictly by Department &rarr; Semester &rarr; Subject. Verified and open for all students.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-xs space-y-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Concise Summaries & Page Citations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Extract essential definitions, formulas, and derivations directly referenced to exact page numbers in your lecture PDFs.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
