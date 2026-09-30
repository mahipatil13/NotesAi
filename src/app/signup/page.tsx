'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, ArrowRight, Lock, Mail, User, BookOpen } from 'lucide-react';

import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('B.Tech CSE');
  const [semester, setSemester] = useState(3);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              course,
              semester,
            },
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        // Check if session exists or confirmation email sent
        if (data?.session) {
          router.push('/dashboard');
          return;
        } else if (data?.user && !data.session) {
          setSuccessMsg('Account created! Please check your email inbox to verify your account, or sign in.');
          setLoading(false);
          return;
        }
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign up';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#f8fafc] text-slate-900 px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-slate-900">Smart Study</span>
          </Link>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Create your account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Free semester notes, exam packs, and AI practice.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          {errorMsg && (
            <div className="mb-4 p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex flex-col gap-1">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="text-left text-[11px] text-red-600 font-semibold underline hover:text-red-800"
              >
                Or continue in guest demo mode &rarr;
              </button>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
              <p className="font-semibold">{successMsg}</p>
              <Link href="/login" className="mt-2 inline-block font-semibold text-emerald-700 underline">
                Go to Sign In &rarr;
              </Link>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Mahesh Patil"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Course / Branch</label>
                <input
                  type="text"
                  required
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 font-medium"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Bottom link */}
        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}
