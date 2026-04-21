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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      <div className="flex h-screen bg-[#fafafa]">
        {/* Sidebar (Desktop Only) */}
        <div
          className={`fixed lg:static z-50 h-full w-[240px] bg-white border-r border-[#f1f1f1] transition-transform duration-300 hidden lg:block`}
        >
          <div className="flex flex-col h-full">
            <div className="p-7">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-xs">R</span>
                </div>
                <span className="text-base font-bold text-zinc-950 tracking-tight">Rentra</span>
              </Link>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 space-y-0.5">
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">Main Menu</div>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block group">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-lg h-9 px-3 transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-zinc-50 text-zinc-950 font-semibold'
                        : 'text-zinc-500 hover:bg-zinc-50/80 hover:text-zinc-950'
                    } ${item.disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                    disabled={item.disabled}
                  >
                    <span className={`transition-colors ${isActive(item.href) ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-950'}`}>
                      {item.icon}
                    </span>
                    <span className="text-[13px]">{item.label}</span>
                  </Button>
                </Link>
              ))}
            </nav>

            <div className="p-4 pt-0 border-t border-[#f8f8f8]">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 rounded-lg h-9 px-3 text-zinc-500 hover:bg-red-50/50 hover:text-red-500 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-[13px] font-medium">Log out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content wrapper */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Desktop/Mobile Header */}
          <div className="h-14 lg:h-16 border-b border-[#f1f1f1] bg-white/80 backdrop-blur-md flex items-center justify-between px-5 lg:px-10 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="lg:hidden w-7 h-7 bg-zinc-950 rounded-lg flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-[10px]">R</span>
              </div>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">Workspace</span>
                <ChevronRight className="h-3 w-3 text-zinc-300" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-950">
                  {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
                </span>
              </div>
              <span className="lg:hidden text-sm font-bold text-zinc-950 tracking-tight capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Overview'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 lg:h-9 lg:w-9 bg-zinc-100 rounded-full flex items-center justify-center ring-1 ring-zinc-200">
                <span className="text-zinc-950 text-[10px] lg:text-xs font-bold uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-24 lg:pb-10 pt-4 lg:pt-8">
            <div className="max-w-[1200px] mx-auto px-5 lg:px-10">
              {children}
            </div>
          </div>
        </div>

        {/* Mobile Bottom Navigation (Native App Style) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-[#f1f1f1] px-6 flex items-center justify-between z-50 pb-safe">
          {navItems.filter(item => !item.disabled).map((item) => (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1.5 touch-none">
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive(item.href) 
                  ? 'bg-zinc-950 text-white shadow-lg shadow-zinc-200 scale-110' 
                  : 'text-zinc-400 hover:text-zinc-950'
              }`}>
                {item.icon}
              </div>
              <span className={`text-[10px] font-bold tracking-tight transition-colors ${
                isActive(item.href) ? 'text-zinc-950' : 'text-zinc-400'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}
          <button onClick={handleLogout} className="flex flex-col items-center gap-1.5 opacity-60">
            <div className="p-2 text-zinc-400">
              <LogOut className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-zinc-400">Exit</span>
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
