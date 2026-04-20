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
          className={`fixed lg:static z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-border">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">R</span>
                </div>
                <span className="text-lg font-bold text-foreground">Rentra</span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} className="block">
                    <Button
                      variant={isActive(item.href) ? 'default' : 'ghost'}
                      className={`w-full justify-start gap-3 rounded-lg h-10 ${
                        isActive(item.href)
                          ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                          : 'text-foreground hover:bg-secondary'
                      } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={item.disabled}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                      {item.disabled && <span className="ml-auto text-xs">Coming</span>}
                    </Button>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 rounded-lg h-10 text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-6 right-6"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navbar */}
          <div className="h-16 border-b border-border bg-card flex items-center justify-between px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:flex items-center text-sm text-muted-foreground">
              <span className="capitalize">{pathname.split('/').pop() || 'Dashboard'}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-accent rounded-full flex items-center justify-center">
                <span className="text-accent-foreground text-sm font-medium">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">{user?.name}</span>
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
