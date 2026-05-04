'use client';

import React, { useState, useEffect } from 'react';
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
  Plus,
} from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { UserDropdown } from '@/components/user-dropdown';

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      try {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ['properties'],
            queryFn: async () => {
              const { data } = await api.get('/properties');
              return data.data || [];
            },
            staleTime: 5 * 60 * 1000,
          }),
          queryClient.prefetchQuery({
            queryKey: ['tenants'],
            queryFn: async () => {
              const { data } = await api.get('/tenants');
              return data.data || [];
            },
            staleTime: 5 * 60 * 1000,
          })
        ]);
      } catch (error) {
        console.error('Prefetch error:', error);
      }
    };

    if (user) {
      prefetchData();
    }
  }, [queryClient, user]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const pageTitle = (pathname || '').split('/').pop()?.replace(/-/g, ' ') || 'Dashboard';

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#fafbfc]">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[260px] bg-white border-r border-slate-200/60 h-full fixed left-0 top-0 overflow-hidden">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100 transition-transform">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">Rentra</span>
            </Link>
          </div>

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
          {/* Top Bar (Mobile-Optimized Header) */}
          <header className="h-[72px] lg:h-16 border-b border-slate-200/40 bg-white/80 backdrop-blur-md flex items-center justify-between px-5 lg:px-10 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-3.5">
              <div className="lg:hidden w-9 h-9 bg-indigo-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-indigo-100 transition-transform active:scale-95">
                <span className="text-white font-bold text-[11px]">R</span>
              </div>
              <div className="space-y-0.5">
                <h2 className="text-base lg:text-sm font-bold text-slate-900 capitalize tracking-tight leading-none">
                  {pageTitle || 'Dashboard'}
                </h2>
                <p className="lg:hidden text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Control Center</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <UserDropdown />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto lg:pt-12 pb-32 lg:pb-12 scroll-smooth">
            <div className="px-5 py-8 lg:px-10 lg:py-0 max-w-[1100px] mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Mobile Nav (Native App Bottom Tab Bar) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-[88px] bg-white border-t border-slate-100 px-4 flex items-start justify-around z-50 pt-3 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.03)] backdrop-blur-xl">
          {navItems.filter(i => i.label !== 'Settings').map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center gap-2 relative h-full">
                <div className={`p-2.5 rounded-[18px] transition-all duration-300 relative ${
                  active 
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 -translate-y-1' 
                    : 'text-slate-400 active:scale-90'
                }`}>
                  {item.icon}
                  {active && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] font-black tracking-tight transition-all uppercase duration-300 ${
                  active ? 'text-indigo-600 opacity-100 scale-110' : 'text-slate-400 opacity-70'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </AuthGuard>
  );
}
