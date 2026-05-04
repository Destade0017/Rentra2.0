'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useAuth } from '@/hooks/use-auth';
import { AuthCard } from '@/components/auth/auth-card';
import { GoogleButton } from '@/components/auth/google-button';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { data } = response.data;
      setAuth(data, data.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome back" 
      description="Sign in to your dashboard to manage your properties."
    >
      {error && (
        <Alert variant="destructive" className="bg-red-50 border-red-100 text-red-900 shadow-none py-3 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-xs font-medium">{error}</AlertDescription>
        </Alert>
      )}

      {/* Google OAuth */}
      <GoogleButton onError={(msg) => setError(msg)} />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
            or continue with email
          </span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Password
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
            disabled={loading}
          />
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all shadow-sm active:scale-[0.98]"
          disabled={loading}
        >
          {loading ? <Spinner className="h-4 w-4 text-white" /> : 'Continue'}
        </Button>
      </form>

      <div className="relative pt-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-[1px] bg-zinc-100" />
          <p className="text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-semibold text-zinc-950 hover:underline underline-offset-4">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
