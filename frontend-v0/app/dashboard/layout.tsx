'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Home,
  Building2,
  Users,
  Wrench,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { useAuth } from '@/hooks/use-auth';

const navGroups = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
    ]
  },
  {
    title: 'Management',
    items: [
      { label: 'Properties', href: '/dashboard/properties', icon: <Building2 className="h-4 w-4" /> },
      { label: 'Residents', href: '/dashboard/tenants', icon: <Users className="h-4 w-4" /> },
      { label: 'Maintenance', href: '/dashboard/repairs', icon: <Wrench className="h-4 w-4" />, disabled: true },
    ]
  },
  {
    title: 'System',
    items: [
      { label: 'Workspace Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
    ]
  }
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

  const allNavItems = navGroups.flatMap(g => g.items);

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#fdfeff]">
        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col w-[280px] bg-white border-r border-slate-200/60 h-full fixed left-0 top-0 overflow-hidden">
          {/* Brand Header */}
          <div className="p-10">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="w-9 h-9 bg-indigo-600 rounded-[12px] flex items-center justify-center shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tighter">Rentra</span>
            </Link>
          </div>

          {/* Categorized Navigation */}
          <nav className="flex-1 px-5 py-4 space-y-10 overflow-y-auto scrollbar-none">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-3">
                <p className="px-5 text-[10px] font-bold text-slate-300 uppercase tracking-[0.25em]">{group.title}</p>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href} className="block group">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-4 rounded-2xl h-11 px-5 transition-all duration-300 ${
                          isActive(item.href)
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                        } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                        disabled={item.disabled}
                      >
                        <div className={`transition-all duration-300 ${isActive(item.href) ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                          {item.icon}
                        </div>
                        <span className="text-[14px] tracking-tight">{item.label}</span>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* User Section (Bottom) */}
          <div className="p-8 border-t border-slate-50">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-4 rounded-2xl h-12 px-6 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest shrink-0"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[280px]">
          {/* Top Bar */}
          <header className="h-20 border-b border-slate-200/40 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 lg:px-12 sticky top-0 z-40 transition-all">
            <div className="flex items-center gap-6">
              <div className="lg:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <div className="hidden lg:flex items-center gap-3.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300 px-1 border-l-2 border-slate-100 ml-1">Workspace</span>
                <ChevronRight className="h-3 w-3 text-slate-200" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-600">
                  {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 items-center justify-center">
                <div className="h-5 w-5 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <span className="text-slate-900 text-[9px] font-black uppercase">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <span className="text-[11px] font-bold text-slate-500 truncate max-w-[100px]">{user?.name || 'Landlord'}</span>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto pt-10 lg:pt-16 pb-32">
            <div className="px-8 lg:px-12 max-w-[1200px] mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Thumb-Optimized Mobile Nav */}
        <nav className="lg:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[28px] px-8 flex items-center justify-between z-50 shadow-xl shadow-slate-200/50 ring-1 ring-black/5">
          {allNavItems.filter(item => !item.disabled).map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center">
              <div className={`p-2 transition-all duration-300 ${isActive(item.href) ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>
                {item.icon}
              </div>
            </Link>
          ))}
          <button onClick={handleLogout} className="p-2 text-slate-300">
            <LogOut className="h-4 w-4" />
          </button>
        </nav>
      </div>
    </AuthGuard>
  );
}
