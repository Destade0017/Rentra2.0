'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      if (!isLoading) {
        if (isAuthenticated) {
          router.push('/dashboard');
        } else {
          router.push('/auth/login');
        }
      }
    };
    initialize();
  }, [checkAuth, isAuthenticated, isLoading, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
