import React from 'react';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/8 bg-[#0a1628] text-slate-400 text-xs mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-sm bg-[#3b6fd4] flex items-center justify-center text-white">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium text-slate-300 text-sm">Smart Study</span>
          </div>

          <div className="flex items-center gap-5 text-slate-500">
            <Link href="/library" className="hover:text-slate-200 transition-colors">Library</Link>
            <Link href="/dashboard" className="hover:text-slate-200 transition-colors">Dashboard</Link>
          </div>

        </div>

        <div className="pt-4 mt-4 border-t border-white/6 text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} Smart Study. Exam answers grounded in your own lecture notes.</p>
        </div>
      </div>
    </footer>
  );
}
