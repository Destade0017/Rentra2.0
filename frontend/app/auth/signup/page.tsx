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

export default function SignupPage() {
  const router = useRouter();
  const setAuth = useAuth((state) => state.setAuth);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // 1. Register
      await api.post('/auth/register', {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });

      // 2. Login automatically
      const { data } = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password
      });

      setAuth(data.data, data.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      const message = err.response?.data?.message || 
                     (err.request ? 'Network Error: Check your connection and try again.' : 'Unable to create account. Please try again.');
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Create account" 
      description="Join Rentra to start managing your rental properties."
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
            or sign up with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="fullName" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Email Address
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            value={formData.email}
            onChange={handleChange}
            className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="password" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              value={formData.password}
              onChange={handleChange}
              className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
              Confirm
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all shadow-sm active:scale-[0.98] mt-2"
          disabled={loading}
        >
          {loading ? <Spinner className="h-4 w-4 text-white" /> : 'Get Started'}
        </Button>
      </form>

      <div className="relative pt-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full h-[1px] bg-zinc-100" />
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-zinc-950 hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthCard>
  );
}
