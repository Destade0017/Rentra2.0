'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    // Synchronous check for token to speed up redirection logic
    const token = typeof window !== 'undefined' ? localStorage.getItem('rentra_token') : null;
    
    const initializeAuth = async () => {
      // Prioritize redirect if token exists (optimistic)
      if (token && !isAuthenticated) {
        // We have a token, start moving to dashboard shell immediately
        // while the background check confirms it
        router.push('/dashboard');
      }
      
      await checkAuth();
      
      if (!token) {
        router.push('/auth/login');
      }
    };

    initializeAuth();
  }, [isAuthenticated, checkAuth, router]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-white">
      <div className="relative">
        <div className="h-24 w-24 rounded-[32px] bg-indigo-50 animate-pulse border border-indigo-100 flex items-center justify-center">
          <div className="h-10 w-10 rounded-xl bg-indigo-600" />
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-48 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] animate-pulse">
            Initializing Workspace
          </p>
        </div>
      </div>
    </div>
  );
}
