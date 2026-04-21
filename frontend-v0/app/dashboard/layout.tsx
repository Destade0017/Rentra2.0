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

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  disabled?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <Home className="h-4 w-4" /> },
  { label: 'Properties', href: '/dashboard/properties', icon: <Building2 className="h-4 w-4" /> },
  { label: 'Tenants', href: '/dashboard/tenants', icon: <Users className="h-4 w-4" /> },
  { label: 'Repairs', href: '/dashboard/repairs', icon: <Wrench className="h-4 w-4" />, disabled: true },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <AuthGuard>
      <div className="flex h-screen bg-[#f8fafc]">
        {/* Sidebar (Desktop Only) */}
        <div
          className={`fixed lg:static z-50 h-full w-[260px] bg-white border-r border-slate-200/60 transition-transform duration-300 hidden lg:block`}
        >
          <div className="flex flex-col h-full">
            <div className="p-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs leading-none">R</span>
                </div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">Rentra</span>
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 space-y-1">
              <div className="px-4 mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">Workspace</div>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block group">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-xl h-10 px-4 transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-indigo-50 text-indigo-700 font-bold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                    disabled={item.disabled}
                  >
                    <span className={`transition-colors ${isActive(item.href) ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-900'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[14px] leading-none">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="p-6 border-t border-slate-50">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 rounded-xl h-10 px-4 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all font-bold text-xs uppercase tracking-widest"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top navbar */}
          <div className="h-16 border-b border-slate-200/60 bg-white flex items-center justify-between px-8 lg:px-12 sticky top-0 z-30">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="lg:hidden w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                   <span className="text-white font-bold text-[10px]">R</span>
                </div>
                <div className="hidden lg:flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">View</span>
                  <ChevronRight className="h-3 w-3 text-slate-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 capitalize">
                    {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 truncate max-w-[120px]">{user?.name || 'Landlord'}</span>
                <div className="h-6 w-6 bg-white rounded-full flex items-center justify-center border border-slate-200">
                  <span className="text-slate-900 text-[10px] font-black uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-32 lg:pb-12 pt-6 lg:pt-12">
            <div className="px-8 lg:px-12 max-w-[1200px]">
              {children}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-slate-200 px-8 flex items-center justify-between z-50 pb-safe shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
          {navItems.filter(item => !item.disabled).map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-2">
              <div className={`p-2 transition-all duration-300 ${
                isActive(item.href) 
                  ? 'text-indigo-600' 
                  : 'text-slate-300'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                isActive(item.href) ? 'text-indigo-600' : 'text-slate-300'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex flex-col items-center gap-2">
            <div className="p-2 text-slate-300">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-slate-300">Logout</span>
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
