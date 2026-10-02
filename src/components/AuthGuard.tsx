'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSmartStudyStore } from '@/lib/store';
import { GraduationCap, Lock, Loader2, LogIn } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PUBLIC_PATHS = ['/login', '/signup'];

export default function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isLoaded } = useSmartStudyStore();

  useEffect(() => {
    if (!isLoaded) return;

    if (!user.isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
      // Not logged in on a protected route → send to login with return destination
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (user.isLoggedIn && PUBLIC_PATHS.includes(pathname)) {
      // Already logged in but visiting /login or /signup → bounce to dashboard
      router.replace('/dashboard');
    } else if (requireAdmin && user.role !== 'superadmin') {
      router.replace('/dashboard');
    }
  }, [isLoaded, user.isLoggedIn, user.role, pathname, router, requireAdmin]);

  // If still loading store state from localStorage / Supabase session
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Verifying session security...</span>
          </div>
        </div>
      </div>
    );
  }

  // If not logged in and on a protected route
  if (!user.isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] text-slate-900 px-4">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Authentication Required</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Access restricted. You must be signed in to view Smart Study AI notes, exam packs, and study groups.
            </p>
          </div>
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href={`/login?redirect=${encodeURIComponent(pathname)}`}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Access Info</span>
            </Link>
            <Link
              href="/signup"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
