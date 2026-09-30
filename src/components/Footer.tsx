import React from 'react';
import Link from 'next/link';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-slate-500 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-slate-900 text-sm">Smart Study</span>
            <span className="text-slate-400">·</span>
            <span>Minimalist AI exam prep for engineering & college notes</span>
          </div>

          <div className="flex items-center gap-4 text-slate-600">
            <Link href="/library" className="hover:text-slate-900 transition-colors">Library</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          </div>

        </div>

        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Smart Study. Grounded in syllabus notes with page citations.</p>
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Academic honesty compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
