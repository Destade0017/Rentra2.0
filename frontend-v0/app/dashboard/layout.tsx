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
      <div className="flex h-screen bg-background">
        {/* Sidebar */}
        <div
          className={`fixed lg:static z-50 h-full w-64 bg-white border-r border-zinc-100 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-8">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-8 h-8 bg-zinc-950 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm leading-none">R</span>
                </div>
                <span className="text-lg font-bold text-zinc-950 tracking-tight">Rentra</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 space-y-1">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <Button
                    variant="ghost"
                    className={`w-full justify-start gap-3 rounded-lg h-10 px-4 transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-zinc-950 text-white hover:bg-zinc-900 shadow-sm'
                        : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950'
                    } ${item.disabled ? 'opacity-40 cursor-not-allowed italic' : ''}`}
                    disabled={item.disabled}
                  >
                    <span className={isActive(item.href) ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-950 transition-colors'}>
                      {item.icon}
                    </span>
                    <span className="font-medium text-sm">{item.label}</span>
                    {item.disabled && <span className="ml-auto text-[10px] uppercase font-bold tracking-widest opacity-60">Soon</span>}
                  </Button>
                </Link>
              ))}
            </nav>

            {/* Logout */}
            <div className="p-6 border-t border-zinc-50">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 rounded-lg h-10 px-4 text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium text-sm">Sign out</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
          {/* Top navbar */}
          <div className="h-16 border-b border-zinc-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-zinc-50 rounded-lg transition-colors border border-zinc-100"
            >
              <Menu className="h-5 w-5 text-zinc-600" />
            </button>

            <div className="hidden lg:flex items-center text-xs font-semibold uppercase tracking-widest text-zinc-400">
              <span className="px-2 py-1 bg-zinc-50 rounded text-zinc-500 border border-zinc-100">
                {pathname.split('/').pop() || 'Overview'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-zinc-950 leading-tight">{user?.name}</span>
                <span className="text-[10px] text-zinc-400 leading-tight uppercase font-medium">Landlord</span>
              </div>
              <div className="h-9 w-9 bg-zinc-950 rounded-full flex items-center justify-center ring-2 ring-zinc-50 ring-offset-1">
                <span className="text-white text-sm font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto p-6">
            {children}
          </div>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </AuthGuard>
  );
}
