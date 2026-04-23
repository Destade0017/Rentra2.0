'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Home,
  Building2,
  Users,
  Settings,
  LogOut,
  DollarSign,
} from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
  { label: 'Properties', href: '/dashboard/properties', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Tenants', href: '/dashboard/tenants', icon: <Users className="h-4 w-4" /> },
  { label: 'Payments', href: '/dashboard/payments', icon: <DollarSign className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#fafbfc]">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200/60 h-full fixed left-0 top-0 overflow-hidden">
          {/* Brand Header */}
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100 transition-transform">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Rentra</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="block">
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 rounded-xl h-10 px-4 transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className={`transition-colors ${isActive(item.href) ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {item.icon}
                  </div>
                  <span className="text-sm tracking-tight">{item.label}</span>
                </Button>
              </Link>
            ))}
          </nav>

          {/* User Section (Bottom) */}
          <div className="p-6 border-t border-slate-50">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 rounded-xl h-10 px-4 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all text-xs font-semibold"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
          {/* Top Bar */}
          <header className="h-16 border-b border-slate-200/40 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 lg:px-10 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-4">
              <div className="lg:hidden w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-[10px]">R</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-900 capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <span className="text-slate-900 text-[9px] font-bold">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600">{user?.name || 'Landlord'}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pt-8 lg:pt-12 pb-24">
            <div className="px-8 lg:px-10 max-w-[1100px] mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav */}
        <nav className="lg:hidden fixed bottom-4 left-4 right-4 h-14 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-2xl px-6 flex items-center justify-between z-50 shadow-lg ring-1 ring-black/5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center">
              <div className={`p-2 transition-all ${isActive(item.href) ? 'text-indigo-600' : 'text-slate-400'}`}>
                {item.icon}
              </div>
            </Link>
          ))}
          <button onClick={handleLogout} className="p-2 text-slate-400">
            <LogOut className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </AuthGuard>
  );
}
