'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { GraduationCap, Lock, Mail } from 'lucide-react';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useSmartStudyStore } from '@/lib/store';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginUser, user, isLoaded } = useSmartStudyStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If the user is already logged in, send them where they were going (or dashboard)
  useEffect(() => {
    if (!isLoaded) return;
    if (user.isLoggedIn) {
      const redirect = searchParams.get('redirect');
      router.replace(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
    }
  }, [isLoaded, user.isLoggedIn, router, searchParams]);

  // Helper: navigate to the intended destination after a successful login
  const navigateAfterLogin = () => {
    const redirect = searchParams.get('redirect');
    router.push(redirect && redirect.startsWith('/') ? redirect : '/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        const name = data?.user?.user_metadata?.full_name || email.split('@')[0];
        loginUser(email, name);
      } else {
        loginUser(email);
      }

      navigateAfterLogin();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      if (!isSupabaseConfigured()) {
        setErrorMsg('Google sign-in requires Supabase to be configured. Please contact the admin.');
        setLoading(false);
        return;
      }
      // Redirect to /auth/callback which exchanges the OAuth code for a real session.
      // Pass `next` so the callback knows where to send the user after auth.
      const redirect = searchParams.get('redirect');
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const destination = redirect && redirect.startsWith('/') ? redirect : '/dashboard';
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${base}/auth/callback?next=${encodeURIComponent(destination)}`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to connect to Google';
      setErrorMsg(message);
      setLoading(false);
    }
  };

  // Show nothing while we check whether the user is already logged in
  if (!isLoaded || user.isLoggedIn) return null;

  return (
    <div className="auth-theme min-h-screen flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">Smart Study</span>
          </Link>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Welcome back</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to access your personal notes and study packs.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          {errorMsg && (
            <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {errorMsg}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs hover:border-slate-300 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center gap-3">
            <div className="border-t border-white/10 flex-1"></div>
            <span className="text-[11px] text-slate-600">or sign in with email</span>
            <div className="border-t border-white/10 flex-1"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-700 font-medium">Password</label>
                <a href="#" className="text-indigo-600 hover:underline text-[11px]">Forgot?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors"
            >
              <span>{loading ? 'Signing in…' : 'Sign in'}</span>
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <div className="text-center text-xs text-slate-500">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
            Create account
          </Link>
        </div>


      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8fafc]" />}>
      <LoginContent />
    </Suspense>
  );
}
