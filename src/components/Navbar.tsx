'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ShieldCheck, LogOut, User, LayoutDashboard, ArrowRight } from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [session, setSession] = useState<{
    authenticated: boolean;
    user?: { id: string; email: string; displayName: string };
    role?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : { authenticated: false }))
      .then((data) => setSession(data))
      .catch(() => setSession({ authenticated: false }));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession({ authenticated: false });
    router.push('/login');
  };

  const getPortalUrl = () => {
    if (!session || !session.role) return '/login';
    if (session.role === 'ADMIN') return '/admin';
    if (session.role === 'TRAINER') return '/trainer';
    return '/student';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-900 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-900/10 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                NoProxy
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 px-1.5 py-0.5 rounded">
                  SaaS
                </span>
              </span>
              <span className="text-[11px] block text-slate-600 font-medium -mt-0.5">
                Smart Attendance Management
              </span>
            </div>
          </Link>

          {/* Public Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <Link
              href="/"
              className={`hover:text-indigo-600 transition-colors ${pathname === '/' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Overview
            </Link>
            <Link
              href="/features"
              className={`hover:text-indigo-600 transition-colors ${pathname === '/features' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Anti-Proxy Features
            </Link>
            <Link
              href="/how-it-works"
              className={`hover:text-indigo-600 transition-colors ${pathname === '/how-it-works' ? 'text-indigo-600 font-bold' : ''}`}
            >
              How It Works
            </Link>
            <Link
              href="/security"
              className={`hover:text-indigo-600 transition-colors ${pathname === '/security' ? 'text-indigo-600 font-bold' : ''}`}
            >
              Security &amp; Privacy
            </Link>
          </nav>

          {/* Authentication & User Portal Status */}
          <div className="flex items-center gap-3">
            {session?.authenticated && session.user ? (
              <div className="flex items-center gap-3">
                <Link
                  href={getPortalUrl()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-indigo-900 hover:bg-indigo-950 rounded-xl shadow-sm transition-all"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-300" />
                  <span>My Portal</span>
                  <span className="text-[10px] font-mono uppercase bg-indigo-800 px-1.5 py-0.2 rounded text-indigo-200 ml-1">
                    {session.role}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 transition-colors"
                  title="Sign out of account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-indigo-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-900 hover:bg-indigo-950 rounded-xl shadow-sm transition-all hover:scale-105"
                >
                  <span>Student Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-300" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
