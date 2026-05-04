'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (!hasChecked.current) {
      checkAuth();
      hasChecked.current = true;
    }
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#fdfeff]">
        <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-700">
          <div className="relative">
            <div className="h-12 w-12 rounded-full border-[3px] border-indigo-50" />
            <div className="absolute inset-0 h-12 w-12 animate-spin rounded-full border-[3px] border-indigo-600 border-t-transparent" />
          </div>
          <div className="space-y-1.5 text-center">
            <p className="text-base text-slate-900 font-black tracking-tight italic">Rentra</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Initializing Workspace</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
