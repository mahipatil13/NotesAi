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
    <header className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#0a1628]/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[#3b6fd4] flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm text-slate-100 tracking-tight">
            Smart Study
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-white/8 text-slate-100'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${
                  link.isAdmin ? 'text-amber-500' : isActive ? 'text-[#4f8ef7]' : 'text-slate-500'
                }`} />
                <span>{link.name}</span>
                {link.isPrivate && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-white/6 text-slate-400 border border-white/8">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Private</span>
                  </span>
                )}
                {link.isAdmin && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-950/60 text-amber-400 border border-amber-800/40">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Account Controls */}
        <div className="flex items-center gap-3">
          {user.isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#3b6fd4]/50"
                title={`${user.name} (${user.email})`}
                aria-label="Account details"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer ${
                  user.role === 'superadmin' ? 'bg-amber-600' : 'bg-[#3b6fd4]'
                }`}>
                  {userInitials}
                </div>
              </button>

              {/* Account Card Popover */}
              {isUserMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-68 bg-[#111f35] border border-white/10 rounded-xl shadow-2xl p-5 z-50 text-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-[11px] text-slate-500 truncate mb-3">
                    {user.email}
                  </div>

                  <div className={`relative mx-auto w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mb-3 ${
                    user.role === 'superadmin' ? 'bg-amber-600' : 'bg-[#3b6fd4]'
                  }`}>
                    {userInitials}
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 leading-tight">
                    {user.name}
                  </h3>

                  {user.role === 'superadmin' ? (
                    <div className="mt-1.5 mb-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                        <ShieldCheck className="w-3 h-3" />
                        Superadmin
                      </span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-0.5 mb-4">Student account</p>
                  )}

                  <div className="space-y-1 pt-1 border-t border-white/8">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/6 transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
                      <span>My dashboard</span>
                    </Link>

                    {user.role === 'superadmin' && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-amber-400 bg-amber-950/40 hover:bg-amber-950/60 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin console</span>
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className="w-full mt-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-white/8 hover:border-rose-800/40 text-slate-400 hover:text-rose-400 text-xs font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
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
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-white/10 text-slate-300 hover:text-slate-100 hover:border-white/20 transition-colors"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign in</span>
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-md bg-[#3b6fd4] hover:bg-[#4a7fe8] text-white transition-colors"
              >
                Get started
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden flex items-center justify-around border-t border-white/8 py-1.5 px-2 bg-[#0d1c30]">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center gap-1 text-[11px] p-1.5 rounded-md ${
                isActive ? 'text-[#4f8ef7]' : 'text-slate-500'
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
