'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import api from '@/lib/api';
import { Spinner } from '@/components/ui/spinner';

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

interface GoogleButtonProps {
  onError?: (msg: string) => void;
}

declare global {
  interface Window {
    google?: any;
  }
}

export function GoogleButton({ onError }: GoogleButtonProps) {
  const router = useRouter();
  const setAuth = useAuth((s) => s.setAuth);
  const [loading, setLoading] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !GOOGLE_CLIENT_ID || !divRef.current) return;

    const initGoogle = () => {
      if (!window.google) return;
      initialized.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(divRef.current!, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: divRef.current!.offsetWidth || 400,
        logo_alignment: 'left',
      });
    };

    // Load the Google Identity script if not already loaded
    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      onError?.('Google sign-in was cancelled.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/google', {
        credential: response.credential,
      });
      setAuth(data.data, data.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Google sign-in failed. Please try again.';
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex items-center justify-center h-11 w-full border border-zinc-200 rounded-lg bg-white gap-3 text-sm font-medium text-zinc-700">
          <Spinner className="h-4 w-4 text-zinc-500" />
          Signing in with Google...
        </div>
      ) : (
        <div
          ref={divRef}
          className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full"
          style={{ minHeight: '44px' }}
        />
      )}
    </div>
  );
}
