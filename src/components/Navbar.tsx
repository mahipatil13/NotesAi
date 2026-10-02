'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  Lock,
  GraduationCap,
  ShieldCheck, 
  LogOut,
  LogIn
} from 'lucide-react';
import { useSmartStudyStore } from '@/lib/store';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logoutUser } = useSmartStudyStore();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close Google-style menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Library', href: '/library', icon: BookOpen },
    { name: 'Study Group', href: '/groups', icon: Users, isPrivate: true },
    ...(user.isLoggedIn && user.role === 'superadmin' ? [{ name: 'Superadmin', href: '/admin', icon: ShieldCheck, isAdmin: true }] : []),
  ];

  const handleSignOut = () => {
    logoutUser();
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  const userInitials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'MP';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900">
              Smart Study
            </span>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
              AI
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  link.isAdmin ? 'text-amber-600' : isActive ? 'text-indigo-600' : 'text-slate-400'
                }`} />
                <span>{link.name}</span>
                {link.isPrivate && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Private</span>
                  </span>
                )}
                {link.isAdmin && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] bg-amber-50 text-amber-700 font-bold border border-amber-200">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Top-Right Controls: Google-style Account Avatar & Sign Out */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              {/* Google-style Circular Avatar Button */}
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative rounded-full p-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 hover:ring-3 hover:ring-slate-200"
                title={`${user.name} (${user.email})`}
                aria-label="Account details"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-2xs cursor-pointer ${
                  user.role === 'superadmin' ? 'bg-amber-600' : 'bg-indigo-600'
                }`}>
                  {userInitials}
                </div>
              </button>

              {/* Google-style Minimal Account Card Popover */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-200 rounded-3xl shadow-xl p-5 z-50 text-center animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* User Email header */}
                  <div className="text-[11px] font-medium text-slate-500 truncate mb-3">
                    {user.email}
                  </div>

                  {/* Large Centered Avatar */}
                  <div className="relative mx-auto w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-sm mb-3 bg-gradient-to-tr from-indigo-600 to-indigo-500">
                    {userInitials}
                  </div>

                  {/* User Name */}
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {user.name}
                  </h3>

                  {/* Superadmin Badge */}
                  {user.role === 'superadmin' ? (
                    <div className="mt-1.5 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <ShieldCheck className="w-3 h-3 text-amber-600" />
                        Superadmin
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400 mt-0.5 mb-4">Student Account</p>
                  )}

                  {/* Action Links */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Dashboard</span>
                    </Link>

                    {user.role === 'superadmin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-full text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>Admin Console</span>
                      </Link>
                    )}

                    {/* Google-style Clean Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full mt-2 flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors shadow-2xs hover:border-slate-300"
                    >
                      <LogOut className="w-3.5 h-3.5 text-slate-400 hover:text-rose-500" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
              >
                <span>Get Started</span>
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 px-2 bg-white">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[11px] p-1.5 rounded-lg ${
                isActive ? 'text-indigo-600 font-semibold' : 'text-slate-500'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}

